import SuperTestCodeBuilder from './SuperTestCodeBuilder';

// Dictionary of phrases and strings that are reused to build the superTestCode
const defaultStatements: any = {
  defaultOpen: '/*\nBEFORE TESTING:\n\t- Install Jest and Supertest\n\t- Configure the application package.json test script\n*/\n\nconst request = require(\'supertest\');\nconst jest = require(\'jest\');\nconst server = \`https://localhost:${', //append '<serverFilepath>'
  intTestDescription: 'Route integration',
  contentType: '\'Content-Type\'',
  html: ' /text\/html/',
  json: ' /json/',
  describe: 'describe(\'', // append '<path>' || '<reqMethod>.toUpperCase()'
  it: 'it(\'',
  itDescribeA: 'Responds with status code ', // append '<status code> and <content-type>'
  itDescribeB: ' content type',
  anonCB: '\', () => {',
}


/*
  This Function will Take the 'pathObject' as input, which holds all of the files from the folder.
  It will start at the server file, begin to build superTestCode for each endpoint in the server file
  and recursively build the superTest code for any router files imported into the server file. It will 
  use the SuperTestCodeBuilder class to build the string, in order to be more performant than traditional
  string concatenation.
*/
export default function generateSuperTestCode(pathObject: any): string{
  // Find the Server File within the 'pathObject' as the starting File
  const serverFile = pathObject[ pathObject.__serverFilePath__];

  // Create a new instance of SuperTestCodeBuilder which will be used to build the superTest code string
  const codeFormatting = {
    autoNewLine: true,
    autoSpacing: true
  };
  const superTestCode = new SuperTestCodeBuilder(codeFormatting);

  // Destructure appropriate strings from 'defaultStatements' object for easy use
  const { defaultOpen, describe, anonCB, intTestDescription, it, itDescribeA, itDescribeB } = defaultStatements;

  // Add Heading to the SuperTestFile
  superTestCode.add(defaultOpen);

  // Write Outter-Most Describe Block
  superTestCode.add(describe + intTestDescription + anonCB, 'right');

  /*
    This helper function will generate SuperTestCode on the current files endpoints.
    It will recursively go to any imported routers and generate the superTestCode for
    their endpoints as well.
  */
  function createTestsForEndpoints(currentFile: any, parentRoute = '/', superTestCode: SuperTestCodeBuilder): void{
    
    // Traverse through Endpoints object and begin to write tests for each endpoint
    for (let route in currentFile.endpoints){
      const currentRoute: string =  route === parentRoute ? route : parentRoute + route;

      // Write the Describe block for the current route
      superTestCode.add(describe + currentRoute + anonCB, 'right');

      // Traverse through the current endpoint array 
      for(let endpointArray of currentFile.endpoints[route] ){
        // Store relevant endpoint information from endpoint array into variables
        const reqMethod = endpointArray[0]
        const statusCode = endpointArray[endpointArray.length-1].status
        const contentTypeOfEndpoint = endpointArray[endpointArray.length-1]['content-type'];
        const codeAndType = `${statusCode} and ${contentTypeOfEndpoint}`;

        // Write the opening Describe Block for the current endpoint
        superTestCode.add(describe + reqMethod.toUpperCase() + anonCB, 'right');

        // Write the opening nested It Block
        superTestCode.add(it +  itDescribeA + codeAndType + itDescribeB + anonCB, 'right');

        // Write the SuperTest test nested inside the It Block
        const endpointData = {
          statusCode,
          route: currentRoute,
          contentType: defaultStatements[ contentTypeOfEndpoint ]
        };
        superTestCode.generateSuperTest(reqMethod, endpointData);

        // Close the It Block and Describe block for the specific supertest
        superTestCode.add('\'});', 'left');
        superTestCode.add('\'});', 'left');
      }
      
      // Close the Describe block for the current route
      superTestCode.add('\'});', 'left');
    }

    // Traverse through the Routers object and write tests for each imported router
    for (let route in currentFile.routers){
      // Find the imported File in the pathObject
      const currentRouteArray = currentFile.routers[route];
      const routerName = currentRouteArray[0][1];
      const importedFilePath = currentFile.imports[routerName] + '.js';
      const importedFile = pathObject[importedFilePath];

      // Skip the file if it is not a router file
      if (importedFile === undefined){
        continue;
      }

      // Call function recursively to build superTest code for the imported router file
      createTestsForEndpoints(importedFile, parentRoute === '/' ? route : parentRoute + route, superTestCode);
    }  
  }

  // Build the Super Test Code
  createTestsForEndpoints(serverFile, '/', superTestCode);

  // Return the Super Test Code String
  return superTestCode.buildString();
}










