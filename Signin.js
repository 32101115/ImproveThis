// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var submit = document.getElementById("submit").value;
    if ( username == "admin" && password == "admin"){
        alert("successful login.");
        window.location.replace("main.html");
        //window.parent.showModal("main.html");
        return false;
        }
    else{
        alert("Email or password incorrect! Try again.");
        // Disabling fields after 3 attempts.
        }
}
function redirect () {
    location.href ="www.google.com";

}
