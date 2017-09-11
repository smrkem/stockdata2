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
