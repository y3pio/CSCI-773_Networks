import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";
import DataPanel from './DataPanel';
import HoverPanel from './HoverPanel';
import networkData from './test_data';
import { augmentEdgeData, augmentNodeDate, highlightShortestPath, GRAPH_OPTIONS } from './graph-utils';
import bellmanFordNetwork from './bellman-ford-ui';



export const App = () => {

  const [nodeData, setNodeData] = useState(augmentNodeDate(networkData.nodes));
  const [edgeData, setEdgeData] = useState(augmentEdgeData(networkData.edges));
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [selectedObject, setSelectedObject] = useState(undefined);
  const [hoverData, setHoverData] = useState(undefined);

  useEffect(() => {
    const bfResults = bellmanFordNetwork(nodeData, edgeData);
    setNodeData(bfResults);
    setEdgeData(highlightShortestPath(edgeData, bfResults));
  }, []);

  const events = {
    select: (event) => {
      const { nodes, edges } = event;
      if (nodes.length > 0 || edges.length > 0) {
        setSelectedObject({
          data: {
            nodes: nodeData.filter(n => nodes.includes(n.id)),
            edges: edgeData.filter(e => edges.includes(e.id))
          }
        })
        setHoverData(undefined);
      } else {
        setSelectedObject(undefined);
      }
    },
    hoverNode: (event) => {
      const { node } = event;
      const hoveredNode = nodeData.find(n => n.id === node);
      // console.log(`Hover Node: ${JSON.stringify(hoveredNode)}`);
      setHoverData({
        type: 'node',
        ...hoveredNode
      });
    },
    hoverEdge: (event) => {
      const { edge } = event;
      const hoveredEdge = edgeData.find(e => e.id === edge);
      // console.log(`Hover Edge: ${JSON.stringify(edge)}`);
      setHoverData({
        type: 'edge',
        ...hoveredEdge
      })
    }
  };
  return (
    <div id='app-wrapper' onMouseOver={() => {
      setHoverData(undefined);
    }}>
      <DataPanel
        nodeData={nodeData}
        edgeData={edgeData}
        selectedObject={selectedObject}
      />
      <div id='graph-canvas-wrapper' >
        <HoverPanel hoverData={hoverData} />
        <Graph
          graph={{ nodes: nodeData, edges: edgeData, }}
          options={GRAPH_OPTIONS}
          events={events}
        />
      </div>
    </div>
  );
};

export default App;