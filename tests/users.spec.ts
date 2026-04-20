import { test, expect } from '@playwright/test';
const environment = process.env.API_ENV || 'prod';
const basePath = `/${environment}/users`;


// Generates a unique email to avoid conflicts in tests (email is primary key)
function getUniqueEmail(prefix: string) {
  return `${prefix}_${Math.floor(Math.random() * 100000)}@mail.com`;
}

    test.describe(`GET Users API - ${environment.toUpperCase()}`, () => {

        test('[GET-01] - Should return 200 and array', async ({ request }) => {
            const response = await request.get(basePath);

            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(Array.isArray(body)).toBeTruthy();
        });

            test('[GET-02] {email} - Should return created user', async ({ request }) => {
            const payload = {
            name: 'Lookup User',
            email: getUniqueEmail('lookup_user'),
            age: 25,
            };

            await request.post(basePath, { data: payload });
            const response = await request.get(`${basePath}/${payload.email}`);
            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.email).toBe(payload.email);
        });

        // ## BUG-02: Non-existing user returns 500 instead of 404
        test('[GET-03] - {email} Should return 404 if user does not exist', async ({ request }) => {
            const response = await request.get(`${basePath}/not_found@mail.com`);

            expect(response.status()).toBe(404);
        });

    });
    test.describe(`POST Users API - ${environment.toUpperCase()}`, () => {
        test('[POST-01] - Should create a user', async ({ request }) => {
            const payload = {
            name: 'Valid User',
            email: getUniqueEmail('valid_user'),
            age: 30,
            };
            const response = await request.post(basePath, {
            data: payload,
            });
            expect(response.status()).toBe(201);
            const body = await response.json();
            expect(body.name).toBe(payload.name);
            expect(body.email).toBe(payload.email);
            expect(body.age).toBe(payload.age);
        });


        test('[POST-02] - Should fail when age is missing', async ({ request }) => {
            const payload = {
            name: 'No Age User',
            email: 'no_age@mail.com',
            };

            const response = await request.post(basePath, {
            data: payload,
            });

            expect(response.status()).toBe(400);
        });

        test('[POST-03] - Should fail when age is invalid (0)', async ({ request }) => {
            const payload = {
            name: 'Invalid Age',
            email: 'invalid_age@mail.com',
            age: 0,
            };

            const response = await request.post(basePath, {
            data: payload,
            });

            expect(response.status()).toBe(400);
        });

        test('[POST-04] - Should fail when age is too high', async ({ request }) => {
            const payload = {
            name: 'Invalid Age High',
            email: 'invalid_age_high@mail.com',
            age: 151,
            };

            const response = await request.post(basePath, {
            data: payload,
            });

            expect(response.status()).toBe(400);
        });

        // BUG-01: API returns 201 instead of 400 for invalid email
        test('[POST-05] - Should fail with invalid email', async ({ request }) => {
            const payload = {
            name: 'Invalid Email',
            email: 'invalid-email-2',
            age: 25,
            };

            const response = await request.post(basePath, {
            data: payload,
            });

            expect(response.status()).toBe(400);
        });

        // BUG-03: API returns 500 instead of 409 for duplicate email
        test('[POST-06] - Should return 409 when email already exists', async ({ request }) => {
            const payload = {
                name: 'Duplicate User',
                email: getUniqueEmail('duplicate_user'),
                age: 30,
            };

            await request.post(basePath, { data: payload });
            const response = await request.post(basePath, {
                data: payload,
            });

            expect(response.status()).toBe(409);
        });
    });

    
    test.describe(`PUT Users API - ${environment.toUpperCase()}`, () => {
        test('[PUT-01] {email} - Should update an existing user', async ({ request }) => {
            const originalPayload = {
                name: 'Original User',
                email: getUniqueEmail('put_original_user'),
                age: 30,
            };

            await request.post(basePath, { data: originalPayload });

            const updatedPayload = {
                name: 'Updated User',
                email: getUniqueEmail('put_updated_user'),
                age: 35,
            };

            const response = await request.put(`${basePath}/${originalPayload.email}`, {
                data: updatedPayload,
            });

            expect(response.status()).toBe(200);

            const body = await response.json();
            expect(body.name).toBe(updatedPayload.name);
            expect(body.email).toBe(updatedPayload.email);
            expect(body.age).toBe(updatedPayload.age);
        });

        test('[PUT-02] {email} - Should return 400 when age is missing', async ({ request }) => {
            const originalPayload = {
                name: 'Put Missing Age Original',
                email: getUniqueEmail('put_missing_age_original'),
                age: 28,
            };

            await request.post(basePath, { data: originalPayload });

            const invalidPayload = {
                name: 'Put Missing Age Updated',
                email: getUniqueEmail('put_missing_age_updated'),
            };

            const response = await request.put(`${basePath}/${originalPayload.email}`, {
                data: invalidPayload,
            });

            expect(response.status()).toBe(400);
        });

        test('[PUT-03] {email} - Should return 400 when age is invalid (0)', async ({ request }) => {
            const originalPayload = {
                name: 'Put Invalid Age Original',
                email: getUniqueEmail('put_invalid_age_original'),
                age: 29,
            };

            await request.post(basePath, { data: originalPayload });
            const invalidPayload = {
                name: 'Put Invalid Age Updated',
                email: getUniqueEmail('put_invalid_age_updated'),
                age: 0,
            };

            const response = await request.put(`${basePath}/${originalPayload.email}`, {
                data: invalidPayload,
            });
            expect(response.status()).toBe(400);
        });

        test('[PUT-04] {email} - Should return 400 when email format is invalid', async ({ request }) => {
            const originalPayload = {
                name: 'Put Invalid Email Original',
                email: getUniqueEmail('put_invalid_email_original'),
                age: 27,
            };

            await request.post(basePath, { data: originalPayload });

            const invalidPayload = {
                name: 'Put Invalid Email Updated',
                email: 'invalid-email-format',
                age: 33,
            };

            const response = await request.put(`${basePath}/${originalPayload.email}`, {
                data: invalidPayload,
            });

            expect(response.status()).toBe(400);
        });

        test('[PUT-05] {email} - Should return 404 when user does not exist', async ({ request }) => {
            const payload = {
                name: 'Put Not Found User',
                email: getUniqueEmail('put_not_found_updated'),
                age: 40,
            };

            const response = await request.put(`${basePath}/not_found@mail.com`, {
                data: payload,
            });

            expect(response.status()).toBe(404);
        });

        test('[PUT-06] {email} - Should return 409 when updated email already exists', async ({ request }) => {
            const firstUser = {
                name: 'Put First User',
                email: getUniqueEmail('put_first_user'),
                age: 31,
            };

            const secondUser = {
                name: 'Put Second User',
                email: getUniqueEmail('put_second_user'),
                age: 32,
            };

            await request.post(basePath, { data: firstUser });
            await request.post(basePath, { data: secondUser });

            const duplicatePayload = {
                name: 'Put Duplicate Email User',
                email: secondUser.email,
                age: 35,
            };

            const response = await request.put(`${basePath}/${firstUser.email}`, {
                data: duplicatePayload,
            });

            expect(response.status()).toBe(409);
        });
    });

    test.describe(`DELETE Users API - ${environment.toUpperCase()}`, () => {
        // BUG-04 (DEV only): Missing auth returns 404 instead of 401 Unauthorized
        test('[DELETE-01] {email} - Should return 401 when auth header is missing', async ({ request }) => {
            const response = await request.delete(`${basePath}/not_found@mail.com`);

            expect(response.status()).toBe(401);
        });

        test('[DELETE-02] {email} - Should delete an existing user with valid auth', async ({ request }) => {
            const payload = {
                name: 'Delete User',
                email: getUniqueEmail('delete_user'),
                age: 28,
            };

            await request.post(basePath, { data: payload });
            const deleteResponse = await request.delete(`${basePath}/${payload.email}`, {
                headers: {
                Authentication: 'mysecrettoken',
                },
            });

            expect(deleteResponse.status()).toBe(204);
        });

        test('[DELETE-03] {email} - Should return 404 when user does not exist and auth is valid', async ({ request }) => {
            const response = await request.delete(`${basePath}/not_found@mail.com`, {
            headers: {
                Authentication: 'mysecrettoken',
            },
            });

            expect(response.status()).toBe(404);
        });

    });



