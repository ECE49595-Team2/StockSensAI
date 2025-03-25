#include <sys/socket.h>
#include <iostream>
#include <bits/stdc++.h>
#include <stdio.h>
#include <netinet/in.h>
#include <unistd.h>
#include <pthread.h>

#include "http_helper.h"
#include "api_helper.h"
#include "response_format.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;

const int LISTEN_QUEUE_SIZE = 50;
const int BUFFER_SIZE = 2048;

void handle_get_request(HTTPMessage headerData, HTTPResponse* response)
{
    if (headerData.path == "/ping")
    {
        // Test GET pong response
        testGetPong(response);
    }
    else if (headerData.path == "/testEx")
    {
        // Call an external API
        std::string apiRes = callExternalApiPost("https://httpbin.org/get");

        // Send a generic response with the API result
        genericResponse(response, 200, JSON, apiRes);
    }
    else if (headerData.path == "/testOpenRouterApi")
    {
        json responseJson = getLlamaPong();

        genericResponse(response, 200, JSON, responseJson.dump());
    }
    else
    {
        badRequestResponse(response);
    }
}

void handle_post_request(HTTPMessage headerData, HTTPResponse* response)
{
    if (headerData.path == "/testJson")
    {
        try
        {
            // Parse the request body as JSON
            json requestJson = json::parse(headerData.body);

            // Create a response JSON
            json responseJson = {
                {"status", "success"},
                {"received", requestJson}
            };

            // Send a generic response with the response JSON
            genericResponse(response, 200, JSON, responseJson.dump());
        }
        catch (const std::exception& e)
        {
            // If there is an error parsing the request body, send a bad request response
            badRequestResponse(response);
        }
    }
    else if (headerData.path == "/testJsonApi")
    {
        // Call an external API
        std::string apiRes = callExternalApiPost("https://httpbin.org/get");

        try
        {
            // Parse the response body as JSON
            json responseJson = json::parse(apiRes);

            // Create a response JSON
            json resultJson = {
                {"status", "success"},
                {"origin-ip", responseJson["origin"].get<std::string>()}
            };

            // Send a generic response with the response JSON
            genericResponse(response, 200, JSON, resultJson.dump());
        }
        catch (const std::exception& e)
        {
            // If there is an error parsing the response body, send a bad request response
            std::cerr << "Error parsing JSON: " << e.what() << std::endl;
            badRequestResponse(response);
        }
    }
    else if (headerData.path == "/testPolygonApi")
    {
        try
        {
            // Get the ticker from the request body
            json requestJson = json::parse(headerData.body);
            std::string ticker = requestJson["ticker"].get<std::string>();

            double timeLim = 0;

            // Check if there is a time limit field in the request body
            if (requestJson.find("time_limit") != requestJson.end())
            {
                timeLim = requestJson["time_limit"].get<double>();
            }

            json responseJson = getPolygonNews(ticker, timeLim);

            genericResponse(response, 200, JSON, responseJson.dump());
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error getting ticker: " << e.what() << std::endl;
            badRequestResponse(response);
        }
    }
    else if (headerData.path == "/testLlamaPrompt")
    {
        try
        {
            // Get the prompt from the request body
            json requestJson = json::parse(headerData.body);
            std::string prompt = requestJson["prompt"].get<std::string>();
            
            std::string model = LLAMA;

            if (requestJson["model"].get<std::string>() == "DeepSeek")
            {
                model = DEEPSEEK;
            }

            std::cout << prompt << std::endl;

            json responseJson = getLlamaPrompt(prompt, model);

            genericResponse(response, 200, JSON, responseJson.dump());
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error getting prompt: " << e.what() << std::endl;
            badRequestResponse(response);
        }
    }
    else if (headerData.path == "/newsAnalysis")
    {
        try
        {
            // Get the ticker from the request body
            json requestJson = json::parse(headerData.body);
            std::string ticker = requestJson["ticker"].get<std::string>();

            double timeLim = 0;

            // Check if there is a time limit field in the request body
            if (requestJson.find("time_limit") != requestJson.end())
            {
                timeLim = requestJson["time_limit"].get<double>();
            }

            std::string model = LLAMA;

            if (requestJson.find("model") != requestJson.end() && requestJson["model"].get<std::string>() == "DeepSeek")
            {
                model = DEEPSEEK;
            }


            json responseJson = getNewsAnalysis(ticker, model, timeLim);

            genericResponse(response, 200, JSON, responseJson.dump());
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error getting analysis: " << e.what() << std::endl;
            badRequestResponse(response);
        }
    }
    else
    {
        badRequestResponse(response);
    }
}

