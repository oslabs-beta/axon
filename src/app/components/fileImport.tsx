import React, {useState, useEffect} from 'react';
import check from '../../../assets/folder-with-checkmark.png';

const FileImport = (props:any) => {
  const onFileUpload = (e:any) :void => {
    return props.setFileState(e.target.files, "Your files have been imported", check, 1);    
  }
  return (
    <div id="hiddenImport">
      <input type="file" className="custom-file-input" accept='js/plain' multiple webkitdirectory="" id="fileURL" onChange={onFileUpload} />
    </div>
  )
};

export default FileImport;

