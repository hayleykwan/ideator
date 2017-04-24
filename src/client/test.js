import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from '../shared/components/Welcome.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Tut from '../shared/components/ReactApp.jsx';
import IdeaToolBar from '../shared/components/Toolbar.jsx';


ReactDOM.render(
  <Welcome name="H"/>,
  document.getElementById('hello')
);

ReactDOM.render(
  <Tut />,
  document.getElementById('tut')
);

const Bar = () => (
  <MuiThemeProvider>
    <IdeaToolBar />
  </MuiThemeProvider>
);

ReactDOM.render(
  <Bar />,
  document.getElementById('toolbar')
);
// ReactDOM.render(
//   <Tut/>,
//   document.getElementById('tut')
// );
