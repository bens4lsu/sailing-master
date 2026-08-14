export default {

  async get() {
    await authorization.refreshTokenIfNeeded();
    return await vessel_log.data
  }

}