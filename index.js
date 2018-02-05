let allMsg = {};

window.addEventListener('load',function(event){
  let signedInAs = document.getElementById('signedInAs');
  let messages = document.getElementById("messages");
  let commands = document.getElementById("commands");
  let chatMessage = document.getElementById("chatMessage");

  checkIfUserSignedIn();
  loadUserLogin();

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
  window.localStorage.removeItem('data');
  userName.value= '';
}

// --------------------------  END  -----------------------------------------//


//FUNKTION FÖR ATT MARKERA CHATMESSAGE VID KEYPRESS ------------------------->

window.addEventListener("keydown", function(evt){
  if(evt.keyCode == 13){
    sendChatMessage();
  }else{
  chatMessage.focus();
  }
});

window.addEventListener("click", function(evt){
  chatMessage.focus();
});
// --------------------------  END  ----------------------------------------//


// ----------------------  Takes care of chat message ------------------------>

let sendChatMessage = function () {
  let message = document.getElementById('chatMessage').value;
  let messages = document.getElementById('messages');
  let myDataString = localStorage.getItem('user');  // hämta

  let user = JSON.parse(myDataString);

  if (message == "#help"){
    commands.innerHTML += "<p>#login github</p><p>#login gmail</p><p>#login facebook</p><p>#logout</p><p>#changenick</p><p>#clear</p><p>#like (followed by row number)</p><p>#dislike (followed by row number)</p><p>#remove (followed by row number)</p>"
  }else if(message == "#login github"){
    commands.innerHTML += "<p>#login github</p>";
    gitHubAuth();
  }else if(message == "#login gmail"){
    commands.innerHTML += "<p>#login gmail</p>";
    gmailAuth();
  }else if(message == "#login facebook"){
    facebookAuth();
    commands.innerHTML += "<p>#login facebook</p>"
  }else if(message == "#logout"){
    commands.innerHTML += "<p>#logout</p>";
      logOut();
  }else if (message.substring(0, 11) == "#changenick"){

    if (message.length < 23){
      let nick = message.substring(12, message.length)
      window.localStorage.setItem('nick',nick);
      commands.innerHTML += ("<p>" + message + "</p>");
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

       let likeObj = {
          value : "hearts",
          name: user.name
        }

      //  db.ref(`messages/${allMsg[row].id}/likes`).child("pelle").setValue(likeObj);
        db.ref(`messages/${allMsg[row].id}/likes/${user.Uid}`).set(likeObj);
      }


  }else if(message.substring(0, 8) == "#dislike"){
    let row = message.substring(9, message.length);
    if(isNumber(row) != true){
      commands.innerHTML += isNumber(row);
    }else{
      let likeObj = {
         value : "poos",
         name: user.name
       }

     //  db.ref(`messages/${allMsg[row].id}/likes`).child("pelle").setValue(likeObj);
       db.ref(`messages/${allMsg[row].id}/likes/${user.Uid}`).set(likeObj);
    }

  }else if (message.substring(0, 7) == "#remove"){
    commands.innerHTML += ("<p>" + message + "</p>");
    row = message.substring(8, message.length)
    if(isNumber(row) != true){
      commands.innerHTML += isNumber(row);
    }else{
      let msgId = allMsg[row].id
      db.ref("messages/" + msgId).remove();
    }
  }else if(message.substring(0, 1) == "#"){
    commands.innerHTML += "<p>invalid command</p>";
  }else{  // sparar meddelande till databas

    let msg = {
      date: firebase.database.ServerValue.TIMESTAMP,
      user: user.name,
      userUid: user.Uid,
      nick: setNick(),
      message: message,
      likes : {},
    }
    db.ref('messages/').push(msg);
  }

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
  db.ref("messages/").on("value", function(snapshot){
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
        messages.innerHTML += `
          <div>
            <span class="row">${printRowNumber(rowNumber++)}</span>
               <span class="time">${calculateTime(data[msg].date)}</span>
               <span class="nick">${data[msg].nick}</span>
            <span class="likes">${hearts}</span>
            <span class="sign2">/</span>
            <span class="dislikes">${poos}</span>
            <span class="sign">~</span>
            <span class="message">${data[msg].message}</span>
          </div>`
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
    let nick = user.name.substring(0, user.name.search(" "))
    return nick;
  }
}

// ---------------------   Login with diffrent providers ---------------------->

let facebookAuth = function () {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

let gitHubAuth = function () {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

let gmailAuth = function (){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}
//------------------------------ END -----------------------------------------//




//--------------  Load user signed in ---------------------------------------->

let loadUserLogin= function(){
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      var token = result.credential.accessToken;
    }
    fetchFromDb();
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
          signedInAs.innerHTML = ("signed in as: " + user.displayName);
          saveUserToLocal(user);
      } else {
        // No user is signed in.

      }
    });
  }

// ---------------------- END ----------------------------------------------//



//-------------------- Logout user from provider ----------------------------->

let logOut = function () {
  firebase.auth().signOut().then(function(result){
    signedInAs.innerHTML = "not signed in";
  }).catch(function(error){
  })

}

//-------------------------  END --------------------------------------------//
