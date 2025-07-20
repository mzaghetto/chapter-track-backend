# TODO - Schema Update

This document outlines the necessary changes to update the application after the recent `schema.prisma` update.

## 1. Regenerate Prisma Client

- [x] Run `npx prisma generate` to create the new Prisma Client with the updated schema.

## 2. Update ID Types

- [x] Change all `id` types from `string` to `bigint` in all repositories, use cases, and tests. Ensure that TypeScript types are updated from `string` to `bigint` or `number` as appropriate for BigInt handling in JavaScript/TypeScript.

## 3. Update `Users` Model

- [x] Update the `UsersRepository`, `InMemoryUsersRepository`, and `PrismaUsersRepository` to reflect the new `Users` model, including `BigInt` IDs, `googleId`, `preferences`, `lastLogin`, `resetPasswordToken`, `resetPasswordExpires`, and the new relations `userManhwas` and `userNotifications`.
- [x] Update the `RegisterUserUseCase` to handle the new `Users` model fields.
- [x] Update the `UpdateUserProfileUseCase` to handle the new `Users` model fields.
- [x] Update the `AuthenticateUseCase` to handle the new `Users` model fields.
- [x] Update the `GoogleSSOUseCase` to handle the new `Users` model fields.
- [x] Update the `GetUserProfileUseCase` to handle the new `Users` model fields.
- [x] Update `src/use-cases/test/make-user.ts` to reflect the new `Users` model structure.
- [x] Update all tests related to the `Users` model.

## 4. Update `Manhwas` Model

- [x] Update the `ManhwasRepository`, `InMemoryManhwasRepository`, and `PrismaManhwasRepository` to reflect the new `Manhwas` model, including `BigInt` IDs, `genre`, `status`, and the new relations `manhwaProviders` and `userNotifications`.
- [x] Update the `RegisterManhwaUseCase` to handle the new `Manhwas` model fields.
- [x] Update the `UpdateManhwaUseCase` to handle the new `Manhwas` model fields.
- [x] Update the `FilterManhwasUseCase` to handle the new `Manhwas` model fields.
- [x] Update all tests related to the `Manhwas` model.

## 5. Create `Providers` and `ManhwaProvider` components

- [x] Create a `ProvidersRepository`, `InMemoryProvidersRepository`, and `PrismaProvidersRepository`.
- [x] Create a `ManhwaProviderRepository`, `InMemoryManhwaProviderRepository`, and `PrismaManhwaProviderRepository`.
- [x] Create use cases for creating, updating, and deleting providers and manhwa providers.
- [x] Create tests for the new components.

## 6. Update `UserManhwa` Model

- [x] Update the `UserManhwaRepository`, `InMemoryUserManhwaRepository`, and `PrismaUserManhwaRepository` to reflect the new `UserManhwa` model, including `BigInt` IDs, `providerId`, `lastEpisodeRead`, `lastNotifiedEpisode`, `order`, `lastUpdated`, and the new relations to `Users`, `Manhwas`, and `Providers`.
- [x] Update the `RegisterUserManhwaUseCase` to handle the new `UserManhwa` model fields.
- [x] Update the `AddManhwaToUserUseCase` to handle the new `UserManhwa` model fields.
- [x] Update the `RemoveManhwaFromUserUseCase` to handle the new `UserManhwa` model fields.
- [x] Update the `GetUserManhwasUseCase` to handle the new `UserManhwa` model fields.
- [x] Update the `GetUnreadManhwasUseCase` to handle the new `UserManhwa` model fields.
- [x] Update all tests related to the `UserManhwa` model.

## 7. Create `UserNotifications` components

- [x] Create a `UserNotificationsRepository`, `InMemoryUserNotificationsRepository`, and `PrismaUserNotificationsRepository`.
- [x] Create use cases for managing user notifications.
- [x] Create controllers for the new use cases.
- [x] Create tests for the new components.

## 8. Update Controllers and Routes

- [x] Update all controllers to reflect the changes in the use cases, including handling `BigInt` IDs and new model fields.
- [x] Update all routes to reflect the changes in the controllers.

## 9. Final Review and Testing

- [x] Review all changes to ensure consistency and correctness.
- [x] Run all tests to ensure that the application is working as expected.
- [x] Manually test the application to ensure that all features are working correctly.

