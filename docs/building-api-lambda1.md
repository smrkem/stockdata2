**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results]  

***  

# Building the API and first Lambda  

The front-end code is at a nice place - ready to send the user's query to the API. Currently it's failing since
```
const apiUrl = 'http://not-valid-api/fj9edk90'  
```  

In order to build out the actual api, we'll use 2 AWS services: AWS API Gateway and AWS Lambda.  

### AWS

We'll log in to the AWS Console and create the new API from there. AWS is huge, and contains tons of services. A full introduction to AWS is well beyond the scope and ambition of this walkthrough - just know that while for the most part setting up AWS resources is straightforward and easy, it's entirely possible to get tripped up on certain things.  

As a basic starting point, if you're still using your root credentials to log in (the ones that you used when first creating the account) - stop now and go to IAM and create a new user. Give them AdminAccess permissions, create a password for the user to log in to the console and also give them 'programatic access' which should result in you downloading a csv file with access creds.

You'll also need to install the aws cli and configure it with the access creds downloaded above.  
```
$ pip install awscli --upgrade --user
$ aws configure  
```
At the 'configure' step just follow the prompts, accepting the defaults and providing the values from the csv when asked.  

Take note of your default region. I'll be using us-east-1, and so I want to make sure that I'm in that region for all actions in the console as well. This is another tripping point when using AWS. (To be honest I've just gotten into the habit of using us-east-1 for everything, it works well for my purposes and I don't care about a few milliseconds delay since it's not technically my closest region.)

Once you're at the point where you can log into the AWS console and use the cli tool as the same user then you're good to go.  

As a test, lets go to s3 in the console and create a bucket that we'll be using shortly. I'll call mine 'ms-stocknewsitems-demo'. Now in my terminal I can list my buckets and it should be there.  
```
$ aws s3 ls
...
2017-09-11 16:33:47 ms-stockknewsitems-demo
...
```  

If you're having trouble getting to that point just google it.  

### API Gateway  

Aws API Gateway lets us make apis in the cloud, without a server. You can tie each endpoint request to a handler, like an AWS Lambda function - which runs each time the API endpoint is called.

There's a lot more to API Gateway - I'm just getting started with it - but already it was pretty easy (and super fun) to set up the 2 request endpoints I'll need for this.  

For our 2 request endpoints, currently I'm thinking they'll look like this:  
```
GET apiUrl/stock-news-items?q=QUERY_HERE
POST apiUrl/stock-news-items
```  
where the POST body is an array of labelled newsitems. I didn't have to use GETS and POSTS to the same url - but I'm not really dealing with proper 'resources' here and this simple organization seems to make sense for now.  

In the AWS console, I go to API Gateway and create a 'New API'. I'll call mine 'stock-news-classifier-demo', put in a description, and click to create it. The API itself is created, but it doesn't have any endpoints.  

Under 'Resources', I go to 'Actions' > 'Create Resource' and I call it 'stocknews-items'. I'm not going to 'Configure as proxy', but I am definitely going to check 'Enable API Gateway CORS'.

[screenshot]

Create it. So far so good. Still no methods defined on it, so a user can't make a request, but to do that we should first create the Lambda and write the code that'll handle the request.  

### Lambda  

AWS Lambda service lets you create functions (we'll be using python) that run in the cloud in response to a trigger. That's it. So good.

The first lambda we need should take a query, and then return an array of objects. Each object has the url, the title, and the copy for the post.

So a two-parter really.  
1. query google for the top 10 results
2. for each of the 10 results, go out and scrape for title and copy  

*Note: That's actually raising some red flags and I suspect that there's probably a neat way to make this 2 different lambdas - but I'm also thinking that to keep costs down 1 request has got to be better than 2 (one to query google and another to return all results) or 11 (on to query google and another called 10x to go out and scrape a given url).*  
