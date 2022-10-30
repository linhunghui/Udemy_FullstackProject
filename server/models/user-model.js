import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "instructor", "admin"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//之後api會用到
userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};
userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

//mongoose schema middleware 用來把密碼先經過hash再存入資料庫
//因為是middleware所以要放function(next)
userSchema.pre("save", async function (next) {
  //this是指我們目前正要儲存的資料，假如password有改過，或是是新的一筆資料就執行下面的function把密碼在哈希過一遍
  if (this.isModified("password" || this.isNew)) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  //password是指用戶輸入的plain text，this.password是指資料庫哈希過的密碼
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

export default mongoose.model("User", userSchema);
