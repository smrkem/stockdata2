**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)
7. [Storing the Data](https://github.com/smrkem/stockdata2/blob/master/docs/storing-results.md)  
8. [Finishing Up](https://github.com/smrkem/stockdata2/blob/master/docs/finishing-up.md)  

***  

# Finishing up the App

Things are basically done. I can search for a company and label the most recent 'news' items as good or spam. That labelled data gets stored in s3 in a way that's pretty flexible.

At this point, I could use my app for about a week - approximately 100 queries - and I should end up with about 1000 samples. I'm not sure yet what ratio of good to spam would be ideal - so at first imma go for 500 spam and 500 good posts.

I still need to add in the url history to the news scraper and I'm noticing some other details that really need to be improved:
- occasionally queries fail due to timeout or some weird response from one of the scraped sites. Some better error-checking and feedback here would be helpful.
- a lot of garbage copy is still getting into my results and some requests aren't getting any relevant copy - the filtering needs to be more accurate.
- i still definitely want to keep an eye on lambda metrics like lambda memory usage and data filesizes.
- Some front-end reporting on the meta: url_count, current_good_posts, current_spam_posts. I'll add another endpoint to the api and update the app.

All the above I'm going to leave for future posts - I'm anxious to move on the data prepping and handling part of this project.

### Accounting for Previously Scraped Urls

My current `stocknews.meta.json` looks like:
```
$ aws s3 cp s3://ms-stockknewsitems-demo/stocknews.meta.json .
download: s3://ms-stockknewsitems-demo/stocknews.meta.json to ./stocknews.meta.json
$ cat stocknews.meta.json
{"current_good_posts": 5, "current_spam_posts": 12, "url_history": ["https://ledgergazette.com/2017/09/24/analyzing-dynatronics-corporation-dynt-and-neovasc-nvcn.html", ... , "http://www.massdevice.com/neovasc-shares-rise-tiara-transcath-mitral-valve-trial-update/","]}
```

so in my lambda_handler's `fetch_posts` method I want to do something like
```
if post link not in previous_urls:
  # scrape the url for the post
  # append the post to returned results
```

That's easy enough. I import `boto3` and set up my `bucket` object like before, add a method to read and return the meta and wrap it up by returning the meta in the response to the app.  

Here's the diff:  
- https://github.com/smrkem/stockdata2/commit/7e9e5b3643e72ecec7c734c297824de75908dfaf  
```
$ make build
$ make deploy
```

In the app's StockNews component I add to the `setResults` method a quick:
```
setResults(data) {
  console.log(data)
  ...
```
and try out that "neovasc" query again.

D'oh! The api returns an error from the lambda. I forgot to add a comma when adding the `meta` to the response :(
```
$ make build
$ make deploy
```

Let me try that again. The response comes so quick I thought there was another error, but it's actually because everything is working perfectly and there was only a single valid result. Sweet. The meta data looks good in the console - so I'll finally start displaying it in the app.

### Displaying meta in the app  
When I'm using the app, I want to be able to see at a glance:
- current number of good posts stored
- current number of spam posts stored
- total number of urls I've scraped so far

That last one will give me a good sense of how many posts scraped in this way are actually useful (if good_posts + spam_posts == total_urls then 100% are kept).

Both the lambdas should include this in their responses, so first I want to make sure they're consistent.

In both the google_news_scraper_demo and store_news_items_demo lambda handlers I update the output to include the meta:
```
output = {
    ...
    meta: {
        'current_good_posts': meta['current_good_posts'],
        'current_spam_posts': meta['current_spam_posts'],
        'total_urls': len(meta['url_history'])
    }
    ...
}
return generate_response(output)
```
and do the `make build` and `make deploy` for each.

Things look good in the app's console, and I'm getting
```
meta: {current_good_posts: 5, current_spam_posts: 12, total_urls: 20}
```
back with the query.

In the app I'll add a new component CurrentMeta:
```
import React from 'react'
import './CurrentMeta.css'

const CurrentMeta = ({meta}) => (
    <div className="current-meta">
      <div>
        <strong>Current Good:</strong>
        <span>{ meta.current_good_posts }</span>
      </div>
      <div>
        <strong>Current Spam:</strong>
        <span>{ meta.current_spam_posts }</span>
      </div>
      <div>
        <strong>Total Urls:</strong>
        <span>{ meta.total_urls }</span>
      </div>
    </div>
)

export default CurrentMeta
```

which I'll import and use in the StockNews component. I add a new property `meta` to the state, initialize it with 'x's and make sure to update it whenever I get a response.

Here's the diff:
- https://github.com/smrkem/stockdata2/commit/90a4ee27901cfa46f17ba212a810bb458d849c54  

That's it. Done!

### Some more details
A couple quick improvements.
- Better error handling in the scraper lambda so it doesn't choke on a single failed result.  
- Some minor ux like repeating the post category controls at the bottom of each post and updating the display on successful submit of post items  

Here's the diff:  
- https://github.com/smrkem/stockdata2/commit/e6b582393ac8241befaa869da870e7cea5e9dd42  


And I can't call this done until I add in some kind of authentication. I don't want anyone else using my API - potentially adding tons of useless data which gets expensive to store.

I'm going to implement a very basic API Key solution, where the user inputs the secret key on the front end. I'm nervous about this since I never see this in practice - but the api endpoints are https (ssl) and the app is only ever meant to be spun up locally, not on a publically accessible host - so I'm assuming I'm good.

### Enabling API Keys in API Gateway  
Securing my api with API Keys is a pretty straighforward process. For each method on the `stocknews-items` resource I can just go into it and toggle on "API Key Required". Simple enough.  

With this in place, the app is failing to fetch with a 403 error - nice. I can add a new API key and first test it out in code, hardcoding the key into both the Fetch API requests.  

The addition to the `fetch` calls will be pretty basic:  
```
{
  headers: {
    "X-API-KEY": "my api key here"
  },
  mode: 'cors'
}
```  

Adding new API Keys is less clear. In API Gateway > API Keys -  it's easy enough to create a new key. I autogenerate one with the name `stocknews_dev`. With the hardcoded value, requests are still getting 403 though.

Turns out in order for the API Key to be associated with an API it needs to be added to a 'Usage Plan' in API Gateway.  

I create a new usage plan for 'stocknews_dev' and attach it to dev stage of the 'stocknews-classifier-demo' API. I also add the 'stocknews_dev' API Key to it.

Now the requests pass and the app is back to working :)

Hardcoding the API Key is no good though. I can enter it on the front end and pass the value to the fetch call. If any requests come back as 403 then I'll alert the user (myself) and let them input the key again. Should be fine for my purposes. Basically every time I fire up the app to use it I'll need to input my 'stocknews_dev' AWS API Key. And I'm never, ever going to share that with anyone. Ever.

Here's the commit:  
- https://github.com/smrkem/stockdata2/commit/378ca1a1d7f0375598cc69f9f7c8b911acb437a9  
