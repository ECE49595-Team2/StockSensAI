#include "api_helper.h"

size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp) 
{
    ((std::string*)userp)->append((char*)contents, size * nmemb);

    return size * nmemb;
}

std::string callExternalApiPost(const std::string& url, const std::string& method, const std::string& body, const std::string& bearerKey) 
{
    CURL *curl;
    CURLcode res;
    std::string readBuffer;
    
    // Initialize libcurl
    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    
    if (curl) 
    {
        // Set the URL of the API endpoint you want to call
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        
        if (method == "POST")
        {
            // Set the request method to POST
            curl_easy_setopt(curl, CURLOPT_POST, 1L);

            // Set the body data (the data you want to send in the POST request)
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        }

        // Set the Content-Type header to indicate the type of the body
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        // adjust for key
        if (bearerKey != "")
        {
            std::string keyPhrase = "Authorization: Bearer " + bearerKey;
            headers = curl_slist_append(headers, keyPhrase.c_str());
        }

        // Add the headers to the request
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        
        // Specify that the callback function should handle the response
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        
        // Perform the request
        res = curl_easy_perform(curl);
        
        // Check if the request was successful
        if (res != CURLE_OK) 
        {
            //error
            //std::cout << "ERROR: " << curl_easy_strerror(res) << std::endl;

            return NULL;
        }
        else 
        {
            // Print the response from the API
            //std::cout << "Response from API: " << readBuffer << std::endl;
        }

        // Cleanup
        curl_easy_cleanup(curl);
    }
    
    // Global cleanup
    curl_global_cleanup();

    return readBuffer;
}

json getPolygonNews(const std::string& ticker, const double ageLim)
{
    dotenv::init();

    // Get the key using dotenv
    std::string polygonKey = getenv("POLYGON_API_KEY");

    // Return Null if there is no proper key enviorment variable
    if (polygonKey == "")
    {
        return NULL;
    }

    // Call the get api with ticker and api key authentication
    std::string apiRes = callExternalApiPost(POLYGON_ENDPOINT + "/reference/news?ticker=" + ticker + "&limit=15&apiKey=" + polygonKey);

    // Parse the Json
    json apiJson = json::parse(apiRes);

    // Get the articles
    json articles = apiJson["results"];

    // Initialize a JSON object to hold the formatted articles
    json responseJson;

    // Initialize an array to hold individual article details
    std::vector<json> articlesInfo;

    // Iterate through each article in the result set
    for (size_t i = 0; i < articles.size(); i++)
    {
        // Extract the current article
        json article = articles[i];

        // Initialize a JSON object to hold the current article details
        json articleInfo;

        // Calculate the age of the article
        time_t now = time(0);
        tm* publishedTime = new tm();
        strptime(article["published_utc"].get<std::string>().c_str(), "%Y-%m-%dT%H:%M:%S.%fZ", publishedTime);

        // Force the timezone to UTC
        publishedTime->tm_isdst = 0;
        time_t publishedTimeUnix = timegm(publishedTime);
        double ageInSeconds = difftime(now, publishedTimeUnix);

        // Check if the age of the article is within the specified limit (if any)
        if (!ageLim || ageInSeconds <= ageLim)
        {
            // Add relevant info
            articleInfo["title"] = article["title"];
            articleInfo["summary"] = article["description"];
            articleInfo["url"] = article["article_url"];
            articleInfo["time"] = article["published_utc"];
            articleInfo["age"] = ageInSeconds;

            json insights = article["insights"];
    
            // Iterate through the article insights to find the sentiment associated with the given ticker
            for (size_t j = 0; j < insights.size(); j++)
            {
                // Check if the insight's ticker matches the provided ticker
                if (insights[j]["ticker"] == ticker)
                {
                    // Add the sentiment and reasoning to the articleInfo object
                    articleInfo["sentiment"] = insights[j]["sentiment"];
                    articleInfo["sentiment_reasoning"] = insights[j]["sentiment_reasoning"];
                }
            }
    
            // Add the articleInfo object to the articlesInfo array
            articlesInfo.push_back(articleInfo);
        }
    }

    // Add the articlesInfo array to the responseJson object
    responseJson["articles"] = articlesInfo;

    return responseJson;
}

