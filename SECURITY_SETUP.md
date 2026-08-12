# Local and deployment configuration

No server-side API key should be committed to this repository.

## Firebase Functions secrets

After revoking the previously exposed credentials, set the replacement values
with the Firebase CLI:

```sh
firebase functions:secrets:set SENDGRID_API_KEY
firebase functions:secrets:set GOOGLE_MAPS_API_KEY
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set OPENWEATHER_API_KEY
firebase deploy --only functions
```

The Google Maps key used by these server functions should be restricted to the
Places and Directions APIs required by the application.

## Browser configuration

Copy `.env.example` to `.env.local` and provide:

- a Firebase Web API key restricted to Firebase APIs; and
- a separate Google Maps browser key restricted by HTTP referrer and to the
  Maps JavaScript API.

Values beginning with `VUE_APP_` are included in the browser bundle. They must
therefore be treated as public and protected with provider-side restrictions.

Before deploying the HTTP functions, also add authentication, Firebase App
Check, request validation, and rate limiting as appropriate. Moving a key to a
backend prevents disclosure, but does not by itself prevent abuse of a public
endpoint.
