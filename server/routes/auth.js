import express from "express";
const router = express.Router();
import { registerValidation } from "../validation.js";
import { loginValidation } from "../validation.js";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

//middelware有request進來就會跑一次
router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

//test api用來測試跟server連線使用
router.get("/testAPI", (req, res) => {
  const mesObj = { message: "Test API is working." };
  return res.json(mesObj);
});

router.post("/register", async (req, res) => {
  //console.log("Register!!!");
  //console.log(registerValidation(req.body));
  //提取error log
  const { error } = registerValidation(req.body);
  //假如不合規的話就會有error，有error的話if就會是true那就會回傳後面訊息
  if (error) return res.status(400).send(error.details[0].message);

  //check if user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email is already been registered.");

  //register user 這邊不需再幫password加密因為已經寫在usermodel裏存的時候會加密
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      saveObject: saveUser,
    });
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

router.post("/login", (req, res) => {
  //check validation data
  const { error } = loginValidation(req.body);
  //假如不合規的話就會有error，有error的話if就會是true那就會回傳後面訊息
  if (error) return res.status(400).send(error.details[0].message);
  //DB找看有沒有符合這個mail的用戶
  User.findOne({ email: req.body.email }, function (err, user) {
    //錯誤回傳
    if (err) {
      res.status(400).send(err);
    }
    //DB沒找到的話
    if (!user) {
      res.status(401).send("User not found");
      //其餘就來比密碼唄
    } else {
      //comparePassword的function寫在user-model中
      user.comparePassword(req.body.password, function (err, isMatch) {
        //錯誤回傳
        if (err) return res.status(400).send(err);
        //比對正確的話就產個token並傳回去給user { success: true, token: "JWT" + token, user }
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          res.status(401).send("Wrong password.");
        }
      });
    }
  });
});

export default router;
