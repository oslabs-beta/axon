/*
 This Class is designed to build a string in a better time complexity.
 It will be more performant than traditional string concatenation. 
*/
class StringBuilder{

  arrayOfStrings: string[];
  autoNewLine: boolean;
  autoSpacing: boolean;
  indentationAmount: number;
  currentTextIndentation: number;

  /**
   * The Constructor for the StringBuilder class optionally takes in an argument.
   * @param {object} formatConfig - This is an optional argument that can be 
   * used to configure the formatting of the string that is being built. 
   * 
   *   autoNewLine: is a boolean property on the object that, when true, will
   *       automatically create a new line break after each new string added
   * 
   *   autoSpacing: is a boolean property on the object that, when true, will
   *      automatically apply spacing between each string that was input.
   * 
   *   indentationAmout: is an integer that represents the amount to indent forward
   *       or backward when indentation is wanted. It will default to 2 spaces.
  */
  constructor(formatConfig?: any){
    // Set Default Config Values
    let autoNewLine = false;
    let autoSpacing = false;
    let indentationAmount = 2;

    // When a Configuration object was passed as input, update default Config Values
    if (formatConfig ) {
      formatConfig.autoNewLine ? autoNewLine = formatConfig.autoNewLine : null;
      formatConfig.autoSpacing ? autoSpacing = formatConfig.autoSpacing : null;
      formatConfig.indentationAmount ? indentationAmount = formatConfig.indentationAmount : null;
    } 

    this.arrayOfStrings = [];
    this.autoNewLine = autoNewLine;
    this.autoSpacing = autoSpacing;
    this.indentationAmount = indentationAmount;
    this.currentTextIndentation = 0;
  }

  /**
   * This Method will add a new string to the internal 'arrayOfStrings'. 
   * @param {text} indent - This is an optional parameter. It is used to
   *    change the 'currentTextIndentation' so that current text and any
   *    further text will continue to be indented. Until specified otherwise.
   *    If it is not passed in, text will continue to be indented at 'currentTextIndentation'.
   * 
   *    'left' - will indent the current text by the 'indentationAmount'
   *    'right' - will de-indent the current text by the 'indentationAmount'
  */
  add(newString: string , indent?: string): void{
    // Validate the Input:
    if (typeof newString !== 'string')  return;

    // Change Indentation when 'indent' input is passed
    // Case: The current text and following text will be indented to the right
    if (indent === 'right'){
      this.currentTextIndentation += this.indentationAmount;

    // Case: The current text and following text will be indented to the left
    }else if (indent === 'left'){
      this.currentTextIndentation -= this.indentationAmount;
      if (this.currentTextIndentation < 0)
        this.currentTextIndentation = 0;
    }

    // Apply current Text Indentation
    if (this.currentTextIndentation > 0){
      const indentation = ' '.repeat(this.currentTextIndentation);
      this.arrayOfStrings.push(indentation);
    }

    // Add the new string 
    this.arrayOfStrings.push(newString);

    // Add auto spacing if needed
    if (this.autoSpacing){
      this.arrayOfStrings.push(' ');
    }

    // Add a linebreak if needed
    if (this.autoNewLine){
      this.arrayOfStrings.push('\n');
    }
  }

  /* This Method will set the indentation. It defaults to reseting it if no argument is passed in*/
  setIndentation(newAmount: number = 0): void{
    this.currentTextIndentation = newAmount;
  }

  /**
   * Will Build a new string from all strings added to internal array of strings. This method mimicks string concatenation.
   * The input is optional, and if 'true' is input, the string will be built and after it is built, the arrayOfStrings 
   * will be reset to an empty array internally.
  */
  buildString(deleteString?: boolean): string{
    const builtString = this.arrayOfStrings.join('');

    if (deleteString){
      this.arrayOfStrings = [];
    }

    return builtString;
  }
}

export default StringBuilder;