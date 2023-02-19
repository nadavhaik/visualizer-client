
import React, { ChangeEvent, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import editor from 'monaco-editor';
import Editor,  { OnMount } from "@monaco-editor/react";
import Tree from 'react-d3-tree';
import axios from "axios";
import styles from './custom-tree.module.css';
// import './custom-tree.module.css';
import jsPDF from 'jspdf';
import * as d3 from 'd3';


import { Exp, ExpTag, SExp } from './parserTypes';
import { visualizeExp, visualizeExpTag, visualizeSExp } from './treeBuilder';
import { schemeChezLang } from './schemeChez';
const configurations = require("./configurations.json");


type ParsingMode = "READER" | "TAG_PARSER" | "SEMANTIC_ANALYZER"
const isParsingMode = (x: any): x is ParsingMode => x === "READER" || x === "TAG_PARSER" || x === "SEMANTIC_ANALYZER";

const DEFAULT_PARSING_MODE: ParsingMode = "READER";
const PARSER_ADDRESS = `http://${configurations.parser.host}/${configurations.parser.endPoint}`;
const DARK_MODE = true;


async function fetchFromServer(code: string, mode: ParsingMode) {
  const response = await axios.post(PARSER_ADDRESS,
    JSON.stringify({ mode: mode,  code: code}),
    {headers: { 'Content-Type': 'application/json' }}).then((x) => x, (error) => {
      alert(`An error has occured while trying to parse your code. Is your code valid?`);
      throw error;
    });
  return response.data;
}



function App() {
  useEffect(() => {
    document.title = 'Scheme Visualizer';
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.getModel()?.updateOptions({
      bracketColorizationOptions: {enabled: true}
    });
    editor.updateOptions({cursorStyle: 'line', cursorBlinking: 'smooth', cursorWidth: fontSize, fontSize: fontSize});
    
    monaco.languages.setMonarchTokensProvider('scheme', schemeChezLang);
  }

  function updateFontSize(newFontSize: number) {
    editorRef.current?.updateOptions({cursorStyle: 'line', cursorBlinking: 'smooth', cursorWidth: newFontSize, fontSize: newFontSize});
    setFontSize(newFontSize);
  }

  function incrementFontSize() {
    updateFontSize(fontSize+1);
  }

  function decrementFontSize() {
    if(fontSize === 1) {
      return;
    }
    updateFontSize(fontSize-1);
  }

  const editorRef = useRef<editor.editor.IStandaloneCodeEditor | null>(null);
  const [parsingMode, setParsingMode] = React.useState<ParsingMode>(DEFAULT_PARSING_MODE);
  const [tree, setTree] = React.useState<any>({});
  const [fontSize, setFontSize] = React.useState<number>(16);

  async function buildFromReader() {
    const sexprs: SExp[] = (await fetchFromServer(getCode(), 'READER')) as SExp[];
    if(sexprs.length === 0) {
      setTree({});
    } else {
      setTree(visualizeSExp(sexprs[sexprs.length-1]));
    }
  }

  async function buildFromTagParser() {
    const exprs: Exp[] = (await fetchFromServer(getCode(), 'TAG_PARSER')) as Exp[];
    if(exprs.length === 0) {
      setTree({});
    } else {
      setTree(visualizeExp(exprs[exprs.length-1]));
    }
  }

  async function buildFromSemantics() {
    const exprsTag: ExpTag[] = (await fetchFromServer(getCode(), 'SEMANTIC_ANALYZER')) as ExpTag[];
    if(exprsTag.length === 0) {
      setTree({});
    } else {
      setTree(visualizeExpTag(exprsTag[exprsTag.length-1]));
    }
  }
  
  function buildTree() {
    if(parsingMode === 'READER') {
      buildFromReader();
    } else if(parsingMode === 'TAG_PARSER') {
      buildFromTagParser();
    }
    else if(parsingMode === 'SEMANTIC_ANALYZER') {
      buildFromSemantics();
    }
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

  function getSVG() {
    const svgDocs = document.getElementsByTagName("svg");
    if(svgDocs.length !== 1) {
      throw Error("Couldn't get SVG!");
    } 
    return svgDocs[0];
  }

  const w = 1980;
  const h = 980;

  function svgToCanvas(){
    // Select the first svg element
    


    var svg = getSVG(),
        img = new Image(),
        serializer = new XMLSerializer(),
        svgStr = serializer.serializeToString(svg);

    img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);

    // You could also use the actual string without base64 encoding it:
    //img.src = "data:image/svg+xml;utf8," + svgStr;

    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    canvas.width = w;
    canvas.height = h;
    
    canvas.getContext("2d")!.drawImage(img,0,0,w,h);
    // Now save as png or whatever
    return canvas;
};

  async function exportPDF() {
    const canvas = svgToCanvas();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
    // pdf.output('dataurlnewwindow');
    pdf.save("download.pdf");
  }



  return (
    
   <div>
   {/* <style>{'body { background-color: #1e1e1e; }'}</style> */}
   <div
   style={{border: '1px solid rgb(0,0,0)', fill: '#5555ff'}}
   >
    
   <Editor
     height="30vh"
     theme={DARK_MODE ? 'vs-dark' : 'vs-light'}
     defaultLanguage="scheme"
     defaultValue=""
     onMount={handleEditorDidMount}
   />
   </div>
      


  <select value={parsingMode}
    // style={{ backgroundColor: "black", color: "white", marginLeft: 50, font: 'calibri'}}
    style={{ marginLeft: 50, font: 'calibri'}}

    onChange={handleParserChoice}>
    <option value="READER">Reader</option>
    <option value="TAG_PARSER">Tag Parser</option>
    <option value="SEMANTIC_ANALYZER">Semantic Analyzer</option>
  </select>
  <button onClick={buildTree}
    // style={{ backgroundColor: "black", color: "white", marginLeft: 10, font: 'calibri'}}
    style={{ marginLeft: 10, font: 'calibri'}}
    >Build AST</button>

  {/* <button onClick={exportPDF}
    style={{ backgroundColor: "black", color: "white", marginLeft: 10, font: 'calibri'}}
  >Save PDF</button> */}

  <button onClick={incrementFontSize}
    // style={{ backgroundColor: "black", color: "white", marginLeft: 10, font: 'calibri'}}
    style={{ marginLeft: 10, font: 'calibri'}}
    >+</button>

   <button onClick={decrementFontSize}
    // style={{ backgroundColor: "black", color: "white", marginLeft: 10, font: 'calibri'}}
    style={{ marginLeft: 5, font: 'calibri'}}
    >-</button>


  <div id="treeWrapper" style={{ width: "100%", height: "66vh", color: "white" , fill: "white"}}   >
  
  <Tree 
    orientation="vertical"
    translate={{ x: 900, y: 100 }}
    // zoomable={false}
   data={tree} 
  //  renderCustomNodeElement={()=> ({fill: "white"})}
  // onUpdate={}
  />
  </div>
  
</div> 
   
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
