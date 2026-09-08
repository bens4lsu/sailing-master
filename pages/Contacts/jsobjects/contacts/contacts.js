export default {
	tableInit: async () => {
		await authorization.refreshTokenIfNeeded();

		let types = await qryContactTypes.run();
		types = (types || []).sort((a, b) => a.name.localeCompare(b.name));

		const filterValues = types.map(e => ({ name: e.name, value: e.id }));
		const contactTypes = [{ name: "", value: "" }, ...filterValues];
		await storeValue("contactTypes", contactTypes);
		
		return await this.getDataFromDB();
		
	},
	
	filterValues: async () => {
	  const types = await appsmith.store.contactTypes;
		return types.filter(e => (e.value !== ""));
	},

	contactTypeObject() {
		// contactTypes is already formatted in tableInit
		return appsmith.store.contactTypes || [{ name: "", value: "" }];
	},

	nullIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? null : str;
		} else {
			return str;
		}
	},

	handleEditClick: async (rowData) => {
		console.log(rowData);
		await storeValue('formDefaults', {
			id: rowData?.id || "ERROR",
			name: rowData?.name || "",
			type: rowData?.contact_type || "",
			address: rowData?.address || "sdaffs",
			city: rowData?.city || "",
			state: rowData?.state || "",
			zip: rowData?.zip || "",
			office_phone: rowData?.office_phone || "",
			mobile_phone: rowData?.mobile_phone || "",
			email: rowData?.email || "",
			latitude: rowData?.latitude || "",
			longitude: rowData?.longitude || "",
			vhf: rowData?.vhf || "",
			notes: rowData?.notes || "",
			contact_type: rowData?.contact_type_id || ""
		});
		showModal(modalContactEntry.name);
	},

	handleNewClick: async () => {
		await storeValue('formDefaults', {
			id: crypto.randomUUID(),
			name: "",
			type: "",
			address: "",
			city: "",
			state: "",
			zip: "",
			office_phone: "",
			mobile_phone: "",
			email: "",
			latitude: "",
			longitude: "",
			vhf: "",
			notes: "",
			contact_type: ""
		});
		showModal(modalContactEntry.name);
	},

	upsertPayload() {
		const payload =  {
			"id": inpId.text,
			"vessel_id": appsmith.store.vessel.id,
			"name": this.nullIfBlank(inpName.text),
			"address": this.nullIfBlank(inpAddress.text),
			"city": this.nullIfBlank(inpCity.text),
			"state": this.nullIfBlank(inpState.text),
			"zip": this.nullIfBlank(inpZip.text),
			"office_phone": this.nullIfBlank(inpPhone.text),
			"mobile_phone": this.nullIfBlank(inpPhone.text),
			"latitude": this.nullIfBlank(inpLat.text),
			"longitude": this.nullIfBlank(inpLong.text),
			"contact_type_id": selType.selectedOptionValue,
			"notes": this.nullIfBlank(inpNotes.text),
			"email": this.nullIfBlank(inpEmail.text),
			"vhf": this.nullIfBlank(inpVhf.text)
		};
		return payload;
	},

	async submitContact() {
		await authorization.refreshTokenIfNeeded();
		await qryUpsertContact.run();
		await qryContacts.run();
		closeModal(modalContactEntry.name);
	},
	
	async getLogDataFromDB: async () => {
    await authorization.refreshTokenIfNeeded(); 
    const qry = await qryContacts.data.run();
    await storeValue("contData", qry);
    return this.getFilteredData();
  }, 
	
	getFilteredData: () => {
    const filter = appsmith.store.contactFilter || "all";
    const contactData = appsmith.store.contData;
    let filteredData = [];

    if (!filter || filter === "all") {
      filteredData = contactData;
    } else  {
      filteredData = contactData.filter(e => 
        (e.contact_type_id == filter)
      );
    }
		return filteredData;
  },
	
	
}