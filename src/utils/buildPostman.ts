/**
 * This Function is designed to take the pathObject as input and create a 
 * JSON string capable of generating Postman collections, when imported
 * into Postman.
 @param {object} pathObject - The path object that will hold all of the file
   objects and their endpoints.
 *
*/
export default function generatePostmanCollection(pathObject: PathObject): string {
  // Isolate the root server file
  const serverPath = <string> pathObject.__serverFilePath__;
  const serverFile = <FileObject> pathObject[serverPath];

  // Check if the port detected is a number for use in collection variables, otherwise use a default port number
  const portInServerFiles = <string> pathObject.__portNumber__;
  const portNumber = parseInt(portInServerFiles) === NaN ? 8080 : portInServerFiles;

  // Initialize the default collection schema
  // Establish port variable for added flexibility in development
  const postmanCollection:PostmanCollection = {
    info: {
	  name: 'New Collection',
	  schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [

    ],
    event: [
	  {
	    listen: 'prerequest',
        script: {
		  type: 'text/javascript',
		  exec: [
		    '',
          ],
        },
	  },
	  {
	    listen: 'test',
        script: {
		  type: 'text/javascript',
		  exec: [
		    '',
		  ],
        },
	  },
    ],
    variable: [
	  {
        key: 'port',
        value: `${portNumber}`,
	  },
    ],
  };

  // Utility function to generate routes and their endpoints on the current file
  // Recurses for any imported routers
  function extractEndpointData(currentFile: FileObject, parentRoute = '/'): void {
    // Traverse through endpoints object for paths and respective methods
    for (const route in currentFile.endpoints) {
	  const currentRoute: string = parentRoute === '/' || route === parentRoute ? route : parentRoute + route;

      // Iterate through the current endpoint array
      for (const endpointArray of currentFile.endpoints[route] as AllEndpoints) {
        // Store transformed request type for addition to requestItem
        const reqMethod = <string> endpointArray[0];
        const requestItem: RequestObject = {
          name: currentRoute,
          request: {
			  method: reqMethod.toUpperCase(),
			  header: [],
			  url: {
              raw: `localhost:{{port}}${currentRoute}`,
              host: [
				  'localhost',
				  ],
              port: '{{port}}',
            },
          },
          response: [],
        };

        // Postman schema requires the separation of endpoint directories spread over an array
        // Regex to remove leading forward slash so split method does not create empty string at index zero
        const pathArray = currentRoute.replace(/^\/+/, '').split('/');
        requestItem.request.url.path = pathArray;
        // Push new request to array on item property
        postmanCollection.item.push(requestItem);
      }
    }

    // Iterate through routers object to grab endpoints in appropriate file
    for (const route in currentFile.routers) {
      // Locate router file in the pathObject
      const currentRouteArray = <AllRouters> currentFile.routers[route];
      const routerName = currentRouteArray[0][1];
      const importedFilePath = `${currentFile.imports[routerName]}.js`;
      const importedFile = <FileObject> pathObject[importedFilePath];

      // Skip if it does not exist in server directory
      if (importedFile === undefined) {
        continue;
      }

      // Recursive call to add methods for the imported router file
      extractEndpointData(importedFile, parentRoute === '/' ? route : parentRoute + route);
    }
  }

  // Build the Postman collection
  extractEndpointData(serverFile, '/');

  // Return collection
  return JSON.stringify(postmanCollection, null, 2);
}
