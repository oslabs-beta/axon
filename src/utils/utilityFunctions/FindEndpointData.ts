import ResolvePath from './ResolvePath';
import FuncDefinitionParser from './FuncDefinitionParser';

const AbstractSyntaxTree = require('abstract-syntax-tree');

const expressMethods: BoolDictionary = {
  get: true,
  delete: true,
  patch: true,
  put: true,
  post: true,
  use: true,
};

/**
 * This Function is designed to take the content of a Server or Router File, and return
 * an object which organizes all of the imported modules, endpoints, and imported routers
 * into keys of the returned object.
 * @param {string} fileText - This is the text of the file
 * @param {string} currentFilePath - This is the path to the current file
 * @returns {object} - The returned object will have:
 *   imports: an object whose keys are the variable names of the imported modules, and the 
 *     value is its resolved import path
 *   endpoints: an object whose keys are routes and the value is an array of arrays. Each
 *     subarray represents an endpoint where the first element of the subarray is the http method 
 *     of the endpoint and each subsequent element is a middleware function.
 *   routers: an object whose keys are routes and the value is an array of arrays. Each
 *     subarray represents a router being mounted as middleware. Where the first element 
 *     of the subarray is the route, and each subsequent element is a middleware function,
 *     ending with the imported router.
*/
export default function (fileText: string, currentFilePath:string) {
  // Generate a Syntax Tree from the FileText
  const tree = new AbstractSyntaxTree(fileText);

  // Initialize the object to return
  const fileObject = {} as FileObject;
  fileObject.imports = {};
  fileObject.endpoints = {};
  fileObject.routers = {};

  // Traverse through the body of the Syntax Tree (representing the code from the current file)
  tree.body.forEach((statement:any) => {
    
    // Case: The Current Statement is an imported module
    if (statement.type === 'VariableDeclaration') {
      // Check if there is something on the right side of the assignment operator
      if (statement.declarations[0].init) {
        // Check if the type is a 'Call Expression'
        if (statement.declarations[0].init.type === 'CallExpression') {
          // Check if the callee name is 'require'
          if (statement.declarations[0].init.callee.name === 'require') {
            const importName = statement.declarations[0].id.name;
            const importPath = statement.declarations[0].init.arguments[0].value;

            // Add the imported module to the imports object on the fileObject
            fileObject.imports[importName] = ResolvePath(importPath, currentFilePath);
          }
        }
      }
      
    // Case: The Current Statemet is an Endpoint or Router based statement
    } else if (statement.type === 'ExpressionStatement') {
      // Check if there is an expression object
      if (statement.expression) {
        // Check if the expression is a 'CallExpression' and the callee object & arguments object is not empty
        if (statement.expression.type === 'CallExpression' && statement.expression.callee && statement.expression.arguments) {
          // Check if the expression type is "MemberExpression" and the property property "callee" is not ewmpty
          if (statement.expression.callee.type === 'MemberExpression' && statement.expression.callee.property) {
            const methodName = statement.expression.callee.property.name;
            // Check that the method is an Express based method
            if (expressMethods[methodName]) {
              // Check that the first argument passed into the Express method is a string
              if (statement.expression.arguments[0].type === 'Literal' && typeof statement.expression.arguments[0].value === 'string') {
                // Store relevant information
                const argumentsArray = statement.expression.arguments;
                const route = argumentsArray[0].value;
                const method = statement.expression.callee.property.name;

                // When the last argument is a function the Express method is defining an endpoint
                if (argumentsArray[argumentsArray.length - 1].type === 'ArrowFunctionExpression'
                    ||
                  argumentsArray[argumentsArray.length - 1].type === 'FunctionExpression') {
                  const endpointArray = [method];

                  // Traverse Through the arguments of the Express Endpoint Method and build the new endpointArray
                  for (let i = 1; i < argumentsArray.length; i++) {
                    const stringFunction = AbstractSyntaxTree.generate(argumentsArray[i]);
                    endpointArray.push(stringFunction);
                  }

                  // Convert the anonymous function, which is the last argument, into an object of the endpoint data
                  endpointArray[endpointArray.length - 1] = FuncDefinitionParser(endpointArray[endpointArray.length - 1]);

                  // Add the Endpoint Array to the Endpoints object
                  if (fileObject.endpoints[route]) {
                    const fileEndpoints = <AllEndpoints> fileObject.endpoints[route];
                    fileEndpoints.push(endpointArray);
                  } else {
                    fileObject.endpoints[route] = [endpointArray];
                  }

                // When the Express Method defines a Router being mounted as middleware
                } else {
                    // Initialize a new Router Array
                    const routerArray = [route];

                    // Traverse Through the arguments of the Express Method and build the new Router Array
                    for (let i = 1; i < argumentsArray.length; i++) {
                      const stringFunction = AbstractSyntaxTree.generate(argumentsArray[i]);
                      routerArray.push(stringFunction);
                    }
                    
                    // Add the new Router Array to the routers object in the fileObject
                    if (fileObject.routers[route]) {
                      const fileRoutes = <AllRouters> fileObject.routers[route];
                      fileRoutes.push(routerArray);
                    } else {
                      fileObject.routers[route] = [routerArray];
                    }
                }
              }
            }
          }
        }
      }
    }
  });

  return fileObject;
}
