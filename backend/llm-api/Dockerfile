# LLM SERVER DOCKERFILE

# Use latest cpp container
FROM gcc:latest

# Set a working dir
WORKDIR /server

# Copy over the source code
COPY ./src/* /server/

# Compile
RUN g++ -o server_main server_main.cpp

# Run the server
CMD ["./server_main"]