import React from 'react';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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
          style={{width: 125}}
        />
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
          style={{width:180}}
        />
    );
  }
}

export default class IdeaToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleNumberChange = this.handleNumberChange.bind(this);
  }

  handleNumberChange(event, index, value){
    this.props.onNumberChange(value);
  }

  render() {
    return (
      <div style={styles.container}>
      <Toolbar style={this.props.style}>
        <ToolbarGroup style={styles.toolbargroup}>
          <InputText
            text={this.props.request.text}
            onTextChange={this.props.onTextChange}
            onKeyPress={this.props.onKeyDown}/>
          <RaisedButton label="Search" primary={true} onClick={this.props.onSubmit}/>
          <ToolbarSeparator/>
        </ToolbarGroup>
      </Toolbar>
      <Toolbar>
        <ToolbarGroup style={styles.toolbargroup}>
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
        <ToolbarGroup style={styles.toolbargroup}>
          <ToolbarTitle text="#Suggestions" style={{fontSize:15}}/>
          <DropDownMenu
            value={this.props.request.numSuggestion}
            onChange={this.handleNumberChange}
            style={{width: 50}}
            autoWidth={false}>
              {numbers}
            </DropDownMenu>
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
