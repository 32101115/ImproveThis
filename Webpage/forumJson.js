//don't forget http://localhost:8000/static/main.html

$(function () {
    var $getData = $('#resultDiv');
    var $name = $('#newName');
    var $date = $('#newDate');
    var $desc = $('#newDesc');
    var $title = $('#newTitle');

    /*function addNew(addOne) {
        $getData.append(
                    <tr>
                      <td>' + addOne.newTitle + '</td>
                      <td>' + addOne.newDesc + '</td>
                      <td>' + addOne.newName + '</td>
                      <td>' + addOne.newDate + '</td>
                    </tr>);
    }*/
    /*<td>' + addOne.newNumber + '</td>
                      <td>' + addOne.newTitle + '</td>
                      <td>' + addOne.newDesc + '</td>
                      <td>' + addOne.newName + '</td>
                      <td>' + addOne.newDate + '</td>
                      <td>' + addOne.newView+ '</td>
                      <td>' + addOne.newLike + '</td>*/

    $('#submit').on('click', function() {
        var add = {
          date: $date.val(),
          name: $name.val(),
          desc: $desc.val(),
          title: $title.val(),
        };
        $.ajax({
          type: 'POST',
          url:'http://localhost:4040/api/',
          data: add,
          success: function(newAdd) {
              //addNew(newAdd);
          },
          error: function() {
            alert('error saving new');
          }
        });
    });
    $('#request').on('click', function() {
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
                    + '<td>'+getData.description+'</td>'
                    + '<td>'+getData.creator+'</td>'
                    + '<td>'+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear()+'</td>'
                    + '<td>'+getData.improvementId+'</td>'
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
    });

});   