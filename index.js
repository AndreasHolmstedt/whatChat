window.addEventListener('load',function(event){
  let btnLoggIn = document.getElementById('btnLoggIn');
  let userName = document.getElementById('userName');
  let gitHubLogIn = document.getElementById('gitHubLogIn');
  let gmailLogIn = document.getElementById("gmailLogIn");
  let signedInAs = document.getElementById('signedInAs');
  let gitHubLogOutButton = document.getElementById('gitHubLogOut');




  gmailLogIn.addEventListener('click',function(event){
    console.log("hej");
    googleLoggIn();
  })


  gitHubLogIn.addEventListener("click", function(){
    console.log("säck");
    gitHubAuth();
  });

  let gitHubAuth = function () {

    var provider = new firebase.auth.GithubAuthProvider();

    provider.setCustomParameters({
      'allow_signup': 'true'
    });

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      signedInAs.innerHTML = "logged in as"
      signedInAs.innerHTML += user.displayName;
      console.log("github user:", user.displayName);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("github error: ", errorMessage);
});
  }


gitHubLogOutButton.addEventListener("click", function(){
  gitHubLogOut();
});

let gitHubLogOut = function () {
  firebase.auth().signOut().then(function(result){
    console.log("sign out success");
  }).catch(function(error){
    console.log("sign out failed");
  })

}




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


})


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


let loggIn = (name)=>{
  let data = {
    name: name
  }
  let dataStr = JSON.stringify(data);
  window.localStorage.setItem('data',dataStr);
  btnLoggIn.innerHTML = "Logga ut"
}

let loggOut = ()=>{
  window.localStorage.removeItem('data');
  btnLoggIn.innerHTML= "Logga in";
  userName.value= '';

}







let googleLoggIn = function (){
  var provider = new firebase.auth.GoogleAuthProvider();
  console.log("loggin google function started");
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
  console.log(user);
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

  document.getElementById('chatMessage').value = "";

  console.log("hejhej")
}
