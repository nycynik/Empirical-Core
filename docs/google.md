## Google Refresh

Previously, Google authenticated exclusively by going through `get "/google_oauth2/callback" => 'google#google'`. This route mandated page redirects to Google's OAuth and as such was useless for purely server side authentication.

On the `feat/google-refresh-token` branch, we've created a service `RefreshAccessToken`, which can get a new auth token from the Google servers, assuming that a user has a valid refresh token on their `auth_credential.refresh_token`.

The big TODO's here are:

1. Start logging expiration dates in `auth_credential.expires_at` when a user gets a refresh token in the Google Controller.
2. Only call the refresh_access_token if
  - a) the expiration date is passed
  - b) the authentication fails
3. Make an error handler that upon a Google client returning an 'UNAUTHENTICATED' error, will call the refresher, and if that fails, render an error to the user.

## Posting Announcements Back To Google

There is a service, GoogleIntegration:Announcements, which posts announcements back to Google. Currently this only works for lessons, but it is extremely close to working for units.

It works for lessons by being triggered in `ClassroomActivityController#launch_lesson`, and should be fairly obvious from there.

The other place it should be triggered, (the code is mostly built out for this), is in app/services/units/creator.rb #self.create_helper.

For each google classroom in the iterator of this method, we should post back the unit name once, with the assigned student ids array, or if `assign_on_join == true` simply let it be assigned to all students. It will use almost entirely the same code that is currently in announcements, except it will need to take the unit name as a param, and the text string should be that unit name with a link to the user's profile. Ultimately, an easy improvement would be to have the link direct to an anchor link for the unit in question.
