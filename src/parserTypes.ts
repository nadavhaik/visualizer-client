// SExpr:

export type ScmVoid = {
    type: "ScmVoid"
};
export const isScmVoid = (x: any): x is ScmVoid => x.type === "ScmVoid";

export type ScmNil = {
    type: "ScmNil"
};
export const isScmNil = (x: any): x is ScmNil => x.type === "ScmNil";

export type ScmBoolean = boolean;
export const isScmBoolean = (x: any): x is ScmBoolean => typeof x === 'boolean';

export type ScmRational = {
    type: 'ScmRational',
    value: {
        numerator: number,
        denominator: number
    }
};

export const isScmRational = (x: any): x is ScmRational => x.type === 'ScmRational';

export type ScmFloat = number;
export const isScmFloat = (x: any): x is ScmFloat => typeof x === 'number';

export type ScmNumber = ScmRational | ScmFloat;
export const isScmNumber = (x: any): x is ScmNumber => isScmRational(x) || isScmFloat(x);

export type ScmChar = {
    type: 'ScmChar',
    value: string
};
export const isScmChar = (x: any): x is ScmChar => x.type === 'ScmChar';

export type ScmString = {
    type: 'ScmString',
    value: string
};
export const isScmString = (x: any): x is ScmString => x.type === 'ScmString';

export type ScmSymbol = {
    type: 'ScmSymbol',
    value: string
};
export const isScmSymbol = (x: any): x is ScmSymbol => x.type === 'ScmSymbol';

export type OcamlList<T> = {
    type: 'OcamlList',
    value: T[]
};

export const isOcamlListOf = <T> (x: any, isT: (y: any) => y is T): x is OcamlList<T> =>
    x.type === 'OcamlList' && Array.isArray(x.value) && (x.value as any[]).every(p => isT(p));

export type ScmPair = {
    type: 'ScmPair'
    value: {
        car: SExp,
        cdr: SExp
    }
};
export const isScmPair = (x: any): x is ScmPair => x.type === 'ScmPair';

export type ScmVector = {
    type: 'OcamlList',
    value: SExp[]
};
export const isScmVector = (x: any): x is ScmVector => isOcamlListOf(x, isSExp);

export type SExp = ScmVoid | ScmNil | ScmBoolean | ScmChar | ScmString | ScmSymbol | ScmNumber | ScmVector | ScmPair;
export const isSExp = (x: any): x is SExp => isScmVoid(x) || isScmNil(x) || isScmBoolean(x) || isScmChar(x) ||
    isScmString(x) || isScmSymbol(x) || isScmNumber(x) || isScmVector(x);


// Exp:

export type ScmVar = {
    type: 'ScmVar',
    value: {
        name: string
    }
};
export const isScmVar = (x: any): x is ScmVar => x.type === 'ScmVar';

export type LambdaSimple = {type: 'LambdaSimple'};
export const isLambdaSimple = (x: any): x is LambdaSimple => x.type === 'LambdaSimple';

export type LambdaOpt = {
    type: 'LambdaOpt'
    value: {
        opt: string
    }
};
export const isLambdaOpt = (x: any): x is LambdaOpt => x.type === 'LambdaOpt';

export type LambdaKind = LambdaOpt | LambdaSimple;


export type ScmConst = {
    type: 'ScmConst'
    value: {
        sexpr: SExp
    }
};
export const isScmConst = (x: any): x is ScmConst => x.type === 'ScmConst';

export type ScmVarGet = {
    type: 'ScmVarGet'
    value: {
        var: ScmVar
    }
};
export const isScmVarGet = (x: any): x is ScmVarGet => x.type === 'ScmVarGet'

export type ScmIf = {
    type: 'ScmIf'
    value: {
        test: Exp
        dit: Exp
        dif: Exp
    }
};
export const isScmIf = (x: any): x is ScmIf => x.type === 'ScmIf';

export type ScmSeq = {
    type: 'ScmSeq',
    value: {exprs: OcamlList<Exp>}
};
export const isScmSeq = (x: any): x is ScmSeq => x.type === 'ScmSeq';

export type ScmOr = {
    type: 'ScmOr',
    value: {exprs: OcamlList<Exp>}
};
export const isScmOr = (x: any): x is ScmOr => x.type === 'ScmOr';

export type ScmVarSet = {
    type: 'ScmVarSet',
    value: {
        var: ScmVar,
        val: Exp
    }
};
export const isScmVarSet = (x: any): x is ScmVarSet => x.type === 'ScmVarSet';

export type ScmVarDef = {
    type: 'ScmVarDef',
    value: {
        var: ScmVar,
        val: Exp
    }
};
export const isScmVarDef = (x: any): x is ScmVarDef => x.type === 'ScmVarDef';

