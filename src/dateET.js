//function tellDateET() {
exports.tellDateET = function(){
    let timeNow = new Date();
    const monthNamesET = ["jaanura", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    return timeNow.getDate() + "." + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}