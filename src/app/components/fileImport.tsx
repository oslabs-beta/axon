import React, {useState, useEffect} from 'react';


const FileImport = (props:any) => {
  const onFileUpload = (e:any) :void => {
    return props.setFileState(e.target.files, "Your file has been imported");    
  }
  return (
    <div>
      <input type="file" accept='js/plain' multiple webkitdirectory="" id="fileURL" onChange={onFileUpload}/>
    </div>
  )
};

export default FileImport;

