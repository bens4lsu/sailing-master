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
					"cog": inpCOG.text,
					"status": selEngine.selectedOptionValue,
					"overdrive": selOverdrive.selectedOptionValue,
					"rpm": inpRPM.text,
					"temp": inpTemp.text,
					"hours": inpEngHours.text,
					"fuel": inpFuel.text,
					"mileage": inpMileage.text,
					"main_sail": selMain.selectedOptionValue,
					"storm_jib": selStormJib.selectedOptionValue,
					"genoa": selGenoa.selectedOptionValue,
					"code_zero": selCodeZero.selectedOptionValue,
					"wind_speed": inpWindSpd.text,
					"barometer": inpBarometer.text,
					"true_wind_direction": inpTWD.text,
					"true_wind_angle": inpTWA.text,
					"sea_state": selSeaState.selectedOptionValue,
					"weather": selWeather.selectedOptionValue,
					"house_battery_life": inpBatt.text,
					"watermaker": selWatermaker.selectedOptionValue,
					"temp_cabin": inpTempCabin.text,
					"temp_tech_room": inpTempTech.text,
					"tack": selTack.selectedOptionValue,
					"heel_angle": inpHeelAngle.text,
					"point_of_sail": selPOS.selectedOptionValue,
					"water_starboard": inpStbdWater.text,
					"water_port": inpWaterPort.text,
					"narrative": inpNotes.text,
					"created_datetime": "",
					"created_user": ""
				}
			],
			"on_conflict": {
				"constraint": "log_entries_pkey",
				"action": "update",
				"update_columns": [
					"vessel_id", "title", "entry_datetime", "latitude", "longitude",
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
