import * as Sentry from "@sentry/react";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
    dataCollection: {
      userInfo: false,
      cookies: false,
    },
    sampleRate: 1.0, // How many errors to send to Sentry, 1.0 equals to 100%
  });
} else {
  console.warn("Sentry DSN is not set. Sentry will not be initialized.");
}
