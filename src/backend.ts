import { DecisionTreeEntry, DecisionTreeNode, Question, QuestionResponse } from "./decision_tree";
import { CaseAnalysisCriterionState, parseCaseAnalysisCriterionState } from "./CaseAnalysisCriterion";
import secrets from "./secrets.json";

const baseApiPath = secrets.baseApiPath

const postRequestBase = {"password": secrets.password}

function handleErrors(res: Response): Promise<Response> {
    return res.ok
        ? Promise.resolve(res)
        : Promise.reject(`${res.status}: ${res.statusText}`)
}

export async function classifyAndFetchFirst(scenario: string, treeId: number): Promise<Question> {
    return fetch(
        `${baseApiPath}/start`,
        {
            method: 'POST',
            body: JSON.stringify({
                "evidence": scenario,
                "tree_id": treeId,
                ...postRequestBase
            }),
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err))
        .then((obj) => Promise.resolve({questionId: obj.id}));
}

export async function askQuestion(scenario: string, questionId: number, treeId: number): Promise<QuestionResponse> {
    return fetch(
        `${baseApiPath}/answer`,
        {
            method: 'POST',
            body: JSON.stringify({
                "evidence": scenario,
                "q_id": questionId,
                "tree_id": treeId,
                ...postRequestBase
            }),
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err))
        .then((obj) => Promise.resolve({
            decision: {
                questionId: questionId,
                statement: obj.question,
                reasoning: obj.llm_reasoning,
                // HACK HERE - tidy later
                state: obj.llm_response ? parseCaseAnalysisCriterionState(obj.llm_response) : CaseAnalysisCriterionState.UNCERTAIN
            },
            hasNextQuestion: obj.conclusion ? false : true,
            conclusion: obj.conclusion
        }));
}

export async function challengeAnswer(scenario: string, questionId: number, treeId: number): Promise<QuestionResponse> {
    return fetch(
        `${baseApiPath}/challengeAnswer`,
        {
            method: 'POST',
            body: JSON.stringify({
                "evidence": scenario,
                "q_id": questionId,
                "tree_id": treeId,
                ...postRequestBase
            }),
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err))
        .then((obj) => Promise.resolve({
            decision: {
                questionId: questionId,
                statement: obj.question,
                reasoning: obj.llm_reasoning,
                // HACK HERE - tidy later
                state: obj.llm_response ? parseCaseAnalysisCriterionState(obj.llm_response) : CaseAnalysisCriterionState.UNCERTAIN
            },
            hasNextQuestion: obj.conclusion ? false : true,
            conclusion: obj.conclusion
        }));
}

export async function fetchNextQuestion(questionId: number, state: CaseAnalysisCriterionState, treeId: number): Promise<Question> {
    return fetch(
        `${baseApiPath}/getNext`,
        {
            method: 'POST',
            body: JSON.stringify({
                "q_id": questionId,
                "decision": state === CaseAnalysisCriterionState.YES ? "yes" : "no",
                "tree_id": treeId,
                ...postRequestBase
            }),
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err))
        .then((obj) => {return {
            questionId: obj.next_id
        }});
}

export async function getAllTrees(): Promise<DecisionTreeEntry[]> {
    return fetch(
        `${baseApiPath}/allTrees`,
        {
            method: 'GET',
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err))
        .then((arr: {id: number, name: string}[]) => arr.map(obj => {return {
            treeId: obj.id,
            treeDisplayName: obj.name
        }}));
}

export async function getTree(treeId: number): Promise<DecisionTreeNode> {
    return fetch(
        `${baseApiPath}/tree`,
        {
            method: 'POST',
            body: JSON.stringify({
                tree_id: treeId,
                ...postRequestBase
            }),
            headers: new Headers({"Content-Type": "application/json"}),
        })
        .then(handleErrors)
        .then((res) => res.json(), (err) => console.log(err));
}