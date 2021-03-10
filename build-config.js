const execSync = require('child_process').execSync;
const fs = require('fs');

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.split(search).join(replacement);
};

const jsStart = 'exports.default = ';

const postCssConfig = `{
    loader: 'C:\\\\Users\\\\Reinis\\\\Desktop\\\\code\\\\snake-game-vue3-composition-api\\\\node_modules\\\\postcss-loader\\\\src\\\\index.js',
    options: {
      sourceMap: false,
      plugins: [
        function creator() {
          var transformer = initializer.apply(void 0, arguments);
          transformer.postcssPlugin = name;
          transformer.postcssVersion = new _processor.default().version;
          return transformer;
        }
      ]
    }
  }`;

// const postCssConfig = 'function creator() {';

const vueOutput = execSync('vue inspect -v', { encoding: 'utf-8' }).replaceAll(postCssConfig, 'postCssLoader');

const finishedCode = `const postCssLoader = ${postCssConfig}\n\n` + jsStart + vueOutput;

fs.writeFileSync('webpack.dev.config.ts', finishedCode);
console.log('Done');
