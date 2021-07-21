import SuperTestCodeBuilder from './utilityFunctions/SuperTestCodeBuilder';

/**
 * This Function will Take the 'pathObject' as input, which holds all of the files from the folder.
 * It will start at the server file, begin to build superTestCode for each endpoint in the server file
 * and recursively build the superTest code for any router files imported into the server file. It will
 * use the SuperTestCodeBuilder class to build the string, in order to be more performant than traditional
 * string concatenation.
 * @param pathObject 
 * @returns 
 */
 export default function generateSuperTestCode(pathObject: PathObject): string {
  // Find the Server File within the 'pathObject' as the starting File
  const serverPath = <string> pathObject.__serverFilePath__;
  const serverFile = <FileObject>pathObject[serverPath];

  // Create a new instance of SuperTestCodeBuilder which will be used to build the superTest code string
  const codeFormatting = {
    autoNewLine: true,
    autoSpacing: true,
  };
  const superTestCode = new SuperTestCodeBuilder(codeFormatting);

  // Add Heading to the SuperTestFile
  const defaultOpening = `
/*
  BEFORE TESTING:
    - Install Jest and Supertest
    - Configure the application package.json test script
*/

const request = require(\'supertest\');
  `;
  superTestCode.add(defaultOpening);
  superTestCode.add(`const server = \`http://localhost:$\{${pathObject.__portNumber__}}\`;\n`);

  // Write Outter-Most Describe Block
  superTestCode.add(`describe(\'Route integration\', () => {`, 'right');

  /*
    This helper function will generate SuperTestCode on the current files endpoints.
    It will recursively go to any imported routers and generate the superTestCode for
    their endpoints as well.
  */
  function createTestsForEndpoints(currentFile: FileObject, parentRoute = '/', superTestCode: SuperTestCodeBuilder): void {
    // Set the Beggining text indentation for each recursive call to be indented by 2 spaces
    superTestCode.currentTextIndentation = 2;

    // Traverse through Endpoints object and begin to write tests for each endpoint
    for (const route in currentFile.endpoints) {
      let currentRoute;
      // Case: The route is the home route on the server file
      if (parentRoute === '/' || route === parentRoute) {
        currentRoute = route;
      // Case: The route is being used in a router file with the shortcut of '/'
      } else if (route === '/' && parentRoute !== '/') {
        currentRoute = parentRoute;
      // Case: The default case is to add the two routes together to get the current route
      } else {
        currentRoute = parentRoute + route;
      }

      // Write the Describe block for the current route
      superTestCode.add(`describe(\'${currentRoute}\', () => {`, 'right');

      // Traverse through the current endpoint array
      for (const endpointArray of currentFile.endpoints[route] as AllEndpoints) {
        // Store relevant endpoint information from endpoint array into variables
        const reqMethod = <string> endpointArray[0];
        const testParams = <TestParams> endpointArray[endpointArray.length - 1];
        const statusCode = testParams.status;
        const contentTypeOfEndpoint = <string> testParams['content-type'];
        const codeAndType = `${statusCode} and ${contentTypeOfEndpoint}`;

        // Write the opening Describe Block for the current endpoint
        superTestCode.add(`describe(\'${reqMethod.toUpperCase()}\', () => {`, 'right');

        // Write the opening nested It Block
        superTestCode.add(`it(\'Responds with status code ${codeAndType} content type \', () => {`, 'right');

        // Write the SuperTest test nested inside the It Block
        const contentTypes: Dictionary = {
          html: ' /text\\/html/',
          json: ' /json/',
        };

        const endpointData = {
          statusCode,
          route: currentRoute,
          contentType: contentTypes[contentTypeOfEndpoint],
        };
        superTestCode.generateSuperTest(reqMethod, endpointData);

        // Close the It Block and Describe block for the specific supertest
        superTestCode.add('});');
        superTestCode.add('});', 'left');

        // Reset the Text indention to 4 for the next Endpoint Describe Block
        superTestCode.currentTextIndentation = 4;
      }

      // Close the Describe block for the current route
      superTestCode.add('});\n');
    }

    // Traverse through the Routers object and write tests for each imported router
    for (const route in currentFile.routers) {
      // Find the imported File in the pathObject
      const currentRouteArray = <AllRouters> currentFile.routers[route];
      const routerName = currentRouteArray[0][1];
      const importedFilePath = `${currentFile.imports[routerName]}.js`;
      const importedFile = <FileObject> pathObject[importedFilePath];

      // Skip the file if it is not a router file
      if (importedFile === undefined) {
        continue;
      }

      // Call function recursively to build superTest code for the imported router file
      createTestsForEndpoints(importedFile, parentRoute === '/' ? route : parentRoute + route, superTestCode);
    }
  }

  // Build the Super Test Code
  createTestsForEndpoints(serverFile, '/', superTestCode);

  // Close the outer-most describe block
  superTestCode.currentTextIndentation = 2;
  superTestCode.add('});');

  // Return the Super Test Code String
  return superTestCode.buildString();
}