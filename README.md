## Getting Started

### Dependencies

- Node.js
- MySQL

### Local setup

- Create a database on your dev environment.
- Rename `.env_sample` to `.env` and update its values to correspond to your dev environment.
- Execute the following commands in the root of the repo:

```bash
npm install
npm run migrate
npm run seed

# Run local server
npm run serve
```

### Notes

- Migration files can be created by exporting the tables as sql files. This is why the migrations in this project use sql files instead of js files.
- `db-migrate` throws a warning when running migrations because of an issue with the way `db-migrate-mysql` handles connection configurations. I've chosen to ignore it for now, but normally we would fork the repo, fix the way the config file is read and then either use our fork or create a PR to the main repo.
- It is generally a good idea to log api requests for debugging. For now, I am simply logging it to the console, but we would have a more robust solution in a real product.
- Callback hell is a real place and no one deserves to witness it. I am more in favor of async/await, therefore all callback based code has been wrapped in Promises.
- The source files would normally have a more rigid structure with separate folders for interfaces, middlewares, routers, services. But this is a small project therefore I decide not to over-engineer it and kept it all in the src folder itself.
