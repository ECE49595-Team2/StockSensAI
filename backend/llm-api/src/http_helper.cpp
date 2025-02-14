#include "http_helper.h"

std::vector<std::string> split(const std::string& s, const std::string& del)
{
    std::vector<std::string> returnVec;
    int start, end = -1 * del.size();
    
    do 
    {
        start = end + del.size();
        end = s.find(del, start);

        returnVec.push_back(s.substr(start, end - start));
    } while (end != -1);

    return returnVec;
}

HTTPMessage parseHTTPMessage(const std::string& message)
{
    HTTPMessage returnHeader;

    if (message.find("\r\n\r\n") == std::string::npos)
    {
        returnHeader.method = "NULLFOR";
        returnHeader.path = "";
        returnHeader.body = "";
    }
    else
    {
        std::vector<std::string> hb = split(message, "\r\n\r\n");

        std::vector<std::string> header = split(hb[0], "\r\n");

        returnHeader.body = hb[1];

        std::vector<std::string> firstLine = split(header[0], " ");

        returnHeader.method = firstLine[0];
        returnHeader.path = firstLine[1];
    }

    return returnHeader;
}

std::string contentTypeToString(ContentType contentType)
{
    switch (contentType)
    {
        case PLAIN_TEXT:
            return "text/plain";
            
        case JSON:
            return "application/json";
        
        case HTML:
            return "text/html";
        
        default:
            return "err";
    }
}

std::string codeToString(int code)
{
    switch (code)
    {
        case 200:
            return "OK";
        
        case 400:
            return "Bad Request";

        case 405:
            return "Method Not Allowed";
        
        default:
            return "Uknown Error";
    }
}

std::string formHTTPFullResponse(int code, ContentType contentType, const std::string& body)
{
    return "HTTP/1.1 " + std::to_string(code) + " " + codeToString(code) + "\r\nContent-Type: " + contentTypeToString(contentType) + "\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
}