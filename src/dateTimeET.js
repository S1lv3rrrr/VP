const dateFormattedET = function(type){	
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow = timeNow.getFullYear();
	let weekdayNow = new Date().getDay();
	const monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	const monthNamesFolkET = ['näärikuu', 'küünlakuu', 'paastukuu', 'jürikuu', 'lehekuu', 'jaanikuu', 'heinakuu', 'lõikuskuu', 'mihklikuu', 'viinakuu', 'talvekuu', 'jõulukuu'];
	const weekdayNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'];
	let monthName;
	if (type === 0){
		monthName = monthNamesET[monthNow];
	} else {
		monthName = monthNamesFolkET[monthNow];
	}
	return weekdayNamesET[weekdayNow] + ', ' + timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
}

const addLeadZero = function(numValue){
	if(numValue < 10){
		numValue = numValue.padStart(2, '0');
	}
	return numValue;
}

function weekDayET() {
	let weekdayNow = new Date().getDay();
	const weekdayNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'];
	return weekdayNamesET[weekdayNow];
}

const timeFormattedET = function(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	let timeFormattedET = hourNow + ':' + addLeadZero(minuteNow) + ':' + addLeadZero(secondNow);
	return timeFormattedET;
}

//ekspordin kõik vajaliku
module.exports = {fullDate: dateFormattedET, fullTime: timeFormattedET, day: weekDayET}