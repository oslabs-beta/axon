export function tempIdentifyFileType(data:any) :any{ 
  const dotListenRE = /\.listen\((?<port>.*?)\)/i; 
  const listenMatch = data.match(dotListenRE);
  
  let portNumber;
  if(listenMatch){
    portNumber = listenMatch.groups.port;
  }

  const dotRouterRE = /express\.Router\(\)/gi; // grab label ?
  const routerMatch = data.match(dotRouterRE);
  

  let fileType = "";
  if (listenMatch === null && routerMatch === null) 
    fileType = 'Other';
  else if(Array.isArray(listenMatch) && listenMatch.includes('.listen')) 
    fileType = 'Server';
  else if (Array.isArray(routerMatch) && routerMatch.includes('express.Router()')) 
    fileType = 'Router';

  return {fileType, portNumber: portNumber ? portNumber : null};
}

