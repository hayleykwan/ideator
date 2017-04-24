import React from 'react';
import Slider from 'material-ui/Slider';

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
          <span>{'Currently: '}</span>
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
          <span>{'Currently: '}</span>
          <span>{this.state.numSuggestionSlider}</span>
        </p>
      </div>
    );
  }
}
