$(function () {
    var $getData = $('#resultDiv');
    var $name = $('#newName');
    var $date = $('#newDate');
    var $desc = $('#newDesc');
    var $title = $('#newTitle');

    function addNew(addOne) {
        $getData.append(
                    '<tr>
                      <td>' + addOne.newTitle + '</td>
                      <td>' + addOne.newDesc + '</td>
                      <td>' + addOne.newName + '</td>
                      <td>' + addOne.newDate + '</td>
                    </tr>');
    }
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
          url:'',
          data: add,
          success: function(newAdd) {
              addNew(newAdd);
          },
          error: function() {
            alert('error saving new');
          }
        });
    });

    $.ajax({
        url:'',
        method: 'GET',
        dataType: 'json',
        success: function(getData) {
            $.each(getData, function(i, data) {
                addNew(getData);
            });
        },
        error: function() {
                alert('error loading data');
        }
    });
});   