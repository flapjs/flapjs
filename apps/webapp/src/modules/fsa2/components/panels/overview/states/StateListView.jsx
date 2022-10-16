import React from 'react';
import Style from './StateListView.module.css';

import IconButton from 'src/components/IconButton';
import BoxAddIcon from 'src/assets/icons/box-add.svg';
import TriangleIcon from 'src/assets/icons/triangle.svg';

import StateListElement from './StateListElement';
import { useState } from 'react';

export default function StateListView(props) {
  const [prev, setPrev] = useState({ x: 0, y: 0 });

  function onElementAdd(e) {
    const graphController = props.graphController;
    setPrev(prev => ({ x: prev.x + 16, y: prev.y + 16 }));
    const node = graphController.createNode(prev.x, prev.y);
    const graphView = props.graphView;
    if (graphView) {
      graphView.moveViewToPosition(node.x, node.y);
    }
  }

  function onElementFocus(e, element) {
    const node = element.props.node;
    setPrev({ x: node.x, y: node.y });
    const graphView = props.graphView;
    if (graphView) {
      graphView.moveViewToPosition(node.x, node.y);
    }
  }

  function onElementBlur(e, element, nextLabel) {
    const node = element.props.node;
    if (!node) return;

    const graphController = props.graphController;

    //The value is already processed, abort
    if (nextLabel !== null) {
      const graph = graphController.getGraph();
      if (nextLabel.length > 0) {
        const otherNodes = graph.getNodesByLabel(nextLabel);
        if (otherNodes.length <= 0) {
          //None other have the same name. Rename it!
          graphController.renameNode(node, nextLabel);
        } else {
          //Found something already named that! Ignore!
        }
      } else if (node.getNodeCustom()) {
        //Remove custom naming instead of deleting.
        node.setNodeCustom(false);
        graphController.applyAutoRename();
      } else {
        //Delete!
        graphController.deleteTargetNode(node);
      }
    }
  }

  function onElementChange(e, element, value) {
    const graphController = props.graphController;

    if (value.length > 0) {
      const graph = graphController.getGraph();
      const otherNodes = graph.getNodesByLabel(value);

      //If there are more than 1 nodes by the same name,
      //OR if the duplicate node found is NOT the same node
      if (
        otherNodes.length > 1 ||
        (otherNodes.length === 1 && otherNodes[0] !== element.props.node)
      ) {
        throw new Error('Not a valid node label');
      }
    }
  }

  const graphController = props.graphController;
  const graph = graphController.getGraph();
  const nodes = graph.getNodes();

  return (
    <div id={props.id}
      className={Style.list_container}
      style={props.style}>
      <div className={Style.element_list}>
        <TriangleIcon className={Style.first_marker} />
        {nodes.map((e) => (
          <StateListElement
            key={e.getGraphElementID()}
            node={e}
            onFocus={onElementFocus}
            onBlur={onElementBlur}
            onChange={onElementChange}
          />
        ))}
      </div>
      <IconButton
        className={Style.add_button}
        title="Add State"
        onClick={onElementAdd}>
        <BoxAddIcon />
      </IconButton>
    </div>
  );
}
