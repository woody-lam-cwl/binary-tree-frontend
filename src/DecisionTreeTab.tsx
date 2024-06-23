import { Box, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import DecisionTreeGraph from "./DecisionTreeGraph";
import { getTree } from "./backend";
import { DecisionTreeEntry, DecisionTreeNode } from "./decision_tree";
import TreeSelectionDropDown from "./TreeSelectionDropDown";

const DecisionTreeTab: FunctionComponent = () => {
    const [rootNode, setRootNode] = useState<DecisionTreeNode>();
    const [selectedTree, setSelectedTree] = useState<DecisionTreeEntry>();

    useEffect(() => {
        if (selectedTree) {
            getTree(selectedTree.treeId).then(node => setRootNode(node));
        }
    }, [selectedTree]);
    
    return (
        <Box>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Typography variant="h6">Decision Tree Graph:</Typography>
                <TreeSelectionDropDown setSelectedTree={setSelectedTree}/>
            </Box>
            {rootNode ? <DecisionTreeGraph rootNode={rootNode}/> : <></>}
        </Box>);
}

export default DecisionTreeTab;