#include "response_format.h"

void genericResponse(HTTPResponse *response, int code, ContentType contentType, const std::string& body)
{
    response->code = code;
    response->contentType = contentType;
    response->body = body;
}

void testGetPong(HTTPResponse *response)
{
    genericResponse(response, 200, PLAIN_TEXT, "Pong!");
}

void methodNotAllowedResponse(HTTPResponse *response)
{
    genericResponse(response, 405, PLAIN_TEXT, "Method Not Allowed");
}


void badRequestResponse(HTTPResponse *response)
{
    genericResponse(response, 400, PLAIN_TEXT, "Bad Request");
}