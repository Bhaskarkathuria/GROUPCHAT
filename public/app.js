const textinput = document.getElementById("textinput");
const Send = document.getElementById("send");
const newGroupButton = document.getElementById("newgroup");
const newGroupNameInput = document.getElementById("newGroupName");
const groupList = document.getElementById("grouplist");
const enter = document.getElementById("enter");
const invitelink = document.getElementById("invitelink");

Send.addEventListener("click", Onsend);
newGroupButton.addEventListener("click", createnewgroup);

function addnewmember(e) {
  e.preventDefault();
  const invitelink = document.getElementById("invitelink");
  axios
    .get(`${invitelink.value}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {})
    .catch((err) => {
      alert("Already a user.");
    });
  location.reload();
}
enter.addEventListener("click", addnewmember);

function createlink(e) {
  e.preventDefault();
  const groupid = e.target.parentElement.getAttribute("rightid");
  if (e.target.textContent == "Copy Link") {
    let inputelement = document.createElement("input");
    inputelement.setAttribute(
      "value",
      `http://16.171.219.3:3000/group/copylink/addmember/${groupid}`
    );
    document.body.appendChild(inputelement);
    inputelement.select();
    document.execCommand("copy");
    inputelement.parentNode.removeChild(inputelement);
    alert("Copied");
  }
}

