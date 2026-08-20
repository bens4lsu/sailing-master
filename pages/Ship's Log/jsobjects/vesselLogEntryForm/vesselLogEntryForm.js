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
			engine_status: rowData.engine_status || "",
			"stw": rowData.stw || "",
			"sog": rowData.sog || "",
			"heading": rowData.heading || "",
			"cog": rowData.cog || "",
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
	
	upsertPayload: () => {
	  const dt = this.getDeviceFormattedDate();
		const user = appsmith.store.userData.name;
		const payload = {
			"id": inpId.text,
			"vessel_id": appsmith.store.vessel.id,
			"title": inpTitle.text,
			"entry_datetime": inpTime.text,
			"latitude": this.nullIfBlank(inpLat.text),
			"longitude" : this.nullIfBlank(inpLong.text),
			"stw": this.nullIfBlank(inpSTW.text),
			"sog": this.nullIfBlank(inpSOG.text),
			"heading": this.nullIfBlank(inpHeading.text),
			"cog": this.nullIfBlank(inpCOG.text),
			"engine_status": this.nullIfBlank(selEngine.selectedOptionValue),
			"overdrive": this.nullIfBlank(selOverdrive.selectedOptionValue),
			"rpm": this.nullIfBlank(inpRPM.text),
			"temp": this.nullIfBlank(inpTemp.text),
			"hours": this.nullIfBlank(inpEngHours.text),
			"fuel": this.nullIfBlank(inpFuel.text),
			"mileage": this.nullIfBlank(inpMileage.text),
			"main_sail": this.nullIfBlank(selMain.selectedOptionValue),
			"storm_jib": this.nullIfBlank(selStormJib.selectedOptionValue),
			"genoa": this.nullIfBlank(selGenoa.selectedOptionValue),
			"code_zero": this.nullIfBlank(selCodeZero.selectedOptionValue),
			"wind_speed": this.nullIfBlank(inpWindSpd.text),
			"barometer": this.nullIfBlank(inpBarometer.text),
			"true_wind_direction": this.nullIfBlank(inpTWD.text),
			"true_wind_angle": this.nullIfBlank(inpTWA.text),
			"sea_state": this.nullIfBlank(selSeaState.selectedOptionValue),
			"weather": this.nullIfBlank(selWeather.selectedOptionValue),
			"house_battery_life": this.nullIfBlank(inpBatt.text),
			"watermaker": this.nullIfBlank(selWatermaker.selectedOptionValue),
			"temp_cabin": this.nullIfBlank(inpTempCabin.text),
			"temp_tech_room": this.nullIfBlank(inpTempTech.text),
			"tack": this.nullIfBlank(selTack.selectedOptionValue),
			"heel_angle": this.nullIfBlank(inpHeelAngle.text),
			"point_of_sail": this.nullIfBlank(selPOS.selectedOptionValue),
			"water_starboard": this.nullIfBlank(inpStbdWater.text),
			"water_port": this.nullIfBlank(inpWaterPort.text),
			"narrative": this.nullIfBlank(inpNotes.text),
			"created_datetime": dt,
			"created_user": user,
			"modified_datetime": dt,
			"modified_user": user
		};
		return payload;
	},
	
	nullIfBlank: (str) => {
    if (typeof str === "string") {
        return str.trim() === "" ? null : str;
    } else {
        return null;
    }
	},
	
	submitLogUpdate: async () => {
		await authorization.refreshTokenIfNeeded(); 
		await qryUpsertLogEntry.run();
		await vesselLog.getLogDataFromDB();
		closeModal('logEntryModal');
	},
	
	submitLogDelete: async () => {
		await authorization.refreshTokenIfNeeded(); 
		await qryDeleteLogEntry.run();
		await vesselLog.getLogDataFromDB();
		closeModal('logEntryModal');
	}
}
