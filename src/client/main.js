import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from '../shared/components/App';
import ReactApp from '../shared/components/ReactApp';
injectTapEventPlugin();


ReactDOM.render(
  <App />,
  document.getElementById('main')
);


// ReactDOM.render(
//   <ReactApp />,
//   document.getElementById('main')
// );
