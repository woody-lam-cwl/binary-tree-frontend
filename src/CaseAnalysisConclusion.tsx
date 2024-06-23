import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';

const CaseAnalysisConclusion: FunctionComponent<{conclusion?: string}> = (props) => {

    return (
        props.conclusion
            ? 
            <Box sx={{padding: "2em 0em", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography sx={{fontWeight: "bold", fontSize: "1.2em"}}>{props.conclusion}</Typography>
            {/* <Button sx={{margin: "1em"}} variant="contained">Generate Summary</Button> */}
            </Box> : <></>);
}

export default CaseAnalysisConclusion;