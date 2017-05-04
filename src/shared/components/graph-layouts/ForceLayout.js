//React for structure - D3 for data calculation - D3 for rendering

import React from 'react';
import * as d3 from 'd3';

export default class ForceLayout extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){ //only find the ref graph after rendering
    const nodes = this.props.nodes;
    const links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(50))
      .force("charge", d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2));

    this.svg = d3.select('svg');
    this.svg.call(d3.zoom().on(
      "zoom", () => {
        this.svg.attr("transform", d3.event.transform)
      })
    );

    this.graph = d3.select(this.refs.graph);
    // this.graph.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var node = this.graph.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr("class", "node")
      .call(enterNode);

    var link = this.graph.selectAll('.link')
      .data(links)
      .enter()
      .call(enterLink);

    this.simulation.on('tick', () => {
      this.graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps){
    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes || nextProps.links !== this.props.links){
      console.log('should only appear when updating graph');

      this.simulation.stop();
      this.graph = d3.select(this.refs.graph);

      var d3Nodes = this.graph.selectAll('.node')
        .data(nextProps.nodes)
        .enter()  //enter new nodes
        .append('g')
        .attr("class", "node")
        .call(enterNode);
      d3Nodes.exit().remove();
      // d3Nodes.call(updateNode);

      var d3Links = this.graph.selectAll('.link')
        .data(nextProps.links)
        .enter()
        .call(enterLink);
      d3Links.exit().remove();
      // d3Links.call(updateLink);

      const newNodes = Object.assign({}, nextProps.nodes);
      const newLinks = Object.assign({}, nextProps.links);
      this.simulation.nodes(newNodes);
      this.simulation.force("link").links(newLinks);
      this.simulation.on('tick', () => {
        this.graph.call(updateGraph);
      });
      this.simulation.alpha(1).restart();
    }
    console.log('all props changes trigger this');
    return false;
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


//  d3 functions to manipulate attributes
var enterNode = (selection) => {
  selection.append('circle')
        .attr('r', 10)
        .style('fill', '#888888')
        .style('stroke', '#fff')  //outline is black
        .style('stroke-width', 1.5);  //outline thickness

  selection.append("text")
        .attr("x", function(d){return 20}) //
        .attr("dy", ".35em") // vertically centre text regardless of font size
        .text(function(d) { return d.word });
};

var enterLink = (selection) => {
  selection.append('line')
    .attr("class", "link")
    .style('stroke', '#999999')
    .style('stroke-opacity', 0.6);
};

var updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

var updateLink = (selection) => {
  selection.attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

var updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link')
    .call(updateLink);
};
