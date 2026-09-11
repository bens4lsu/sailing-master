export default {
	tableInit: async () => {
		await authorization.refreshTokenIfNeeded();

		const components = await qryComponents.run();
		const filterComponents = [{ name: "", value: "" }, ...components];
		await storeValue("filter", components);
		
		const contacts = await qryContacts.run();
		
		await qryMaintenance.run();
	  return appsmith.store.maintContacts;
	},
	
	getFilteredData: () => {
    const filter = appsmith.store.componentFilter || "all";
    const maintData = qryMaintenance.data || [];
		const filterValue = appsmith.store.componentFilter;
    let filteredData = [];

    if (!filter || filter === "" || filter === "all") {
      filteredData = qryMaintenance.data;
    } else  {
      filteredData = qryMaintenance.data.filter(e => 
        (e.component_name === filterValue)
      );
    }
		return filteredData;
  },

}