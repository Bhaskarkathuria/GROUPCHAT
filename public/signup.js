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
  location.replace("http://16.171.219.3/login.html");
}

function Onsignup(e) {
  e.preventDefault();
  axios
    .post("http://16.171.219.3/signup", {
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
      location.replace("http://16.171.219.3/login.html");
    })
    .catch((err) => {
      console.log(err);
      alert("User already Exist!Login");
    });
}
