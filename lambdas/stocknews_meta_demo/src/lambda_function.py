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
