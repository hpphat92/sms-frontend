# How To Run
1. Install NodeJS >= 6.2.2
2. Register your kendo ui trial first by goes to this link: `http://www.telerik.com/kendo-angular-ui/getting-started/` login with your account and click `Register For Trial`. Then following the doc to `Add the Progress NPM Registry`
3. Install global dependencies `$ npm install -g webpack webpack-dev-server karma-cli protractor typescript`
4. Install project dependencies `$ npm install`
5. Start development server `$ npm run server`
6. Go to http://0.0.0.0:3200 or http://localhost:3200 in your browser

# Deployment
```
$ npm run build:deploy:<profile>
```
- `<profile>`: Could be `nois`, `staging`, `production`. Please adjust configuration for those profile in `app/config/deploy.config.js`

## How to create new profile?
- Clone following files: `config/deploy/development.js`, `config/vars/development.js` then adjust values for your environment. 
E.g: `config/deploy/<your new profile name>.js`, `config/vars/<your new profile name>.js`
- Open `package.json`, add following code to `scripts`
```
{
  ...
  scripts: {
    ...
    "build:<your new profile name>": "npm run build:aot:prod -- --env.profile=<your new profile name>",
    "deploy:<your new profile name>": "node deploy <your new profile name>",    
    "build:deploy:<your new profile name>": "npm run build:<your new profile name> && node deploy <your new profile name>",
  }
  ...
}
```

# File Structure
```
angular2-starter/
 ├──config/                        * our configuration
 │   ├──helpers.js                 * helper functions for our configuration files
 │   ├──spec-bundle.js             * ignore this magic that sets up our angular 2 testing environment
 │   ├──karma.conf.js              * karma config for our unit tests
 │   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──src/                           * our source files that will be compiled to javascript
 │   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 │   ├──index.html                 * Index.html: where we generate our index page
 │   │
 │   ├──polyfills.ts               * our polyfills file
 │   │
 │   ├──app/                       * WebApp: folder
 │   │   ├──shared/                * our shared components, services, pipes, directives, modules for entire app
 │   │   ├──app.module.ts          * App Module
 │   │   ├──app.routes.ts          * Route configuration
 │   │   ├──app.component.spec.ts  * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts             * a simple end-to-end test for /
 │   │   ├──app.firebase.ts        * Firebase configuration
 │   │   └──app.component.ts       * a simple version of our App component components
 │   │
 │   ├──assets/                    * static assets are served here
 │   │   ├──icon/                  * our list of favicon icons
 │   │   ├──service-worker.js      * ignore this. Web App service worker that's not complete yet
 │   │   ├──robots.txt             * for search engines to crawl your website
 │   │   └──humans.txt             * for humans to know who the developers are
 │   │
 │   └──styles/                    * Our Starter styles
 |       └──styles.scss            * Our Vendor styles
 │
 ├──tslint.json                    * typescript lint config
 ├──typedoc.json                   * typescript documentation generator
 ├──tsconfig.json                  * typescript config used outside webpack
 ├──tsconfig.webpack.json          * config that webpack uses for typescript (AoT)
 ├──package.json                   * what npm uses to manage it's dependencies
 └──webpack.config.js              * webpack main configuration file
```

# Generate favicons
1. Make sure you have file `favicon.png` in `src/app/icon` exist and have size at least `250x250`
2. Install ImageMagick (Version >= 7.0.4-7-Q16)
    - For Windows: https://www.imagemagick.org/script/download.php
    - For Mac OSX: `$ brew install imagemagick`
3. Generate favicons
    - For Windows: `$ .\config\favicons\convert.bat`
    - For Mac OSX: 

# AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public
- If funtion's paremeters can be null (not passed), set default value for that parameters. Don't use `getColor(flag)`, use `getColor(flag: string = '')` OR it cause the issue `Supplied parameters do not match any signature of call target`
- When use `ngOnChanges`, make sure you defined parameter for it. Don't use `ngOnChanges()`, use `ngOnChanges(changes: SimpleChanges)` OR it cause the issue `Supplied parameters do not match any signature of call target`

## How to add AoT support for unsupport module from github
1. Duplicate current `tsconfig.json` to `tsconfig-aot.json`. Modify following line code:
```
{
  "compilerOptions": {
    "noImplicitAny": false,           // required exactly
    "module": "es2015",               // required exactly
    "target": "ES5",                  // required exactly
	  "moduleResolution": "node",       // required exactly
    "emitDecoratorMetadata": true,    // required exactly
    "experimentalDecorators": true,   // required exactly
    "sourceMap": false,               // required exactly
    "declaration": true,              // required exactly
    "outDir": "./dist"                // required exactly
  },
  ...
  "angularCompilerOptions": {         // required exactly
    "genDir": "aot",
    "strictMetadataEmit": true
  }
  ...
}
```
2. Edit `package.json` add following code to scripts section:
```
{
...
scripts: {
  ...
  "build:aot": "rimraf build && ngc -p tsconfig-aot.json"
}
...
}
```
3. Make sure you have `typescript@^2.16`, all angular modules `@^2.3.1` in `devDependencies`
4. Make sure no angular modules declaration in `dependencies`
5. Edit `main` in `package.json` to `"main": "./dist/index.js"` or your main load file
6. Run `$ npm install` then `$ npm run build:aot`

# Troubleshooting
1. `Could not resolve <module> relative to ..app.module.ts`
    - Reason: <module> was not installed
    - Solution: Install <module>
2. `Unexpected value <module> imported by the module <Appmodule>`
    - Reason: metadata for module not found
    - Solution: Generate metadata file by running aot build on module
3. `Error encountered resolving symbol values statically. Calling function 'makeDecorator', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol NgModule ....`
	- Reason: UNKNOWN
	- Solution: remove `node_modules` from feature module	
4. `Template parse errors: Can't bind to 'some-component-directive' since it isn't a known property of 'some-element'...`
    - Reason: Module `some-component-directive` not import yet
    - Solution: Import `some-component-directive` module into App
5. `TypeError: Data must be a string or a buffer`
    - Reason: Wrong import/export
    - Resolution: Editing the following file: `node_modules/webpack/lib/dependencies/HarmonyExportImportedSpecifierDependency.js` and insert some log at line 144 to see error details:
```
updateHash(hash) {
  super.updateHash(hash);
  const hashValue = this.getHashValue(this.importDependency.module);

  if (this.importDependency.module != null){
     // console.log('Module resource: ', this.importDependency.module.resource);
  }else{
     console.log('\nFile not found: ', this.importDependency);
  }

  hash.update(hashValue);
}
```    
6. `Error: Can't resolve 'promise-polyfill'`
    - Reason: ...
    - Resolution: `$ npm install --save-extract promise-polyfill`