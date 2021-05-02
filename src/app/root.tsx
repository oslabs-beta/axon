import React, {useState, useEffect} from 'react';
import './app.scss';
import FileImport from '@/app/components/fileImport';
import FileExport from '@/app/components/fileExport';
import logo from '../../assets/AxonLogoDotSize.png';
import uploadFolder from '../../assets/folderImport.png';
import createdTest from '../../assets/codeicon.png';
import superTestCode from '../utils/automation';

//example import
// import algo1 from @app...

const RootComponent = () => {
  // Using Hooks to set our state
  const [axonState, setAxonState] = useState <any | undefined> ({
    fileList: {},
    superTestCode: "",
    progressText: 'Import server folder here',
    image: uploadFolder,
    progressVal: "0%",
    createDisable: true,
    exportDisable: true,
    textInput: '',
    
  });

  //dummy function
  //will erase when algo1 is officially imported
  const createSupertest = (list: object)  => {
    console.log(list)
    return "let a = 42";
  }
  
  return (
    <main>
      {/* Logo at top of the page */}
      <header>
        <img id="axonTitle" src={logo}></img>
      </header>
       
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
          <FileImport setFileState={(newFileState: any, newProgressState:any, newImage: any, progVal: any, boolCreate:boolean, boolExport:boolean, resetInput: string) => 
            setAxonState({...axonState, fileList: newFileState, progressText: newProgressState, image: newImage, progressVal: progVal, createDisable:boolCreate, exportDisable: boolExport, textInput: resetInput})  }  /> 
          <img id="fileImg" src={axonState.image}></img>
        </div>

        {/* Last part of the body. Displays Create &Export Button, and file name text box */}
        <div id="bottomBox">
          
          {/* Displays Text box when File is created and ready for export */}
          <div>
            <input hidden={axonState.exportDisable} placeholder="Enter Your File Name" type="text" id="fname" name="fname" value={axonState.textInput} onChange={e => {setAxonState({...axonState, textInput: e.target.value});}}/>
          </div>
          
          {/* Displays Create Button and Export Button. */}
          <div id="createExport">

          <button disabled={axonState.createDisable} id="createButton" onClick={() => superTestCode(axonState.fileList)
            .then( superTestCode => {
              console.log('output of the Algo when Sucessfull: ', superTestCode);
              setAxonState(({...axonState, superTestCode: superTestCode, progressText: "Supertest files created", image:createdTest, progressVal: "66.66%", exportDisable: false, createDisable: true }))
            })
            .catch(superTestCode => {
              console.log('SuperTestCode from the Catch Block: ', superTestCode);
          })} >
          Create
          </button> 
         
            
            {/* {console.log(axonState.filelist)} */}

            <FileExport superTest={axonState.superTestCode} textInput={axonState.textInput} disableStatus={axonState.exportDisable} setProgressState={(newProgressState:any, progVal: any, checkImg: any) => 
              setAxonState({...axonState, progressText: newProgressState, progressVal: progVal, image: checkImg}) }/>
          </div>
        </div>

      </div>
    </main>
  )
}

export default RootComponent;