/**
 *This function will match all patterns in a function definition that are
 * methods being invoked or properties being pulled out of the Request
 * or Response objects. 
 * @param {string} functionToParse - The parameter is a string representation of the function to be parsed 
 * @returns {object} - The object contain information about the endpoints
 *   content-type: will be the content type expected to be returned
 *   status: will be the status code expected to be returned
 */
export default function (functionToParse: any) {
  // Validate the Input
  if (typeof functionToParse !== 'string' || functionToParse === '') return null;

  // Initiliaze the object to be returned
  const responseInfo: any = {};

  // Match all patterns of a status being set in the function definition
  const dotStatusRE = /status\((?<status>\d{3})/gim; // returns

  const statusMatch = [...functionToParse.matchAll(dotStatusRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups;
    return obj;
  }, {});

  // When a status is matched, store the status
  if (Object.keys(statusMatch).length) {
    responseInfo.status = statusMatch[0].status;
  }

  // Match all patterns of JSON being sent via the ResponseObject.json() method
  const dotJsonRE = /\.json\(/gim;

  const jsonMatch = [...functionToParse.matchAll(dotJsonRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups;
    return obj;
  }, {});

  // When a .json method is matched
  if (Object.keys(jsonMatch).length) {
    responseInfo['content-type'] = 'json';
  }

  // Matches all patterns of the send() method being invoked from the Response Object
  const dotSendRE = /\.send\(\s?(?<sendContent>((true|false)|['"`{\[]))/gim;

  const sendMatch = [...functionToParse.matchAll(dotSendRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups;
    return obj;
  }, {});


  // When a .send method is matched
  if (Object.keys(sendMatch).length) {
    // Case: The content sent will be JSON
    if (sendMatch[0].sendContent === '{' || sendMatch[0].sendContent === '['
     || sendMatch[0].sendContent === 'true' || sendMatch[0].sendContent === 'false') {
      responseInfo['content-type'] = 'json';

    // Case: The content sent was a string
    } else if (sendMatch[0].sendContent[0] === '\'' || sendMatch[0].sendContent[0] === '"' || sendMatch[0].sendContent[0] === '`') {
      responseInfo['content-type'] = 'html';
    }
  }

  // Matches all patterns of the sendFile() method being invoked from the Response Object
  const dotSendFileRE = /\.sendFile\(\s?(?<sendContent>.*?)\s?\)/gim;

  const sendFileMatch = [...functionToParse.matchAll(dotSendFileRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups;
    return obj;
  }, {});

  // When a .sendFile method is matched
  if (Object.keys(sendFileMatch).length) {
    // Case: The content sent is a file
    if (/(\.html|\.js)/.test(sendFileMatch[0].sendContent)) {
      // Dictionary for the file extensions and the correct content-type
      const fileExtensionObject:any = {
        '.js': 'javascript',
        '.html': 'html',
      };

      const fileExtension:any = /(\.html|\.js)/.exec(sendFileMatch[0].sendContent);
      responseInfo['content-type'] = fileExtensionObject[fileExtension[0]];
    }
  }

  // Set default content-type and status code values when none are matched
  if (responseInfo['content-type'] === undefined) responseInfo['content-type'] = 'json';
  if (responseInfo.status === undefined) responseInfo.status = 200;

  return responseInfo;
}
