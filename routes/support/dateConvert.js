  function showDate(dateTimeString){    
    const date = new Date(dateTimeString);
    const dayofweek = date.getDay()
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthName = months[monthIndex];
  
    const suffix = getDaySuffix(day);
    const Day = getDayOfWeek(dayofweek)
  
    const formattedDate = `${Day}, ${monthName} ${day}${suffix} ${year}`;
    return formattedDate
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  function getDayOfWeek(dayofweek){
    var weekdays = new Array(7);
    weekdays[0] = "Sun";
    weekdays[1] = "Mon";
    weekdays[2] = "Tues";
    weekdays[3] = "Wed";
    weekdays[4] = "Thurs";
    weekdays[5] = "Fri";
    weekdays[6] = "Sat";

    return weekdays[dayofweek]
  }

module.exports = {showDate}