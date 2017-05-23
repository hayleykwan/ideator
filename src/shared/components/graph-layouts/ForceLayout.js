//React for structure - D3 for data calculation - D3 for rendering

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {return d.id; }).distance(150))
    .force("charge", d3.forceManyBody().strength(-200));

class ForceLayout extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){ //only find the ref graph after rendering
    const nodes = this.props.nodes;
    const links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    simulation.force("center", d3.forceCenter(width/2, height/2));

    this.svg = d3.select("svg");
    this.svg.attr('viewBox', '0 0 '+ width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    this.graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    this.svg.call(d3.zoom().on(
      "zoom", () => {
        this.graph.attr("transform", d3.event.transform)
      })
    );

    simulation.on("tick", () => {
      this.graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps){ //essentially redraw whole thing
    console.log('shouldComponentUpdate triggered');

    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes || nextProps.links !== this.props.links){
      var newNodes = nextProps.nodes.slice();
      var newLinks = nextProps.links.slice();

      this.graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

      var links = this.graph.selectAll('.link-line')
           .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
      links.exit().remove();
      links.enter()
           .insert('line', '.node')
             .attr('class', 'link-line')
             .call(enterLinkLine);

      var linkLabels = this.graph.selectAll('.link-label')
           .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
      linkLabels.exit().remove();
      linkLabels.enter()
           .append('text')
             .attr('class', 'link-label')
             .call(enterLinkLabel);

      var nodes = this.graph.selectAll('.node')
           .data(newNodes, function(d) {return d.id});
      nodes.exit()
           .transition().attr('r', 0)
           .remove();
      nodes.enter()
           .append('g')
           .attr('class', 'node')
           .call(enterNode)
           .call(d3.drag()
             .on('start', dragstarted)
             .on('drag', dragged)
             .on('end', dragended));

      this.graph.selectAll('.node')
        .style('stroke', (d) => {
          if (d.submitted) {return 'black'};  })

      simulation.nodes(newNodes);
      simulation.force("link").links(newLinks);
      simulation.alpha(1).restart();

      return false;
    }
    return false;
  }

  render(){
    return(
      <svg>
        <g ref='graph' className='everything' />
      </svg>
    );
  }
}


var enterNode = (selection) => {
  selection
    .append('circle')
      .attr('class', 'node-circle')
      .attr('r', function(d){return 45})
      .style('fill', '#EAEAEA');
  selection
    .append('text')
      .attr('class', 'node-text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em') // vertically centre text regardless of font size
      .style('font-size', '13px')
      .text(d => d.id)
      .call(wrap, 86);
};

var wrap = (text, width) => {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(), //return array
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, //ems
        y = text.attr('y'),
        dy = parseFloat(text.attr('dy')),
        tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
              console.log(words);
    while(word = words.pop()){
      line.push(word);
      tspan.text(line.join(' '));
      console.log(words);
      console.log(tspan.node().getComputedTextLength());
      if(tspan.node().getComputedTextLength() > width){
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
      }
    }
  });
}

var enterLinkLine = (selection) => {
  selection
    .style('stroke', (d) => color(d.type))
    .style('stroke-width', 5)
    .style('stroke-linecap', 'round')
    .style('stroke-opacity', 0.6);
};

var enterLinkLabel = (selection) => {
  selection
    .attr('fill', 'Black')
    .style('font', 'normal 12px Arial')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text((d) => d.type);
}

var updateNode = (selection) => {
  selection.attr('transform', (d) => "translate(" + d.x + "," + d.y + ")");
};

var updateLink = (selection) => {
  selection
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
};

var updateLinkLabel = (selection) => {
  selection
    .attr('x', (d) => (d.source.x + d.target.x)/2 )
    .attr('y', (d) => (d.source.y + d.target.y)/2 );
}

var updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link-line')
    .call(updateLink);
  selection.selectAll('.link-label')
    .call(updateLinkLabel);
};

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  //  d.fx = null;
  //  d.fy = null;
}


export default ForceLayout;
