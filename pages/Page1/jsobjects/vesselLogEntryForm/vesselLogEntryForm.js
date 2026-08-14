export default {

  async openLogForm(rowId) {
    await storeValue('selectedLogId', rowId);
    showModal('logEntryModal');
  },

  
}