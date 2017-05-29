function update(currentGraph, submitted, datamuseRe){

  // submitted is one object: word, num, deg
  // datamuseRe is array of objects: word, score

  //if datamuseResponse is empty, return same graph
  if(datamuseRe.length === 0){
    console.log('Datamuse returns nothing. Returning same graph' + currentGraph);
    return currentGraph;  //should send error
  }

  //check if the submittedObject is in currentGraph
  const centreIndex = indexOfWordInGraph(currentGraph, submitted);
  if(centreIndex !== -1){ //source is present, only need to add links
    currentGraph.nodes[centreIndex].score = 80;
    currentGraph.nodes[centreIndex].submitted = true;
    //for each response object
    //check if target exists in currentGraph
    //if it does, link centreIndex (src) and this index (target) up
    //if not, append new node, link centreIndex and this up
    for(let i = 0 ; i < datamuseRe.length ; i++){
      const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
      if(targetIndex !== -1){ //it exists in currentGraph
        console.log('existLink checking');
        if(!existLink(currentGraph, currentGraph.nodes[centreIndex].id, currentGraph.nodes[targetIndex].id)){
          console.log('there doesnt exist a link');
          var link = {
            "source": currentGraph.nodes[centreIndex].id,
            "target": currentGraph.nodes[targetIndex].id,
            "type": "test"
          };
          console.log(link);
          currentGraph.links.push(link);
        }
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          "id": datamuseRe[i].word,
          "score": 1
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          "source": currentGraph.nodes[centreIndex].id,
          "target": node.id,
          "type": "hello"
        };
        currentGraph.links.push(link);
      }
    }
  } else {
    // not present, need to add new centre
    var centre = {
      "id": submitted.word,
      "score": 1,
      "submitted": true
    };
    currentGraph.nodes.push(centre);

    // for each response object
      //check if it exists in currentGraph
      //if it does, link centreIndex (src) and this index (target) up
      //if not, append new node, link centreIndex and this up
    for(let i = 0 ; i < datamuseRe.length ; i++){
      const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i]);
      if(targetIndex!== -1){  //it exists in currentGraph
        var link = {
          "source": centre.id,
          "target": currentGraph.nodes[targetIndex].id,
          "type": "test"
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
          "target": node.id,
          "type": "test"
        };
        currentGraph.links.push(link);
      }
    }
  }

  return currentGraph;
}

//if present, return index
//else return -1
function indexOfWordInGraph(currentGraph, obj){
  // currentGraph.nodes.forEach(function(d, i) {
  //   if(d.id === obj.word){
  //     return i;
  //   }
  // })
  // return -1;

  for(let i = 0 ; i < currentGraph.nodes.length ; i++){
    if(currentGraph.nodes[i].id === obj.word){
      return i;
    }
  }
  return -1;
}

function existLink(currentGraph, sourceId, targetId){
  //for each link in currentGraph
  // no link with sourceId as src and targetId as target
  // no link with targetId as src and sourceId as target
  currentGraph.links.forEach(function(d){
    var curSrc = d.source;
    var curTar = d.target;
    if((curSrc.id === sourceId && curTar.id === targetId) ||
       (curSrc.id === targetId && curTar.id === sourceId)){
         return true;
    };
  })
  return false;
}

module.exports = update;
