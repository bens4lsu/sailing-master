export default {
  formatDocsHtml: async () => {
		await authorization.refreshTokenIfNeeded();
		await qryDocuments.run();
		
		if (!qryDocuments.data) return '';

		const body = qryDocuments.data
			.sort((a, b) => a.order_num - b.order_num)
			.map(cat => `
				<h3>${cat.description}</h3>
				<ul>
					${cat.json_agg.map(d => `<li><a href="${d.url}" target="_blank">${d.title}</a></li>`).join('')}
				</ul>
			`).join('');

		await storeValue('docHtml', `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:10px;">${body}</body></html>`);
	}
}