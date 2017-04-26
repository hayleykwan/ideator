import React from 'react';
import * as d3 from 'd3';
// import force from 'd3-force';
import json from '../../data/graph.json';

export default class ForceGraph extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const {width, height} = this.props;
    //no need to parse JSON
    const force = d3.forceSimulation().nodes(json.nodes)
       .force("link", d3.forceLink(json.links).distance(50))
       .force("charge", d3.forceManyBody().strength(-120))
       .force('center', d3.forceCenter(width / 2, height / 2));

  }

  render() {
    const {width, height} = this.props;
    const style = {
      width, height, border:'1px solid #323232'
    };
    return <div style={style} ref="mountPoint"/>
  }
}
