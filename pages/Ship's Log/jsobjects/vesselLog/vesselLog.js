export default {
  async logInit() {
    await authorization.refreshTokenIfNeeded();

    const userLookup = await qryUser.run();
    await storeValue("userData", userLookup?.[0] || null);

    const vesselLookup = await qryVessel.run();
    if (vesselLookup && vesselLookup.length > 1) {
      showAlert("Warning: > 1 vessel returned. Current functionality supports only one vessel.", "warning");
    }
    await storeValue("vessel", vesselLookup ? vesselLookup[0] : null);
    await storeValue("tableFilter", "all");
    return await this.getLogDataFromDB();
  },

  async getLogDataFromDB() {
    await authorization.refreshTokenIfNeeded();
    return await qryVesselLog.run();
  },

  getFilteredData() {
    const filter = appsmith.store.tableFilter || "all";
    const raw = qryVesselLog.data;
    const logData = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    let filteredData = [];

    if (filter === "all") {
      filteredData = logData;
    } else if (filter === "fuel") {
      filteredData = logData.filter(e =>
        e?.rpm != null || e?.engine_status != null || e?.overdrive != null || e?.fuel != null
      );
    } else if (filter === "water") {
      filteredData = logData.filter(e =>
        e?.watermaker != null || e?.water_port != null || e?.water_starboard != null
      );
    } else if (filter === "weather") {
      filteredData = logData.filter(e =>
        e?.barometer != null || e?.wind_speed != null || e?.true_wind_direction != null || e?.weather != null || e?.sea_state != null
      );
    } else if (filter === "narrative") {
      filteredData = logData.filter(e =>
        e?.narrative && typeof e.narrative === "string" && e.narrative.trim() !== ""
      );
    }

    return [...filteredData].sort((a, b) => {
      const dateA = a?.entry_datetime ? new Date(a.entry_datetime).getTime() : 0;
      const dateB = b?.entry_datetime ? new Date(b.entry_datetime).getTime() : 0;
      return dateB - dateA;
    });
  }
}