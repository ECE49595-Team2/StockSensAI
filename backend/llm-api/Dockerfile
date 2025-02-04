FROM gcc:latest

WORKDIR /server

COPY ./src/* /server/

# Compile
RUN g++ -o server_main server_main.cpp

# Run the server
CMD ["./server_main"]