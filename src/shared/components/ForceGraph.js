import React from 'react';
import * as d3 from 'd3';

export default class ForceGraph extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const {width, height, json} = this.props;
    //no need to parse JSON

    //Set up the force layout
    const simulation = d3.forceSimulation()
      .nodes(json.nodes)
      .force("link", d3.forceLink(json.links).distance(50))
      .force("charge", d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2));

//Append a SVG to the reference point. Assign this SVG as an object to svg
    const svg = d3.select(this.refs.mountPoint)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const node = svg.selectAll('circle')
      .data(json.nodes)
      .enter()
      .append('g')
      .attr("class", "node");

    node.append('circle')
      .attr('r', 5)
      .style('stroke', '#FFFFFF')
      .style('stroke-width', 1.5);

    node.append("text")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.id });

    const link = svg.selectAll('line')
      .data(json.links)
      .enter()
      .append('line')
      .attr("class", "link")
      .style('stroke', '#999999')
      .style('stroke-opacity', 0.6);

    function ticked(){
      // node
      //   .attr('cx', function(d) { return d.x; })
      //   .attr('cy', function(d) { return d.y; })
      link
        .attr('x1', function(d) { return d.source.x})
        .attr('y1', function(d) { return d.source.y})
        .attr('x2', function(d) { return d.target.x})
        .attr('y2', function(d) { return d.target.y});

      d3.selectAll("circle")
        .attr("cx", function (d) {return d.x;})
        .attr("cy", function (d) {return d.y;});

      d3.selectAll("text")
        .attr("x", function (d) {return d.x;})
        .attr("y", function (d) {return d.y;});
    }

    simulation.on("tick", ticked);

    console.log(json); //object

  }

  render() {
    const {width, height} = this.props;
    const style = {
      width, height, border:'1px solid #323232'
    };
    return <div style={style} ref="mountPoint"/>
  }
}
