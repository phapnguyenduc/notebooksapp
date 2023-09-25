import axios from "axios";

// if (!localStorage.getItem("token")) {
//   const rand = () => {
//       return Math.random().toString(36).substr(2);
//   };

//   const token = () => {
//       return rand() + rand();
//   };
//   localStorage.setItem("token", token());
// }

const axiosConfig = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    'auth-token': localStorage.getItem("token")
  }
});

export default axiosConfig;