json getLlamaPong()
{
    dotenv::init();

    // Get the key using dotenv
    std::string openRouterKey = getenv("OPEN_ROUTER_API_KEY");

    // Return Null if there is no proper key enviorment variable
    if (openRouterKey == "")
    {
        return NULL;
    }

    // this is a test string properly formatted in json
    std::string pingJsonString = "{\"model\":\"meta-llama/llama-3.3-70b-instruct:free\",\"messages\":[{\"role\":\"user\",\"content\":\"WhatisacommonphrasethatisafterPing?\"}]}";

    // Call the get api with ticker and api key authentication
    std::string apiRes = callExternalApiPost(OPEN_ROUTER_ENDPOINT, "POST", pingJsonString, openRouterKey);

    // Parse the Json
    json apiJson = json::parse(apiRes);

    json responseJson = {
        {"status", "success"},
        {"response", apiJson["choices"][0]["message"]["content"]}
    };

    return responseJson;
}

json getLlamaPrompt(const std::string& prompt, const std::string& model)
{
    dotenv::init();

    // Get the key using dotenv
    std::string openRouterKey = getenv("OPEN_ROUTER_API_KEY");

    // Return Null if there is no proper key enviorment variable
    if (openRouterKey == "")
    {
        return NULL;
    }

    // Initialize OpenRouter API call body content
    json jsonPrompt;
    jsonPrompt["model"] = model;
    json message;
    message["role"] = "user";
    message["content"] = prompt;
    jsonPrompt["messages"].push_back(message);

    // Create a json string properly formatted with the prompt
    std::string jsonPromptString = jsonPrompt.dump();

    // Call the get api with the prompt and api key authentication
    std::string apiRes = callExternalApiPost(OPEN_ROUTER_ENDPOINT, "POST", jsonPromptString, openRouterKey);

    // Parse the Json
    json apiJson = json::parse(apiRes);

    json responseJson = {
        {"status", "success"},
        {"response", apiJson["choices"][0]["message"]["content"]}
    };

    return responseJson;
}

json getLlamaChat(const std::string& systemPrompt, const std::vector<json>& conversation, const std::string& model)
{
    dotenv::init();

    // Get the key using dotenv
    std::string openRouterKey = getenv("OPEN_ROUTER_API_KEY");

    // Return Null if there is no proper key enviorment variable
    if (openRouterKey == "")
    {
        return NULL;
    }

    // Initialize OpenRouter API call body content
    json jsonPrompt;
    jsonPrompt["model"] = model;
    json message;
    message["role"] = "system";
    message["content"] = systemPrompt;
    jsonPrompt["messages"].push_back(message);

    // push the whole conversation to the messages now
    for (size_t i = 0; i < conversation.size(); i++)
    {
        jsonPrompt["messages"].push_back(conversation[i]);
    }

    // Create a json string properly formatted with the prompt
    std::string jsonPromptString = jsonPrompt.dump();

    // Call the get api with the prompt and api key authentication
    std::string apiRes = callExternalApiPost(OPEN_ROUTER_ENDPOINT, "POST", jsonPromptString, openRouterKey);

    //std::cout << apiRes << std::endl;

    // Parse the Json
    json apiJson = json::parse(apiRes);

    json responseJson = {
        {"status", "success"},
        {"response", apiJson["choices"][0]["message"]["content"]}
    };

    return responseJson;
}

std::string modelSelection(const std::string& model)
{
    if (model == "DeepSeekR1")
    {
        return DEEPSEEK_R1;
    }
    else if (model == "DeepSeekV3")
    {
        return DEEPSEEK_V3;
    }

    return LLAMA;
}

std::string jsonTrim(const std::string& response)
{
    if (response.size() == 0)
    {
        return response;
    }

    size_t startIdx = response.find('{');
    size_t endIdx = response.find_last_of('}');

    return response.substr(startIdx, (endIdx - startIdx) + 1);
}

