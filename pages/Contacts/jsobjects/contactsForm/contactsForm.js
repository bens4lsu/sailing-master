export default {
  isBusy: false,

  nullIfBlank(str) {
    if (typeof str === "string") {
      return str.trim() === "" ? null : str;
    }
    return str;
  },

  handleEditClick: async function (rowData) {
    if (this.isBusy) return;
    await storeValue('formDefaults', {
      id: rowData?.id || "ERROR",
      name: rowData?.name || "",
      type: rowData?.contact_type || "",
      address: rowData?.address || "",
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

  handleNewClick: async function () {
    if (this.isBusy) return;
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
    return {
      "id": inpId.text,
      "vessel_id": appsmith.store.vessel?.id,
      "name": this.nullIfBlank(inpName.text),
      "address": this.nullIfBlank(inpAddress.text),
      "city": this.nullIfBlank(inpCity.text),
      "state": this.nullIfBlank(inpState.text),
      "zip": this.nullIfBlank(inpZip.text),
      "office_phone": this.nullIfBlank(inpPhone.text),
      "mobile_phone": this.nullIfBlank(inpMobile.text), // Note: previously inpPhone was assigned twice
      "latitude": this.nullIfBlank(inpLat.text),
      "longitude": this.nullIfBlank(inpLong.text),
      "contact_type_id": selType.selectedOptionValue,
      "notes": this.nullIfBlank(inpNotes.text),
      "email": this.nullIfBlank(inpEmail.text),
      "vhf": this.nullIfBlank(inpVhf.text)
    };
  },

  async submitContact() {
    if (this.isBusy) return;
    this.isBusy = true;

    try {
      await authorization.refreshTokenIfNeeded();
      const payload = this.upsertPayload();
      await qryUpsertContact.run({ payload: payload });
      await this.myCloseModal();
      await contacts.getContactDataFromDB();
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
      await qryDeleteContact.run();
      await this.myCloseModal();
      await contacts.getContactDataFromDB();
    } finally {
      this.isBusy = false;
    }
  },

  async myCloseModal() {
    closeModal(modalContactEntry.name);
  }
};