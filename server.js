// https://ucb-note-taker-2021.herokuapp.com/ heroku link           git push heroku main
//setting up server
const express = require("express");
const fs = require("fs")
//make sure you require path lol
const path = require('path');
const database = require("./db/db.json")

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//root route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//notes route
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.route("/api/notes")
    // Grab the notes list 
    .get(function (req, res) {
        res.json(database);
    })
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // test note is the original note.
        let highestId = 99;
        // loop through the array and find the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // test note always highest id
                highestId = individualNote.id;
            }
        }
        // assigns id to the newNote. 
        newNote.id = highestId + 1;
        // push to db
        database.push(newNote)

        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        //new note 
        res.json(newNote);
    });
    //delete note based on id, just noticed in testing I cannot delete test note.
    app.delete("/api/notes/:id", function (req, res) {

        let jsonFilePath = path.join(__dirname, "/db/db.json");
        // request to delete note by id.
        for (let i = 0; i < database.length; i++) {

            if (database[i].id == req.params.id) {
                // Splice takes i position, deletes i
                database.splice(i, 1);
                break;
            }
        }
        // Write db.json again.
        fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            } else {
                console.log("Your note has been deleted!");
            }
        });
        res.json(database);
        });
 
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});