allRooms={};
let allMsg = {};
let lastMessages = [];
let counter = 0;
let room ={
  name: "general",
  password: "not used"
}

window.addEventListener("load",function(event){
  let signedInAs = document.getElementById('signedInAs');
  let messages = document.getElementById("messages");
  let commands = document.getElementById("commands");
  let chatMessage = document.getElementById("chatMessage");
  let chatHead = document.getElementById("chatHead");

  checkIfUserSignedIn();
  loadUserLogin();

  function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}


  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });


})  // end of windos load -----------------------------------------------


// ----------------   Initialize Firebase   -------------------------------->

  var config = {
    apiKey: "AIzaSyB3lpOkWssrMdhLmTPWDotBwSGufmifCeQ",
    authDomain: "whatchat95.firebaseapp.com",
    databaseURL: "https://whatchat95.firebaseio.com",
    projectId: "whatchat95",
    storageBucket: "",
    messagingSenderId: "304611024887"
  };
  firebase.initializeApp(config);
  const db = firebase.database();

//  ---------------------------  END  -------------------------------------//


// -------------------- Save user to local storage  ------------------------>

let saveUserToLocal = (user)=>{

  let data = {
    name: user.displayName,
    Uid: user.uid
  }
  let dataStr = JSON.stringify(data);
  window.localStorage.setItem('user',dataStr);
}

let removeFromLocal = ()=>{
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('nick');
  userName.value= '';
}

// --------------------------  END  -----------------------------------------//


//FUNKTION FÖR ATT MARKERA CHATMESSAGE VID KEYPRESS ------------------------->

window.addEventListener("keydown", function(evt){
  window.scrollTo(0,document.body.scrollHeight);
  if(evt.keyCode == 13){
    sendChatMessage();
    window.scrollTo(0,document.body.scrollHeight);
  }else{
  chatMessage.focus();
  }
});

window.addEventListener("click", function(evt){
  window.scrollTo(0,document.body.scrollHeight);
  chatMessage.focus();
});

window.onkeydown = function(evt){

  if (lastMessages.length!==0){
    if(evt.keyCode == 38){
      evt.preventDefault();

      if(counter < 1){
        counter = lastMessages.length
      }
      counter--
      chatMessage.value = lastMessages[counter]

    }else if (evt.keyCode==40) {
      evt.preventDefault();

      if(counter > lastMessages.length-2){
        counter = -1;
      }
      counter++
      chatMessage.value = lastMessages[counter]
    }
  }


};

// --------------------------  END  ----------------------------------------//




// ----------------------  Takes care of chat message ------------------------>

