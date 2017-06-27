import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import NavBar from './NavBar';
import IdeaToolBar from './Toolbar';
import Graph from './Graph';
import AddIdeaDialog from './AddIdeaDialog';

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
        text: ''},
      snackbar: {
        open: false,
        message: ''
      },
      dialog: {
        open: false,
        idea: 'hi',
      },
      drawer: false,
      imageReq: false,
      download: false,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSnackBarMsg = this.handleSnackBarMsg.bind(this);
    this.handleDialogText = this.handleDialogText.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.toggleDownload = this.toggleDownload.bind(this);
    this.handleClearGraph = this.handleClearGraph.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handleImgToggle = this.handleImgToggle.bind(this);
    this.handleShowHistory = this.handleShowHistory.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateData = this.updateData.bind(this);
    this.nodeDoubleClick = this.nodeDoubleClick.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.reloadNode = this.reloadNode.bind(this);
    this.linkNodes = this.linkNodes.bind(this);

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
      this.handleSubmit(event);
    }
  }

  handleSnackbarClose(){
    var snackbar = {open: false, message: ''};
    this.setState({snackbar: snackbar});
  }

  handleSnackBarMsg(msg){
    var snackbar = {open: true, message: msg}
    this.setState({snackbar: snackbar})
  }

  handleDialogText(event){
    var dialog = this.state.dialog;
    dialog.idea = event.target.value;
    this.setState({dialog: dialog});
  }

  handleDialogClose(){
    var dialog = this.state.dialog;
    dialog.open = false;
    this.setState({dialog: dialog});
  }

  handleDialogSubmit(){
    var userNode = {
      "id": this.state.dialog.idea,
      "submitted": false,
      "isPinned": false,
      "isHidden": false,
      "user": true
    }
    var nodes = this.state.data.nodes.slice();
    nodes.push(userNode);
    var links = this.state.data.links.slice();
    var data = {nodes: nodes, links: links};
    this.setState({data: data});

    var dialog = {open: false, idea: ''};
    this.setState({dialog: dialog});
  }

  handleDownload(event){
    this.setState({download: true});
  }

  toggleDownload(){
    this.setState({download: !this.state.download})
  }

  handleImgToggle(event){
    var boolean = this.state.imageReq;
    this.setState({imageReq: !boolean});
  }

  handleClearGraph(event){
    var data = {nodes: [], links: []};
    this.setState({data: data});
    var snackbar = {open: true, message: 'Cleared Graph.'}
    this.setState({snackbar: snackbar});
  }

  handleAddNode(event){
    var dialog = {open: true, idea: ''};
    this.setState({dialog: dialog});
  }

  handleShowHistory(event){
    this.setState({drawer: true});
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
    history.unshift(submitted);
    this.setState({history: history});

    var req = this.state.request;
    req.text = '';
    this.setState({request: req});

    var self = this;
    this.socket.on('response', function(res){
      var result = JSON.parse(res);
      if(result !== 0 && result !== null){
        self.setState({data: result.newGraphJSON});
        var backUpData = result.backUpResults;
        if(backUpData.length > 0){
          var backUp = self.state.backUpData;
          backUp[submitted.word] = backUpData;
          self.setState({backUpData: backUp});
        }
      } else if (result === 0){
        var snackbar = {
          open: true,
          message: "No Ideas Found. Search something else!"};
        self.setState({snackbar: snackbar})
      } else if (result === null){
        var snackbar = {
          open: true,
          message: "Database is not connected."};
        self.setState({snackbar: snackbar})
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
  }

  reloadNode(newNodes, newLinks, backUpData){
    var data = {nodes: newNodes, links: newLinks};
    this.setState({data: data});
    this.setState({backUpData: backUpData});
  }

  linkNodes(newNodes, newLinks, link){
    this.socket.emit('linkNodes', link);
    var self = this;
    this.socket.on('linkNodesDone', function (result){
      var type = JSON.parse(result).type;
      if(type === 0){
        var snackbar = {open: true, message: 'No relationship found. Click the link to add one.'}
        self.setState({snackbar: snackbar});
        var data = {nodes: newNodes, links: newLinks};
        self.setState({data: data});
      } else {
        var i = 0;
        var link = JSON.parse(result).link;
        while(i < newLinks.length){
          if((newLinks[i].source.id === link.source.id && newLinks[i].target.id === link.target.id) ||
            (newLinks[i].source.id === link.target.id && newLinks[i].target.id === link.source.id) ){
            newLinks.splice(i, 1);
          } else {
            i++;
          }
        }
        var link = {
          source: link.source.id,
          target: link.target.id,
          type: type
        }
        newLinks.push(link);
        var data = {nodes: newNodes, links: newLinks};
        self.setState({data: data});
      }
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialogClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleDialogSubmit}
      />,
    ];

    const history = this.state.history.map(function (item, index) {
      return <ListItem key={index} primaryText={item.word} secondaryText={item.degConnection}/>
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div id="app" style={styles.container}>
          <NavBar/>
          <Paper className="svg-container" style={styles.displayArea} zDepth={1}>
            <Graph
              graphType="force"
              data={this.state.data}
              backUpData={this.state.backUpData}
              history={this.state.history}
              width="1000" //should be screen size
              height="450"
              nodeDoubleClick={this.nodeDoubleClick}
              removeNode={this.removeNode}
              reloadNode={this.reloadNode}
              linkNodes={this.linkNodes}
              imageReq={this.state.imageReq}
              snackbarMsg={this.handleSnackBarMsg}
              download={this.state.download}
              toggleDownload={this.toggleDownload}
              // svgRef={ el => this.svg = el}
            />
          </Paper>
          <IdeaToolBar
            style={styles.toolbar}
            request={this.state.request}
            imageReq={this.state.imageReq}
            onTextChange={this.handleTextChange}
            onDegreeChange={this.handleDegreeSlideChange}
            onNumberChange={this.handleNumberChange}
            onSubmit={this.handleSubmit}
            onKeyDown={this.handleKeyPress}
            onDownload={this.handleDownload}
            onClearGraph={this.handleClearGraph}
            onAddNode={this.handleAddNode}
            onImgToggle={this.handleImgToggle}
            onShowHistory={this.handleShowHistory}/>
          <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={5000}
            onRequestClose={this.handleSnackbarClose} />
          <AddIdeaDialog
            dialog={this.state.dialog}
            onTextChange={this.handleDialogText}
            onClose={this.handleDialogClose}
            onSubmit={this.handleDialogSubmit}/>
          <Drawer
            docked={false}
            width={200}
            open={this.state.drawer}
            openSecondary={true}
            onRequestChange={(drawer) => this.setState({drawer})}>
            <List>
              <Subheader inset={true}>Recent Searches</Subheader>
              {history}
            </List>
          </Drawer>
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
    width: '100%',
    flex: 1,
    marginBottom: 15,
    // height: '100%',
  },
  sidebar: {
    order: 2,
    width: '10%',
    height: '100%',
    alignSelf: 'center',
    display: 'flex',
  },
  toolbar: {
    marginBottom: 15,
    overflow: 'hidden',
    // position: 'absolute'
  },
};

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  // appBar: {
  //   height: 50,
  // },
});
