import StringBuilder from './StringBuilder';

/*
 This class is designed to group together functionality that is needed
 to build a boiler-plate Jest test. It extends from the StringBuilder class
 to make string creation more performant.
*/
class JestCodeBuilder extends StringBuilder{

  indentation: number | undefined;

  constructor(indentation){
    super();
    // Default indentation will be 2 and will scale by a factor of 2 for each iT block and again for each test, by default
    this.indentation = indentation || 2;
  }

  /**
    This Method will create a Describe block. 
    @param {string} describeText - This will be the text of the Describe block that is being created.
    @param {string} content - This will be the content of the Describe block. It is assumed that this string
    will have its own indentation.
    @param {number} indentation - This parameter is used to know the indentation of the describe blocks first and last line.  
  */
  generateDescribeBlock(describeText: string, content: string , indentation: number | undefined = this.indentation){
    // Validate Input
    if (typeof describeText !== 'string' || typeof content !== 'string' 
      || isNaN(indentation) || indentation % 1 ) return '';
    
    // Generate the proper indentation for the beggining and ending of the block
    const describeBlockIndentation = '\s'.repeat(indentation);

    // Generate the first line of the Describe block with the input describe text and proper indention
    const firstLine = 'describe(\'' + describeText + '\', () => {\n';
    this.add(describeBlockIndentation);
    this.add(firstLine);

    // Add the content of the describe block
    this.add(content);
    
    // Add the end of the describe block with the proper indention
    const lastLine = '});';
    this.add(describeBlockIndentation);
    this.add(lastLine);
  }

  /**
    This Method will create a It block. 
    @param {string} itText - This will be the text of the It block that is being created.
    @param {string} content - This will be the content of the It block. It is assumed that this string
    will have its own indentation.
    @param {number} indentation - This parameter is used to know the indentation of the It blocks first and last line.
  */
  generateItBlock(itText: string, content: string , indentation: number | undefined  = this.indentation * 2){
    // Validate Input
    if (typeof itText !== 'string' || typeof content !== 'string' 
      || isNaN(indentation) || indentation % 1 ) return '';
    
    // Generate the proper indentation for the beggining and ending of the block
    const itBlockIndention = '\s'.repeat(indentation);

    // Generate the first line of the It block with the input  itText and proper indention
    const firstLine = 'it(\'' + itText + '\', () => {\n';
    this.add(itBlockIndention);
    this.add(firstLine);

    // Add the content of the block
    this.add(content);
    
    // Add the end of the iT block with the proper indention
    const lastLine = '});';
    this.add(itBlockIndention);
    this.add(lastLine);
  }

  /**
    This Method will create a specific supertest test. 
    @param {string} httpMethod - This will be the http method of the endpoint that is being tested
    @param {string} content - This will be the content of the It block. It is assumed that this string
    will have its own indentation.
    @param {number} indentation - This parameter is used to know the indentation of the It blocks first and last line.
  */
  generateExpectTest(httpMethod: string, testInfo: any, indentation: number | undefined = this.indentation * 3){
    
  }

}