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


def lambda_handler(event, context):
    # Load good_posts, spam_posts and post_urls
    good_posts, spam_posts, post_urls = load_data()

    # s3.Bucket('ms-stocknewsitems').put_object(Key='positive.json', Body=json.dumps(pos_posts))


    # # Get posted data from fe app
    # print("BODY: {}".format(event['body']))
    # posts = json.loads(event['body'])
    # # Store each in s3 bucket
    # # Update the visited_sites index file in s3
    #



    print("Good Posts: {}".format(len(good_posts)))
    print("Spam Posts: {}".format(len(spam_posts)))
    print("Post Urls: {}".format(len(post_urls)))

    output = {
        'message': "Loading data from s3",
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

if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'q': 'Biostage'
        }
    }
    lambda_handler(event, None)
