# react-app-rewire-typescript-hmr
Injects HMR to Create React App Typescript project

### Install dependecies on Create React App project

```
npm install @types/webpack @types/webpack-env @types/react-hot-loader react-app-rewired --save-dev
npm install react-hot-loader --save
npm install react-app-rewire-typescript-hmr --save-dev
```

End if you planing to use babel also do
```
npm install babel-loader --save-dev
```

Change your index.tsx looks like
```Javascript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.querySelector('#root')
  );
};

if (module.hot) {
  module.hot.accept();
}

render();

registerServiceWorker();
```

And create new file named `config-overrides.js` to start using react-app-rewired
```Javascript
const overrideTsLoader = require('react-app-rewire-typescript-hmr')

module.exports = function override(config, env) {
  config.entry = ['react-hot-loader/patch', ...config.entry];
  return overrideTsLoader(config);
}
```

If you want to use Babel pass true as second parameter of overrideTsLoader

Also you can pass array of babel loaders. For example to use Emotion call:
```Javascript
overrideTsLoader(config, true, [["emotion", { "sourceMap": true }]])
```

Last thing is do not forget to change `npm start` script to `react-app-rewired start --scripts-version react-scripts-ts`
