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

window.addEventListener("DOMContentLoaded", (req, res, next) => {
   previousdata = JSON.parse(localStorage.getItem("messages"));
  if (!previousdata || previousdata.length === 0) {
    axios
      .get("http://localhost:3000/message?lastidinlocalstorage=undefined")
      .then((result) => {
        const data = result.data.slice(0, 10);
        //console.log(data)
        data.forEach((element) => {
          const chats = document.getElementById("chats");
          const li = document.createElement("li");
          li.setAttribute("id", "1");
          li.appendChild(
            document.createTextNode(`${element.name}: ${element.text}`)
          );
          chats.appendChild(li);
          previousdata = localStorage.setItem("messages", JSON.stringify(data));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    previousdata = JSON.parse(localStorage.getItem("messages"));
    // console.log(previousdata)
    const lastidinlocalstorage = previousdata[previousdata.length - 1].id;
    // console.log("lastIdInLocalStorage:", lastidinlocalstorage);

    axios
      .get(
        `http://localhost:3000/message?lastidinlocalstorage=${lastidinlocalstorage}`
      )
      .then((result) => {
        const data = result.data;
        console.log(data);

        previousdata = [...data.reverse(), ...previousdata.reverse()];
       previousdata=previousdata.slice(0,10)
       console.log(typeof(previousdata))

        //localStorage.setItem("messages",JSON.stringify(previousdata))

        // console.log(previousdata);
        previousdata.forEach((element) => {
          const chats = document.getElementById("chats");
          const li2 = document.createElement("li");
          li2.setAttribute("id", "2");
          li2.appendChild(
            document.createTextNode(`${element.name}: ${element.text}`)
          );
          chats.appendChild(li2);
        });
        //localStorage.setItem("messages", JSON.stringify(previousdata));
        
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
