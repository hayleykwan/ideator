//React for structure - D3 for data calculation - D3 for rendering
import React from 'react';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
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
    this.handleClose = this.handleClose.bind(this);
    this.handleLinkUpdate = this.handleLinkUpdate.bind(this);
    this.handleLinkRemove = this.handleLinkRemove.bind(this);
    this.handleDialogText = this.handleDialogText.bind(this);
    this.enterLinkLine = this.enterLinkLine.bind(this);
    this.enterLinkLabel = this.enterLinkLabel.bind(this);
    this.nodeDoubleClick = this.nodeDoubleClick.bind(this);
    this.nodeMouseover = this.nodeMouseover.bind(this);
    this.nodeMouseout = this.nodeMouseout.bind(this);
    this.enterNode = this.enterNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.reloadNode = this.reloadNode.bind(this);

    this.state = {
      dialogOpen: false,
      selectedLink: {}
    };
  }

  componentDidMount(){
    const width = this.props.width;
    const height = this.props.height;

    simulation.force("center", d3.forceCenter(width/2, height/2));

    var svg = d3.select('svg');
    svg.attr('viewBox', '0 0 '+ width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    var graph = d3.select('.everything');

    svg.call(d3.zoom()
      .on('zoom', () => {graph.attr('transform', d3.event.transform)})
    ).on('dblclick.zoom', null);

    simulation.on('tick', () => {
      graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps){
    if(nextProps.imageReq){
      // addImages();
    } else {
      // removeImages();
    }
    if(nextProps.data.nodes !== this.props.data.nodes ||
       nextProps.data.links !== this.props.data.links){
      this.nodes = nextProps.data.nodes.slice();
      this.links = nextProps.data.links.slice();
      this.redraw(this.nodes, this.links);
      return true;
    }
    return true;
  }

  handleClose() {
    this.setState({dialogOpen: false})
  };

  handleLinkUpdate(){
    var i = 0;
    var d = this.state.selectedLink;
    while(i < this.links.length){
      if(this.links[i].source.id === d.source && this.links[i].target.id === d.target){
        this.links.splice(i, 1);
      } else {
        i++;
      }
    }
    var link = {
      source: this.state.selectedLink.source,
      target: this.state.selectedLink.target,
      type: this.state.selectedLink.type
    }
    this.links.push(link);
    // var index = this.state.selectedLink.object.index
    // var nodes = this.nodes.slice();
    // var links = this.links.slice();
    // var obj = links[index];
    // obj.type = this.state.selectedLink.type;
    // this.links = links;
    // this.nodes = nodes;
    this.redraw(this.nodes, this.links);
    this.props.removeNode(this.nodes, this.links);
    this.setState({dialogOpen: false, selectedLink: {}});
  }

  handleLinkRemove(){
    var i = 0;
    while(i < this.links.length){
      if(this.links[i] === this.state.selectedLink.object){
        this.links.splice(i, 1);
      } else {
        i++;
      }
    }
    this.redraw(this.nodes, this.links);
    this.props.removeNode(this.nodes, this.links);
    this.setState({dialogOpen: false, selectedLink: {}});
  }

  handleDialogText(event){
    var selectedLink = this.state.selectedLink;
    selectedLink.type = event.target.value;
    this.setState({selectedLink: selectedLink});
  }

  render(){
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onTouchTap={this.handleLinkUpdate}
      />,
      <FlatButton
        label="Remove"
        secondary={true}
        onTouchTap={this.handleLinkRemove}
      />
    ];

    return(
      <div>
        <Dialog
          title="Update Relationship"
          actions={actions}
          modal={true}
          open={this.state.dialogOpen}
          contentStyle={{width: '40%'}}>
          <Paper zDepth={0}>
            <div >
            <strong>{this.state.selectedLink.source}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
            <TextField
              hintText="Try to be as short and concise as possible"
              value={this.state.selectedLink.type}
              onChange={this.handleDialogText}
              style={{width: '40%'}}
            />
            <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.selectedLink.target}</strong>
            </div>
          </Paper>
        </Dialog>
        <svg ref="svg">
          <g className='everything' />
        </svg>
      </div>
    );
  }

  redraw(newNodes, newLinks) {
    var self = this;

    var graph = d3.select('.everything');

    var links = graph.selectAll('.link')
      .data(newLinks, function(d){return d.source.id + "-" + d.target.id;});
    links.exit().remove();
    links.enter()
      .insert('g', '.node')
      .attr('class', 'link')
      .call(this.enterLinkLine)
      .merge(links)
      .on('mouseover', function(d){
        console.log(d);
        d3.select(this).select('.link-line').style('stroke-opacity', 1);
      })
      .on('mouseout', function(d){
        d3.select(this).select('.link-line').style('stroke-opacity', 0.5);
      })
      .on('click', function(d){
        var selectedLink = {source: d.source.id, target: d.target.id, type: d.type, object: d};
        self.setState({dialogOpen: true, selectedLink: selectedLink});
      })

    var linkLabels = graph.selectAll('.link-label')
      .data(newLinks, function(d){return d.source.id + "-" + d.target.id + "-" + d.type;});
    linkLabels.exit().remove();
    linkLabels.enter()
      .append('text')
      .attr('class', 'link-label')
      .call(this.enterLinkLabel);

    newLinks.forEach(function(d) {
      linkedByIndex[d.source+ "," + d.target] = 1;
    });

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
        if(!d.submitted && !d.user){
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

  enterLinkLine(selection) {
    selection
      .append('line')
      .attr('class', 'link-line')
      .style('stroke', (d) => color(d.type))
      .style('stroke-width', 13)
      .style('stroke-linecap', 'round')
      .style('stroke-opacity', 0.5);
  }

  enterLinkLabel(selection) {
    selection
      .attr('fill', 'Black')
      .style('font-size', '11px')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.type)
      .style('fill-opacity', 0);
  }

  nodeDoubleClick(d){
    this.props.nodeDoubleClick(d.id);
  }

  nodeMouseover(d){
    var graph = d3.select('.everything');
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
          return '#FFB74D';
        }
        // else {
        //   return 'url(#hi)';
        // }
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
    var graph = d3.select('.everything');
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
    selection.append('defs').attr('id', 'mdef')
      .append('pattern').attr('id', 'hi').attr('x', 0).attr('y', 0)
        .attr('width', 10).attr('height', 10)
      .append('image').attr('x', 5).attr('y', 5)
        .attr('width', 70).attr('height', 70)
        .attr('xlink:href', d => d.imageSrc);

    selection.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 45)
        .style('fill', function(d){
          // if(d.imageSrc !== '') {
          //   return "url(#hi)";
          // } else {
            return '#D0D0D0';
          // }
        })
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
        .attr('r', 14)
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
        .attr('r', 14)
        .attr('cx', 45)
        .attr('cy', -15)
        .style('fill', '#8BC34A');
    reload.append("image")
        .attr("xlink:href", "../../../static/images/autorenew_24px.svg")
        .attr("x", 33)
        .attr("y", -27);

  }

  removeNode(d) {
    this.nodes.splice(indexOfWord(this.nodes, d.id), 1);
    if(d.submitted){
      for(var i = 0 ; i < this.links.length ; i++){
        if(this.links[i].source.id === d.id){
          var index = indexOfWord(this.nodes, this.links[i].target.id);
          if(!this.nodes[index].submitted){
            this.nodes.splice(index, 1);
          }
        }else if (this.links[i].target.id === d.id){
          var index = indexOfWord(this.nodes, this.links[i].source.id);
          if(!this.nodes[index].submitted){
            this.nodes.splice(index, 1);
          }
        }
      }
    }
    var i = 0;
    while(i < this.links.length){
      if(this.links[i].source.id === d.id || this.links[i].target.id === d.id){
        this.links.splice(i, 1);
      } else {
        i++;
      }
    }

    this.redraw(this.nodes, this.links);
    this.props.removeNode(this.nodes, this.links);
  }

  reloadNode(d){
    var history = this.props.history; // array
    var backUpData = this.props.backUpData; // object

    // find out how many submitted it is connected to
    var submittedWords = [];
    for(var i  = 0 ; i < this.links.length ; i++){
      if(this.links[i].source.id === d.id){
        var index = indexOfWord(this.nodes, this.links[i].target.id);
        if(this.nodes[index].submitted && inHistory(history, this.links[i].target.id)){
          submittedWords.push(this.links[i].target.id)
        }
      } else if (this.links[i].target.id === d.id){
        var index = indexOfWord(this.nodes, this.links[i].source.id);
        if(this.nodes[index].submitted && inHistory(history, this.links[i].source.id)){
          submittedWords.push(this.links[i].source.id)
        }
      }
    }

    var relevantBackUp = submittedWords.map(function(word){
      return {word: word, backup: backUpData[word]};
    });
    console.log(relevantBackUp.length);

    if(relevantBackUp.length <= 1){

      var backUp = relevantBackUp.pop();
      var newNodeData = backUp.backup.shift();

      //var nodeToChange = this.nodes[indexOfWord(this.nodes, d.id)];
      var linkToChange = findLink(this.links, d.id);

      var oldData = {
        wordId: d.id,
        imageScr: d.imageScr,
        link: linkToChange.type
      };
      backUpData[backUp.word].push(oldData);

      var node = {
        "id": newNodeData.wordId,
        "isPinned": false,
        "isHidden": false,
        "submitted": false,
        "imageSrc": newNodeData.imageSrc,
      }
      this.nodes.splice(indexOfWord(this.nodes, d.id), 1);
      this.nodes.push(node);

      var link = {
        "source": linkToChange.source.id === d.id ? newNodeData.wordId : linkToChange.source.id,
        "target": linkToChange.target.id === d.id ? newNodeData.wordId : linkToChange.target.id,
        "type": newNodeData.link[0]
      }
      this.links.push(link);

      var i = 0;
      while(i < this.links.length){
        if(this.links[i].source.id === d.id || this.links[i].target.id === d.id){
          this.links.splice(i, 1);
        } else {
          i++;
        }
      }
    } else {
      // more than one connected links
      // find common word in relevantBackUp.backup
      var commonBackUpWordIds = relevantBackUp.slice().shift().backup.reduce(function(res, v){
        if(res.indexOf(v.wordId) === -1 && relevantBackUp.every(function(a){
          for(var i = 0 ; i < a.backup.length; i++){
            if(a.backup[i].wordId === v.wordId){
              return true;
            }
          }
          return false;
        })){
          res.push(v.wordId);
        }
        return res;
      },
      []
      );

      // get data from respective relevantBackUp
      var newNodeData = relevantBackUp.map(function(item){
        return {
          linkedto: item.word,
          backup: item.backup.filter(function(elem){
            return commonBackUpWordIds.indexOf(elem.wordId) !== -1;
          })
        }
      });

      //var nodeToChange = this.nodes[indexOfWord(this.nodes, d.id)];
      relevantBackUp.forEach(function(item){
        // removing new backup for updating graph
        var backUpArray = backUpData[item.word];
        var index = indexOfWordId(backUpArray, newNodeData[0].backup[0].wordId);
        var newWord = backUpArray[index].wordId;
        var newLinkType = backUpArray[index].link;  // get the link

        // find link between item.word and nodeToChange
        var linkToChange = findLinkBetween(this.links, d.id, item.word);

        // create new link between newNodeData[0].backup[0].wordId and item.word
        var link = {
          "source": linkToChange.source.id === d.id ? newWord : linkToChange.source.id,
          "target": linkToChange.target.id === d.id ? newWord : linkToChange.target.id,
          "type": newLinkType[0]
        }
        this.links.push(link);

        backUpArray.splice(index, 1);  // remove the item

        var oldData = {
          wordId: d.id,
          imageScr: d.imageScr,
          link: linkToChange.type
        }
        backUpArray.push(oldData);

      });

      // only need to remove one node, and push new node
      var node = {
        "id": newNodeData[0].backup[0].wordId,
        "isPinned": false,
        "isHidden": false,
        "submitted": false,
        "imageSrc": newNodeData[0].backup[0].imageSrc,
      }
      this.nodes.splice(indexOfWord(this.nodes, d.id), 1);
      this.nodes.push(node);

      var i = 0;
      while(i < this.links.length){
        if(this.links[i].source.id === d.id || this.links[i].target.id === d.id){
          this.links.splice(i, 1);
        } else {
          i++;
        }
      }
    }
    this.redraw(this.nodes, this.links);
    this.props.reloadNode(this.nodes, this.links, backUpData);
  }
}


