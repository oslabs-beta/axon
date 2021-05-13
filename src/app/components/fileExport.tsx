import React, { useState, useEffect } from 'react';
import check from '../../../assets/Checkmark.png';

// This functional component will handle all export functionality
const FileExport = (props:any) => {

  // Global variable to store the Supertest code or Postman collections being exported
  const text = props.fileType ? props.superTest : props.postmanCollection;

  // Generate the name of the file that will be exported:
  let filename:any;

  // Handle the Case that the input field is blank
  if (props.textInput === '') {
    // Conditionally set the filename based on the type of file that is being exported
    filename = props.fileType ? 'superTest.js' : 'postmanCollection.json';
  // When the input field has been filled
  } else {
    // Generate the approprate filename and file extension, based on file type being exported
    filename = props.fileType ? `${props.textInput}.js` : `${props.textInput}.json`;
  }

  // This function will update the state to show that the file has been downloaded sucessfully
  const onFileDownload = ():void => {
    props.setProgressState('Supertest sucessfully exported', '100%', check);
  }

  // This function will create a tag that will encode the file text to be exported, into a downloadable file
  function download(file:string, text:string) {
    // Create a temporary anchor tag to download the file to the users computer
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(text)}`);
    element.setAttribute('download', file);
    element.click();

    // Update the state to show that the file has been downloaded
    onFileDownload();
  }

  return (
    <div>
      <input
        disabled={props.disableStatus}
        type="button"
        id="exportbtn"
        value="Export"
        onClick={() => {
          download(filename, text);
        }}
      />
    </div>
  );
};

export default FileExport;
