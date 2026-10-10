# Website accounts

**English** | [简体中文](accounts.md)

## Usage

On the Mac running the service, open `http://127.0.0.1:1235/setup` to create the first administrator. Usernames contain 3–32 letters, digits, underscores or hyphens and are normalized to lowercase. Passwords contain 12–128 characters. There are no default credentials. Remote devices cannot claim the initial administrator account.

After setup, unauthenticated devices see the sign-in page. Open **Account / Sign out** (`/account`) to change your password or sign out. Administrators can create users/administrators, reset passwords, disable/enable accounts, change roles and delete accounts. Deletion and permission changes require confirmation. The server prevents deleting, disabling or demoting the last enabled administrator. Deleting an account does not delete shared tasks.

Choose **中文 / English** at the top, including on sign-in and setup pages. This preference belongs to the browser; it does not change usernames or account permissions.

This is a shared studio. Signed-in users share access to images, videos and server-side chat tasks. Browser chat history remains in localStorage. There is no multi-tenant isolation, per-user task storage or billing. The existing local-only video restriction remains.

## Storage and protection

- `src/studio_auth.mjs` runs before business routes, including APIs and image/reference/video files. Unauthenticated pages redirect with 303; APIs and media return 401. Account assets, language assets and non-secret setup/sign-in status are public.
- Account file: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, default `app/.local/auth/users.json`; the dedicated deployment uses `runtime/auth/users.json`. Directory mode: 0700; file mode: 0600. Passwords use scrypt N32768/r8/p1, random salts and constant-time hash comparison. Writes are atomic and account changes serialized. A corrupt existing database prevents startup rather than reopening registration.
- Sessions use 32 random bytes; the server stores only the digest. Cookies are HttpOnly, SameSite=Strict, valid for 12 hours. Restarting requires signing in again. Password/role changes, resets, disabling and deletion revoke affected sessions. Signing out does not delete or rerun already-started tasks.
- Writes require same-origin Origin and JSON. X-Forwarded-For is not trusted. Each source IP gets at most 15 sign-in/setup/self-password-change attempts per 15 minutes. Limits: 4 concurrent password derivations and 100 accounts. Restarting clears attempt limits.
- The existing deployment uses HTTP over private Tailscale. Tailscale encrypts device-to-device transport; ordinary LAN HTTP itself does not. Public access and TLS are not configured by this package. Secure cookies are set only for native TLS requests. Do not expose it directly over public HTTP.
- Never upload the authentication database, sessions or passwords. Initialize new accounts when migrating. stdio MCP, local LM Studio and OS file permissions are outside website authentication.

## Validation

Run `node tests/studio_auth.mjs` with its temporary account database and no real models. It covers unauthenticated API/media blocking, initial setup origin restrictions, roles, password hashing/file modes, last-administrator protection, session revocation, persistence, corrupt-file rejection and rate limits.

The local_chat, chat_background, image_studio and video_web tests sign in with isolated test administrators; there is no production-authentication bypass. Real passwords are entered by the user and must not be saved in tests or documentation.
