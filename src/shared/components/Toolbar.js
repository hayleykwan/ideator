import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500} from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Export from 'material-ui/svg-icons/file/file-download';
import Clear from 'material-ui/svg-icons/action/delete';
import Add from 'material-ui/svg-icons/content/add-circle';
import Image from 'material-ui/svg-icons/image/image';
import History from 'material-ui/svg-icons/action/history'

class CustomSlider extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value){ // must need event and value
    this.props.onSliderChange(value); //event.target.value is not defined
  }

  render() {
    return (
      <div>
        <tspan>&nbsp;&nbsp;</tspan>
        <Slider
          min={this.props.min} max={this.props.max}
          step={this.props.step}
          value={this.props.value}
          onChange={this.handleChange}
          style={{width: 125}} />
      </div>
    );
  }
}

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event){
    this.props.onTextChange(event.target.value);
  };

  handleKeyPress(event){
    this.props.onKeyPress(event);
  }

  render() {
    return (
        <TextField
          value={this.props.text}
          onChange={this.handleChange}
          hintText="Input text here"
          hintStyle={styles.floatingLabelStyle}
          onKeyPress={this.handleKeyPress}
          style={{width:180}} />
    );
  }
}

export default class IdeaToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleClearGraph = this.handleClearGraph.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handleImageToggle = this.handleImageToggle.bind(this);
    this.handleShowHistory = this.handleShowHistory.bind(this);
  }

  handleNumberChange(event, index, value){
    this.props.onNumberChange(value);
  }

  handleDownload(event){
    this.props.onDownload(event);
  }
  handleClearGraph(event){
    this.props.onClearGraph(event);
  }
  handleAddNode(event){
    this.props.onAddNode(event);
  }
  handleImageToggle(event){
    this.props.onImgToggle(event);
  }
  handleShowHistory(event){
    this.props.onShowHistory(event);
  }

  render() {
    return (
      <div style={styles.container}>
      <Toolbar style={this.props.style}>
        <ToolbarGroup>
          <InputText
            text={this.props.request.text}
            onTextChange={this.props.onTextChange}
            onKeyPress={this.props.onKeyDown}/>
          <RaisedButton label="Search" primary={true} onClick={this.props.onSubmit}/>
          <ToolbarSeparator/>
        </ToolbarGroup>
      </Toolbar>
      <Toolbar>
        <ToolbarGroup>
          <label>Lateral&nbsp;&nbsp;</label>
          <CustomSlider
            min={0} max={1}
            step={0.10}
            value={this.props.request.degConnection}
            onSliderChange={this.props.onDegreeChange}
          />
          <label>&nbsp;&nbsp;Literal</label>
          <ToolbarSeparator/>
        </ToolbarGroup>
      </Toolbar>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="#Suggestions" style={{fontSize:15}}/>
          <DropDownMenu
            value={this.props.request.numSuggestion}
            onChange={this.handleNumberChange}
            style={{width: 50}}
            autoWidth={false}>
              {numbers}
            </DropDownMenu>
            <ToolbarSeparator/>
        </ToolbarGroup>
      </Toolbar>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="More" style={{fontSize:15}}/>
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            touchTapCloseDelay={1000}>
            <MenuItem primaryText="Download" rightIcon={<Export/>}
              onTouchTap={this.handleDownload}/>
            <MenuItem primaryText="History" rightIcon={<History/>}
              onTouchTap={this.handleShowHistory}/>
            <Divider/>
            <MenuItem primaryText="Clear Graph" rightIcon={<Clear/>}
              onTouchTap={this.handleClearGraph}/>
            <MenuItem primaryText="Add Idea" rightIcon={<Add/>}
              onTouchTap={this.handleAddNode}/>
            <Divider/>
            <MenuItem  checked={this.props.imageReq} primaryText="Image" rightIcon={<Image/>}
              onTouchTap={this.handleImageToggle}/>
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
      </div>
    );
  }
}

const numbers = [];
for(var i = 1 ; i < 9 ; i++){
  numbers.push(<MenuItem value={i} key={i} primaryText={i}/>)
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: orange500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
  // toolbargroup: {
  //   margin: 10,
  // },
};
