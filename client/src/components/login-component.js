import React, { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../services/auth.service";

const LoginComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const Navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = () => {
    AuthService.login(email, password)
      .then((response) => {
        //console.log(response.data);
        //若有token把它存到local storage
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        //alert
        window.alert(
          "Login successfully, you are now redirected to the profile page."
        );
        //獲得目前使用者
        setCurrentUser(AuthService.getCurrentUser());
        Navigate("/profile");
      })
      .catch((error) => {
        //console.log(error.response.data);
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      {/* error message假如message是空false的話就不會執行 */}
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
      </div>
      <div>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            onChange={handleChangeEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChangePassword}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
