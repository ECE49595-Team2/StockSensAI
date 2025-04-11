#ifndef API_HELPER_H
#define API_HELPER_H

#include <string>
#include <vector>
#include <curl/curl.h>

#include <nlohmann/json.hpp>
#include <dotenv.h>

using json = nlohmann::json;

struct StockPosition
{
    std::string ticker;
    int count;
    double percentChange;
};

// Define a constant endpoints
const std::string OPEN_ROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const std::string POLYGON_ENDPOINT = "https://api.polygon.io/v2";

// Define constant Open Router model tags
const std::string LLAMA = "meta-llama/llama-3.3-70b-instruct:free";
const std::string DEEPSEEK_R1 = "deepseek/deepseek-r1:free";
const std::string DEEPSEEK_V3 = "deepseek/deepseek-chat-v3-0324:free";

// Define a function to handle writing callbacks for CURL
size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp);

// Define a function to call external APIs
std::string callExternalApiPost(const std::string& url, const std::string& method = "GET", const std::string& body = "", const std::string& bearerKey = "");

// Define helper functions
json getPolygonNews(const std::string& ticker, const double ageLim = 0);
json getLlamaPong();
json getLlamaPrompt(const std::string& prompt, const std::string& model);
json getLlamaChat(const std::string& systemPrompt, const std::vector<json>& conversation, const std::string& model);

// Get model const string for open router selection
std::string modelSelection(const std::string& model);

// Model json trimming
std::string jsonTrim(const std::string& response);

// News analysis function
json getNewsAnalysis(const std::string& ticker, const std::string& model, const double ageLim = 0);

// Chat completion function
json getChatCompletion(const std::vector<json>& conversation, const std::string& model);

// One sentence summary function
json oneSentenceSummary(const json& positions, const std::string& model);

#endif