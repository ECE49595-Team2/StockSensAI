# LLM SERVER DOCKERFILE

# Use latest cpp container
FROM gcc:latest

# Set a working dir
WORKDIR /llm-api

# Copy over the make file
COPY ./Makefile /llm-api/Makefile

# Copy over the source code
COPY ./src/* /llm-api/src/

# Copy over the headers
COPY ./include/* /llm-api/include/

# Compile
RUN make

# Run the server
CMD ["./llm_exec"]