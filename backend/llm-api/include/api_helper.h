#ifndef API_HELPER_H
#define API_HELPER_H

#include <string>
#include <curl/curl.h>

size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp);

std::string callExternalApiPost(const std::string& url, const std::string& body, const std::string& method);

#endif