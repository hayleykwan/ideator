import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
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
    alert('onTouchTap triggered on the title component');
  }

  render(){
    return (
      <AppBar
        title={<span style={styles.title}>The Ideator</span>}
        onTitleTouchTap={this.handleTouchTap}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={<FlatButton label="Save" />}/>
    )
  }
}

export default NavBar;
