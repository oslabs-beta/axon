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

const arrayFromArguments = (argsArray: any[], targetArray: EndpointArray|string[]) => {
  for (let i = 1; i < argsArray.length; i++) {
    const stringFunction = AbstractSyntaxTree.generate(argsArray[i]);
    targetArray.push(stringFunction);
  };
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

  const addEndpoint = (route: string, method: string, argsArray: any[]) => {
    // Initialize a new endpoint array
    const endpointArray: EndpointArray = [method];
    // Traverse Through the arguments of the Express Endpoint Method and build the new endpointArray
    arrayFromArguments(argsArray, endpointArray);
    // Convert the anonymous function, which is the last argument, into an object of the endpoint data
    const currentLastArg = endpointArray.pop();
    endpointArray.push(FuncDefinitionParser(<string> currentLastArg)); 
    // Add the Endpoint Array to the Endpoints object
    if (fileObject.endpoints[route]) {
      const fileEndpoints = <AllEndpoints> fileObject.endpoints[route];
      fileEndpoints.push(endpointArray);
    } else {
      fileObject.endpoints[route] = [endpointArray];
    };
  };

  const addRouter = (route: string, argsArray: any[]) => {
    // Initialize a new Router Array
    const routerArray: string[] = [route];
    // Traverse Through the arguments of the Express Method and build the new Router Array
    arrayFromArguments(argsArray, routerArray);
    // Add the new Router Array to the routers object in the fileObject
    if (fileObject.routers[route]) {
      const fileRoutes = <AllRouters> fileObject.routers[route];
      fileRoutes.push(routerArray);
    } else {
      fileObject.routers[route] = [routerArray];
    };
  };

  const extractImportedModules = () => {
    // Isolate imported modules
    let requires = tree.find({
      type: 'VariableDeclaration', 
      declarations: {
        0: {
          init: {
            type: 'CallExpression', 
            callee: {
              name: 'require',
            },
          },
        },
      },
    });

    for(let statement of requires){
      const importName = statement.declarations[0].id.name;
      const importPath = statement.declarations[0].init.arguments[0].value;
      // Add the imported module to the imports object on the fileObject
      fileObject.imports[importName] = ResolvePath(importPath, currentFilePath);
    };
  };

  const extractEndpointsRouters = () => {
    // Isolate endpoints and router-based statements
    let endpoints = tree.find({
      type: 'ExpressionStatement', 
      expression: {
        type: 'CallExpression', 
        callee: {
          type: 'MemberExpression'
        }, 
        arguments: {
          0: {
            type: 'Literal'
          },
        },
      },
    });
    
    for(let statement of endpoints){
      const argumentsArray = statement.expression.arguments;
      const route = argumentsArray[0].value;
      const method = statement.expression.callee.property.name;
      const isMethodName = expressMethods.hasOwnProperty(method);
  
      // Check that the method is an Express based method and the first argument is a string
      if(isMethodName && typeof route === 'string'){
        // When the last argument is a function the Express method is defining an endpoint
        const lastArg = argumentsArray[argumentsArray.length - 1].type;
        const functionType = /^(Arrow)?FunctionExpression/gi;
        if(functionType.test(lastArg)){
          addEndpoint(route, method, argumentsArray);
        // When the Express Method defines a Router being mounted as middleware
        } else {
          addRouter(route, argumentsArray);
        };
      };
    };
  };

  extractImportedModules();
  extractEndpointsRouters();
  
  return fileObject;
};