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
    good_posts = []
    spam_posts = []

    for post in json.loads(event['body']):
        if post['category'] == 'good':
            good_posts.append(post)
        elif post['category'] == 'spam':
            spam_posts.append(post)

    output = {
        'message': "Labelled some posts",
        'good_posts': good_posts,
        'spam_posts': spam_posts
    }
    return generate_response(output)
