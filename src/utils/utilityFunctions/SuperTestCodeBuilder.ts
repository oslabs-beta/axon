import StringBuilder from './StringBuilder';

/*
 This class is designed to group together functionality that is needed
 to build specific SuperTest tests. It extends from the StringBuilder class
 to make string creation more performant.
*/
class SuperTestCodeBuilder extends StringBuilder{

  constructor(formatConfig?: any){
    super(formatConfig);
  }

  /**
    This Method will create a SuperTest block. 
    @param {string} httpMethod - This will be the Http method being used.
    @param {string} endpointInfo - This object will have all of the superTest information
      statusCode: This property on the object is the status code that is expected to be returned
      route: This property is the route portion of the endpoint.
      contentType: This property on the object represents the content-type expected to be returned
  */
  generateSuperTest(httpMethod: string, endpointInfo: any): void{
    // Validate Input
    if (typeof httpMethod !== 'string' || typeof endpointInfo !== 'object') return;

    // Store the indentation before the test in a variable to be reset to after the test is written
    const indentationBeforeTest = this.currentTextIndentation;

    // Invoke the SuperTest Library function with the given server
    this.add('return request(server)', 'right');

    // Manually indent the rest of the test statements, since the chained methods are conditional based on 'endpointInfo'
    this.currentTextIndentation += this.indentationAmount;

    // Add the Method and and its endpoint
    if (endpointInfo.route){
      this.add(`.${httpMethod}(\'${endpointInfo.route}\')`);
    }

    // Check if .send() method is needed, add if true
    if (httpMethod !== 'get'){
      this.add('// .send({enter expected request body})');
    }
    
    // Add the Expected Content Type
    if (endpointInfo.contentType){
      this.add(`.expect(\'Content-Type\', ${endpointInfo.contentType})`);
    }
    
    // Add the Expected Status Code
    if (endpointInfo.statusCode){
      this.add(`.expect(${endpointInfo.statusCode})`);
    }

    // Reset the currentIndentation to the indentation before the supertest
    this.currentTextIndentation = indentationBeforeTest;
  }
}

export default SuperTestCodeBuilder;