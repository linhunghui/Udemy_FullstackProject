import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomeComponent from "./components/home-component.js";
import NavComponent from "./components/nav-component.js";
import RegisterComponent from "./components/register-component.js";
import LoginComponent from "./components/login-component.js";
import ProfileComponent from "./components/profile-component.js";
import AuthService from "./services/auth.service.js";
import CourseComponent from "./components/course-component.js";
import PostCourseComponent from "./components/postCourse-component.js";
import EnrollComponent from "./components/enroll-component.js";

const App = () => {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  //每次進來時都要檢查一次
  // useEffect(() => {
  //   setCurrentUser(AuthService.getCurrentUser());
  // }, []);
  return (
    <div>
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        {/* login 要有currentUser跟setCurrentUser是因為我們一登入後就要馬上改變nav */}
        <Route
          path="/login"
          element={
            <LoginComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfileComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/course"
          element={
            <CourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/postCourse"
          element={
            <PostCourseComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/enroll"
          element={
            <EnrollComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
