import { StringConfiguration } from '../interfaces/interfaces';

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
   * @constructor
   * @param {object} formatConfig - This is an optional argument that can be 
   * used to configure the formatting of the string that is being built. 
   *   autoNewLine: is a boolean property that, when true, will automatically create a new line break after each new string added
   *   autoSpacing: is a boolean property that, when true, will automatically apply spacing between each string that was input.
   *   indentationAmout: is an integer that represents the amount to indent forward or backward when indentation is wanted. 
  */
  constructor(formatConfig?: StringConfiguration){
    // Set Default Configuration Values
    let autoNewLine = false;
    let autoSpacing = false;
    let indentationAmount = 2;

    // When a Configuration object was passed as input, update Configuration Values
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
   * @param {string} newString - This is the new String to add
   * @param {string} indent - This is an optional parameter. It is used to indent
   *   the newString and will continue to indent text at this level until specified otherwise.
   *
   *    'right' - will indent the current text by the 'indentationAmount'
   *    'left' - will de-indent the current text by the 'indentationAmount'
  */
  add(newString: string , indent?: string): void{
    // Validate the Input
    if (typeof newString !== 'string')  return;

    // Case: The current text and following text will be indented to the right
    if (indent === 'right'){
      this.currentTextIndentation += this.indentationAmount;

    // Case: The current text and following text will be indented to the left
    }else if (indent === 'left'){
      this.currentTextIndentation -= this.indentationAmount;
      if (this.currentTextIndentation < 0)
        this.currentTextIndentation = 0;
    }

    // Apply the necessary indentation to the new string
    if (this.currentTextIndentation > 0){
      const indentation = ' '.repeat(this.currentTextIndentation);
      this.arrayOfStrings.push(indentation);
    }

    // Add the new string 
    this.arrayOfStrings.push(newString);

    // Add auto spacing if specified
    if (this.autoSpacing){
      this.arrayOfStrings.push(' ');
    }

    // Add a linebreak if specified
    if (this.autoNewLine){
      this.arrayOfStrings.push('\n');
    }
  }

  /* This Method will set the indentation. It defaults to reseting it to zero if no argument is passed in */
  setIndentation(newAmount: number = 0): void{
    this.currentTextIndentation = newAmount;
  }

  /** 
   * This method will Build a new string from all strings added to the internal arrayOfStrings. 
   * @param {boolean} deleteString - This is an optional parameter which, when true, will reset the 
   *  'arrayOfStrings' to an empty array, after a string has been built.
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