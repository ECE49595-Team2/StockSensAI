CC=g++
CFLAGS=-std=c++17 -Wall -g -pthread

# External Libraries
EXTL=-lcurl

# The source files we use for building
ALL_SRC=$(wildcard src/*.cpp)

# The header files we use for building
ALL_INC=$(wildcard include/.)

# The name of the resulting executable
APP=build/llm_exec

custom_tests:
	$(CC) $(CFLAGS) -I $(ALL_INC) -I $(DOTENV_INC) $(ALL_SRC) $(DOTENV_SRC) $(EXTL) -o $(APP)	

clean:
	rm -f $(APP)
