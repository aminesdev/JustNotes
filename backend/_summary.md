# Project: 

## File: README.md
```md
# JustNotes - Backend API

A secure and scalable backend for the JustNotes note-taking app built with Node.js, Express, and PostgreSQL.

## Features

- JWT-based User Authentication with email verification
- Full CRUD operations for notes with categories and tags
- Secure password reset flow with email verification
- API rate limiting using Redis/Upstash
- Nodemailer integration for email notifications
- Input validation, CORS, and secure password hashing

## Tech Stack

- Node.js with Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- Redis/Upstash for caching and rate limiting
- Nodemailer for email service

## Project Structure

```
src/
├── config/ # Database and external service configs
├── controllers/ # Route controllers
├── middlewares/ # Middleware functions
├── routes/ # API route definitions
├── services/ # Business logic and data access
├── utils/ # Helper functions
├── app.js # Express application setup
└── server.js # Server entry point

```

### Data Models

-   Users: accounts with email verification
-   Notes: notes with categories and tags
-   Categories: user-defined note categories
-   Refresh Tokens: secure token management

### Security Features

-   Password hashing with bcrypt
-   JWT token-based authentication
-   Request input validation
-   API rate limiting
-   Configurable CORS

## API Endpoints

**Authentication**

-   POST `/api/auth/register`
-   POST `/api/auth/login`
-   POST `/api/auth/refresh`
-   POST `/api/auth/logout`
-   POST `/api/auth/email/verify`
-   POST `/api/auth/email/resend`
-   POST `/api/auth/password/forgot`
-   POST `/api/auth/password/reset`

**Notes**

-   GET `/api/notes`
-   GET `/api/notes/:id`
-   POST `/api/notes`
-   PUT `/api/notes/:id`
-   DELETE `/api/notes/:id`

**Categories**

-   GET `/api/categories`
-   GET `/api/categories/:id`
-   POST `/api/categories`
-   PUT `/api/categories/:id`
-   DELETE `/api/categories/:id`
-   GET `/api/categories/:id/notes`

## Security Implementation

-   User registration → email verification → JWT tokens
-   Access tokens expire in 15 minutes, refresh tokens in 7 days
-   API endpoints and email services rate-limited
-   Input validation to prevent SQL injection and XSS

```

