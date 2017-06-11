//React for structure - D3 for data calculation - D3 for rendering

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(150))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('collide', d3.forceCollide(46).strength(0.3));

var linkedByIndex = {};

class ForceLayout extends React.Component{
  constructor(props){
    super(props);
    this.redraw = this.redraw.bind(this);
    this.nodeMouseover = this.nodeMouseover.bind(this);
    this.nodeMouseout = this.nodeMouseout.bind(this);
    this.nodeDoubleClick = this.nodeDoubleClick.bind(this);
    this.enterNode = this.enterNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.reloadNode = this.reloadNode.bind(this);
    this.linkMouseover = this.linkMouseover.bind(this);
    this.linkMouseout = this.linkMouseout.bind(this);
  }

  componentDidMount(){ //only find the ref graph after rendering
    const nodes = this.props.nodes;
    const links = this.props.links;
    const width = this.props.width;
    const height = this.props.height;

    simulation.force("center", d3.forceCenter(width/2, height/2));

    var svg = d3.select('svg');
    svg.attr('viewBox', '0 0 '+ width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    var graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    svg.call(d3.zoom()
      .on('zoom', () => {graph.attr('transform', d3.event.transform)})
    ).on('dblclick.zoom', null);

    simulation.on('tick', () => {
      graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps){ //essentially redraw whole thing
    console.log('shouldComponentUpdate triggered');

    //only allow d3 to re-render if the nodes and links props are different
    if(nextProps.nodes !== this.props.nodes ||
       nextProps.links !== this.props.links){
      this.newNodes = nextProps.nodes.slice();
      this.newLinks = nextProps.links.slice();

      this.redraw(nextProps.nodes, nextProps.links);

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

  redraw(newNodes, newLinks) {
    var graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    var links = graph.selectAll('.link-line')
      .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
    links.exit().remove();
    links.enter()
      .insert('line', '.node')
      .attr('class', 'link-line')
      .call(enterLinkLine)
      .merge(links)
      // .on('click', this.linkMouseover)
      // .on('mouseout', this.linkMouseout);

    var linkLabels = graph.selectAll('.link-label')
      .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
    linkLabels.exit().remove();
    linkLabels.enter()
      .append('text')
      .attr('class', 'link-label')
      .call(enterLinkLabel);

    newLinks.forEach(function(d) {
      linkedByIndex[d.source+ "," + d.target] = 1;
    });

    var self = this;
    var nodes = graph.selectAll('.node')
      .data(newNodes, function(d) {return d.id});
    nodes.exit()
      .remove();
    nodes.enter()
      .append('g')
      .attr('class', 'node')
      .call(this.enterNode)
      .merge(nodes)
      .style('font-weight', (d) => {return (d.submitted) ? 'bold' : 'normal'})
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on("mouseover", function (d) {
        d3.select(this)
          .select('.node-option-remove')
          .style("visibility", "visible");
        if(!d.submitted){
          d3.select(this)
            .select('.node-option-reload')
            .style("visibility", "visible");
        }
        self.nodeMouseover(d);
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .select('.node-option-remove')
          .style("visibility", "hidden");
        d3.select(this)
          .select('.node-option-reload')
          .style("visibility", "hidden");
        self.nodeMouseout(d);
      })
      .on('dblclick', this.nodeDoubleClick)
      .on("click", function(d){
        if(!d.isPinned){
          d.fx = d.x;
          d.fy = d.y;
          d.isPinned = true;
          d3.select(this).select('.node-circle').style('fill', '#FFB74D');
        } else {
          d.fx = null;
          d.fy = null;
          d.isPinned = false;
          d3.select(this).select('.node-circle').style('fill', '#D0D0D0');
        }
      })
      .select('.node-text').style('fill', function (d){
        return (d.submitted) ? '#000000' : '#FFFFFF'
      });

    simulation.nodes(newNodes);
    simulation.force('link').links(newLinks);
    simulation.alpha(1).restart();

  }

  nodeDoubleClick(d){
    this.props.nodeDoubleClick(d.id);
  }

  linkMouseover(d){
    console.log(d.type);
  }

  linkMouseout(d){
    console.log('hi');
  }

  nodeMouseover(d){
    var graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));
    graph.selectAll('.link-line')
      .transition().duration(150)
      .style('stroke-opacity', (o) => {
        return o.source.id === d.id || o.target.id === d.id ? 1 : 0.5;
    });
    graph.selectAll('.link-label')
      .transition().duration(150)
      .style('fill-opacity', (o) => {
        return o.source === d || o.target === d ? 1 : 0;
    });
    graph.selectAll('.node-circle')
      .transition().duration(150)
      .style('fill', function (o) {
        if(o.isPinned) {
          return '#FFB74D'
        }
        return isConnected(d, o) ? '#AEAEAE': '#D0D0D0';
      })
      .style('stroke', function (o) {
        return isConnected(d, o) ? '#FF9800': '#FFFFFF';
      })
      .style('stroke-opacity', function (o) {
        return isConnected(d, o) ? 0.7: 0;
      })
      .style('stroke-width', function (o) {
        return isConnected(d, o) ? 3: 0;
    });
  }

  nodeMouseout(d){
    var graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));
    graph.selectAll('.link-line')
      .transition().duration(150).style('stroke-opacity', 0.5);
    graph.selectAll('.link-label')
      .transition().duration(150).style('fill-opacity', 0);
    graph.selectAll('.node-circle')
      .transition().duration(150)
        .style('fill', (d) => {return d.isPinned ? '#FFB74D': '#D0D0D0'})
        .style('stroke-width', 0);
  }

  enterNode(selection) {
    selection.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 45)
        .style('fill', '#D0D0D0')
        .style('stroke-width', 0);

    selection.append('text')
        .attr('class', 'node-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em') // vertically centre text regardless of font size
        .style('font-size', '13px')
        .style('fill', '#FFFFFF')
        .text(d => d.id)
        .call(wrap, 86);

    var self = this;
    var remove = selection.append('g')
      .attr('class', 'node-option-remove')
      .style("visibility", "hidden")
      .on('click', function (d) {
        d3.event.stopPropagation();
        self.removeNode(d);
      })
      .on('dblclick', function (d) {d3.event.stopPropagation() });
    remove.append('circle')
        .attr('r', 15)
        .attr('cx', 23)
        .attr('cy', -38)
        .style('fill', '#f44336');
    remove.append("image")
        .attr("xlink:href", "../../../static/images/clear_24px.svg")
        .attr("x", 11)
        .attr("y", -49);

    var reload = selection.append('g')
      .attr('class', 'node-option-reload')
      .style("visibility", "hidden")
      .on('click', function (d) {
        d3.event.stopPropagation();
        self.reloadNode(d);
      })
      .on('dblclick', function (d) {d3.event.stopPropagation() });
    reload.append('circle')
        .attr('r', 15)
        .attr('cx', 45)
        .attr('cy', -15)
        .style('fill', '#8BC34A');
    reload.append("image")
        .attr("xlink:href", "../../../static/images/autorenew_24px.svg")
        .attr("x", 33)
        .attr("y", -27);

  }

