function logIn() {
	var username = document.getElementById("username").value;
   	var password = document.getElementById("password").value;
    $.getJSON('http://bda7007d.ngrok.io/login/?userId='+encodeURIComponent(username)+'&password='+encodeURIComponent(password), function(getData){
        if (getData.loginStatus == true) {
        	console.log("success");
        	checkCookie("form/title", username);
        } else {
        	alert("password or id is incorret");
        }
    });
}
function createId() {
	var username = document.getElementById("username").value;
   	var password = document.getElementById("password").value;
   	$.ajax({
        url:'http://bda7007d.ngrok.io/createUser/?userId='+encodeURIComponent(username)+
        	'&password='+encodeURIComponent(password),
        method: 'GET',
        dataType: 'json',
        success: function(getData) {
            console.log(getData.userId);
            console.log(getData.password);
            alert('Id created');
            document.getElementById("username").value = "";
      		document.getElementById("password").value = "";
        },
        error: function() {
                alert('error creating id');
        }
	});

}