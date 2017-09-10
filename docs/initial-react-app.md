**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)

***

# Initial React app and skeleton  

Starting with the initial skeleton, I can run `npm start` and see the boilerplate code running in the browser.  

I'll start simple and add a header to the app. Here's the commit:  
- https://github.com/smrkem/stockdata2/commit/d5acf6670aea8d12c5346d7641fcf6ce980e8d96  

Pretty simple - in fact it's mostly some css for the new header. But it shows how simple it is to add new components and how the js and css files get organized.

An `npm start` later and everything is running fine (with some minor styling issues that I'll fix in the next commit...). At this point I want to think a little bit about what the app should be and how it will work.

### Communicating with the API  
The app needs to take a user input and pass that to the API, which will respond with the results for that query. The app then needs to display the results, and offer a UI for labelling each post. Finally, the app needs to make a final POST to the API, sending it all the labelled results as data.  

A component for the user input, and another one to display the results and allow the user to label them seems natural. I'm thinking it will also be a good idea to wrap both of those in a parent component whose main responsibility will be communicating with the API and passing the results down as props.  I'm thinking something like the following:  

```
<StockNews>
  <CompanyNameInput />
  <Results >
</StockNews>
```  

I'll start with these initially, creating them as 'stateless' components. I'll end up going back and changing them when needed, but I think it's best to start simple and only add complexity when it's required.  

Here's the commit that creates the skeleton for the above components (along with some styling). The CompanyNameInput is built out somewhat, but Results is just placeholder.  
<br>
https://github.com/smrkem/stockdata2/commit/678be7244cd0aa8d8e4bcc05e9347d5ec5bc645f  

<br>
(`npm start` and everything is running smooth. It doesn't even look half bad)  

<br>
