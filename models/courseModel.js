const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "course name cannot be empty"]
        }
    },
    {
        timestamps: true
    }
)

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;