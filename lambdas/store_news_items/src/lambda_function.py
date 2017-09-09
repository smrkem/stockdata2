import json
import boto3


s3 = boto3.resource('s3')
bucket = s3.Bucket('ms-stocknewsitems')

def load_data():
    obj = bucket.Object('good_posts.json')
    good_posts = json.loads(obj.get()['Body'].read())

    obj = bucket.Object('spam_posts.json')
    spam_posts = json.loads(obj.get()['Body'].read())

    obj = bucket.Object('post_urls.json')
    post_urls = json.loads(obj.get()['Body'].read())

    return good_posts, spam_posts, post_urls

def store_data(good_posts, spam_posts, post_urls):
    bucket.put_object(
        Key='good_posts.json',
        Body=json.dumps(good_posts)
    )
    bucket.put_object(
        Key='spam_posts.json',
        Body=json.dumps(spam_posts)
    )
    bucket.put_object(
        Key='post_urls.json',
        Body=json.dumps(post_urls)
    )


def prep_post(post):
    out_post = {}
    out_post['label'] = post['category']
    out_post['published'] = post['published']
    out_post['url'] = post['link']
    out_post['title'] = post['contents']['title']
    out_post['body'] = " ".join(post['contents']['paragraphs'])
    return out_post


def lambda_handler(event, context):
    # Load good_posts, spam_posts and post_urls
    good_posts, spam_posts, post_urls = load_data()

    # Process posted data from fe app
    new_posts = json.loads(event['body'])
    for post in new_posts:
        print(post)
        print("++++++++++++++++")

        cat = post['category']
        if cat=='good':
            good_posts.append(prep_post(post))
        elif cat=='spam':
            spam_posts.append(prep_post(post))

        if cat != 'uncategorized':
            post_urls.append(post['link'])

    # Store date to S3
    store_data(good_posts, spam_posts, post_urls)

    output = {
        'message': "Stored successfully",
        'good_posts': len(good_posts),
        'spam_posts': len(spam_posts),
        'post_urls': len(post_urls)
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(output)
    }
