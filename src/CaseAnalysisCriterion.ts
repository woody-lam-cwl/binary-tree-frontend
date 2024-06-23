export enum CaseAnalysisCriterionState {
    YES,
    NO,
    UNCERTAIN
}

export type CaseAnalysisCriterion = {
    questionId: number;
    statement: string;
    reasoning: string;
    state: CaseAnalysisCriterionState;
};

export function parseCaseAnalysisCriterionState(stateString: string): CaseAnalysisCriterionState {
    switch (stateString.toLowerCase()) {
        case "yes":
            return CaseAnalysisCriterionState.YES;
        case "no":
            return CaseAnalysisCriterionState.NO;
        default:
            return CaseAnalysisCriterionState.UNCERTAIN;
    }
}
