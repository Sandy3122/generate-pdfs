// dateTime.js
const formatTimestamp = () => {
    const timeStamp = new Date();
    console.log('Raw Timestamp:', timeStamp);
  
    // Define options for formatting date and time
    const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short', timeZone: 'Asia/Kolkata' };
  
    // Format date and time
    const formattedDate = timeStamp.toLocaleDateString('en-IN', optionsDate);
    const formattedTime = timeStamp.toLocaleTimeString('en-IN', optionsTime);
  
    // Construct the formatted string
    const formattedTimestamp = `${formattedDate} ${formattedTime}`;
    console.log('Formatted Timestamp:', formattedTimestamp);
  
    return formattedTimestamp;
}

module.exports = { formatTimestamp };
