/** 
@param pathObject from state 
function will build Postman Collection for each endpoint in the server file
and recurse for any router files imported into the server file
*/
export default function generatePostmanCollection(pathObject: any): string{

  // isolate server file as the root
  const serverFile = pathObject[ pathObject.__serverFilePath__];

  // check if port detected is a number for use in collection variables
  // if a variable reference was captured use default
  const portNumber = parseInt(pathObject.__portNumber__) + "" === "NaN" ? 8080 : pathObject.__portNumber__;

  // set up default collection schema
  // establish port variable for added flexibility in development
  const postmanCollection: any = {
    "info": {
	  "name": "New Collection",
	  "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
	 
		],
	"event": [
	  {
	    "listen": "prerequest",
		"script": {
		  "type": "text/javascript",
		  "exec": [
		    ""
			]
          }
	  },
	  {
	    "listen": "test",
		"script": {
		  "type": "text/javascript",
		  "exec": [
		    ""
		  ]
		}
	  }
    ],
	"variable": [
	  {
		"key": "port",
		"value": portNumber
	  }
	],
  }
  
    // utility function to generate routes and their endpoints on the current file
	// recurses for any imported routers
  function extractEndpointData(currentFile: any, parentRoute = '/'): void{
    
    // traverse through endpoints object for paths and respective methods
    for (let route in currentFile.endpoints){
	  const currentRoute: string =  parentRoute === '/' || route === parentRoute ? route : parentRoute + route;
	
      // iterate through current endpoint array 
      for(let endpointArray of currentFile.endpoints[route] ){
        // store transformed request type for addition to requestItem
        const reqMethod = endpointArray[0].toUpperCase()
		const requestItem = {
			"name": currentRoute,
			"request": {
			  "method": reqMethod,
			  "header": [],
			  "url": {
				"raw": "localhost:{{port}}" + currentRoute,
				"host": [
				  "localhost"
				  ],
				"port": "{{port}}",
				}
			},
			"response": []
		};
		  
		// Postman schema requires the separation of endpoint directories spread over an array
		// regex to remove leading forward slash so split method does not create empty string at index zero
		const pathArray = currentRoute.replace(/^\/+/, '').split('/');
		requestItem.request.url.path = pathArray;
		// push new request to array on item property
		postmanCollection.item.push(requestItem);
      }
      
    }

    // iterate through routers object to grab endpoints in appropriate file
    for (let route in currentFile.routers){
      // locate router file in the pathObject
      const currentRouteArray = currentFile.routers[route];
      const routerName = currentRouteArray[0][1];
      const importedFilePath = currentFile.imports[routerName] + '.js';
      const importedFile = pathObject[importedFilePath];

      // skip if does not exist in server directory
      if (importedFile === undefined){
        continue;
      }

      // recursive call to add methods for the imported router file
      extractEndpointData(importedFile, parentRoute === '/' ? route : parentRoute + route);
    }  
  }

  // build the Postman collection
  extractEndpointData(serverFile, '/');

  // return collection
  return JSON.stringify(postmanCollection, null, 2);
}

