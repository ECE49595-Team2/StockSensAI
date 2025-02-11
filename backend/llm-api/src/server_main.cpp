#include <sys/socket.h>
#include <iostream>
#include <bits/stdc++.h>
#include <stdio.h>
#include <netinet/in.h>
#include <unistd.h>

#include "http_helper.h"

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

    std::cout << "Recieved Request" << std::endl;

    std::string response = generateServerResponse(request);

    std::cout << response << std::endl;

    send(client_sockfd, response.c_str(), response.length(), 0);
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