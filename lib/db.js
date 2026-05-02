import sql from "mssql";

export { sql };

const config = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT !== "false",
    trustServerCertificate: false
  }
};

let poolPromise;

export function isDbConfigured() {
  return Boolean(
    process.env.MSSQL_SERVER &&
      process.env.MSSQL_DATABASE &&
      process.env.MSSQL_USER &&
      process.env.MSSQL_PASSWORD
  );
}

export function getSqlPool() {
  if (!isDbConfigured()) {
    throw new Error("MS SQL environment variables are not configured.");
  }

  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }

  return poolPromise;
}
