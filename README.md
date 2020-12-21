# hello-vue3
I wanted to have fun while exploring the composition api so used the classic exercise of writing a snake game to do that. 

Fun features include the fact that the game is always fullscreen and adjusts to the width and height of the browser by becoming more compact. Try resizing while playing.

Stuff I could still do:
- figure out how to eject (or most likely write an app for ejecting) webpack config (could be done based on the dynamic webpack config stored by the cli)
- write a backend app that can based on user-agent detect browser version and serve a custom build for the specific browser without including polyfills for others
- - and configure webpack to build for different target browsers
- - and a fallback script to return that just prints "your browser is unsupported, please try these:" or "your browser version is old, please update to at least Y" 
- after that I could write a visualizer for the code and reference tree contained in chunks again, would be fun


Interesting stuff to remember:
the following json enables autofixing of linting issues when added to `settings.json` of VSCode:
```
{
    "javascript.updateImportsOnFileMove.enabled": "always",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        {
            "language": "vue",
            "autoFix": true
        },
        {
            "language": "html",
            "autoFix": true
        },
        {
            "language": "javascript",
            "autoFix": true
        },
        {
            "language": "javascriptreact",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        }
    ],
}
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
