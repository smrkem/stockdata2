import json
import boto3


def generate_response(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }


def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('ms-stockknewsitems-demo')

    meta = {
      'current_good_posts': len([]),
      'current_spam_posts': len([]),
      'url_history': []
    }
    bucket.put_object(Key='stocknews.meta.json', Body=json.dumps(meta))

    output = {
        'message': "in lambda",
    }
    return generate_response(output)
