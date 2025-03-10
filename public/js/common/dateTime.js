// Function to format date and time
// function formatDateTime(dateTime) {
//     const date = new Date(dateTime._seconds * 1000);
//     const formattedDate = date.toLocaleDateString();
//     const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     return formattedDate + " " + formattedTime;
//   }


// Function to format date. Ex: February 6, 2020
// function formatDate(dateTime) {
//   const date = new Date(dateTime._seconds * 1000);
//   const options = { 
//       month: '2-digit', 
//       day: '2-digit', 
//       year: 'numeric', 
//   };
//   return date.toLocaleDateString('en-US', options);
// }

// // Function to format date
// function formatDate(dateTime) {
//     const options = { 
//         month: 'long', 
//         day: 'numeric', 
//         year: 'numeric', 
//         hour: 'numeric',
//         minute: 'numeric',
//         second: 'numeric',
//         hour12: true,
//         timeZoneName: 'short'
//     };
//     return new Date(dateTime).toLocaleString('en-US', options);
// }



// Function to format date and time. Ex: 6/1/2024
function formatDate(dateTime) {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-US');
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${formattedDate}`;
}


// Function to format date and time. Ex: 6/1/2024 01:34 PM
function formatDateTime(dateTime) {
  if(!dateTime){
    return 'null';
  }
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString('en-US');
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${formattedDate} ${formattedTime}`;
}




// const timeStamp1 = formatDateTime(new Date());
// console.log(timeStamp1)


// const timeStamp2 = formatDate(new Date());
// console.log(timeStamp2)
