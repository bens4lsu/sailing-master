export default {
	
	getDisplayItems: async () => {
		await authorization.refreshTokenIfNeeded();
		await qryDocuments.run();
		if (!qryDocuments.data) return [];
		const items = [];

		qryDocuments.data
			.sort((a, b) => a.order_num - b.order_num)
			.forEach(cat => {
				// Insert header item
				items.push({ isHeader: true, title: cat.description, id: `h_${cat.order_num}` });
				// Insert child document items
				cat.json_agg.forEach(doc => {
					items.push({ isHeader: false, ...doc });
				});
			});
	  await storeValue("documents", items);
		return items;
	},
	
	textValueForDisplayItem: (item) => {
		if (item.isHeader) {
			return item.title;
		}
		else {
			return `      <a href="${item.url}">${item.title}</a>`;
		}
	}
  
}