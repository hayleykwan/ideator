import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from '../shared/components/Welcome.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import Tut from '../shared/components/ReactApp.jsx';
import IdeaToolBar from '../shared/components/Toolbar.jsx';

// ReactDOM.render(
//   <IdeaToolBar />,
//   document.getElementById('toolbar')
// )

ReactDOM.render(
  <Welcome name="H"/>,
  document.getElementById('hello')
);


const Bar = () => (
  <MuiThemeProvider>
    <IdeaToolBar />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

ReactDOM.render(
  <Bar />,
  document.getElementById('toolbar')
);
// ReactDOM.render(
//   <Tut/>,
//   document.getElementById('tut')
// );
