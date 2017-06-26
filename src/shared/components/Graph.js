import React from 'react';
import * as d3 from 'd3';
import ForceLayout from './graph-layouts/ForceLayout';

export default class Graph extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    // should use switch statement instead
    if (this.props.graphType === "force"){
      return (
          <ForceLayout
            data={this.props.data}
            backUpData={this.props.backUpData}
            history={this.props.history}
            width={this.props.width}
            height={this.props.height}
            nodeDoubleClick={this.props.nodeDoubleClick}
            removeNode={this.props.removeNode}
            reloadNode={this.props.reloadNode}
            imageReq={this.props.imageReq}
            snackbarMsg={this.props.snackbarMsg}
            download={this.props.download}
            toggleDownload={this.props.toggleDownload}
            // svgRef={this.props.svgRef}
          />
      );
    }
  }
}
