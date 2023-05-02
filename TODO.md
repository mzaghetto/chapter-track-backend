## RFs (Requisitos funcionais)
#### Users
- [x] It should be possible to register;
- [x] It should be possible to obtain a user profile;
- [x] It should be possible to update the user profile;
- [x] It should be possible to authenticate;

#### Manhwas
- [x] It should be possible to register a new manhwa;
- [x] It should be possible to update a manhwa;
- [x] It should not be possible to register a new manhwa with same name as a registered manhwa
- [x] It should be possible to update the last release chapter from a manhwa;
- [x] It should not be possible to update a manhwa name with the same name as a registered manhwa
- [x] It should be possible to update the last notified chapter from a manhwa;

#### User_manhwa
- [x] It should be possible to add a new manhwa to user profile;
- [ ] It should be possible to get all manhwas [by profile];
- [ ] It should be possible to verify the unread manhwas [by profile];
- [ ] It should be possible to remove a manhwa to user profile;
- [ ] It should be possible to remove a list of manhwas to user profile;
- [ ] It should be possible to register a telegram user to receive updates from manhwas;
- [ ] It should be possible to active notifications from website;
- [ ] It should be possible to active notifications from telegram;
- [ ] It should be possible to deactive notifications from website;
- [ ] It should be possible to deactive notifications from telegram;
- [ ] It should be possible to organize the manhwa list;

## RNs (Regras de negócio)
- [x] The user should not be able to register with a duplicate email;
- [x] The user should not be able to register with a duplicate username;
- [x] The user should not be able to change the user role in update profile;
- [ ] The user should not be able to register 2 telegram users;
- [ ] A new manhwa can only be registered by administrators;
- [ ] A new manhwa can only be edited by administrators;
- [ ] The user can start/stop the notifications from a manhwa;
- [ ] The user can add a new manhwa to his profile;
- [ ] The user can remove a new manhwa to his profile;
- [ ] Only admins can update the last release chapter

## RNFs (Requisitos não-funcionais)
- [x] User password must be encrypted;
- [x] Application data must be persisted in a MongoDB database;
- [ ] All data lists [manhwas] must be paginated with 20 items by page;
- [x] The user must be identified by a JWT (JSON Web Token);



## Routes
[ ] Add all routes
[ ] add route to update user profile
[ ] add route to add a manhwa
[ ] add route to update a manhwa
[ ] add route to add a manhwa to a user profile
[ ] add route to transform an user role to an admin role
[ ] add route to get all manhwas from a profile
[ ] add route to active/deactive notification
[ ] add route to verify the unread manhwas
[ ] add route to remove a manhwa from a profile

## Tests
[ ] Add e2e tests
[ ] Add CI github