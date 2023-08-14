import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: "omdb" });

async function searchForMovies() {
  try {
    await client.connect();
    console.log("Welcome to search-movies-cli!");
    while (true) {
      const input = question("Search for what movie? (or 'q' for quit)  ");
      if (input.toLowerCase() === "q") {
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
searchForMovies();
