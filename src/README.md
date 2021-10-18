# Development and Dependencies

This project has no native dependencies as all dependencies are loaded into the project via CDNs. Additionally, the JS assets are not bundled during delivery to maximize file caching when updating so less code has to be re-downloaded when issuing an update. However there are a number of dev dependencies and if you intend to play around with the code. please run `npm install` at the root directory of this project to install them. testing the app can be done by running `node serve` or `npm start` in the root directory of the project and opening the link in your browser. ~~Please don't bully me too much about my shitty code. I was probably very sleep deprived when I wrote it ;A;~~

## Project structure and frameworks

The [assets] folder contains the assets of the project and you will likely not need to do mess with it unless you are adding new keywords (in which case go nuts). The [css] folder contains the css for the app (duh) and the [js] folder contains the js.

The app is initiated in the main.js file although it doesn't look like it. The line `proxymity(document.body, controller)` is where the app bootstraps as the proxymity function is the function that binds a HTML view to it's controller. The rest of the application will add different views and routs to the app.

This project is built on top of another one of my projects [Proxymity](https://github.com/muggy8/proxymity) which ~~is probably a shitty library now that I think about it~~ is a library for managing UI. It isn't the best written library but I like it because I wrote it. Feel free to roast me for my poor decisions. The readmes in the project should help you understand what's happening better as the project is somewhat inspired by a mix of AngularJS and ReactJS.
