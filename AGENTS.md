# AGENTS.md — Codex / AI Agent Guidelines

This file provides instructions for AI agents (Codex, Claude, Copilot, etc.)
working in this repository.

## Project summary

Django 4.1.7 newsfeed application with two apps (`accounts`, `news_app`),
multi-language support (EN/UZ/RU via django-modeltranslation), WhiteNoise
static serving, and SQLite database.

## Hard rules — do not violate

- **Do not change database schema or migrations** unless explicitly asked.
- **Do not change route names or URL patterns** — templates and reverse() calls depend on them.
- **Do not change model field names or types** — would require a migration.
- **Do not change API contracts** — form fields, view return types, context variable names used in templates.
- **Do not remove or rename context variables** passed to templates without updating every template that uses them.
- **Do not force push** to `main` or `master`.
- **Do not commit** `db.sqlite3`, `staticfiles/`, `media/`, `venv/`, or `__pycache__/` — all excluded by `.gitignore`.

## Preferred approach

- Prefer small, targeted, low-risk changes.
- Fix one clear issue at a time.
- Keep all existing functionality intact.
- Use SonarQube output as the source of truth for code quality fixes once available.
- When fixing an import or variable name, verify the change does not break templates or other modules.
- When in doubt, explain rather than change.

## SonarQube

- `sonar-project.properties` is configured at the repo root.
- CI runs via `.github/workflows/sonarqube.yml` on push/PR to `main`.
- Requires `SONAR_TOKEN` and `SONAR_HOST_URL` as GitHub repository secrets.
- Coverage reporting is disabled until tests are written.

## Testing

- `accounts/tests.py` and `news_app/tests.py` exist as stubs.
- No tests are written yet; do not delete the stubs.
- Do not generate fake tests that always pass.

## Commit style

- Use present-tense imperative subject lines (`Add`, `Fix`, `Remove`).
- Keep subject under 72 characters.
- Add a body paragraph explaining *why* for non-obvious changes.