let sendChatMessage = function () {
  let message = document.getElementById('chatMessage').value;
  let messages = document.getElementById('messages');
  let myDataString = localStorage.getItem('user');  // hämta

  let user = JSON.parse(myDataString);

    if(!user){

      if (message == "#help"){
        commands.innerHTML = "";
        commands.innerHTML += `
                               <p>*****  Welcome to WhatChat! *************</p>
                               <p> Please login before use WhatChat. </p>
                               <p> Down to the right you find the login status.  </p>
                               <p> To sign in use the #login metod followed<br/>
                                  by your choice of provider.</p>
                               <p> Available Commands:</p>
                               <p>&emsp; #login github </p>
                               <p>&emsp; #login gmail </p>
                               <p>&emsp; #login facebook  </p>
                               <p>*****************************************</p>`
      }else if(message == "#login github"){
        commands.innerHTML += "<p>#login github</p>";
        gitHubAuth();
      }else if(message == "#login gmail"){
        commands.innerHTML += "<p>#login gmail</p>";
        gmailAuth();
      }else if(message == "#login facebook"){
        facebookAuth();
        commands.innerHTML += "<p>#login facebook</p>"
      }else{
        commands.innerHTML += "<p>invalid command</p>"
      }
    }

    if(user){  //kontroll så att man är inloggad

    if(message == "#logout"){
      commands.innerHTML += "<p>#logout</p>";

        logOut();
    }else if(message == "#help"){
      commands.innerHTML += `<p>******** Commands *****************</p>
                             <p>#rooms</p>
                             <p>#cd room password</p>
                             <p>#md room password</p>
                             <p>#terminate room password</p>
                             <p>#changenick</p>
                             <p>#like (followed by row number)</p>
                             <p>#dislike (followed by row number)</p>
                             <p>#remove (followed by row number)</p>
                             <p>#clear</p>
                             <p>#logout</p>
                             <p>**********************************</p>
                             <p> - Info - <br/>
                                md = creates a new room. Password is optional<br/>
                                cd = enter a existing room.<br/>
                                terminate = removes a existing room. (creater of room dosent need password)
                             </p>
                             `
    }else if (message.substring(0, 11) == "#changenick"){

      if (message.length < 23){
        let nick = message.substring(12, message.length)
        window.localStorage.setItem('nick',nick);
        commands.innerHTML += ("<p>" + message + "</p>");
        setChatHead(true);
      }else{
        commands.innerHTML += "<p>nickname cant be more than 10 characters</p>"
      }
    }else if (message == "#clear"){
      commands.innerHTML = "";

    }else if(message.substring(0, 5) == "#like"){

        let row = message.substring(6, message.length);

        if(isNumber(row) != true){
          commands.innerHTML += isNumber(row);

        }else{
          row = Number(row)  // gör om 003 --> 3

         let likeObj = {
            value : "hearts",
            name: user.name
          }

        //  db.ref(`messages/${allMsg[row].id}/likes`).child("pelle").setValue(likeObj);
          db.ref(`${room.name}/messages/${allMsg[row].id}/likes/${user.Uid}`).set(likeObj);
          commands.innerHTML += `<p>${message}</p>`
        }

    }else if(message.substring(0, 8) == "#dislike"){
      let row = message.substring(9, message.length);
      if(isNumber(row) != true){
        commands.innerHTML += isNumber(row);
      }else{
          row = Number(row)  // gör om 003 --> 3
        let likeObj = {
           value : "poos",
           name: user.name
         }

       //  db.ref(`messages/${allMsg[row].id}/likes`).child("pelle").setValue(likeObj);
         db.ref(`${room.name}/messages/${allMsg[row].id}/likes/${user.Uid}`).set(likeObj);
         commands.innerHTML += `<p>${message}</p>`
      }

    }else if (message.substring(0, 7) == "#remove"){

      row = message.substring(8, message.length)
      if(isNumber(row) != true){
        commands.innerHTML += isNumber(row);
      }else{
        row = Number(row)  // gör om 003 --> 3
        let msgId = allMsg[row].id
        db.ref(`${room.name}/messages/${msgId}`).remove();
        commands.innerHTML += ("<p>" + message + "</p>");
      }
    }else if (message.substring(0, 3) == "#md") {

      let roomConfig = message.substring(4, message.length)
      let newRoom  = roomConfig.split(" ")[0];
      let newRoomPassword =  roomConfig.split(" ")[1];

      console.log(newRoomPassword);
      //if(newRoom && newRoomPassword){  // check if we got both room and password
        if(newRoom){


          let passwordOk= "";
          if(newRoomPassword != undefined){
            passwordOk = checkWord(newRoomPassword)

          }else{
            passwordOk = true;
            newRoomPassword = "not used"  /// room dosent use password.

          }

          if(checkWord(newRoom) && passwordOk){  // check if max 10 letters only letter is valid

              if(!allRooms || !allRooms.hasOwnProperty("newRoom")){
                db.ref(`${room.name}/`).off
                room.name = newRoom;
                room.password = newRoomPassword;
                room.uid = user.Uid;

                setChatHead(true);
                fetchFromDb();
                db.ref(`${room.name}`).set(room);
                db.ref(`rooms/${room.name}`).set(room);

                commands.innerHTML += `<p>Created room: ${room.name}</p>`;
              }else{
                commands.innerHTML += "<p>come on... the room already exist!</p>";
              }


            }else{
              commands.innerHTML += `<p>come on... please enter a valid name for room and password!
                                      <br/>Word length 10. ONLY letters :) </p>`;
            }

        }else{
          commands.innerHTML += `<p>coomon... please enter a valid name for room!
                             <br/>Word length 10. ONLY letters :) </p>`;
        }


    }else if (message.substring(0, 3) == "#cd") {

      let roomConfig = message.substring(4, message.length)
      let selectedRoom  = roomConfig.split(" ")[0];
      let selectedPassword =  roomConfig.split(" ")[1];
      if(selectedRoom === "general" || allRooms.hasOwnProperty(selectedRoom)){

        if(selectedPassword== undefined){
          selectedPassword="not used";
        }

        if(selectedRoom === "general" || allRooms[selectedRoom].password == selectedPassword || user.Uid == allRooms[selectedRoom].uid){
          db.ref(`${room.name}/`).off
          room.name = selectedRoom;
          setChatHead(true);
          fetchFromDb();
        }else{
          commands.innerHTML += "<p>come on... wrong password!</p>";
        }


      }else{
        commands.innerHTML += `<p>come on... Room ${selectedRoom} dosent even exists!</p>`;
      }


    }else if (message.substring(0,10)== "#terminate") {


      let roomConfig = message.substring(11, message.length)
      let selectedRoom  = roomConfig.split(" ")[0];
      let selectedPassword =  roomConfig.split(" ")[1];
      if(selectedRoom === "general" || allRooms.hasOwnProperty(selectedRoom)){

        if(selectedPassword== undefined){
          selectedPassword="not used";
        }

        if(selectedRoom === "general" || allRooms[selectedRoom].password == selectedPassword || user.Uid == allRooms[selectedRoom].uid){

          if(room.name==="general"){
            db.ref(`${selectedRoom}`).remove();
            db.ref(`rooms/${selectedRoom}`).remove();
            commands.innerHTML += `<p>removed ${selectedRoom}</p>`
          }else{

            commands.innerHTML += `<p>only possible from general ${selectedRoom}</p>`
          }

        }else{

          commands.innerHTML += `<p>come on.. wrong password for room: ${selectedRoom} </p>`
        }


      }else{
        commands.innerHTML += `<p>come on.. wrong password for room: ${selectedRoom} </p>`

      }





    }else if (message.substring(0,9) == "#password") {
      let selectedRoom = message.substring(10, message.length)

        if(allRooms.hasOwnProperty(selectedRoom)){

          if(user.Uid == allRooms[selectedRoom].uid){

            commands.innerHTML += `Password: ${allRooms[selectedRoom].password}`
          }else{
            if(selectedRoom==="general"){
              commands.innerHTML += `<p>There is no password for general :)</p>`
            }else{
              commands.innerHTML += `<p>Only person who created the room can get the password.</p>`

            }
          }

        }else{
          commands.innerHTML += `<p>Room dosent exists.</p>`
        }

    }else if (message.substring(0,6) == "#rooms") {
      let all = Object.keys(allRooms);
      commands.innerHTML += "Available rooms:<br/>";
      all.map(item => commands.innerHTML+=`${item}<br>`)

    }else if(message.substring(0, 1) == "#"){
      commands.innerHTML += "<p>invalid command</p>";
    }else{  // sparar meddelande till databas

      let msg = {
        date: firebase.database.ServerValue.TIMESTAMP,
        user: user.name,
        userUid: user.Uid,
        nick: localStorage.getItem("nick"),
        message: message,
        likes : {},
      }
      db.ref(`${room.name}/messages/`).push(msg);
    }
  }

lastMessages.push(chatMessage.value);
   //counter = lastMessages.length
    chatMessage.value = "";

}


