import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service.js";

function CourseComponent(props) {
  let { currentUser, setCurrentUser } = props;
  const Navigate = useNavigate();
  const handleTakeLogin = () => {
    Navigate("/login");
  };
  //用來放從API獲得的data，且ㄧ登入就要先去抓一次
  let [courseData, setCourseData] = useState(null);
  useEffect(() => {
    console.log("Using effect.");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }
    //老師頁面
    if (currentUser.user.role == "instructor") {
      //用CourseService去後端抓資料並存到courseData
      CourseService.get(_id)
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      //學生頁
    } else if (currentUser.user.role == "student") {
      //console.log("Getting data for student");
      CourseService.getErolledCourses(_id)
        .then((data) => {
          console.log(data.data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {/* 沒登入的話 */}
      {!currentUser && (
        <div>
          <p>You must login before seeing your courses</p>
          <button onClick={handleTakeLogin} className="btn btn-primary btn-lg">
            Take me to login page.
          </button>
        </div>
      )}
      {/* 假如是老師 */}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Welcome to instructor's Course Page.</h1>
        </div>
      )}
      {/* 假如是學生 */}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>Welcome to student's Course Page.</h1>
        </div>
      )}
      {/* 登入過 && courseData有東西 && courseData的array長度不是0 */}
      {currentUser && courseData && courseData.length != 0 && (
        <div>
          <p>Here is the data we got back from server</p>
          {courseData.map((course) => (
            <div className="card" style={{ width: "18rem" }}>
              <h5 className="card-title">{course.title}</h5>
              <p className="card-text">{course.description}</p>
              <p>Student Count: {course.students.length}</p>
              <button className="btn btn-primary">{course.price}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseComponent;
