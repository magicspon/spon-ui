# Spon-ui

## UI components built with tailwind, powered by Fractal, Gulp 4 and Webpack.

### Features

- Code splitting - via webpack
- Babel 7
- Gulp 4
- scss / postcss
- Remove unused css - via purges
- Fractal pattern library
- SVG symbols
- Handle any static file type, compress images, css, etc
- Integration with craftcms - via ournameismud/fractal
- eslint
- stylelint
- htmlhint
- prettier
- jest

## Getting started

- clone the repo
- install the dependencies (npm install / yarn)
- run `npm run gen-cert` to create https tokens
- `npm run start` will boot up the fractal server
- `npm run cms` will create a proxy server pointing to your domain name
- `npm run build:fractal` will generate a fractal ui build you can deploy to netlify with `npm run deploy`
- `npm run build` will create a production build to use with craftcms

### Directory structure

- `src/js/app.js` main entry point for webpack
- `src/scss/style.scss` main scss file, includes tailwind imports
- `src/templates/**` templates for fractal
- `src/docs` - documentation files used by fractal
- `static` - any static files that should be optimised and move to public. Any SVG prefixed with `ui-` will become an svg symbol
- `deploy` craftcms lives here
- `deploy/library` this is where the fractal build is goes
- `deploy/public` the public root folder
- `tmp` used in dev mode, ie `npm start`

### Dev mode

###### Start fractal server

`npm start`

###### With craft

`npm run cms`

### Builds

###### Create a library build

`npm run build:fractal`

###### Create a production build

`npm run build`

###### Build fractal components

`npm run build:components`

###### Create a static site from fractal pages (see docs below)

`npm run build:static`

### Unit and regression tests

###### Save a snapshot of components for regression testing

`npm run regression:reference`

###### Test against the snapshots with an optimised build

`npm run regression:test`

###### Approve previous regression tests

`npm run regression:approve`

###### Run any tests with jest

`npm run test`

###### Run tests in watch mode

`npm run test:watch`

###### Get a test coverage report

`npm run coverage`

### Deployment (netlify)

###### If you have netlify setup, you can deploy the fractal library with this

`npm run deploy`

### https

###### Create https certs for browsersync

`npm run gen-cert`

### Linting/formatting

###### Lint all the javascript feels

`npm run lint:js`

###### Format all the code with prettier

`npm run pretty`

###### Generate documentation

`npm run generate-docs`

### Fractal helpers

The following commands require `komp`: https://github.com/FrancisVega/komp (`npm i -g komp`)

###### Scaffold new objects/components/etc

`komp new --template fractal ./components/blob`

## Static Builds

To create a static site from fractal, create a “pages” folder in the fractal templates directory.

As with all fractal components, each page will need a unique name.

Create a /file/.config.js file for each page

The context object should have a ‘path’ prop that defines the pages pathname. Each generated page will be renamed to index.html and placed in a folder matching the path prop.

```javascript
module.exports = {
	context: {
		path: '/about/'
	}
}
```
