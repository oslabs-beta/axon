import StringBuilder from './StringBuilder';
import { StringConfiguration, EndpointInformation } from '../interfaces/interfaces';

/*
 This class is designed to group together functionality that is needed
 to build specific SuperTest tests. It extends from the StringBuilder class
 to make string creation more performant.
*/
class SuperTestCodeBuilder extends StringBuilder {
  constructor(formatConfig?: StringConfiguration) {
    super(formatConfig);
  }

  /**
    This Method will create a SuperTest block of code.
    @param {string} httpMethod - This will be the Http method being used at the specific endpoint.
    @param {object} endpointInfo - This object will have all of the endpoint information needed for the Supertest code.
      statusCode: This property on the object is the status code that is expected to be returned
      route: This property is the route portion from the endpoint.
      contentType: This property on the object represents the content-type expected to be returned
  */
  generateSuperTest(httpMethod: string, endpointInfo: EndpointInformation): void {
    // Validate the Input
    if (typeof httpMethod !== 'string' || typeof endpointInfo !== 'object') return;

    // Record the current indentation, before the tests are written, to be reset after the test block is written
    const indentationBeforeTest = this.currentTextIndentation;

    // Invoke the SuperTest Library function with the given server
    this.add('return request(server)', 'right');

    // Manually indent the rest of the test statements, since the chained methods will be indented at the same level
    this.currentTextIndentation += this.indentationAmount;

    // Add the Method and and its endpoint
    if (endpointInfo.route) {
      this.add(`.${httpMethod}(\'${endpointInfo.route}\')`);
    }

    // Add a 'send' method, when the httpMethod requires data to be sent
    if (httpMethod !== 'get') {
      this.add('// .send({enter expected request body})');
    }

    // Add the Expected Content Type
    if (endpointInfo.contentType) {
      this.add(`.expect(\'Content-Type\', ${endpointInfo.contentType})`);
    }

    // Add the Expected Status Code
    if (endpointInfo.statusCode) {
      this.add(`.expect(${endpointInfo.statusCode})`);
    }

    // Reset the currentIndentation to the indentation before the supertest code block was written
    this.currentTextIndentation = indentationBeforeTest;
  }
}

export default SuperTestCodeBuilder;