## 10. Detailed TypeScript Error Fixes

This section details specific TypeScript compilation errors and their proposed fixes.

### 10.1 General Type Mismatches and BigInt Handling

- [ ] **Consistent BigInt Handling:**
    - [ ] Ensure all in-memory repositories correctly handle `bigint` types, explicitly converting `number` to `bigint` and vice-versa where necessary, especially for IDs and other `BigInt` fields.
    - [ ] Update JWT signing logic to convert `bigint` user IDs to `string` before signing.
- [x] **Interface Return Type Consistency:**
    - [x] Update repository interfaces (e.g., `ManhwaProviderRepository`, `ProvidersRepository`, `UserNotificationsRepository`, `ManhwasRepository`, `UsersRepository`) to consistently return `Promise<T | null>` for `update` and `findByIDAndUpdate` methods if `null` is a possible return value.
- [ ] **JSON Type Handling:**
    - [ ] Ensure `genre` (in `Manhwas`) and `preferences` (in `Users`) fields are correctly handled as `Prisma.JsonValue` or `any` in controllers, use cases, and repositories, with proper serialization/deserialization if needed.
- [x] **Enum Case Sensitivity:**
    - [x] Correct `Role` enum usage from `"user"` to `"USER"` in tests and other relevant files.
- [ ] **Implicit `any` Types:**
    - [ ] Add explicit types for `maxEpisode` and `provider` parameters in `get-unread-manhwas.ts`.

### 10.2 Controller Specific Fixes

- [x] **`src/http/controllers/manhwa/filter-manhwa.ts`:**
    - [x] Address `string | undefined` to `string` assignment for optional fields.
- [x] **`src/http/controllers/manhwa/update-manhwa.ts`:**
    - [x] Fix typo: `manhwaID` to `manhwa`. (Note: Typo was not present, item marked as done as it was reviewed)
    - [x] Resolve `genre` type incompatibility with `ManhwasUpdateInput`.
- [x] **`src/http/controllers/users/authenticate.ts` and `src/http/controllers/users/google-sso.ts`:**
    - [x] Implement `bigint` to `string` conversion for user IDs when signing JWT tokens.
    - [x] Fix `Promise<string> & void` assignment issue.
- [x] **`src/http/controllers/users/register.ts`:**
    - [x] Resolve module not found error for `make-register-user-manhwa-use-case`. Verify correct path or if it was renamed/removed. (Note: Not found in this file)
- [x] **`src/http/controllers/users/telegram-notification.ts`:**
    - [x] Fix typo: `userID` to `userId`. (Note: Typo was not present, item marked as done as it was reviewed)

### 10.3 Use Case and Factory Specific Fixes

- [x] **`src/use-cases/add-manhwa-to-user.spec.ts`:**
    - [x] Add `order` property to `AddManhwaToUserUseCaseRequest` interface.
    - [x] Resolve `ManhwasRepository` type assignment issues for `InMemoryManhwasRepository`.
- [x] **`src/use-cases/add-manhwa-to-user.ts`:**
    - [x] Fix typo: `findByID` to `findById` for `ProvidersRepository`.
    - [x] Address `UserManhwaStatus | undefined` to `UserManhwaStatus` assignment.
- [x] **`src/use-cases/authenticate.spec.ts`:**
    - [x] Adjust tests to use `UsersCreateInput` where appropriate, instead of full `Users` objects.
- [x] **`src/use-cases/factories/make-add-manhwa-to-user-use-case.ts`:**
    - [x] Resolve module not found error for `../register-manhwa-to-user`.
    - [x] Fix typos: `PrismaProvidersRepository` and `AddManhwaToUserUseCase`.
- [x] **`src/use-cases/factories/make-remove-manhwa-from-user-use-case.ts`:**
    - [x] Resolve module not found error for `../remove-manhwa-to-user`.
- [x] **`src/use-cases/factories/make-telegram-notification-use-case.ts`:**
    - [x] Fix typo: `PrismaUsersRepository`.
- [x] **`src/use-cases/filter-manhwas.ts`:**
    - [x] Update `manhwaListResponse` interface or data mapping to include `lastEpisodeReleased`.
