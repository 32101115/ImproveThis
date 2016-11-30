//don't forget http://localhost:8000/static/main.html
var globalId;
var lat, lag;
var array = [];
var id;
var creatorId;
var region;
$(function () {
    $.getJSON('http://localhost:8000/getImprovementNames/?region=CoC', function(data){
      for (var i = 0; i < data.length; i++) {
        if (isNaN(data[i])) {
          globalId = 0;
        } else {
          globalId = data[i];
          $.ajax({
                url:'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
                    +encodeURIComponent(globalId),
                method: 'GET',
                dataType: 'json',
                async: false,
                success: function(getData) {
                  var id = getData.improvementId;
                  var date = new Date(getData.creationDate);
                  time = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
                  array[id] = {"region": getData.location ,"xPosition":getData.xPosition,"yPosition":getData.yPosition, 
                              "creator": getData.creator, "desc": getData.description, "time": time, 
                              "title": getData.title, "upvotes": getData.upvotes, "userId": getData.improvementId};
                },
                error: function() {
                        alert('error loading data(main)');
                }
          });
        }
      }
    }).done(function(){
      createTable();
    }); 

    $('#submit').on('click', function() {
        lat = getLat();
        lng = getLng();
        globalId++;
        if (creatorId != null) {
          console.log(globalId);
          var title = document.getElementById('newTitle').value;
          var desc = document.getElementById('newDesc').value;
          region = document.getElementById('newRegion').value;
          var dt = new Date();
          var date = (dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getFullYear();
          if ((lat != null) && (lng != null)) {
            var fullUrl = 'http://localhost:8000/postImprovement/?region='+encodeURIComponent("CoC")
              +'&description=' + encodeURIComponent(desc) +'&xPosition=' + encodeURIComponent(lat)
              +'&yPosition='+encodeURIComponent(lng)+'&creator='+encodeURIComponent(creatorId)
              +'&improvementId='+encodeURIComponent(globalId)+'&title='+encodeURIComponent(title)
              +'&location='+encodeURIComponent(region);
            $.ajax({
              type: 'GET',
              url:fullUrl,
              dataType:'json',
              success: function(newAdd) {
                  console.log(fullUrl);
                  console.log(lat);
                  console.log(lng);
              },
              error: function() {
                alert('error saving new(main submit)');
              }
            });
          } else {
              alert('pin down location on the map');
          }
        } else {
              alert('please log in first');
        }
    });
});
function increasingOrder() {
      array.sort(function(a, b) {
      console.log(a.userId);
      console.log(b.userId);
      return a.userId - b.userId;
  });
}
function getCreatorId(creatorId) {
  this.creatorId = creatorId;
  console.log(creatorId);
  getCommenter(creatorId);
}
function createTable() {
  for (var i = 0; i < array.length; i++) {
      if (array[i] != null) {
        $('#to-do-list').append(
          '<tr>'
            + '<td>'+array[i].userId+'</td>'
            + '<td>'+array[i].title+'</td>'
            + '<td><a onclick=openComment('+array[i].userId+')>'+array[i].desc+'</a></td>'
            + '<td>'+array[i].creator+'</td>'
            + '<td>'+array[i].time+'</td>'
            + '<td>'+array[i].upvotes+'</td>'
          + '</tr>'
          )
          pinDown(array[i].xPosition, array[i].yPosition);
      }
  }
}
function deleteTable(param) {
  $("#body").html(""); 
  updateTable(param);
}
function updateTable(param) {
  console.log(param);
  $.ajax({
      url:'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
              +encodeURIComponent(param),
      method: 'GET',
      dataType: 'json',
      async: false,
      success: function(getData) {
      array[param] = {"region": getData.location ,"xPosition":getData.xPosition,"yPosition":getData.yPosition, 
                    "creator": getData.creator, "desc": getData.description, "time": time, 
                    "title": getData.title, "upvotes": getData.upvotes, "userId": getData.improvementId};
      },
      error: function() {
              alert('error loading data(main)');
      }
  }).done(function(){
      createTable();
  }); 
}


        //var givenUrl = 'http://localhost:8000/postImprovement/?region=Klaus&description=the bicycle rack is not enough around Klaus&xPosition=33.777154&yPosition=-84.396668&creator=qkorner3&improvementId=1';
