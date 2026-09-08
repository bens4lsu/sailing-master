export default {
	tableInit: async () => {
		await authorization.refreshTokenIfNeeded();

		const components = await qryComponents.run();
		const filterComponents = [{ name: "", value: "" }, ...components];
		await storeValue("filter", components);
		
		const contacts = await qryContacts.run();
		await storeValue("maintContacts");

	},
	
	getFilteredData: async () => {
		await authorization.refreshTokenIfNeeded();
    const filter = appsmith.store.componentFilter || "all";
    const maintData = await qryMaintenance.data || [];
		const filterValue = appsmith.store.componentFilter;
    let filteredData = [];

    if (!filter || filter === "all") {
      filteredData = maintData;
    } else  {
      filteredData = maintData.filter(e => 
        (e.component_name === filterValue)
      );
    }
		return filteredData;
  },
/*
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
		await qryMaintenance.run();
		closeModal(modalContactEntry.name);
	}
	*/
}