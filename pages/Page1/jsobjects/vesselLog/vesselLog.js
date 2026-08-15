export default {

  async get() {
    await authorization.refreshTokenIfNeeded();
    const data = await vessel_log.data;
		await storeValue("vessel_id", data.vessel_id);
		return data;
		
  }

}