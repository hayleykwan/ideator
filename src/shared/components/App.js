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
      text: this.state.request.text,
      degConnection: this.state.request.degConnection,
      numSuggestion: this.state.request.numSuggestion
    };

    if(submitted.text.length > 0 && typeof submitted.text === 'string') {
      this.socket.emit('request', submitted);
    };

    var self = this;
    this.socket.on('response', function(json){
      console.log('I got a response');
      const jsonRes = JSON.stringify(json, null, 4);
      console.log(jsonRes);
      self.setState({value: jsonRes});
    });


    // const request = 'words?ml=' + submitted["text"] + '&max=' + submitted.numSuggestion;
    // var response = new Object(); //var o = {};
    //
    // function updateGraphJson(originalJsonObject, submittedObject, responseArray) {
    //
    //   var graph = originalJsonObject;
    //
    //   //check if the submittedObject is an object from originalJsonObject
    //   var isPresent = false;
    //   var newCentreNode;
    //
    //   for(var i = 0 ; i < originalJsonObject.nodes.length ; i++){
    //     isPresent = originalJsonObject.nodes[i].id == submittedObject.text;
    //     if(isPresent){
    //       newCentreNode = originalJsonObject.nodes[i];
    //     }
    //   }
    //
    //   if(!isPresent){
    //     newCentreNode = {
    //       id: submittedObject.text,
    //       size: 30,
    //       type: "circle",
    //       score: 0
    //     };
    //     graph.nodes.push(newCentreNode);
    //
    //     for(var j = 0 ; j < responseArray.length ; j++){
    //       var newResponseNode = {
    //         id: responseArray[j].word,
    //         size: 30,
    //         type: "circle",
    //         score: responseArray[j].score
    //       };
    //       graph.nodes.push(newResponseNode);
    //
    //       var newLink = {
    //         source: newCentreNode,
    //         target: newResponseNode
    //       }
    //       graph.links.push(newLink);
    //     }
    //   } else {
    //     for(var j = 0 ; j < responseArray.length ; j++){
    //       var newResponseNode = {
    //         id: responseArray[j].word,
    //         size: 30,
    //         type: "circle",
    //         score: responseArray[j].score
    //       };
    //       graph.nodes.push(newResponseNode);
    //
    //       var newLink = {
    //         source: newCentreNode,
    //         target: newResponseNode
    //       }
    //       graph.links.push(newLink);
    //     }
    //   }
    //   return graph;
    // }

    // datamuse.request(request)
    // .then((json) => { //json is an array of objects
    //   console.log(json);
    //   const response = JSON.stringify(json, null, 4); //convert JS object to JSON string
    //   this.setState({value: response}); //for display in textarea
    //   var graph = updateGraphJson(this.state.graphjson, submitted, json);
    //   this.setState({graphjson: graph});
    //   console.log(this.state.graphjson); //object
    // });

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});
  }

  render() {
    return (
        <div id="app" style={styles.container}>
          <h1 style={styles.header}>The Ideator</h1>
          <div style={styles.displayArea}>
            <textarea
              rows="30"   cols="30"
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
