import React, { Component } from 'react';
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

    this.state = {
      data: {nodes: [], links: []},
      backUpData: {},
      history: [],
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
    this.updateData = this.updateData.bind(this);
    this.nodeDoubleClick = this.nodeDoubleClick.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.reloadNode = this.reloadNode.bind(this);
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

  handleSubmit(nodeWord) {
    var wordToSubmit = (this.state.request.text === '') ? nodeWord : this.state.request.text;
    const submitted = {
      word: wordToSubmit, //this.state.request.text || nodeWord,
      degConnection: this.state.request.degConnection,
      numSuggestion: this.state.request.numSuggestion
    };

    if(submitted.word.length > 0 && typeof submitted.word === 'string') {
      const currentGraphJSON = JSON.stringify(this.state.data);
      this.socket.emit('search', submitted, currentGraphJSON);
    };

    var history = this.state.history;
    history.push(submitted);
    this.setState({history: history});

    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(newGraphJSON, backUpDataResults){
      var backUpData = JSON.parse(backUpDataResults);
      if(newGraphJSON !== 0){
        self.updateData(newGraphJSON);
      } else {
        // show notif that no results
      }
      if(backUpData.length > 0){
        var backUp = self.state.backUpData;
        backUp[submitted.word] = backUpData;
        self.setState({backUpData: backUp});
      }
    });
  }

  updateData(newGraphJSON){
    this.setState({data: JSON.parse(newGraphJSON)});
  }

  nodeDoubleClick(nodeWord){
    this.handleSubmit(nodeWord);
  }

  removeNode(newNodes, newLinks){
    var data = {nodes: newNodes, links: newLinks};
    this.setState({data: data});
    // console.log(this.state.data);
  }

  reloadNode(newNodes, newLinks, backUpData){
    var data = {nodes: newNodes, links: newLinks};
    this.setState({data: data});
    this.setState({backUpData: backUpData});
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
              backUpData={this.state.backUpData}
              history={this.state.history}
              width="1000" //should be screen size
              height="420"
              nodeDoubleClick={this.nodeDoubleClick}
              removeNode={this.removeNode}
              reloadNode={this.reloadNode}
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
