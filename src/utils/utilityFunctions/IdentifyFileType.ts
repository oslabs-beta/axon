const AbstractSyntaxTree = require('abstract-syntax-tree');

/**
 * This function will identify the type of file based on the text and attempt
 * to find the portNumber, if given. 
 * @param {string} fileText - This will be the text from the file
 * @returns {object} - Will return an object with a fileType property and a portNumber property
 *   fileType: will be 'Server', 'Router' or 'Other'
 *   portNumber: will be a string or null
 */
export function IdentifyFileType(fileText: string) : {fileType: string, portNumber: string|undefined} {
  const tree = new AbstractSyntaxTree(fileText);
  let portNumber;
  let fileType;

  const isServer = () => {
    // Attempt to match a 'listen' method being invoked
    const listen = tree.find({
      type:'ExpressionStatement', 
      expression: {
        type:'CallExpression', 
        callee: {
          type:'MemberExpression', 
          property: {
            name:'listen'
          },
        },
      },
    });

    if(listen.length){
      const portArgRef = listen[0].expression.arguments[0];
      portNumber = portArgRef.value ? String(portArgRef.value) : portArgRef.name;
      return true;
    };
    return false;
  }
  const isRouter = () => {
    // Attempt to match a 'Router' Method being invoked
    const router = tree.find({
      type:'VariableDeclaration', 
      declarations: {
        0: {
          init: {
            type: 'CallExpression', 
            callee: {
              type:'MemberExpression', 
              property: {
                name:'Router',
              },
            },
          },
        },
      },
    });

    if(router.length) return true;
    return false;
  }
  
  if(isServer()){
    fileType = 'Server';
  } else if(isRouter()){
    fileType = 'Router';
  } else{
    fileType = 'Other';
  }
  
  return { fileType, portNumber };
};