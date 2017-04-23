import React, { Component } from 'react';

{/*
Written in ES6,
needs babel to transpile into ES5,
which is more common in browsers
  */}

class Welcome extends Component {
  render() {
    return <h1>Welcome, {this.props.name}</h1>;
  }
}


{/*
 function Welcome(props) {
   return <h1>Welcome, {props.name}</h1>;
 }
*/}

export default Welcome;
