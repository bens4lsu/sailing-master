export default {
  refreshPromise: null,

  refreshTokenIfNeeded: async function () {
    // If a refresh is already running, wait for it
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    const token = appsmith.store.bearerToken;
    const tokenTime = appsmith.store.bearerTokenTime;
    const tokenTimestamp = tokenTime ? new Date(tokenTime).getTime() : null;
    const now = Date.now();

    // Check if token doesn't exist or is expired/nearing expiration (add 30s buffer)
    if (!token || !tokenTimestamp || tokenTimestamp <= (now + 30000)) {
      this.refreshPromise = (async () => {
        try {
          const response = await auth_token.run();
          const expiresInSeconds = response.expires_in || 3000;
          const expirationDate = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

          await storeValue('bearerToken', response.access_token);
          await storeValue('bearerTokenTime', expirationDate);

          return response.access_token;
        } finally {
          this.refreshPromise = null;
        }
      })();

      return await this.refreshPromise;
    }

    return token;
  }
};