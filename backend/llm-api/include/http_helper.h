#ifndef HTTP_HELPER_H
#define HTTP_HELPER_H

#include <string>
#include <vector>

enum ContentType
{
    PLAIN_TEXT,
    JSON,
    HTML
};

struct HTTPMessage
{
    std::string method;
    std::string path;
    std::string body;
};

struct HTTPResponse
{
    int code;
    ContentType contentType;
    std::string body;
};

std::vector<std::string> split(std::string& s, std::string& del);

HTTPMessage parseHTTPMessage(std::string& message);

std::string contentTypeToString(ContentType contentType);
std::string codeToString(int code);

// Standard Methods
void testGetPongResponse(HTTPResponse *response);
void methodNotAllowedResponse(HTTPResponse *response);

std::string formHTTPFullResponse(int code, ContentType contentType, const std::string& body);

std::string generateServerResponse(const std::string &request);

#endif