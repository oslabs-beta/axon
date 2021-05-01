import React, {useState, useEffect} from 'react';
import check from '../../../assets/Checkmark.png'


// functional component to create export functionality   
const FileExport = (props:any) => {


  // global variable to store prop that carries returned supertest from main algorithm
  let text = props.superTest;
  // global variable to hold exported file name
  let filename:any;
 // conditional statement to check if user left input field blank
  if(props.textInput === ""){
      // if input field empty filename is supertest.js
      filename = "superTest.js"
    }else{
      // exported file gets saved as inputed filename
      filename = props.textInput + ".js";
    }

  // function that gets called after invoking export button to change current state
  const onFileDownload = ():void => {
    
    // return passed in prop to reset state to passed in arguments
    return props.setProgressState("Supertest sucessfully exported", "100%", check);    
  }

  // create function to create a tag that will encode supertext string into a dowloadable file
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
    // call fuction to reset state on root file
    onFileDownload();
}
  
  // return input tag to root file that holds the export button functionality
  return (
    <div>

      <input disabled={props.disableStatus} type="button" id="exportbtn" value="Export" onClick={() => {
        download(filename, text)   
      }}/>

    </div>
  )
};

export default FileExport;

