import { FunctionComponent, useState } from 'react';
import { Box, Button, Input } from '@mui/material';
import TreeSelectionDropDown from './TreeSelectionDropDown';
import { DecisionTreeEntry } from './decision_tree';

const CaseAnalysisHeader: FunctionComponent<{
    onSubmit: (scenario: string, treeId: number) => void;
}> = (props) => {
    const [scenario, setScenario] = useState<string>("");
    const [selectedTree, setSelectedTree] = useState<DecisionTreeEntry>();

    const onScenarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setScenario(e.target.value)
    }

    const onSubmitClick = () => {
        if (selectedTree) {
            props.onSubmit(scenario, selectedTree.treeId);
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{width: "90vw"}}>
                <Box sx={{borderStyle: "solid", borderRadius: "1em", borderWidth: "2px", borderColor: "#999999", backgroundColor: '#FFFFFF', width: "100%", height: "15em", padding: "1em"}}>
                    <Input
                        multiline={true}
                        fullWidth={true}
                        minRows={10}
                        maxRows={10}
                        disableUnderline={true}
                        onChange={onScenarioChange}
                        placeholder='Describe your case here...'
                    />
                </Box>
                <Box sx={{margin: "1.5em 0em", display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <p style={{marginBlock: "1em 0em", padding: "0em 1.5em"}}>Case nature: </p>
                        <TreeSelectionDropDown setSelectedTree={setSelectedTree}/>
                    </div>
                    <Button sx={{margin: "1em"}}variant="contained" onClick={onSubmitClick}>Analyse now</Button>
                </Box>
            </Box>
            
        </Box>
    );
}

export default CaseAnalysisHeader;