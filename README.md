# Roadline

Static Roadline website with Roadline CV 2.0 in `cv/`.

## CV 2.0 development

- Open `cv/index.html` through a local HTTP server.
- The versioned profile is stored under `roadline_cv_profile_v2` in localStorage.
- Legacy `roadline_cv_answers_v1` drafts and v1/v2 profile URLs are migrated through `cv/cv-model.js`.
- Run all model, privacy, locale and print-contract tests with `node --test tests/*.test.js`.

The public preview is produced by an explicit allowlist. It excludes private identity, contacts, employers, exact availability dates and document details. The preview URL is an encoded static snapshot, not encryption or revocable publication.