void handle_request(int client_sockfd)
{
    // Receive request data from the client
    char buffer[BUFFER_SIZE];
    int numbytesRec = recv(client_sockfd, buffer, sizeof(buffer), 0);

    if (numbytesRec < 0) {
        // Handle error receiving data
        std::cerr << "Error receiving data" << std::endl;
        return;
    }

    // Null-terminate the received data
    buffer[numbytesRec] = '\0';

    // Convert received data to a string
    std::string request = std::string(buffer);

    // Print request length
    std::cout << "\nRecieved Request of length: " << numbytesRec << std::endl;

    // Setup parsing
    HTTPMessage headerData;
    HTTPResponse response;

    // Parse the HTTP message
    headerData = parseHTTPMessage(request);

    // Handle different HTTP methods
    if (headerData.method == "GET")
    {
        handle_get_request(headerData, &response);
    }
    else if (headerData.method == "POST")
    {
        handle_post_request(headerData, &response);
    }
    else if (headerData.method == "NULLFOR")
    {
        badRequestResponse(&response);
    }
    else
    {
        methodNotAllowedResponse(&response);
    }

    // Form the full HTTP response
    std::string strResponse = formHTTPFullResponse(response.code, response.contentType, response.body);

    // Print the response
    std::cout << strResponse << "\n" << std::endl;

    // Send the response back to the client
    if (send(client_sockfd, strResponse.c_str(), strResponse.length(), 0) < 0)
    {
        std::cerr << "\nError sending response\n" << std::endl;
    }
}

void* handle_client(void* client_sockfd_ptr)
{
    int client_sockfd = *(int*)client_sockfd_ptr;

    handle_request(client_sockfd);
    close(client_sockfd);
    delete (int*)client_sockfd_ptr;

    return NULL;
}

int main(int argc, char *argv[])
{
    // Validate the number of command line arguments
    if (argc != 2) {
        std::cout << "usage: ./llm_exec [server port]\n" << std::endl;
        return 1;
    }

    // Convert the server port number from string to integer
    int servPortNumber = std::stoi(argv[1]);

    // Declare socket variables
    int sockfd;
    int client_sockfd;
    struct sockaddr_in my_addr;
    struct sockaddr_in their_addr;
    socklen_t sin_size;
    
    // Create socket
    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    if (sockfd < 0) {
		std::cerr << "Error creating socket" << std::endl;
		return 1;
	}

    // Set up socket address
    my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(servPortNumber);
	my_addr.sin_addr.s_addr = INADDR_ANY;
	bzero(&(my_addr.sin_zero), 8);

    // Bind
    if (bind(sockfd, (struct sockaddr *) &my_addr, sizeof(struct sockaddr)) < 0) {
		std::cerr << "Error binding" << std::endl;
		return 1;
	}

    // Listen
    if (listen(sockfd, LISTEN_QUEUE_SIZE) < 0) {
		perror("listen");
        std::cerr << "Error listening for connections" << std::endl;
		return 1;
	}
    
    std::cout << "Listening on port " << servPortNumber << std::endl;

    // INFINITE LOOP FOR SERVER
    while (true)
    {
        sin_size = sizeof(struct sockaddr_in);

        // Accept
		if ((client_sockfd = accept(sockfd,
        (struct sockaddr *) &their_addr, &sin_size)) < 0) {
			std::cerr << "Error accepting connection" << std::endl;
			continue;
		}

        // DEPRICATED
        // // Go into request handling to keep things clean
        // handle_request(client_sockfd);
        
        // // Close client fd
        // close(client_sockfd);

        // Create a new thread to handle the client
        int* client_sockfd_ptr = new int(client_sockfd);
        pthread_t thread;
        pthread_create(&thread, NULL, handle_client, client_sockfd_ptr);

        // Detach the thread so it runs independently
        pthread_detach(thread);
    }

    // Shutdown
    close(sockfd);

    return 0;
}