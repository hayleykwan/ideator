import React from 'react';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
// import {NumSuggestionSlider, DegConnectionSlider} from './Slider'
import Slider from 'material-ui/Slider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

const styles = {
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
};

const sliderNames = {
  deg: 'Degree of Connection',
  num: 'Number of Suggestions'
};

class CustomSlider extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value){ // must need event and value
    this.props.onSliderChange(value); //event.target.value is not defined
  }

  render() {
    const name = this.props.name
    return (
      <div>
        <p>{sliderNames[name]}</p>
        <Slider
          min={this.props.min} max={this.props.max}
          step={this.props.step}
          value={this.props.value}
          onChange={this.handleChange}
          style={{width: 150}}
        />
        <p>
          <span>{'Currently: '}</span>
          <span>{this.props.value}</span>
        </p>
      </div>
    );
  }
}

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    this.props.onTextChange(event.target.value);
  };

  render() {
    return (
        <TextField
          id="text-field-controlled"
          value={this.props.text}
          onChange={this.handleChange}
          floatingLabelText="Input text here"
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
    );
  }
}


export default class IdeaToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'E.g. panda',
      degConnection: 1,
      numSuggestion: 6
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDegreeSlideChange = this.handleDegreeSlideChange.bind(this);
    this.handleNumberSlideChange = this.handleNumberSlideChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(value) {
    this.setState({text: value})
  }

  handleDegreeSlideChange(value) {
    this.setState({degConnection: value})
  }

  handleNumberSlideChange(value) {
    this.setState({numSuggestion: value})
  }

  handleSubmit(event) {
    //pool text, numSuggestion, degConnection
    alert('Text: ' + this.state.text + '\n' +
          'Degree: ' + this.state.degConnection + '\n' +
          'Number: ' + this.state.numSuggestion);
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <InputText
            text={this.state.text}
            onTextChange={this.handleTextChange}/>
          <FlatButton label="Search" primary={true} onClick={this.handleSubmit}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <CustomSlider
            name="deg"
            min={0} max={1}
            step={0.10}
            value={this.state.degConnection}
            onSliderChange={this.handleDegreeSlideChange}
          />
          <CustomSlider
            name="num"
            min={1} max={8}
            step={1}
            value={this.state.numSuggestion}
            onSliderChange={this.handleNumberSlideChange}
          />
          {/* <DegConnectionSlider/>
          <NumSuggestionSlider/> */}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
