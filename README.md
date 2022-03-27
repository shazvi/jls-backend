## Getting Started

### Notes

- Google sheet data can be converted to sql by downloading it as .csv, then importing it into a MySQL database using a DB client.
- Migration files can be created by exporting the above tables as sql files. This is also why the migrations in this project use sql files instead of js files.
- `db-migrate` throws a warning when running migrations because of an issue with the way `db-migrate-mysql` handles connection configurations. I've chosen to ignore it for now, but normally we would fork the repo, fix the way the config file is read and then either use our fork or create a PR to the main repo.

### Dependencies

- Node.js
- MySQL
- db-migrate (`npm install -g db-migrate`)

### Local setup

- Create a database on your dev environment.
- Rename `.env_sample` to `.env` and update its values to correspond to your dev environment.
- Execute the following commands in the root of the repo:

```bash
npm install
db-migrate up
npm run seed
```

- compile typescript

```bash

```

### Deployment (CI/CD)

-

### Testing

-
