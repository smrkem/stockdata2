**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)
7. [Storing the Data](https://github.com/smrkem/stockdata2/blob/master/docs/storing-results.md)  


***  

# Storing the Data

Now it's time to think a little bit about how this data will eventually get used. Ultimately, for a text classifier, I'm going to want to end up with a python list where each element contains:
1. the raw words in the text  
2. the label for that text

At this point anything identifying the post, like the title or the url isn't really wanted for training.

By that point I'm planning on having a lot of data - ideally 500 each of 'spam' and 'good' - 1000 posts total. (The ratio is probably gonna end up skewed in one direction though). All these labelled samples will be stored in S3, in some yet-to-be-determined fashion. The focus right now is definitely on collecting samples efficiently.  

### Storing some metaData

In addition to the data, I can store some meta data like which urls I've already scraped - I don't want to re-scrape any urls -  and maybe throw in some running totals like current_good_posts, current_spam_posts.

Here's what I'm thinking - totally naive approach - my s3 bucket will initially hold 3 files:
- good_posts.json
- spam_posts.json  
- stocknews.meta.json

When I submit new labelled posts from the app, the lambda should update these files in s3 accordingly.


**toDo:**  
- create new lambda
  - initially write me the new file in a good format in s3
  - modify it to read the file from s3 and return the data
- create new resource and method in the API
- display meta in the app

***
### Improving the lambda workflow  
This is starting to feel like old hat - make a local copy of an existing lamda into a folder named after the new lambda function. Set it up for a fresh virtual environment. Sounds like a nice job for a Makefile. I make a copy of the store_news_items_demo lambda called lambda_skeleton and zero it out.
```
lambdas/lambda_skeleton$ tree .
.
├── Makefile
└── src
    └── lambda_function.py
```
and the `lambda_function.py`:
```
# file: lambda_skeleton/src/lambda_function.py

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
    print('in lambda')
    print(event)
    output = {
        'message': "in lambda",
    }
    return generate_response(output)
```
Looks good to me. In my project root I add a new Makefile.
```
# file: /Makefile

init_lambda: copy_lambda_skeleton new_virtual_env


copy_lambda_skeleton:
	echo "Creating new local lambda: $(NAME)"
	cp -r lambdas/lambda_skeleton lambdas/$(NAME)

new_virtual_env:
	echo "Creating new virtual env"
	cd lambdas/$(NAME) && python3 -m venv venv
```
Let's see what that bought me...  

The process of creating a new lambda is pretty easy.

1. Create the new python 3.6 lambda with the usual initial settings.
2. Create the new lambda.
```
$ make init_lambda NAME=stocknews_meta_demo
```
3. Update the code as desired and deploy. From inside the lambdas folder:
```
(venv)$ make build
(venv)$ make deploy
```
 I'm really happy with all that.

### Making the stocknews_meta lambda

In the AWS Console I create the new 'stocknews_meta_demo' lambda - and yep, i'm sticking with the poorly named 'google_news_scraper_demo_role'.  

Writing and reading files from s3 in lambdas is incredibly easy. Basically just
```
import boto3


s3 = boto3.resource('s3')
bucket = s3.Bucket('ms-stockknewsitems-demo')
```
and that `bucket` object can now write new files or retrieve a file. I don't even need to care about the boto3 package since it's installed by default on all lambdas. Remember that s3 bucket I set up way back ('ms-stockknewsitems-demo')? It's finally gonna get some use.

The `stocknews.meta.json` should look something like:
```
{
  'current_good_posts': 113,
  'current_spam_posts': 64,
  'url_history': [...]
}
```
where `url_history` will just be an array of url strings I've already scraped. I'll keep "http"/"https" versions separate for now.  

The first version of my lambda will be temporary - it's purpose is to create that file for me.
```
def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('ms-stockknewsitems-demo')

    meta = {
      'current_good_posts': len([]),
      'current_spam_posts': len([]),
      'url_history': []
    }
    bucket.put_object(Key='stocknews.meta.json', Body=json.dumps(meta))


```
I can test it in the AWS Console and it will actually create the s3 file.
```
$ make build
$ make deploy
```

Awesome - I'm loving those Makefile commands. There's still an error though - the 'google_news_scraper_demo_role' doesn't have any s3 access.

In the AWS Console, in IAM I can see all my roles. I click on the 'google_news_scraper_demo_role' and "Attach Policy". Filtering for "S3" I see the "AmazonS3FullAccess" policy and select it.  


![screenshot](https://s3.amazonaws.com/ms-postassets/2017-09-20-Stock-News-Classifier-P1/lambda_role_addS3policy.png)  

Now when I retest my stocknews_meta lambda it finishes successfully and the new stocknews.meta.json file is there in my 'ms-stockknewsitems-demo' bucket. Just to be sure I download it and look at the contents:
```
{"current_good_posts": 0, "current_spam_posts": 0, "url_history": []}
```
yay! :)

### Displaying meta data in the app  
The app should be able to get the updated meta info and display it to the user. That sounds simple enough.