## File: package-lock.json
```json
{
    "name": "JustNotess",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
            "name": "JustNotess",
            "version": "1.0.0",
            "license": "ISC",
            "dependencies": {
                "@prisma/client": "^6.16.2",
                "@upstash/ratelimit": "^2.0.6",
                "@upstash/redis": "^1.35.4",
                "bcrypt": "^6.0.0",
                "cors": "^2.8.5",
                "dotenv": "^17.2.2",
                "express": "^5.1.0",
                "express-rate-limit": "^8.1.0",
                "express-validator": "^7.2.1",
                "helmet": "^8.1.0",
                "jsonwebtoken": "^9.0.2",
                "nodemailer": "^7.0.6",
                "prisma": "^6.16.2",
                "rate-limit-redis": "^4.2.2",
                "resend": "^6.1.0",
                "swagger-jsdoc": "^6.2.8",
                "swagger-ui-express": "^5.0.0"
            },
            "devDependencies": {
                "nodemon": "^3.1.10"
            }
        },
        "node_modules/@apidevtools/json-schema-ref-parser": {
            "version": "9.1.2",
            "resolved": "https://registry.npmjs.org/@apidevtools/json-schema-ref-parser/-/json-schema-ref-parser-9.1.2.tgz",
            "integrity": "sha512-r1w81DpR+KyRWd3f+rk6TNqMgedmAxZP5v5KWlXQWlgMUUtyEJch0DKEci1SorPMiSeM8XPl7MZ3miJ60JIpQg==",
            "dependencies": {
                "@jsdevtools/ono": "^7.1.3",
                "@types/json-schema": "^7.0.6",
                "call-me-maybe": "^1.0.1",
                "js-yaml": "^4.1.0"
            }
        },
        "node_modules/@apidevtools/openapi-schemas": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/@apidevtools/openapi-schemas/-/openapi-schemas-2.1.0.tgz",
            "integrity": "sha512-Zc1AlqrJlX3SlpupFGpiLi2EbteyP7fXmUOGup6/DnkRgjP9bgMM/ag+n91rsv0U1Gpz0H3VILA/o3bW7Ua6BQ==",
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/@apidevtools/swagger-methods": {
            "version": "3.0.2",
            "resolved": "https://registry.npmjs.org/@apidevtools/swagger-methods/-/swagger-methods-3.0.2.tgz",
            "integrity": "sha512-QAkD5kK2b1WfjDS/UQn/qQkbwF31uqRjPTrsCs5ZG9BQGAkjwvqGFjjPqAuzac/IYzpPtRzjCP1WrTuAIjMrXg=="
        },
        "node_modules/@apidevtools/swagger-parser": {
            "version": "10.0.3",
            "resolved": "https://registry.npmjs.org/@apidevtools/swagger-parser/-/swagger-parser-10.0.3.tgz",
            "integrity": "sha512-sNiLY51vZOmSPFZA5TF35KZ2HbgYklQnTSDnkghamzLb3EkNtcQnrBQEj5AOCxHpTtXpqMCRM1CrmV2rG6nw4g==",
            "dependencies": {
                "@apidevtools/json-schema-ref-parser": "^9.0.6",
                "@apidevtools/openapi-schemas": "^2.0.4",
                "@apidevtools/swagger-methods": "^3.0.2",
                "@jsdevtools/ono": "^7.1.3",
                "call-me-maybe": "^1.0.1",
                "z-schema": "^5.0.1"
            },
            "peerDependencies": {
                "openapi-types": ">=7"
            }
        },
        "node_modules/@jsdevtools/ono": {
            "version": "7.1.3",
            "resolved": "https://registry.npmjs.org/@jsdevtools/ono/-/ono-7.1.3.tgz",
            "integrity": "sha512-4JQNk+3mVzK3xh2rqd6RB4J46qUR19azEHBneZyTZM+c456qOrbbM/5xcR8huNCCcbVt7+UmizG6GuUvPvKUYg=="
        },
        "node_modules/@prisma/client": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/client/-/client-6.16.2.tgz",
            "integrity": "sha512-E00PxBcalMfYO/TWnXobBVUai6eW/g5OsifWQsQDzJYm7yaY+IRLo7ZLsaefi0QkTpxfuhFcQ/w180i6kX3iJw==",
            "hasInstallScript": true,
            "license": "Apache-2.0",
            "engines": {
                "node": ">=18.18"
            },
            "peerDependencies": {
                "prisma": "*",
                "typescript": ">=5.1.0"
            },
            "peerDependenciesMeta": {
                "prisma": {
                    "optional": true
                },
                "typescript": {
                    "optional": true
                }
            }
        },
        "node_modules/@prisma/config": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/config/-/config-6.16.2.tgz",
            "integrity": "sha512-mKXSUrcqXj0LXWPmJsK2s3p9PN+aoAbyMx7m5E1v1FufofR1ZpPoIArjjzOIm+bJRLLvYftoNYLx1tbHgF9/yg==",
            "dependencies": {
                "c12": "3.1.0",
                "deepmerge-ts": "7.1.5",
                "effect": "3.16.12",
                "empathic": "2.0.0"
            }
        },
        "node_modules/@prisma/debug": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/debug/-/debug-6.16.2.tgz",
            "integrity": "sha512-bo4/gA/HVV6u8YK2uY6glhNsJ7r+k/i5iQ9ny/3q5bt9ijCj7WMPUwfTKPvtEgLP+/r26Z686ly11hhcLiQ8zA=="
        },
        "node_modules/@prisma/engines": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/engines/-/engines-6.16.2.tgz",
            "integrity": "sha512-7yf3AjfPUgsg/l7JSu1iEhsmZZ/YE00yURPjTikqm2z4btM0bCl2coFtTGfeSOWbQMmq45Jab+53yGUIAT1sjA==",
            "hasInstallScript": true,
            "dependencies": {
                "@prisma/debug": "6.16.2",
                "@prisma/engines-version": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43",
                "@prisma/fetch-engine": "6.16.2",
                "@prisma/get-platform": "6.16.2"
            }
        },
        "node_modules/@prisma/engines-version": {
            "version": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43",
            "resolved": "https://registry.npmjs.org/@prisma/engines-version/-/engines-version-6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43.tgz",
            "integrity": "sha512-ThvlDaKIVrnrv97ujNFDYiQbeMQpLa0O86HFA2mNoip4mtFqM7U5GSz2ie1i2xByZtvPztJlNRgPsXGeM/kqAA=="
        },
        "node_modules/@prisma/fetch-engine": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/fetch-engine/-/fetch-engine-6.16.2.tgz",
            "integrity": "sha512-wPnZ8DMRqpgzye758ZvfAMiNJRuYpz+rhgEBZi60ZqDIgOU2694oJxiuu3GKFeYeR/hXxso4/2oBC243t/whxQ==",
            "dependencies": {
                "@prisma/debug": "6.16.2",
                "@prisma/engines-version": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43",
                "@prisma/get-platform": "6.16.2"
            }
        },
        "node_modules/@prisma/get-platform": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/@prisma/get-platform/-/get-platform-6.16.2.tgz",
            "integrity": "sha512-U/P36Uke5wS7r1+omtAgJpEB94tlT4SdlgaeTc6HVTTT93pXj7zZ+B/cZnmnvjcNPfWddgoDx8RLjmQwqGDYyA==",
            "dependencies": {
                "@prisma/debug": "6.16.2"
            }
        },
        "node_modules/@scarf/scarf": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/@scarf/scarf/-/scarf-1.4.0.tgz",
            "integrity": "sha512-xxeapPiUXdZAE3che6f3xogoJPeZgig6omHEy1rIY5WVsB3H2BHNnZH+gHG6x91SCWyQCzWGsuL2Hh3ClO5/qQ==",
            "hasInstallScript": true
        },
        "node_modules/@standard-schema/spec": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.0.0.tgz",
            "integrity": "sha512-m2bOd0f2RT9k8QJx1JN85cZYyH1RqFBdlwtkSlf4tBDYLCiiZnv1fIIwacK6cqwXavOydf0NPToMQgpKq+dVlA=="
        },
        "node_modules/@types/json-schema": {
            "version": "7.0.15",
            "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
            "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA=="
        },
        "node_modules/@upstash/core-analytics": {
            "version": "0.0.10",
            "resolved": "https://registry.npmjs.org/@upstash/core-analytics/-/core-analytics-0.0.10.tgz",
            "integrity": "sha512-7qJHGxpQgQr9/vmeS1PktEwvNAF7TI4iJDi8Pu2CFZ9YUGHZH4fOP5TfYlZ4aVxfopnELiE4BS4FBjyK7V1/xQ==",
            "license": "MIT",
            "dependencies": {
                "@upstash/redis": "^1.28.3"
            },
            "engines": {
                "node": ">=16.0.0"
            }
        },
        "node_modules/@upstash/ratelimit": {
            "version": "2.0.6",
            "resolved": "https://registry.npmjs.org/@upstash/ratelimit/-/ratelimit-2.0.6.tgz",
            "integrity": "sha512-Uak5qklMfzFN5RXltxY6IXRENu+Hgmo9iEgMPOlUs2etSQas2N+hJfbHw37OUy4vldLRXeD0OzL+YRvO2l5acg==",
            "license": "MIT",
            "dependencies": {
                "@upstash/core-analytics": "^0.0.10"
            },
            "peerDependencies": {
                "@upstash/redis": "^1.34.3"
            }
        },
        "node_modules/@upstash/redis": {
            "version": "1.35.4",
            "resolved": "https://registry.npmjs.org/@upstash/redis/-/redis-1.35.4.tgz",
            "integrity": "sha512-WE1ZnhFyBiIjTDW13GbO6JjkiMVVjw5VsvS8ENmvvJsze/caMQ5paxVD44+U68IUVmkXcbsLSoE+VIYsHtbQEw==",
            "license": "MIT",
            "dependencies": {
                "uncrypto": "^0.1.3"
            }
        },
        "node_modules/accepts": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
            "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
            "dependencies": {
                "mime-types": "^3.0.0",
                "negotiator": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/anymatch": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
            "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
            "dev": true,
            "dependencies": {
                "normalize-path": "^3.0.0",
                "picomatch": "^2.0.4"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/argparse": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
            "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q=="
        },
        "node_modules/balanced-match": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
            "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw=="
        },
        "node_modules/bcrypt": {
            "version": "6.0.0",
            "resolved": "https://registry.npmjs.org/bcrypt/-/bcrypt-6.0.0.tgz",
            "integrity": "sha512-cU8v/EGSrnH+HnxV2z0J7/blxH8gq7Xh2JFT6Aroax7UohdmiJJlxApMxtKfuI7z68NvvVcmR78k2LbT6efhRg==",
            "hasInstallScript": true,
            "dependencies": {
                "node-addon-api": "^8.3.0",
                "node-gyp-build": "^4.8.4"
            },
            "engines": {
                "node": ">= 18"
            }
        },
        "node_modules/binary-extensions": {
            "version": "2.3.0",
            "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
            "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
            "dev": true,
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/body-parser": {
            "version": "2.2.0",
            "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.2.0.tgz",
            "integrity": "sha512-02qvAaxv8tp7fBa/mw1ga98OGm+eCbqzJOKoRt70sLmfEEi+jyBYVTDGfCL/k06/4EMk/z01gCe7HoCH/f2LTg==",
            "dependencies": {
                "bytes": "^3.1.2",
                "content-type": "^1.0.5",
                "debug": "^4.4.0",
                "http-errors": "^2.0.0",
                "iconv-lite": "^0.6.3",
                "on-finished": "^2.4.1",
                "qs": "^6.14.0",
                "raw-body": "^3.0.0",
                "type-is": "^2.0.0"
            },
            "engines": {
                "node": ">=18"
            }
        },
        "node_modules/brace-expansion": {
            "version": "1.1.12",
            "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.12.tgz",
            "integrity": "sha512-9T9UjW3r0UW5c1Q7GTwllptXwhvYmEzFhzMfZ9H7FQWt+uZePjZPjBP/W1ZEyZ1twGWom5/56TF4lPcqjnDHcg==",
            "dependencies": {
                "balanced-match": "^1.0.0",
                "concat-map": "0.0.1"
            }
        },
        "node_modules/braces": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
            "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
            "dev": true,
            "dependencies": {
                "fill-range": "^7.1.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/buffer-equal-constant-time": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
            "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA=="
        },
        "node_modules/bytes": {
            "version": "3.1.2",
            "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
            "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/c12": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/c12/-/c12-3.1.0.tgz",
            "integrity": "sha512-uWoS8OU1MEIsOv8p/5a82c3H31LsWVR5qiyXVfBNOzfffjUWtPnhAb4BYI2uG2HfGmZmFjCtui5XNWaps+iFuw==",
            "dependencies": {
                "chokidar": "^4.0.3",
                "confbox": "^0.2.2",
                "defu": "^6.1.4",
                "dotenv": "^16.6.1",
                "exsolve": "^1.0.7",
                "giget": "^2.0.0",
                "jiti": "^2.4.2",
                "ohash": "^2.0.11",
                "pathe": "^2.0.3",
                "perfect-debounce": "^1.0.0",
                "pkg-types": "^2.2.0",
                "rc9": "^2.1.2"
            },
            "peerDependencies": {
                "magicast": "^0.3.5"
            },
            "peerDependenciesMeta": {
                "magicast": {
                    "optional": true
                }
            }
        },
        "node_modules/c12/node_modules/chokidar": {
            "version": "4.0.3",
            "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-4.0.3.tgz",
            "integrity": "sha512-Qgzu8kfBvo+cA4962jnP1KkS6Dop5NS6g7R5LFYJr4b8Ub94PPQXUksCw9PvXoeXPRRddRNC5C1JQUR2SMGtnA==",
            "dependencies": {
                "readdirp": "^4.0.1"
            },
            "engines": {
                "node": ">= 14.16.0"
            },
            "funding": {
                "url": "https://paulmillr.com/funding/"
            }
        },
        "node_modules/c12/node_modules/dotenv": {
            "version": "16.6.1",
            "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-16.6.1.tgz",
            "integrity": "sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==",
            "engines": {
                "node": ">=12"
            },
            "funding": {
                "url": "https://dotenvx.com"
            }
        },
        "node_modules/c12/node_modules/readdirp": {
            "version": "4.1.2",
            "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-4.1.2.tgz",
            "integrity": "sha512-GDhwkLfywWL2s6vEjyhri+eXmfH6j1L7JE27WhqLeYzoh/A3DBaYGEj2H/HFZCn/kMfim73FXxEJTw06WtxQwg==",
            "engines": {
                "node": ">= 14.18.0"
            },
            "funding": {
                "type": "individual",
                "url": "https://paulmillr.com/funding/"
            }
        },
        "node_modules/call-bind-apply-helpers": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
            "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
            "dependencies": {
                "es-errors": "^1.3.0",
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/call-bound": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
            "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "get-intrinsic": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/call-me-maybe": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/call-me-maybe/-/call-me-maybe-1.0.2.tgz",
            "integrity": "sha512-HpX65o1Hnr9HH25ojC1YGs7HCQLq0GCOibSaWER0eNpgJ/Z1MZv2mTc7+xh6WOPxbRVcmgbv4hGU+uSQ/2xFZQ=="
        },
        "node_modules/chokidar": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
            "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
            "dev": true,
            "dependencies": {
                "anymatch": "~3.1.2",
                "braces": "~3.0.2",
                "glob-parent": "~5.1.2",
                "is-binary-path": "~2.1.0",
                "is-glob": "~4.0.1",
                "normalize-path": "~3.0.0",
                "readdirp": "~3.6.0"
            },
            "engines": {
                "node": ">= 8.10.0"
            },
            "funding": {
                "url": "https://paulmillr.com/funding/"
            },
            "optionalDependencies": {
                "fsevents": "~2.3.2"
            }
        },
        "node_modules/citty": {
            "version": "0.1.6",
            "resolved": "https://registry.npmjs.org/citty/-/citty-0.1.6.tgz",
            "integrity": "sha512-tskPPKEs8D2KPafUypv2gxwJP8h/OaJmC82QQGGDQcHvXX43xF2VDACcJVmZ0EuSxkpO9Kc4MlrA3q0+FG58AQ==",
            "dependencies": {
                "consola": "^3.2.3"
            }
        },
        "node_modules/commander": {
            "version": "6.2.0",
            "resolved": "https://registry.npmjs.org/commander/-/commander-6.2.0.tgz",
            "integrity": "sha512-zP4jEKbe8SHzKJYQmq8Y9gYjtO/POJLgIdKgV7B9qNmABVFVc+ctqSX6iXh4mCpJfRBOabiZ2YKPg8ciDw6C+Q==",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/concat-map": {
            "version": "0.0.1",
            "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
            "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg=="
        },
        "node_modules/confbox": {
            "version": "0.2.2",
            "resolved": "https://registry.npmjs.org/confbox/-/confbox-0.2.2.tgz",
            "integrity": "sha512-1NB+BKqhtNipMsov4xI/NnhCKp9XG9NamYp5PVm9klAT0fsrNPjaFICsCFhNhwZJKNh7zB/3q8qXz0E9oaMNtQ=="
        },
        "node_modules/consola": {
            "version": "3.4.2",
            "resolved": "https://registry.npmjs.org/consola/-/consola-3.4.2.tgz",
            "integrity": "sha512-5IKcdX0nnYavi6G7TtOhwkYzyjfJlatbjMjuLSfE2kYT5pMDOilZ4OvMhi637CcDICTmz3wARPoyhqyX1Y+XvA==",
            "engines": {
                "node": "^14.18.0 || >=16.10.0"
            }
        },
        "node_modules/content-disposition": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.0.0.tgz",
            "integrity": "sha512-Au9nRL8VNUut/XSzbQA38+M78dzP4D+eqg3gfJHMIHHYa3bg067xj1KxMUWj+VULbiZMowKngFFbKczUrNJ1mg==",
            "dependencies": {
                "safe-buffer": "5.2.1"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/content-type": {
            "version": "1.0.5",
            "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
            "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/cookie": {
            "version": "0.7.2",
            "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
            "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/cookie-signature": {
            "version": "1.2.2",
            "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
            "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
            "engines": {
                "node": ">=6.6.0"
            }
        },
        "node_modules/cors": {
            "version": "2.8.5",
            "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.5.tgz",
            "integrity": "sha512-KIHbLJqu73RGr/hnbrO9uBeixNGuvSQjul/jdFvS/KFSIH1hWVd1ng7zOHx+YrEfInLG7q4n6GHQ9cDtxv/P6g==",
            "license": "MIT",
            "dependencies": {
                "object-assign": "^4",
                "vary": "^1"
            },
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/deepmerge-ts": {
            "version": "7.1.5",
            "resolved": "https://registry.npmjs.org/deepmerge-ts/-/deepmerge-ts-7.1.5.tgz",
            "integrity": "sha512-HOJkrhaYsweh+W+e74Yn7YStZOilkoPb6fycpwNLKzSPtruFs48nYis0zy5yJz1+ktUhHxoRDJ27RQAWLIJVJw==",
            "engines": {
                "node": ">=16.0.0"
            }
        },
        "node_modules/defu": {
            "version": "6.1.4",
            "resolved": "https://registry.npmjs.org/defu/-/defu-6.1.4.tgz",
            "integrity": "sha512-mEQCMmwJu317oSz8CwdIOdwf3xMif1ttiM8LTufzc3g6kR+9Pe236twL8j3IYT1F7GfRgGcW6MWxzZjLIkuHIg=="
        },
        "node_modules/depd": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
            "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/destr": {
            "version": "2.0.5",
            "resolved": "https://registry.npmjs.org/destr/-/destr-2.0.5.tgz",
            "integrity": "sha512-ugFTXCtDZunbzasqBxrK93Ik/DRYsO6S/fedkWEMKqt04xZ4csmnmwGDBAb07QWNaGMAmnTIemsYZCksjATwsA=="
        },
        "node_modules/doctrine": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-3.0.0.tgz",
            "integrity": "sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==",
            "dependencies": {
                "esutils": "^2.0.2"
            },
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/dotenv": {
            "version": "17.2.2",
            "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.2.2.tgz",
            "integrity": "sha512-Sf2LSQP+bOlhKWWyhFsn0UsfdK/kCWRv1iuA2gXAwt3dyNabr6QSj00I2V10pidqz69soatm9ZwZvpQMTIOd5Q==",
            "engines": {
                "node": ">=12"
            },
            "funding": {
                "url": "https://dotenvx.com"
            }
        },
        "node_modules/dunder-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
            "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.1",
                "es-errors": "^1.3.0",
                "gopd": "^1.2.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/ecdsa-sig-formatter": {
            "version": "1.0.11",
            "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
            "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
            "dependencies": {
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/ee-first": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
            "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow=="
        },
        "node_modules/effect": {
            "version": "3.16.12",
            "resolved": "https://registry.npmjs.org/effect/-/effect-3.16.12.tgz",
            "integrity": "sha512-N39iBk0K71F9nb442TLbTkjl24FLUzuvx2i1I2RsEAQsdAdUTuUoW0vlfUXgkMTUOnYqKnWcFfqw4hK4Pw27hg==",
            "dependencies": {
                "@standard-schema/spec": "^1.0.0",
                "fast-check": "^3.23.1"
            }
        },
        "node_modules/empathic": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/empathic/-/empathic-2.0.0.tgz",
            "integrity": "sha512-i6UzDscO/XfAcNYD75CfICkmfLedpyPDdozrLMmQc5ORaQcdMoc21OnlEylMIqI7U8eniKrPMxxtj8k0vhmJhA==",
            "engines": {
                "node": ">=14"
            }
        },
        "node_modules/encodeurl": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
            "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/es-define-property": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
            "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-errors": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
            "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-object-atoms": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
            "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
            "dependencies": {
                "es-errors": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/escape-html": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
            "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow=="
        },
        "node_modules/esutils": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
            "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/etag": {
            "version": "1.8.1",
            "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
            "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/express": {
            "version": "5.1.0",
            "resolved": "https://registry.npmjs.org/express/-/express-5.1.0.tgz",
            "integrity": "sha512-DT9ck5YIRU+8GYzzU5kT3eHGA5iL+1Zd0EutOmTE9Dtk+Tvuzd23VBU+ec7HPNSTxXYO55gPV/hq4pSBJDjFpA==",
            "dependencies": {
                "accepts": "^2.0.0",
                "body-parser": "^2.2.0",
                "content-disposition": "^1.0.0",
                "content-type": "^1.0.5",
                "cookie": "^0.7.1",
                "cookie-signature": "^1.2.1",
                "debug": "^4.4.0",
                "encodeurl": "^2.0.0",
                "escape-html": "^1.0.3",
                "etag": "^1.8.1",
                "finalhandler": "^2.1.0",
                "fresh": "^2.0.0",
                "http-errors": "^2.0.0",
                "merge-descriptors": "^2.0.0",
                "mime-types": "^3.0.0",
                "on-finished": "^2.4.1",
                "once": "^1.4.0",
                "parseurl": "^1.3.3",
                "proxy-addr": "^2.0.7",
                "qs": "^6.14.0",
                "range-parser": "^1.2.1",
                "router": "^2.2.0",
                "send": "^1.1.0",
                "serve-static": "^2.2.0",
                "statuses": "^2.0.1",
                "type-is": "^2.0.1",
                "vary": "^1.1.2"
            },
            "engines": {
                "node": ">= 18"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/express-rate-limit": {
            "version": "8.1.0",
            "resolved": "https://registry.npmjs.org/express-rate-limit/-/express-rate-limit-8.1.0.tgz",
            "integrity": "sha512-4nLnATuKupnmwqiJc27b4dCFmB/T60ExgmtDD7waf4LdrbJ8CPZzZRHYErDYNhoz+ql8fUdYwM/opf90PoPAQA==",
            "dependencies": {
                "ip-address": "10.0.1"
            },
            "engines": {
                "node": ">= 16"
            },
            "funding": {
                "url": "https://github.com/sponsors/express-rate-limit"
            },
            "peerDependencies": {
                "express": ">= 4.11"
            }
        },
        "node_modules/express-validator": {
            "version": "7.2.1",
            "resolved": "https://registry.npmjs.org/express-validator/-/express-validator-7.2.1.tgz",
            "integrity": "sha512-CjNE6aakfpuwGaHQZ3m8ltCG2Qvivd7RHtVMS/6nVxOM7xVGqr4bhflsm4+N5FP5zI7Zxp+Hae+9RE+o8e3ZOQ==",
            "dependencies": {
                "lodash": "^4.17.21",
                "validator": "~13.12.0"
            },
            "engines": {
                "node": ">= 8.0.0"
            }
        },
        "node_modules/express-validator/node_modules/validator": {
            "version": "13.12.0",
            "resolved": "https://registry.npmjs.org/validator/-/validator-13.12.0.tgz",
            "integrity": "sha512-c1Q0mCiPlgdTVVVIJIrBuxNicYE+t/7oKeI9MWLj3fh/uq2Pxh/3eeWbVZ4OcGW1TUf53At0njHw5SMdA3tmMg==",
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/exsolve": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/exsolve/-/exsolve-1.0.7.tgz",
            "integrity": "sha512-VO5fQUzZtI6C+vx4w/4BWJpg3s/5l+6pRQEHzFRM8WFi4XffSP1Z+4qi7GbjWbvRQEbdIco5mIMq+zX4rPuLrw=="
        },
        "node_modules/fast-check": {
            "version": "3.23.2",
            "resolved": "https://registry.npmjs.org/fast-check/-/fast-check-3.23.2.tgz",
            "integrity": "sha512-h5+1OzzfCC3Ef7VbtKdcv7zsstUQwUDlYpUTvjeUsJAssPgLn7QzbboPtL5ro04Mq0rPOsMzl7q5hIbRs2wD1A==",
            "funding": [
                {
                    "type": "individual",
                    "url": "https://github.com/sponsors/dubzzz"
                },
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/fast-check"
                }
            ],
            "dependencies": {
                "pure-rand": "^6.1.0"
            },
            "engines": {
                "node": ">=8.0.0"
            }
        },
        "node_modules/fill-range": {
            "version": "7.1.1",
            "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
            "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
            "dev": true,
            "dependencies": {
                "to-regex-range": "^5.0.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/finalhandler": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.0.tgz",
            "integrity": "sha512-/t88Ty3d5JWQbWYgaOGCCYfXRwV1+be02WqYYlL6h0lEiUAMPM8o8qKGO01YIkOHzka2up08wvgYD0mDiI+q3Q==",
            "dependencies": {
                "debug": "^4.4.0",
                "encodeurl": "^2.0.0",
                "escape-html": "^1.0.3",
                "on-finished": "^2.4.1",
                "parseurl": "^1.3.3",
                "statuses": "^2.0.1"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/forwarded": {
            "version": "0.2.0",
            "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
            "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/fresh": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
            "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/fs.realpath": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
            "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw=="
        },
        "node_modules/fsevents": {
            "version": "2.3.3",
            "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
            "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
            "dev": true,
            "hasInstallScript": true,
            "optional": true,
            "os": [
                "darwin"
            ],
            "engines": {
                "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
            }
        },
        "node_modules/function-bind": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
            "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/get-intrinsic": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
            "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "es-define-property": "^1.0.1",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.1.1",
                "function-bind": "^1.1.2",
                "get-proto": "^1.0.1",
                "gopd": "^1.2.0",
                "has-symbols": "^1.1.0",
                "hasown": "^2.0.2",
                "math-intrinsics": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/get-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
            "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
            "dependencies": {
                "dunder-proto": "^1.0.1",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/giget": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/giget/-/giget-2.0.0.tgz",
            "integrity": "sha512-L5bGsVkxJbJgdnwyuheIunkGatUF/zssUoxxjACCseZYAVbaqdh9Tsmmlkl8vYan09H7sbvKt4pS8GqKLBrEzA==",
            "dependencies": {
                "citty": "^0.1.6",
                "consola": "^3.4.0",
                "defu": "^6.1.4",
                "node-fetch-native": "^1.6.6",
                "nypm": "^0.6.0",
                "pathe": "^2.0.3"
            },
            "bin": {
                "giget": "dist/cli.mjs"
            }
        },
        "node_modules/glob": {
            "version": "7.1.6",
            "resolved": "https://registry.npmjs.org/glob/-/glob-7.1.6.tgz",
            "integrity": "sha512-LwaxwyZ72Lk7vZINtNNrywX0ZuLyStrdDtabefZKAY5ZGJhVtgdznluResxNmPitE0SAO+O26sWTHeKSI2wMBA==",
            "deprecated": "Glob versions prior to v9 are no longer supported",
            "dependencies": {
                "fs.realpath": "^1.0.0",
                "inflight": "^1.0.4",
                "inherits": "2",
                "minimatch": "^3.0.4",
                "once": "^1.3.0",
                "path-is-absolute": "^1.0.0"
            },
            "engines": {
                "node": "*"
            },
            "funding": {
                "url": "https://github.com/sponsors/isaacs"
            }
        },
        "node_modules/glob-parent": {
            "version": "5.1.2",
            "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
            "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
            "dev": true,
            "dependencies": {
                "is-glob": "^4.0.1"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/gopd": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
            "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-flag": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
            "integrity": "sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
            "dev": true,
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/has-symbols": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
            "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/hasown": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
            "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
            "dependencies": {
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/helmet": {
            "version": "8.1.0",
            "resolved": "https://registry.npmjs.org/helmet/-/helmet-8.1.0.tgz",
            "integrity": "sha512-jOiHyAZsmnr8LqoPGmCjYAaiuWwjAPLgY8ZX2XrmHawt99/u1y6RgrZMTeoPfpUbV96HOalYgz1qzkRbw54Pmg==",
            "license": "MIT",
            "engines": {
                "node": ">=18.0.0"
            }
        },
        "node_modules/http-errors": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.0.tgz",
            "integrity": "sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==",
            "dependencies": {
                "depd": "2.0.0",
                "inherits": "2.0.4",
                "setprototypeof": "1.2.0",
                "statuses": "2.0.1",
                "toidentifier": "1.0.1"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/http-errors/node_modules/statuses": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.1.tgz",
            "integrity": "sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/iconv-lite": {
            "version": "0.6.3",
            "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
            "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
            "dependencies": {
                "safer-buffer": ">= 2.1.2 < 3.0.0"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/ignore-by-default": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/ignore-by-default/-/ignore-by-default-1.0.1.tgz",
            "integrity": "sha512-Ius2VYcGNk7T90CppJqcIkS5ooHUZyIQK+ClZfMfMNFEF9VSE73Fq+906u/CWu92x4gzZMWOwfFYckPObzdEbA==",
            "dev": true
        },
        "node_modules/inflight": {
            "version": "1.0.6",
            "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
            "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
            "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
            "dependencies": {
                "once": "^1.3.0",
                "wrappy": "1"
            }
        },
        "node_modules/inherits": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
            "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ=="
        },
        "node_modules/ip-address": {
            "version": "10.0.1",
            "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-10.0.1.tgz",
            "integrity": "sha512-NWv9YLW4PoW2B7xtzaS3NCot75m6nK7Icdv0o3lfMceJVRfSoQwqD4wEH5rLwoKJwUiZ/rfpiVBhnaF0FK4HoA==",
            "engines": {
                "node": ">= 12"
            }
        },
        "node_modules/ipaddr.js": {
            "version": "1.9.1",
            "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
            "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/is-binary-path": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
            "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
            "dev": true,
            "dependencies": {
                "binary-extensions": "^2.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/is-extglob": {
            "version": "2.1.1",
            "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
            "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
            "dev": true,
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-glob": {
            "version": "4.0.3",
            "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
            "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
            "dev": true,
            "dependencies": {
                "is-extglob": "^2.1.1"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-number": {
            "version": "7.0.0",
            "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
            "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
            "dev": true,
            "engines": {
                "node": ">=0.12.0"
            }
        },
        "node_modules/is-promise": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
            "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ=="
        },
        "node_modules/jiti": {
            "version": "2.6.0",
            "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.6.0.tgz",
            "integrity": "sha512-VXe6RjJkBPj0ohtqaO8vSWP3ZhAKo66fKrFNCll4BTcwljPLz03pCbaNKfzGP5MbrCYcbJ7v0nOYYwUzTEIdXQ==",
            "bin": {
                "jiti": "lib/jiti-cli.mjs"
            }
        },
        "node_modules/js-yaml": {
            "version": "4.1.0",
            "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.1.0.tgz",
            "integrity": "sha512-wpxZs9NoxZaJESJGIZTyDEaYpl0FKSA+FB9aJiyemKhMwkxQg63h4T1KJgUGHpTqPDNRcmmYLugrRjJlBtWvRA==",
            "dependencies": {
                "argparse": "^2.0.1"
            },
            "bin": {
                "js-yaml": "bin/js-yaml.js"
            }
        },
        "node_modules/jsonwebtoken": {
            "version": "9.0.2",
            "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.2.tgz",
            "integrity": "sha512-PRp66vJ865SSqOlgqS8hujT5U4AOgMfhrwYIuIhfKaoSCZcirrmASQr8CX7cUg+RMih+hgznrjp99o+W4pJLHQ==",
            "dependencies": {
                "jws": "^3.2.2",
                "lodash.includes": "^4.3.0",
                "lodash.isboolean": "^3.0.3",
                "lodash.isinteger": "^4.0.4",
                "lodash.isnumber": "^3.0.3",
                "lodash.isplainobject": "^4.0.6",
                "lodash.isstring": "^4.0.1",
                "lodash.once": "^4.0.0",
                "ms": "^2.1.1",
                "semver": "^7.5.4"
            },
            "engines": {
                "node": ">=12",
                "npm": ">=6"
            }
        },
        "node_modules/jwa": {
            "version": "1.4.2",
            "resolved": "https://registry.npmjs.org/jwa/-/jwa-1.4.2.tgz",
            "integrity": "sha512-eeH5JO+21J78qMvTIDdBXidBd6nG2kZjg5Ohz/1fpa28Z4CcsWUzJ1ZZyFq/3z3N17aZy+ZuBoHljASbL1WfOw==",
            "dependencies": {
                "buffer-equal-constant-time": "^1.0.1",
                "ecdsa-sig-formatter": "1.0.11",
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/jws": {
            "version": "3.2.2",
            "resolved": "https://registry.npmjs.org/jws/-/jws-3.2.2.tgz",
            "integrity": "sha512-YHlZCB6lMTllWDtSPHz/ZXTsi8S00usEV6v1tjq8tOUZzw7DpSDWVXjXDre6ed1w/pd495ODpHZYSdkRTsa0HA==",
            "dependencies": {
                "jwa": "^1.4.1",
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/lodash": {
            "version": "4.17.21",
            "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
            "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="
        },
        "node_modules/lodash.get": {
            "version": "4.4.2",
            "resolved": "https://registry.npmjs.org/lodash.get/-/lodash.get-4.4.2.tgz",
            "integrity": "sha512-z+Uw/vLuy6gQe8cfaFWD7p0wVv8fJl3mbzXh33RS+0oW2wvUqiRXiQ69gLWSLpgB5/6sU+r6BlQR0MBILadqTQ==",
            "deprecated": "This package is deprecated. Use the optional chaining (?.) operator instead."
        },
        "node_modules/lodash.includes": {
            "version": "4.3.0",
            "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
            "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w=="
        },
        "node_modules/lodash.isboolean": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
            "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg=="
        },
        "node_modules/lodash.isequal": {
            "version": "4.5.0",
            "resolved": "https://registry.npmjs.org/lodash.isequal/-/lodash.isequal-4.5.0.tgz",
            "integrity": "sha512-pDo3lu8Jhfjqls6GkMgpahsF9kCyayhgykjyLMNFTKWrpVdAQtYyB4muAMWozBB4ig/dtWAmsMxLEI8wuz+DYQ==",
            "deprecated": "This package is deprecated. Use require('node:util').isDeepStrictEqual instead."
        },
        "node_modules/lodash.isinteger": {
            "version": "4.0.4",
            "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
            "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA=="
        },
        "node_modules/lodash.isnumber": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
            "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw=="
        },
        "node_modules/lodash.isplainobject": {
            "version": "4.0.6",
            "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
            "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA=="
        },
        "node_modules/lodash.isstring": {
            "version": "4.0.1",
            "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
            "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw=="
        },
        "node_modules/lodash.mergewith": {
            "version": "4.6.2",
            "resolved": "https://registry.npmjs.org/lodash.mergewith/-/lodash.mergewith-4.6.2.tgz",
            "integrity": "sha512-GK3g5RPZWTRSeLSpgP8Xhra+pnjBC56q9FZYe1d5RN3TJ35dbkGy3YqBSMbyCrlbi+CM9Z3Jk5yTL7RCsqboyQ=="
        },
        "node_modules/lodash.once": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
            "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg=="
        },
        "node_modules/math-intrinsics": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
            "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/media-typer": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.0.tgz",
            "integrity": "sha512-aisnrDP4GNe06UcKFnV5bfMNPBUw4jsLGaWwWfnH3v02GnBuXX2MCVn5RbrWo0j3pczUilYblq7fQ7Nw2t5XKw==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/merge-descriptors": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
            "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
            "engines": {
                "node": ">=18"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/mime-db": {
            "version": "1.54.0",
            "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
            "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/mime-types": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.1.tgz",
            "integrity": "sha512-xRc4oEhT6eaBpU1XF7AjpOFD+xQmXNB5OVKwp4tqCuBpHLS/ZbBDrc07mYTDqVMg6PfxUjjNp85O6Cd2Z/5HWA==",
            "dependencies": {
                "mime-db": "^1.54.0"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/minimatch": {
            "version": "3.1.2",
            "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.2.tgz",
            "integrity": "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw==",
            "dependencies": {
                "brace-expansion": "^1.1.7"
            },
            "engines": {
                "node": "*"
            }
        },
        "node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="
        },
        "node_modules/negotiator": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
            "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/node-addon-api": {
            "version": "8.5.0",
            "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-8.5.0.tgz",
            "integrity": "sha512-/bRZty2mXUIFY/xU5HLvveNHlswNJej+RnxBjOMkidWfwZzgTbPG1E3K5TOxRLOR+5hX7bSofy8yf1hZevMS8A==",
            "engines": {
                "node": "^18 || ^20 || >= 21"
            }
        },
        "node_modules/node-fetch-native": {
            "version": "1.6.7",
            "resolved": "https://registry.npmjs.org/node-fetch-native/-/node-fetch-native-1.6.7.tgz",
            "integrity": "sha512-g9yhqoedzIUm0nTnTqAQvueMPVOuIY16bqgAJJC8XOOubYFNwz6IER9qs0Gq2Xd0+CecCKFjtdDTMA4u4xG06Q=="
        },
        "node_modules/node-gyp-build": {
            "version": "4.8.4",
            "resolved": "https://registry.npmjs.org/node-gyp-build/-/node-gyp-build-4.8.4.tgz",
            "integrity": "sha512-LA4ZjwlnUblHVgq0oBF3Jl/6h/Nvs5fzBLwdEF4nuxnFdsfajde4WfxtJr3CaiH+F6ewcIB/q4jQ4UzPyid+CQ==",
            "bin": {
                "node-gyp-build": "bin.js",
                "node-gyp-build-optional": "optional.js",
                "node-gyp-build-test": "build-test.js"
            }
        },
        "node_modules/nodemailer": {
            "version": "7.0.6",
            "resolved": "https://registry.npmjs.org/nodemailer/-/nodemailer-7.0.6.tgz",
            "integrity": "sha512-F44uVzgwo49xboqbFgBGkRaiMgtoBrBEWCVincJPK9+S9Adkzt/wXCLKbf7dxucmxfTI5gHGB+bEmdyzN6QKjw==",
            "license": "MIT-0",
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/nodemon": {
            "version": "3.1.10",
            "resolved": "https://registry.npmjs.org/nodemon/-/nodemon-3.1.10.tgz",
            "integrity": "sha512-WDjw3pJ0/0jMFmyNDp3gvY2YizjLmmOUQo6DEBY+JgdvW/yQ9mEeSw6H5ythl5Ny2ytb7f9C2nIbjSxMNzbJXw==",
            "dev": true,
            "dependencies": {
                "chokidar": "^3.5.2",
                "debug": "^4",
                "ignore-by-default": "^1.0.1",
                "minimatch": "^3.1.2",
                "pstree.remy": "^1.1.8",
                "semver": "^7.5.3",
                "simple-update-notifier": "^2.0.0",
                "supports-color": "^5.5.0",
                "touch": "^3.1.0",
                "undefsafe": "^2.0.5"
            },
            "bin": {
                "nodemon": "bin/nodemon.js"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/nodemon"
            }
        },
        "node_modules/normalize-path": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
            "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
            "dev": true,
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/nypm": {
            "version": "0.6.2",
            "resolved": "https://registry.npmjs.org/nypm/-/nypm-0.6.2.tgz",
            "integrity": "sha512-7eM+hpOtrKrBDCh7Ypu2lJ9Z7PNZBdi/8AT3AX8xoCj43BBVHD0hPSTEvMtkMpfs8FCqBGhxB+uToIQimA111g==",
            "dependencies": {
                "citty": "^0.1.6",
                "consola": "^3.4.2",
                "pathe": "^2.0.3",
                "pkg-types": "^2.3.0",
                "tinyexec": "^1.0.1"
            },
            "bin": {
                "nypm": "dist/cli.mjs"
            },
            "engines": {
                "node": "^14.16.0 || >=16.10.0"
            }
        },
        "node_modules/object-assign": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
            "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/object-inspect": {
            "version": "1.13.4",
            "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
            "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/ohash": {
            "version": "2.0.11",
            "resolved": "https://registry.npmjs.org/ohash/-/ohash-2.0.11.tgz",
            "integrity": "sha512-RdR9FQrFwNBNXAr4GixM8YaRZRJ5PUWbKYbE5eOsrwAjJW0q2REGcf79oYPsLyskQCZG1PLN+S/K1V00joZAoQ=="
        },
        "node_modules/on-finished": {
            "version": "2.4.1",
            "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
            "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
            "dependencies": {
                "ee-first": "1.1.1"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/once": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
            "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
            "dependencies": {
                "wrappy": "1"
            }
        },
        "node_modules/openapi-types": {
            "version": "12.1.3",
            "resolved": "https://registry.npmjs.org/openapi-types/-/openapi-types-12.1.3.tgz",
            "integrity": "sha512-N4YtSYJqghVu4iek2ZUvcN/0aqH1kRDuNqzcycDxhOUpg7GdvLa2F3DgS6yBNhInhv2r/6I0Flkn7CqL8+nIcw==",
            "peer": true
        },
        "node_modules/parseurl": {
            "version": "1.3.3",
            "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
            "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/path-is-absolute": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
            "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/path-to-regexp": {
            "version": "8.3.0",
            "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.3.0.tgz",
            "integrity": "sha512-7jdwVIRtsP8MYpdXSwOS0YdD0Du+qOoF/AEPIt88PcCFrZCzx41oxku1jD88hZBwbNUIEfpqvuhjFaMAqMTWnA==",
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/pathe": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
            "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w=="
        },
        "node_modules/perfect-debounce": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/perfect-debounce/-/perfect-debounce-1.0.0.tgz",
            "integrity": "sha512-xCy9V055GLEqoFaHoC1SoLIaLmWctgCUaBaWxDZ7/Zx4CTyX7cJQLJOok/orfjZAh9kEYpjJa4d0KcJmCbctZA=="
        },
        "node_modules/picomatch": {
            "version": "2.3.1",
            "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.1.tgz",
            "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
            "dev": true,
            "engines": {
                "node": ">=8.6"
            },
            "funding": {
                "url": "https://github.com/sponsors/jonschlinkert"
            }
        },
        "node_modules/pkg-types": {
            "version": "2.3.0",
            "resolved": "https://registry.npmjs.org/pkg-types/-/pkg-types-2.3.0.tgz",
            "integrity": "sha512-SIqCzDRg0s9npO5XQ3tNZioRY1uK06lA41ynBC1YmFTmnY6FjUjVt6s4LoADmwoig1qqD0oK8h1p/8mlMx8Oig==",
            "dependencies": {
                "confbox": "^0.2.2",
                "exsolve": "^1.0.7",
                "pathe": "^2.0.3"
            }
        },
        "node_modules/prisma": {
            "version": "6.16.2",
            "resolved": "https://registry.npmjs.org/prisma/-/prisma-6.16.2.tgz",
            "integrity": "sha512-aRvldGE5UUJTtVmFiH3WfNFNiqFlAtePUxcI0UEGlnXCX7DqhiMT5TRYwncHFeA/Reca5W6ToXXyCMTeFPdSXA==",
            "hasInstallScript": true,
            "dependencies": {
                "@prisma/config": "6.16.2",
                "@prisma/engines": "6.16.2"
            },
            "bin": {
                "prisma": "build/index.js"
            },
            "engines": {
                "node": ">=18.18"
            },
            "peerDependencies": {
                "typescript": ">=5.1.0"
            },
            "peerDependenciesMeta": {
                "typescript": {
                    "optional": true
                }
            }
        },
        "node_modules/proxy-addr": {
            "version": "2.0.7",
            "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
            "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
            "dependencies": {
                "forwarded": "0.2.0",
                "ipaddr.js": "1.9.1"
            },
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/pstree.remy": {
            "version": "1.1.8",
            "resolved": "https://registry.npmjs.org/pstree.remy/-/pstree.remy-1.1.8.tgz",
            "integrity": "sha512-77DZwxQmxKnu3aR542U+X8FypNzbfJ+C5XQDk3uWjWxn6151aIMGthWYRXTqT1E5oJvg+ljaa2OJi+VfvCOQ8w==",
            "dev": true
        },
        "node_modules/pure-rand": {
            "version": "6.1.0",
            "resolved": "https://registry.npmjs.org/pure-rand/-/pure-rand-6.1.0.tgz",
            "integrity": "sha512-bVWawvoZoBYpp6yIoQtQXHZjmz35RSVHnUOTefl8Vcjr8snTPY1wnpSPMWekcFwbxI6gtmT7rSYPFvz71ldiOA==",
            "funding": [
                {
                    "type": "individual",
                    "url": "https://github.com/sponsors/dubzzz"
                },
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/fast-check"
                }
            ]
        },
        "node_modules/qs": {
            "version": "6.14.0",
            "resolved": "https://registry.npmjs.org/qs/-/qs-6.14.0.tgz",
            "integrity": "sha512-YWWTjgABSKcvs/nWBi9PycY/JiPJqOD4JA6o9Sej2AtvSGarXxKC3OQSk4pAarbdQlKAh5D4FCQkJNkW+GAn3w==",
            "dependencies": {
                "side-channel": "^1.1.0"
            },
            "engines": {
                "node": ">=0.6"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/range-parser": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
            "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/rate-limit-redis": {
            "version": "4.2.2",
            "resolved": "https://registry.npmjs.org/rate-limit-redis/-/rate-limit-redis-4.2.2.tgz",
            "integrity": "sha512-0SGzpSCZQgkJuUK5AqGaUkgwTMaujWIek0PwlZBDsdNIcasrJae8AC47tP5UHayqDcocJxtogL6DnZFTLoruUw==",
            "engines": {
                "node": ">= 16"
            },
            "peerDependencies": {
                "express-rate-limit": ">= 6"
            }
        },
        "node_modules/raw-body": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.1.tgz",
            "integrity": "sha512-9G8cA+tuMS75+6G/TzW8OtLzmBDMo8p1JRxN5AZ+LAp8uxGA8V8GZm4GQ4/N5QNQEnLmg6SS7wyuSmbKepiKqA==",
            "dependencies": {
                "bytes": "3.1.2",
                "http-errors": "2.0.0",
                "iconv-lite": "0.7.0",
                "unpipe": "1.0.0"
            },
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/raw-body/node_modules/iconv-lite": {
            "version": "0.7.0",
            "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.0.tgz",
            "integrity": "sha512-cf6L2Ds3h57VVmkZe+Pn+5APsT7FpqJtEhhieDCvrE2MK5Qk9MyffgQyuxQTm6BChfeZNtcOLHp9IcWRVcIcBQ==",
            "dependencies": {
                "safer-buffer": ">= 2.1.2 < 3.0.0"
            },
            "engines": {
                "node": ">=0.10.0"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/rc9": {
            "version": "2.1.2",
            "resolved": "https://registry.npmjs.org/rc9/-/rc9-2.1.2.tgz",
            "integrity": "sha512-btXCnMmRIBINM2LDZoEmOogIZU7Qe7zn4BpomSKZ/ykbLObuBdvG+mFq11DL6fjH1DRwHhrlgtYWG96bJiC7Cg==",
            "dependencies": {
                "defu": "^6.1.4",
                "destr": "^2.0.3"
            }
        },
        "node_modules/readdirp": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
            "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
            "dev": true,
            "dependencies": {
                "picomatch": "^2.2.1"
            },
            "engines": {
                "node": ">=8.10.0"
            }
        },
        "node_modules/resend": {
            "version": "6.1.0",
            "resolved": "https://registry.npmjs.org/resend/-/resend-6.1.0.tgz",
            "integrity": "sha512-H0cJI2pcLk5/dGwyvZUHu+O7X/q6arvc40EWm+pRPuy+PSWojH5utZtmDBUZ2L0+gVwYZiWs6y2lw6GQA1z1rg==",
            "engines": {
                "node": ">=18"
            },
            "peerDependencies": {
                "@react-email/render": "^1.1.0"
            },
            "peerDependenciesMeta": {
                "@react-email/render": {
                    "optional": true
                }
            }
        },
        "node_modules/router": {
            "version": "2.2.0",
            "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
            "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
            "dependencies": {
                "debug": "^4.4.0",
                "depd": "^2.0.0",
                "is-promise": "^4.0.0",
                "parseurl": "^1.3.3",
                "path-to-regexp": "^8.0.0"
            },
            "engines": {
                "node": ">= 18"
            }
        },
        "node_modules/safe-buffer": {
            "version": "5.2.1",
            "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
            "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/feross"
                },
                {
                    "type": "patreon",
                    "url": "https://www.patreon.com/feross"
                },
                {
                    "type": "consulting",
                    "url": "https://feross.org/support"
                }
            ]
        },
        "node_modules/safer-buffer": {
            "version": "2.1.2",
            "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
            "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg=="
        },
        "node_modules/semver": {
            "version": "7.7.2",
            "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.2.tgz",
            "integrity": "sha512-RF0Fw+rO5AMf9MAyaRXI4AV0Ulj5lMHqVxxdSgiVbixSCXoEmmX/jk0CuJw4+3SqroYO9VoUh+HcuJivvtJemA==",
            "bin": {
                "semver": "bin/semver.js"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/send": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/send/-/send-1.2.0.tgz",
            "integrity": "sha512-uaW0WwXKpL9blXE2o0bRhoL2EGXIrZxQ2ZQ4mgcfoBxdFmQold+qWsD2jLrfZ0trjKL6vOw0j//eAwcALFjKSw==",
            "dependencies": {
                "debug": "^4.3.5",
                "encodeurl": "^2.0.0",
                "escape-html": "^1.0.3",
                "etag": "^1.8.1",
                "fresh": "^2.0.0",
                "http-errors": "^2.0.0",
                "mime-types": "^3.0.1",
                "ms": "^2.1.3",
                "on-finished": "^2.4.1",
                "range-parser": "^1.2.1",
                "statuses": "^2.0.1"
            },
            "engines": {
                "node": ">= 18"
            }
        },
        "node_modules/serve-static": {
            "version": "2.2.0",
            "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.0.tgz",
            "integrity": "sha512-61g9pCh0Vnh7IutZjtLGGpTA355+OPn2TyDv/6ivP2h/AdAVX9azsoxmg2/M6nZeQZNYBEwIcsne1mJd9oQItQ==",
            "dependencies": {
                "encodeurl": "^2.0.0",
                "escape-html": "^1.0.3",
                "parseurl": "^1.3.3",
                "send": "^1.2.0"
            },
            "engines": {
                "node": ">= 18"
            }
        },
        "node_modules/setprototypeof": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
            "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw=="
        },
        "node_modules/side-channel": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
            "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.3",
                "side-channel-list": "^1.0.0",
                "side-channel-map": "^1.0.1",
                "side-channel-weakmap": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-list": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz",
            "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-map": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
            "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-weakmap": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
            "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3",
                "side-channel-map": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/simple-update-notifier": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/simple-update-notifier/-/simple-update-notifier-2.0.0.tgz",
            "integrity": "sha512-a2B9Y0KlNXl9u/vsW6sTIu9vGEpfKu2wRV6l1H3XEas/0gUIzGzBoP/IouTcUQbm9JWZLH3COxyn03TYlFax6w==",
            "dev": true,
            "dependencies": {
                "semver": "^7.5.3"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/statuses": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
            "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/supports-color": {
            "version": "5.5.0",
            "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
            "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
            "dev": true,
            "dependencies": {
                "has-flag": "^3.0.0"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/swagger-jsdoc": {
            "version": "6.2.8",
            "resolved": "https://registry.npmjs.org/swagger-jsdoc/-/swagger-jsdoc-6.2.8.tgz",
            "integrity": "sha512-VPvil1+JRpmJ55CgAtn8DIcpBs0bL5L3q5bVQvF4tAW/k/9JYSj7dCpaYCAv5rufe0vcCbBRQXGvzpkWjvLklQ==",
            "dependencies": {
                "commander": "6.2.0",
                "doctrine": "3.0.0",
                "glob": "7.1.6",
                "lodash.mergewith": "^4.6.2",
                "swagger-parser": "^10.0.3",
                "yaml": "2.0.0-1"
            },
            "bin": {
                "swagger-jsdoc": "bin/swagger-jsdoc.js"
            },
            "engines": {
                "node": ">=12.0.0"
            }
        },
        "node_modules/swagger-parser": {
            "version": "10.0.3",
            "resolved": "https://registry.npmjs.org/swagger-parser/-/swagger-parser-10.0.3.tgz",
            "integrity": "sha512-nF7oMeL4KypldrQhac8RyHerJeGPD1p2xDh900GPvc+Nk7nWP6jX2FcC7WmkinMoAmoO774+AFXcWsW8gMWEIg==",
            "dependencies": {
                "@apidevtools/swagger-parser": "10.0.3"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/swagger-ui-dist": {
            "version": "5.29.0",
            "resolved": "https://registry.npmjs.org/swagger-ui-dist/-/swagger-ui-dist-5.29.0.tgz",
            "integrity": "sha512-gqs7Md3AxP4mbpXAq31o5QW+wGUZsUzVatg70yXpUR245dfIis5jAzufBd+UQM/w2xSfrhvA1eqsrgnl2PbezQ==",
            "dependencies": {
                "@scarf/scarf": "=1.4.0"
            }
        },
        "node_modules/swagger-ui-express": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/swagger-ui-express/-/swagger-ui-express-5.0.1.tgz",
            "integrity": "sha512-SrNU3RiBGTLLmFU8GIJdOdanJTl4TOmT27tt3bWWHppqYmAZ6IDuEuBvMU6nZq0zLEe6b/1rACXCgLZqO6ZfrA==",
            "dependencies": {
                "swagger-ui-dist": ">=5.0.0"
            },
            "engines": {
                "node": ">= v0.10.32"
            },
            "peerDependencies": {
                "express": ">=4.0.0 || >=5.0.0-beta"
            }
        },
        "node_modules/tinyexec": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/tinyexec/-/tinyexec-1.0.1.tgz",
            "integrity": "sha512-5uC6DDlmeqiOwCPmK9jMSdOuZTh8bU39Ys6yidB+UTt5hfZUPGAypSgFRiEp+jbi9qH40BLDvy85jIU88wKSqw=="
        },
        "node_modules/to-regex-range": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
            "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
            "dev": true,
            "dependencies": {
                "is-number": "^7.0.0"
            },
            "engines": {
                "node": ">=8.0"
            }
        },
        "node_modules/toidentifier": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
            "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
            "engines": {
                "node": ">=0.6"
            }
        },
        "node_modules/touch": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/touch/-/touch-3.1.1.tgz",
            "integrity": "sha512-r0eojU4bI8MnHr8c5bNo7lJDdI2qXlWWJk6a9EAFG7vbhTjElYhBVS3/miuE0uOuoLdb8Mc/rVfsmm6eo5o9GA==",
            "dev": true,
            "bin": {
                "nodetouch": "bin/nodetouch.js"
            }
        },
        "node_modules/type-is": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.0.1.tgz",
            "integrity": "sha512-OZs6gsjF4vMp32qrCbiVSkrFmXtG/AZhY3t0iAMrMBiAZyV9oALtXO8hsrHbMXF9x6L3grlFuwW2oAz7cav+Gw==",
            "dependencies": {
                "content-type": "^1.0.5",
                "media-typer": "^1.1.0",
                "mime-types": "^3.0.0"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/uncrypto": {
            "version": "0.1.3",
            "resolved": "https://registry.npmjs.org/uncrypto/-/uncrypto-0.1.3.tgz",
            "integrity": "sha512-Ql87qFHB3s/De2ClA9e0gsnS6zXG27SkTiSJwjCc9MebbfapQfuPzumMIUMi38ezPZVNFcHI9sUIepeQfw8J8Q=="
        },
        "node_modules/undefsafe": {
            "version": "2.0.5",
            "resolved": "https://registry.npmjs.org/undefsafe/-/undefsafe-2.0.5.tgz",
            "integrity": "sha512-WxONCrssBM8TSPRqN5EmsjVrsv4A8X12J4ArBiiayv3DyyG3ZlIg6yysuuSYdZsVz3TKcTg2fd//Ujd4CHV1iA==",
            "dev": true
        },
        "node_modules/unpipe": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
            "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/validator": {
            "version": "13.15.15",
            "resolved": "https://registry.npmjs.org/validator/-/validator-13.15.15.tgz",
            "integrity": "sha512-BgWVbCI72aIQy937xbawcs+hrVaN/CZ2UwutgaJ36hGqRrLNM+f5LUT/YPRbo8IV/ASeFzXszezV+y2+rq3l8A==",
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/vary": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
            "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/wrappy": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
            "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ=="
        },
        "node_modules/yaml": {
            "version": "2.0.0-1",
            "resolved": "https://registry.npmjs.org/yaml/-/yaml-2.0.0-1.tgz",
            "integrity": "sha512-W7h5dEhywMKenDJh2iX/LABkbFnBxasD27oyXWDS/feDsxiw0dD5ncXdYXgkvAsXIY2MpW/ZKkr9IU30DBdMNQ==",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/z-schema": {
            "version": "5.0.5",
            "resolved": "https://registry.npmjs.org/z-schema/-/z-schema-5.0.5.tgz",
            "integrity": "sha512-D7eujBWkLa3p2sIpJA0d1pr7es+a7m0vFAnZLlCEKq/Ij2k0MLi9Br2UPxoxdYystm5K1yeBGzub0FlYUEWj2Q==",
            "dependencies": {
                "lodash.get": "^4.4.2",
                "lodash.isequal": "^4.5.0",
                "validator": "^13.7.0"
            },
            "bin": {
                "z-schema": "bin/z-schema"
            },
            "engines": {
                "node": ">=8.0.0"
            },
            "optionalDependencies": {
                "commander": "^9.4.1"
            }
        },
        "node_modules/z-schema/node_modules/commander": {
            "version": "9.5.0",
            "resolved": "https://registry.npmjs.org/commander/-/commander-9.5.0.tgz",
            "integrity": "sha512-KRs7WVDKg86PWiuAqhDrAQnTXZKraVcCc6vFdL14qrZ/DcWwuRo7VoiYXalXO7S5GKpqYiVEwCbgFDfxNHKJBQ==",
            "optional": true,
            "engines": {
                "node": "^12.20.0 || >=14"
            }
        }
    }
}

```

