export default {

	nullIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? null : str;
		} else {
			return str;
		}
	},
	
	handleNewClick: async () => {
		await storeValue('formDefaults', {
			id: crypto.randomUUID(),
			name: "",
			date: "",
			contact_id: "",
			notes: "",
			components: []
		});
		showModal(modalMaintEntry.name);
	},
	
	handleEditClick: async (rowData) => {
		await storeValue('formDefaults', {
			id: rowData.id || "ERROR",
			name: rowData.name || "",
			date: rowData.date || "",
			contact_id: rowData.contact_id || "",
			notes: rowData.notes || "",
			components: rowData.component_id_list || ""
		});
		showModal(modalMaintEntry.name);
	},
	
	upsertPayloadMain: () => {
		return  {
			"id": inpId.text,
			"vessel_id": appsmith.store.vessel.id,
			"name": inpName.text,
			"date": inpDate.formattedDate,
			"contact_id": this.nullIfBlank(selSvcBy.selectedOptionValue),
			"notes": this.nullIfBlank(inpNotes.text)
		};
	},
	
	upsertPayloadComponents: () => {
		return mselComponents.selectedOptionValues.map(e => ({
			id: crypto.randomUUID(),
			maintenance_entry_id: inpId.text,
			component_id: e
		}));
	},

	submitMaint: async () => {
		await authorization.refreshTokenIfNeeded();
		await qryUpsertEntry.run();
		await qryDeleteEntryComponents.run();
		await qryInsertEntryComponents.run();
		await qryMaintenance.run();
		closeModal(modalMaintEntry.name);
	}
	
}