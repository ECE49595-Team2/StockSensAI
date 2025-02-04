FROM gcc:latest

WORKDIR /server

COPY ./src/* /server/

RUN g++ -o main server_main.cpp

CMD ["./main"]