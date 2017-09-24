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
1. the raw words in the sample  
2. the label for that sample

At this point anything identifying the post, like the title or the url isn't really wanted for training.

By that point I'm planning on having a lot of data - ideally 500 each of 'spam' and 'good' - 1000 posts total. (The ratio is probably gonna end up skewed in one direction though). All these labelled samples will be stored in S3, in some yet-to-be-determined fashion.

In addition to the data, I can store some meta data like which urls I've already scraped - I don't want to re-scrape any urls -  and maybe throw in some running totals like current_good_posts, current_spam_posts.

### Initial Design  

Here's what I'm thinking - totally naive approach - my s3 bucket will initially hold 3 files:
- good_posts.json
- spam_posts.json  
- stocknews.meta.json

When I submit new labelled posts from the app, the lambda should update these files in s3 accordingly. The `stocknews.meta.json` should look something like:
```
{
  'current_good_posts': 113,
  'current_spam_posts': 64,
  'url_history': [...]
}
```
where `url_history` will just be an array of url strings I've already scraped. I'll keep "http"/"https" versions separate for now.  

The `spam_posts.json` and `good_posts.json` files will just be large JSON arrays of labelled posts - exactly as they're already being sent from the app. I'm going to keep the url and title information in each post for now. That information could be valuable in training and the words in the title or url segments can be added to the words in the text.

Overall, I'm not thinking this is the best design. Using JSON to store the data is problematic - you kind of need to read in the entire JSON file in order to append items to it. As the files get large then this might eat up too much memory. A csv-type solution would probably be better, but storing large amounts of text in csv has its own issues.

For now I'll go with JSON and keep an eye on the lambda's memory usage as well as the file sizes in s3.

### Updating the store_news_items_demo Lambda

Writing and reading files from s3 in lambdas is incredibly easy. Basically just
```
import boto3

s3 = boto3.resource('s3')
bucket = s3.Bucket('ms-stockknewsitems-demo')
```
and that `bucket` object can now write new files or retrieve a file. I don't even need to care about the boto3 package since it's installed by default on all lambdas. Remember that s3 bucket I set up way back ('ms-stockknewsitems-demo')? It's finally gonna get some use.

The new store_news_items_demo lambda is pretty straightforward:  
```
import json
import boto3


s3 = boto3.resource('s3')
bucket = s3.Bucket('ms-stockknewsitems-demo')

def load_data():
    obj = bucket.Object('good_posts.json')
    good_posts = json.loads(obj.get()['Body'].read())

    obj = bucket.Object('spam_posts.json')
    spam_posts = json.loads(obj.get()['Body'].read())

    obj = bucket.Object('stocknews.meta.json')
    meta = json.loads(obj.get()['Body'].read())

    return good_posts, spam_posts, meta

def store_data(good_posts, spam_posts, meta):
    bucket.put_object(
        Key='good_posts.json',
        Body=json.dumps(good_posts)
    )
    bucket.put_object(
        Key='spam_posts.json',
        Body=json.dumps(spam_posts)
    )
    bucket.put_object(
        Key='stocknews.meta.json',
        Body=json.dumps(meta)
    )

def generate_response(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }


def lambda_handler(event, context):
    good_posts, spam_posts, meta = load_data()

    for post in json.loads(event['body']):
        if post['category'] == 'good':
            good_posts.append(post)
        elif post['category'] == 'spam':
            spam_posts.append(post)

        if post['category'] != 'uncategorized':
            meta['url_history'].append(post['link'])

    meta['current_good_posts'] = len(good_posts)
    meta['current_spam_posts'] = len(spam_posts)

    store_data(good_posts, spam_posts, meta)

    output = {
        'message': "Labelled some posts",
        'good_posts': meta['current_good_posts'],
        'spam_posts': meta['current_spam_posts'],
        'post_urls': len(meta['url_history'])
    }
    return generate_response(output)
```

First I load up the existing data from s3, then loop over the posts sent from the app. If the post is 'good' I append it to the good_posts list and if it's 'spam' it gets added to spam_posts. If the category is 'trash' then I don't store it, but I do add the link to the url history.

So far so good - now I have to create the initial files in s3. No problems there - I can create the files locally and upload them using either the AWS Console or the cli.

The `stocknews_meta.json` file looks like:
```
{"current_good_posts": 0, "current_spam_posts": 0, "url_history": []}
```
And the `good_posts.json` and `spam_posts.json` are each simply:
```
[]
```
```
$ aws s3 ls s3://ms-stockknewsitems-demo
2017-09-24 12:39:49          3 good_posts.json
2017-09-24 12:39:57          3 spam_posts.json
2017-09-22 18:54:31         69 stocknews.meta.json
```
With that in place I can push up the new lambda:
```
$ make build
$ make deploy
```

Awesome - I'm loving those Makefile commands. There's still one item left to do - the 'google_news_scraper_demo_role' doesn't have any s3 access.

In the AWS Console, in IAM I can see all my roles. I click on the 'google_news_scraper_demo_role' and "Attach Policy". Filtering for "S3" I see the "AmazonS3FullAccess" policy and select it.  

![screenshot](https://s3.amazonaws.com/ms-postassets/2017-09-20-Stock-News-Classifier-P1/lambda_role_addS3policy.png)  

### Testing it out
I'm ready to give it a spin. In the app I get back some results for "neovasc", label each post and "Submit Results".
```
got response {message: "Labelled some posts", good_posts: 5, spam_posts: 3, post_urls: 10}
```
and in the terminal:
```
$ aws s3 ls s3://ms-stockknewsitems-demo
2017-09-24 13:02:11      41315 good_posts.json
2017-09-24 13:02:11      12893 spam_posts.json
2017-09-24 13:02:11       1080 stocknews.meta.json
```

yay! Filesizes look good :) Now to make sure that new queries add to the data and don't overwrite anything in s3. Another query and some more labelling.
```
got response {message: "Labelled some posts", good_posts: 5, spam_posts: 12, post_urls: 20}
```
```
$ aws s3 ls s3://ms-stockknewsitems-demo
2017-09-24 13:11:45      41315 good_posts.json
2017-09-24 13:11:45      49670 spam_posts.json
2017-09-24 13:11:45       2116 stocknews.meta.json
```
awwww yeah!


Next up is adjusting the google_news_scraper_demo lambda to look at the url history and skip any duplicate urls.
