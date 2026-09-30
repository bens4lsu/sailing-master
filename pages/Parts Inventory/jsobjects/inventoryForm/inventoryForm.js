export default {
	isBusy: false,

	nullIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? null : str;
		}
		return str;
	},
	
	zeroIfBlank(str) {
		if (typeof str === "string") {
			return str.trim() === "" ? "0" : str;
		}
		return "0";
	},

	async handleEditClick(rowData) {
		if (this.isBusy) return;
		await storeValue('formDefaults', {
			id: rowData?.id || "ERROR",
			part: rowData?.part || "",
			quantity: rowData?.quantity || "",
			details: rowData?.details || ""
		});
		showModal(modInvEdit.name);
	},

	async upsertPayload() {
		const payload = {
			"id": inpId.text,
			"vessel_id": appsmith.store.vessel?.id,
			"part": this.nullIfBlank(inpPart.text),
			"quantity": this.zeroIfBlank(inpQty.text),
			"details": this.nullIfBlank(rteDescription.text)
		};
		await storeValue("inventoryPayload", payload);
	},

	async submitInvItem() {
		if (this.isBusy) return;
		this.isBusy = true;

		try {
			await authorization.refreshTokenIfNeeded();

			const payload = {
				id: inpId.text,
				vessel_id: appsmith.store.vessel?.id,
				part: this.nullIfBlank(inpPart.text),
				quantity: this.zeroIfBlank(inpQty.text),
				details: this.nullIfBlank(rteDescription.text)
			};

			await qryUpsertPart.run({ payload: payload });
			await qryInventory.run();
			await this.myCloseModal();
		} finally {
			this.isBusy = false;
		}
	},

		async submitDelete() {
			if (this.isBusy) return;
			this.isBusy = true;

			try {
				await authorization.refreshTokenIfNeeded(); 
				await storeValue('deletePayload', { id: inpId.text });
				await qryDeleteInventory.run();
				await qryInventory.run();
				await this.myCloseModal();
			} finally {
				this.isBusy = false;
			}
		},
	
	async myCloseModal() {
		closeModal(modInvEdit.name);
	}
};