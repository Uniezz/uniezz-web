# PostHog analytics

The web app uses the installed PostHog browser SDK for click, change, and submit
autocapture, SPA pageviews (`history_change`), page leaves, page duration, and scroll
depth. There is no custom scroll listener or duplicate pageview hook.

## Landing-page behavior

`landing_sign_in_clicked` has a `cta` property:

- `landing-sign-in-header`
- `landing-sign-in-hero`
- `landing-sign-in-join`

Named handlers on each link record primary and middle clicks, including clicks on
nested icons. The shared button forwards `onClick` and `onAuxClick` to its link.

The SDK includes these properties on the next `$pageview` or `$pageleave` event:

- `$prev_pageview_pathname`: the page being measured.
- `$prev_pageview_max_scroll_percentage`: furthest scroll position, from 0 to 1.
- `$prev_pageview_max_content_percentage`: furthest content visible in the viewport.
- `$prev_pageview_duration`: seconds on that page.

For the landing page, filter **previous page pathname = `/`**, then use maximum
scroll percentage (multiply by 100 for display). This works for both navigating to
sign-in and leaving the site. The properties describe the previous page, not
necessarily the event's current URL. The SDK's pageview IDs correlate each visit.

## Sign-in funnel and drop-off

Build a sequential funnel in PostHog:

1. `$pageview`, `$pathname = /`.
2. `landing_sign_in_clicked`, break down by `cta`.
3. `$pageview`, `$pathname = /login`.
4. `sign_in_started`, break down by `method` (`OTP` or `USOS`) and `university`.
5. `sign_in_succeeded`, within your chosen conversion window (start with 30 minutes).

For direct sign-in visitors, start the funnel at `/login` instead of `/`.
OTP also records `sign_in_step_viewed` with `step = email` or `code`,
`sign_in_back_clicked`, `otp_request_*`, and `otp_verify_*`.
`sign_in_failed` contains a method and a safe step/stage, never backend error text.
USOS records `sign_in_redirected` and exchange outcomes. An external USOS redirect
is an expected part of authentication, not proof of abandonment.

Use funnel drop-off to find people who visited sign-in but did not complete it.
Use `$pageleave` and previous-page duration for exit behavior. Do not treat hiding
a tab, closing a tab, or leaving a page as a definitive failed sign-in: users can
return or finish in another tab. Browser shutdowns, blockers, or network failures
can prevent delivery of exit events, so drop-off is an inferred metric.

## Other app actions

The shared mutation cache emits `<action>_attempted`, `<action>_succeeded`, and
`<action>_failed`. Every existing mutation supplies `meta.analyticsAction`; new
mutations should do the same. Success means the mutation operation resolved,
before its screen callback. Automatic retries share a single action attempt.

Actions include OTP requests/verification, post publishing/creation/editing/deletion,
likes, comment creation/editing/deletion, reports, programme saves/deletion,
profile updates, avatar deletion, image uploads, and sign-out. `post_publish`
covers the whole upload-and-create operation; `post_create` covers its API write.
Upload batches retain partial results for retries; their `failed` result is
explicitly counted as failure.

Rejected React Hook Form submissions emit `<form>_validation_failed`. Local-only
chat messages, group creation, and study material details emit outcomes with
`storage = local`; these do not indicate backend delivery or persistence.

## Privacy and verification

DOM text and element attributes are masked; clicks carry a readable `label` property from
`data-ph-capture-attribute-label` (fixed descriptions on elements that show user content). Request/response bodies, form values,
error messages, and files are not included in custom events. URL query strings and
fragments are stripped, including nested initial/referrer attribution, and post
and profile IDs are replaced with route placeholders. Session replay is disabled.
Events use anonymous PostHog identities; successful sign-out resets the identity.
The existing PostHog environment variables remain required.

Verification: `bun test`, `bun run check`, and `bun run build`.
For live verification, use PostHog's live events view: scroll halfway down `/`, click
each CTA, navigate back, request an OTP, try an invalid code, and complete login.
Confirm the previous-page scroll metrics and the named events above. Live delivery
has not been verified as part of the source checks.
