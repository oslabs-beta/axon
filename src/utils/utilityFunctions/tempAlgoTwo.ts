/*
 The Second Algorithm will Traverse through the 'pathObject', that holds all of the files,
 and begin to build the superTestCode. The Algorithm will start in the Server File, it will build
 write tests for all endpoints and their associated routes. When an imported router is encountered,
 the algorithm will go to the router file and write tests for all endpoints in this file.
*/
const st:any = {

  defaultOpen: '/*\nBEFORE TESTING:\n\t- Install Jest and Supertest\n\t- Configure the application package.json test script\n*/\n\nconst request = require(\'supertest\');\nconst jest = require(\'jest\');\nconst server = \'https://localhost:', //append '<serverFilepath>'
  localhostPrepend: '\'https://localhost:\'', // append port number
  placeholderPort: '8080',
  intTestDescription: 'Route integration',
  contentType: '\'Content-Type\'',
  html: ' /text\/html/',
  json: ' /json/',

  describe: 'describe(\'', // append '<path>' || '<reqMethod>.toUpperCase()'
  it: 'it(\'',
  itDescribeA: 'Responds with status code ', // append '<status code> and <content-type>'
  itDescribeB: ' content type',
  expect: '.expect(',
  anonCB: '\', () => {\n',
  returnReq: 'return request(server)\n',

  openParens: '(',
  openBrace: '{',
  closeParens: ')',
  closeBrace: '}',
  newline: '\n',
  tab1: '\t',
  tab2: '\t\t',
  tab3: '\t\t\t',
  tab4: '\t\t\t\t',
  tab5: '\t\t\t\t\t',
  semi: ';',
  apos: '\'',
  comma: ',',
  period: '.',
  forwardSlash: '/',

};

export default function algoTwo( pathObject: any, currentFile: any, parentRoute: any = '/' ){// validate 
  console.log('currentFile: ', currentFile );

  // Define the starting supertest code string for the current File
  let supertestCode = '';
  // When the currentFile is the server file, write all of the default information for the supertest file
  if (parentRoute === '/'){
    supertestCode = st.defaultOpen + st.placeholderPort + st.apos + st.semi + st.newline + st.newline + st.describe + st.intTestDescription + st.anonCB;
  }

  // Write Endpoint Tests:  Traverse through Endpoints object and begin to write tests for each endpoint
  for (let route in currentFile.endpoints){
    let testStringForRoute = '';

    const currentRoute: string =  route === parentRoute ? route : parentRoute + route;

    // Write the describe block for the current route
    testStringForRoute += st.tab1 + st.describe + currentRoute + st.anonCB
      // Traverse through the endpoint array 
      for(let endpointArray of currentFile.endpoints[route] ){
          const reqMethod = endpointArray[0]
          const reqMethodCap = reqMethod.toUpperCase();
          const statusCode = endpointArray[endpointArray.length-1].status
          const format = endpointArray[endpointArray.length-1]['content-type'];
          const codeAndType = `${statusCode} and ${format}`;
          // Write a test for every endpoint
          testStringForRoute += st.tab2 + st.describe + reqMethodCap + st.anonCB + st.tab3 + st.it + st.itDescribeA + codeAndType + st.itDescribeB + st.anonCB + st.tab4 + st.returnReq + st.tab5 + st.period + reqMethod + st.openParens + st.apos + currentRoute + st.apos + st.closeParens + st.newline + st.tab5 + st.expect + st.contentType + st.comma + st[format] + st.closeParens + st.newline + st.tab5 + st.expect + statusCode + st.closeParens + st.semi + st.newline + st.tab3 + st.closeBrace + st.closeParens + st.semi + st.newline + st.tab2 + st.closeBrace + st.closeParens + st.semi + st.newline;
      }
        
        
    supertestCode += testStringForRoute + st.tab1 + st.closeBrace + st.closeParens + st.semi + st.newline + st.newline;
  }

  // Write Endpoint Tests for all router files: Traverse through the Routers object
  for (let route in currentFile.routers){
    const currentRouteArray = currentFile.routers[route];
    const routerName = currentRouteArray[0][1];
    const importedFilePath = currentFile.imports[routerName] + '.js';
    const importedFile = pathObject[importedFilePath];

    // Will not recursively call function whenever there is an invalid importedFile
    if (importedFile === undefined){
        break;
    }

    supertestCode += algoTwo(pathObject, importedFile, parentRoute === '/' ? route : parentRoute + route);
  }  
  
  if (parentRoute === '/'){
      supertestCode += st.closeBrace + st.closeParens + st.semi;
  }

  // Return the build supertest code for the current file
  return supertestCode;
};