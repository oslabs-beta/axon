/**
 * This function will identify the type of file based on the text and attempt
 * to find the portNumber, if given. 
 * @param {string} fileText - This will be the text from the file
 * @returns {object} - Will return an object with a fileType property and a portNumber property
 *   fileType: will be 'Server', 'Router' or 'Other'
 *   portNumber: will be a string or null
 */
export function IdentifyFileType(fileText:any) :any {

  // Attempt to match a port number in the current file
  const dotListenRE = /\.listen\((?<port>.*?)(?=,|\))/i;
  const listenMatch = fileText.match(dotListenRE);

  // Assign a port Number when a port number is matched
  let portNumber;
  if (listenMatch) {
    portNumber = listenMatch.groups.port;
  }

  // Attempt to match a 'Router' Method being invoked
  const dotRouterRE = /express\.Router\(\)/gi;
  const routerMatch = fileText.match(dotRouterRE);

  // Assign the File Type based on the matches found:
  let fileType = '';
  // Case: The File is neither a Router file nor a Server file
  if (listenMatch === null && routerMatch === null) {
    fileType = 'Other'; 
  // Case: The File is a Server File
  } else if (Array.isArray(listenMatch) && portNumber){
    fileType = 'Server';
  // Case: The File is a Router File
  }else if (Array.isArray(routerMatch) && routerMatch.includes('express.Router()')) {
    fileType = 'Router'; 
  }

  return { fileType, portNumber: portNumber || null };
}
