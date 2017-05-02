exports.update =  function(currentGraph, submitted, datamuseRe){
  // submitted is one object: word, num, deg
  //datamuseRe is array of objects: word, score,

  console.log(currentGraph);

  //if datamuseResponse is empty, return same graph
  if(datamuseRe.length === 0){
    return currentGraph;
  }
  //else update graph
  var finalGraph = currentGraph;

  //check if the submittedObject is an object from originalJsonObject
  if(indexOfWordInGraph(currentGraph, submitted) !== -1){
    //source is present, only need to add links
    const centreIndex = indexOfWordInGraph(currentGraph, submitted);
    //for each datamuse response object
    //check if target exists in currentGraph
    //if it does, link centreIndex (src) and this index (target) up
    //if not, append new node, link centreIndex and this up
    for(var i = 0 ; i < datamuseRe.length ; i++){
      if(indexOfWordInGraph(currentGraph, datamuseRe[i]) !== -1){
        //it exists in currentGraph
        const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
        var link = {
          source: centreIndex,
          target: targetIndex
        };
        finalGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          id: datamuseRe[i].word,
          size: 50,
          type: "circle",
          score: 1
        };
        finalGraph.nodes.push(node);
        var link = {     //create new link
          source: centreIndex,
          target: finalGraph.nodes.indexOf(node)
        };
        finalGraph.links.push(link);
      }
    }
  } else {
    // not present, need to add new centre
    // create new centre node
    var centre = {
      id: submitted.word,
      size: 100,
      type: "circle",
      score: 1
    };
    finalGraph.nodes.push(centre);
    var newCentreIndex = finalGraph.nodes.indexOf(centre);

    // for each datamuse response object
      //check if it exists in currentGraph
      //if it does, link centreIndex (src) and this index (target) up
      //if not, append new node, link centreIndex and this up
    for(var i = 0 ; i < datamuseRe.length ; i++){
      if(indexOfWordInGraph(currentGraph, datamuseRe[i]) !== -1){
        //it exists in currentGraph
        const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
        var link = {
          source: newCentreIndex,
          target: targetIndex
        };
        finalGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          id: datamuseRe[i].word,
          size: 50,
          type: "circle",
          score: 1
        };
        finalGraph.nodes.push(node);
        var link = {     //create new link
          source: newCentreIndex,
          target: finalGraph.nodes.indexOf(node)
        };
        finalGraph.links.push(link);
      }
    }

  }

  //maintain nodes position, see example
  console.log(finalGraph);
  return finalGraph;
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

// function updateGraphJson(originalJsonObject, submittedObject, responseArray) {
//
//   var graph = originalJsonObject;
//
//   //check if the submittedObject is an object from originalJsonObject
//   var isPresent = false;
//   var newCentreNode;
//
//   for(var i = 0 ; i < originalJsonObject.nodes.length ; i++){
//     isPresent = originalJsonObject.nodes[i].id == submittedObject.text;
//     if(isPresent){
//       newCentreNode = originalJsonObject.nodes[i];
//     }
//   }
//
//   if(!isPresent){
//     newCentreNode = {
//       id: submittedObject.text,
//       size: 30,
//       type: "circle",
//       score: 0
//     };
//     graph.nodes.push(newCentreNode);
//
//     for(var j = 0 ; j < responseArray.length ; j++){
//       var newResponseNode = {
//         id: responseArray[j].word,
//         size: 30,
//         type: "circle",
//         score: responseArray[j].score
//       };
//       graph.nodes.push(newResponseNode);
//
//       var newLink = {
//         source: newCentreNode,
//         target: newResponseNode
//       }
//       graph.links.push(newLink);
//     }
//   } else {
//     for(var j = 0 ; j < responseArray.length ; j++){
//       var newResponseNode = {
//         id: responseArray[j].word,
//         size: 30,
//         type: "circle",
//         score: responseArray[j].score
//       };
//       graph.nodes.push(newResponseNode);
//
//       var newLink = {
//         source: newCentreNode,
//         target: newResponseNode
//       }
//       graph.links.push(newLink);
//     }
//   }
//   return graph;
// }
