const mongoose = require("mongoose");
const Todo = require("./models/todo.js");

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

let list = new Todo({
  name: "homework",
  time: "7:30pm",
});

list
  .save()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
