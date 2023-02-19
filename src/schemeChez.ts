// modified from: https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/scheme/scheme.ts
// added chez reserved words


import type { languages } from 'monaco-editor';

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: ';',
		blockComment: ['#|', '|#']
	},

	brackets: [
		['(', ')'],
		['{', '}'],
		['[', ']']
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	],

	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' }
	]
};

export const schemeChezLang: languages.IMonarchLanguage = {
	defaultToken: '',
	ignoreCase: true,
	tokenPostfix: '.scheme',

	brackets: [
		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.square' }
	],

	keywords: [
        'begin',
		'case',
        'car',
		'cdr',
        'cond',
		'do',
		'let',
        'let*',
        'letrec',
		'loop',
		'if',
		'else',
		'when',
		'cons',
		'lambda',
		'lambda*',
		'format',
		'set!',
		'quote',
		'eval',
		'append',
		'list',
		'list?',
		'member?',
		'load',
        'quasiquote',
        'quote',
        'unquote',
        'unquote-splicing'
	],

	constants: ['#t', '#f'],

	operators: ['eq?', 'eqv?', 'equal?', 'and', 'or', 'not', 'null?', '+', '-', '*', '/'],

	tokenizer: {
		root: [
			[/#[xXoObB][0-9a-fA-F]+/, 'number.hex'],
			[/[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?/, 'number.float'],

			[
				/(?:\b(?:(define|define-syntax|define-macro))\b)(\s+)((?:\w|>|<|\-|\!|\?)*)/,
				['keyword', 'white', 'variable']
			],

			{ include: '@whitespace' },
			{ include: '@strings' },

			[
				/[a-zA-Z_#][a-zA-Z0-9_\-\?\!\*]*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@constants': 'constant',
						'@operators': 'operators',
						'@default': 'identifier'
					}
				}
			]
		],

		comment: [
			[/[^\|#]+/, 'comment'],
			[/#\|/, 'comment', '@push'],
			[/\|#/, 'comment', '@pop'],
			[/[\|#]/, 'comment']
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/#\|/, 'comment', '@comment'],
			[/;.*$/, 'comment']
		],

		strings: [
			[/"$/, 'string', '@popall'],
			[/"(?=.)/, 'string', '@multiLineString']
		],

		multiLineString: [
			[/[^\\"]+$/, 'string', '@popall'],
			[/[^\\"]+/, 'string'],
			[/\\./, 'string.escape'],
			[/"/, 'string', '@popall'],
			[/\\$/, 'string']
		]
	}
};