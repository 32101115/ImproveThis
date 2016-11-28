//don't forget http://localhost:8000/static/main.html

var globalId;
var lat;
var lng;
$(function () {
    $.getJSON('http://localhost:8000/getImprovementNames/?region=CoC', function(data){
      for (var i = 0; i < data.length; i++) {
        globalId = data[i];
        $.ajax({
              url:'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='+encodeURIComponent(globalId),
              method: 'GET',
              dataType: 'json',
              success: function(getData) {
                var date = new Date(getData.creationDate);
                    $('#to-do-list').append(
                      '<tr>'
                        + '<td>'+getData.improvementId+'</td>'
                        + '<td>'+getData.title+'</td>'
                        + '<td><a onclick=openComment('+getData.improvementId+')>'+getData.description+'</a></td>'
                        + '<td>'+getData.creator+'</td>'
                        + '<td>'+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear()+'</td>'
                        + '<td>'+getData.upvotes+'</td>'
                      + '</tr>'
                      )
                  $.getScript('googlemap.js', function() {
                    pinDown(getData.xPosition, getData.yPosition);
                  });

              },
              error: function() {
                      alert('error loading data(main)');
              }
        });
      }
    });

    $('#submit').on('click', function() {
        lat = getLat();
        lng = getLng();

        var title = document.getElementById('newTitle').value;
        var name = document.getElementById('newName').value;
        var desc = document.getElementById('newDesc').value;
        var region = document.getElementById('newRegion').value;
        var dt = new Date();
        var date = (dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getFullYear();
        globalId++;
        if ((lat != null) && (lng != null)) {
          var fullUrl = 'http://localhost:8000/postImprovement/?region='+encodeURIComponent(region)+'&description=' + encodeURIComponent(desc) +'&xPosition=' + encodeURIComponent(lat)+'&yPosition='+encodeURIComponent(lng)+'&creator='+encodeURIComponent(name)+'&improvementId='+encodeURIComponent(globalId)+'&title='+encodeURIComponent(title);
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
    });
});
        //var givenUrl = 'http://localhost:8000/postImprovement/?region=Klaus&description=the bicycle rack is not enough around Klaus&xPosition=33.777154&yPosition=-84.396668&creator=qkorner3&improvementId=1';
