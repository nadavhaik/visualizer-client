import { AppKind, Exp, ExpTag, isBound, isFree, isLambdaOpt, isLambdaSimple, isParam, isScmApplic, isScmApplicTag, isScmBoolean, isScmBoxGetTag, isScmBoxSetTag, isScmBoxTag, isScmChar, isScmConst, isScmConstTag, isScmFloat, isScmIf, isScmIfTag, isScmLambda, isScmLambdaTag, isScmNil, isScmNumber, isScmOr, isScmOrTag, isScmPair, isScmSeq, isScmSeqTag, isScmString, isScmSymbol, isScmVarDef, isScmVarDefTag, isScmVarGet, isScmVarGetTag, isScmVarSet, isScmVarSetTag, isScmVector, isScmVoid, LambdaKind, LambdaOpt, LambdaSimple, LexicalAddress, OcamlList, ScmApplic, ScmApplicTag, ScmBoolean, ScmBoxGetTag, ScmBoxSetTag, ScmBoxTag, ScmChar, ScmConst, ScmConstTag, ScmIf, ScmIfTag, ScmLambda, ScmLambdaTag, ScmNil, ScmNumber, ScmOr, ScmOrTag, ScmPair, ScmSeq, ScmSeqTag, ScmString, ScmSymbol, ScmVar, ScmVarDef, ScmVarDefTag, ScmVarGet, ScmVarGetTag, ScmVarSet, ScmVarSetTag, ScmVarTag, ScmVector, ScmVoid, SExp } from "./parserTypes";

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

export const visualizeAppKind: Visualizer<AppKind> = (appKind) => nameOnly(appKind.value);

export const visualizeLexicalAddress: Visualizer<LexicalAddress> = (lex) => {
    if(isFree(lex)) {
        return nameOnly('Free')
    }
    if(isParam(lex)) {
        return nameOnly(`Param(${lex.value.minor})`);
    }
    if(isBound(lex)) {
        return nameOnly(`Bound(${lex.value.major},${lex.value.minor})`);
    }

    throw new Error(`Unrecognized lexical address: ${lex}`);
};

export const visualizeVarTag: Visualizer<ScmVarTag> = (varTag) => ({name: "var'", 
    children: [nameOnly(varTag.value.name) ,visualizeLexicalAddress(varTag.value.lexical_address)]});


export const visualizeScmConstTag: Visualizer<ScmConstTag> = (scmConstTag) => ({name: "ScmConst'", children: [visualizeSExp(scmConstTag.value.sexpr)]});

export const visualizeVarGetTag: Visualizer<ScmVarGetTag> = (varGetTag) => ({name: "ScmVarGet'", children: [visualizeVarTag(varGetTag.value.var)]});

export const visualizeIfTag: Visualizer<ScmIfTag> = (ifTag) => ({name: "ScmIf'", 
    children: [visualizeExpTag(ifTag.value.test), visualizeExpTag(ifTag.value.dit), visualizeExpTag(ifTag.value.dif)]});

export const visualizeSeqTag: Visualizer<ScmSeqTag> = (seqTag) => ({name: "ScmSeq'", children: seqTag.value.exprs.value.map(visualizeExpTag)});

export const visualizeOrTag: Visualizer<ScmOrTag> = (orTag) => ({name: "ScmOr'", children: orTag.value.exprs.value.map(visualizeExpTag)});

export const visualizeVarSetTag: Visualizer<ScmVarSetTag> = (varSetTag) => ({name: "ScmVarSet'", children: [visualizeVarTag(varSetTag.value.var), visualizeExpTag(varSetTag.value.val)]});

export const visualizeVarDefTag: Visualizer<ScmVarDefTag> = (varDefTag) => ({name: "ScmVarDef'", children: [visualizeVarTag(varDefTag.value.var), visualizeExpTag(varDefTag.value.val)]});

export const visualizeScmBoxTag: Visualizer<ScmBoxTag> = (boxTag) => ({name: "ScmBox'", children: [visualizeVarTag(boxTag.value.var)]});

export const visualizeScmBoxGetTag: Visualizer<ScmBoxGetTag> = (boxGetTag) => ({name: "ScmBoxGet'", children: [visualizeVarTag(boxGetTag.value.var)]});

export const visualizeScmBoxSetTag: Visualizer<ScmBoxSetTag> = (boxSetTag) => ({name: "ScmBoxSet'", children: [visualizeVarTag(boxSetTag.value.var), visualizeExpTag(boxSetTag.value.val)]});

export const visualizeLambdaTag: Visualizer<ScmLambdaTag> = (lambdaTag) => ({name: "ScmLambda'", children: [visualizeStrings(lambdaTag.value.params), visualizeExpTag(lambdaTag.value.body)]});

export const visualizeApplicTag: Visualizer<ScmApplicTag> = (applicTag) => ({name: "ScmApplic'", 
    children: [visualizeExpTag(applicTag.value.applicative), visualizeExprsTag(applicTag.value.params), visualizeAppKind(applicTag.value.kind)]});


export const visualizeExprsTag: Visualizer<OcamlList<ExpTag>> = (exprs) => ({name: "OcamlList", children: exprs.value.map(visualizeExpTag)});

export function visualizeExpTag(expTag: ExpTag): TreeNode {
    if(isScmConstTag(expTag)) {
        return visualizeScmConstTag(expTag);
    }
    if(isScmVarGetTag(expTag)) {
        return visualizeVarGetTag(expTag);
    }
    if(isScmIfTag(expTag)) {
        return visualizeIfTag(expTag);
    }
    if(isScmSeqTag(expTag)) {
        return visualizeSeqTag(expTag);
    }
    if(isScmOrTag(expTag)) {
        return visualizeOrTag(expTag);
    }
    if(isScmVarSetTag(expTag)) {
        return visualizeVarSetTag(expTag);
    }
    if(isScmVarDefTag(expTag)) {
        return visualizeVarDefTag(expTag);
    }
    if(isScmBoxTag(expTag)) {
        return visualizeScmBoxTag(expTag);
    }
    if(isScmBoxGetTag(expTag)) {
        return visualizeScmBoxGetTag(expTag);
    }
    if(isScmBoxSetTag(expTag)) {
        return visualizeScmBoxSetTag(expTag);
    }
    if(isScmLambdaTag(expTag)) {
        return visualizeLambdaTag(expTag);
    }
    if(isScmApplicTag(expTag)) {
        return visualizeApplicTag(expTag);
    }

    throw new Error(`Unrecognized exp': ${expTag}`);

}