  removeNode(d) {
    if(!d.submitted){
      this.newNodes.splice(indexOfWord(this.newNodes, d.id), 1);
      var i = 0;
      while(i < this.newLinks.length){
        if(this.newLinks[i].source.id === d.id || this.newLinks[i].target.id === d.id){
          this.newLinks.splice(i, 1);
        } else {
          i++;
        }
      }
    }else {
      // TODO: remove all linked nodes
    }

    this.redraw(this.newNodes, this.newLinks);
    this.props.removeNode(this.newNodes, this.newLinks);
  }

  reloadNode(d){
    // find out how many relationships it has

    // if one, get its submitted source
    // search submitted source's back up

    // else
    var history = this.props.history;
    var submittedWord = history[0].word;
    var backUpData = this.props.backUpData;
    var newNodeData = backUpData[submittedWord].shift();

    var nodeToChange = this.newNodes[indexOfWord(this.newNodes, d.id)];
    var linkToChange = findLink(this.newLinks, d.id);

    var oldData = {
      wordId: nodeToChange.id,
      imageScr: nodeToChange.imageScr,
      link: linkToChange.type
    };
    backUpData[submittedWord].push(oldData);

    var node = {
      "id": newNodeData.wordId,
      "isPinned": false,
      "submitted": false,
      "imageSrc": newNodeData.imageSrc,
      "notes": ''
    }
    this.newNodes.splice(indexOfWord(this.newNodes, d.id), 1);
    this.newNodes.push(node);

    var link = {
      "source": linkToChange.source.id === d.id ? newNodeData.wordId : linkToChange.source.id,
      "target": linkToChange.target.id === d.id ? newNodeData.wordId : linkToChange.target.id,
      "type": newNodeData.link
    }
    this.newLinks.push(link);

    var i = 0;
    while(i < this.newLinks.length){
      if(this.newLinks[i].source.id === d.id || this.newLinks[i].target.id === d.id){
        this.newLinks.splice(i, 1);
      } else {
        i++;
      }
    }

    this.redraw(this.newNodes, this.newLinks);
    this.props.reloadNode(this.newNodes, this.newLinks, backUpData);
  }
}

function findLink(array, word){
  for(var i = 0 ; i < array.length; i++){
    if(array[i].source.id === word || array[i].target.id === word){
      return array[i];
    }
  }
  return 0;
}

function indexOfWord(array, word) {
  for(var i = 0 ; i < array.length ; i++){
    if(array[i].id === word){
      return i;
    }
  }
  return -1;
}

function wrap(text, width) {
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

function enterLinkLine(selection) {
  selection
    .style('stroke', (d) => color(d.type))
    .style('stroke-width', 7)
    .style('stroke-linecap', 'round')
    .style('stroke-opacity', 0.5);
};

function enterLinkLabel(selection) {
  selection
    .attr('fill', 'Black')
    .style('font-size', '11px')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text((d) => d.type)
    .style('fill-opacity', 0);
}

function updateNode(selection) {
  selection.attr('transform', (d) => "translate(" + d.x + "," + d.y + ")");
};

function updateLink(selection) {
  selection
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
};

function updateLinkLabel(selection) {
  selection
    .attr('x', (d) => (d.source.x + d.target.x)/2 )
    .attr('y', (d) => (d.source.y + d.target.y)/2 );
}

function updateGraph(selection) {
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
   d.fx = null;
   d.fy = null;
}

function isConnected(a, b) {
  return linkedByIndex[a.id + "," + b.id] ||
         linkedByIndex[b.id + "," + a.id] ||
         a.id == b.id;
}

export default ForceLayout;