## File: package.json
```json
{
    "name": "JustNotess",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "build": "npm install && prisma generate",
        "start": "node src/server.js",
        "dev": "nodemon src/server.js",
        "test": "echo \"Error: no test specified\" && exit 1",
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:studio": "prisma studio",
        "db:migrate": "prisma migrate dev --name init"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@prisma/client": "^6.16.2",
        "@upstash/ratelimit": "^2.0.6",
        "@upstash/redis": "^1.35.4",
        "bcrypt": "^6.0.0",
        "cors": "^2.8.5",
        "dotenv": "^17.2.2",
        "express": "^5.1.0",
        "express-rate-limit": "^8.1.0",
        "express-validator": "^7.2.1",
        "helmet": "^8.1.0",
        "jsonwebtoken": "^9.0.2",
        "nodemailer": "^7.0.6",
        "prisma": "^6.16.2",
        "rate-limit-redis": "^4.2.2",
        "resend": "^6.1.0",
        "swagger-jsdoc": "^6.2.8",
        "swagger-ui-express": "^5.0.0"
    },
    "devDependencies": {
        "nodemon": "^3.1.10"
    },
    "type": "module"
}

```

## File: prisma/migrations/20250925084741_init/migration.sql
```sql
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "public"."refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```

## File: prisma/migrations/20250927110643_init/migration.sql
```sql
/*
  Warnings:

  - You are about to drop the column `category` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_username_key";

-- AlterTable
ALTER TABLE "public"."notes" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT;

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#6B73FF',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "public"."categories"("userId", "name");

-- CreateIndex
CREATE INDEX "notes_userId_categoryId_idx" ON "public"."notes"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "notes_userId_isPinned_idx" ON "public"."notes"("userId", "isPinned");

-- CreateIndex
CREATE INDEX "notes_userId_createdAt_idx" ON "public"."notes"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

```