//------------------------------  END  --------------------------------------//

let isNumber = function (row) {

  if(isNaN(row)){
    return "<p>invalid command</p>";
  }else if(row > (Object.keys(allMsg).length) || row < 1){
    return "<p>row number dont exist</p>";
  }else{
    return true;
  }

}

// ---------------------   Get messages from database ------------------------>

let fetchFromDb = function () {
  let messages = document.getElementById('messages');
  db.ref(`${room.name}/messages/`).on("value", function(snapshot){
    allMsg={};
      let rowNumber = 1

      messages.innerHTML="";
      let data = snapshot.val();
      for(let msg in data){

        //räkna ihop likes
        let hearts = 0
        let poos = 0

        if ('likes' in data[msg]){
          let uidList = Object.keys(data[msg].likes);
          uidList.map(name=> {
            if(data[msg].likes[name].value == "hearts"){
              hearts++;
            }else if(data[msg].likes[name].value == "poos"){
              poos++;
            }
          })
        }

        allMsg[rowNumber] = {id: msg}
            let messageDiv = document.createElement('div');
            messageDiv.className="msgContainer";
                     let message = document.createElement('div');
                     message.className ="msgText";
                     message.innerText = data[msg].message;
                     messageDiv.innerHTML =`<div class="msgHead">
                                             <span class="row">${printRowNumber(rowNumber++)}</span>
                                             <span class="time">${calculateTime(data[msg].date)}</span>
                                             <span class="nick">${data[msg].nick}</span>
                                             <span class="likes">${hearts}</span>
                                             <span class="sign2">/</span>
                                             <span class="dislikes">${poos}</span>
                                             <span class="sign">~</span>
                                           </div>
                                             `
                     messageDiv.appendChild(message);
                     messages.appendChild(messageDiv);

                     window.scrollTo(0,document.body.scrollHeight);
      }


  })

}
//------------------------------  END  --------------------------------------//

