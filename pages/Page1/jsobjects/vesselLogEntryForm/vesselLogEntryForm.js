export default {
	
	formatToOneDecimal: (inputValue) => {
		const num = parseFloat(inputValue);
		if (isNaN(num)) {
			return ""; // Fallback value for invalid inputs
		}
		return num.toFixed(1);
	},
	
	formatNegativeCompass: (inputValue) => {
		var num = parseInt(inputValue);
		if (isNaN(num) || num < -180 || num > 360) {
			return ""; // Fallback value for invalid inputs
		}
		if (num < 0) {
			num += 360;
		}
		if (num ===360) {
			num = 0;
		}
		return num.toString();
	},
	
	getDefaults: () => {
		const dt = getDeviceFormattedDate();
		return { 
			latitude : appsmith.geolocation.currentPosition.coords.latitude,
			longitude : appsmith.geolocation.currentPosition.coords.longitude,
			title: dt,
		  time : dt
		}
	},
	
	getDeviceFormattedDate: () => {
		const now = new Date();

		// 1. Extract local date parts using the device's native environment settings
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});

		const parts = formatter.formatToParts(now);
		const p = Object.fromEntries(parts.map(item => [item.type, item.value]));

		// 2. Calculate the device's current timezone offset in minutes
		// Note: getTimezoneOffset() returns positive minutes for negative offsets, so we invert it
		const offsetMinutes = -now.getTimezoneOffset(); 
		const sign = offsetMinutes >= 0 ? "+" : "-";
		const absMinutes = Math.abs(offsetMinutes);

		// 3. Format the hours and minutes of the offset to match 'hh:mm' style
		const offsetHours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
		const offsetMinsRemaining = String(absMinutes % 60).padStart(2, '0');
		const formattedOffset = `${sign}${offsetHours}:${offsetMinsRemaining}`;

		// 4. Combine into the final requested string layout
		return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${formattedOffset}`;
	}


  
}