export default {
  expo: {
    name: "native_movie_app",
    slug: "native_movie_app",

    extra: {
      appwrite_endpoint: "https://cloud.appwrite.io/v1",
      appwrite_project_id: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
      appwrite_database_id: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      appwrite_table_id: process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID,
    },
  },
};
