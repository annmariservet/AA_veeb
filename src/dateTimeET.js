const tellDateET = function(){
    let timeNow = new Date();
    const monthNamesET = ["jaanura", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    return timeNow.getDate() + "." + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const tellTimeET = function(){
    let timeNow = new Date();
    return timeNow.getHours() + "." + timeNow.getMinutes() + "." + timeNow.getSeconds();
}

const tellDayET = function(){
    let timeNow = new Date();
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
    return dayNamesET[timeNow.getDay()];
}

module.exports = {longDate: tellDateET, weekDay: tellDayET, time: tellTimeET}; //expordime {selle nimega: selle asja}