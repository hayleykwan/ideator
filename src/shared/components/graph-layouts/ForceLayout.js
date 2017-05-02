import React from 'react';
import * as d3 from 'd3';

export default class ForceLayout extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    var nodes = this.props.nodes;
    var links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(50))
      .force("charge", d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const graph = d3.select(this.refs.graph);

    const node = graph.selectAll('circle')
      .data(nodes)
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

    const link = graph.selectAll('line')
      .data(links)
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

  }

  render(){
    return(
      <svg
        width={this.props.width}
        height={this.props.height}
        style={this.props.style}>
        <g ref='graph' />
      </svg>
    );
  }
}
