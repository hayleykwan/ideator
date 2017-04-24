import React from 'react';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
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

class DegConnectionSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      degConnectionSlider: 0.5
    };
    this.handleSlider = this.handleSlider.bind(this);
  }

  handleSlider(event, value) {
    this.setState({
      degConnectionSlider: value
    });

  }

  render() {
    return (
      <div>
        <p>Degree of Connection</p>
        <Slider
          min={0} max={1}
          step={0.10}
          defaultValue={0.5}
          value={this.state.degConnectionSlider}
          style={{width: 150}}
          onChange={this.handleSlider}/>
        <p>
          <span>{'The value of this slider is: '}</span>
          <span>{this.state.degConnectionSlider}</span>
        </p>
      </div>
    );
  }
}


class NumSuggestionSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numSuggestionSlider: 6
    };
        this.handleSlider = this.handleSlider.bind(this);
  };

  handleSlider(event, value) {
    this.setState({
      numSuggestionSlider: value
    });
  };

  render() {
    return (
      <div>
        <p>Number of Suggestions</p>
        <Slider
          min={1} max={8}
          step={1}
          defaultValue={6}
          value={this.state.numSuggestionSlider}
          onChange={this.handleSlider}
          style={{width: 150}}
        />
        <p>
          <span>{'The value of this slider is: '}</span>
          <span>{this.state.numSuggestionSlider}</span>
        </p>
      </div>
    );
  }
}



export default class IdeaToolBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: null,
      numSuggestion: 6,
      degConnection: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    //pool text, numSuggestion, degConnection
    //send req to
    alert('Submit clicked');
    //send request to
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <TextField
            floatingLabelText="E.g. panda"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}/>
          <FlatButton label="Search" primary={true} onClick={this.handleSubmit}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <DegConnectionSlider/>
          <NumSuggestionSlider/>
        </ToolbarGroup>
      </Toolbar>

    );
  }
}
