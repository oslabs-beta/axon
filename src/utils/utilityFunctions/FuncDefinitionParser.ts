const AbstractSyntaxTree = require('abstract-syntax-tree');

const returnMethods: ReturnMethods = {
  status: true,
  json: 'json',
  send: 'json', 
  sendFile: {
    '.js': 'javascript',
    '.html': 'html',
  }
};

const identifyContent = (method:string, args:any, functionString:string) => {
  if(method === 'send' && typeof args.value === 'string') return 'html';
  if(method === 'json' || method === 'send') return returnMethods[method];
  if(method === 'sendFile') {
    // Relative pathing increases unpredicatability in AST, RegEx safer
    // Pattern returns arguments and method (unreliable negative lookbehinds in JS require consumption)
    const sendFileRE = /(?:\.sendFile\(\s?).*(?=\s?\))/gim;
    const file = functionString.match(sendFileRE)![0];
    // Test file for extension, omission implies same as source code
    const extension = file.match(/(\.html|\.js)/gi)![0] || '.js';
    return returnMethods.sendFile[extension];
  };
};

/**
 *This function will match all patterns in a function definition that are
 * methods being invoked or properties being pulled out of the Request
 * or Response objects. 
 * @param {string} functionToParse - The parameter is a string representation of the function to be parsed 
 * @returns {object} - The object contain information about the endpoints
 *   content-type: will be the content type expected to be returned
 *   status: will be the status code expected to be returned
 */
export default function (functionToParse: string) {
  // Validate the Input
  if (typeof functionToParse !== 'string' || functionToParse === '') return null;
  // Initiliaze the object to be returned
  const responseInfo: TestParams = {};
  const tree = new AbstractSyntaxTree(functionToParse);
  // Isolate method calls
  const expressions = tree.find({type:'CallExpression'});
  for(let item of expressions){
    // Method invoked
    const method = item.callee.property.name;
    // Arguments passed into method
    const args = item.arguments[0];
    // Check if valid Express method
    if(!returnMethods.hasOwnProperty(method)) continue;
    if(method === 'status'){
      responseInfo.status = String(args.value);
    } else {
      responseInfo['content-type'] = identifyContent(method, args, functionToParse)
    }
  }
  
  // Set default content-type and status code values when none are matched
  if (responseInfo['content-type'] === undefined) responseInfo['content-type'] = 'json';
  if (responseInfo.status === undefined) responseInfo.status = '200';

  return responseInfo;
};