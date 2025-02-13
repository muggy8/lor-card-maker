# About
Hi there, this is a LoR card maker mainly designed for Mobile devices. The live version of this app is located at [https://muggy8.github.io/lor-card-maker/](https://muggy8.github.io/lor-card-maker/). The app works in your browser and you don't even have to install anything (yay). If you're facing any issues, feel free to head over to the issues section and leave a comment and I'll try to get to it when I can.

## Support my work

<a href="https://www.buymeacoffee.com/muggyate" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Todo:
- ~~custom keywords~~
- ~~improve performance~~
- ~~PWA share support~~
- ~~Google Play App~~
- re-introduce art URL
- re-introduce artist input
- ~~custom card deck builder~~
- ~~custom card stats "card" in the export~~
- ~~Exported image compression to reduce file size~~
- Add search for created library
- ~~Add data export~~
- Save batches
- toggle for "Made with LoRCaM"
- better user feedback when error happens
- improve code quality
- custom regions

## Running Locally
The project is split into 2 version, the old version which we'll call Version Darius is located in the v1_(depricated)/ folder and is no longer being maintained. The current version which we'll call Version Ezreal is located in the dev/ folder. Version Ezreal is the version that you'll see when you visit [https://muggy8.github.io/lor-card-maker/](https://muggy8.github.io/lor-card-maker/).

To run the app locally, you'll need NodeJS, NPM and Git. Clone this repo using git and then execute the command `npm install` within the project folder to get dependencies. Then you can feel free to run `npm start` from  within the project folder to start the development server.

If you want to deploy your own version of the app, you can just put everything in the dev/ folder onto your web server and everything should be good to go, Though you might want to minify your code first. There is a gulp file set up to automate that process and it will place the contents into the docs/ folder.

## Development
The code for the Version Ezreal is written in React. However, I rather dislike transpilers and build-chains, Some amount of deploy pipeline such as code minification and the likes is probably a good thing but I dont believe in having to transpile code into other code. That's why the entire project is written in React without the use of JSX. It will take some getting used to for those of you who are used to the fancy features of Typescript or JSX but you wont find it here unfortunately.

Alot of the logic of the retrieval of the files is handled in the service worker so we'll start there. The service worker will map requests coming from the app's UI to the proper location. The map for which URLs go to where is located at the top and is where dependencies are declared. The app uses ES6 Import statements. The CDN of choice is [https://esm.sh/](https://esm.sh/) with some requests going to [cdn.jsdelivr.net](cdn.jsdelivr.net) things related to riot's api. The rest of the app is just what you'd normally expect out of a React app with index.js being the place where the app start.

The card rendering is probably the most important part of the app and it is done using a mix of SVGs and standard HTML or more specifically, HTML wrapped inside an SVG which allow for word wrap and dynamic scalability. Theres 3 main type of cards that have their individual renders, units (including landmarks), spells and keywords. All unit based cards such as followers and landmarks are extensions of the base Unit class and just augments it a bit.

## FAQ

### The website doesn't work (on my iPhone)
Sorry, there's nothing I can do about this. Safari is basically the worst widely used web browser in the world and has many basic browser functionality that's missing, horrendously bugged, or behaves in a completely different way. This means that apps written for the average internet user using Chrome or Firefox will need extensive overhauling for iOS with these idiosyncrasies in mind and as someone who doesn't own an iPhone, this isn't something I feel motivated to do.

### The website doesn't work (on my iPhone, but I'm not using Safari)
Unfortunately, Apple has basically made safari the only browser on the iPhone and forced all other browsers to be re-skins of safari. They claim that they did this in the name of "security" but in reality, it's to protect their monopolistic hold on the apple ecosystem as web apps like this app can skirt around the appstore and offer app like experiences to the user. 

### The website doesn't work (on my android phone)
This is likely because you're using an older version of your browser. If you tried again using an updated version of a Chromium based browser or Firefox, it should work.

### The website crashed / crashes alot
Sorry, this is probably my fault. There's alot of inefficiencies all across the app and they add up. I'll have to slowly weed them out over time.

### Is there an app version (for my android phone)?
Yes. there's 2 ways to install it. The recommended way is using the PWA feature of modern browsers. If you tap the menu button on your browser, you'll see the option to "Install This App" or "Add To Homescreen". This will effectively let you use the site as a standalone app. The other option is to install it from the [Google Play Store](https://play.google.com/store/apps/details?id=com.muggy8.lor_card_maker&hl=en&gl=US) but do know that this is basically the same as the PWA method but extra steps and more bugs because I'm not that familiar with android development.

### Can I submit code changes?
Yes please! I am just a single person. Feel free to change anything to fit your needs. I'd be happy to accept most change as long as they're made in good faith.

### Can I request for a feature? 
Please feel free to; but I cant promise I'll be able to get to it any time soon or at all (you see the todo list above right xP). But you know what'd get a feature added super fast with a 99.999% success rate? Submitting code for a feature ;)
