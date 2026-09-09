export default {
  async tableInit() {
    await authorization.refreshTokenIfNeeded();

    let types = await qryContactTypes.run();
    types = (types || []).sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));

    const filterValues = types.map(e => ({ name: e.name, value: e.id }));
    const contactTypes = [{ name: "", value: "" }, ...filterValues];
    await storeValue("contactTypes", contactTypes);

    return await this.getContactDataFromDB();
  },

  async getContactDataFromDB() {
    await authorization.refreshTokenIfNeeded();
    return await qryContacts.run();
  },

  getFilteredData() {
		// If the query is actively loading or has no data yet, return an empty list immediately
		if (qryContacts.isLoading || !qryContacts.data) {
			return [];
		}
		
    const filter = appsmith.store.contactFilter || "all";
    const raw = qryContacts.data;
    const contactData = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    let filteredData = [];

    if (!filter || filter === "all") {
      filteredData = contactData;
    } else {
      filteredData = contactData.filter(e => e?.contact_type_id == filter);
    }

    return filteredData;
  }
}