/*
   This function will match all patterns in an anonmymous function, function definition that are 
   methods being invoked or properties being pulled out of the Request
   or Response objects. It will then format the extracted information for creation of a superTest file.
*/
export default function(anonymousFunction: any){
  // Validate the Input
  if (typeof anonymousFunction !== 'string' || anonymousFunction === '') return null;

  // Declare an object that will contain extracted information and be returned
  const responseInfo: any = {};

  // Match all patterns of a status being set in the function definition
  const dotStatusRE = /(?:send)?status\((?<status>\d{3})/gim; // returns 

  const statusMatch = [...anonymousFunction.matchAll(dotStatusRE)].reduce((obj, matchArr, ind) => {
      obj[ind] = matchArr.groups
      return obj;
  }, {});

  // When a status is matched
  if (Object.keys(statusMatch).length){
    responseInfo['status'] = statusMatch[0]['status'];
  }
  

  // Match all patterns of JSON being sent via the ResponseObject.json() method
  const dotJsonRE = /\.json\((?<jsonObj>.*?)\)/gim;

  const jsonMatch = [...anonymousFunction.matchAll(dotJsonRE)].reduce((obj, matchArr, ind) => {
      obj[ind] = matchArr.groups
      return obj;
  }, {});

  // When a .json method is matched
  if (Object.keys(jsonMatch).length){
      responseInfo['content-type'] = 'json';
  }

  // Matches all patterns of the send() method being invoked from the Response Obje
  const dotSendRE = /send(?:file)?\((?<sendContent>.*?)\)/gim;

  const sendMatch = [...anonymousFunction.matchAll(dotSendRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups
    return obj;
  }, {});

  // When a .send method is matched
  if (Object.keys(sendMatch).length){

    // Case: The content sent is a file
    if(/(\.html|\.js)/.test(sendMatch[0].sendContent)){
      // Dictionary for the file extensions and the correct content-type 
      const fileExtensionObject:any = {
        '.js' : 'javascript',
        '.html' : 'html'
      }
      // 
      const fileExtension:any = /(\.html|\.js)/.exec( sendMatch[0].sendContent );
      responseInfo['content-type'] = fileExtensionObject[ fileExtension[0] ];

    // Case: The content sent will be JSON
    }else if (sendMatch[0].sendContent[0] === '{' || sendMatch[0].sendContent[0] === '['){
      responseInfo['content-type'] = 'json';

    // Case: The content sent was a string  
    }else if (sendMatch[0].sendContent[0] === '\'' || sendMatch[0].sendContent[0] === '"'){
      responseInfo['content-type'] = 'html';

    }
  }

  // Return Dummy object for testing
  return responseInfo;

}