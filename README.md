# angular2-quick-start-aspnet-core-vs2015

Angular 2 (rc0) 5 Minute QuickStart with ASP.NET 5 in Visual Studio 2015.

This repository aims to setup angular2 using the [5 Min QuickStart Guide](https://angular.io/docs/ts/latest/quickstart.html) using ASP.NET 5 in Visual Studio 2015.

## Perequisite

I'm using:

    * Visual Studio 2015 Community Update 2
    * ASP.NET and Web Tools 2015 (RC1 Update 1)
    * Typescript 1.8.30.0
    * Typings 0.8.1
    * NPM 3.8.8
    * Gulp 3.9.1

Visual Studio 2015 includes its own version of external tools, unfortunately these tools have not been updated causing errors with some required packages. 
To fix this we are going to force Visual Studio to use our global installs of node and npm.
Follow the instructions in the follow blog - [Customize external web tools in visual studio 2015](https://blogs.msdn.microsoft.com/webdev/2015/03/19/customize-external-web-tools-in-visual-studio-2015/).

### Setting up ASP.NET Core RC1

1. Follow instructions to [Install ASP.NET 5 on Windows](https://docs.asp.net/en/1.0.0-rc1/getting-started/installing-on-windows.html)

1. Upgrade to latest framework, in command prompt

    ```powershell
    > dnvm upgrade latest -r clr -arch x64
    ```

## 5 Min QuickStart

### Step 1. Create an empty ASP.NET Core project

1. Open Visual Studio 2015 and click *New Project...* on Start Page.

1. Create a new ***ASP.NET Web Application***
    ![Create ASP.NET Web Application](./assets/create-web-application.png)

1. Select ***Empty*** from *ASP.NET 5 Templates*
    ![Select Web API template](./assets/select-web-api-template.png)

### Step 2. Setup TypeScript

1. Create an ***App*** folder in the root of the project

1. Add a ***TypeScript JSON Configuration File*** in the newly created *App* folder. This will add a file called ***tsconfig.json***

1. Copy/paste the following into *tsconfig.json*

    ```json
    {
        "compilerOptions": {
            "target": "es5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false,
            "outDir": "../wwwroot/app"
        },
        "compileOnSave": true,
        "files": [
            "../typings/main.d.ts"
        ]
    }
    ```

1. Add a ***JSON File*** called ***typings.json*** to the root folder and copy/paste the following:

    ```json
    {
        "ambientDependencies": {
            "es6-shim": "registry:dt/es6-shim#0.31.2+20160317120654",
            "jasmine": "registry:dt/jasmine#2.2.0+20160412134438"
        }
    }
    ```

### Step 3. Adding packages

1. Add a ***NPM Configuration File*** in the root project file and copy/paste the following:

    ```json
    {
        "name": "angular2-quickstart",
        "version": "1.0.0",
        "scripts": {
            "start": "tsc && concurrently \"npm run tsc:w\" \"npm run lite\" ",
            "lite": "lite-server",
            "postinstall": "typings install",
            "tsc": "tsc",
            "tsc:w": "tsc -w",
            "typings": "typings"
        },
        "license": "ISC",
        "dependencies": {
            "@angular/common":  "2.0.0-rc.0",
            "@angular/compiler":  "2.0.0-rc.0",
            "@angular/core":  "2.0.0-rc.0",
            "@angular/http":  "2.0.0-rc.0",
            "@angular/platform-browser":  "2.0.0-rc.0",
            "@angular/platform-browser-dynamic":  "2.0.0-rc.0",
            "@angular/router-deprecated":  "2.0.0-rc.0",
            "@angular/upgrade":  "2.0.0-rc.0",

            "systemjs": "0.19.27",
            "es6-shim": "^0.35.0",
            "reflect-metadata": "^0.1.3",
            "rxjs": "5.0.0-beta.6",
            "zone.js": "^0.6.12",

            "angular2-in-memory-web-api": "0.0.5",
            "bootstrap": "^3.3.6"
        },
        "devDependencies": {
            "concurrently": "^2.0.0",
            "lite-server": "^2.2.0",
            "typescript": "^1.8.10",
            "typings":"^0.8.1",
            "gulp": "^3.9.1"",
            "del": "^2.2.0",
            "gulp-dest": "^0.2.3"
        }
    }
    ```

    Right after saving this, ASP.NET 5 starts restoring the packages.
    It will download all packages mentioned in dependencies section of above *package.json*.

### Step 4. Setting up GULP

When all the packages are downloaded they are placed in the *node_modules* folder in the root. 
However in ASP.NET 5, *wwwroot* is our public web folder that means any static files outside of it
wont be servered. We'll use GULP to copy them to *wwwroot/libs*.

1. Add a ***GULP Configuration File*** in the root project file and copy/paste the following:

        /// <binding AfterBuild='moveToLibs, moveToApp' Clean='clean' />
        var gulp = require('gulp');
        var del = require('del');
        var dest = require('gulp-dest');

        var paths = {
            app: ['app/**/*.ts'],
            libs: [
                'node_modules/es6-shim/es6-shim.min.js*',
                'node_modules/zone.js/dist/zone.js',
                'node_modules/reflect-metadata/Reflect.js',
                'node_modules/systemjs/dist/system.src.js'
            ],
            packages: [
                '@angular/common',
                '@angular/compiler',
                '@angular/core',
                '@angular/http',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic',
                '@angular/router',
                '@angular/testing',
                '@angular/upgrade'
            ],
            css: [
                'node_modules/bootstrap/dist/css/bootstrap.css',
                'styles/styles.css'
            ]
        };

        gulp.task('moveToLibs', function () {
            gulp.src(paths.libs).pipe(gulp.dest('./wwwroot/libs'));
            gulp.src(paths.libs).pipe(gulp.dest('./wwwroot/libs'));
            gulp.src('node_modules/rxjs/**/*.js').pipe(gulp.dest('./wwwroot/libs/rxjs'));

            for (var i = 0; i < paths.packages.length; i++) {
                gulp.src('node_modules/' + paths.packages[i] + '/*.js').pipe(gulp.dest('./wwwroot/libs/' + paths.packages[i]));
                gulp.src('node_modules/' + paths.packages[i] + '/src/**/*.js').pipe(gulp.dest('./wwwroot/libs/' + paths.packages[i] + '/src/'));
            }
        });

        gulp.task('moveToApp', function () {
            gulp.src(paths.app).pipe(gulp.dest('wwwroot/app'))
        });

        // clean all the generated typescript files
        gulp.task('clean', function () {
            return del(['wwwroot/app/**/*','wwwroot/libs/**/*']);
        });

### Step 5. Our first Angular Component

1. Add a ***TypeScript File*** named ***app.component.ts*** to our *App* folder and paste the following lines:

    ```typescript
    import {Component} from '@angular/core';

    @Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1>'
    })
    export class AppComponent { }
    ```

1. Update ***files*** property in *tsconfig.json* to look like

    ```json
    {
        ...
        "files": [
            "./app.component.ts",
            "../typings/main.d.ts"
        ]
    }
    ```

### Step 6. Bootstrap

1. Add a ***TypeScript File*** named ***main.ts*** to our *App* folder and paste the following lines:

    ```typescript
    import {bootstrap} from '@angular/platform-browser-dynamic';
    import {AppComponent} from './app.component';

    bootstrap(AppComponent);
    ```

1. Update ***files*** property in *tsconfig.json* to look like

    ```json
    {
        ...
        "files": [
            "./app.component.ts",
            "./main.ts",
            "../typings/main.d.ts"
        ]
    }
    ```

### Step 7. Add index.html

1. Add a ***HTML Page*** named ***index.html*** to our *wwwroot* folder and paste the following lines:

    ```html
    <html>
        <head>
            <title>Angular 2 QuickStart</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <link rel="stylesheet" href="libs/css/styles.css">
            <link rel="stylesheet" href="libs/css/bootstrap.css">

            <!-- 1. Load libraries -->
            <!-- Polyfill(s) for older browsers -->
            <script src="libs/es6-shim.min.js"></script>
            <script src="libs/zone.js"></script>
            <script src="libs/Reflect.js"></script>
            <script src="libs/system.src.js"></script>

            <!-- 2. Configure SystemJS -->
            <script src="systemjs.config.js"></script>
            <script>
                System.import('app').catch(function (err) { console.error(err); });
            </script>
        </head>

        <!-- 3. Display the application -->
        <body>
            <my-app>Loading...</my-app>
        </body>
    </html>
    ```

1. Add support in ASP.NET 5 for static files.

    1. Update ***project.json*** in the root folder, copy/paste the following:

        ```json
        {
            "version": "1.0.0-*",
            "compilationOptions": {
                "emitEntryPoint": true
            },

            "dependencies": {
                "Microsoft.AspNet.IISPlatformHandler": "1.0.0-rc1-final",
                "Microsoft.AspNet.Server.Kestrel": "1.0.0-rc1-final",
                "Microsoft.AspNet.StaticFiles": "1.0.0-rc1-final"
            },

            "commands": {
                "web": "Microsoft.AspNet.Server.Kestrel"
            },

            "frameworks": {
                "dnx46": { },
                "dnxcore50": { }
            },

            "exclude": [
                "wwwroot",
                "node_modules"
            ],
            "publishExclude": [
                "**.user",
                "**.vspscc"
            ]
        }
        ```

    1. Update ***Configure()*** in *Startup.cs* in the root folder

        ```csharp
        public void Configure(IApplicationBuilder app)
        {
            app.UseIISPlatformHandler();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
        ```

### Step 8. Configure module loader

1. Add a ***JavScript File*** named ***systemjs.config.js*** to the *wwwroot* folder and paste the following lines:

    ```javascript
    (function(global) {

        // map tells the System loader where to look for things
        var map = {
            'app':                        'app', // 'dist',
            'rxjs':                       'libs/rxjs',
            'angular2-in-memory-web-api': 'libs/angular2-in-memory-web-api',
            '@angular':                   'libs/@angular'
            };

            // packages tells the System loader how to load when no filename and/or no extension
        var packages = {
            'app':                        { main: 'main.js',  defaultExtension: 'js' },
            'rxjs':                       { defaultExtension: 'js' },
            'angular2-in-memory-web-api': { defaultExtension: 'js' },
            };

        var packageNames = [
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/router',
            '@angular/testing',
            '@angular/upgrade',
            ];

            // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
            packageNames.forEach(function(pkgName) {
            packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
            });

            var config = {
                map: map,
                    packages: packages
            }

            // filterSystemConfig - index.html's chance to modify config before we register it.
            if (global.filterSystemConfig) { global.filterSystemConfig(config); }

        System.config(config);

    })(this);
    ```

### Step 9. Add Styles

1. Create a ***styles** folder in the root project folder

1. Add a ***Style Sheet*** named ***styles.css*** to the *styles* folder and paste the following lines:

    ```css
    /* Master Styles */
    h1 {
        color: #369;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 250%;
    }
    h2, h3 {
        color: #444;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: lighter;
    }
    body {
        margin: 2em;
    }
    body, input[text], button {
        color: #888;
        font-family: Cambria, Georgia;
    }

    /*
    * See https://github.com/angular/angular.io/blob/master/public/docs/_examples/styles.css
    * for the full set of master styles used by the documentation samples
    */
    ```
    
### Step 10. Build and run

1. Press ***F5*** in Visual Studio, a browser tab should open with *My First Angular 2 App* displayed

## Resources

The following resources were used to fill in the blanks

* [Angular 2 - 5 Min QuickStart](https://angular.io/docs/ts/latest/quickstart.html)

* [Starting Angular 2 in ASP.NET 5 with TypeScript using Visual Studio 2015](http://www.mithunvp.com/angular-2-in-asp-net-5-typescript-visual-studio-2015/)

* [TypeScript Handbook - ASP.NET Core Tutorial](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/tutorials/ASP.NET%20Core.md)

