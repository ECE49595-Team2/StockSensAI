FROM gcc:latest

WORKDIR /server

COPY ./src/* /server/

RUN g++ -o server_main server_main.cpp

# Run the server
CMD ["./server_main"]