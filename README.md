# Project description

## I gave the name Socialama to the project.

> It is my first full-stack project which is going to be sort of a social webapp where users can view others' profiles, pictures, videos, writings, and so on ...

# The stack used

- **M**ySQL
- **E**xpressJS
- **V**ueJS
- **N**odeJS

# Dependecies

- **express**: for serving
- **cookie-parser**: to parse cookies into key/value pairs
- **cors**: allow API access for frontend
- **argon2**: a great encryption method
- **MySQL**: the database driver
- **TypeORM**: synchronizing models (entities) with the database
- **class-validator**: for validation
- **jsonwebtoken**: for signing and veryfing tokens (authentication)
- **faker**: for creating massive amount of fake data

# Features that'll be implemented in the future

- Guests can register and login (done)
- Users can edit their usernames and passwords
- Users can post posts and guests can view it
- Users can view each other's profiles
- Users can like posts and comment on them

# Database tables:

## users

- **id** (primary, int)
- **username** (varchar) - should always be unique and can be changed
- **email** (varchar) - should always be unique and can't be changed
- **password** (varchar) - hashed with Argon2
- **created_at** (date) - database default (when the record was inserted)
- **updated_at** (date) - database default (when the record was udpated)

## posts

- **id** (primary, int)
- **user_id** (foreign key)
- **content** (varchar)

_this section is incomplete for the time being_

# REST API

```
GET /api/users (list all users)
GET /api/users?page=1&limit=10 (paginates the users)
GET /api/users?property=value (filter users by properties)

POST /api/auth/register (register the user)
POST /api/auth/login (sign in the user)
POST /api/auth/logout (resets the refresh token cookie & resets the user in the frontend store)
POST /api/auth/refresh_token (refreshes the token of the user ! requires an access token)
GET /api/auth/payload (gives back the user's payload ! requires an access token)
```

TODOS:

//-------Backend

Rearrange routes, expand middlewares (auth, roles)
Refactor env/config vars
Authentication and Role system:
Admins can access restricted routes and more resources

- /login
- /register

//-------Frontend

Keep the users auth state and handle it beautifully !!! JWT can be decoded here too
Route guards:

- requiresGuest: if the user is logged in can't access
- requiresAuth: user must be logged in to access
- requiresSameUser: username from store must match with the profile's username

Cool navbar and basic design without transitions for now
Join the .env files together
320px should be the smallest width

What I did:

- Separated the pages from components
- Separated the SCSS (variables, fluid typography, responsiveness, utility classes, reusable components)
