# Allowed game modes repair

October 23, 2026. Draft preview only, no production release or backend migration.

GameAccessGate wraps all seven game routes and checks allowedGameModes before mounting a game. Direct URLs and navigation links use the same check. Home, login and Parent Controls remain accessible. Dashboard cards remain visible.

Strict settings reads distinguish unavailable settings from a valid missing row. Errors block play with a retry screen. Empty mode lists deny every mode. Results are scoped to route and account identity. Settings refresh on focus and every 15 seconds; revocation during play can take up to the next refresh.

Validation: 24 automated tests and production compilation pass. In the signed-out preview, disabled Matching through Parent Controls and saved. Direct game entry showed 'This game is turned off', including after full reload. Reenabled Matching and saved; direct entry rendered the game. The guest fixture was restored. No backend rows or credentials changed during this check.

Remaining: signed-in browser verification, live mid-game revocation, individual browser coverage of the other six modes, difficulty ceilings, allowed days/hours, daily/session limits, educational-content filtering. Client restrictions do not establish server authorization. The existing local PIN and guest browser storage remain bypassable.
