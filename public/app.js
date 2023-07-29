const textinput = document.getElementById("textinput");
const Send = document.getElementById("send");
const newGroupButton = document.getElementById("newgroup");
const newGroupNameInput = document.getElementById("newGroupName");
const groupList = document.getElementById("grouplist");

Send.addEventListener("click", Onsend);
newGroupButton.addEventListener("click", createnewgroup);

function deletegroupfromdatabase(e) {
  e.preventDefault();
  const groupid = e.target.parentElement.getAttribute("id");
  console.log("gggggggg", groupid);
  axios
    .get(`http://localhost:3000/group/delete/${groupid}`)
    .then((response) => {
      alert("Group Deleted");
    })
    .catch((error) => {
      console.log(error);
    });
}

function editgroupname(e) { 
  console.log("ggggrrrooouuuppp-iiidd", e.target.previousSibling.id);
  console.log("ggggrrrooouuuppp-naammee", e.target.previousSibling.textContent);
  if (e.target.classList.contains("edit")) {
    const element = e.target.previousSibling;
    element.contentEditable = "true";
    element.focus(); // Place the cursor in the editable element
    e.target.textContent = "Save"; // Change the "Edit" button to "Save"

    e.target.classList.remove("edit");
    e.target.classList.add("save");
  } else if (e.target.classList.contains("save")) {
    console.log(
      "ggggrrrooouuuppp-naammee-edditeddd",
      e.target.previousSibling.textContent
    );
    const groupName = e.target.previousSibling.textContent;

    axios
      .post(
        "http://localhost:3000/group/editname",
        { groupName: groupName, groupid: e.target.previousSibling.id },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    const element = e.target.previousSibling;
    element.contentEditable = "false";
    e.target.textContent = "Edit"; // Change the "Save" button back to "Edit"
    e.target.classList.remove("save");
    e.target.classList.add("edit");
  }
}
function closegroupinfo(e) {
  e.preventDefault();
  e.target.parentElement.remove();
}

function Showgroupinfo(e) {
  e.preventDefault();
  const groupid = e.target.previousSibling.previousSibling.id;
  console.log("infoobutoonnn", groupid);
  const groupinfobuttons = document.getElementById("groupinfobuttons");
  groupinfobuttons.setAttribute("id", groupid);

  const copylink = document.createElement("button");
  copylink.appendChild(document.createTextNode("Copy Link"));

  const groupmembers = document.createElement("button");
  groupmembers.appendChild(document.createTextNode("Group Members"));

  const deletegroup = document.createElement("button");
  deletegroup.appendChild(document.createTextNode("Delete Group"));
  //deletegroup.setAttribute("id", groupid);
  // const deleteiiiiiiddd=deletegroup.getAttribute('id')
  // console.log("deeeeleeeteee---iiiiddd",deleteiiiiiiddd)
  deletegroup.addEventListener("click", deletegroupfromdatabase);

  const close = document.createElement("button");
  close.appendChild(document.createTextNode("Close"));
  close.classList.add("close");
  close.addEventListener("click", closegroupinfo);

  groupinfobuttons.appendChild(copylink);
  groupinfobuttons.appendChild(groupmembers);
  groupinfobuttons.appendChild(deletegroup);
  groupinfobuttons.appendChild(close);
}

function createnewgroup(e) {
  e.preventDefault();
  const groupName = newGroupNameInput.value.trim();
  if (groupName !== "") {
    const groupitem = document.createElement("div");
    groupitem.classList.add("group-item");
    groupitem.innerText = groupName;

    const edit = document.createElement("button");
    edit.appendChild(document.createTextNode("EditName"));
    edit.classList.add("edit");
    edit.addEventListener("click", editgroupname);

    const groupinfo = document.createElement("button");
    groupinfo.appendChild(document.createTextNode("GroupInfo"));
    groupinfo.addEventListener("click", Showgroupinfo);

    groupList.appendChild(groupitem);
    groupList.appendChild(edit);
    groupList.appendChild(groupinfo);
    newGroupNameInput.value = "";

    console.log(groupName);
    axios
      .post(
        "http://localhost:3000/group",
        { groupName: groupName },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        // alert("Group Created ")
        const Groupid = res.data.groupid;
        // console.log(Groupid)
        groupitem.setAttribute("id", Groupid);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

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
  axios
    .get("http://localhost:3000/group", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      //console.log(response.data[0])
      response.data.forEach((element) => {
        console.log(element);
        const Groupid = element.id;
        //console.log(Groupid)
        const groupName = element.groupname;

        if (groupName !== "") {
          const groupitem = document.createElement("div");
          groupitem.classList.add("group-item");
          groupitem.setAttribute("id", Groupid);
          groupitem.innerText = groupName;

          const edit = document.createElement("button");
          edit.appendChild(document.createTextNode("EditName"));
          edit.classList.add("edit");
          edit.addEventListener("click", editgroupname);

          const groupinfo = document.createElement("button");
          groupinfo.appendChild(document.createTextNode("GroupInfo"));
          groupinfo.addEventListener("click", Showgroupinfo);

          groupList.appendChild(groupitem);
          groupList.appendChild(edit);
          groupList.appendChild(groupinfo);
          newGroupNameInput.value = "";

          console.log(groupName);
     
        }
      });
    })
    .catch();

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
        previousdata = previousdata.slice(0, 10);
        console.log(typeof previousdata);

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
