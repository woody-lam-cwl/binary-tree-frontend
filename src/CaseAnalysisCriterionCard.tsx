import { FunctionComponent, ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Grid, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { CaseAnalysisCriterion, CaseAnalysisCriterionState } from './CaseAnalysisCriterion';

const CaseAnalysisCriterionCard: FunctionComponent<{
  criterion: CaseAnalysisCriterion,
  onOverride: (overrideState: CaseAnalysisCriterionState) => void,
  onChallenge: () => void}> = (props) => {
    const criterion: CaseAnalysisCriterion = props.criterion
    
    var summaryIcon: ReactNode;
    var color: string;
    var backgroundColor: string;

    const black: string = "#000000"
    const green: string = "#0D4F00"
    const red: string = "#AD0303"
    const blue: string = "#0233F5"
    const paleGreen: string = "#DBFFD4"
    const paleRed: string = "#FFD4D4"
    const paleBlue: string = "#DEE0FC"

    switch (criterion.state) {
        case CaseAnalysisCriterionState.YES:
            color = green;
            backgroundColor = paleGreen;
            summaryIcon = <CheckCircleIcon/>;
            break;
        case CaseAnalysisCriterionState.NO:
            color = red;
            backgroundColor = paleRed;
            summaryIcon = <CancelIcon/>;
            break;
        case CaseAnalysisCriterionState.UNCERTAIN:
            color = blue;
            backgroundColor = paleBlue;
            summaryIcon = <HelpIcon/>;
            break;
    }


    return (
      <Accordion sx={{color: color, backgroundColor: backgroundColor}}>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            {summaryIcon} <Typography sx={{color: black, padding: "0em 2em", fontWeight: "bold", fontSize: "1.1em"}}>{criterion.statement}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{padding: "0em 3em"}}>
          <Typography paragraph={true} sx={{color: black, padding: "0em 2em"}}>{criterion.reasoning}</Typography> 
          <Divider variant="middle"/>
          <Grid container columnSpacing={10}>
            <Grid item xs={8}>
              <p style={{margin: "0.5em 0em"}}>Explore alternative outcomes or paths of arguments?</p>
            </Grid>
            <Grid item xs={4} sx={{display: "flex", justifyContent: "space-evenly"}}>
              <Button sx={{color: color, fontWeight: "bold"}} onClick={props.onChallenge}>Go</Button>
            </Grid>
            <Grid item xs={8}>
              <p style={{margin: "0.5em 0em"}}>Provide additional information for reconsideration?</p>
            </Grid>
            <Grid item xs={4} sx={{display: "flex", justifyContent: "space-evenly"}}>
              <Button sx={{color: color, fontWeight: "bold"}}>Add information</Button>
            </Grid>
            <Grid item xs={8}>
              <p style={{margin: "0.5em 0em"}}>Override automated reasoning?</p>
            </Grid>
            <Grid item xs={4} sx={{display: "flex", justifyContent: "space-evenly"}}>
              {criterion.state !== CaseAnalysisCriterionState.YES 
                ? <Button
                    sx={{color: color, fontWeight: "bold"}}
                    onClick={() => props.onOverride(CaseAnalysisCriterionState.YES)}>
                      Set to YES
                  </Button>
                : <></>}
              {criterion.state !== CaseAnalysisCriterionState.NO
                ? <Button
                    sx={{color: color, fontWeight: "bold"}}
                    onClick={() => props.onOverride(CaseAnalysisCriterionState.NO)}>
                      Set to NO
                      </Button>
                : <></>}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
}

export default CaseAnalysisCriterionCard;