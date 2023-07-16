const emailinput = document.getElementById("emailinput");
const passwordinput = document.getElementById("passwordinput");
const login = document.getElementById("login");
const signup = document.getElementById("signup");

login.addEventListener("click", Onlogin);
signup.addEventListener("click", Onsignup);

function Onsignup(e) {
  e.preventDefault();
  location.replace("http://127.0.0.1:5500/public/signup.html");
}

function Onlogin(e) {
  e.preventDefault();
  axios
    .post("http://localhost:3000/login", {
      email: emailinput.value,
      password: passwordinput.value,
    })
    .then((res) => {
      console.log(res.data);
      alert("User logged in successfully");
      localStorage.setItem("token", res.data.token);
      //location.replace("http://localhost:3000/login");
    })
    .catch((err) => {
      alert("invalid password/user not found");
    });
}