// /*
//  The Second Algorithm will Traverse through the 'pathObject', that holds all of the files,
//  and begin to build the superTestCode. The Algorithm will start in the Server File, it will build
//  write tests for all endpoints and their associated routes. When an imported router is encountered,
//  the algorithm will go to the router file and write tests for all endpoints in this file.
// */
// const st:any = {

//   defaultOpen: '/*\nBEFORE TESTING:\n\t- Install Jest and Supertest\n\t- Configure the application package.json test script\n*/\n\nconst request = require(\'supertest\');\nconst jest = require(\'jest\');\nconst server = \`https://localhost:${', //append '<serverFilepath>'
//   intTestDescription: 'Route integration',
//   contentType: '\'Content-Type\'',
//   html: ' /text\/html/',
//   json: ' /json/',

//   describe: 'describe(\'', // append '<path>' || '<reqMethod>.toUpperCase()'
//   it: 'it(\'',
//   itDescribeA: 'Responds with status code ', // append '<status code> and <content-type>'
//   itDescribeB: ' content type',
//   expect: '.expect(',
//   anonCB: '\', () => {\n',
//   returnReq: 'return request(server)\n',

//   openParens: '(',
//   openBrace: '{',
//   closeParens: ')',
//   closeBrace: '}',
//   newline: '\n',
//   tab1: '\t',
//   tab2: '\t\t',
//   tab3: '\t\t\t',
//   tab4: '\t\t\t\t',
//   tab5: '\t\t\t\t\t',
//   semi: ';',
//   apos: '\'',
//   comma: ',',
//   period: '.',
//   forwardSlash: '/',
//   backtick: '\`',

// };

// export default function algoTwo( pathObject: any, currentFile: any, parentRoute: any = '/' ){// validate 
//   console.log('currentFile: ', currentFile );

//   // Define the starting supertest code string for the current File
//   let supertestCode = '';
//   // When the currentFile is the server file, write all of the default information for the supertest file
//   if (parentRoute === '/'){
//     supertestCode = st.defaultOpen + pathObject.__portNumber__ + st.closeBrace + st.backtick + st.semi + st.newline + st.newline + st.describe + st.intTestDescription + st.anonCB;
//   }

//   // Write Endpoint Tests:  Traverse through Endpoints object and begin to write tests for each endpoint
//   for (let route in currentFile.endpoints){
//     let testStringForRoute = '';

//     const currentRoute: string =  route === parentRoute ? route : parentRoute + route;

//     // Write the describe block for the current route
//     testStringForRoute += st.tab1 + st.describe + currentRoute + st.anonCB
//       // Traverse through the endpoint array 
//       for(let endpointArray of currentFile.endpoints[route] ){
//           const reqMethod = endpointArray[0]
//           const reqMethodCap = reqMethod.toUpperCase();
//           const statusCode = endpointArray[endpointArray.length-1].status
//           const format = endpointArray[endpointArray.length-1]['content-type'];
//           const codeAndType = `${statusCode} and ${format}`;
//           // Write a test for every endpoint
//           testStringForRoute += st.tab2 + st.describe + reqMethodCap + st.anonCB + st.tab3 + st.it + st.itDescribeA + codeAndType + st.itDescribeB + st.anonCB + st.tab4 + st.returnReq + st.tab5 + st.period + reqMethod + st.openParens + st.apos + currentRoute + st.apos + st.closeParens + st.newline + st.tab5 + st.expect + st.contentType + st.comma + st[format] + st.closeParens + st.newline + st.tab5 + st.expect + statusCode + st.closeParens + st.semi + st.newline + st.tab3 + st.closeBrace + st.closeParens + st.semi + st.newline + st.tab2 + st.closeBrace + st.closeParens + st.semi + st.newline;
//       }
        
        
//     supertestCode += testStringForRoute + st.tab1 + st.closeBrace + st.closeParens + st.semi + st.newline + st.newline;
//   }

//   // Write Endpoint Tests for all router files: Traverse through the Routers object
//   for (let route in currentFile.routers){
//     const currentRouteArray = currentFile.routers[route];
//     const routerName = currentRouteArray[0][1];
//     const importedFilePath = currentFile.imports[routerName] + '.js';
//     const importedFile = pathObject[importedFilePath];

//     // Will not recursively call function whenever there is an invalid importedFile
//     if (importedFile === undefined){
//         break;
//     }

//     supertestCode += algoTwo(pathObject, importedFile, parentRoute === '/' ? route : parentRoute + route);
//   }  
  
//   if (parentRoute === '/'){
//       supertestCode += st.closeBrace + st.closeParens + st.semi;
//   }

//   // Return the build supertest code for the current file
//   return supertestCode;
// };