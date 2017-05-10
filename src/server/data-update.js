exports.update =  function(currentGraph, submitted, datamuseRe){

  // submitted is one object: word, num, deg
  //datamuseRe is array of objects: word, score

  //if datamuseResponse is empty, return same graph
  if(datamuseRe.length === 0){
    console.log('Datamuse returns nothing. Returning same graph' + currentGraph);
    return currentGraph;  //should send error
  }

  // var oldNodes = currentGraph.nodes.slice();
  //check if the submittedObject is an object from originalJsonObject
  if(indexOfWordInGraph(currentGraph, submitted) !== -1){
    //source is present, only need to add links
    const centreIndex = indexOfWordInGraph(currentGraph, submitted);
    currentGraph.nodes[centreIndex].score = 80;
    //for each response object
    //check if target exists in currentGraph
    //if it does, link centreIndex (src) and this index (target) up
    //if not, append new node, link centreIndex and this up
    for(var i = 0 ; i < datamuseRe.length ; i++){
      if(indexOfWordInGraph(currentGraph, datamuseRe[i]) !== -1){
        //it exists in currentGraph
        const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
        var link = {
          "source": currentGraph.nodes[centreIndex].id,
          "target": currentGraph.nodes[targetIndex].id
        };
        currentGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          "id": datamuseRe[i].word,
          "score": 1
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          "source": currentGraph.nodes[centreIndex].id,
          "target": node.id
        };
        currentGraph.links.push(link);
      }
    }
  } else {
    // not present, need to add new centre
    var centre = {
      "id": submitted.word,
      "score": 1
    };
    currentGraph.nodes.push(centre);

    // for each response object
      //check if it exists in currentGraph
      //if it does, link centreIndex (src) and this index (target) up
      //if not, append new node, link centreIndex and this up
    for(var i = 0 ; i < datamuseRe.length ; i++){
      if(indexOfWordInGraph(currentGraph, datamuseRe[i]) !== -1){
        //it exists in currentGraph
        const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
        var link = {
          "source": centre.id,
          "target": currentGraph.nodes[targetIndex].id
        };
        currentGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {
          "id": datamuseRe[i].word,
          "score": 1
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          "source": centre.id,
          "target": node.id
        };
        currentGraph.links.push(link);
      }
    }
  }

  //remove duplicate links
  // currentGraph.links.forEach(function(d) {
  //   var sourceTemp = d.source;
  //   var targetTemp = d.target;
  //
  // });
  // maintainNodePositions(oldNodes, currentGraph.nodes, 950, 500);
  return currentGraph;
}

//if present, return index
//else return -1
function indexOfWordInGraph(currentGraph, obj){
  for(var i = 0 ; i < currentGraph.nodes.length ; i++){
    if(currentGraph.nodes[i].id === obj.word){
      return i;
    }
  }
  return -1;
}

function maintainNodePositions(oldNodes, nodes, width, height) {
  var kv = {};
  oldNodes.forEach(function(d) {
    kv[d.id] = d;
  });
  nodes.forEach(function(d) {
    if (kv[d.id]) {
      // if the node already exists, maintain current position
      d.x = kv[d.id].x;
      d.y = kv[d.id].y;
    } else {
      // else assign it a random position near the center
      d.x = width / 2 + getRandomInt(-150, 150);
      d.y = height / 2 + getRandomInt(-25, 25);
    }
  });
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
