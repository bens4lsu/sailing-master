export default {
	isUpdating: false,

	async handleChangeQuantity(row, delta) {
		if (this.isUpdating) return;
		this.isUpdating = true;

		try {
			await authorization.refreshTokenIfNeeded();

			const currentQty = Number(row?.quantity) || 0;
			const payload = {
				id: row.id,
				vessel_id: appsmith.store.vessel?.id,
				part: row.part,
				quantity: currentQty + delta,
				details: row.details
			};

			await qryUpsertPart.run({ payload: payload });
			await qryInventory.run();
		} finally {
			this.isUpdating = false;
		}
	},

	handleNewClick: async () => {
		await storeValue('formDefaults', {
			id: crypto.randomUUID(),
			part: "",
			quantity: "",
			details: "",
		});
		showModal(modInvEdit.name);
	}
}