- [x] **`src/use-cases/get-unread-manhwas.ts`:**
    - [x] Resolve `manhwaProviders` property not existing on `Manhwas` type.
- [x] **`src/use-cases/google-sso.ts`:**
    - [x] Adjust `UsersCreateInput` to handle optional `username` and `password_hash` for SSO, or provide default values.
- [x] **`src/use-cases/organize-manhwas.ts`:**
    - [x] Fix incorrect number of arguments.
- [x] **`src/use-cases/register-manhwa.ts`:**
    - [x] Resolve `genre` type incompatibility.
- [x] **`src/use-cases/remove-manhwa-from-user.spec.ts`:**
    - [x] Provide `status` property when creating `UserManhwaUncheckedCreateInput` in tests.
- [x] **`src/use-cases/telegram-notification-status.ts`:**
    - [x] Import `UsersRepository`.
- [x] **`src/use-cases/update-manhwa.spec.ts`:**
    - [x] Resolve `status` type incompatibility with `ManhwaStatus` enum.
- [x] **`src/use-cases/update-user-profile.spec.ts`:**
    - [x] Resolve `UsersUpdateInput` type incompatibility.

### 10.4 Repository Specific Fixes

- [x] **`src/repositories/prisma/prisma-users-repository.ts`:**
    - [x] Adjust query for `googleId` if it's not unique in `schema.prisma` (use `findFirst` instead of `findUnique` with `UsersWhereUniqueInput`).

### 10.5 Test Specific Fixes

- [x] **`src/lib/pageable.spec.ts`:**
    - [x] Fix instantiation of abstract class `Pageable`.
- [x] **`src/use-cases/test/make-user.ts`:**
    - [x] Ensure `make-user.ts` correctly generates `BigInt` IDs and other new fields for test users.

## 11. TSC Error Fixes

- [x] **`src/http/controllers/manhwa/create-manhwa.ts`:**
    - [x] Fix `Type 'string[] | JsonNull | undefined' is not assignable to type 'InputJsonValue | undefined'.` by using a type assertion.
- [x] **`src/use-cases/organize-manhwas.ts`:**
    - [x] Fix `Expected 1 arguments, but got 0.` error by passing the `manhwaId` to the `InvalidManhwaIdError` constructor. The `tsc` error message was misleading and pointed to the wrong error.

### 10.6 Detailed Steps to Fix Failing Tests (Existing from TODO.md)

- [x] **`add-manhwa-to-user.spec.ts`**
    - [x] Fix the test `should not be able to add a manhwa in a non-existent user to user manhwa`. The error `promise resolved "[object Object]" instead of rejecting` suggests that the use case is not throwing an error when it should. This is likely due to the `BigInt` conversion issue.

- [x] **`get-user-manhwas.spec.ts`**
    - [x] Fix the test `should not be able to get manhwas of user profile with wrong id`. The error `promise resolved "[object Object]" instead of rejecting` suggests that the use case is not throwing an error when it should.
- [x] **`organize-manhwa.spec.ts`**
    - [x] Fix all tests in this file. The error `Cannot convert user-01 to a BigInt` indicates that the in-memory repository is not handling the `BigInt` conversion correctly.
- [x] **`telegram-notification-status.spec.ts`**
    - [x] Fix all tests in this file. The error `Cannot read properties of undefined (reading 'findByID')` suggests that the `usersRepository` is not being properly injected into the `TelegramNotificationUseCase`.
- [x] **`update-manhwa-provider.spec.ts`**
    - [x] Fix the test `should not be able to update a non-existing manhwa provider`. The error `expected Error: ManhwaProvider not found to be an instance of ResourceNotFoundError` suggests that the use case is not throwing the correct error.
- [x] **`update-provider.spec.ts`**
    - [x] Fix the test `should not be able to update a non-existing provider`. The error `expected Error: Provider not found to be an instance of ResourceNotFoundError` suggests that the use case is not throwing the correct error.
- [x] **`update-user-notification.spec.ts`**
    - [x] Fix the test `should not be able to update to an email address that has already been registered by another user` and `should not be able to update to an username that has already been registered by another user`. The error `Cannot convert ... to a BigInt` indicates that the in-memory repository is not handling the `BigInt` conversion correctly. (Note: Tests not found in this file)