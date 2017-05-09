exports.update =  function(currentGraph, submitted, datamuseRe){

  // submitted is one object: word, num, deg
  //datamuseRe is array of objects: word, score

  // var new_node = {"word": "newnode"};
  // var new_node2 = {"word": "newnode2"};
  // currentGraph.nodes.push(new_node);
  // currentGraph.nodes.push(new_node2);
  // var new_link = {source: currentGraph.nodes[0], target: new_node2, type: "test"};
  // currentGraph.links.push(new_link);
  // return currentGraph;

  //if datamuseResponse is empty, return same graph
  if(datamuseRe.length === 0){
    console.log('Datamuse returns nothing. Returning same graph' + currentGraph);
    return currentGraph;
  }
  //else update graph

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
          source: currentGraph.nodes[centreIndex],
          target: currentGraph.nodes[targetIndex]
        };
        currentGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          word: datamuseRe[i].word,
          score: 1
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          source: currentGraph.nodes[centreIndex],
          target: node
        };
        currentGraph.links.push(link);
      }
    }
  } else {
    // not present, need to add new centre
    // create new centre node
    var centre = {
      word: submitted.word,
      score: 1
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
          source: centre,
          target: currentGraph.nodes[targetIndex]
        };
        currentGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          word: datamuseRe[i].word,
          score: 1
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          source: centre,
          target: node
        };
        currentGraph.links.push(link);
      }
    }
  }

  // maintainNodePositions(oldNodes, currentGraph.nodes, 950, 500);
  return currentGraph;
}

//if present, return index
//else return -1
function indexOfWordInGraph(currentGraph, obj){
  for(var i = 0 ; i < currentGraph.nodes.length ; i++){
    if(currentGraph.nodes[i].word === obj.word){
      return i;
    }
  }
  return -1;
}

function maintainNodePositions(oldNodes, nodes, width, height) {
  var kv = {};
  oldNodes.forEach(function(d) {
    kv[d.word] = d;
  });
  nodes.forEach(function(d) {
    if (kv[d.word]) {
      // if the node already exists, maintain current position
      d.x = kv[d.word].x;
      d.y = kv[d.word].y;
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