json getNewsAnalysis(const std::string& ticker, const std::string& model, const double ageLim)
{
    // Get initial article info
    json articlesJson = getPolygonNews(ticker, ageLim);

    json promptArticleJson;

    promptArticleJson["sentiment_counts"]["positive"] = 0;
    promptArticleJson["sentiment_counts"]["negative"] = 0;
    promptArticleJson["sentiment_counts"]["neutral"] = 0;

    std::vector<json> articlesInfo;

    // Format and injest all the articles
    for (size_t i = 0; i < articlesJson["articles"].size(); i++)
    {
        json articleInfo;

        articleInfo["article"] = articlesJson["articles"][i]["title"];
        articleInfo["sentiment"] = articlesJson["articles"][i]["sentiment"];
        articleInfo["sentiment_reasoning"] = articlesJson["articles"][i]["sentiment_reasoning"];
        articleInfo["summary"] = articlesJson["articles"][i]["summary"];

        // Increment the sentiment counts based on the article's sentiment
        if (articleInfo["sentiment"] == "positive") 
        {
            promptArticleJson["sentiment_counts"]["positive"] = promptArticleJson["sentiment_counts"]["positive"].get<int>() + 1;
        }
        else if (articleInfo["sentiment"] == "negative") 
        {
            promptArticleJson["sentiment_counts"]["negative"] = promptArticleJson["sentiment_counts"]["negative"].get<int>() + 1;
        }
        else if (articleInfo["sentiment"] == "neutral") 
        {
            promptArticleJson["sentiment_counts"]["neutral"] = promptArticleJson["sentiment_counts"]["neutral"].get<int>() + 1;
        }

        // Calculate the age of the article in a human-readable format
        double ageInSeconds = articlesJson["articles"][i]["age"].get<double>();
        int seconds = int(ageInSeconds);
        int minutes = seconds / 60;
        int hours = minutes / 60;
        int days = hours / 24;

        // Create an age string that includes seconds, minutes, hours, etc
        std::string ageString;

        if (days > 0) 
        {
            ageString = std::to_string(days) + " days, ";
        }
        if (hours > 0) 
        {
            ageString += std::to_string(hours % 24) + " hours, ";
        }
        if (minutes > 0) 
        {
            ageString += std::to_string(minutes % 60) + " minutes, ";
        }

        ageString += std::to_string(seconds % 60) + " seconds";

        // Add the age string to the promptArticleJson object
        articleInfo["age"] = ageString;

        // Add the articleInfo object to the articlesInfo array
        articlesInfo.push_back(articleInfo);
    }

    promptArticleJson["articles"] = articlesInfo;

    json promptFormatJson = {
        {"action", "ENTER:buy/sell/hold"},
        {"reasoning", "ADD A SUMMARY OF YOUR REASONING"}
    };

    // Generate the test prompt
    std::string prompt = "You are an expert investor. Analyze this article json with recent news about the stock ticker ";
    prompt += ticker + ":\n";
    prompt += promptArticleJson.dump();
    prompt += "\n\n";
    prompt += "Your format will PURELY be in json using this template (no extra info outside of json notation):\n";
    prompt += promptFormatJson.dump();

    json responseLlama;
    bool improperResponse = true;

    while (improperResponse)
    {
        json testPrompt = getLlamaPrompt(prompt, model);

        //std::cout << testPrompt["response"].get<std::string>() << std::endl;
        //std::cout << "TRIMMED: " << jsonTrim(testPrompt["response"].get<std::string>()) << std::endl;

        try
        {
            responseLlama = json::parse(jsonTrim(testPrompt["response"].get<std::string>()));

            //std::cout << responseLlama << std::endl;

            if (!responseLlama.empty())
            {
                // Check if the response contains the expected action and reasoning
                std::string action = responseLlama["action"].get<std::string>();
                std::string reasoning = responseLlama["reasoning"].get<std::string>();

                // Check if the action is one of the expected values
                if (action == "buy" || action == "sell" || action == "hold")
                {
                    improperResponse = false;  
                }
            }
        }
        catch (const json::exception& e)
        {
            std::cerr << "Json response from Llama Invalid Retrying..." << std::endl;
        }
    }

    // Format the response json
    json responseJson = {
        {"action", responseLlama["action"].get<std::string>()},
        {"reasoning", responseLlama["reasoning"].get<std::string>()},
        {"source_data", promptArticleJson}
    };

    return responseJson;
}

