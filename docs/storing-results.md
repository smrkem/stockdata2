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

At this point anything identifying the post, like the title or the url isn't really wanted for training. (I like that it's there - and I'll be using it to store some meta data like which urls I've already scraped and maybe some running totals to display.)
