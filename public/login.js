const emailinput = document.getElementById("emailinput");
const passwordinput = document.getElementById("passwordinput");
const login = document.getElementById("login");
const signup = document.getElementById("signup");

login.addEventListener("click", Onlogin);
signup.addEventListener("click", Onsignup);

function Onsignup(e) {
  e.preventDefault();
  location.replace("16.16.217.62:5500/public/signup.html");
}

function Onlogin(e) {
  e.preventDefault();
  axios
    .post("16.16.217.62:3000/login", {
      email: emailinput.value,
      password: passwordinput.value,
    })
    .then((res) => {
      console.log(res.data);
      alert("User logged in successfully");
      localStorage.setItem("token", res.data.token);
      location.replace("16.16.217.62:5500/public/app.html");
      //location.replace("16.16.217.62:3000/login");
    })
    .catch((err) => {
      alert("invalid password/user not found");
    });
}
