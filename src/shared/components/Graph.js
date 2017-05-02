import React from 'react';
import * as d3 from 'd3';
import ForceLayout from './graph-layouts/ForceLayout';

export default class Graph extends React.Component{
  constructor(props){
    super(props);

    // width = this.props.size.width
    // height = this.props.size.height

    // type = this.props.graphType

    // nodes = this.props.data.nodes
    // links = this.props.data.links

  }

  //process data here
  //to render different layouts

  render(){
    const style = {  //uniform style for all layouts
      border:'5px solid #9E9EFF'
    }
    // should use switch statement instead
    if (this.props.graphType === "force"){
      return (
        <ForceLayout
          style={style}
          nodes={this.props.data.nodes}
          links={this.props.data.links}
          width={this.props.width}
          height={this.props.height}/>
      );
    }
  }
}
