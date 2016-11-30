$(function () {
    var username;
    var password;
    $('#login').on('click', function() {
    	username = document.getElementById("username").value;
   		password = document.getElementById("password").value;
        $.getJSON('http://5b63a9f6.ngrok.io/getUserInfo/?userId='+encodeURIComponent(username), function(getData){
            if (password == getData.password) {
            	console.log("success");
            	getCreatorId(username);
            	document.getElementById("greating").innerHTML = "Hi! "+username;
            	document.getElementById("username").value = "";
      			document.getElementById("password").value = "";
            } else {
            	alert("password or id is incorret");
            }
        });
    });
    $('#create').on('click', function() {
    	    username = document.getElementById("username").value;
   			password = document.getElementById("password").value;
        $.ajax({
            url:'http://5b63a9f6.ngrok.io/createUser/?userId='+encodeURIComponent(username)+
            	'&password='+encodeURIComponent(password),
            method: 'GET',
            dataType: 'json',
            success: function(getData) {
                getCreatorId(getData.userId);
                console.log(getData.userId);
                console.log(getData.password);
                document.getElementById("greating").innerHTML = "Hi! "+username;
            },
            error: function() {
                    alert('error creating id');
            }
	  	});
	});  
});
function logOut() {
	location.reload();
}
