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
      .force("link", d3.forceLink(links).id(d => d.index).distance(80))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    this.graph = d3.select(this.refs.graph).attr("class", "everything");
    // this.graph.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    this.svg = d3.select("svg");
    this.svg.call(d3.zoom().on(
      "zoom", () => {
        this.graph.attr("transform", d3.event.transform)
      })
    );

    var node = this.graph.selectAll('.node')
      .data(nodes, function(d) {return d.word})
      .enter()
      .append('g')
      .attr("class", "node")
      .call(enterNode);

    var link = this.graph.selectAll('.link')
      .data(links, function(d) { return d.source.word + "-" + d.target.word; })
      .enter()
      .call(enterLink);

    this.simulation.on('tick', () => {
      this.graph.call(updateGraph);
    });
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({
  //     nodes: nextProps.nodes,
  //     links: nextProps.links
  //   })
  // }

  shouldComponentUpdate(nextProps){
    console.log('shouldComponentUpdate triggered');

    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes || nextProps.links !== this.props.links){
      console.log('should only appear when updating graph');
      console.log(nextProps.nodes);
      console.log(nextProps.links);
      var newNodes = nextProps.nodes.slice();
      var newLinks = nextProps.links.slice();

      // this.simulation.stop();
      this.graph = d3.select(this.refs.graph);

      var d3Nodes = this.graph.selectAll('.node')
        .data(newNodes, function(d) {return d.word}); //nextProps.nodes
      d3Nodes.exit().remove();
      d3Nodes
        .enter()
        .append('g')
        .attr("class", "node")
        .call(enterNode)
        .merge(d3Nodes);
      // d3Nodes.call(updateNode);

      var d3Links = this.graph.selectAll('.link')
        .data(newLinks, function(d) { return d.source.word + "-" + d.target.word; }); //nextProps.links
      d3Links.exit().remove();
      d3Links
        .enter()
        .call(enterLink)
        .merge(d3Links);
      // d3Links.call(updateLink);

      this.simulation.nodes(newNodes);
      this.simulation.force("link").links(newLinks);
      this.simulation.alpha(1).restart();

      this.simulation.on('tick', () => {
        this.graph.call(updateGraph);
      });
    }

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
    .attr('r', function(d){return d.word.length * 5})
    .style('fill', 'white')
    .style('stroke', 'black')
    .style('stroke-width', 3);

  selection.append("text")
    .attr("dx", function(d){return -3.5 * d.word.length})
    .attr("dy", ".35em") // vertically centre text regardless of font size
    .style("font-size", "13px")
    .text(function(d) { return d.word });
};

var enterLink = (selection) => {
  // selection
  //   .append('g')
  //   .attr("class", "link");

  selection
    .insert('line', '.node')
    .attr("class", "link")
    .style('stroke', '#999999')
    .style('stroke-width', 5)
    .style('stroke-opacity', 0.6);

  // selection.append("text")
  //   .attr("dx", function(d){return -3.75 * d.type.length})
  //   .attr("dy", ".35em") // vertically centre text regardless of font size
  //   .text(function(d) { return d.type });
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
