import "dotenv/config";

async function testToken() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  console.log(response.status, data);
}

testToken();
