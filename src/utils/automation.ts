import algoOne from "./buildPathObject";
import algoTwo from "./buildSupertest";

// This is the main Algorithm that will generate the superTest Code
export default function( fileList:any ){
  // The Algorithm will return a promise and the resolved value will be the supertest code
  return new Promise((resolve, reject) => {
    // Invoke Algorithm one to build the pathObject
    algoOne(fileList)
    // When the PathObject is sucessfully Built
    .then( pathObject => {
      // Create superTestCode and return it from the promise
     
      const serverFile: string = pathObject[ pathObject.__serverFilePath__ ];
      const superTestCode = algoTwo(pathObject, serverFile);
      resolve(superTestCode)
    })
    // When there is an Error in the first Algorithm
    .catch(pathObject => {
      
      // Attempt to create the superTest Code and return the result from the promise
      const serverFile: string = pathObject[ pathObject.__serverFilePath__ ];
      const superTestCode = algoTwo(pathObject, serverFile);
      reject(superTestCode)
    })
  })
}


