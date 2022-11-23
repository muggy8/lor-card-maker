# About
Hi there, this is a LoR card maker mainly designed for Mobile devices. The live version of this app is located at [https://muggy8.github.io/lor-card-maker/](https://muggy8.github.io/lor-card-maker/). The app works in your browser and you don't even have to install anything (yay). If you're facing any issues, feel free to head over to the issues section and leave a comment and I'll try to get to it when I can.

## Support my work

<a href="https://www.buymeacoffee.com/muggyate" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Todo:
- ~~custom keywords~~
- ~~improve performance~~
- PWA share support
- re-introduce art URL
- re-introduce artist input
- custom card deck builder
- toggle for "Made with LoRCaM"
- better user feedback when error happens
- improve code quality
- iOS support?

## Running Locally
The project is split into 2 version, the old version which we'll call Version Darius is located in the src/ folder and is no longer being maintained. The current version which we'll call Version Ezreal is located in the dev/ folder. Version Ezreal is the version that you'll see when you visit [https://muggy8.github.io/lor-card-maker/](https://muggy8.github.io/lor-card-maker/). 

To run the app locally, you'll need NodeJS, NPM and Git. Clone this repo using git and then execute the requisit `npm install` within the project folder to get dependencies. Then you can feel free to run `npm start` in the project folder to start the development server.

If you want to deploy your own version of the app, you can just put everything in the dev/ folder onto your web server and everything should be good to go, Though you might want to minify your code first. There is a gulp file set up to automate that projecess and it will place the contents into the docs/ fodler. 

## Development
The code for the Version Ezreal is written in React. However, I rather dislike transpilers and build-chains, sure some amount of deploy pipeline such as code minification and the likes is probably a good thing but I dont believe in having to transpile code into other code. That's why the entire project is written in React without the use of JSX. It will take some getting used to for those of you who are used to the fancy features of Typescript or JSX but you wont find it here unfortunately.

Alot of the logic of the retreaval of the files is handled in the service worker so we'll start there. The service worker will map requrests coming from the app's UI to the proper location. The map for which URLs go to where is located at the top and is where dependencies are declared. Because the app uses ES6 Import statements. The CDN of choice is [https://esm.sh/](https://esm.sh/). The rest of the app is just what you'd normally expect out of a React app with index.js being the place where the app start.

The card rendering is probably the most important part of the app and it is done using a mix of SVGs and standard HTML or more specifically, HTML wrapped inside an SVG which allow for word wrap and dynamic scailability. Theres 3 main type of cards that have their individual renders, units (including landmarks), spells and keywords. All unit based cards such as followers and landmarks are extensions of the base Unit class and just aguments it a bit. 

Keywords can be added by adjusting the keywords list in `/dev/app/components/card-template/keyword-renderer.js`. The list contains the name of the keyword and the image icon associated with it, (if any). I assume that this is the most likely reason for wanting to host your own version of this app or even running it locally (at least until that feature is added so there you go.)