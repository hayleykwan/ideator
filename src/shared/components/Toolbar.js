import React from 'react';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

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
    const name = this.props.name;
    return (
      <div>
        <label style={styles.sliderlabel}>
          <span>{sliderNames[name]}</span>
          <span>{': '}</span>
          <span>{this.props.value}</span>
        </label>
        <Slider
          min={this.props.min} max={this.props.max}
          step={this.props.step}
          value={this.props.value}
          onChange={this.handleChange}
          style={{width: 150}}
          id={name}
        />
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
          value={this.props.text}
          onChange={this.handleChange}
          hintText="Input text here"
          hintStyle={styles.floatingLabelStyle}
        />
    );
  }
}

export default class IdeaToolBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Toolbar style={this.props.style}>
        <ToolbarGroup style={styles.toolbargroup}>
          <InputText
            text={this.props.request.text}
            onTextChange={this.props.onTextChange}/>
          <RaisedButton label="Search" primary={true} onClick={this.props.onSubmit}/>
        </ToolbarGroup>
        <ToolbarGroup style={styles.toolbargroup}>
          <CustomSlider
            name="deg"
            min={0} max={1}
            step={0.10}
            value={this.props.request.degConnection}
            onSliderChange={this.props.onDegreeChange}
          />
        </ToolbarGroup>
        <ToolbarGroup style={styles.toolbargroup}>
          <CustomSlider
            name="num"
            min={1} max={8}
            step={1}
            value={this.props.request.numSuggestion}
            onSliderChange={this.props.onNumberChange}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}


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
  toolbargroup: {
    margin: 15,
  },
  sliderlabel: {
    fontSize: '0.8em'
  }
};
