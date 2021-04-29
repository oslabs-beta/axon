export function tempIdentifyFileType(data:any) :any{ 
  const dotListenRE = /\.listen/gi; 
  const listenMatch = data.match(dotListenRE);


  const dotRouterRE = /express\.Router\(\)/gi; 
  const routerMatch = data.match(dotRouterRE);
  

  let result = "";
  if (listenMatch === null && routerMatch === null) 
    result = 'Other';
  else if(Array.isArray(listenMatch) && listenMatch.includes('.listen')) 
    result = 'Server';
  else if (Array.isArray(routerMatch) && routerMatch.includes('express.Router()')) 
    result = 'Router';

  return result;
}

