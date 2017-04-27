import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IdeaToolBar from './Toolbar';
import ForceGraph from './ForceGraph';
import Json from '../../data/graph.json';

const datamuse = require('datamuse');

export default class App extends Component {
  constructor(props) {
    super(props);

    const placeholder = {
      try: 'removing some whitespace!',
      then: ['then', 'click', 'format']
    };

    this.state = {
      value: JSON.stringify(placeholder, null, 4),
      graphjson: Json,
      txtClass: styles.textArea,
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
      text: this.state.request.text,
      degConnection: this.state.request.degConnection,
      numSuggestion: this.state.request.numSuggestion
    }

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    const request = 'words?ml=' + submitted["text"] + '&max=' + submitted.numSuggestion;
    var response = new Object(); //var o = {};

    datamuse.request(request)
    .then((json) => {
      console.log(json);
      const response = JSON.stringify(json, null, 4); //convert JS object to JSON string
      this.setState({value: response});
      // var graph = createGraphJson(response);  //TODO
      // this.setState({graphjson: graph});  //TODO
      console.log(this.state.graphjson);
    });

    // alert('User input: ' + submitted['text'] + '; degree: ' + submitted['degConnection'] + '; number: ' + submitted['numSuggestion'] + '\n' +
    //       'Submitted request: ' + request + '\n' +
    //       'response: '+ response);
  }

  render() {
    return (
        <div id="app" style={styles.container}>
          <h1 style={styles.header}>The Ideator</h1>
          <div style={styles.displayArea}>
            <textarea
              rows="30"   cols="50"
              value={this.state.value}
              style={this.state.txtClass}
              onChange={this.saveText}>
            </textarea>
            <ForceGraph
              width="400" height="400"
              // data={this.state.graphjson} //TODO
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
