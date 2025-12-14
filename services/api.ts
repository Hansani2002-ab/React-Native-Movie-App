// api.ts

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY || "",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  // Build endpoint
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&language=en-US`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=en-US`;

  // Fetch data
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    console.log("Fetch error:", await response.text());
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const json = await response.json();

  return json.results || [];
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};


/*const url = 'https://api.themoviedb.org/3/person/person_id/movie_credits?language=en-US';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5N2NjMzU1YzFhODYyOTFlZGYxYTA5YzQ4MzE3MjQ0ZiIsIm5iZiI6MTc2NDg2OTYyNy43MDgsInN1YiI6IjY5MzFjNWZiYjc3OGRjY2Y2NTU1YzY1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.g_ha2CHPsLqPv_OJSTkj9NPko9UXieOs1xG4XNki7GY'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));*/