import express from "express";
const router = express.Router();
import { courseValidation } from "../validation.js";
import { Course } from "../models/index.js";

router.use((req, res, next) => {
  console.log("A request is comming into api");
  next();
});

//獲得所有課程資訓
router.get("/", (req, res) => {
  //populate <  instructor: {type: mongoose.Schema.Types.ObjectId,ref: "User",}
  //objectid跟User是互相連接的所以每筆course的資料一定會有他instructor的資料
  //populate(搜索"instructor",[要產出的資料有哪些"username","email"])
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Error Cannot get course!!");
    });
});

router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("Cannot get data");
    });
});

//學生搜尋課程用
router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  Course.find({ title: name })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((error) => {
      res.status(500).send("Cannot get data");
    });
});

router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  //找到符合學生id的課程，然後因為schema 當中students是[]所以這邊用populate
  Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .then((courses) => {
      res.status(200).send(courses);
    })
    .catch((error) => {
      res.status(500).send("Cannot get data");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { title, description, price } = req.body;
  //passport當中會有user可以用
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a new course.");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

//讓學生註冊到課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    //  原本用find會回傳一個array這邊改用findone才對
    let course = await Course.findOne({ _id });
    course.students.push(user_id);
    await course.save();
    res.send("Done enrollment");
  } catch (err) {
    res.send(err);
  }
});

router.patch("/:_id", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({ success: false, message: "Course not found." });
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or webadmin can edit this course",
    });
  }
});
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({ success: false, message: "Course not found." });
  }
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("Course deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or webadmin can delete this course",
    });
  }
});

export default router;
