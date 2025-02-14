# LLM SERVER DOCKERFILE

# Use latest cpp container
FROM gcc:latest

# Set a working dir
WORKDIR /llm-api

# Set env port
ENV expPort=8011

# Expose working port
EXPOSE ${expPort}

# Copy over the make file
COPY ./Makefile /llm-api/Makefile

# Copy over the source code
COPY ./src/* /llm-api/src/

# Copy over the headers
COPY ./include/* /llm-api/include/

# Create build dir
RUN mkdir /llm-api/build/

# Compile
RUN make

# Run the server
ENTRYPOINT ["sh", "-c", "./build/llm_exec $expPort"]