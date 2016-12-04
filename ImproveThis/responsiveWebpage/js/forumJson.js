//don't forget http://localhost:8000/static/main.html
var globalId;
var lat, lag;
var array = [];
var id;

function getAllPinDown() {
  $.getJSON('http://bda7007d.ngrok.io/getImprovementNames/?region=CoC', function(data){
      for (var i = 0; i < data.length; i++) {
        if (isNaN(data[i])) {
          globalId = 0;
        } else {
          globalId = data[i];
          $.ajax({
                url:'http://bda7007d.ngrok.io/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
                    +encodeURIComponent(globalId),
                method: 'GET',
                dataType: 'json',
                success: function(getData) {
                  var impId = getData.improvementId;
                  var date = new Date(getData.creationDate);
                  time = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
                  array[impId] = {"region": getData.location ,"xPosition":getData.xPosition,"yPosition":getData.yPosition, 
                              "creator": getData.creator, "desc": getData.description, "time": time, 
                              "title": getData.title, "upvotes": getData.upvotes, "userId": getData.improvementId};
                  pinDown(getData.xPosition, getData.yPosition, getData.improvementId);

                },
                error: function() {
                        alert('error loading data(map)');
                }
          });
        }
      }
    }); 
}
function saveId(user) {
  this.id = user;
}

function sendIdea() {
  lat = getLat();
  lng = getLng();
  console.log(id);
  var lastId;
  if (array.length == 0) {
    lastId = 0;
  } else {
    lastId = Number(array[array.length-1].userId);
    lastId++;
  }
  var title = document.getElementById('title').value;
  var desc = document.getElementById('desc').value;
  var location = document.getElementById('location').value;
  var dt = new Date();
  var date = (dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getFullYear();
  if ((lat != null) && (lng != null)) {
    var fullUrl = 'http://bda7007d.ngrok.io/postImprovement/?region='+encodeURIComponent("CoC")
      +'&description=' + encodeURIComponent(desc) +'&xPosition=' + encodeURIComponent(lat)
      +'&yPosition='+encodeURIComponent(lng)+'&creator='+encodeURIComponent(id)
      +'&improvementId='+encodeURIComponent(lastId)+'&title='+encodeURIComponent(title)
      +'&location='+encodeURIComponent(location);

      $.ajax({
        type: 'GET',
        url:fullUrl,
        dataType:'json',
        success: function(newAdd) {
            console.log(lat);
            console.log(lng);
            array[lastId] = {"region": location ,"xPosition":lat,"yPosition":lng, 
                              "creator": "creatorId", "desc": desc, "time": time, 
                              "title": title, "upvotes": 0, "userId": lastId};
 
        },
        error: function() {
          alert('error saving new(idea submit)');
        }
      }).done(function(){
          sessionStorage.setItem("list",lastId);
          window.location = "./confirmidea.html";
    });
  } else {
      alert('pin down location on the map');
  }
}
