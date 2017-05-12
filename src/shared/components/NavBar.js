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
        iconElementLeft={<FontIcon className="fa fa-lightbulb-o"></FontIcon>}
        iconElementRight={<FlatButton label="Sign In" />}/>
    )
  }
}

export default NavBar;
