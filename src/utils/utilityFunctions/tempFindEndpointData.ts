import tempResolvePath from './tempResolvePath';
import tempFuncDefinitionParser from './tempFuncDefinitionParser';

export default function(fileText:any, currentFilePath:any){ // currentFilePath is only for TESTINg purposes, delete this parameter when done

  // Declare the object that will be returned
  const returnObj: any = {};
  returnObj.endpoints = {};
  returnObj.routers = {};
  returnObj.imports = {};

  // Generate all Matches in the fileText that match express endpoints
  const endpointRE = /\.(?<request>get|post|put|patch|delete)\s?\((['"])(?<path>.*?)\2\,(?:\r?\n\s*)*(?<midware>([a-z\.\s]*\,\r?\n?\s*)*)\s?(?<anonFunc>(?:function)?\(req\,\s?res\)(?:.*?|\r?\n)*?\}\);)/gim
  const endpointMatch = [...fileText.matchAll(endpointRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups
    return obj;
  }, {});

  // Generate all Matches in the fileText that match express routers being mounted
  const routerRE =  /\.use\((['"])(?<route>.*?)\2\,\s?(?<label>.*?)\)/gi;
  const routerMatch = [...fileText.matchAll(routerRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups
    return obj;
  }, {});

  // Generate all Matches in the fileText that match express import statements
  const requireRE = /(?:const|let|var)\s(?<label>.*?)\s?=\s?require\((['"])(?<path>.*?)\2\)/gi;
  const requireMatch = [...fileText.matchAll(requireRE)].reduce((obj, matchArr, ind) => {
    obj[ind] = matchArr.groups
    return obj;
  }, {});

  // Traverse through the endpointMatch Object and build up the returnObject 
  for (let i = 0; i < Object.keys(endpointMatch).length; i++ ){
    const {path, midware, request, anonFunc} = endpointMatch[i];
     
    // When the current path has already been recored in the 'returnObj', push a new endpoint array into the endpoints array
    if (returnObj['endpoints'][path]){
      returnObj['endpoints'][path].push( [request, midware, tempFuncDefinitionParser(anonFunc)] );
    // When the current path has not been recoreded in the 'returnObj', create an empty enpoint array at the current path and push a new endpoint array into it
    }else{
      returnObj['endpoints'][path] = [];
      returnObj['endpoints'][path].push( [request, midware, tempFuncDefinitionParser(anonFunc)] );
    }
  }

  // Traverse through the routerMatch object and build up the returnObject
  for (let i = 0; i < Object.keys(routerMatch).length; i++ ){
    const { route, label } = routerMatch[i];
     
    // When the current path has already been recored in the 'returnObj', push a new endpoint array into the endpoints array
    if (returnObj['routers'][route]){
      returnObj['routers'][route].push( [route, label] );
    // When the current path has not been recoreded in the 'returnObj', create an empty enpoint array at the current path and push a new endpoint array into it
    }else{
      returnObj['routers'][route] = [];
      returnObj['routers'][route].push( [route, label] );
    }
  }

  // Traverse through the requireMatch object and build up the returnObject
  for (let i = 0; i < Object.keys(requireMatch).length; i++ ){
    const { path, label } = requireMatch[i];
     
    returnObj['imports'][label] = tempResolvePath(path, currentFilePath);
  }

  // Returning dummy object we will eventually build up from the object that is returned from Alis RegExp
  return returnObj;
}
