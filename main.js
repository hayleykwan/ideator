import React from 'react';
import ReactDOM from 'react-dom';
import ReactApp from './components/ReactApp.jsx';
import Welcome from './components/Welcome.jsx';
import Graph from './components/Graph.jsx';

ReactDOM.render(<ReactApp/>, document.getElementById('app'));

//took a sec to load
// function tick() {
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   );
//   ReactDOM.render(
//     element,
//     document.getElementById('app')
//   );
// }
// //calls ReactDOM.render() every second from a setInterval() callback
// setInterval(tick, 1000);
//
// //quick
const element = <Welcome name="H"/>;
ReactDOM.render(element, document.getElementById('welcome'));
