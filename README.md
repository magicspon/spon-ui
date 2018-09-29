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
