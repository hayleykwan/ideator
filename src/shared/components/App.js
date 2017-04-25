import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IdeaToolBar from './Toolbar';

export default class App extends Component {
  constructor(props) {
    super(props);

    const placeholder = {
      try: 'removing some whitespace!',
      or: 'add valid JSON',
      then: ['then', 'click', 'format'],
      hi: 'mom!'
    };

    this.state = {
      value: JSON.stringify(placeholder, null, 4),
      txtClass: styles.textArea
    };
  }

  _saveText(e) {
    this.setState({value: e.target.value});
  }

  render() {
    return (
        <div id="app" style={styles.container}>
          <h1 style={styles.header}>JSON</h1>
          <textarea
            rows="30"
            cols="80"
            value={this.state.value}
            style={this.state.txtClass}
            onChange={this._saveText.bind(this)}>
          </textarea>
          <MuiThemeProvider>
            <IdeaToolBar />
          </MuiThemeProvider>
        </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Roboto', sans-serif"
  },
  header: {
    flex: '0 1 auto'
  },
  textArea: {
    flex: '0 1 auto',
    fontFamily: 'monospace'
  }
};
