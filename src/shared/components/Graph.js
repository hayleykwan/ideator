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
    // should use switch statement instead
    if (this.props.graphType === "force"){
      // console.log(this.props.data); already assigned index, x, y, vx, vy
      return (
        <ForceLayout
          nodes={this.props.data.nodes}
          links={this.props.data.links}
          width={this.props.width}
          height={this.props.height}/>
      );
    }
  }
}
