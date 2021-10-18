# MyCrossref

## Setup - required
```
npm install
```

### I want to...

#### run a hot-reloading dev server
```docker-compose up```

or

```
npm run serve
```

### compile and minify for production
```
npm run build
```

### run unit tests
```
npm run test:unit
```

### run end-to-end tests
```
npm run test:e2e
```

or (with GUI)

```
./run-cypress.sh -g
```

or (headless)

```
./run-cypress.sh
```

### lint and fix syntax
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Setup Yalc - so that JSON Forms will work while we work on it locally

Yalc is a package that makes it easier to work with node modules that you are working on. It allows you to pull in in-progress node modules to projects that depend on them, and automate the process of updating those dependencies as you make changes to the upstream module.

Install Yalc - https://github.com/wclr/yalc

Go to the directory holding the checked-out copy of JSON Forms Vueitfy renderers that you are working on locally - eg `~/my-dev-directory/jsonforms-vueitfy-renderers` - and run `yalc publish` to add the local package to your local Yalc repository (which is just a folder - usually `~/.yalc/packages`).

To watch for changes and automatically push out new version to dependent projects, run goto `jsonforms-vuetify-renderers/vue2-vuetify/` and run `nodemon -x 'yalc push'`.

Go to the root directory of this repo, and run `yalc add @jsonforms/vue2-vuetify` to pull in the dependency from your local `~/.yalc` package repository.
