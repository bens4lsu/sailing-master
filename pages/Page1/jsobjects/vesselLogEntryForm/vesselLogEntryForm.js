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
		if (num === 360) {
			num = 0;
		}
		return num.toString();
	},
	
	handleNewClick: async () => {
		const dt = this.getDeviceFormattedDate(); 
		
		await appsmith.geolocation.getCurrentPosition();
		await storeValue('formDefaults', {
			id: crypto.randomUUID(), 
			"title": dt,
			"entry_datetime": dt,
			latitude: appsmith.geolocation.currentPosition.coords.latitude,
			longitude: appsmith.geolocation.currentPosition.coords.longitude,
			engine: "",
			"stw": "",
			"sog": "",
			"heading": "",
			"cog": "",
			"status": "",
			"overdrive": "",
			"rpm": "",
			"temp": "",
			"hours": "",
			"fuel": "",
			"mileage": "",
			"main_sail": "",
			"storm_jib": "",
			"genoa": "",
			"code_zero": "",
			"wind_speed": "",
			"barometer": "",
			"true_wind_direction": "",
			"true_wind_angle": "",
			"sea_state": "",
			"weather": "",
			"house_battery_life": "",
			"watermaker": "",
			"temp_cabin": "",
			"temp_tech_room": "",
			"tack": "",
			"heel_angle": "",
			"point_of_sail": "",
			"water_starboard": "",
			"water_port": "",
			"narrative": ""
		}); 
		showModal('logEntryModal');
	},
	
	handleEditClick: async (rowData) => {
		await storeValue('formDefaults', {
			id: rowData.id || "ERROR", 
			"title": rowData.title || "",
			"entry_datetime": rowData.entry_datetime || "",
			latitude: rowData.latitude || "",
			longitude: rowData.longitude || "",
			engine: rowData.engine || "",
			"stw": rowData.stw || "",
			"sog": rowData.sog || "",
			"heading": rowData.heading || "",
			"cog": rowData.cog || "",
			"status": rowData.status || "",
			"overdrive": rowData.overdrive || "",
			"rpm": rowData.rpm || "",
			"temp": rowData.temp || "",
			"hours": rowData.hours || "",
			"fuel": rowData.fuel || "",
			"mileage": rowData.mileage || "",
			"main_sail": rowData.main_sail || "",
			"storm_jib": rowData.storm_jib || "",
			"genoa": rowData.genoa || "",
			"code_zero": rowData.code_zero || "",
			"wind_speed": rowData.wind_speed || "",
			"barometer": rowData.barometer || "",
			"true_wind_direction": rowData.true_wind_direction || "",
			"true_wind_angle": rowData.true_wind_angle || "",
			"sea_state": rowData.sea_state || "",
			"weather": rowData.weather || "",
			"house_battery_life": rowData.house_battery_life || "",
			"watermaker": rowData.watermaker || "",
			"temp_cabin": rowData.temp_cabin || "",
			"temp_tech_room": rowData.temp_tech_room || "",
			"tack": rowData.tack || "",
			"heel_angle": rowData.heel_angle || "",
			"point_of_sail": rowData.point_of_sail || "",
			"water_starboard": rowData.water_starboard || "",
			"water_port": rowData.water_port || "",
			"narrative": rowData.narrative || ""
		}); 
		showModal('logEntryModal');
	},
	
	getDeviceFormattedDate: () => {
		const now = new Date();
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

		const offsetMinutes = -now.getTimezoneOffset(); 
		const sign = offsetMinutes >= 0 ? "+" : "-";
		const absMinutes = Math.abs(offsetMinutes);

		const offsetHours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
		const offsetMinsRemaining = String(absMinutes % 60).padStart(2, '0');
		const formattedOffset = `${sign}${offsetHours}:${offsetMinsRemaining}`;

		return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${formattedOffset}`;
	},
	
	upsertEditedData: async () => {
		const payload = {
			"records": [
				{
					"id": inpId.text,
					"vessel_id": appsmith.store.vesselId,
					"title": inpTitle.text,
					"entry_datetime": inpTime.text,
					"latitude": inpLat.text,
					"longitude" : inpLong.text,
					"stw": inpSTW.text,
					"sog": inpSOG.text,
					"heading": inpHeading.text,
					"cog": inp,
					"status": "UNDERWAY",
					"overdrive": "OFF",
					"rpm": 1800,
					"temp": 85,
					"hours": 1247,
					"fuel": 65,
					"mileage": 12345.6,
					"main_sail": "FULL",
					"storm_jib": "STOWED",
					"genoa": "PARTIAL",
					"code_zero": "STOWED",
					"wind_speed": 12.5,
					"barometer": 1013,
					"true_wind_direction": 320,
					"true_wind_angle": 35,
					"sea_state": "MODERATE",
					"weather": "PARTLY_CLOUDY",
					"house_battery_life": 87,
					"watermaker": "RUNNING",
					"temp_cabin": 72,
					"temp_tech_room": 78,
					"tack": "STARBOARD",
					"heel_angle": 15,
					"point_of_sail": "CLOSE_REACH",
					"water_starboard": 180,
					"water_port": 175,
					"narrative": "Smooth sailing conditions. Wind from NW at 12.5 knots. All systems nominal.",
					"created_datetime": "2026-01-15T08:30:00Z",
					"created_user": "captain@ship.example"
				}
			],
			"on_conflict": {
				"constraint": "log_entries_pkey",
				"action": "update",
				"update_columns": [
					"vessel_id", "title", "entry_datetime", "ship_time_zone", "position",
					"stw", "sog", "heading", "cog", "status", "overdrive", "rpm", "temp",
					"hours", "fuel", "mileage", "main_sail", "storm_jib", "genoa",
					"code_zero", "wind_speed", "barometer", "true_wind_direction",
					"true_wind_angle", "sea_state", "weather", "house_battery_life",
					"watermaker", "temp_cabin", "temp_tech_room", "tack", "heel_angle",
					"point_of_sail", "water_starboard", "water_port", "narrative",
					"created_datetime", "created_user"
				]
			}
		};
	}
}
