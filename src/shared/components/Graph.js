import React from 'react';
import * as d3 from 'd3';
import ForceLayout from './graph-layouts/ForceLayout';

export default class Graph extends React.Component{
  constructor(props){
    super(props);
  }

  // componentDidMount(){
  //   this.svg = d3.select("svg");
  //   this.svg.call(d3.zoom().on(
  //     "zoom", () => {
  //       this.graph.attr("transform", d3.event.transform)
  //     })
  //   );
  // }

  render(){
    // should use switch statement instead
    if (this.props.graphType === "force"){
      return (
        // <svg
        //   width={this.props.width}
        //   height={this.props.height}>
          <ForceLayout
            nodes={this.props.data.nodes}
            links={this.props.data.links}
            width={this.props.width}
            height={this.props.height}/>
        // </svg>
      );
    }
  }
}
