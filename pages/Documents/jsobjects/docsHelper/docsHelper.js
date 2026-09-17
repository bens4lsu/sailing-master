export default {
  formatDocs() {
    // Replace 'fetchVesselDocs.data' with your query's name
    const raw = qryDocuments.data || [];

    return raw
      .slice()
      .sort((a, b) => (a.order_num || 0) - (b.order_num || 0))
      .map(group => ({
        category: group.description,
        links: (group.json_agg || []).map(doc => ({
          id: doc.id,
          title: doc.title,
          url: doc.url,
          isPdf: /\.pdf($|\?)/i.test(doc.url || ''),
          isImage: /\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(doc.url || '')
        }))
      }));
  }
}