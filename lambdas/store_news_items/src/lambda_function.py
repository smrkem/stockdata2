import json


def lambda_handler(event, context):
    # Get posted data from fe app
    # Store each in s3 bucket
    # Update the visited_sites index file in s3

    print(event)
    output = "hello karl..."
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': output
    }

if __name__ == '__main__':
    event = {
        'queryStringParameters': {
            'q': 'Biostage'
        }
    }
    lambda_handler(event, None)
