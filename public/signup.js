const nameinput = document.getElementById("nameinput");
const emailinput = document.getElementById("emailinput");
const numberinput = document.getElementById("numberinput");
const passwordinput = document.getElementById("passwordinput");
const signup = document.getElementById("signup");
const login = document.getElementById("Login");

signup.addEventListener("click", Onsignup);
login.addEventListener("click", Onlogin);

function Onlogin(e) {
  e.preventDefault();
  location.replace("https://16.16.217.62:5500/public/login.html");
}

function Onsignup(e) {
  e.preventDefault();
  axios
    .post("16.16.217.62:3000/signup", {
      name: nameinput.value,
      email: emailinput.value,
      Phonenumber: numberinput.value,
      password: passwordinput.value,
    })
    .then((res) => {
      //    console.log(name)
      //    console.log(email)
      //    console.log(Phonenumber)
      //    console.log(password)

      alert("Signup Successful");
    })
    .catch((err) => {
      console.log(err);
      alert("User already Exist!Login");
    });
}
