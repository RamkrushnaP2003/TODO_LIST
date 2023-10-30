const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const Todo = require("./models/todo");
const port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todo");
}

app.get("/lists", async (req, res) => {
  let lists = await Todo.find();
  res.render("home.ejs", { lists });
});

app.get("/lists/new", (req, res) => {
  res.render("add.ejs");
});

app.post("/lists", async (req, res) => {
  let { name, time } = req.body;
  let todoList = await Todo({
    name: name,
    time: time,
  });
  console.log(todoList);
  todoList
    .save()
    .then((res) => {
      console.log("saved to todo list");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/lists");
});

app.get("/lists/:id/edit", async (req, res) => {
  let { id } = req.params;
  let list = await Todo.findById(id);
  res.render("edit.ejs", { list });
});

app.put("/lists/:id", async (req, res) => {
  let { name, time } = req.body;
  let { id } = req.params;
  let update = await Todo.findByIdAndUpdate(
    id,
    { name: name, time: time },
    { runValidators: true, new: true }
  );
  console.log(update);
  res.redirect("/lists");
});

app.delete("/lists/:id", async (req, res) => {
  let { id } = req.params;
  let delList = await Todo.findByIdAndDelete(id);
  console.log(delList);
  res.redirect("/lists");
});

app.get("/", (req, res) => {
  res.send(`<h2><a href="/lists" style="text-decoration: none;">todo list</a></h2>`);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
