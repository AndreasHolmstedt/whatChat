window.addEventListener('load',function(event){
  let btnLoggIn = document.getElementById('btnLoggIn');
  let userName = document.getElementById('userName');
  let signedInAs = document.getElementById('signedInAs');
  let messages = document.getElementById("messages");





  // Logga in lokalt på pc ------------------------------------------------

  btnLoggIn.addEventListener('click',function(event){
    if(btnLoggIn.innerHTML=="Logga in"){
      loggIn(userName.value);
    }else{
      loggOut();
    }
  })

  let user = localStorage.getItem('data');
  user = JSON.parse(user);
  if(user){
    console.log(`inloggad som ${user.name}`);
    btnLoggIn.innerHTML="Logga ut";
    userName.value = user.name;
  }

  // ----------------------  END  --------------------------
  /*
  let object = {  // exempel objekt
  	name: 'Johan',
  	msg: 'tada'
    like: 0
  };

  db.ref('messages/').push(object);
  */
})  // end of windos load -----------------------------------------------


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3lpOkWssrMdhLmTPWDotBwSGufmifCeQ",
    authDomain: "whatchat95.firebaseapp.com",
    databaseURL: "https://whatchat95.firebaseio.com",
    projectId: "whatchat95",
    storageBucket: "",
    messagingSenderId: "304611024887"
  };
  firebase.initializeApp(config);
  console.log("Database config loaded");
  const db = firebase.database();
// Initialize Firebase END


let saveToLocal = (user)=>{
  let data = {
    name: user
  }
  let dataStr = JSON.stringify(data);
  window.localStorage.setItem('user',dataStr);
  btnLoggIn.innerHTML = "Logga ut"
}

let removeFromLocal = ()=>{
  window.localStorage.removeItem('data');
  btnLoggIn.innerHTML= "Logga in";
  userName.value= '';
}


let gmailAuth = function (){
  var provider = new firebase.auth.GoogleAuthProvider();
  console.log("loggin google function started");
  firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  var user = result.user;
  signedInAs.innerHTML = "signed in as: " + user.displayName;
  fetchFromDb();
  saveToLocal(user.displayName);
}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  console.log(errorCode,errorMessage,email,credential);
});

}

//FUNKTION FÖR ATT MARKERA CHATMESSAGE VID KEYPRESS
window.addEventListener("keydown", function(evt){
  if(evt.keyCode == 13){
    sendChatMessage();
  }else{
  chatMessage.focus();
  }
});


let sendChatMessage = function () {
  let message = document.getElementById('chatMessage').value;
  let messages = document.getElementById('messages');
  if (message == "#help"){
    messages.innerHTML += "<p>#login github</p><p>#login gmail</p><p>#logout</p><p>#changenick</p><p>#clear</p><p>#like (followed by row number)</p><p>#remove (followed by row number)</p>"
    document.getElementById('chatMessage').value = "";
  }else if(message == "#login github"){
    messages.innerHTML += "<p>#login github</p>";
    gitHubAuth();
    document.getElementById('chatMessage').value = "";
  }else if(message == "#login gmail"){
    messages.innerHTML += "<p>#login gmail</p>";
    gmailAuth();
    console.log("logga in med gmail")
  }else if(message == "#logout"){
    messages.innerHTML += "<p>#logout</p>";
      logOut();
  }else if (message == "#changenick"){
    // PUT CHANGE NICK METHOD here
    console.log("changenick");
  }else if (message == "#clear"){
    //hämta alla meddelande från databas
    console.log("clear");
  }else if (message.substring(0, 5) == "#like"){


    //lägg till like i databas samt uppdatera chatt
    //message.substring(6, message.length)
  }else if (message.substring(0, 7) == "#remove"){
    //message.substring(8, message.length)
  }else{  // sparar meddelande till databas
    let myDataString = localStorage.getItem('user');  // hämta
    let user = JSON.parse(myDataString);
    console.log(user);
    let msg = {
      date: new Date(),
      user: user.name,
      nick: "none",
      msg: message,
      likes: 0
    }
    db.ref('messages/').push(msg);
  }
  document.getElementById('chatMessage').value = "";
}

let fetchFromDb = function () {

  db.ref("messages/").on("value", function(snapshot){

      let data = snapshot.val();
      console.log(data);

  })
}

let gitHubAuth = function () {
  var provider = new firebase.auth.GithubAuthProvider();

provider.setCustomParameters({
    'allow_signup': 'true'
  });

  firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    signedInAs.innerHTML = "signed in as: " + user.displayName;
    fetchFromDb();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log("github error: ", errorMessage);
  });

}

let logOut = function () {
  firebase.auth().signOut().then(function(result){
    console.log("sign out success");
    signedInAs.innerHTML = "not signed in";
  }).catch(function(error){
    console.log("sign out failed");
  })

}
