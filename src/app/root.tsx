import React, { useState, useEffect } from 'react';
import './app.scss';
import FileImport from '@/app/components/fileImport';
import FileExport from '@/app/components/fileExport';
import MonacoEditor from '@monaco-editor/react';
import options from './options';
import uploadFolder from '../../assets/folderImport.png';
import createdTest from '../../assets/codeicon.png';
import postmanLogo from '../../assets/postmanLogoText.png';
import postmanIcon from '../../assets/postmanIcon.png';
import buildSuperTest from '../utils/buildSupertest';
import buildPostmanCollection from '../utils/buildPostman';

const RootComponent = () => {
  
  // Default instructions to appear in the Supertest Editor
  const defaultInstructions = `
  /*
  Welcome to Axon!
  Upload the Server folder of an Express Application and 
  create your SuperTest file or Postman Collection! 
  */
 `;

 // Default instructions to appear in the Postman Editor
  const defaultPostmanTab = `
 /* 
 Axon builds Postman Collections as well!
 Make sure to export from axon, then import your collection into Postman.
 This will autogenerate your test document APIs, and save you some time (:
 */
 `;

  // Initialize the State for the component
  const [axonState, setAxonState] = useState <any | undefined>({
    // The Path Object that will be created from the imported Folder
    pathObject: {},

    // State Related to showing the progress the user is making as they upload a file and generate code
    progressText: 'Import server folder here',
    image: uploadFolder,
    progressVal: '0%',
    createDisable: true,
    postmanDisable: true,
    exportDisable: true,

    // State Related to the Content of the Monaco Editor
    superTestCode: defaultInstructions,
    postmanCollections: defaultPostmanTab,
    showPostManCode: false,
    showSuperTestCode: true,

    // The name of the File to Export
    textInput: '',
  });

  // This function will update the State so that the Supertest code can be shown in the Monaco Editor
  const showSuperTestCode = () => {
    if (!axonState.showSuperTestCode) {
      setAxonState({
        ...axonState,
        showPostManCode: false,
        showSuperTestCode: true,
      });
    }
  };

  // This function will update the State so that the Postman code can be shown in the Monaco Editor
  const showPostmanCode = () => {
    if (!axonState.showPostmanCode) {
      setAxonState({
        ...axonState,
        showPostManCode: true,
        showSuperTestCode: false,
      });
    }
  };

  // This function will update the text of the Monaco editor, based on the 'showPostManCode' and 'showSuperTestCode' booleans in the State
  const updateMonacoEditor = (monacoText: any): void => {
    // Case: When the Postman Code should be shown
    if (axonState.showPostManCode) {
      setAxonState({
        ...axonState,
        postmanCollections: monacoText,
      });
    // Case: When the SuperTest Code should be shown
    } else if (axonState.showSuperTestCode) {
      setAxonState({
        ...axonState,
        superTestCode: monacoText,
      });
    }
  };

  // This function will update the state once a file is imported
  const onImportClick = (pathObject: any, checkImage: any) => {
    setAxonState({
      ...axonState,
      fileList: {},
      progressText: 'Your files have been imported',
      image: checkImage,
      progressVal: '33.33%',
      createDisable: false,
      postmanDisable: false,
      exportDisable: true,
      textInput: '',
      pathObject,
    });
  };

  // When the Create Button is pressed this will update the state with the superTestCode
  const onCreateButtonClick = () => {
    // Create the SuperTest Code
    const superTestCode = buildSuperTest(axonState.pathObject);

    // Update the State with the Super test code
    setAxonState(({
      ...axonState,
      superTestCode,
      progressText: 'Supertest files created',
      image: createdTest,
      progressVal: '66.66%',
      exportDisable: false,
      createDisable: true,
      showPostManCode: false,
      showSuperTestCode: true,
    }));
  };

  // When the Postman Button is pressed, this will update the state with the Postman collections
  const onPostmanButtonClick = () => {
    // Create the JSON string, representing the Postman collections
    const postmanCollections = buildPostmanCollection(axonState.pathObject);

    // Update the State with the Postman Collections
    setAxonState(({
      ...axonState,
      progressText: 'Postman Collection successfully created',
      image: postmanIcon,
      postmanCollections,
      progressVal: '66.66%',
      exportDisable: false,
      postmanDisable: true,
      showPostManCode: true,
      showSuperTestCode: false,
    }));
  };

  // This function will update the state once a file is exported, in order to show the current progress of the user
  const onExportClick = (newProgressState:any, progVal: any, checkImg: any) => {
    setAxonState({
      ...axonState,
      progressText: newProgressState,
      progressVal: progVal,
      image: checkImg,
    });
  };

  return (
    <main>
      {/* The Leftmost divider, representing the upload area */}
      <div className="contentBox">
        {/* Top of Upload area that displays the progress text and bar */}
        <div id="progressDisplay">
          <h1>{axonState.progressText}</h1>
          <div id="progressbarNew">
            <div style={{ width: `${axonState.progressVal}` }} />
          </div>
        </div>
        {/* Main upload area in the middle that includes the Import Button and Main Progress Image */}
        <div id="import">
          <FileImport setFileState={onImportClick} />
          <img id="fileImg" src={axonState.image} />
        </div>
        {/* Bottom-most divider, of the Upload Area. Contains the Supertest and Postman Buttons*/}
        <div className="bottomBox">
          {/* Button to generate supertest */}
          <div id="createExport">
            <button disabled={axonState.createDisable} id="createButton" onClick={onCreateButtonClick}>
              SuperTest
            </button>
            {/* Button to generate postman collection */}
            <button disabled={axonState.postmanDisable} id="createButton" onClick={onPostmanButtonClick}>
              <img id="postmanLogo" src={postmanLogo} />
            </button>
          </div>
        </div>
      </div>

      {/*The Rightmost divider, containing the Monaco Editor and related functionality*/}
      <div className="MonacoBox">
        {/* Divider containing the Tabs that allow for switching between types of text in Monaco editor */}
        <div id="tabs">
          <button className={axonState.showSuperTestCode ? 'active-tab' : 'unactive-tab'} onClick={showSuperTestCode}>SuperTest</button>
          <button className={axonState.showPostManCode ? 'active-tab' : 'unactive-tab'} onClick={showPostmanCode}>Postman</button>
        </div>
        {/* The Monaco Editor */}
        <MonacoEditor
          height="650px"
          width="600px"
          language={axonState.showSuperTestCode ? 'javascript' : 'json'}
          options={options}
          theme="vs-dark"
          value={axonState.showPostManCode ? axonState.postmanCollections : axonState.superTestCode}
          onChange={updateMonacoEditor}
        />
        {/* The Bottom Divider of the Monaco Editor Area */}
        <div className="bottomBox">
          {/* Displays Text box when File is created and ready for export */}
          <FileExport fileType={axonState.showSuperTestCode} postmanCollection={axonState.postmanCollections} superTest={axonState.superTestCode} textInput={axonState.textInput} disableStatus={axonState.exportDisable} setProgressState={onExportClick} />
          <div>
            <input hidden={axonState.exportDisable} placeholder="Enter Your File Name" type="text" autoComplete="off" id="fname" name="fname" value={axonState.textInput} onChange={(e) => { setAxonState({ ...axonState, textInput: e.target.value }); }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RootComponent;
