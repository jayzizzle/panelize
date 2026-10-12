# Security policy

## Supported versions

Panelize is `0.x`. Only the latest published version receives fixes.

## Reporting a vulnerability

Please **do not** open a public issue. Use GitHub private vulnerability reporting: [Report a vulnerability](https://github.com/jayzizzle/panelize/security/advisories/new).

Include the affected version, a description, and steps or code to reproduce. You can expect an acknowledgement within a week and a fix or a plan within a month.

## Scope

Panelize is a client-side React UI library with no runtime dependencies (React, React DOM, and styled-components are peers). The `css` prop and `style` accept strings from the host and are applied as written; do not pass untrusted input to them.
