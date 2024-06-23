import { CaseAnalysisCriterion, CaseAnalysisCriterionState } from "./CaseAnalysisCriterion";

export type Question = {
    questionId: number;
}

export type QuestionResponse = {
    decision: CaseAnalysisCriterion;
    hasNextQuestion: boolean;
    conclusion: string | undefined;
}

export type DecisionTreeEntry = {
    treeId: number;
    treeDisplayName: string;
}

export type DecisionTreeNode = {
    question: string;
    yes: DecisionTreeNode | string;
    no: DecisionTreeNode | string;
    decidedState?: CaseAnalysisCriterionState;
}

export enum DecisionGraphNodeType {
    QUESTION,
    CONCLUSION
}

export type DecisionGraphNode = {
    question: string,
    type: DecisionGraphNodeType,
    state?: CaseAnalysisCriterionState
}

export type DecisionGraphEdge = {
    from: DecisionGraphNode,
    to: DecisionGraphNode,
    label: string,
    isTraversed: boolean
}

export type DecisionGraphLayout = {
    nodes: DecisionGraphNode[],
    edges: DecisionGraphEdge[]
}