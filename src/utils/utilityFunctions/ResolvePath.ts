/**
 * This Function will Resolve a path, based on the path of the current file. The
 * resolved path is meant to be used to access a file in the 'pathObject'
 * @param {string} pathToResolve - This is the path that needs to be resolved.
 * @param {string} pathOfCurrentFile - This is the path of the current file.
 */
export default function (pathToResolve:string, pathOfCurrentFile: string): string {
  // Validate the input:
  if (typeof pathToResolve !== 'string') return `${pathToResolve} could not be resolved`;
  if (typeof pathOfCurrentFile !== 'string') return `${pathOfCurrentFile} is an invalid current file path`;

  // Case: The pathToResolve is a path to a file, where the starting point is in the current folder
  if (pathToResolve.slice(0, 4) !== 'path' && pathToResolve.slice(0, 2) !== '..') {
    
    // The Resolved Path will be the pathOfCurrentFile (excluding the ending file), concatenated with the pathToResolve 
    let currentFilePath = pathOfCurrentFile.split('/');
    currentFilePath.pop();

    let resolvableFilePath = pathToResolve.split('/');
    if (resolvableFilePath[0] === '.') {
      resolvableFilePath.shift();
    }

    return `${currentFilePath.join('/')}/${resolvableFilePath.join('/')}`;

  // Case: The pathToResolve is a path to a file where moving up 1 or more directory levels is required
  } if (pathToResolve.slice(0, 4) !== 'path' && pathToResolve.slice(0, 2) === '..') {
    /*
     The Resolved Path will start with the 'pathOfCurrentFile'. The 'pathOfCurrentFile' will have a folder removed
     starting at the end-most folder, for every '..' element in the 'pathToResolve' path, to account for the movement up directory levels.
     The now shortened 'pathOfCurrentFile' will be concatenated with the 'pathToResolve', which will be removed of all '..' symbols,
     to create the new resolved path.
    */
    let relativeFilePath = pathToResolve.split('/');
    let currentFilePath = pathOfCurrentFile.split('/');

    currentFilePath.pop();

    while (relativeFilePath[0] === '..') {
      relativeFilePath.shift();
      currentFilePath.pop();
    }

    return `${currentFilePath.join('/')}/${relativeFilePath.join('/')}`;

  // Case: The pathToResolve is a path that is the evaluated result of a method being invoked from the native 'path' module
  } if (pathToResolve.slice(0, 4) === 'path') {
    return pathToResolve;

  }

  // When the pathToResolve is not in a format that is resolvable by the function
  return pathToResolve;
}
