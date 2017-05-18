import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import injectTapEventPlugin from 'react-tap-event-plugin';

import App from '../shared/components/App';

injectTapEventPlugin();

// ReactDOM.render(
//   <App />,
//   document.getElementById('main')
// );


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('main')
  );
}

render(App);
//
// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../shared/components/App', () => {
    render(App);
  });
}
