import React, {useState, useEffect} from 'react';
import check from '../../../assets/Checkmark.png'

const FileExport = (props:any) => {
  const onFileDownload = ():void => {
    
    return props.setProgressState("Supertest sucessfully exported", 3, check);    
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
    onFileDownload();
}
  

  return (
    <div>
      <input type="button" id="exportbtn" value="Export" onClick={() => {
        download(filename, text)
        
      }}/>
    </div>
  )
};

export default FileExport;

