export default {
	nullIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? null : str;
		} else {
			return str;
		}
	},
	
	zeroIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? "0" : str;
		} else {
			return "0";
		}
	},

	handleEditClick: async (rowData) => {
		await storeValue('formDefaults', {
			id: rowData?.id || "ERROR",
			part: rowData?.part || "",
			quantity: rowData?.quantity || "",
			details: rowData?.details || ""
		});
		showModal(modInvEdit.name);
	},


	upsertPayload: async () => {
		const payload =  {
			"id": inpId.text,
			"vessel_id": appsmith.store.vessel.id,
			"part": this.nullIfBlank(inpPart.text),
			"quantity": this.zeroIfBlank(inpQty.text),
			"details": this.nullIfBlank(rteDescription.text)
		};
		await storeValue("inventoryPayload", payload);
		
		
	},

	async submitInvItem() {
		await authorization.refreshTokenIfNeeded();
		await this.upsertPayload(); // async so that it works with the same call in inventory.js
		await qryUpsertPart.run();
		await qryInventory.run();
		this.myCloseModal();
	},
	
	async submitDelete() {
		await authorization.refreshTokenIfNeeded(); 
	  await storeValue('deletePayload', {id: inpId.text});
		await qryDeleteInventory.run();
		await qryInventory.run();
		this.myCloseModal();
	},
	
	async myCloseModal() {
		await new Promise(resolve => setTimeout(resolve, 100)); 
		closeModal(modInvEdit.name);
	}
}