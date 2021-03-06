# Architecture

Per scope relation of directives:

![img](./images/arch/blocks.drawio.png)

Each block has defaults if not specified. And also a default logger with all default blocks for unspecified scopes.

Security directives have no scope. They are applied to all scopes. They get replaced if changed. Like if the Env changed. See below for exceptions.

# Security vs Priority

When asking where to look for configuration, what goes first and last, and which place is more secure, we consider the following:

| Order | Place          | Best Use Case    | Priority (Dynamic) | Security           |
| ----- | -------------- | ---------------- | ------------------ | ------------------ |
| (0)   | CLI Flags      | Security Enforce | Only on start      | Always, Adds       |
| (1)   | JS Read-Only   | Web Prod         | Only on start      | Always, Adds       |
| (2)   | JS Cookie      | Web (Dev)        | If found           | If found, Replaced |
| (3)   | Process ENV    | FaaS (Lambda)    | If found           | If found, Replaced |
| (4)   | File in `/tmp` | Dev / SSH / K8s  | If found, stop     | If found, Replaced |
| (5)   | HTTPS JSON     | K8s Prod         | If found, stop     | Always, Adds       |

## How to read the table?

Some examples:

- Because CLI always adds to security, given you use a security directive in a CLI flag, it will always apply, even if overwritten by a JS cookie or a local file in `tmp`
- Because HTTP JSON is checked after the JS cookie, If a definition for a scope exists both in the JS cookie and in HTTP JSON, the JS cookie will be replaced by the latter.
- Any CLI directive that has no security considerations, will be ignored by any other definitions found.

## Definitions and Considerations:

0. **CLI Flags** - The most "close to code" you can get. If you can change those, you already control the code. So it will be the last line of security defense. On the other hand, it is also very hard to change without redeploying, so it will be replaced by any other definition.

1. **JS Read-Only** - Using JS at the top of the HTML page, you can create a read-only object. Which is like the CLI params in other env. This will make sure no 3rd party code can override any security definitions.

Example code for setting a read-only `window.XYZ`:

```js
Object.defineProperty(window, "XYZ", {
  enumarable: false,
  configurable: false,
  get: () => "<DEFENTITION HERE>",
  set: (x) => console.log("XWLoggerSecurity Already defined!"),
});
```

2. **JS Cookie** - In a web browser, you can update definitions using the cookie, either from a server with the `Set-Cookie` header or inside the page with JS code.

3. **Process ENV** - The logger will also look for updated definitions in the Env. Env is sometimes as static as CLI params and needs a redeploy to change, but sometimes not, like in FaaS. In AWS, changing Env of a Lambda is 2 click process, and could use this to update. We don't apply this always security-wise as it is more prone to variations in deployment and maybe a big DevOps burden. Use CLI or JS Read-Only for security purposes.

4. **File in `/tmp`** - Mostly for scenarios of a running process without the ability to change the CLI params and the Env. Like running docker containers, K8s pods and VM processes. It will override scopes in the HTTPS JSON since we guess you have more priority. As the HTTPS JSON is intended to be more prod oriented, and apply to a lot of processes at once.

5. **HTTPS JSON** A JSON HTTPS URL with the definitions. Can be a static file or generated based on request. It will always add to the security because we see it as the way DevOps control large deployments. But it will be overridden by local definitions to allow debugging in specific cases.
