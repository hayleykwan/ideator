function update(currentGraph, submittedWord, datamuseRe){
  // datamuseRe is array of objects: wordId, link

  //check if the submittedObject is in currentGraph
  const centreIndex = indexOfWordInGraph(currentGraph, submittedWord);
  if(centreIndex !== -1){ //source is present, only need to add links
    currentGraph.nodes[centreIndex].submitted = true;
    //for each response object
    //check if target exists in currentGraph
    //if it does, link centreIndex (src) and this index (target) up
    //if not, append new node, link centreIndex and this up
    for(let i = 0 ; i < datamuseRe.length ; i++){
      const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i].wordId);
      if(targetIndex !== -1){ //it exists in currentGraph
        // console.log('existLink checking');
        var r = existLink(currentGraph, currentGraph.nodes[centreIndex].id, currentGraph.nodes[targetIndex].id);
        // console.log(r + ': ' +currentGraph.nodes[centreIndex].id + ', '+ currentGraph.nodes[targetIndex].id);
        if(!r){
          // console.log('there doesnt exist a link');
          var link = {
            "source": currentGraph.nodes[centreIndex].id,
            "target": currentGraph.nodes[targetIndex].id,
            "type": datamuseRe[i].link
          };
          // console.log(link);
          currentGraph.links.push(link);
        }
      } else {
        //it does not exist in currentGraph
        var node = {     //create new node
          "id": datamuseRe[i].wordId,
          "isPinned": false
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          "source": currentGraph.nodes[centreIndex].id,
          "target": node.id,
          "type": datamuseRe[i].link
        };
        currentGraph.links.push(link);
      }
    }
  } else {
    // not present, need to add new centre
    var centre = {
      "id": submittedWord,
      "submitted": true,
      "isPinned": false
    };
    currentGraph.nodes.push(centre);

    // for each response object
      //check if it exists in currentGraph
      //if it does, link centreIndex (src) and this index (target) up
      //if not, append new node, link centreIndex and this up
    for(let i = 0 ; i < datamuseRe.length ; i++){
      const targetIndex = indexOfWordInGraph(currentGraph, datamuseRe[i].wordId);
      if(targetIndex!== -1){  //it exists in currentGraph
        var link = {
          "source": centre.id,
          "target": currentGraph.nodes[targetIndex].id,
          "type": datamuseRe[i].link
        };
        currentGraph.links.push(link);
      } else {
        //it does not exist in currentGraph
        var node = {
          "id": datamuseRe[i].wordId,
          "isPinned": false
        };
        currentGraph.nodes.push(node);
        var link = {     //create new link
          "source": centre.id,
          "target": node.id,
          "type": datamuseRe[i].link
        };
        currentGraph.links.push(link);
      }
    }
  }

  return currentGraph;
}

//if present, return index
//else return -1
function indexOfWordInGraph(currentGraph, word){
  for(let i = 0 ; i < currentGraph.nodes.length ; i++){
    if(currentGraph.nodes[i].id === word){
      return i;
    }
  }
  return -1;
}

function existLink(currentGraph, sourceId, targetId){
  //for each link in currentGraph
  // no link with sourceId as src and targetId as target
  // no link with targetId as src and sourceId as target
  for(var i = 0 ; i < currentGraph.links.length ; i++) {
    var curSrcId = currentGraph.links[i].source;
    var curTarId = currentGraph.links[i].target;
    if((curSrcId == sourceId && curTarId == targetId) ||
       (curSrcId == targetId && curTarId == sourceId)){
         return true;
    }
  }
  return false;
}

module.exports = update;
