# Local Setup (npm and webpack)  

### Initializing the project  

Like any React app, the first job is to initialize the project:  

- `$ npm init`  

Fill in whatever you like at the prompts or just accept the defaults - and you'll have a shiny new `package.json` file.  

I'm not going to go into depth on npm (Node Package Manager), it's a tool that we can use to download and manage the various packages that we'll be using to build the app. 'React' is just one of these packages.  

Take a look at the `package.json` file that got created. Currently it's pretty empty - just a json version of what we put in during the init. There's also a "scripts" section that we'll be using soon.  

First lets use npm to install the React packages we'll need:  
- `$ npm install react react-dom --save`


npm does it's thing and once the packages are installed, the `package.json` file has been updated. There's a new "dependencies" section with the 2 new packages listed. (We could have accomplished the same result using the shorthand `npm i react react-dom -S` - using 'i' for 'install' and '-S' for '--save'.)  

There's also a new 'node_modules' folder in our root directory. This is where npm downloads our packages to. In there, along with a bunch of node stuff, we can see our new 'react' and 'react-dom' folders.

### React and Webpack  

With React, we can build our app as a collection of 'components' that interact with each other and which the user can interact with. At the end of the day, components are just javascript - plain old javascript that browsers understand. Writing this file directly, while technically possible, is ugly and not how things are done.  

We want our 'source' code - the code we write in our IDE - to be nicely organized (typically a new folder for each component). We also want to be able to use nice (es6) syntax that most browsers don't understand yet. It might be nice to keep separate css files, storing only the relevant styles along with the component they are for.  

We want our 'built' code - the code to be run in the browser - to be optimized, combined, and minified. The goal here is to get the code to the browser in the smallest filesizes possible, using the fewest HTTP requests we can.  

Enter Webpack.  

Webpack is the swiss army knife bundler that is used to take all our separate files, and also grab all their dependencies, and output a single browser-understandable js file which is stripped down to only what the browser needs.  

Webpack will also do some translating along the way - so we can write React (jsx) and use newer es6 syntax. We'll tell webpack to use the 'Babel' transpiler - which will convert all this code into regular es5 js that all browsers can run.
