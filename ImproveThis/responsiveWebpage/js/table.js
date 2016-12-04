var array = [];
$(function () {
    $.getJSON('http://bda7007d.ngrok.io/getImprovementNames/?region=CoC', function(data){
      for (var i = 0; i < data.length; i++) {
        if (data[i] != null) {
            $.ajax({
                  url:'http://bda7007d.ngrok.io/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
                      +encodeURIComponent(data[i]),
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
                          alert('error loading data(list)');
                  }
            });
          }
        }
    }).done(function() {
      createTable();
    });
});

function createTable() {
  for (var i = array.length - 1; i >= 0; i--) {
      if (array[i] != null) {
        $('#table').append(
          '<li>'
            + '<h5>'+'Title: '
            + array[i].title+'</h5>'
            + '<span class="tag tag-pill tag-success float-xs-right">'
            + 'creator: '+array[i].creator+'</span>'+'<br>'
            + '<span>'+'Date: '+array[i].time+'</span>'+'<br>'
            + '<span>'+' Location: '+array[i].region+'</span>'
            + '<p>'+'description: '+array[i].desc+'</p>'
            + '<span>'+'Likes: '+array[i].upvotes+'</span>'
          + '</li>'
          )
      }
  }
}
