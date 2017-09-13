def lambda_handler(event, context):
    print(event)
    print(list(event.keys()))
    return 'Hello karl'

if __name__ == "__main__":
    event = { 'key1': 'value1' }
    lambda_handler(event, None)
