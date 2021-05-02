/*
 This Class is designed to build a string in a better time complexity.
 It will be more performant than traditional string concatenation. 
 Note that no assumtions are made about the string having spaces or line breaks,
 all must be accounted for when adding strings to internal 'arrayOfStrings'
*/
class StringBuilder{

  arrayOfStrings: string[];
  newString: string;

  constructor(){
    // This array acts as an internal store of all strings until the main string is needed to be built
    this.arrayOfStrings = [];
  }

  // Add a string to the arrayOfStrings.
  add(newString: string | string[]) :void{
    // Validate the Input:
    if (typeof newString !== 'string' && !Array.isArray(newString))  return;

    // Case: When the input is a string 
    if (!Array.isArray(newString)){
      this.arrayOfStrings.push(newString);

    // Case: When the input is an array
    }else{
      this.arrayOfStrings.push(...newString);
    }
  }

  // Will Build a new string from all strings added to internal array of strings. This method mimicks string concatenation
  buildString(){
    return this.arrayOfStrings.join('');
  }
}

export default StringBuilder;