#ifndef API_HELPER_H
#define API_HELPER_H

#include <string>
#include <vector>
#include <curl/curl.h>

#include <iostream>

#include <nlohmann/json.hpp>
#include <dotenv.h>

using json = nlohmann::json;

size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp);

std::string callExternalApiPost(const std::string& url, const std::string& body, const std::string& method);

json getPolygonNews(const std::string& ticker);

#endif