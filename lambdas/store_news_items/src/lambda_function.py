import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.resource('s3')

    obj = s3.Bucket('ms-stocknewsitems').Object('positive.json')
    body = obj.get()['Body'].read()

    pos_posts = json.loads(body)

    # pos_posts = [
    #     {
    #         'title': "Sample Title 1",
    #         'url': "http://example.com",
    #         'category': 'pos',
    #         'body': "The body of the post goes in here, all paragraphs concatenated into a single string."
    #     }
    # ]
    #
    # s3.Bucket('ms-stocknewsitems').put_object(Key='positive.json', Body=json.dumps(pos_posts))
    #

    # # Get posted data from fe app
    # print("BODY: {}".format(event['body']))
    # posts = json.loads(event['body'])
    # # Store each in s3 bucket
    # # Update the visited_sites index file in s3
    #

    output = {
        'message': "Get contents from s3",
        'posts': posts
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
