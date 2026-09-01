export default {
	async tableInit() {
		await authorization.refreshTokenIfNeeded();

		let types = await qryContactTypes.run();
		types = (types || []).sort((a, b) => a.name.localeCompare(b.name));

		const contactTypes = [{ name: "", value: "" }, ...types.map(e => ({ name: e.name, value: e.id }))];
		await storeValue("contactTypes", contactTypes);

		const contacts = await qryContacts.run();
		return contacts;
	},

	contactTypeObject: () => {
		const list = appsmith.store.contactTypes || [];
		const mapped = list.map(e => ({ name: e.name, value: e.id }));

		return [{ name: "", value: "" }, ...mapped];
	},

	handleEditClick: async (rowData) => {
		await storeValue('formDefaults', {
			id: crypto.randomUUID(), 
			name: "",
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
			notes: ""
		}); 
		showModal(modalContactEntry.name);
	},

	handleNewClick: async (rowData) => {
		await storeValue('formDefaults', {
			id: rowData.id || "ERROR", 
			name: rowData.name || "",
			type: rowData.contact_type || ""
			address: rowData.address || "",
			city: rowData.city || "",
			state: rowData.state || "",
			zip: rowData.zip || "",
			office_phone: rowData.office_phone || "",
			mobile_phone: rowData.mobile_phone || "",
			email: rowData.email || "",
			latitude: rowData.latitude || "",
			longitude: rowData.longitude || "",
			vhf: rowData.vhf || "",
			notes: rowData.notes || ""
		}); 
		showModal(modalContactEntry.name);
	},
}