import React, { Component } from 'react';
// import './styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IdeaToolBar from './Toolbar';
import NavBar from './NavBar';
import Graph from './Graph';
import Json from '../../data/graph.json';

const io = require('socket.io-client');

var a = {word: "panda"};
var b = {word:"black"};
var c = {word:"china"};

export default class App extends Component {
  constructor(props) {
    super(props);

    var data = {
      nodes: [a, b, c],
      links: [{source: a, target: b}, {source: a, target: c}]
    };

    this.state = {
      data: data,  //Json
      request: {
        numSuggestion: 6,
        degConnection: 1,
        text: ''}
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberSlideChange = this.handleNumberSlideChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    this.socket = io();
    this.socket.on('connect', () =>{
      console.log('Connected to server. ' + this.socket.id);
    });
  }

  handleTextChange(value) {
    var request = this.state.request;
    request.text = value;
    this.setState({request:request});
  }

  handleDegreeSlideChange(value) {
    var request = this.state.request;
    request.degConnection = value;
    this.setState({request:request});
  }

  handleNumberSlideChange(value) {
    var request = this.state.request;
    request.numSuggestion = value;
    this.setState({request:request});
  }

  handleSubmit(event) {
    const submitted = {
      word: this.state.request.text,
      degConnection: this.state.request.degConnection,
      numSuggestion: this.state.request.numSuggestion
    };

    if(submitted.word.length > 0 && typeof submitted.word === 'string') {
      this.socket.emit('request', submitted, this.state.data);
    };

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(newGraph){
      self.setState({data: newGraph});
    });
  }

  render() {
    return (
        <div id="app" className='globalWrapper' style={styles.container}>
          <h2 style={styles.header}>The Ideator</h2>
          {/* <NavBar /> */}
          <div style={styles.displayArea}>
            <Graph
              graphType="force"
              data={this.state.data}
              width="950"
              height="500"
            />
          </div>
          <MuiThemeProvider>
            <IdeaToolBar className='toolbar'
              request={this.state.request}
              onTextChange={this.handleTextChange}
              onDegreeChange={this.handleDegreeSlideChange}
              onNumberChange={this.handleNumberSlideChange}
              onSubmit={this.handleSubmit}/>
          </MuiThemeProvider>
        </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Roboto', sans-serif"
  },
  header: {
    flex: '0 1 auto'
  },
  displayArea: {
    border:'5px solid #9E9EFF'
  }
};
