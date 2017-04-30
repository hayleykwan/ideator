exports.update =  function(currentGraph, requestObject, datamuseRe){
  var finalGraph = currentGraph;

    //check if the submittedObject is an object from originalJsonObject


  return finalGraph;
}

//if present, return index
//else return -1
function isWordPresent(currentGraph, requestObject){
  for(var i = 0 ; i < currentGraph.nodes.length ; i++){
    if(currentGraph.nodes[i].id === requestObject.word){
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


//   this.setState({value: response}); //for display in textarea
//   var graph = updateGraphJson(this.state.graphjson, submitted, json);
//   this.setState({graphjson: graph});
//   console.log(this.state.graphjson); //object
// });
