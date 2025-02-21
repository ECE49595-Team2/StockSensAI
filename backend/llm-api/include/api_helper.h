#ifndef API_HELPER_H
#define API_HELPER_H

#include <string>
#include <vector>
#include <curl/curl.h>

#include <iostream>

#include <nlohmann/json.hpp>
#include <dotenv.h>

#define OPEN_ROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

using json = nlohmann::json;

size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp);

std::string callExternalApiPost(const std::string& url, const std::string& method = "GET", const std::string& body = "", const std::string& bearerKey = "");

json getPolygonNews(const std::string& ticker);
json getLlamaPong();

#endif