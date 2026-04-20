# Bugs Report

This document lists discrepancies found between the expected API behavior (based on specification) and the actual behavior observed during testing.

---

## BUG-01: Invalid email is format accepted

- **Endpoint:** POST /dev/users
- **Environment:** DEV / PROD
- **Test:** [POST-05] - Should fail with invalid email
- **Expected:** API should return 400 Bad Request
- **Actual:** API returns 201 Created and creates the user

---

## BUG-02: Non-existing user returns 500 instead of 404

- **Endpoint:** GET /dev/users/{email}
- **Environment:** DEV / PROD
- **Test:**[GET-03] - {email} Should return 404 if user does not exist
- **Expected:** 404 Not Found
- **Actual:** 500 Internal Server Error


---

## BUG-03: Duplicate email returns 500 instead of 409

- **Endpoint:** POST /dev/users
- **Environment:** DEV / PROD
- **Expected:** 409 Conflict
- **Actual:** 500 Internal Server Error
- **Test:** [POST-06] - Should return 409 when email already exists

---

## BUG-04: Without auth returns 404 instead of 401 - (DEV only)

- **Endpoint:** DELETE /dev/users/{email}
- **Environment:** DEV
- **Test:** [DELETE-01] {email} - Should return 401 when auth header is missing
- **Expected:** 401 Unauthorized
- **Actual:** 404 Not Found
