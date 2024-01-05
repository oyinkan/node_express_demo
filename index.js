const Joi = require("joi");
require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const Course = require("./models/courseModel");

const app = express();
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.nkupy.mongodb.net/Node-API?retryWrites=true&w=majority`)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}).catch((error) => {
    console.log(error);
});


function validateCourse(course) {
    // validate the data
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}

function validateID(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/courses", async (req, res) => {
    const courses = await Course.find({});
    res.status(200).json({
        message: "Courses retrieved successfully",
        courses
    });
});

app.post("/api/courses", async(req, res) => {
    const { error } = validateCourse(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const course = await Course.create(req.body);
    res.status(200).json({
        message: "Course added successfully",
        course
    });
})

app.put("/api/courses/:id", async(req, res) => {
    // check the course with the id
    const { id } = req.params;

    // validate the ID
    if (!validateID(id)) return res.status(404).send("The course with the given ID was not found.");

    // validate the data
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // update the course if available in the database
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    // if not, throw error
    if(!course) return res.status(404).send("The course with the given ID was not found.");

    // show success status
    res.status(200).json(course);
})

app.get("/api/courses/:id", async(req, res) => {
    const { id } = req.params;

    // validate the ID
    if (!validateID(id)) return res.status(404).send("The course with the given ID was not found.");

    // find the course and show
    const course = await Course.findById(id);
    res.status(200).json(course);

    //res.status(500).json({message: error.message})
});

app.delete("/api/courses/:id", async(req, res) => {
    // check the course and see if it exists, if not, return 404

    // check the course with the id
    const { id } = req.params;

    // validate the ID
    if (!validateID(id)) return res.status(404).send("The course with the given ID was not found.");

    // delete the course
    const course = await Course.findByIdAndDelete(id);

    // return the course
    res.status(200).json(course);
})

const port = process.env.PORT || 3000;

