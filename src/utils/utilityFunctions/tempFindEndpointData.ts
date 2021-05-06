import tempResolvePath from './tempResolvePath';
import tempFuncDefinitionParser from './tempFuncDefinitionParser';
const AbstractSyntaxTree = require('abstract-syntax-tree')
// const { parse, find } = require('abstract-syntax-tree')


const expressMethods: any = {
  'get': true,
  'delete': true,
  'patch': true,
  'put': true,
  'post': true,
  'use': true
}

export default function createObjectOfTree(fileText: string, currentFilePath:any){
  // Make Syntax Tree
  const tree = new AbstractSyntaxTree(fileText);

  // Object that will store the imports, endpoints and routers data
  const fileObject:any = {};
  fileObject.imports = {};
  fileObject.endpoints = {};
  fileObject.routers = {};

  // Traverse through the body of the Syntax Tree
  tree.body.forEach( statement => {
      
    // The Current Statement is an import 
    if (statement.type === 'VariableDeclaration'){
      // Check if there is something on the right side of the assignment operator
      if (statement.declarations[0].init){
        // Check if the type is a 'Call Expression'
        if (statement.declarations[0].init.type === 'CallExpression'){
            // Check if the callee name is 'require'
            if (statement.declarations[0].init.callee.name === 'require'){
              const importName = statement.declarations[0].id.name;
              const importPath = statement.declarations[0].init.arguments[0].value;

              // Add the import to the imports object on the fileObject
              fileObject.imports[importName] = tempResolvePath(importPath, currentFilePath);
            }
        }
      }
    // The Current Statemet is an Endpoint 
    }else if (statement.type === 'ExpressionStatement'){
        // Check if there is an expression object
        if (statement.expression){
            // Check if the expression is a 'CallExpression' and the callee object & arguments object is not empty
            if (statement.expression.type === 'CallExpression' && statement.expression.callee && statement.expression.arguments) {
                // Check if the expression type is ""mem'MemberExpression and property obcallee.ject is not ewmpty
                if (statement.expression.callee.type === 'MemberExpression' && statement.expression.callee.property) {
                   const methodName = statement.expression.callee.property.name;
                    // The method is an express method
                    if (expressMethods[methodName]){
                        // this checking that the first argument is a string
                        if (statement.expression.arguments[0].type === 'Literal' && typeof statement.expression.arguments[0].value === 'string') {
                            // Store relevant information
                            const argumentsArray = statement.expression.arguments;
                            const route = argumentsArray[0].value;
                            const method = statement.expression.callee.property.name;

                            // When the last argument is a function the express method is an endpoint
                            if (argumentsArray[ argumentsArray.length - 1].type === 'ArrowFunctionExpression'|| 
                                argumentsArray[ argumentsArray.length - 1].type === 'FunctionExpression'){
                              const endpointArray = [method];
                              //Add the endpointArray to the endpoints object in the fileObject
                              for (let i = 1; i < argumentsArray.length; i++){
                                    const stringFunction = AbstractSyntaxTree.generate(argumentsArray[i]);
                                    endpointArray.push(stringFunction);
                              }

                              // Convert the anon function as the last argument into an object of the endpoint data
                              endpointArray[endpointArray.length - 1] = tempFuncDefinitionParser(endpointArray[endpointArray.length - 1]);

                              if (fileObject.endpoints[route]){
                                fileObject.endpoints[route].push(endpointArray);
                              }else {
                                fileObject.endpoints[route] = [endpointArray];
                              }

                            // Add the router to the routers object in the fileObject 
                            }else{
                                const routerArray = [route];
                                // Add the routerArray to the router object in the fileObject
                                for (let i = 1; i < argumentsArray.length; i++){
                                    const stringFunction = AbstractSyntaxTree.generate(argumentsArray[i]);
                                    routerArray.push(stringFunction);
                                }
                                if (fileObject.routers[route]){
                                    fileObject.routers[route].push(routerArray);
                                }else {
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

  console.log(fileObject);
  return fileObject;
}

