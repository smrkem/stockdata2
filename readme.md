# StockNewsData P.1: Scraping For Data. A static hosted React app with a Serverless backend

We can't begin the machine learning until we have data. In this first part I'll be building a small web app to scrape the web for news posts, and display them so they can be classified as either 'spam' or 'good'. The data will then be stored in an s3 bucket, ready to be processed for learning.

The app will be 'serverless'. That is to say it will communicate with our custom API, built on API Gateway and backed by a couple lambdas. We won't need a server-side framework like Flask or Rails running anywhere.

We'll use React with a typical webpack setup on our local, and by the end we'll be deploying the files so they can be hosted live on s3 and the working app accessed through any browser.  

The end goal here is to be able to amass labelled data for a text classifier. In this case, news posts from google search results labelled as either 'spam' or 'good'.

I'm thinking go to the app in a browser and put in a company name. Get back the url, title and relevant copy from each result. I should be able to review each result and click a button marking it as 'spam' or 'good'. Finally I should be able to click a button the stores my newly labelled data to s3.

That's my first user story.  


### Tools and Prerequisites
Here's everything we'll need to build the app:  
- an AWS account (free to set up)
- node and npm installed (also free)  
- python3 and pip installed  

*Note: Python and pip seems a bit weedy on windows. I wouldn't know and the python parts of this may require some fiddling.*

### Web App Overview
The app's job is pretty simple. The user enters a search query, like a company name, and gets back the 10 most recent news posts from Google. Each post can then be manually inspected and flagged as either spam or a legit post. This 'labelled' data then needs to be sent back to the API so it can be stored in s3.  

***  

**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)  