let printRowNumber = function (rowNumber) {
  let str = 0;

  if (rowNumber < 10){
      str = "0" + "0" + rowNumber
      return str;
  }else if(rowNumber > 9 && rowNumber < 100){
      str = "0" + rowNumber
      return str;
  }else{
    return rowNumber
  }
}

// ---------------------   Calulate the elapsed time ------------------------>

let calculateTime = function (time) {
    let now = new Date().getTime();
    timeSince = ((now - time) / 1000)


    if(timeSince < 86400){
      let hours = new Date(time).getHours();
      let minutes = new Date(time).getMinutes();
      hours < 10 ? hours = "0" + hours : hours;
      minutes < 10 ? minutes = "0" + minutes : minutes;
      return (hours + ":" + minutes);
    }else if(timeSince > 86400){
      return ">1d";
    }else if(timeSince > 172800){
      return ">2d";
    }else if(timeSince > 432000){
      return ">5d";
    }else if(timeSince > 864000){
      return ">10d";
    }else if(timeSince > 2592000){
      return ">1month";
    }else{
      return ">1month";
    }

}
//------------------------------  END  --------------------------------------//


let setNick = function () {
  if(localStorage.getItem("nick") != undefined){
    return localStorage.getItem("nick")

  }else{

    let myDataString = localStorage.getItem('user');
    let user = JSON.parse(myDataString);
    let nick ="";
    if (user.name){
      nick = user.name.substring(0, user.name.search(" "))
    }else{
      nick = "unknown"
    }
    window.localStorage.setItem('nick',nick);
    //return nick;

  }
}

// ---------------------   Login with diffrent providers ---------------------->

let facebookAuth = function () {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}




window.fbAsyncInit = function() {
    FB.init({
      appId      : '580629558939765',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8',
    });

    FB.AppEvents.logPageView();

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));









let gitHubAuth = function () {
  var provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithRedirect(provider);

}

let gmailAuth = function (){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);

}
//------------------------------ END -----------------------------------------//




//--------------  Load user signed in ---------------------------------------->

let loadUserLogin= function(){
  messages.innerText = "Loading.. Please wait while connecting to database..";

  firebase.auth().getRedirectResult().then(function(result) {

    if (result.credential) {
      var token = result.credential.accessToken;

    }

    var user = result.user;


  }).catch(function(error) {

    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });

}
//-------------------------  END --------------------------------------------//



// ----------------  Check if user is logged in --------------------------->
// mer info  https://firebase.google.com/docs/auth/web/manage-users?authuser=0

  let checkIfUserSignedIn = ()=>{
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          signedInAs.innerText = ("signed in as: " + user.displayName);
          saveUserToLocal(user);
          setNick();
          setChatHead(true);
          fetchFromDb();
      } else {
          setChatHead(false);
        // No user is signed in.
        document.getElementById('messages').innerText = "";
      }
    });
  }

// ---------------------- END ----------------------------------------------//



//-------------------- Logout user from provider ----------------------------->

let logOut = function () {
  firebase.auth().signOut().then(function(result){
    signedInAs.innerText = "not signed in";
    messages.innerText = "";
    removeFromLocal();

  }).catch(function(error){
  })

}

//-------------------------  END --------------------------------------------//



//-----------------------  set the chathead  ------------------------------//
// statusLogin is as boolen
let setChatHead = (statusLogin)=>{
  if(statusLogin){
    document.getElementById('chatHead').innerText = `${localStorage.getItem("nick")}@${room.name}>>`;
  }else{
    document.getElementById('chatHead').innerText = `>>`;
  }
}
//-------------------------  END --------------------------------------------//


//---------------------- ROOM functions ---------------------------------------/

db.ref(`rooms/`).on("value", function(snapshot){
  allRooms = snapshot.val();
  if(!allRooms || !allRooms.hasOwnProperty("general")){
    db.ref(`rooms/general/`).set(room);
  }
});

let checkWord=(str)=>{
  let alphaExp = /^[a-zA-Z]+$/;
  if(str.match(alphaExp) && str.length<11){
    return true
  }else{
    return false
  }
}

//----------------------
