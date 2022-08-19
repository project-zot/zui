# zot UI  [![build-test](https://github.com/project-zot/zui/actions/workflows/build-test.yml/badge.svg?branch=main)](https://github.com/project-zot/zui/actions/workflows/build-test.yml) [![codecov.io](http://codecov.io/github/project-zot/zui/coverage.svg?branch=main)](http://codecov.io/github/project-zot/zui?branch=main) [![CodeQL](https://github.com/project-zot/zui/workflows/CodeQL/badge.svg)](https://github.com/project-zot/zui/actions?query=workflow%3ACodeQL) 
A graphical user interface to interact with a [zot](https://github.com/project-zot/zot) server instance.

Built with [React JS](https://reactjs.org/) and [Material UI](https://mui.com/).



## TL;DR

To start this app, run
### `npm install`
### `npm start`

If `zui` is ran separately from the `zot` back-end, the manual host configuration must be changed in the `./src/host.js` file 
```js
const hostConfig = {
  auto:false, 
  default:'http://localhost:5000' // replace with zot host
}
```
The  app will open in your default browser.
If not, you can manually open [http://localhost:3000](http://localhost:3000).



## Available Scripts

In the project directory, run:

### `npm install`

Do this first. Installs all dependencies needed by the app.


### `npm start`

Runs the app in the development mode. It should open your app in your default browser.
If not, you can manually open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed!

See this section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and built with [React JS](https://reactjs.org/) and [Material UI](https://mui.com/).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Material UI, check out the [Material UI Library](https://mui.com/).
