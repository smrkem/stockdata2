**ToC**
1. [Local setup (npm and webpack)](https://github.com/smrkem/stockdata2/blob/master/docs/local-setup.md)
2. [Initial React app and skeleton](https://github.com/smrkem/stockdata2/blob/master/docs/initial-react-app.md)
3. [Making the initial query](https://github.com/smrkem/stockdata2/blob/master/docs/making-initial-query.md)
4. [Building the API and first Lambda](https://github.com/smrkem/stockdata2/blob/master/docs/building-api-lambda1.md)
5. [Displaying Results]


***  

# Local Setup (npm and webpack)  

We'll be using npm and webpack to build the project. I'm not going to go into any depth on these topics - there's plenty of documentation. I've set up a boilerplate webpack project for react that has things configured the way I like.  

<br>
https://github.com/smrkem/react-webpack-boilerplate  
<br>
<br>

Just clone or download the repo and npm install the dependencies. The boilerplate app can be built and started with:  
- `$ npm start`  

and a production build (for live deployments) can be created with:  
- `$ npm run build`  

The generated 'dist' folder can be directly uploaded to an s3 bucket or anywhere else to host the app.  