function inHistory(history, word){
  for(var i = 0 ; i < history.length; i++){
    if(history[i].word === word){
      return true;
    }
  }
  return false;
}

function findLinkBetween(array, from, to){
  for(var i = 0 ; i < array.length; i++){
    if((array[i].source.id === from && array[i].target.id === to) ||
      (array[i].source.id === to && array[i].target.id === from)){
      return array[i];
    }
  }
  return 0;
}

function findLink(array, word){
  for(var i = 0 ; i < array.length; i++){
    if(array[i].source.id === word || array[i].target.id === word){
      return array[i];
    }
  }
  return 0;
}

function indexOfWordId(array, word){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i].wordId === word){
      return i;
    }
  }
  return -1;
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

function updateNode(selection) {
  selection.attr('transform', (d) => "translate(" + d.x + "," + d.y + ")");
}

function updateLink(selection) {
  selection
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
}

function updateLinkLabel(selection) {
  selection
    .attr('x', (d) => (d.source.x + d.target.x)/2 )
    .attr('y', (d) => (d.source.y + d.target.y)/2 );
}

function updateGraph(selection) {
  selection.selectAll('.node').call(updateNode);
  selection.selectAll('.link-line').call(updateLink);
  selection.selectAll('.link-label').call(updateLinkLabel);
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
         a.id == b.id;
}

export default ForceLayout;
