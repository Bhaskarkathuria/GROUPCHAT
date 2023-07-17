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

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/message")
    .then((res) => {
      console.log(res);
      res.data.forEach((element) => {
        const li = document.createElement("li");
        li.setAttribute("id", "1");
        li.appendChild(
          document.createTextNode(`${element.name}: ${element.text}`)
        );

        const chats = document.getElementById("chats");
        chats.appendChild(li);
      });
    })
    .catch();
});
