**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results](https://github.com/smrkem/stockdata2/blob/master/docs/displaying-results.md)
6. [Sending Results Back for Storage](https://github.com/smrkem/stockdata2/blob/master/docs/sending-back-results.md)
7. [Storing the Data](https://github.com/smrkem/stockdata2/blob/master/docs/storing-results.md)  
8. [Finishing Up](https://github.com/smrkem/stockdata2/blob/master/docs/finishing-up.md)  

***  

# Finishing up the App

Things are basically done. I can search for a company and label the most recent 'news' items as good or spam. That labelled data gets stored in s3 in a way that's pretty flexible.

At this point, I could use my app for about a week - approximately 100 queries - and I should end up with about 1000 samples. I'm not sure yet what ratio of good to spam would be ideal - so at first imma go for 500 spam and 500 good posts.

I'm noticing some details that really need to be improved:
- occasionally queries fail due to timeout or some weird response from one of the scraped sites. Some better error-checking and feedback here would be helpful.
- a lot of garbage copy is still getting into my results, the filtering needs to be more accurate.
- i still definitely want to keep an eye on lambda metrics like lambda memory usage and data filesizes.
- Some front-end reporting on the meta: url_count, current_good_posts, current_spam_posts