export type ScmLambda = {
    type: 'ScmLambda',
    value: {
        params: string[],
        kind: LambdaKind,
        body: Exp
    }
};
export const isScmLambda = (x: any): x is ScmLambda => x.type === 'ScmLambda';

export type ScmApplic = {
    type: 'ScmApplic',
    value: {
        applicative: Exp,
        params: OcamlList<Exp>
    }
};
export const isScmApplic = (x: any): x is ScmApplic => x.type === 'ScmApplic';


export type Exp = ScmConst | ScmVarGet | ScmIf | ScmSeq | ScmOr | ScmVarSet | ScmVarDef | ScmLambda | ScmApplic;


// Exp':

export type AppKind = {
    type: 'AppKind',
    value: 'Tail_Call' | 'Non_Tail_Call'
};
export const isAppKind = (x: any): x is AppKind => x.type === 'AppKind';

export type Free = {type: 'Free'};
export const isFree = (x: any): x is Free => x.type === 'Free';

export type Param = {
    type: 'Param',
    value: {
        minor: number
    }
};
export const isParam = (x: any): x is Param => x.type === 'Param';

export type Bound = {
    type: 'Bound',
    value: {
        major: number,
        minor: number
    }
}
export const isBound = (x: any): x is Bound => x.type === 'Bound';

export type  LexicalAddress = Free | Param | Bound;

export type ScmVarTag = {
    type: 'ScmVarTag',
    value: {
        name: string,
        lexical_address: LexicalAddress
    }
};
export const isScmVarTag = (x: any): x is ScmVarTag => x.type === 'ScmVarTag';

export type ScmConstTag = ScmConst;
export const isScmConstTag = isScmConst;

export type ScmVarGetTag = {
    type: 'ScmVarGetTag'
    value: {var: ScmVarTag}
};
export const isScmVarGetTag = (x: any): x is ScmVarGetTag => x.type === 'ScmVarGetTag';

export type ScmIfTag = {
    type: 'ScmIfTag',
    value: {
        test: ExpTag
        dit: ExpTag
        dif: ExpTag
    }
};
export const isScmIfTag = (x: any): x is ScmIfTag => x.type === 'ScmIfTag';

export type ScmSeqTag = {
    type: 'ScmSeqTag',
    value: {exprs: OcamlList<ExpTag>}
};
export const isScmSeqTag = (x: any): x is ScmSeqTag => x.type === 'ScmSeqTag';

export type ScmOrTag = {
    type: 'ScmOrTag',
    value: {exprs: OcamlList<ExpTag>}
};
export const isScmOrTag = (x: any): x is ScmOrTag => x.type === 'ScmOrTag';

export type ScmVarSetTag = {
    type: 'ScmVarSetTag'
    value: {
        var: ScmVarTag,
        val: ExpTag
    }
};
export const isScmVarSetTag = (x: any): x is ScmVarSetTag => x.type === 'ScmVarSetTag';

export type ScmVarDefTag = {
    type: 'ScmVarDefTag'
    value: {
        var: ScmVarTag,
        val: ExpTag
    }
};
export const isScmVarDefTag = (x: any): x is ScmVarDefTag => x.type === 'ScmVarDefTag';


export type ScmBoxTag = {
    type: 'ScmBoxTag',
    value: {var: ScmVarTag}
};
export const isScmBoxTag = (x: any): x is ScmBoxTag => x.type === 'ScmBoxTag';

export type ScmBoxGetTag = {
    type: 'ScmBoxGetTag',
    value: {var: ScmVarTag}
};
export const isScmBoxGetTag = (x: any): x is ScmBoxGetTag => x.type === 'ScmBoxGetTag';


export type ScmBoxSetTag = {
    type: 'ScmBoxSetTag',
    value: {
        var: ScmVarTag
        val: ExpTag
    }
};
export const isScmBoxSetTag = (x: any): x is ScmBoxSetTag => x.type === 'ScmBoxSetTag';

export type ScmLambdaTag = {
    type: 'ScmLambdaTag',
    value: {
        params: OcamlList<string>,
        body: ExpTag
    }
};
export const isScmLambdaTag = (x: any): x is ScmLambdaTag => x.type === 'ScmLambdaTag';


export type ScmApplicTag = {
    type: 'ScmApplicTag'
    value: {
        applicative: ExpTag,
        params: OcamlList<ExpTag>,
        kind: AppKind
    }
};
export const isScmApplicTag = (x: any): x is ScmApplicTag => x.type === 'ScmApplicTag';


export type ExpTag =  ScmConstTag | ScmVarGetTag | ScmIfTag | ScmSeqTag | ScmOrTag | ScmVarSetTag 
    | ScmVarDefTag | ScmBoxTag | ScmBoxGetTag | ScmBoxSetTag | ScmLambdaTag | ScmApplicTag;



