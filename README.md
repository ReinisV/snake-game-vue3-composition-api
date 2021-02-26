# snake game (Vue3 composition API + class based fully typesafe vuex)
I wanted to have fun while exploring the composition api so used the classic exercise of writing a snake game to do that. 

You can take a look at what the current result looks like here:
https://reinisv.github.io/snake-game-vue3-composition-api/snake

Fun features include the fact that the game is always fullscreen and adjusts to the width and height of the browser by becoming more compact. Try resizing while playing.

Stuff I could still do:

- write a backend app that can based on user-agent detect browser version and serve a custom build for the specific browser without including polyfills for others
- - and configure webpack to build for different target browsers
- - and a fallback script to return that just prints "your browser is unsupported, please try these:" or "your browser version is old, please update to at least Y" 

- after that I could write a visualizer for the code and reference tree contained in chunks again, would be fun

- styling
- - display score in the head of the snake #DONE
- - make corners of the snake rounded (make screen black) #DONE
- - increase speed/area of play by collecting points #KINDA-DONE
- - - there is still the bug of going over the page threshold when collecting a point that triggers 'crash state3'
- - add quick speed via hold down #DONE

- frontend related stuff
- - figure out union type props for vue
- - integrate vuex with simple-vuex and an object interface #DONE
- - and make state readonly for everyone, but mutations #DONE
- - add yaml package.json that can be commented
- - figure out how to eject (or most likely write an app for ejecting) webpack config (could be done based on the dynamic webpack config stored by the cli)


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