json getChatCompletion(const std::vector<json>& conversation, const std::string& model)
{
    // Layout the system prompt response format
    json systemPromptFormatJson = {
        {"response", "CHAT RESPONSE TO THE PREVIOUS USER MESSAGE"},
        {"news_analysis", "TO CHECK NEWS ON A STOCK IF NEEDED ENTER: yes/no"},
        {"ticker", "TICKER SYMBOL FOR NEWS ANALYSIS ENTER \"NULL\" IF NEWS_ANALYSIS IS NO"}
    };

    // Generate the system prompt
    std::string systemPrompt = "You are an expert investor that chats and gives advice to the user. Assume that all current news about a stock is derived from the information extracted by the news analysis function. In other words, give useful information about a stock, just not hard current facts (that is assumed to come from the news analysis function).";
    systemPrompt += "\n\n";
    systemPrompt += "Your format will PURELY be in json using this template (no extra info outside of json notation):\n";
    systemPrompt += systemPromptFormatJson.dump();

    std::string action;
    std::string ticker;
    std::string response;
    bool improperResponse = true;

    // Check for a proper response using a while loop that sanitizes formatting
    while (improperResponse)
    {
        json testPrompt = getLlamaChat(systemPrompt, conversation, model);

        //std::cout << testPrompt << std::endl;

        try
        {
            //std::cout << "TRIMMED CHAT: " << jsonTrim(testPrompt["response"].get<std::string>()) << std::endl;

            json responseLlama = json::parse(jsonTrim(testPrompt["response"].get<std::string>()));

            if (!responseLlama.empty())
            {
                // Check if the response contains the expected action and reasoning
                action = responseLlama["news_analysis"].get<std::string>();
                ticker = responseLlama["ticker"].get<std::string>();
                response = responseLlama["response"].get<std::string>();

                // Check if the action is one of the expected values
                if (action == "yes" || action == "no")
                {
                    improperResponse = false;
                }
            }
        }
        catch (const json::exception& e)
        {
            std::cerr << "Json response from Llama Chat Invalid Retrying..." << std::endl;
        }
    }

    // Format the response json
    json responseJson = {
        {"response", response}
    };

    json analysis = NULL;

    if (action == "yes")
    {
        analysis = getNewsAnalysis(ticker, model);

        responseJson["analysis"] = analysis;
    }

    return responseJson;
}

json oneSentenceSummary(const json& positions, const std::string& model)
{
    // Layout the system prompt response format
    json systemPromptFormatJson = {
        {"response", "ONE TO TWO SENTENCE SUMMARY OF THE PORTFOLIO"}
    };

    // Generate the system prompt
    std::string systemPrompt = "You are an expert investor that summarizes a json input of user stocks [{ticker, count, day gain percentage}]. Give a 1-2 sentence summary of the state of the portfolio today.";
    systemPrompt += "\n\n";
    systemPrompt += "Your format will PURELY be in json using this template (no extra info outside of json notation):\n";
    systemPrompt += systemPromptFormatJson.dump();

    std::vector<json> conversation;
    
    conversation.push_back({
        {"role", "user"},
        {"content", positions.dump()}
    });

    std::string response;
    bool improperResponse = true;

    // Check for a proper response using a while loop that sanitizes formatting
    while (improperResponse)
    {
        json testPrompt = getLlamaChat(systemPrompt, conversation, model);

        std::cout << testPrompt << std::endl;

        try
        {
            std::cout << "TRIMMED CHAT: " << jsonTrim(testPrompt["response"].get<std::string>()) << std::endl;

            json responseLlama = json::parse(jsonTrim(testPrompt["response"].get<std::string>()));

            if (!responseLlama.empty())
            {
                // Check if the response contains the expected action and reasoning
                response = responseLlama["response"].get<std::string>();

                improperResponse = false;
            }
        }
        catch (const json::exception& e)
        {
            std::cerr << "Json response from Llama Chat Invalid Retrying..." << std::endl;
        }
    }

    // Format the response json
    json responseJson = {
        {"response", response}
    };

    return responseJson;
}