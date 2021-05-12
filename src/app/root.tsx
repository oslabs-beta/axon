import React, {useState, useEffect} from 'react';
import './app.scss';
import FileImport from '@/app/components/fileImport';
import FileExport from '@/app/components/fileExport';
import options from "./options";
import uploadFolder from '../../assets/folderImport.png';
import createdTest from '../../assets/codeicon.png';
import postmanLogo from '../../assets/postmanLogoText.png'
import superTestCode from '../utils/automation';
import buildSuperTest from '../utils/buildSupertest';
import buildPostmanCollection from '../utils/buildPostman'
import MonacoEditor from "@monaco-editor/react";


const RootComponent = () => {
  
  
  const defaultInstructions = `
  /*
  Welcome to Axon!
  Upload the Server folder of an Express Application and 
  create your SuperTest file or Postman Collection!
  */
 `;
 const df = '//new line'
 
 // Using Hooks to set our state
 const [axonState, setAxonState] = useState <any | undefined> ({
   // The Path Object that will be created from the imported Folder
   pathObject: {},
   
   // State Related to show the progress the user is making as they upload a file
   progressText: 'Import server folder here',
   image: uploadFolder,
   progressVal: "0%",
   createDisable: true,
   postmanDisable: true,
   exportDisable: true,
   
   // State Related to the Content of the Monaco Editor
   superTestCode: defaultInstructions,
   postmanCollections: df,
   showPostManCode: false,
   showSuperTestCode: true,
   
   // Name of the File to Export
   textInput: ''
  });

  // TEST
  useEffect(() => {

    console.log('Current PostMan State: ', axonState.postmanCollections);
    console.log('Current SuperTestCode State: ', axonState.superTestCode);

  }, [axonState.superTestCode, axonState.postmanCollections])

  
  // Will update the State so that the super test code shows in the Monaco Editor
  const showSuperTestCode = () => {
    if(!axonState.showSuperTestCode){
      setAxonState({
        ...axonState,
        showPostManCode: false,
        showSuperTestCode: true
      })
    }
  }

  // Will update the State so that the Postman code shows in the Monaco Editor
  const showPostmanCode = () => {
    if (!axonState.showPostmanCode){
      setAxonState({
        ...axonState,
        showPostManCode: true,
        showSuperTestCode: false
      })
    }
  }

  const updateMonacoEditor = (monacoText: any): void => {
    console.log('Monico Editor has been updated');
    
    if (axonState.showPostManCode){
      console.log('MonacoTextInside:',monacoText)
      setAxonState({
        ...axonState,
        postmanCollections: monacoText, 
      });
      // console.log('postmanTextState:',axonState.postmanCollections)
    }else if(axonState.showSuperTestCode){
      // console.log('MonacoText:',monacoText)
      setAxonState({
        ...axonState,
        superTestCode: monacoText,
      });
      // console.log('postmanTextState:',axonState.postManCollections)
    }
  }


  // Updates the state once a file is imported
  const onImportClick = (pathObject: any, checkImage: any) => {
    setAxonState({...axonState, 
                  fileList: {}, 
                  progressText: "Your files have been imported", 
                  image: checkImage, 
                  progressVal: "33.33%", 
                  createDisable: false,
                  postmanDisable: false,
                  exportDisable: true, 
                  textInput: '',
                  pathObject: pathObject,
                }) 
  }


  // When the Create Button is pressed this will update the state with the superTestCode
  const onCreateButtonClick = () => {
    // Create the SuperTest Code
    const superTestCode = buildSuperTest(axonState.pathObject);

    // Update the State with the Super test code
    setAxonState(({...axonState,
      superTestCode: superTestCode, 
      progressText: "Supertest files created", 
      image:createdTest, 
      progressVal: "66.66%", 
      exportDisable: false, 
      createDisable: true,
      showPostManCode: false,
      showSuperTestCode: true,
    }))
  }

  const onPostmanButtonClick = () => {
    // Create json string
    const postmanCollections = buildPostmanCollection(axonState.pathObject);


    // Update the State with the Postman Collections
    setAxonState(({...axonState,
      progressText: "Postman Collection successfully created", 
      image:createdTest, 
      postmanCollections: postmanCollections,
      progressVal: "66.66%", 
      exportDisable: false, 
      postmanDisable: true,
      showPostManCode: true,
      showSuperTestCode: false,
    }))
  }

  
  
  // Updates state once a file is exported
  const onExportClick = (newProgressState:any, progVal: any, checkImg: any) => {
  setAxonState({...axonState, 
                progressText: newProgressState, 
                progressVal: progVal, 
                image: checkImg})
  }
  
  return (
    <main>
  
       {/* Main body (currently middle, will be left side) */}
      <div className="contentBox">
        
        {/* First part of the body. Displayed Progress Text and Bar */}
        <div id="progressDisplay">
          <h1>{axonState.progressText}</h1>
          <div id="progressbarNew" >
            <div style={{width: `${axonState.progressVal}`}}></div>
          </div>
        </div>
        
        {/* Second part of the body. Includes Import Button and Image. */}
        <div id="import">
          <FileImport setFileState={ onImportClick }  /> 
          <img id="fileImg" src={axonState.image}></img>
        </div>

        {/* Last part of the body. Displays Create &Export Button, and file name text box */}
        <div className="bottomBox">
          
          {/* Displays Create Button and Export Button. */}
          <div id="createExport">
            {/* button to generate supertest */}
            <button disabled={axonState.createDisable} id="createButton" onClick={onCreateButtonClick} >
            SuperTest
            </button> 
            {/* button to generate postman collection */}
            <button disabled={axonState.postmanDisable} id="createButton" onClick={onPostmanButtonClick}>
              <img id="postmanLogo" src={postmanLogo}/>
            </button>
          </div>
        </div>
            
      </div>

      <div className="MonacoBox">
        <div id="tabs">
          <button className={axonState.showSuperTestCode ? 'active-tab' : 'null'} onClick={showSuperTestCode}>SuperTest</button>
          <button className={axonState.showPostManCode ? 'active-tab' : 'null'} onClick={showPostmanCode}>Postman</button>
        </div>
        <MonacoEditor
          height="650px"
          width="600px"
          language={axonState.showSuperTestCode ? 'javascript': 'json'}
          options={options}
          theme="vs-dark"
          value={axonState.showPostManCode ? axonState.postmanCollections : axonState.superTestCode}
          onChange={updateMonacoEditor}
        /> 
        <div className="bottomBox">
          {/* Displays Text box when File is created and ready for export */}
          <FileExport fileType={axonState.showSuperTestCode} postmanCollection={axonState.postmanCollections} superTest={axonState.superTestCode} textInput={axonState.textInput} disableStatus={axonState.exportDisable} setProgressState={onExportClick}/>
        <div>
            <input hidden={axonState.exportDisable} placeholder="Enter Your File Name" type="text" autoComplete="off" id="fname" name="fname" value={axonState.textInput} onChange={e => {setAxonState({...axonState, textInput: e.target.value});}}/>
          </div>
        </div>
      </div>

    </main>
  )
}

export default RootComponent;