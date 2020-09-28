const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true });


// CREATE NEW WORKOUT //

db.Workout.create({ name: "Workout One" })
    .then(dbWorkout => {
        console.log(dbWorkout);
    })
    .catch(({ message }) => {
        console.log(message);
    });


// GET ALL EXERCISES //

app.get("/exercises", (req, res) => {
    db.Exercise.find({})
        .then(dbExercise => {
            res.json(dbExercise);
        })
        .catch(err => {
            res.json(err);
        });
});

// GET ALL WORKOUTS //

app.get("/workout", (req, res) => {
    db.Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// NEW EXERCISE //

app.post("/submit", ({ body }, res) => {
    db.Exercise.create(body)
        .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// SHOW NEW WORKOUT WITH NEW ADDITIONAL EXERCISES //

app.get("/stats", (req, res) => {
    db.Workout.find({})
        .populate("exercises")
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// Listening for connection... //

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
