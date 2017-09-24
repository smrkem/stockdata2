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
        'meta': {
            'current_good_posts': meta['current_good_posts'],
            'current_spam_posts': meta['current_spam_posts'],
            'total_urls': len(meta['url_history'])
        }
    }
    return generate_response(output)
