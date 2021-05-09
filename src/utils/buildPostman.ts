// buildPathObject result set in state
// pull path object from state 
// pass to Postman or Supertest

import { InferencePriority } from "typescript";

// buildPathObject(fileList)
//  .then( pathObject => set state with it here)
// buildSuperTest( axonState.pathObject)



// ------------------------------------------------------


// import SuperTestCodeBuilder from './utilityFunctions/SuperTestCodeBuilder';


export default function generatePostmanCollection(pathObject: any): string{

  const postmanCollection = {
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
		"value": `${portNumber}`
	  }
	],
  }
  // Find the Server File within the 'pathObject' as the starting File
  const serverFile = pathObject[ pathObject.__serverFilePath__];

  // Add Heading to the SuperTestFile
  const portNumber = pathObject.__portNumber__;
  const hostName = 'localhost:';

  /*
    This helper function will generate SuperTestCode on the current files endpoints.
    It will recursively go to any imported routers and generate the superTestCode for
    their endpoints as well.
  */
  function extractEndpointData(currentFile: any, parentRoute = '/'): void{
    
    // Traverse through Endpoints object and begin to write tests for each endpoint
    for (let route in currentFile.endpoints){
      const currentRoute: string = route === parentRoute ? route : parentRoute + route;

      // Traverse through the current endpoint array 
      for(let endpointArray of currentFile.endpoints[route] ){
        // Store relevant endpoint information from endpoint array into variables
        const reqMethod = `\"${endpointArray[0].toUpperCase()}\"`
        
		// currentRoute.split('/')
		postmanCollection.item.push();
		const tempName = {
			"name": `${currentRoute}`,
			"request": {
			  "method": `${reqMethod}`,
			  "header": [],
			  "url": {
				"raw": "localhost:{{port}}" + currentRoute,
				"host": [
				  "localhost"
				  ],
				"port": "{{port}}",
				"path": variable,
				  
				}
			},
			  "response": []
		  }
      }
      
    }

    // Traverse through the Routers object and write tests for each imported router
    for (let route in currentFile.routers){
      // Find the imported File in the pathObject
      const currentRouteArray = currentFile.routers[route];
      const routerName = currentRouteArray[0][1];
      const importedFilePath = currentFile.imports[routerName] + '.js';
      const importedFile = pathObject[importedFilePath];

      // Skip the file if it is not a router file
      if (importedFile === undefined){
        continue;
      }

      // Call function recursively to build superTest code for the imported router file
      extractEndpointData(importedFile, parentRoute === '/' ? route : parentRoute + route);
    }  
  }

  // Build the Super Test Code
  extractEndpointData(serverFile, '/');

  // Return the Collection
  // return 
}

// postmanTemplate.item.push()[i] -> object
// if (typeof portNumber !== 'number') portNumber = 8080
