//React for structure - D3 for data calculation - D3 for rendering

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(150))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('collide', d3.forceCollide(30));

var linkedByIndex = {};

class ForceLayout extends React.Component{
  constructor(props){
    super(props);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.nodeDoubleClick = this.nodeDoubleClick.bind(this);
  }

  componentDidMount(){ //only find the ref graph after rendering
    const nodes = this.props.nodes;
    const links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    simulation.force("center", d3.forceCenter(width/2, height/2));

    this.svg = d3.select('svg');
    this.svg.attr('viewBox', '0 0 '+ width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    this.graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    this.svg.call(d3.zoom()
      .on('zoom', () => {this.graph.attr('transform', d3.event.transform)})
    ).on('dblclick.zoom', null);

    simulation.on('tick', () => {
      this.graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps){ //essentially redraw whole thing
    console.log('shouldComponentUpdate triggered');

    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes ||
       nextProps.links !== this.props.links){
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

      newLinks.forEach(function(d) {
        linkedByIndex[d.source+ "," + d.target] = 1;
      });

      var nodes = this.graph.selectAll('.node')
        .data(newNodes, function(d) {return d.id});
      nodes.exit()
        .transition().attr('r', 0)
        .remove();
      nodes.enter()
        .append('g')
        .attr('class', 'node')
        .call(enterNode)
        .merge(nodes)
        .style('font-weight', (d) => {return (d.submitted) ? 'bold' : 'normal'})
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
        .on('mouseover', this.mouseover)
        .on('mouseout', this.mouseout)
        .on('dblclick', this.nodeDoubleClick);;

      simulation.nodes(newNodes);
      simulation.force('link').links(newLinks);
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

  nodeDoubleClick(d){
    this.props.nodeDoubleClick(d.id);
  }

  mouseover(d){
    this.graph.selectAll('.link-line')
      .transition().duration(250)
      .style('stroke-opacity', (o) => {
        return o.source === d || o.target === d ? 0.75 : 0.25;
      });
    this.graph.selectAll('.link-label')
      .transition().duration(250)
      .style('fill-opacity', (o) => {
        return o.source === d || o.target === d ? 1 : 0.3;
      });
    this.graph.selectAll('.node-circle')
      .transition().duration(250)
      .style('fill', function (o) {
        return isConnected(d, o) ? '#EAEAEA': '#F6F6F6';
      });
    this.graph.selectAll('.node-text')
      .transition().duration(250)
      .style('fill-opacity', function (o) {
        var opacity = isConnected(d, o) ? 1 : 0.3;
        this.setAttribute('stroke-opacity', opacity);
        return opacity;
      });
  }

  mouseout(d){
    this.graph.selectAll('.link-line')
      .transition().duration(250).style('stroke-opacity', 0.75);
    this.graph.selectAll('.link-label')
      .transition().duration(250).style('fill-opacity', 1);
    this.graph.selectAll('.node-circle')
      .transition().duration(250).style('fill', '#E9E9E9');
    this.graph.selectAll('.node-text')
      .transition().duration(250).style('fill-opacity', 1).style('stroke-opacity', 1);
  }
}


var enterNode = (selection) => {
  selection
    .append('circle')
      .attr('class', 'node-circle')
      .attr('r', function(d){return 45})
      .style('fill', '#E9E9E9');
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
        tspan = text.text(null).append('tspan')
          .attr('x', 0).attr('y', y).attr('dy', dy + 'em');
    while(word = words.pop()){
      line.push(word);
      tspan.text(line.join(' '));
      if(tspan.node().getComputedTextLength() > width){
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', 0).attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
      }
    }
  });
}

var enterLinkLine = (selection) => {
  selection
    .style('stroke', (d) => color(d.type))
    .style('stroke-width', 5)
    .style('stroke-linecap', 'round')
    .style('stroke-opacity', 0.75);
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

function isConnected(a, b) {
  return linkedByIndex[a.id + "," + b.id] ||
         linkedByIndex[b.id + "," + a.id] ||
         a.index == b.index;
}



export default ForceLayout;
