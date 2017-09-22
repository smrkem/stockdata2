**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)  

***  

# Sending Back Results  

toDos:  
- make initial lambda that just logs the event
- add POST method to API to the lambda
- make the request in the front-end app

### Making the store_news_items_demo lambda

In the AWS Console I create a new (Python 3.6) function, leaving the trigger blank and everything else as before - default code, 40sec timeout and I'm even using the same 'google_news_scraper_demo_lambda' role I created earlier. I'll adjust the timeout later, and I'm thinking eventually both lambdas will need S3 permissions so for now they can share the role. I call it:
- `store_news_items_demo`  

Here's where a lot of the setup work I did upfront for the lambdas really pays off. I copy the 'google_news_scraper_demo_lambda' to a new directory called 'store_news_items_demo'. This is a new lambda so it should live in a new environment (I'm not going to need FeedParser or BeautifulSoup here).  From inside the `/lambdas` folder:
```
$ cp -r google_news_scraper_demo_lambda store_news_items_demo
$ cd store_news_items_demo
$ rm -rf venv
$ python3 -m venv venv
$ . venv/bin/activate
(venv) $
```


*Okay - I should probably be leaving a requirements.txt file along with each lambda. My bad.*


Here's the new 'lambda_function.py':
```
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
    print(event)
    output = {
        'message': "in lambda"
    }
    return generate_response(output)

```

That's it for now. I just want to look at that 'event' object and find out how to get at my POST data. I also left off the
```
if __name__ == "__main__":
```
part. This function isn't one I'll be testing locally. It's just easier to upload it and test things through the app at this point without the overhead of setting up proper test events with mock post data.

It's important that I named the new folder the same name as the lambda - ie: 'store_news_items_demo'. To verify things I'll just:  
```
(venv)$ aws lambda get-function-configuration --function-name store_news_items_demo
```

And I get back some decent info. Now my Makefile commands should just work and I can just:
```
(venv)$ make build
(venv)$ make deploy
```

#### An aside on the lambda role
In the AWS Console for the lambda I can see that the code's been updated. The stock "TEST" in the console has a default event of:  
```
{
  "key3": "value3",
  "key2": "value2",
  "key1": "value1"
}
```
which isn't hugely useful. But it does surface a minor hiccup in the way things are set up. While the test succeeds, there are no CloudWatch logs being created for this lambda.  

The issue is with the 'google_news_scraper_demo_lambda_role' that the lambdas are sharing. And that was a dumb name for me to give it. Currently there's only a single policy attached. I needed to update that to
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:us-east-1:641007673464:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:641007673464:log-group:/aws/lambda/google_news_scraper_demo:*",
                "arn:aws:logs:us-east-1:641007673464:log-group:/aws/lambda/store_news_items_demo:*"
            ]
        }
    ]
}
```
(adding in the new lamda log group to the Resource section). I also needed to wait somewhere between 10minutes and overnight for the new policy to take effect, but after that the lambda is creating logs just fine.  

**toDos:**  
- ~make initial lambda that just logs the event~
- add POST method to API to the lambda
- make the request in the front-end app

***

### Adding the POST method to the API  

In API Gateway, I add a new POST method to my stocknews-items api.  

![screenshot](https://s3.amazonaws.com/ms-postassets/2017-09-20-Stock-News-Classifier-P1/api-create-post-stocknews-items.png)  

and that's it! My app should be able to send a request to it. woot!  

**toDos:**  
- ~make initial lambda that just logs the event~
- ~add POST method to API to the lambda~
- make the request in the front-end app

***

### Making the POST request from the app  

Next up - I want to actually send all the classified news items in a POST to the new endpoint. Luckily, the data is all there in the StockNews component's state - just waiting to be sent.

I add a quick function to the StockNews component to do just that, and update the `render` to pass the function down to the Results component.  
```
// file: StockNews.js

onPostItems(data) {
  fetch(this.apiUrl + '/stocknews-items', {
    method: 'post',
    body: JSON.stringify(this.state.postItems),
    mode: 'cors'
  })
    .then(d => d.json())
    .then(d => {
      console.log('got response', d)
    })
}

render() {
  return (
    <div className="container" id="stocknews-container">
      <CompanyNameInput setQuery={(q) => this.onNewQuery(q)} />
      <Results
        {...this.state}
        setPostCategory={(link, cat) => this.onSetPostCategory(link, cat)}
        onPostItems={(posts) => this.onPostItems(posts)}
      />
    </div>
  )
}
```

Now, in the Results component I just need to add a button and wire it up. I think I'll make it a separate component so I can easily add the button twice - once at the top and again at the bottom of that long posts contents. And I only want to display this button when I'm actually displaying results. Here's the relevant code updates:
```
// file: Results.js

const SubmitControls = ({onPostItems}) => (
    <div className="submit-controls">
      <button onClick={onPostItems}>
          Submit Results
      </button>
    </div>
)

const Results = (props) => {
  if (props.errorState) {
    ...
  }

  let heading = "No query"
  let contents = ""
  let submitControls = ""

  ...
  if (props.query && props.isShowingResults) {
    ...
    submitControls = <SubmitControls onPostItems={props.onPostItems} />
  }


  return (
    <div id="stocknews-results">
      <h3>{ heading }</h3>
      { submitControls }
      <div>{ contents }</div>
      { submitControls }
    </div>
  )
}
```

With that in place, I'm ready to finally test out the new lambda properly. I get back the news for "neovasc", and quickly classify a few posts. It doesn't really matter since at this point the lambda isn't storing anything - I just want to verify these items get to the lambda and inspect the logs where I'm printing out the 'event' so I can see how to grab the POST data and where to go next.

Clicking "Submit Results", I see the expected
```
'message': "in lambda"
```
in the console. Sweet.

In AWS Console, I can see my lambda was invoked without errors, and the log was created in CloudWatch with my full 'event' object in it. Awesome. That event object is huge, but happily it looks like there is simply a 'body' key that contains all my POST data in a JSON string. That's gonna be so easy to work with.


**toDos:**  
- ~make initial lambda that just logs the event~
- ~add POST method to API to the lambda~
- ~make the request in the front-end app~

***

To fnish this section, I'll update the lambda to do a little processing, as well as return more meaningful data to the app.
```
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
```
and then a quick
```
$ make build
$ make deploy
```

Another test query and the results in the console are looking fantastic.  

Next up is Storing the Results, which will mean putting a little thought into exactly what and how I'll be storing all this labelled data.
