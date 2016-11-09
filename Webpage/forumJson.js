//don't forget http://localhost:8000/static/main.html

$(function () {
    $.ajax({
            url:'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId=1',
            method: 'GET',
            dataType: 'json',
            success: function(getData) {
              var date = new Date(getData.creationDate);
                $('#to-do-list').append(
                  '<tr>'
                    + '<td>'+getData.improvementId+'</td>'
                    + '<td>'+getData.title+'</td>'
                    + '<td><a href=comment.html target=popup>'+getData.description+'</a></td>'
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
                    alert('error loading data');
            }
        });
    $('#submit').on('click', function() {

        var title = document.getElementById('newTitle').value;
        var name = document.getElementById('newName').value;
        var desc = document.getElementById('newDesc').value;
        var region = document.getElementById('newRegion').value;
        var dt = new Date();
        var date = (dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getFullYear();
        var id = 1;
        var lat;
        var lng;
        $.getScript('googlemap.js', function() {
                  lat = getLat();
                  lng = getLng();
        });

        var fullUrl = 'http://localhost:8000/postImprovement/?region='+encodeURIComponent(region)+'&description=' + encodeURIComponent(desc) +'&xPosition=' + encodeURIComponent(33.777154)+'&yPosition='+encodeURIComponent(-84.396668)+'&creator='+encodeURIComponent(name)+'&improvementId='+encodeURIComponent(id);
        //var givenUrl = 'http://localhost:8000/postImprovement/?region=Klaus&description=the bicycle rack is not enough around Klaus&xPosition=33.777154&yPosition=-84.396668&creator=qkorner3&improvementId=1';
        $.ajax({
          type: 'GET',
          //url:givenUrl,
          url:fullUrl,
          dataType:'json',
          success: function(newAdd) {
              console.log(fullUrl);
              console.log(lat);
              console.log(lng);
              $('#to-do-list').append(
                  '<tr>'
                    + '<td>'+newAdd.improvementId+'</td>'
                    + '<td>'+title+'</td>'
                    + '<td>'+newAdd.description+'</td>'
                    + '<td>'+newAdd.creator+'</td>'
                    + '<td>'+date+'</td>'
                    + '<td>'+0+'</td>'
                  + '</tr>'
                  )
                $.getScript('googlemap.js', function() {
                  pinDown(lat, lng);
                });
          },
          error: function() {
            alert('error saving new');
          }
        });
    });
});   