## File: prisma/migrations/20250929052200_add_verification_code/migration.sql
```sql
/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "verificationToken",
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpiry" TIMESTAMP(3);

```

## File: prisma/migrations/20250929054537_add_e2ee_support/migration.sql
```sql
-- DropIndex
DROP INDEX "public"."categories_userId_name_key";

-- AlterTable
ALTER TABLE "public"."notes" ADD COLUMN     "encryptedKey" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "encryptedPrivateKey" TEXT,
ADD COLUMN     "publicKey" TEXT;

-- CreateIndex
CREATE INDEX "categories_userId_idx" ON "public"."categories"("userId");

```

## File: prisma/migrations/20250929090511_add_field_constraints_and_unique_indexes/migration.sql
```sql
/*
  Warnings:

  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `verificationCode` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - A unique constraint covering the columns `[userId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `notes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "verificationCode" SET DATA TYPE VARCHAR(6);

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "public"."categories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "notes_userId_title_key" ON "public"."notes"("userId", "title");

```

## File: prisma/migrations/20251001211303_remove_encryption_fields/migration.sql
```sql
/*
  Warnings:

  - You are about to drop the column `encryptedKey` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedPrivateKey` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notes" DROP COLUMN "encryptedKey";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "encryptedPrivateKey",
DROP COLUMN "publicKey";

```

## File: prisma/migrations/migration_lock.toml
```toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"

```

## File: prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id                     String         @id @default(cuid())
  password               String
  role                   UserRole       @default(USER)
  createdAt              DateTime       @default(now())
  email                  String         @unique @db.VarChar(255)
  isVerified             Boolean        @default(false)
  verificationCode       String?        @db.VarChar(6)
  verificationCodeExpiry DateTime?  
  categories             Category[]
  notes                  Note[]
  refreshTokens          RefreshToken[]

  @@map("users")
}

model Category {
  id          String   @id @default(cuid())
  name        String   @db.Text 
  description String?  @db.Text 
  color       String?  @default("#6B73FF")
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes       Note[]

  @@index([userId])
  @@unique([userId, name])
  @@map("categories")
}

model Note {
  id            String    @id @default(cuid())
  title         String    @db.Text  
  content       String    @db.Text  
  isPinned      Boolean   @default(false)
  tags          String[]  
  userId        String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, categoryId])
  @@index([userId, isPinned])
  @@index([userId, createdAt])
  @@unique([userId, title])
  @@map("notes")
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique @db.VarChar(500)
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

enum UserRole {
  ADMIN
  USER
}
```

## File: src/app.js
```js
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Note App API Documentation",
    })
);

app.use("/api", routes);

app.use(errorHandler);

export default app;

```

## File: src/config/database.js
```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export async function connectDb() {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected via Prisma");
    } catch (err) {
        console.log("Database connection error", err.message);
        process.exit(1);
    }
}

```

## File: src/config/redis.js
```js
// src/config/redis.js
import { Redis } from "@upstash/redis";

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redisClient;

```

## File: src/config/swagger.js
```js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Note-Taking API",
            version: "1.0.0",
            description: `
# Note-Taking API

A secure note-taking application with user authentication and organization features.

## Features:
- User registration and authentication
- Note creation, reading, updating, and deletion
- Category organization
- Tagging system
- Email verification
- Password reset

## Security:
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
            `.trim(),
            contact: {
                name: "API Support",
                email: "support@noteapp.com",
            },
        },
        servers: [
            {
                url: process.env.APP_URL || "http://localhost:3001",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your access token",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "User unique identifier",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                        },
                        role: {
                            type: "string",
                            enum: ["USER", "ADMIN"],
                            description: "User role",
                        },
                        isVerified: {
                            type: "boolean",
                            description: "Email verification status",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Account creation timestamp",
                        },
                    },
                },
                Category: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Category unique identifier",
                        },
                        name: {
                            type: "string",
                            description: "Category name",
                            example: "Work",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            description: "Category description",
                            example: "Work-related notes",
                        },
                        color: {
                            type: "string",
                            default: "#6B73FF",
                            description: "Category color in hex format",
                        },
                        userId: {
                            type: "string",
                            description: "Owner user ID",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Note: {
                    type: "object",
                    required: ["title", "content"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Note unique identifier",
                        },
                        title: {
                            type: "string",
                            description: "Note title",
                            example: "My First Note",
                        },
                        content: {
                            type: "string",
                            description: "Note content",
                            example: "This is the content of my note.",
                        },
                        categoryId: {
                            type: "string",
                            nullable: true,
                            description: "Associated category ID",
                        },
                        category: {
                            $ref: "#/components/schemas/Category",
                            nullable: true,
                        },
                        isPinned: {
                            type: "boolean",
                            default: false,
                            description: "Whether the note is pinned",
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string",
                                description: "Note tag",
                            },
                            description: "Note tags",
                            example: ["work", "important"],
                        },
                        userId: {
                            type: "string",
                            description: "Owner user ID",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            description: "Operation success status",
                        },
                        message: {
                            type: "string",
                            description: "Response message",
                        },
                        data: {
                            type: "object",
                            description: "Response data",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        msg: {
                            type: "string",
                            description: "Error message",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                            },
                            description: "Validation errors",
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/routes/*.js",
        "./src/routes/**/*.js",
        "./src/routes/auth/*.js",
        "./src/routes/auth/**/*.js",
    ],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

```

## File: src/controllers/auth/authController.js
```js
import {
    registerService,
    loginService,
    refreshTokenService,
    logoutService,
} from "../../services/auth/authService.js";

export async function register(req, res) {
    try {
        const result = await registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const result = await loginService(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            return res.status(400).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Please verify your email before logging in") {
            return res.status(403).json({
                success: false,
                msg: error.message,
                code: "EMAIL_NOT_VERIFIED",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const result = await refreshTokenService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        if (
            error.message === "Refresh token required" ||
            error.message === "Invalid refresh token" ||
            error.message === "User not found or not verified"
        ) {
            return res.status(403).json({
                success: false,
                msg: error.message,
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    try {
        const result = await logoutService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

```

## File: src/controllers/auth/emailVerificationController.js
```js
import {
    verifyEmailService,
    resendVerificationService,
} from "../../services/auth/emailVerificationService.js";

export async function verifyEmailHandler(req, res) {
    try {
        const result = await verifyEmailService(req.body.code);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function resendVerificationHandler(req, res) {
    try {
        const result = await resendVerificationService(req.body.email);
        res.json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Email is already verified") {
            return res.status(400).json({
                success: false,
                msg: error.message,
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

```

## File: src/controllers/auth/passwordResetController.js
```js
import {
    forgotPasswordService,
    resetPasswordService,
} from "../../services/auth/passwordResetService.js";

export async function forgotPasswordHandler(req, res) {
    try {
        const result = await forgotPasswordService(req.body.email);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function resetPasswordHandler(req, res) {
    try {
        const result = await resetPasswordService(
            req.body.code,
            req.body.newPassword
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

```

## File: src/controllers/categoryController.js
```js
import * as categoryService from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(
            req.user.id,
            req.body
        );
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        if (error.code === "P2002") {
            // Prisma unique constraint violation
            return res.status(400).json({
                success: false,
                msg: "A category with this name already exists",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getUserCategories(req.user.id);
        res.json({
            success: true,
            data: categories,
            message:
                categories.length === 0
                    ? "No categories found"
                    : "Categories retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            data: category,
            message: "Category retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.user.id,
            req.params.id,
            req.body
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                msg: "A category with this name already exists",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategoryNotes = async (req, res) => {
    try {
        const categoryWithNotes = await categoryService.getCategoryWithNotes(
            req.user.id,
            req.params.id
        );
        if (!categoryWithNotes) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            data: categoryWithNotes,
            message: "Category notes retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

```

## File: src/controllers/noteController.js
```js
import * as noteService from "../services/noteService.js";

export const createNote = async (req, res) => {
    try {
        const note = await noteService.createNote(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await noteService.getNotes(req.user.id);
        res.json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const note = await noteService.getNoteById(req.user.id, req.params.id);
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const updateNote = async (req, res) => {
    try {
        const note = await noteService.updateNote(
            req.user.id,
            req.params.id,
            req.body
        );
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const note = await noteService.deleteNote(req.user.id, req.params.id);
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

```

## File: src/middlewares/authMiddleware.js
```js
import { verifyAccessToken } from "../utils/generateToken.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Invalid token format" });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded.isVerified) {
            return res.status(403).json({
                success: false,
                msg: "Please verify your email before accessing this resource",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                msg: "Access token expired",
                code: "TOKEN_EXPIRED",
            });
        }
        return res.status(403).json({ msg: "Invalid token" });
    }
}

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Forbidden" });
        }
        next();
    };
}

```

## File: src/middlewares/emailRateLimit.js
```js
import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "../config/redis.js";

export const emailRateLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
});

export async function checkEmailRateLimit(identifier) {
    const { success, reset } = await emailRateLimiter.limit(identifier);
    if (!success) {
        throw new Error(
            `Email rate limit exceeded. Try again at ${new Date(reset)}`
        );
    }
}

```

## File: src/middlewares/errorHandler.js
```js
export function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            msg: "Validation Error",
            errors: err.errors,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            msg: "Record not found",
        });
    }

    res.status(500).json({
        success: false,
        msg: "Internal server error",
    });
}

```

## File: src/middlewares/rateLimiter.js
```js
import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "../config/redis.js";

export const apiLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(100, "15 m"),
    analytics: true,
});

export const authLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(10, "15 m"), 
    analytics: true,
});

```

## File: src/middlewares/validation.js
```js
import { body, param, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

// Note validation helpers
export const validateNoteData = (fieldName, maxLength = 100000) => [
    body(fieldName)
        .isLength({ min: 1, max: maxLength })
        .withMessage(`${fieldName} is required`)
        .isString()
        .withMessage(`${fieldName} must be a string`),
];

export const validateTags = [
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
            if (tags && tags.length > 0) {
                for (const tag of tags) {
                    if (typeof tag !== "string") {
                        throw new Error("Each tag must be a string");
                    }
                }
            }
            return true;
        }),
];

// Category validation helpers
export const validateCategoryData = [
    body("name")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Category name is required and must be less than 255 characters"
        )
        .isString()
        .withMessage("Category name must be a string"),

    body("description")
        .optional({ nullable: true, checkFalsy: true }) // Allow null, undefined, or empty string
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
];

// Auth validations
export const validateRegister = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    body("role")
        .optional()
        .isIn(["USER", "ADMIN"])
        .withMessage("Role must be either USER or ADMIN")
        .toUpperCase(),

    handleValidationErrors,
];

export const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),

    handleValidationErrors,
];

export const validateRefreshToken = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),

    handleValidationErrors,
];

// Note validations
export const validateCreateNote = [
    ...validateNoteData("title", 255),
    ...validateNoteData("content", 100000),
    ...validateTags,

    body("categoryId")
        .optional({ nullable: true, checkFalsy: true })
        .custom((value) => {
            // Allow null, undefined, empty string, or valid string
            if (value === null || value === undefined || value === "") {
                return true;
            }
            return typeof value === "string";
        })
        .withMessage("Category ID must be a string"),

    body("isPinned")
        .optional()
        .isBoolean()
        .withMessage("isPinned must be a boolean"),

    handleValidationErrors,
];

export const validateUpdateNote = [
    param("id").isLength({ min: 1 }).withMessage("Note ID is required"),

    body("title")
        .optional()
        .isString()
        .isLength({ max: 255 })
        .withMessage("Title must be a string and less than 255 characters"),

    body("content")
        .optional()
        .isString()
        .isLength({ max: 100000 })
        .withMessage(
            "Content must be a string and less than 100000 characters"
        ),

    ...validateTags,

    body("categoryId")
        .optional({ nullable: true, checkFalsy: true })
        .custom((value) => {
            // Allow null, undefined, empty string, or valid string
            if (value === null || value === undefined || value === "") {
                return true;
            }
            return typeof value === "string";
        })
        .withMessage("Category ID must be a string"),

    body("isPinned")
        .optional()
        .isBoolean()
        .withMessage("isPinned must be a boolean"),

    handleValidationErrors,
];

export const validateNoteId = [
    param("id").isLength({ min: 1 }).withMessage("Note ID is required"),

    handleValidationErrors,
];

// Email validations
export const validateEmail = [
    body("email").isEmail().withMessage("Valid email is required"),
    handleValidationErrors,
];

export const validatePasswordReset = [
    body("code")
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage("Valid 6-digit code is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    handleValidationErrors,
];

export const validateVerificationCode = [
    body("code")
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage("Valid 6-digit code is required"),

    handleValidationErrors,
];

// Category validations
export const validateCategory = [
    ...validateCategoryData,

    body("color")
        .optional()
        .isHexColor()
        .withMessage("Color must be a valid hex color"),

    handleValidationErrors,
];

export const validateCategoryUpdate = [
    param("id").isLength({ min: 1 }).withMessage("Category ID is required"),

    body("name")
        .optional()
        .isString()
        .isLength({ max: 255 })
        .withMessage(
            "Category name must be a string and less than 255 characters"
        ),

    body("description")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),

    body("color")
        .optional()
        .isHexColor()
        .withMessage("Color must be a valid hex color"),

    handleValidationErrors,
];
```

## File: src/middlewares/withRateLimit.js
```js
export function withRateLimit(limiter) {
    return async function (req, res, next) {
        const ip = req.ip ?? "127.0.0.1";
        const { success, reset, remaining } = await limiter.limit(ip);

        if (!success) {
            return res.status(429).json({
                success: false,
                msg: "Too many requests, please try again later.",
                reset,
            });
        }

        next();
    };
}

```

## File: src/routes/auth/authRoutes.js
```js
import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../../controllers/auth/authController.js";
import {
    validateRegister,
    validateLogin,
    validateRefreshToken,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: User registered, verification code sent
 */
router.post("/register", validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (requires verified email)
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       400:
 *         description: Invalid credentials or email not verified
 *       403:
 *         description: Email not verified
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security: []
 */
router.post("/refresh", validateRefreshToken, refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security: []
 */
router.post("/logout", logout);

export default router;
```

## File: src/routes/auth/emailVerificationRoutes.js
```js
import express from "express";
import {
    verifyEmailHandler,
    resendVerificationHandler,
} from "../../controllers/auth/emailVerificationController.js";
import {
    validateVerificationCode,
    validateEmail,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/email/verify:
 *   post:
 *     summary: Verify email with 6-digit code
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify", validateVerificationCode, verifyEmailHandler);

/**
 * @swagger
 * /api/auth/email/resend:
 *   post:
 *     summary: Resend verification code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/resend", validateEmail, resendVerificationHandler);

export default router;

```

## File: src/routes/auth/index.js
```js
import express from "express";
import authRoutes from "./authRoutes.js";
import emailVerificationRoutes from "./emailVerificationRoutes.js";
import passwordResetRoutes from "./passwordResetRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/email", emailVerificationRoutes);
router.use("/password", passwordResetRoutes);

export default router;

```

## File: src/routes/auth/passwordResetRoutes.js
```js
import express from "express";
import {
    forgotPasswordHandler,
    resetPasswordHandler,
} from "../../controllers/auth/passwordResetController.js";
import {
    validateEmail,
    validatePasswordReset,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/password/forgot:
 *   post:
 *     summary: Request password reset code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/forgot", validateEmail, forgotPasswordHandler);

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     summary: Reset password with 6-digit code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/reset", validatePasswordReset, resetPasswordHandler);

export default router;

```

## File: src/routes/auth.js
```js
import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

router.use("/", authRouter);

export default router;

```

## File: src/routes/categories.js
```js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    validateCategory,
    validateCategoryUpdate,
} from "../middlewares/validation.js";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all user categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work"
 *                 description: "Category name"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Work-related notes"
 *                 description: "Category description"
 *               color:
 *                 type: string
 *                 default: "#6B73FF"
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", validateCategory, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Category'
 *                         - type: object
 *                           properties:
 *                             notes:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}/notes:
 *   get:
 *     summary: Get all notes for a specific category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/:id/notes", categoryController.getCategoryNotes);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category"
 *                 description: "Updated category name"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated description"
 *                 description: "Updated category description"
 *               color:
 *                 type: string
 *                 example: "#33FF57"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", validateCategoryUpdate, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", categoryController.deleteCategory);

export default router;

```

## File: src/routes/docs.js
```js
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: API Documentation
 *     description: Interactive API documentation powered by Swagger UI
 *     tags: [Documentation]
 *     security: []
 *     responses:
 *       200:
 *         description: Swagger UI documentation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

export default router;
```

## File: src/routes/index.js
```js
import express from "express";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";
import categoryRoutes from "./categories.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Notes
 *     description: Note management endpoints
 *   - name: Categories
 *     description: Category management endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Note API is running"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Note API is running",
        version: "1.0.0",
    });
});

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/categories", categoryRoutes);

export default router;

```

## File: src/routes/notes.js
```js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/noteController.js";
import {
    validateCreateNote,
    validateUpdateNote,
    validateNoteId,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all user notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateNoteId, getNoteById);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "My First Note"
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 example: "This is the content of my note."
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *                 example: "clx123abc456"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 30
 *                 example: ["work", "important"]
 *               isPinned:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", validateCreateNote, createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Updated Note Title"
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 example: "Updated note content."
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *                 example: "clx123abc456"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 30
 *                 example: ["updated", "work"]
 *               isPinned:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", validateUpdateNote, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", validateNoteId, deleteNote);

export default router;

```

## File: src/server.js
```js
import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/database.js";
import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();

async function startServer() {
    try {
        const emailReady = await verifyEmailConnection();
        if (!emailReady) {
            console.warn(
                "Email service is not available. Email-related features will not work."
            );
        }
        await connectDb();
        app.listen(PORT);
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

```

## File: src/services/auth/authService.js
```js
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../utils/generateToken.js";
import {
    addRefreshToken,
    removeRefreshToken,
    isValidRefreshToken,
} from "../refreshTokenService.js";
import {
    createUser,
    verifyUserCredentials,
    findUserById,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function registerService(userData) {
    const { email, password, role } = userData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = await createUser(email, password, role || "USER");

    await sendVerificationEmail(email, newUser.verificationCode);

    return {
        success: true,
        message:
            "User registered successfully. Please check your email for the 6-digit verification code.",
        data: {
            userId: newUser.id,
            email: newUser.email,
        },
    };
}

export async function loginService(credentials) {
    const { email, password } = credentials;
    const user = await verifyUserCredentials(email, password);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    await addRefreshToken(refreshToken, user.id);

    return {
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
            refreshToken,
        },
    };
}

export async function refreshTokenService(refreshToken) {
    if (!refreshToken) {
        throw new Error("Refresh token required");
    }

    const isValid = await isValidRefreshToken(refreshToken);
    if (!isValid) {
        throw new Error("Invalid refresh token");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        throw new Error("Invalid refresh token");
    }

    const user = await findUserById(decoded.id);
    if (!user || !user.isVerified) {
        throw new Error("User not found or not verified");
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await removeRefreshToken(refreshToken);
    await addRefreshToken(newRefreshToken, user.id);

    return {
        success: true,
        message: "Token refreshed successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
    };
}

export async function logoutService(refreshToken) {
    if (refreshToken) {
        await removeRefreshToken(refreshToken);
    }
    return {
        success: true,
        message: "Logged out successfully",
    };
}

```

## File: src/services/auth/emailVerificationService.js
```js
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateToken.js";
import { addRefreshToken } from "../refreshTokenService.js";
import {
    verifyUserEmail,
    updateUserVerificationCode,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function verifyEmailService(code) {
    if (!code) {
        throw new Error("Verification code is required");
    }

    const user = await verifyUserEmail(code);

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    await addRefreshToken(refreshToken, user.id);

    return {
        success: true,
        message: "Email verified successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
            refreshToken,
        },
    };
}

export async function resendVerificationService(email) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("Email is already verified");
    }

    const updatedUser = await updateUserVerificationCode(email);
    await sendVerificationEmail(email, updatedUser.verificationCode);

    return {
        success: true,
        message: "Verification code sent successfully",
    };
}

```

## File: src/services/auth/passwordResetService.js
```js
import {
    setPasswordResetCode,
    resetUserPassword,
    findUserByEmail,
} from "../userService.js";
import { sendPasswordResetEmail } from "../emailService.js";

export async function forgotPasswordService(email) {
    const user = await findUserByEmail(email);

    if (user) {
        const updatedUser = await setPasswordResetCode(email);
        await sendPasswordResetEmail(email, updatedUser.verificationCode);
    }

    return {
        success: true,
        message: "If the email exists, a password reset code has been sent",
    };
}

export async function resetPasswordService(code, newPassword) {
    if (!code || !newPassword) {
        throw new Error("Code and new password are required");
    }

    const user = await resetUserPassword(code, newPassword);

    return {
        success: true,
        message: "Password reset successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
}

```

## File: src/services/categoryService.js
```js
import prisma from "../config/database.js";

export const createCategory = async (userId, data) => {
    const { name, description, color } = data;

    return await prisma.category.create({
        data: {
            name,
            description: description || null,
            color: color || "#6B73FF",
            userId,
        },
    });
};

export const getUserCategories = async (userId) => {
    return await prisma.category.findMany({
        where: { userId },
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: {
                    notes: true,
                },
            },
        },
    });
};

export const getCategoryById = async (userId, categoryId) => {
    return await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            notes: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
};

export const getCategoryWithNotes = async (userId, categoryId) => {
    return await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            notes: {
                orderBy: { createdAt: "desc" },
                include: {
                    category: true,
                },
            },
        },
    });
};

export const updateCategory = async (userId, categoryId, updateData) => {
    return await prisma.category.update({
        where: {
            id: categoryId,
            userId,
        },
        data: updateData,
    });
};

export const deleteCategory = async (userId, categoryId) => {
    return await prisma.category.delete({
        where: {
            id: categoryId,
            userId,
        },
    });
};

```

## File: src/services/emailService.js
```js
import { Resend } from "resend";
import { checkEmailRateLimit } from "../middlewares/emailRateLimit.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
    try {
        console.log("Resend email service configured");
        console.log("=== Email Configuration Check ===");
        console.log(
            "RESEND_API_KEY:",
            process.env.RESEND_API_KEY ? "Configured" : "Missing"
        );
        return true;
    } catch (error) {
        console.error("Resend configuration failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        await checkEmailRateLimit(email);

        const { data, error } = await resend.emails.send({
            from: "JustNotes <onboarding@resend.dev>",
            to: email,
            subject: "Verify Your Email - JustNotes",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                            background-color: #ffffff;
                            color: #000000;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border: 1px solid #e5e5e5;
                        }
                        .header {
                            background: #000000;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border-bottom: 3px solid #6B73FF;
                        }
                        .content {
                            padding: 30px;
                        }
                        .code-container {
                            background: #f8f8f8;
                            border: 2px solid #000000;
                            border-radius: 4px;
                            padding: 25px;
                            margin: 25px 0;
                            text-align: center;
                        }
                        .verification-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #000000;
                        }
                        .footer {
                            background: #f8f8f8;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e5e5e5;
                            font-size: 12px;
                            color: #666666;
                        }
                        .info-box {
                            background: #f8f8f8;
                            border-left: 4px solid #6B73FF;
                            padding: 15px;
                            margin: 20px 0;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px;">JustNotes</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">End-to-End Encrypted Notes</p>
                        </div>
                        
                        <div class="content">
                            <h2 style="margin-top: 0; color: #000000;">Email Verification Required</h2>
                            
                            <p>To complete your JustNotes account setup, please verify your email address using the code below:</p>
                            
                            <div class="code-container">
                                <div class="verification-code">${code}</div>
                            </div>
                            
                            <div class="info-box">
                                <strong>Important:</strong> This verification code will expire in <strong>15 minutes</strong>.
                            </div>
                            
                            <p>Enter this code in the verification screen to activate your account and start creating encrypted notes.</p>
                            
                            <p style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 25px;">
                                <small>
                                    If you didn't create a JustNotes account, please ignore this email.<br>
                                    Your data security is our priority - all notes are encrypted before they leave your device.
                                </small>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p style="margin: 0;">
                                &copy; 2024 JustNotes. All rights reserved.<br>
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
JustNotes - EMAIL VERIFICATION

Verify your email address to complete your JustNotes account setup.

Your verification code: ${code}

This code will expire in 15 minutes.

Enter this code in the verification screen to activate your account.

If you didn't create a JustNotes account, please ignore this email.

--
JustNotes - End-to-End Encrypted Notes
            `,
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log("Verification email sent:", data.id);
        return data;
    } catch (error) {
        if (error.message && error.message.includes("rate limit")) {
            throw error;
        }
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

export const sendPasswordResetEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "JustNotes <onboarding@resend.dev>",
            to: email,
            subject: "Password Reset Request - JustNotes",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                            background-color: #ffffff;
                            color: #000000;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border: 1px solid #e5e5e5;
                        }
                        .header {
                            background: #000000;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border-bottom: 3px solid #dc3545;
                        }
                        .content {
                            padding: 30px;
                        }
                        .code-container {
                            background: #f8f8f8;
                            border: 2px solid #000000;
                            border-radius: 4px;
                            padding: 25px;
                            margin: 25px 0;
                            text-align: center;
                        }
                        .verification-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #dc3545;
                        }
                        .footer {
                            background: #f8f8f8;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e5e5e5;
                            font-size: 12px;
                            color: #666666;
                        }
                        .warning-box {
                            background: #fff3f3;
                            border-left: 4px solid #dc3545;
                            padding: 15px;
                            margin: 20px 0;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px;">JustNotes</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">End-to-End Encrypted Notes</p>
                        </div>
                        
                        <div class="content">
                            <h2 style="margin-top: 0; color: #000000;">Password Reset Request</h2>
                            
                            <p>We received a request to reset your JustNotes account password. Use the code below to proceed:</p>
                            
                            <div class="code-container">
                                <div class="verification-code">${code}</div>
                            </div>
                            
                            <div class="warning-box">
                                <strong>Security Notice:</strong> This reset code will expire in <strong>15 minutes</strong>.
                                If you didn't request this reset, your account may be compromised.
                            </div>
                            
                            <p>Enter this code in the password reset screen to create a new password for your account.</p>
                            
                            <p style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 25px;">
                                <small>
                                    For your security, this code can only be used once.<br>
                                    Remember: JustNotes cannot recover your encrypted data if you lose your encryption password.
                                </small>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p style="margin: 0;">
                                &copy; 2024 JustNotes. All rights reserved.<br>
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
JustNotes - PASSWORD RESET

We received a request to reset your JustNotes account password.

Your password reset code: ${code}

This code will expire in 15 minutes.

Enter this code in the password reset screen to create a new password.

If you didn't request this reset, your account may be compromised.

Remember: JustNotes cannot recover your encrypted data if you lose your encryption password.

--
JustNotes - End-to-End Encrypted Notes
            `,
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log("Password reset email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};

```

## File: src/services/noteService.js
```js
import prisma from "../config/database.js";

export const createNote = async (userId, data) => {
    const { title, content, categoryId, tags, isPinned } = data;

    return await prisma.note.create({
        data: {
            title,
            content,
            categoryId: categoryId || null,
            tags: tags || [],
            isPinned: isPinned || false,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const getNotes = async (userId) => {
    return await prisma.note.findMany({
        where: { userId },
        include: {
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getNoteById = async (userId, noteId) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const updateNote = async (userId, noteId, updateData) => {
    return await prisma.note.update({
        where: {
            id: noteId,
            userId,
        },
        data: updateData,
        include: {
            category: true,
        },
    });
};

export const deleteNote = async (userId, noteId) => {
    return await prisma.note.delete({
        where: {
            id: noteId,
            userId,
        },
    });
};

```

## File: src/services/refreshTokenService.js
```js
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";

export async function addRefreshToken(token, userId) {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });
}

export async function removeRefreshToken(token) {
    const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token },
    });

    if (tokenRecord) {
        return await prisma.refreshToken.delete({
            where: { id: tokenRecord.id },
        });
    }
    return null;
}

export async function isValidRefreshToken(token) {
    const foundToken = await prisma.refreshToken.findFirst({
        where: { token },
    });
    return !!foundToken;
}

export async function clearUserRefreshTokens(userId) {
    return await prisma.refreshToken.deleteMany({
        where: { userId },
    });
}

```

## File: src/services/userService.js
```js
import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateVerificationCode } from "../utils/generateToken.js";

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(email, password, role) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            verificationCode,
            verificationCodeExpiry,
            isVerified: false,
        },
    });
}

export async function verifyUserCredentials(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

export async function verifyUserEmail(code) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired verification code");
    }

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

export async function updateUserVerificationCode(email) {
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode,
            verificationCodeExpiry,
        },
    });
}

export async function setPasswordResetCode(email) {
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode: resetCode,
            verificationCodeExpiry: resetCodeExpiry,
        },
    });
}

export async function resetUserPassword(code, newPassword) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired reset code");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

```

## File: src/utils/generateToken.js
```js
// src/utils/generateToken.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

```

## File: src/utils/hash.js
```js
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
```

