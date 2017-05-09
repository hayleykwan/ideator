import React, { Component } from 'react';
// import './styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IdeaToolBar from './Toolbar';
import NavBar from './NavBar';
import Graph from './Graph';
import Json from '../../data/graph.json';

const io = require('socket.io-client');
const dataUpdate = require('../../server/data-update');

export default class App extends Component {
  constructor(props) {
    super(props);

    var data = {
      nodes: [], //[a, b, c],
      links: []  //[{source: a, target: b}, {source: a, target: c}]
    };

    this.state = {
      data: Json,  //Json
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
    this.socket.on('response', function(json, newGraph){

      var data = {nodes: [], links: []}; //Object.assign({}, self.state.data);

      var new_node = {word: "newnode"}; //pushing new data each time
      var new_node2 = {word: "newnode2"};
      data.nodes.push(new_node);
      data.nodes.push(new_node2);
      var new_link = {source: data.nodes[0], target: data.nodes[1], type: "test"};
      data.links.push(new_link);

      // var new_node = {"word": "newnode", "length": 5};
      // var new_node2 = {"word": "newnode2", "length": 5};
      // data.nodes.push(new_node);
      // data.nodes.push(new_node2);
      // var new_link = {source: data.nodes[0], target: new_node2};
      // data.links.push(new_link);

      // var a = {word: "hi"};  //reset data
      // var b = {word: "black"};
      // var c = {word: "china"};
      // data.nodes= [a, b, c];
      // data.links = [{source: a, target: b}, {source: a, target: c}];

      // data.nodes = newGraph.nodes;
      // data.links = newGraph.links;

      // data = dataUpdate.update(data, submitted, json); //
      self.setState({data: data}); //newGraph
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
