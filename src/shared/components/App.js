import React, { Component } from 'react';
// import './styles.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import IdeaToolBar from './Toolbar';
import NavBar from './NavBar';
import Graph from './Graph';

const io = require('socket.io-client');

export default class App extends Component {
  constructor(props) {
    super(props);

    var placeholder = {
      nodes: [{"id": "panda", "score": 0},
              {"id": "china", "score": 1},
              {"id": "chubby", "score": 1},
              {"id": "black", "score": 1},
              {"id": "white", "score": 1}],
      links: [{"source": "panda", "target": "china", "type": "country"},
              {"source": "panda", "target": "chubby", "type": "adjective"},
              {"source": "panda", "target": "black", "type": "colour"},
              {"source": "panda", "target": "white", "type": "colour"}]
    }

    this.state = {
      data: {
        nodes: placeholder.nodes,  // []
        links: placeholder.links   // []
      },
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
      var currentGraphJSON = JSON.stringify(this.state.data);
      this.socket.emit('request', submitted, currentGraphJSON);
    };

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(json, newGraphJSON, currentGraphJSON){

      var data = {nodes: [], links: []};
      // var data = Object.assign({}, self.state.data);

      // var a = {"id": "newnode"}; //THIS WORKS
      // var b = {"id": "newnode2"};
      // var c = {"id": "newnode3"};
      // data.nodes.push(a);
      // data.nodes.push(b);
      // data.nodes.push(c);
      // var new_link = {"source": "newnode", "target": "newnode2", "type": "test"};
      // var new_link2 = {"source": "newnode", "target": "newnode3", "type": "test"};
      // data.links.push(new_link);
      // data.links.push(new_link2);
      // console.log(data);

      var newGraph = JSON.parse(newGraphJSON);    //THIS DOESN'T WORK
      // for(var i = 0 ; i < newGraph.nodes.length ; i++){
      //   data.nodes.push(newGraph.nodes[i]);
      // }
      // for(var j = 0 ; j < newGraph.links.length ; j++){
      //   data.links.push(newGraph.links[j])
      // }
      data.nodes = newGraph.nodes;
      data.links = newGraph.links;
      console.log(data);
      self.setState({data: data});
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="app" style={styles.container}>
          <NavBar style={styles.navbar}/>
          <div style={styles.displayArea}>
            <Graph
              graphType="force"
              data={this.state.data}
              width="1000" //should be screen size
              height="500"
            />
          </div>
          <IdeaToolBar className='toolbar' style={styles.toolbar}
              request={this.state.request}
              onTextChange={this.handleTextChange}
              onDegreeChange={this.handleDegreeSlideChange}
              onNumberChange={this.handleNumberSlideChange}
              onSubmit={this.handleSubmit}/>
        </div>
        </MuiThemeProvider>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%'
  },
  navbar: {},
  displayArea: {
    border:'1px solid #9E9EFF',
    marginTop: 15,
    marginBottom: 15,
    width: '92%'
  },
  toolbar: {
    bottom: '0%',
    position: 'fixed'
  }
};

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 60,
  },
  toolbar: {
    height: 90,
    width: '80%'
  }
});
