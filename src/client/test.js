import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from '../shared/components/Welcome.jsx';
import Tut from '../shared/components/ReactApp.jsx';

ReactDOM.render(
  <Welcome name="H"/>,
  document.getElementById('hello')
);

ReactDOM.render(
  <Tut/>,
  document.getElementById('tut')
);
