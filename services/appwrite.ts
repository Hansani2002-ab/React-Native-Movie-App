import { Account, Client, Databases, ID, Query } from "appwrite";

// ENV variables
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const API_KEY = process.env.EXPO_PUBLIC_APPWRITE_API_KEY!;

// Create Appwrite Client (Older SDK version compatible)
const client = new Client();

// Set configuration - NOT chainable in older versions
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

// For older SDK versions, set key separately
if (client.setKey) {
  client.setKey(API_KEY);
} else {
  // Alternative for even older versions
  console.log("Note: Using legacy API key setup");
}

// Export Account & Database
export const account = new Account(client);
export const database = new Databases(client);

// Export ID and Query for use in other files
export { ID, Query };

// ----------------------
// SEARCH COUNT FUNCTIONS
// ----------------------

export const updateSearchCount = async (query: string, movie: any) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        TABLE_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<any[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Export client
export default client;