const textinput = document.getElementById("textinput");
const Send = document.getElementById("send");

Send.addEventListener("click", Onsend);

function Onsend(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  axios
    .post(
      "http://localhost:3000/message",
      {
        text: textinput.value,
      },
      { headers: { Authorization: token } }
    )
    .then((res) => {
      const li = document.createElement("li");
      li.setAttribute("id", "1");
      li.appendChild(document.createTextNode(textinput.value));

      const chats = document.getElementById("chats");
      chats.appendChild(li);
    })
    .catch((err) => {
      console.log(err);
    });
}

// window.addEventListener("DOMContentLoaded", () => {
//   axios
//     .get("http://localhost:3000/message")
//     .then((res) => {
//       console.log(res);
//       res.data.forEach((element) => {
//         const li = document.createElement("li");
//         li.setAttribute("id", "1");
//         li.appendChild(
//           document.createTextNode(`${element.name}: ${element.text}`)
//         );

//         const chats = document.getElementById("chats");
//         chats.appendChild(li);
//       });
//     })
//     .catch();
// });

window.addEventListener("DOMContentLoaded", () => {
  previousData = [];

  function compareData(data) {
    if (JSON.stringify(data) !== JSON.stringify(previousData)) {
       const chats = document.getElementById("chats");
       chats.innerHTML = ""; 
       
       data.forEach((element) => {
         const li = document.createElement("li");
         li.setAttribute("id", "1");
         li.appendChild(
           document.createTextNode(`${element.name}: ${element.text}`)
           )
           
           chats.appendChild(li);
          });
          previousData = data;

    }
  }

  function fetchdata() {
    axios.get("http://localhost:3000/message")
    .then((res)=>{
      console.log(res);
      compareData(res.data);
    })
    .catch((error)=>{
      console.log(error)
    })

  }

  fetchdata()

  setInterval(fetchdata,1000)

});
