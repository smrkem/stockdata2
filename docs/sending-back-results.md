**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)  

***  

# Sending Back Results  

toDos:  
- make initial lambda that just logs the event
- add POST method to API to the lambda
- make the request in the front-end app

### Making the store_news_items_demo lambda

In the AWS Console I create a new (Python 3.6) function, leaving the trigger blank and everything else as before - default code, 40sec timeout and I'm even using the same 'google_news_scraper_demo_lambda' role I created earlier. I'll adjust the timeout later, and I'm thinking eventually both lambdas will need S3 permissions so for now they can share the role. I call it:
- `store_news_items_demo`  

Here's where a lot of the setup work I did upfront for the lambdas really pays off. I copy the 'google_news_scraper_demo_lambda' to a new directory called 'store_news_items_demo'. This is a new lambda so it should live in a new environment (I'm not going to need FeedParser or BeautifulSoup here).  From inside the `/lambdas` folder:
```
$ cp -r google_news_scraper_demo_lambda store_news_items_demo
$ cd store_news_items_demo
$ rm -rf venv
$ python3 -m venv venv
$ . venv/bin/activate
(venv) $
```


*Okay - I should probably be leaving a requirements.txt file along with each lambda. My bad.*


Here's the new 'lambda_function.py':
```
import json


def generate_response(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }


def lambda_handler(event, context):
    print(event)
    output = {
        'message': "in lambda"
    }
    return generate_response(output)

```

That's it for now. I just want to look at that 'event' object and find out how to get at my POST data. I also left off the
```
if __name__ == "__main__":
```
part. This function isn't one I'll be testing locally. It's just easier to upload it and test things through the app at this point without the overhead of setting up proper test events with mock post data. If it works then cool.

It's important that I named the new folder the same name as the lambda - ie: 'store_news_items_demo'. To verify things I'll just:  
```
(venv)$ aws lambda get-function-configuration --function-name store_news_items_demo
```

And I get back some decent info. Now my Makefile commands should just work and I can just:
```
(venv)$ make build
(venv)$ make deploy
```

**toDos:**  
- ~make initial lambda that just logs the event~
- add POST method to API to the lambda
- make the request in the front-end app

***
### Adding the POST method to the API  
