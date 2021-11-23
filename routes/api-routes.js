const router = require("express").Router();
const db = require("../models");
const mongoose = require("mongoose");

router.get("/workouts", (req, res) => {
    console.log(Date.now());
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration',
                }
            }
        }
    ])
    .then((dbWorkouts) => {
        res.json(dbWorkouts);
    })
    .catch((err)=> {
        res.status(500).json(err);
    });
});

router.get("/workouts/range", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration',
                }
            }
        }
    ]).sort({_id: -1})
    .limit(7)
    .then((dbWorkouts)=> {
        console.log(dbWorkouts);
        res.json(dbWorkouts)
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

router.put("/workouts/:id", ({body, params}, res) => {
    db.Workout.findByIdAndUpdate(
        params.id,
        {$push: {exercises: body}},
        {new: true, runValidators: true}
    ).then((dbWorkout) => {
        res.json(dbWorkout)
    }).catch((err) => {
        res.json(err);
    })
});

router.post("/workouts/", (req, res) => {
    db.Workout.create({})
    .then((dbWorkout) => {
        res.json(dbWorkout);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

module.exports = router;
