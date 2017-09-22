**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)
7. [Storing the Data](https://github.com/smrkem/stockdata2/blob/master/docs/storing-results.md)  


***  

# Storing the Data

Now it's time to think a little bit about how this data will eventually get used. Ultimately, for a text classifier, I'm going to want to end up with a python list where each element contains:
1. the raw words in the text  
2. the label for that text

At this point anything identifying the post, like the title or the url isn't really wanted for training.

By that point I'm planning on having a lot of data - ideally 500 each of 'spam' and 'good' - 1000 posts total. (The ratio is probably gonna end up skewed in one direction though). All these labelled samples will be stored in S3, in some yet-to-be-determined fashion. The focus right now is definitely on collecting samples efficiently.  

### Storing some metaData

In addition to the data, I can store some meta data like which urls I've already scraped - I don't want to re-scrape any urls -  and maybe throw in some running totals like current_good_posts, current_spam_posts.

Here's what I'm thinking - totally naive approach - my s3 bucket will initially hold 3 files:
- good_posts.json
- spam_posts.json  
- stocknews.meta.json

When I submit new labelled posts from the app, the lambda should update these files in s3 accordingly.


**toDo:**  
- create new lambda
  - initially write me the new file in a good format in s3
  - modify it to read the file from s3 and return the data
- create new resource and method in the API
- display meta in the app

***
### Improving the lambda workflow  
This is starting to feel like old hat - make a local copy of an existing lamda into a folder named after the new lambda function. Set it up for a fresh virtual environment. Sounds like a nice job for a new Makefile in the project root. I make a copy of the store_news_items_demo lambda called lambda_skeleton and zero it out.
```
init_lambda: copy_lambda_skeleton new_virtual_env


copy_lambda_skeleton:
	echo "Creating new local lambda: $(NAME)"
	cp -r lambdas/lambda_skeleton lambdas/$(NAME)

new_virtual_env:
	echo "Creating new virtual env"
	cd lambdas/$(NAME) && python3 -m venv venv
```

### Making the stocknews_meta lambda

1. Create a new python 3.6 lambda with the usual initial settings. I call it 'stocknews_meta_demo' and yep, i'm sticking with the poorly named 'google_news_scraper_demo_role'
2. Create the local lambda folder so the names match. From `lambdas/`: `$ cp -r store_news_items_demo stocknews_meta_demo`

The `stocknews.meta.json` should look something like:
```
{
  'current_good_posts': 0,
  'current_spam_posts': 0,
  'url_history': []
}
```
where `url_history` will just be an array of url strings I've already scraped. I'll keep "http"/"https" versions separate for now.  



### Displaying meta data in the app  
The app should be able to get the updated meta info and display it to the user. That sounds simple enough.
