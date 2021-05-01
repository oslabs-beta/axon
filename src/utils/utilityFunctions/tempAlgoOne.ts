import tempFindEndpointData from './tempFindEndpointData';
import {tempIdentifyFileType} from './tempIdentifyFileType';

// This Function will return a promise, that when resolved will return the pathObject
export default function(fileList:any){
  return new Promise((resolve, reject) => {
    /*
      Declare an object that will be built up and returned from the function (Promise).
      This object will have path names as keys and a file object as the value.
      It is structured this way to allow for constant look up time on any file object
    */
     const pathObject: any = {};
     
     // Delcare an array that will temporarily hold promises
     const arrayOfPromises = [];
     
     // Traverse through the fileList input
     for (let i = 0; i < fileList.length; i++){
       // Attempt to read the current file
       const promise = fileList[i].text();
       
       // Push the resulting promise into the promises array
       arrayOfPromises.push(promise);
       
       promise
       // When the file is read sucessfully
       .then(fileText => {
         // Identify the type of file
         const {fileType, portNumber} = tempIdentifyFileType(fileText);

         // When the type of file is a server, add the server path to the pathObject
         if (fileType === 'Server'){
             pathObject.__serverFilePath__  = fileList[i].webkitRelativePath;
             pathObject.__portNumber__ = portNumber;
         }

         // Create a new File Object based on the file type
         let newFileObject;
         // When the file is a server or router file
         if (fileType === 'Server' || fileType === 'Router'){
           // Extract necessary route and endpoint data from fileText
           const {imports, endpoints, routers} = tempFindEndpointData(fileText, fileList[i].webkitRelativePath);
           // Add relevant data to the new file object
           newFileObject = {
             name: fileList[i].name,
             imports,
             endpoints,
             routers
           }
         // When the file is neither a server nor router file
         }else {
             newFileObject = {
                 name: fileList[i].name,
                 fileText: fileText
             }
         }

         // Add the newly created file object to the pathObject
         pathObject[ fileList[i].webkitRelativePath ] = newFileObject;
       })
       // When file read is unsucessfully read
        .catch(err => {
          // Add a file to the pathObject with default properties
          const newFileObject = {
              name: fileList[i].name,
              fileText: err
          }
          pathObject[ fileList[i].webkitRelativePath ] = newFileObject;
        })
     }
     
     // Wait until every promise in 'arrayOfPromises' has been resolved before returning the 'pathObject'
     Promise.all(arrayOfPromises)
     .then(output => {
       resolve(pathObject);
     })
     .catch(err => {
       reject(pathObject);
     })
  });
}
