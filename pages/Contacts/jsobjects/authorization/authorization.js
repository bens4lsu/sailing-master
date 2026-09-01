export default {
  refreshTokenIfNeeded: async () => {
    const token = appsmith.store.bearerToken;
    const tokenTime = appsmith.store.bearerTokenTime;

    // Convert stored tokenTime string into a millisecond timestamp
    const tokenTimestamp = tokenTime ? new Date(tokenTime).getTime() : null;
    const now = Date.now();

    // Check if token doesn't exist, time isn't set, or time is now/past
    if (!token || !tokenTimestamp || tokenTimestamp <= now) {
      const response = await auth_token.run();

      // Get expiry duration from API (e.g., response.expires_in seconds), or fallback (e.g., 3600s / 1hr)
      const expiresInSeconds = response.expires_in || 3000;
      const expirationDate = new Date(now + expiresInSeconds * 1000).toISOString();

      await storeValue('bearerToken', response.access_token);
      await storeValue('bearerTokenTime', expirationDate);

      console.log('New token acquired:', appsmith.store);
      return response.access_token;
    }

    console.log('Using existing valid token');
    return token;
  }
}

	
