# Local Setup (npm and webpack)

Like any React app, the first job is to initialize the project:
- `$ npm init`
Fill in whatever you like at the prompts or just accept the defaults - and you'll have a shiny new `package.json` file.  

I'm not going to go into depth on npm (Node Package Manager), it's a tool that we can use to download and manage the various packages that we'll be using to build the app. 'React' is just one of these packages.  

Take a look at the `package.json` file that got created. Currently it's pretty empty - just a json version of what we put in during the init. There's also a "scripts" section that we'll be using soon.  

First lets use npm to install the React packages we'll need:  
- `$ npm install react react-dom --save`


npm does it's thing and once the packages are installed, the `package.json` file has been updated. There's a new "dependencies" section with the 2 new packages listed. (We could have accomplished the same result using the shorthand `npm i react react-dom -S` - using 'i' for 'install' and '-S' for '--save'.)
