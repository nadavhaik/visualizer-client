
import React, { ChangeEvent, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import editor from 'monaco-editor';
import Editor,  { OnMount } from "@monaco-editor/react";
import Tree from 'react-d3-tree';
import styles from './custom-tree.module.css'



type ParsingMode = "READER" | "TAG_PARSER" | "SEMANTIC_ANALYZER"
const isParsingMode = (x: any): x is ParsingMode => x === "READER" || x === "TAG_PARSER" || x === "SEMANTIC_ANALYZER";
const DEFAULT_PARSING_MODE: ParsingMode = "READER";



const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      children: [
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};


function App() {
  const editorRef = useRef<editor.editor.IStandaloneCodeEditor | null>(null);
  const [parsingMode, setParsingMode] = React.useState<ParsingMode>(DEFAULT_PARSING_MODE);
  const [tree, setTree] = React.useState<any>({});
  

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  }

  function printContent() {
    alert(getCode());
    setTree(orgChart);
  }

  function getCode(): string {
    const editor = editorRef?.current;
    if(editor === null) {
      return "";
    }
    return editor.getValue();
  }
 

  function handleParserChoice(event: ChangeEvent<HTMLSelectElement>) {
    const mode = event.target.value;
    if(!isParsingMode(mode)) {
      throw Error(`Not a parsing mode: ${mode}`);
    }
    setParsingMode(mode);    
  }


  
  return (
    
   <div
   ><style>{'body { background-color: #1e1e1e; }'}</style>
   <div
   style={{border: '1px solid rgba(192,192,192, 0.01)', }}
   >
   <Editor
     height="30vh"
     theme="vs-dark"
     defaultLanguage="scheme"
     defaultValue=""
     onMount={handleEditorDidMount}
   />
   </div>
      
   
   

  <select value={parsingMode}
    style={{ backgroundColor: "black", color: "white", marginLeft: 50, font: 'calibri'}}
    onChange={handleParserChoice}>
    <option value="READER">Reader</option>
    <option value="TAG_PARSER">Tag Parser</option>
    <option value="SEMANTIC_ANALYZER">Semantic Analyzer</option>
  </select>
  <button onClick={printContent}
    style={{ backgroundColor: "black", color: "white", marginLeft: 10, font: 'calibri'}}
    >Build AST</button>
    <div id="treeWrapper" style={{ width: "100%", height: "100vh", color: "white"}}  >

  <Tree
    orientation="vertical"
    translate={{ x: 900, y: 100 }}
    rootNodeClassName="node__root"
    branchNodeClassName="node__branch"
    leafNodeClassName="node__leaf"
   data={tree} 
  />
  </div>
  
</div> 
   
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
