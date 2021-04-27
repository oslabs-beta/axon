import React, {useState, useEffect} from 'react';
import './app.scss';
import FileImport from '@/app/components/fileImport';
import FileExport from '@/app/components/fileExport';
import logo from '../../assets/AxonLogoSize.png';
import uploadFolder from '../../assets/folderImport.png';
import createdTest from '../../assets/codeicon.png';

//example import
// import algo1 from @app...

const RootComponent = () => {
  const [axonState, setAxonState] = useState <any | undefined> ({
    fileList: {},
    superTestCode: "",
    progressText: 'Import server folder here',
    image: uploadFolder,
    progressVal: 0
    
  });

  //dummy function
  //will erase when algo1 is officially imported
  const createSupertest = (list: object)  => {
    console.log(list)
    return "let a = 42";
  }
  
  return (
    <main>
      <header>
        <img id="axonTitle" src={logo}></img>
      </header>
       
      <div className="contentBox">
        
        <div id="progressDisplay">
          <h1>{axonState.progressText}</h1>
          <progress id="progressBar" value={`${axonState.progressVal}`} max="3"> nothing here </progress>
        </div>
    
        <div id="import">
          <FileImport setFileState={(newFileState: any, newProgressState:any, newImage: any, progVal: any) => setAxonState({...axonState, fileList: newFileState, progressText: newProgressState, image: newImage, progressVal: progVal}) }/> 
          <img id="fileImg" src={axonState.image}></img>
        </div>

        <div id="createExport">
          <button id="createButton" onClick={() => setAxonState({...axonState, superTestCode: /* algoname */createSupertest(axonState.fileList), progressText: "Supertest files created", image:createdTest, progressVal: 2 })} >Create</button> 
          {/* </div> */}
          <h1> {console.log(axonState.superTestCode)}</h1>
          {/* <div id="exportbtn"> */}
          <FileExport superTest={axonState.superTestCode} setProgressState={(newProgressState:any, progVal: any, checkImg: any) => setAxonState({...axonState, progressText: newProgressState, progressVal: progVal, image: checkImg}) }/>
        </div>

      </div>

    </main>
  )
}

export default RootComponent;