export default function (pathToResolve:any , pathOfCurrentFile: any){
  // Validate the input:
  if (typeof pathToResolve !== 'string') return pathToResolve + ' could not be resolved';

  if (typeof pathOfCurrentFile !== 'string') return pathOfCurrentFile + ' is an invalid current file path';

  // Case: The pathToResolve is a path to a file, where the starting point is in the current folder
  if (pathToResolve.slice(0, 4) !== 'path' && pathToResolve.slice(0, 2) !== '..'){
    /*
     The Resolved Path will be the 'pathOfCurrentFile' path (excluding the ending file), concatenated
     with the pathToResolve (minus a potential './' character if it exists in the beggining of pathToResolve).
     The main case this does not handle is if the pathToResolve starts with a folder or file named 'path'
    */
    pathOfCurrentFile = pathOfCurrentFile.split('/');
    pathOfCurrentFile.pop();

    pathToResolve = pathToResolve.split('/');
    if (pathToResolve[0] === '.'){
      pathToResolve.shift();
    }

    return pathOfCurrentFile.join('/') + '/' + pathToResolve.join('/');

  // Case: The pathToResolve is a path to a file where moving up 1 or more directory levels is required 
  }else if(pathToResolve.slice(0, 4) !== 'path' && pathToResolve.slice(0, 2) === '..'){
    /*
     The Resolved Path will start with the 'pathOfCurrentFile'. The 'pathOfCurrentFile' will have a folder removed 
     starting at the end most folder, for every '..' element in the 'pathToResolve' path, to account for the movement up directory levels.
     The now shortened 'pathOfCurrentFile' will be concatenated with the 'pathToResolve' path, which will be removed of all '..' symbols,
     to create the new resolved path.
    */
    pathToResolve = pathToResolve.split('/');
    pathOfCurrentFile = pathOfCurrentFile.split('/');

    pathOfCurrentFile.pop();

    while (pathToResolve[0] === '..'){
      pathToResolve.shift();
      pathOfCurrentFile.pop();
    }

    return pathOfCurrentFile.join('/') + '/' + pathToResolve.join('/');

  // Case: The pathToResolve is a path that is the evaluated result of a method being invoked from the native 'path' module
  }else if (pathToResolve.slice(0, 4) === 'path'){
    return pathToResolve;

  // Case: The pathToResolve is not in a format that is resolvable by the function
  }else{
    return pathToResolve;
  }
}
