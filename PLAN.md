# Feature: Migrate properties.id from text to native uuid

## Goal
properties.id is currently text, populated by the app via 
crypto.randomUUID() for new rows, but with 8 legacy production rows 
(p1–p8) that aren't UUID-shaped. Confirmed properties.id is purely an 
internal primary key — never used for Hostaway/QBO matching (those use 
hostaway_id/qbo_class), never exposed in a URL, never rendered, never 
exported. Migrating to native uuid is now low-risk, matching the pattern 
already used correctly by adjustments/manual_expenses/statements/users.
If not done: properties remains the one inconsistent table family in an 
otherwise uuid-standardized schema — a known but low-urgency 
inconsistency, not an active bug.

## Acceptance criteria
- [x] properties.id is native uuid type
- [x] All 5 referencing FK columns (policies.property_id, 
      adjustments.property_id, manual_expenses.property_id, 
      statements.property_id, user_property_access.property_id) are 
      also native uuid, matching properties.id
- [x] The 8 legacy p1–p8 rows are remapped to real UUIDs, with every 
      reference across all 6 tables updated atomically in one migration
- [x] No data loss, no orphaned references — verify referential 
      integrity before and after
- [x] App code that generates new property IDs (crypto.randomUUID() 
      stored as text) is updated/confirmed compatible with native uuid 
      columns
- [x] Confirmed zero external dependency on the literal old IDs 
      (hostaway_id/qbo_class matching unaffected — already verified, 
      re-confirm post-migration)

## Slices
- [x] Slice 1: Migration SQL, backup, and execution — complete, verified 
      (0 orphans, row counts match, live app smoke-tested)
- [x] Slice 2: schema.sql updated to uuid types, seed data regenerated 
      with real UUIDs — complete. Found unrelated pre-existing bug 
      (schema.sql not fresh-install-safe, policies.data column never 
      created) — reported directly to the human, out of scope, not 
      tracked in this repo
- [x] Slice 3: App code audit for type assumptions — complete. Found 2 
      weak Zod schemas (propertyIds arrays) and ~10 route handlers with 
      no UUID validation on the id param at all
- [x] Slice 4: Add z.string().uuid() validation across the gaps found in 
      Slice 3 — 2 array schemas, ~10 route param checks, test fixtures 
      updated to UUID-shaped values — complete, npm run check clean, 
      15/15 tests passing
- [x] Slice 5: Final verification pass — npm run check clean (0 errors), 
      npm run test 15/15 passing, no remaining p1-p8-style literal ids 
      anywhere in the repo, live migration execution confirmed by the 
      human (row counts, zero-orphan checks, real UUID output)

## Status notes
Complete. properties.id and all 5 referencing FK columns are native 
uuid in both the live database and schema.sql; the 8 legacy p1–p8 rows 
were remapped atomically with zero orphaned references; app code 
validates UUID format at every property_id/user_id trust boundary; 
hostaway_id/qbo_class matching remains unaffected throughout.