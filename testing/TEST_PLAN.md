
# Caffiend – QA Test Plan
**Application:** Caffiend Caffeine Tracker  
**Version:** 1.0  
**Tester:** Eddie Nurce  
**Date:** April 11, 2026  
**Environment:** Production (Firebase Hosting + Firestore)

---

## 1. Objective

This document describes the test plan and results for the Caffiend web application. Testing was conducted to validate the correctness, security, and robustness of the application's data layer via REST API testing using Postman, and to identify defects in input validation and access control.

---

## 2. Scope

### In Scope
- Firestore REST API authentication and authorization
- User data read and write operations
- Cross-user data access controls
- Input validation behavior for drink entries
- Cleanup and data integrity after test execution

### Out of Scope
- UI/UX and frontend rendering
- Performance and load testing
- Mobile responsiveness

---

## 3. Test Environment

| Component | Details |
|---|---|
| Platform | Firebase Firestore (Production) |
| Auth Method | Firebase Authentication (email/password) |
| Testing Tool | Postman |
| Collection File | `caffiend_qa_suite.json` |
| Base URL | `https://firestore.googleapis.com/v1/projects/caffiend-c539d/databases/(default)/documents` |

---

## 4. Test Cases

### TC-01 — Unauthenticated Read (Security Rule Test)

| Field | Details |
|---|---|
| **Objective** | Verify that unauthenticated requests are rejected by Firestore security rules |
| **Method** | GET |
| **Endpoint** | `/users/{userId}/drinks` |
| **Auth** | None |
| **Expected Result** | 401 or 403 — request rejected |
| **Actual Result** | 403 PERMISSION_DENIED |
| **Status** | ✅ Pass |

---

### TC-02 — Authenticated Read

| Field | Details |
|---|---|
| **Objective** | Verify that authenticated users can read their own drink data |
| **Method** | GET |
| **Endpoint** | `/users/{userId}/drinks` |
| **Auth** | Bearer Token (Firebase ID Token) |
| **Expected Result** | 200 — returns documents array |
| **Actual Result** | 200 — drink documents returned correctly |
| **Status** | ✅ Pass |

---

### TC-03 — Add a Valid Drink Entry

| Field | Details |
|---|---|
| **Objective** | Verify that authenticated users can write a valid drink document to Firestore |
| **Method** | POST |
| **Endpoint** | `/users/{userId}/drinks` |
| **Auth** | Bearer Token |
| **Request Body** | `{ name: "Espresso", caffeine_mg: 63, timestamp: "2026-04-09T14:00:00Z" }` |
| **Expected Result** | 200 — document created with correct fields |
| **Actual Result** | 200 — document created, name and fields returned correctly |
| **Status** | ✅ Pass |

---

### TC-04 — Add Drink with Missing Required Field

| Field | Details |
|---|---|
| **Objective** | Verify system behavior when a drink entry is submitted without a required field (`caffeine_mg`) |
| **Method** | POST |
| **Endpoint** | `/users/{userId}/drinks` |
| **Auth** | Bearer Token |
| **Request Body** | `{ name: "Mystery Drink", timestamp: "2026-04-09T14:00:00Z" }` — `caffeine_mg` intentionally omitted |
| **Expected Result** | 400 — request rejected due to missing required field |
| **Actual Result** | 200 — incomplete document accepted and written to database |
| **Status** | ⚠️ Fail — Defect Found (see DEF-02) |

---

### TC-05 — Cross-User Data Access Attempt

| Field | Details |
|---|---|
| **Objective** | Verify that an authenticated user cannot read another user's drink data |
| **Method** | GET |
| **Endpoint** | `/users/{differentUserId}/drinks` |
| **Auth** | Bearer Token (original user's token) |
| **Expected Result** | 403 — access denied |
| **Actual Result** | 403 PERMISSION_DENIED |
| **Status** | ✅ Pass |

---

### TC-06 — Delete Test Document (Cleanup)

| Field | Details |
|---|---|
| **Objective** | Verify that authenticated users can delete their own documents and that test data is cleaned up |
| **Method** | DELETE |
| **Endpoint** | `/users/{userId}/drinks/{drinkId}` |
| **Auth** | Bearer Token |
| **Expected Result** | 200 — document deleted, empty response body |
| **Actual Result** | 200 — empty JSON `{}` returned, document confirmed deleted |
| **Status** | ✅ Pass |

---

## 5. Defect Log

### DEF-01 — Firestore Security Rules Did Not Cover Drink Subcollection

| Field | Details |
|---|---|
| **Severity** | High |
| **Discovered During** | TC-02 initial execution |
| **Description** | Firestore security rules were written to cover `/users/{userId}` but did not explicitly cover the `/users/{userId}/drinks/{drinkId}` subcollection. The catch-all `allow read, write: if false` rule was blocking all subcollection access, including from authenticated users. |
| **Impact** | Authenticated REST API requests to the drinks subcollection were incorrectly denied with a 403 error, preventing valid data access. |
| **Root Cause** | Incomplete security rule coverage — subcollections in Firestore must be explicitly matched and are not automatically covered by parent document rules. |
| **Fix Applied** | Updated Firestore security rules to explicitly include the drinks subcollection with the same `request.auth.uid == userId` condition. |
| **Status** | ✅ Resolved |

---
### DEF-02 — Missing Field Validation at Database Layer

| Field | Details |
|---|---|
| **Severity** | Medium |
| **Discovered During** | TC-04 |
| **Description** | Firestore accepts drink documents that are missing the `caffeine_mg` field, which is required for the application to calculate daily caffeine totals correctly. No schema validation exists at the database layer. |
| **Impact** | A document written without `caffeine_mg` could cause the application to display incorrect totals, render `NaN`, or produce unexpected UI behavior when the missing field is referenced. |
| **Root Cause** | Firebase Firestore is a schema-less NoSQL database and does not enforce field requirements natively. Input validation is currently handled client-side only, meaning it can be bypassed via direct API calls. |
| **Recommended Fix** | Add server-side validation using Firebase Cloud Functions to intercept writes and reject documents missing required fields before they are committed to the database. |
| **Status** | ⚠️ Open |

---

## 6. Test Summary

| Metric | Value |
|---|---|
| Total Test Cases | 6 |
| Passed | 5 |
| Failed | 1 |
| Defects Found | 2 |
| Defects Resolved | 1 |
| Defects Open | 1 |

---

## 7. Key Findings

- Firestore security rules correctly block unauthenticated and cross-user access when properly configured
- Subcollection security rules must be explicitly defined and are not inherited from parent document rules
- Input validation exists only at the client layer — malformed documents can be written directly to the database via REST API, bypassing all frontend checks
- Firebase ID tokens expire after one hour and must be refreshed for sustained API testing sessions

---

## 8. Recommendations

- Implement server-side field validation using Firebase Cloud Functions for all write operations
- Add Firestore security rule unit tests using the Firebase Emulator Suite to catch rule gaps before deployment
- Extend test coverage to include UI-level functional testing of the React frontend
- Automate token refresh in the Postman environment to support longer test sessions
