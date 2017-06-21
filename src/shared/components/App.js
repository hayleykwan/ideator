import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
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
        degConnection: 0.5,
        text: ''}
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
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

  handleNumberChange(value) {
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
    this.socket.on('response', function(res){
      var result = JSON.parse(res);
      if(result !== 0){
        self.updateData(result.newGraphJSON);
        var backUpData = result.backUpResults;
        if(backUpData.length > 0){
          var backUp = self.state.backUpData;
          backUp[submitted.word] = backUpData;
          self.setState({backUpData: backUp});
        }
      } else {
        // show notif
      }
    });
  }

  updateData(newGraph){
    this.setState({data: newGraph});
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
          <Paper className="columns" style={styles.column} zDepth={1}>
          <Paper className="svg-container" style={styles.displayArea} zDepth={1}>
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
          </Paper>
          <Paper className="sidebar" style={styles.sidebar} zDepth={1}>
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
          </Paper>
        </Paper>
          <IdeaToolBar style={styles.toolbar}
              request={this.state.request}
              onTextChange={this.handleTextChange}
              onDegreeChange={this.handleDegreeSlideChange}
              onNumberChange={this.handleNumberChange}
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
  relative: {
    position: 'relative'
  },
  column:{
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems:  'stretch',
    marginBottom: 15,
    // position: 'absolute'
  },
  displayArea: {
    order: 1,
    // border:'1px solid #9edbff',
    width: '90%',
    flex: 1,
    height: '100%',
  },
  sidebar: {
    order: 2,
    width: '8%',
    height: '100%',
    alignSelf: 'center',
    // border:'1px solid #9edbff',
  },
  toolbar: {
    marginBottom: 15,
    overflow: 'hidden',
    // position: 'fixed'
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
