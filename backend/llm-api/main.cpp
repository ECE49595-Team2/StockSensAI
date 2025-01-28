#include <sys/socket.h>
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <unistd.h>

using namespace std;

#define LISTEN_QUEUE 50 /* Max outstanding connection requests; listen() param */

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

    char strRec[1000];
    string recivedMessage;
    size_t numbytesRec;
    
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

        numbytesRec = recv(client_sockfd, strRec, strlen(strRec), 0);

        recivedMessage.append(strRec);
    }

    // Shutdown
    close(sockfd);

    return 0;
}