import React, {useState, useEffect} from 'react';


const FileExport = (props:any) => {
  const onFileDownload = ():void => {
    
    return props.setProgressState("Your Supertest files have been exported...Import new server folder?");    
  }

  let text = props.superTest;
  let filename = "superTest.js";

  function download(file:string, text:string) {
              
    //creating an invisible element
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', file);
  
    // Above code is equivalent to
    // <a href="path of file" download="file name">
  
    document.body.appendChild(element);
  
    //onClick property
    element.click();
  
    document.body.removeChild(element);
}
  

  return (
    <div>
      <input type="button" id="btn" value="Download" onClick={() => {
        onFileDownload();
        download(filename, text);
      }}/>
    </div>
  )
};

export default FileExport;

