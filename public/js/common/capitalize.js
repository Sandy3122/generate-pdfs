// Function to capitalize each word in a string
function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


// Function to convert camel case to capitalized words with spaces
function capitalizeWordsWithSpaces(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase letters
    .split(' ')                            // Split the string by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize each word
    .join(' ');                            // Join the words with a space
}