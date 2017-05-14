//React for structure - D3 for data calculation - D3 for rendering

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {return d.id; }).distance(150))
    .force("charge", d3.forceManyBody().strength(-100));

class ForceLayout extends React.Component{
  constructor(props){
    super(props);

    this.dragstarted = this.dragstarted.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragended = this.dragended.bind(this);

  }

  componentDidMount(){ //only find the ref graph after rendering
    const nodes = this.props.nodes;
    const links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    simulation.force("center", d3.forceCenter(width/2, height/2));

    // this.simulation = d3.forceSimulation(nodes)
    //   .force("link", d3.forceLink(links).id(function(d){return d.id}).distance(150))
    //   .force("charge", d3.forceManyBody().strength(-100))
    //   .force("center", d3.forceCenter(width / 2, height / 2));

    this.graph = d3.select(ReactDOM.findDOMNode(this.refs.graph))
      .attr("class", "everything");

    this.svg = d3.select("svg");
    this.svg.call(d3.zoom().on(
      "zoom", () => {
        this.graph.attr("transform", d3.event.transform)
      })
    );

    var link = this.graph.selectAll('.link-line')
      .data(links, function(d) { return d.source.id + "-" + d.target.id; })
      .enter()
      .append('line') //.insert('line', '.node')
        .attr('class', 'link-line')
        .call(enterLinkLine);

    var linkLabels = this.graph.selectAll('.link-label')
      .data(links, function(d){return d.source.id + "-" + d.target.id;})
      .enter()
        .append("text")
        .attr("class", "link-label")
        .call(enterLinkLabel);

    var node = this.graph.selectAll('.node')
      .data(nodes, function(d) {return d.id})
      .enter()
        .append('g')
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
      .call(enterNode)
      .call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended));

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.on("tick", () => {
        this.graph.call(updateGraph);
      });
    // this.simulation.on('tick', () => {
    //   this.graph.call(updateGraph);
    // });
  }

  shouldComponentUpdate(nextProps){
    console.log('shouldComponentUpdate triggered');

    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes || nextProps.links !== this.props.links){
      console.log('should only appear when updating graph');
      // console.log(nextProps.nodes);
      // console.log(nextProps.links);
      var newNodes = nextProps.nodes.slice();
      var newLinks = nextProps.links.slice();

      // this.simulation.stop();
      this.graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

      var links = this.graph.selectAll('.link-line')
           .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
      links.exit().remove();
      links.enter()
           .append('line') //.insert('line', '.node')
             .attr('class', 'link-line')
             .call(enterLinkLine);
      // links.call(updateLink);

      var linkLabels = this.graph.selectAll('.link-label')
           .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
      linkLabels.exit().remove();
      linkLabels.enter()
           .append("text")
             .attr("class", "link-label")
             .call(enterLinkLabel);
      // linkLabels.call(updateLinkLabel);

      var nodes = this.graph.selectAll('.node')
           .data(newNodes, function(d) {return d.id});
      nodes.exit().remove();
      nodes.enter()
           .append('g')
           .attr("class", "node")
           .call(d3.drag()
             .on("start", this.dragstarted)
             .on("drag", this.dragged)
             .on("end", this.dragended))
           .call(enterNode);
      // nodes.call(updateNode);

      simulation.nodes(newNodes);
      simulation.force("link").links(newLinks);
      // this.simulation.nodes(newNodes);
      // this.simulation.force('link').links(newLinks);

      // this.simulation.on('tick', () => {
        // this.graph.call(updateGraph);
      // });
      simulation.alpha(1).restart();
      // this.simulation.alpha(1).restart();

      return false;
    }
    return false;
  }

  render(){
    return(
      <svg width={this.props.width}
           height={this.props.height}>
        <g ref='graph' />
      </svg>
    );
  }

  /* D3 DRAG */
  dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
     d.fx = null;
     d.fy = null;
  }
}


//  d3 functions to manipulate attributes
var enterNode = (selection) => {
  selection
    .append('circle')
      .attr('r', function(d){return d.id.length * 5})
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', 3)
      .on('click', function(d,i){alert('clicked')});

  selection
    .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertically centre text regardless of font size
      .style("font-size", "13px")
      .text((d) => d.id );
};

var enterLinkLine = (selection) => {
  selection
    .style('stroke', (d) => color(d.type))
    .style('stroke-width', 5)
    .style('stroke-opacity', 0.6);
};

var enterLinkLabel = (selection) => {
  selection
    .attr("fill", "Black")
    .style("font", "normal 12px Arial")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text((d) => d.type);
}

var updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

var updateLink = (selection) => {
  selection
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

var updateLinkLabel = (selection) => {
  selection
    .attr("x", (d) => (d.source.x + d.target.x)/2 )
    .attr("y", (d) => (d.source.y + d.target.y)/2 );
}

var updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link-line')
    .call(updateLink);
  selection.selectAll('.link-label')
    .call(updateLinkLabel);
};

export default ForceLayout;
