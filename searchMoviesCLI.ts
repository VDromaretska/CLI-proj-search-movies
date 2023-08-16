import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: "omdb" });

async function searchForMovies() {
  try {
    await client.connect();
    // const test = await client.query("Select * from movies limit 20");
    // console.table(test.rows);
    console.log(
      "Welcome to search-movies-cli! \n [1] Search \n [2] See Favorite \n [3] Quit"
    );
    await client.query(`
    
    CREATE TABLE IF NOT EXISTS favourites (
      id SERIAL PRIMARY KEY,
      movie_id INTEGER REFERENCES movies(id),
      movie_name VARCHAR,
      added_at TIMESTAMP DEFAULT current_timestamp
    )
  `);
    console.log("Favourites table created successfully.");
    while (true) {
      const choice = question("Select option: [ 1 2 3 ]");
      if (choice === "3") {
        break;
      } else if (choice === "1") {
        const input = question("Input keyword: ");
        const value = [`%${input}%`];
        const res = await client.query(
          "select id, name, date, runtime, budget, revenue from movies where name ilike $1 and kind = 'movie' order by date desc limit 10",
          value
        );
        console.table(res.rows);
        const idInput = question("Select ID to add to favourites, q to quit: ");
        if (idInput.toLowerCase() === "q") {
          break;
        } else {
          const movieId = parseInt(idInput);
          if (!isNaN(movieId)) {
            const res = await client.query(
              "SELECT name FROM movies WHERE id = $1",
              [movieId]
            );
            if (res.rows.length > 0) {
              const movieName = res.rows[0].name;
              await client.query(
                "INSERT INTO favourites (movie_id, movie_name) VALUES ($1, $2)",
                [movieId, movieName]
              );
              console.log("Movie added to favourites!");
            } else {
              console.log("Movie not found");
            }
          }
        }
      } else if (choice === "2") {
        const res = await client.query("Select * from favourites");
        console.table(res.rows);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
searchForMovies();
