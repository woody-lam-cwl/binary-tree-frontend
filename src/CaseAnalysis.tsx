import { FunctionComponent, useState } from 'react';
import CaseAnalysisHeader from './CaseAnalysisHeader';
import CaseAnalysisCriterionCard from './CaseAnalysisCriterionCard';
import { Box, Button, Divider, Drawer } from '@mui/material';
import { CaseAnalysisCriterion, CaseAnalysisCriterionState } from './CaseAnalysisCriterion';
import CaseAnalysisConclusion from './CaseAnalysisConclusion';
import { askQuestion, challengeAnswer, classifyAndFetchFirst, fetchNextQuestion, getTree } from './backend';
import { DecisionTreeNode, QuestionResponse } from './decision_tree';
import DecisionTreeGraph from './DecisionTreeGraph';

const CaseAnalysis: FunctionComponent = () => {    
    const [lastScenario, setLastScenario] = useState<string>("");
    const [lastTreeId, setLastTreeId] = useState<number>(1);
    const [criteria, setCriteria] = useState<CaseAnalysisCriterion[]>([]);
    const [conclusion, setConclusion] = useState<string | undefined>();
    const [activeTree, setActiveTree] = useState<DecisionTreeNode | undefined>();
    const [drawerState, setDrawerState] = useState<boolean>(false);

    async function askAndAppendRecursively(scenario: string, questionId: number, lastCriteria: CaseAnalysisCriterion[]): Promise<QuestionResponse> {
        return askQuestion(scenario, questionId, lastTreeId)
            .then(questionResponse => handleResponseRecursively(questionResponse, scenario, questionId, lastCriteria));
    }

    async function handleResponseRecursively(questionResponse: QuestionResponse, scenario: string, questionId: number, lastCriteria: CaseAnalysisCriterion[]): Promise<QuestionResponse> {
        if (questionResponse.conclusion) {
            setConclusion(questionResponse.conclusion);
            return Promise.resolve(questionResponse);
        }

        let updatedCriteria = [...lastCriteria, questionResponse.decision];
        setCriteria(updatedCriteria);

        if (questionResponse.hasNextQuestion) {
            return fetchNextQuestion(questionId, questionResponse.decision.state, lastTreeId)
                .then(question => askAndAppendRecursively(scenario, question.questionId, updatedCriteria));
        }

        return Promise.resolve(questionResponse);
    }

    function onSubmit(scenario: string, treeId: number): void {
        console.log(treeId);
        setCriteria([]);
        setConclusion(undefined);
        setLastScenario(scenario);
        setLastTreeId(treeId);
        classifyAndFetchFirst(scenario, treeId)
        .then(question => {askAndAppendRecursively(scenario, question.questionId, []);})
    }

    function onOverride(index: number, state: CaseAnalysisCriterionState) {
        let criterionToReplace = criteria[index];
        let replacedCriterion = {
            questionId: criterionToReplace.questionId,
            statement: criterionToReplace.statement,
            reasoning: "[Overriden by user]",
            state: state
        }
        let updatedCriteria = [...criteria.slice(0, index), replacedCriterion]
        setCriteria(updatedCriteria);
        setConclusion(undefined);
        fetchNextQuestion(criterionToReplace.questionId, state, lastTreeId)
        .then(question => askAndAppendRecursively(lastScenario, question.questionId, updatedCriteria));
    }

    function onChallenge(index: number) {
        let criterionToReplace = criteria[index];
        let updatedCriteria = [...criteria.slice(0, index)]
        setCriteria(updatedCriteria);
        setConclusion(undefined);
        let thisQuestionId = criterionToReplace.questionId;
        challengeAnswer(lastScenario, thisQuestionId, lastTreeId)
        .then(questionResponse => handleResponseRecursively(questionResponse, lastScenario, thisQuestionId, updatedCriteria));
    }

    async function openDrawer() {
        let tree: DecisionTreeNode = await getTree(lastTreeId);
        setActiveTree(tree);
        setDrawerState(true);
    }

    return (
        <Box sx={{margin: "1em"}}>
            <CaseAnalysisHeader onSubmit={onSubmit}/>
            <div>
                {criteria.map((val, id) => <CaseAnalysisCriterionCard criterion={val} key={id} onOverride={(state) => onOverride(id, state)} onChallenge={() => onChallenge(id)}/>)}
            </div>
            <CaseAnalysisConclusion conclusion={conclusion}/>
            <Divider/>
            <Button sx={{margin: "1em"}} variant="contained" onClick={openDrawer}>Browse decision tree</Button>
            <Drawer anchor={"right"} open={drawerState} onClose={() => setDrawerState(false)}>
                {activeTree ? <DecisionTreeGraph rootNode={activeTree} /> : <></>}
            </Drawer>
        </Box>
    );
}

export default CaseAnalysis;