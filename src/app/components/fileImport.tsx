import React, {useState, useEffect} from 'react';
import check from '../../../assets/folder-with-checkmark.png';

// create functional component to return import button and functionality for state change
const FileImport = (props:any) => {

  // function that sets current state when called onChange after imput functionality runs
  const onFileUpload = (e:any) :void => {

    // return property to set newState changes to passed in arguments
    return props.setFileState(e.target.files, "Your files have been imported", check, "33.33%", false, true, '');    
  }

  // return input tag that accepts multiple files that are strictly javascript 
  return (
    <div id="hiddenImport">
      <input type="file" className="custom-file-input" accept='js/plain' multiple webkitdirectory="" id="fileURL" onChange={onFileUpload} />
    </div>
  )
};

export default FileImport;

