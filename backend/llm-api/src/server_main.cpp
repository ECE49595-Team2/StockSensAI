#include <sys/socket.h>
#include <iostream>
#include <bits/stdc++.h>
#include <stdio.h>
#include <netinet/in.h>
#include <unistd.h>

#include "http_helper.h"
#include "api_helper.h"
#include "response_format.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;

#define LISTEN_QUEUE 50 /* Max outstanding connection requests; listen() param */

void handle_request(int client_sockfd)
{
    char buffer[2048];
    int numbytesRec = recv(client_sockfd, buffer, sizeof(buffer), 0);

    if (numbytesRec < 0) {
        perror("recv");
        exit(1);
    }

    // Null-terminate the received data
    buffer[numbytesRec] = '\0';

    std::string request = std::string(buffer);

    std::cout << "Recieved Request of length: " << numbytesRec << std::endl;
    
    // Setup parsing
    HTTPMessage headerData;
    HTTPResponse response;

    headerData = parseHTTPMessage(request);

    if (headerData.method == "GET")
    {
        if (headerData.path == "/ping")
        {
            testGetPong(&response);
        }
        else if (headerData.path == "/testex")
        {
            std::string apiRes = callExternalApiPost("https://httpbin.org/get");
            genericResponse(&response, 200, JSON, apiRes);
        }
        else if (headerData.path == "/testopenrouterapi")
        {
            json responseJson = getLlamaPong();

            genericResponse(&response, 200, JSON, responseJson.dump());
        }
        else
        {
            badRequestResponse(&response);
        }
    }
    else if (headerData.method == "POST")
    {
        if (headerData.path == "/testjson")
        {
            try
            {
                json requestJson = json::parse(headerData.body);

                json responseJson = {
                    {"status", "success"},
                    {"received", requestJson}
                };

                genericResponse(&response, 200, JSON, responseJson.dump());
            }
            catch (const std::exception& e)
            {
                badRequestResponse(&response);
            }
        }
        else if (headerData.path == "/testjsonapi")
        {
            json apiRes = json::parse(callExternalApiPost("https://httpbin.org/get"));

            // Example extracting the ip from the test api field
            json responseJson = {
                {"status", "success"},
                {"origin-ip", apiRes["origin"].get<std::string>()}
            };

            genericResponse(&response, 200, JSON, responseJson.dump());
        }
        else if (headerData.path == "/testpolygonapi")
        {
            std::string ticker = json::parse(headerData.body)["ticker"];

            std::cout << ticker << std::endl;

            json responseJson = getPolygonNews(ticker);

            genericResponse(&response, 200, JSON, responseJson.dump());
        }
        else
        {
            badRequestResponse(&response);
        }
    }
    else if (headerData.method == "NULLFOR")
    {
        badRequestResponse(&response);
    }
    else
    {
        methodNotAllowedResponse(&response);
    }

    std::string strResponse = formHTTPFullResponse(response.code, response.contentType, response.body);

    std::cout << strResponse << std::endl;

    send(client_sockfd, strResponse.c_str(), strResponse.length(), 0);
}

int main(int argc, char *argv[])
{
    if (argc != 2) {
        std::cout << "usage: ./llm_exec [server port]\n" << std::endl;
        exit(1);
    }

    int servPortNumber = std::stoi(argv[1]); // convert to int
    int sockfd;
    int client_sockfd;
    struct sockaddr_in my_addr;
    struct sockaddr_in their_addr; /* client's address info */
    socklen_t sin_size;

    if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
		perror("socket");
		exit(1);
	}

    // Socket Values
    my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(servPortNumber);
	my_addr.sin_addr.s_addr = INADDR_ANY; /* bind to all local interfaces */
	bzero(&(my_addr.sin_zero), 8);

    // Bind
    if (bind(sockfd, (struct sockaddr *) &my_addr, sizeof(struct sockaddr)) < 0) {
		perror("bind");
		exit(1);
	}

    // Listen
    if (listen(sockfd, LISTEN_QUEUE) < 0) {
		perror("listen");
		exit(1);
	}
    
    std::cout << "Listening on port " << servPortNumber << std::endl;

    // INFINITE LOOP FOR SERVER
    while (true)
    {
        sin_size = sizeof(struct sockaddr_in);

        // Accept
		if ((client_sockfd = accept(sockfd,
        (struct sockaddr *) &their_addr, &sin_size)) < 0) {
			perror("accept");
			continue;
		}

        // Go into request handling to keep things clean
        handle_request(client_sockfd);
        
        // Close client fd
        close(client_sockfd);
    }

    // Shutdown
    close(sockfd);

    return 0;
}