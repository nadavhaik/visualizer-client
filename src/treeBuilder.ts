import { Exp, isLambdaOpt, isLambdaSimple, isScmApplic, isScmBoolean, isScmChar, isScmConst, isScmFloat, isScmIf, isScmLambda, isScmNil, isScmNumber, isScmOr, isScmPair, isScmSeq, isScmString, isScmSymbol, isScmVarDef, isScmVarGet, isScmVarSet, isScmVector, isScmVoid, LambdaKind, LambdaOpt, LambdaSimple, OcamlList, ScmApplic, ScmBoolean, ScmChar, ScmConst, ScmIf, ScmLambda, ScmNil, ScmNumber, ScmOr, ScmPair, ScmSeq, ScmString, ScmSymbol, ScmVar, ScmVarDef, ScmVarGet, ScmVarSet, ScmVector, ScmVoid, SExp } from "./parserTypes";

export type TreeNode = {
    name: string,
    attributes?: {[key: string]: string},
    children?: TreeNode[]
};

export const nameOnly = (name: string): TreeNode => ({name: name});

export type Visualizer<T> = (t: T) => TreeNode;

export const visualizeSymbol: Visualizer<ScmSymbol> = (symbol) => nameOnly(`'${symbol.value}`);

export const visualizeVoid: Visualizer<ScmVoid> = () => nameOnly('#<void>');

export const visualizeNil: Visualizer<ScmNil> = () => nameOnly("'( )");

export const visualizeBool: Visualizer<ScmBoolean> = (bool) => nameOnly(bool ? '#t' : '#f');

export const visualizeChar: Visualizer<ScmChar> = (c) => {
    switch(c.value) {
        case '\n':
            return nameOnly("#\\newline");
        case '\r':
            return nameOnly("\\return");
        case '\f':
            return nameOnly("#\\page");
        case '\t':
            return nameOnly("#\\tab");
        case ' ':
            return nameOnly('#\\space');
        default:
            return nameOnly(`#\\${c.value}`);
    }
}

export const visualizeString: Visualizer<ScmString> = (str) => nameOnly(`"${str.value}"`);

export const visualizeNumber: Visualizer<ScmNumber> = (num) => {
    if(isScmFloat(num)) {
        return nameOnly(num.toString());
    }
    if(num.value.numerator === 0) {
        return nameOnly('0');
    }
    if(num.value.denominator === 1) {
        return nameOnly(num.value.numerator.toString());
    }
    if(num.value.denominator === -1) {
        return nameOnly((-num.value.numerator).toString());
    }

    return nameOnly(`${num.value.numerator.toString()}/${num.value.denominator.toString()}`);
};

export const visualizeVector: Visualizer<ScmVector> = (vec) => ({name: 'ScmVec', children: vec.value.map(visualizeSExp)});

export const visualizePair: Visualizer<ScmPair> = (pair) => ({name: 'ScmPair', children: [visualizeSExp(pair.value.car), visualizeSExp(pair.value.cdr)]});


export function visualizeSExp(sexp: SExp): TreeNode {
    if(isScmVoid(sexp)) {
        return visualizeVoid(sexp);
    }
    if(isScmNil(sexp)) {
        return visualizeNil(sexp);
    }
    if(isScmBoolean(sexp)) {
        return visualizeBool(sexp);
    }
    if(isScmChar(sexp)) {
        return visualizeChar(sexp);
    }
    if(isScmString(sexp)) {
        return visualizeString(sexp);
    }
    if(isScmSymbol(sexp)) {
        return visualizeSymbol(sexp);
    }
    if(isScmNumber(sexp)) {
        return visualizeNumber(sexp);
    }
    if(isScmVector(sexp)) {
        return visualizeVector(sexp);
    }
    if(isScmPair(sexp)) {
        return visualizePair(sexp);
    }
    
    throw Error(`Unknown sexp: ${sexp}`);

}

export const visualizeVar: Visualizer<ScmVar> = (scmVar) => nameOnly(`var ${scmVar.value.name}`);

export const visualizeLambdaSimple: Visualizer<LambdaSimple> = () => nameOnly('Simple');

export const visualizeLambdaOpt: Visualizer<LambdaOpt> = (opt) => nameOnly(`opt ${opt.value.opt}`);

export const visualizeLambdaKind: Visualizer<LambdaKind> = (lambdaKind) => {
    if(isLambdaSimple(lambdaKind)) {
        return visualizeLambdaSimple(lambdaKind);
    }
    if(isLambdaOpt(lambdaKind)) {
        return visualizeLambdaOpt(lambdaKind);
    }
    throw new Error(`Unrecognized lambda kind: ${lambdaKind}`);
};

export const visualizeScmConst: Visualizer<ScmConst> = (scmConst) => ({name: 'ScmConst', children: [visualizeSExp(scmConst.value.sexpr)]});

export const visualizeVarGet: Visualizer<ScmVarGet> = (varGet) => ({name: 'ScmVarGet', children: [visualizeVar(varGet.value.var)]});

export const visualizeScmIf: Visualizer<ScmIf> = (scmIf) => ({name: 'ScmIf', children: [visualizeExp(scmIf.value.test), visualizeExp(scmIf.value.dit), visualizeExp(scmIf.value.dif)]});

export const visualizeSeq: Visualizer<ScmSeq> = (scmSeq) => ({name: 'ScmSeq', children: scmSeq.value.exprs.value.map(visualizeExp)});

export const visualizeOr: Visualizer<ScmOr> = (scmSeq) => ({name: 'ScmOr', children: scmSeq.value.exprs.value.map(visualizeExp)});

export const visualizeVarSet: Visualizer<ScmVarSet> = (varSet) => ({name: 'ScmVarSet', children: [visualizeVar(varSet.value.var), visualizeExp(varSet.value.val)]});

export const visualizeVarDef: Visualizer<ScmVarDef> = (varDef) => ({name: 'ScmVarDef', children: [visualizeVar(varDef.value.var), visualizeExp(varDef.value.val)]});


export const visualizeStrings: Visualizer<OcamlList<string>> = (strings) => ({name: 'OcamlList', children: strings.value.map(str => nameOnly(`"${str}"`))});

export const visualizeLambda: Visualizer<ScmLambda> = (lambda) => ({name: 'ScmLambda', children: [visualizeStrings(lambda.value.params), visualizeLambdaKind(lambda.value.kind),
    visualizeExp(lambda.value.body)]});

export const visualizeApplic: Visualizer<ScmApplic> = (applic) => ({name: 'ScmApplic', children: [visualizeExp(applic.value.applicative), visualizeExps(applic.value.params)]});

export const visualizeExps: Visualizer<OcamlList<Exp>> = (exps) => ({name: 'OcamlList', children: exps.value.map(visualizeExp)});

export function visualizeExp(exp: Exp): TreeNode {
    if(isScmConst(exp)) {
        return visualizeScmConst(exp);
    }
    if(isScmVarGet(exp)) {
        return visualizeVarGet(exp);
    }
    if(isScmIf(exp)) {
        return visualizeScmIf(exp);
    }
    if(isScmSeq(exp)) {
        return visualizeSeq(exp);
    }
    if(isScmOr(exp)) {
        return visualizeOr(exp);
    }
    if(isScmVarSet(exp)) {
        return visualizeVarSet(exp);
    }
    if(isScmVarDef(exp)) {
        return visualizeVarDef(exp);
    }
    if(isScmLambda(exp)) {
        return visualizeLambda(exp);
    }
    if(isScmApplic(exp)) {
        return visualizeApplic(exp);
    }
    throw Error(`Unrecognized exp: ${exp}`)
    
}