function showgroupmembers(e) {
  e.preventDefault();
  const groupinfo = document.getElementById("groupinfo");

  const groupid = e.target.parentElement.getAttribute("rightid");
  console.log("GGIIDD", groupid);
  axios
    .get(`http://16.171.219.3:3000/group/admin/${groupid}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      for (element of response.data) {
        if (element.admin === element.member) {
          const li = document.createElement("li");
          li.appendChild(
            document.createTextNode(`Admin: ${element.member_name}`)
          );
          groupinfo.appendChild(li);
        } else {
          const li = document.createElement("li");
          li.appendChild(
            document.createTextNode(`Member:${element.member_name}`)
          );
          const deletebutton = document.createElement("button");
          deletebutton.setAttribute("class", "btn btn-danger btn-sm");
          deletebutton.setAttribute("type", "button");
          deletebutton.appendChild(document.createTextNode("Remove"));
          deletebutton.addEventListener("click", (e) => {
            e.preventDefault();
            axios.get(
              `http://16.171.219.3:3000/group/removemember?memberId=${element.member}&groupId=${groupid}`,
              {
                headers: { Authorization: localStorage.getItem("token") },
              }
            );
            groupinfo.removeChild(li);
          });
          li.appendChild(deletebutton);
          groupinfo.appendChild(li);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function deletegroupfromdatabase(e) {
  e.preventDefault();
  const groupid = e.target.parentElement.getAttribute("rightid");
  console.log("deleteIIIDDDD", groupid);
  axios
    .get(`http://16.171.219.3:3000/group/delete/${groupid}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      alert("Group Deleted");
      location.reload();
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
    element.focus(); // this will Place the cursor in the editable element
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
        "http://16.171.219.3:3000/group/editname",
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
  const Adminid = e.target.parentElement.getAttribute("adminid");

  console.log("infoobutoonnn", groupid);
  console.log("INNFOOADDMMIINNID", Adminid);

  const groupinfobuttons = document.getElementById("groupinfobuttons");
  groupinfobuttons.setAttribute("rightid", groupid);

  const copylink = document.createElement("button");
  copylink.appendChild(document.createTextNode("Copy Link"));
  copylink.addEventListener("click", createlink);

  const groupmembers = document.createElement("button");
  groupmembers.appendChild(document.createTextNode("Group Members"));
  groupmembers.addEventListener("click", showgroupmembers);

  const deletegroup = document.createElement("button");
  deletegroup.appendChild(document.createTextNode("Delete Group"));
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
        "http://16.171.219.3:3000/group",
        { groupName: groupName },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then((res) => {
        // console.log(res.data);
        const Adminid = res.data.adminid;
        // console.log("aaaaaaaaaa",Adminid)
        // alert("Group Created ")
        const Groupid = res.data.groupid;
        // console.log(Groupid)

        //groupitem.setAttribute("adminid",Adminid)
        groupitem.setAttribute("id", Groupid);

        groupinfo.setAttribute("adminid", Adminid);

        groupitem.addEventListener("click", () => {
          const currentgroupid = groupitem.getAttribute("id");
          // console.log("currreeennnt gId", currentgroupid);
          const rightcontainer = document.getElementById("rightcontainer");
          rightcontainer.setAttribute("groupid", currentgroupid);

          console.log("CCGGGGGGGGGIIDDDDD", currentgroupid);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    //location.reload()
  }
}

function Onsend(e) {
  const rightcontainer = document.getElementById("rightcontainer");
  const rightid = rightcontainer.getAttribute("groupid");

  if (!rightid) {
    console.log("Error: No active group selected.");
    return;
  }

  console.log("current groupidddddd", rightid);
  e.preventDefault();
  const token = localStorage.getItem("token");

  axios
    .post(
      `http://16.171.219.3:3000/message?groupid=${rightid}`,
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
    .get("http://16.171.219.3:3000/group", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      console.log(response);
      response.data.forEach((element) => {
        const Groupid = element.id;
        const groupName = element.groupname;
        const Adminid = element.UserInfoId;

        if (groupName !== "") {
          const groupitem = document.createElement("div");
          groupitem.classList.add("group-item");
          groupitem.setAttribute("id", Groupid);
          groupitem.addEventListener("click", () => {
            const currentgroupid = groupitem.getAttribute("id");
            console.log("currreeennnt gId", currentgroupid);
            const rightcontainer = document.getElementById("rightcontainer");
            rightcontainer.setAttribute("groupid", currentgroupid);

            const groupinfo = document.getElementById("groupinfo");
            groupinfo.innerHTML = "";
            const name = document.createElement("h3");
            name.appendChild(document.createTextNode(groupName));
            groupinfo.appendChild(name);

            const previousdata = JSON.parse(
              localStorage.getItem(`messages_${currentgroupid}`)
            );

            if (!previousdata || previousdata.length === 0) {
              axios
                .get(
                  `http://16.171.219.3:3000/message?lastidinlocalstorage=undefined&currentGroupId=${currentgroupid}`
                )
                .then((result) => {
                  const data = result.data.slice(0, 10);
                  updateAndDisplayMessages(data, currentgroupid);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              const lastidinlocalstorage =
                previousdata[previousdata.length - 1].id;
              axios
                .get(
                  `http://16.171.219.3:3000/message?lastidinlocalstorage=${lastidinlocalstorage}&currentGroupId=${currentgroupid}`
                )
                .then((result) => {
                  const data = result.data;
                  updateAndDisplayMessages(data, currentgroupid);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });

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
    .catch((err) => {
      console.log(err);
    });
});

const intervalId = setInterval(() => {
  const currentgroupid = document
    .getElementById("rightcontainer")
    .getAttribute("groupid");
  axios
    .get(
      `http://16.171.219.3:3000/message?lastidinlocalstorage=${localStorage.getItem(
        `messages_${currentgroupid}`
      )}&currentGroupId=${currentgroupid}`
    )
    .then((result) => {
      const data = result.data;
      const chats = document.getElementById("chats");
      chats.innerHTML = "";

      data.forEach((element) => {
        const li = document.createElement("li");
        li.setAttribute("id", "2");
        li.appendChild(
          document.createTextNode(`${element.name}: ${element.text}`)
        );
        chats.appendChild(li);
      });

      // Store the messages in localStorage
      localStorage.setItem(`messages_${currentgroupid}`, JSON.stringify(data));
    })
    .catch((err) => {
      console.log(err);
    });
}, 1000);

function updateAndDisplayMessages(data, groupId) {
  const chats = document.getElementById("chats");
  chats.innerHTML = "";

  data.forEach((element) => {
    const li = document.createElement("li");
    li.setAttribute("id", "2");
    li.appendChild(document.createTextNode(`${element.name}: ${element.text}`));
    chats.appendChild(li);
  });

  // Store the messages in localStorage
  localStorage.setItem(`messages_${groupId}`, JSON.stringify(data));
}
