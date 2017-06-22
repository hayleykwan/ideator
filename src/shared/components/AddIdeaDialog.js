import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
class InputText extends React.Component{
  constructor(props){
    super(props);
    this.handleDialogText = this.handleDialogText.bind(this);
  }

  handleDialogText(event){
    this.props.onChange(event);
  }
  render(){
    return (
      <TextField
        hintText="Try to be as short and concise as possible"
        value={this.props.text}
        onChange={this.handleDialogText}
        style={{width: '80%'}}/>
    )
  }
}
export default class AddIdeaDialog extends React.Component{
  constructor(props){
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.handleDialogText = this.handleDialogText.bind(this);
  }

  handleDialogText(event){
    this.props.onTextChange(event);
  }

  handleDialogClose(event){
    this.props.onClose(event);
  }

  handleDialogSubmit(){
    this.props.onSubmit();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleDialogClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleDialogSubmit}
      />,
    ];

    return (
      <Dialog
        title="Add Your Own Idea"
        actions={actions}
        modal={true}
        open={this.props.dialog.open}
        contentStyle={{width: '50%'}}>
        <InputText
          text={this.props.dialog.idea}
          onChange={this.props.onTextChange}
        />
      </Dialog>
    )
  }
}
