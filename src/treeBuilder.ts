import { isScmBoolean, isScmChar, isScmFloat, isScmNil, isScmNumber, isScmPair, isScmString, isScmSymbol, isScmVector, isScmVoid, ScmBoolean, ScmChar, ScmNil, ScmNumber, ScmPair, ScmString, ScmSymbol, ScmVector, ScmVoid, SExp } from "./parserTypes";

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