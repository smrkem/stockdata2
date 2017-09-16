**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)

***  

# Displaying Results  

The react app is successfully sending the user's query to the API and getting back 10 search results, ready to be labelled. We need to display them to the user, along with controls to mark each as 'spam' or 'good'. I'm thinking a third 'discard' category might be useful too.

What should that look like in the app? We can easily add an array of result posts in the StockNews state, and pass that to the Results component to display them. Each post in the array currently has  
```
post: {
  title
  link
  published
  contents
}
```
This is already pretty close to what we want to send back in the second request - it's only missing the label. We can add another property called 'category' which will be one of 'uncategorized', 'spam', 'good' or 'trash'. Upon first getting the results from the API, each post will be 'uncategorized'.

When displaying each post, we can set up controls that will just change the state of each post's 'category' to what the user selects. Then, when it's time to send the results back for storage we already have everything we need.

We'll probably want a new component whose job is to display a single post, and handle the associated controls.

Before that there's a little cleanup I want to take care of. That first request takes a pretty long time - around 25sec on average I'd guess. That's a long time for the user to wait with no feedback and also comes a little too close to my lambda function's timeout of 40sec.

I'm thinking to set up a timer to display to the user while the request is happening. Here's the commit:  
- https://github.com/smrkem/stockdata2/commit/e95e3c64c7d2ef32dc87de641870fe5787e2a581  

That feels a whole lot better. A few test queries all complete under or around 20sec - so I'm not going to worry at this point about handling things when the request goes longer than that 40sec timeout.

### Displaying result posts  

When the results come back, I want to set each one to 'uncategorized' and then set them in the state. I also want to be sending them to the Results component as a new prop, and display each in a new PostItem component.

I start with a basic PostItem skeleton that just displays the published date and the link, along with logging out the props.  
- https://github.com/smrkem/stockdata2/commit/cb97aeee7b6f979b6eb3113ca48e3596c2a799e4  

That's working nicely - time to add the actual contents and some buttons to label each post.

Since each post is likely to be quite long - I think I'll show the full thing while it's uncategorized, but collapse it after it's been labelled to get it out of the way.
