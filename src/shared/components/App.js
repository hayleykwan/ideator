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
      data: placeholder,
      request: {
        numSuggestion: 6,
        degConnection: 1,
        text: ''}
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberSlideChange = this.handleNumberSlideChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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

  handleKeyPress(event){
    if (event.key === 'Enter') {
      console.log('Clicked Enter!');
      this.handleSubmit(event);
    }
  }

  handleSubmit(event) {
    const submitted = {
      word: this.state.request.text,
      degConnection: this.state.request.degConnection,
      numSuggestion: this.state.request.numSuggestion
    };

    if(submitted.word.length > 0 && typeof submitted.word === 'string') {
      const currentGraphJSON = JSON.stringify(this.state.data);
      this.socket.emit('request', submitted, currentGraphJSON);
    };

    //clear text input
    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(newGraphJSON){
      self.setState({data: JSON.parse(newGraphJSON)});
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="app" style={styles.container}>
          <NavBar/>
          <div className="svg-container" style={styles.displayArea}>
            <Graph
              graphType="force"
              data={this.state.data}
              width="1000" //should be screen size
              height="420"
            />
          </div>
          <IdeaToolBar style={styles.toolbar}
              request={this.state.request}
              onTextChange={this.handleTextChange}
              onDegreeChange={this.handleDegreeSlideChange}
              onNumberChange={this.handleNumberSlideChange}
              onSubmit={this.handleSubmit}
              onKeyDown={this.handleKeyPress}/>
        </div>
        </MuiThemeProvider>
    );
  }
}


const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  displayArea: {
    // display: 'inline-block',
    // position: 'relative',
    flex: 1,
    border:'1px solid #9edbff',
    marginTop: 15,
    marginBottom: 15,
    width: '98%',
  },
  toolbar: {
    paddingTop: 30,
    height: 80,
    marginBottom: 15,
    overflow: 'hidden',
  },
};

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});
