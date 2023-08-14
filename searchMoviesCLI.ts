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
    console.log("Welcome to search-movies-cli!");
    while (true) {
      const input = question("Search for what movie? (or 'q' for quit)  ");
      if (input.toLowerCase() === "q") {
        break;
      }
      const searchedValue = [`%${input}%`];
      const res = await client.query(
        "SELECT name, date, kind, budget, revenue from movies WHERE name ilike $1",
        searchedValue
      );
      console.table(res.rows);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}
searchForMovies();
