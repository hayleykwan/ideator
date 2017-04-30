import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IdeaToolBar from './Toolbar';
import ForceGraph from './ForceGraph';
import Json from '../../data/graph.json';

const io = require('socket.io-client');
const datamuse = require('datamuse');

export default class App extends Component {
  constructor(props) {
    super(props);

    const placeholder = {
      try: 'removing some whitespace!',
      then: ['then', 'click', 'format']
    };

    this.state = {
      value: JSON.stringify(placeholder, null, 4), //not needed
      graphjson: Json,
      txtClass: styles.textArea, //not needed
      request: {
        numSuggestion: 6,
        degConnection: 1,
        text: ''}
    };

    this.saveText = this.saveText.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberSlideChange = this.handleNumberSlideChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount(){
    this.socket = io();
    this.socket.on('connect', () =>{
      console.log('Connected to server. ' + this.socket.id); //works
    });
  }

  saveText(e) {
    this.setState({value: e.target.value});
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
      console.log(this.state.graphjson);
      this.socket.emit('request', submitted, this.state.graphjson);
    };

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(json, newGraph){
      const jsonRes = JSON.stringify(json, null, 2);
      self.setState({value: jsonRes});
      self.setState({graphjson: newGraph});
    });
  }

  render() {
    return (
        <div id="app" style={styles.container}>
          <h1 style={styles.header}>The Ideator</h1>
          <div style={styles.displayArea}>
            <textarea //not needed
              rows="30"   cols="30"
              value={this.state.value}
              style={this.state.txtClass}
              onChange={this.saveText}>
            </textarea>
            <ForceGraph
              width="400" height="400"
              json={this.state.graphjson}
            />
          </div>
          <MuiThemeProvider>
            <IdeaToolBar
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
  textArea: {
    flex: '0 1 auto',
    fontFamily: 'monospace'
  },
  displayArea: {
    display: 'flex',
    flexDirection: 'row'
  }
};
