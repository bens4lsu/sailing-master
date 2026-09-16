export default {
	handleChangeQuantity: async (row, delta) => {
		authorization.refreshTokenIfNeeded();
		const payload = {
			id: row.id,
			vessel_id: appsmith.store.vessel.id,
			part: row.part,
			quantity: (row.quantity + delta),
			details: row.details
		};
		await storeValue("inventoryPayload", payload);
		await qryUpsertPart.run();
		await qryInventory.run();
	},
	
	
	handleNewClick: async () => {
		await storeValue('formDefaults', {
			id: crypto.randomUUID(),
			part: "",
			quantity: "",
			details: "",
		});
		showModal(modInvEdit.name);
	},
		
}