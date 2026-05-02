# Furniture Manufacturing App

Next.js app for steel cot leg customer ordering and owner maintenance.

## Run locally

Install Node.js first, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo logins

- Owner: `Owner` / `9999999999`
- Customer: `Kumar Stores` / `9876543210`

## Database

The app uses MS SQL when the following environment variables are available:

```bash
MSSQL_SERVER=
MSSQL_DATABASE=
MSSQL_USER=
MSSQL_PASSWORD=
MSSQL_ENCRYPT=true
```

Run the scripts in this order:

```txt
database/schema.sql
database/seed.sql
```

Without these variables, the app falls back to mock data for local demo.

## Image Uploads

For deployed product images, use Vercel Blob and add:

```bash
BLOB_READ_WRITE_TOKEN=
```

Owner image upload stores the file in Blob and saves the returned image URL with the product.

## Vercel Deployment

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Add the MS SQL and Blob environment variables.
4. Deploy.
