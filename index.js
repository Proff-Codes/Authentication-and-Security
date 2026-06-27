import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "kojomarcus",
  port: 8000,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  // get hold of the register credentials
const email = req.body.username;
const password = req.body.password;
try {
  // checking if email is found in the databse
  const checkResult = await db.query("SELECT * FROM users WHERE email = $1",[
  email,
])

// if email is found the email already exist
if(checkResult.rows.length > 0){
  res.send("Email already exist.")
} else{
  // else insert user email and password into the database
  const result = await db.query("INSERT INTO users (email , password) VALUES ($1,$2)",
[email,password]
);
// console.log(result)
res.render("secrets.ejs")
}
  
} catch (err) {
  console.log(err)
}


});

app.post("/login", async (req, res) => {
  const email = req.body.username
  const password = req.body.password

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1",[
      email,
    ]);

    if(existingUser.rows.length > 0){
      // returns the row of the user only
      const user = existingUser.rows[0]
      const storedPassword = user.password

      if(password === storedPassword){
        res.render("secrets.ejs")
      }else{
        res.send("Incorrect email or password")
      }
      console.log(user)
    }
    
  } catch (err) {
    console.log(err)
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
