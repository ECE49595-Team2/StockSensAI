#ifndef API_HELPER_H
#define API_HELPER_H

#include <string>
#include <vector>
#include <curl/curl.h>

#include <nlohmann/json.hpp>
#include <dotenv.h>

using json = nlohmann::json;

// Define a constant endpoints
const std::string OPEN_ROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const std::string POLYGON_ENDPOINT = "https://api.polygon.io/v2";

const std::string LLAMA = "meta-llama/llama-3.3-70b-instruct:free";
const std::string DEEPSEEK = "deepseek/deepseek-r1:free";

// Define a function to handle writing callbacks for CURL
size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp);

// Define a function to call external APIs
std::string callExternalApiPost(const std::string& url, const std::string& method = "GET", const std::string& body = "", const std::string& bearerKey = "");

// Define helper functions
json getPolygonNews(const std::string& ticker, const double ageLim = 0);
json getLlamaPong();
json getLlamaPrompt(const std::string& prompt, const std::string& model);

// News analysis function
json getNewsAnalysis(const std::string& ticker, const std::string& model, const double ageLim = 0);

#endif