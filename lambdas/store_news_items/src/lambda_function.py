import json


def lambda_handler(event, context):
    # Get posted data from fe app
    print("BODY: {}".format(event['body']))
    print("RQCntxt: {}".format(event['requestContext']))
    # Store each in s3 bucket
    # Update the visited_sites index file in s3


    output = { 'message': "hello karl..."}
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
