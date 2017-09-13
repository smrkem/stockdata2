import json


def lambda_handler(event, context):
    query = event['queryStringParameters']
    print(query)
    output = {
        'message': "Got query: {}".format(query)
    }
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(output)
    }

if __name__ == "__main__":
    event = { 'queryStringParameters': 'value1' }
    lambda_handler(event, None)
