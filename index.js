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

  let object = {  // exempel objekt
  	name: 'Johan',
  	msg: 'tada'
  };
  db.ref('messages/').push(object);



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
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
  signedInAs.innerHTML = "signed in as: " + user.displayName;
  saveToLocal(user.displayName);
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
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
  if (message == "#help"){
    document.getElementById("messages").innerHTML += "#login github<br>#login gmail<br>#logout<br>#changenick<br>#clear"
    document.getElementById('chatMessage').value = "";
  }else if(message == "#login github"){
    gitHubAuth();
    document.getElementById('chatMessage').value = "";
  }else if(message == "#login gmail"){
    gmailAuth();
    console.log("logga in med gmail")
  }else if(message == "#logout"){
      logOut();
  }else {  // sparar meddelande till databas
    let myDataString = localStorage.getItem('user');  // hämta
    let user = JSON.parse(myDataString);
    console.log(user);
    let msg = {
      date: new Date(),
      user: user.name,
      nick: "none",
      msg: message
    }
    db.ref('messages/').push(msg);
  }
  document.getElementById('chatMessage').value = "";
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
