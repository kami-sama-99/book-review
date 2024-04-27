import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import $ from "jquery";
import axios from "axios";

const db = new pg.Client({
    database: "book_review",
    user: "postgres",
    host: "localhost",
    password: "123456",
    port: 5432
});
const app = express();
const port = 3000;

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/view", async (req, res) => {
    let items = [];
    const result = await db.query("SELECT * FROM book_info;");
    result.rows.forEach((item) => {
      items.push(item);
    })
    console.log(items);
    res.render("view.ejs", {
        listItems: items
    });
});

app.get("/add", async (req, res) => {
    res.render("add.ejs");
});

app.post("/submit", async (req, res) => {
    const title = req.body["title"];
    const author = req.body["author"];
    const isbn = req.body["isbn"];
    const review = req.body["review"];
    await db.query("INSERT INTO book_info(name, author, isbn, review) VALUES($1, $2, $3, $4);", [title, author, isbn, review]);
    res.redirect("/");
});

app.get("/about", async (req, res) => {
    res.render("about.ejs");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})
