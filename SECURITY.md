# Security Policy

The security of Velorate is important.

If you discover a security vulnerability, please report it responsibly instead of creating a public GitHub issue.

---

# Supported Versions

The latest stable release of Velorate receives security updates.

| Version | Supported |
|---------|:---------:|
| Latest Release | ✅ |
| Older Releases | ❌ |

---

# Reporting a Vulnerability

If you believe you have found a security issue, please contact the project maintainer privately.

When reporting a vulnerability, include as much relevant information as possible, including:

- A description of the issue
- Steps to reproduce
- Potential impact
- Proof of concept (if applicable)
- Suggested mitigation (optional)

Please avoid publicly disclosing security vulnerabilities until they have been reviewed and addressed.

---

# What to Expect

After a report is received, the project maintainer will:

- Review the report.
- Confirm whether the issue is reproducible.
- Assess its impact.
- Develop and test a fix if necessary.
- Publish the fix in a future release.

The response time may vary depending on the complexity and severity of the issue.

---

# Responsible Disclosure

Please help protect users by following responsible disclosure practices.

Until a fix is available:

- Do not publish exploit details.
- Do not open a public GitHub issue.
- Do not disclose proof-of-concept code publicly.

This allows time to investigate and resolve the issue before it becomes widely known.

---

# Scope

This policy applies to:

- @velorate/core
- @velorate/express
- @velorate/fastify
- @velorate/koa
- @velorate/hono
- @velorate/nestjs

Security reports related to any official Velorate package are covered by this policy.

---

# Third-Party Dependencies

Velorate depends on third-party libraries.

If a vulnerability originates from an external dependency, it may need to be resolved by updating that dependency before a new Velorate release is published.

---

# Security Best Practices

When using Velorate in production:

- Prefer RedisStore over MemoryStore in distributed deployments.
- Keep dependencies up to date.
- Use supported Node.js versions.
- Keep Redis instances secured and authenticated.
- Validate application-specific authentication and authorization separately from rate limiting.

---

# Acknowledgements

Responsible security reports help improve Velorate for everyone.

Thank you to everyone who helps identify and report security issues responsibly.