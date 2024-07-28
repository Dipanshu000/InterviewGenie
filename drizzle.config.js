/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ai-interview-mocker_owner:AklS0IQ6YbWi@ep-black-shape-a54ns41u.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require",
  },
};
