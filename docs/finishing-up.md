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
