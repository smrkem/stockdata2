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

## The google-news-scraper Lambda  

AWS Lambda service lets you create functions (we'll be using python) that run in the cloud in response to a trigger. That's it. Sooo good.

The first lambda we need should take the user's query (the company name they want to search), and then return an array of 10 post objects. Each object has the url, the title, and the copy for the post.

So a two-parter really.  
1. query google for the top 10 results
2. for each of the 10 results, go out and scrape for title and copy  

*Note: That's actually raising some red flags and I suspect that there's probably a neat way to make this 2 different lambdas - but I'm also thinking that to keep costs down 1 request has got to be better than 2 (one to query google and another to return all results) or 11 (on to query google and another called 10x to go out and scrape a given url). I'm still experimenting with AWS's pricing models :)*  

We'll be creating a couple lambdas for this project, and a good Lambda workflow seems like something worth spending a little time on up front.

### Setting up a lambda workflow

My current workflow for dealing with python lambdas is to set up a local virtual environment and install any packages my lambda needs in there. If the following commands are new to you, then you want to google "python virtual environments" and do a tutorial before moving on.
```
$ python3 -m venv venv
$ . venv/bin/activate
```  

When it's time to deploy my code to lambda, I add the packages to my source code and zip it up, ready to be deployed as a single package to lambda. We'll also be adding a Makefile to make all this stuff quick and easy. In the codebase, each lambda will live in it's own folder inside the 'lambdas' folder. The folder name should match the name used to create the lambda.

In the console I create a new 'google_news_scraper_demo' lambda, using python 3.6 and the default code. I'm not setting up any triggers for it at this point.  

I leave the Handler as the default 'lambda_function.lambda_handler' and for the role I pick "Create a new role from template". I'll name this new role 'google_news_scraper_demo_lambda_role' and won't attach any policy templates to it yet. With AWS I'm finding it better to start with as few permissions as possible and let the errors along the way dictate what to add.

For this function, since it's doing all that scraping and needs to make url requests, I'm going into 'Advanced Settings' and upping the default Timeout to 40sec. Create.

It takes about 20s to complete, but at the end I've got my shiny new lambda created.  

![screenshot](https://github.com/smrkem/stockdata2/blob/master/docs/images/lambda-created-1.png)

and I can do stuff with it from the terminal. To just look at it's current configuration I can  
```
$ aws lambda get-function-configuration --function-name google_news_scraper_demo
{
    "CodeSha256": "J0qJ6CpItjocU9+PVXDUID6V5s+iswETfQPnubUb/PI=",
    "FunctionName": "google_news_scraper_demo",
    "CodeSize": 214,
    "MemorySize": 128,
    "FunctionArn": "arn:aws:lambda:us-east-1:641007673464:function:google_news_scraper_demo",
    "Version": "$LATEST",
    "Role": "arn:aws:iam::641007673464:role/service-role/google_news_scraper_demo_lambda_role",
    "Timeout": 40,
    "LastModified": "2017-09-11T21:52:20.983+0000",
    "Handler": "lambda_function.lambda_handler",
    "Runtime": "python3.6",
    "Description": "return 10 google results"
}
```  

With that done I need to make the corresponding entry on my local. In my new lambdas folder I create a 'google_news_scraper_demo' folder and go into it. From in there I make a new virtualenv and activate it. Let's start with a little python code to test. The "Handler" for our function is 'lambda_function.lambda_handler' which for us maps to a file called 'lambda_function.py' with a function inside it called 'lambda_handler'. Let's start with my fallback helloworld:  
```
# file: /lambdas/google_news_scraper_demo/lambda_function.py

def lambda_handler(event, context):
    print(event)
    print(context)
    return 'Hello karl'
```

and that's it. Almost exactly like the default code, except I always like to kick things off with inspecting what I have. We can upload the new version, and then go back to the console to test things out. To do that we first zip it up along with any dependencies (none in this case) and then upload it to aws using the awscli. This feels like a process we'll do a lot so lets add a Makefile.  

The Makefile is taken from Ben Emson's excellent video at  
https://www.youtube.com/watch?v=68teS9nNvPQ&t=314s  
with a few modifications.

Here's the commit with the new Makefile, and a good organization structure for all our future lambdas.  (I goofed and left a copy of the 'lambda_function.py' file in the google_news_scraper_demo root folder).
- https://github.com/smrkem/stockdata2/commit/4493f2629aa35bec90715a2bf6bcc6907036c1ff  

and inside the 'lambdas' folder the structure should now look like this:  
```
.
└── google_news_scraper_demo
    ├── Makefile
    ├── src
    │   └── lambda_function.py
    └── venv
        ..
        ├── lib
        ├── lib64 -> lib
        ..
```  

*Note: On my environment and version of python, the 'lib64' folder in the virtual environment is just a symlink to the 'lib' folder, so in the "copy_python" section of the Makefile I only add the  `$(VIRTUAL_ENV)/lib;` folder. You might want a second if block there if your environment is different.*  

<br>

With this we can write our python code like normal, using pip install whenever we need to add a library, and then just run
```
$ make build
```
when we're ready to update the function on AWS. We'll get a `src.zip` file in the 'package' directory that's ready for uploading.

After uploading it to my new 'google_news_scraper_demo' function in the console (including some headscratching on weird, failed attempts until I realized the 'lamda_function.py' file was empty from my earier goof - Doh!) I can see the code and it runs the stock AWS test event just fine.  

<br>

There's a couple final bits of setup I want to have in place. I want to be able to easily test my lambdas locally as I'm developing (when it makes sense) and I want the Makefile to also handle uploading the code to AWS.  

Running the file locally is easy, just add the boilerplate python to the bottom and invoke the function, remebering to create an event object. (I ditched printing the context after my test in the aws console didn't show anything I cared about).  
```
def lambda_handler(event, context):
    print(event)
    return 'Hello karl'

if __name__ == "__main__":
    event = { 'key1': 'value1' }
    lambda_handler(event, None)
```  
and now I can run my lambda locally with:  
```
(venv) $ python src/lambda_function.py
{'key1': 'value1'}
```  
This is fine for now. I'll see what hoops I need to jump through as I start doing more things in the lambda.  

Having a make command to upload the file to aws is also easy. We can add:  
```
# file: Makefile

...

deploy: deploy_package clean_package


deploy_package:
	aws lambda update-function-code --zip-file=fileb://package/$(PROJECT).zip --function-name $(FUNCTION_NAME)

...
```
which, thanks to the way we set up our Makefile will do all this automatically. To check, I make a slight addition the function:
```
def lambda_handler(event, context):
    print(event)
    print(list(event.keys()))
    return 'Hello karl'

if __name__ == "__main__":
    event = { 'key1': 'value1' }
    lambda_handler(event, None)

```
which runs just fine locally. I build the deployment package and attempt to deploy it to AWS:
```
(venv) $ make build
(venv) $ make deploy
```  

The output is promising and I go to check it out in the console. Refreshing the screen shows the new code and it runs without any problems. woot!

This workflow, directory structure and even the Makefile will work unaltered for all my lambdas. And now, with the setup out of the way - it's on to the fun stuff of having the google_news_scraper_demo lambda actually do something useful.  

### The GET /stocknews-items request  

I can finally hook the lambda up to my API and complete the request from the app. Currently the news_scraper lambda doesn't do anything except print out the event parameter. That seems like a good starting point.

In the 'stock-news-classifier-demo' API, I add a new GET method to the 'stocknews-items' resource and attach it to the lambda.

[screenshot]  

That's it. I can deploy the API (setting up a new stage that I'll name 'dev') and get my endpoit's url.  
- `https://1kddb733mf.execute-api.us-east-1.amazonaws.com/dev`  

I can use this in the app and try sending the query input from the user to my lambda. Here's the diff for the update to the StockNews component in the app:  
```
class StockNews extends React.Component {
       isShowingResults: false,
       errorState: false
     }
+    this.apiUrl = 'https://1kddb733mf.execute-api.us-east-1.amazonaws.com/dev'
   }

   onNewQuery(query) {
@@ -37,8 +38,8 @@ class StockNews extends React.Component {
   fetchResults(query) {
     this.setState({isFetching: true})

-    const apiUrl = 'http://not-valid-api/fj9edk90'
-    fetch(apiUrl, {
+    let url = this.apiUrl + '/stocknews-items?q=' + query
+    fetch(url, {
       mode: 'cors'
     })
     .then(response => {
```  
I spin up the app and try it out, putting 'testing' in the box and submitting. It doesn't work and I get an error :(
```
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8080' is therefore not allowed access. The response had HTTP status code 502. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.  
```

Ahh well - at least my error handling code is working alright. kind of. I'm not even getting a 'response' object back. But I can go over the AWS console for my lambda and click on the "Monitoring" tab and see that my lambda is indeed firing. What's more, there are no errors. Heading over to "View logs in CloudWatch" I can see that the function ran properly, and even inspect the `event` object that got passed in. Apparently there's a `queryStringParameters` key in there which is holding the query string. Awesome.

So what's the problem? Well, with the way this API method is set up it actually needs to return a response, which includes the "Access-Control-Allow-Origin" header. Let's update the lambda function
```
import json


def lambda_handler(event, context):
    query = event['queryStringParameters']
    print(query)
    output = {
        'message': "Got query: {}".format(query)
    }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(output)
    }

```
and then build and deploy it.  
```
(venv)$ make build
(venv)$ made deploy
```

Now the query works and the API is returning a decent response. Here's the full commit (that also fixes up an error in the StockNews component query code):  
- https://github.com/smrkem/stockdata2/commit/9cea74588fc58e745593d926818ac6e89dd3937e  

I also updated the `lambda_function.py` code with an appropriate sample event for testing the function locally. Now we're successfully sending the query through the API to the lambda, and returning some kind of response to the app. Time to make the function actually useful.

### Querying google for news results  
