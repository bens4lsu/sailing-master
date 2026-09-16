export default {
	tableInit: async () => {
		await authorization.refreshTokenIfNeeded();

		let componentList = await qryComponents.run();
		componentList = [{ name: "All", value: "" }, ...componentList];
		await storeValue("componentList", componentList);
		
		const contacts = await qryContacts.run();
		
		await qryMaintenance.run();
	  return appsmith.store.maintContacts;
	},
	
	getFilteredData: () => {
    const filter = selFilter.selectedOptionValue || "all";
		console.log(filter);
		let filteredData = [];
		
		if (!filter || filter === "" || filter === "all") {
			filteredData = qryMaintenance.data;
		} else  {
			filteredData = qryMaintenance.data.filter(e => 
																								(e.component_id === filter)
																							 );
		}

		return filteredData;
  },

}