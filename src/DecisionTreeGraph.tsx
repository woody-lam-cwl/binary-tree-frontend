import { FunctionComponent, useEffect, useState } from "react";
import Graph from "react-graph-vis";
import { DecisionGraphEdge, DecisionGraphNode, DecisionGraphNodeType, DecisionTreeNode } from "./decision_tree";
import {v4 as uuidv4} from 'uuid';
import { CaseAnalysisCriterionState } from "./CaseAnalysisCriterion";

const DecisionTreeGraph: FunctionComponent<{rootNode: DecisionTreeNode}> = (props) => {
  const [nodes, setNodes] = useState<DecisionGraphNode[]>([]);
  const [edges, setEdges] = useState<DecisionGraphEdge[]>([]);

  useEffect(() => {
    let rootGraphNode = createGraphNode(props.rootNode);
    var tempNodes = [rootGraphNode];
    var tempEdges = [];
    processTreeNode(props.rootNode, rootGraphNode, tempNodes, tempEdges);
    setNodes(tempNodes);
    setEdges(tempEdges);
  }, [props])

  function processTreeNode(treeNode: DecisionTreeNode, graphNode: DecisionGraphNode, nodes: DecisionGraphNode[], edges: DecisionGraphEdge[]) {
    const yesTreeNode = treeNode.yes;
    const noTreeNode = treeNode.no;

    const yesGraphNode = createGraphNode(treeNode.yes);
    const noGraphNode = createGraphNode(treeNode.no);

    nodes.push(yesGraphNode);
    nodes.push(noGraphNode);

    const yesGraphEdge = {from: graphNode, to: yesGraphNode, label: "YES", isTraversed: graphNode.state && yesGraphNode.state ? true : false};
    const noGraphEdge = {from: graphNode, to: noGraphNode, label: "NO", isTraversed: graphNode.state && noGraphNode.state ? true : false};

    edges.push(yesGraphEdge);
    edges.push(noGraphEdge);

    if (typeof yesTreeNode !== "string") {
      processTreeNode(yesTreeNode, yesGraphNode, nodes, edges);
    }

    if (typeof noTreeNode !== "string") {
      processTreeNode(noTreeNode, noGraphNode, nodes, edges);
    }
  }

  function createGraphNode(node: DecisionTreeNode | string): DecisionGraphNode {
    return typeof node === "string"
      ? {question: node, type: DecisionGraphNodeType.CONCLUSION}
      : {question: node.question, type: DecisionGraphNodeType.QUESTION, state: node.decidedState};
  }

  function selectColor(state?: CaseAnalysisCriterionState) {
    switch(state) {
      case CaseAnalysisCriterionState.YES:
        return paleGreen;
      case CaseAnalysisCriterionState.NO:
        return paleRed;
      default:
        return paleBlue;
    }
  }

    const paleGreen: string = "#DBFFD4"
    const paleRed: string = "#FFD4D4"
    const paleBlue: string = "#DEE0FC"

    const map = new Map<DecisionGraphNode, number>();
    nodes.forEach((node, index) => map.set(node, index));

    const graph = {
        nodes: nodes.map((node, index) => {
          const shape = node.type === DecisionGraphNodeType.CONCLUSION ? "diamond" : "ellipse"
          return {id: index, title: node.question, font: {size: 20}, shape: shape, color: selectColor(node.state)}}),
        edges: edges.map((edge) => {
          const width = edge.isTraversed ? 3 : 1;
          return {from: map.get(edge.from), to: map.get(edge.to), font: {size: 20}, label: edge.label, width: width}})
      };
    
      const options = {
        layout: {
          hierarchical: {
            sortMethod: "directed",
            
          }
        },
        edges: {
          color: "#000000"
        },
        height: "500px",
        interaction: {
            tooltipDelay: 100
        }
      };

      return (
        <Graph
          key={uuidv4()}
          graph={graph}
          options={options}
        />
      );
}

export default DecisionTreeGraph;