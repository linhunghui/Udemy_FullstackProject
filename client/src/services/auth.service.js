import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password, role) {
    //因為把request發到後端後axios會回傳一個promise（有成功或失敗訊息）所以要把他return回去
    //後面{username, email, password, role} 就是要放在request當中的東西
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }
  //之後要用condiction nav時會用到
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

//要用new的原因是因為AuthService是一個class所以我們用new幫class做一個object出來
export default new AuthService();
