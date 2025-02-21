#include "api_helper.h"

size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp) 
{
    ((std::string*)userp)->append((char*)contents, size * nmemb);

    return size * nmemb;
}

std::string callExternalApiPost(const std::string& url, const std::string& body, const std::string& method) 
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

std::string getEnvVar(const std::string& key)
{
    char *val = getenv(key.c_str());

    // If null we return the empty string
    if (!val)
    {
        return NULL;
    }
    else
    {
        std::string(val);
    }
}

json getPolygonNews(const std::string& ticker)
{
    std::string polygonKey = getEnvVar("POLYGON_API_KEY");

    std::cout << "API KEY: " << polygonKey << std::endl;

    // Return Null if there is no proper key enviorment variable
    if (polygonKey == "")
    {
        return NULL;
    }

    // Call the get api with ticker and api key authentication
    std::string apiRes = callExternalApiPost("https://api.polygon.io/v2/reference/news?ticker=" + ticker + "&limit=10&apiKey=" + polygonKey, "", "GET");

    // Parse the Json
    json apiJson = json::parse(apiRes);

    // get the articles
    json articles = apiJson["results"];

    json responseJson;

    // Lets use a test sentiment list for our ticker symbol
    std::vector<std::string> sentiments;

    for (int i = 0; i < articles.size(); i++)
    {
        json insights = articles[i]["insights"];

        for (int j = 0; j < insights.size(); j++)
        {
            if (insights[j]["ticker"] == ticker)
            {
                sentiments.push_back(insights[j]["sentiment"]);
            }
        }
    }

    responseJson["sentiments"] = sentiments;

    return responseJson;
}