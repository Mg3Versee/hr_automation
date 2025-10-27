
const ENV = process.env.NEXT_PUBLIC_APP_ENV || "development";

const BACKEND_URL =
  ENV === "production"
    ? process.env.PROD_API_URL
    : process.env.DEV_API_URL;

const APP_NAME =
  ENV === "production"
    ? process.env.PROD_APP_NAME
    : process.env.DEV_APP_NAME;

const USE_MOCK_AUTH =
  ENV === "production"
    ? process.env.PROD_USE_MOCK_AUTH === "true"
    : process.env.DEV_USE_MOCK_AUTH === "true";

export const APP_ENV = ENV;
export const IS_PRODUCTION = ENV === "production";
export const IS_DEVELOPMENT = ENV === "development";

export { BACKEND_URL, APP_NAME, USE_MOCK_AUTH };

console.log(`[Env] Mode: ${APP_ENV}`);
console.log(`[Env] API: ${BACKEND_URL}`);
