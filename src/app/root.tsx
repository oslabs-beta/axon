import React, {useState, useEffect} from 'react';
import './app.scss';
import FileImport from '@/app/components/fileImport';
import FileExport from '@/app/components/fileExport'
//example import
// import algo1 from @app...

const RootComponent = () => {
  const [axonState, setAxonState] = useState <any | undefined> ({
    fileList: {},
    superTestCode: "",
    progressText: 'Import server folder here',
    
  });

  //dummy function
  //will erase when algo1 is officially imported
  const createSupertest = (list: object)  => {
    console.log(list)
    return "let a = 42";
  }

  return (
      
    <div>
      <h1 id="axonTitle"> AXON IS COOL</h1>
      <FileImport setFileState={(newFileState: any, newProgressState:any) => setAxonState({...axonState, fileList: newFileState, progressText: newProgressState}) }/> 
      <h1>{axonState.progressText}</h1>
      <button id="createButton" onClick={() => setAxonState({...axonState, superTestCode: /* algoname */createSupertest(axonState.fileList), progressText: "SuperTest files created"})} >Create</button> 
      <h1> {console.log(axonState.superTestCode)}</h1>
      <FileExport superTest={axonState.superTestCode} setProgressState={(newProgressState:any) => setAxonState({...axonState, progressText: newProgressState}) }/>

    </div>
  )
}

export default RootComponent;