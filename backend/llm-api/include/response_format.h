#ifndef RESPONSE_FORMAT_H
#define RESPONSE_FORMAT_H

#include <string>
#include "http_helper.h"

void genericResponse(HTTPResponse *response, int code, ContentType contentType, const std::string& body);

// Standard Methods
void testGetPong(HTTPResponse *response);
void methodNotAllowedResponse(HTTPResponse *response);

#endif