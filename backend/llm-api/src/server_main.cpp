#include <sys/socket.h>
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <unistd.h>

using namespace std;

#define LISTEN_QUEUE 50 /* Max outstanding connection requests; listen() param */

ssize_t receive_all_client_packets(int sockfd, char* buffer, size_t length) {
    size_t total_received = 0;

    while (total_received < length) {
        ssize_t bytes_received = recv(sockfd, buffer + total_received, length - total_received, 0);

        if (bytes_received == -1) {
            perror("recv");
            return -1;
        }

        if (bytes_received == 0) {
            return total_received;  // Connection closed
        }

        total_received += bytes_received;
    }
    return total_received;
}

int main(int argc, char *argv[])
{
    if (argc != 2) {
        cout << "usage: ./llm_exec [server port]\n" << endl;
        exit(1);
    }

    int servPortNumber = stoi(argv[1]); // convert to int
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

    char *strRec;
    string recivedMessage;
    ssize_t numbytesRec;
    
    // Send

    // INFINITE LOOP FOR SERVER
    while (true)
    {
        sin_size = sizeof(struct sockaddr_in);

		if ((client_sockfd = accept(sockfd,
        (struct sockaddr *) &their_addr, &sin_size)) < 0) {
			perror("accept");
			continue;
		}

        size_t msg_size;
        numbytesRec = receive_all_client_packets(client_sockfd, reinterpret_cast<char*>(&msg_size), msg_size);

        recivedMessage.append(strRec);
    }

    // Shutdown
    close(sockfd);

    return 0;
}