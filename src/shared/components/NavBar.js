import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

class NavBar extends React.Component{
  constructor(props){
    super(props);
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }

  handleTouchTap() {
    alert('Go to landing page');
  }

  render(){
    return (
      <AppBar
        title={<span style={styles.title}>The Ideator</span>}
        onTitleTouchTap={this.handleTouchTap}
        iconElementLeft={<div>&nbsp;&nbsp;&nbsp;</div>}
        iconElementRight={<FlatButton label="About" />}/>
    )
  }
}

export default NavBar;
