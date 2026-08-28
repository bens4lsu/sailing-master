export default {
  async tableInit() {
    await authorization.refreshTokenIfNeeded();
    
		var types = await qryContactTypes.run();
		types = types.sort((a, b) => a.name.localeCompare(b.name));
		const contactTypes = types.map(e => ({name: e.name, code: e.id}));
		await storeValue("contactTypes", contactTypes);
		
    const contacts = await qryContacts.run();
    return contacts;
  },
}