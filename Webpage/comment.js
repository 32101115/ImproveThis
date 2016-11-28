var main = 'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId=';
var Id;
var dialog;
var creator;
function openComment(id) {
  Id = id;
    $( "#detailBox" ).dialog();
          $.ajax({
              url:main+encodeURIComponent(Id),
              method: 'GET',
              dataType: 'json',
              success: function(getData) {
                    creator = getData.creator
                      document.getElementById("Name").innerHTML = getData.creator;
                      document.getElementById("Region").innerHTML = getData.region;
                      document.getElementById("Desc").innerHTML = getData.description;
                      var temp = $('#commentList');
                      for (var i = 0; i < getData.discussionCount; i++) {
                          var obj = getData.discussionList[i];
                          temp.append("<li>"+obj.userId +": "+obj.contents+"</li>");
                      }
              },
              error: function() {
                      alert('error loading data(comment list)');
              }
          });
}
$(function () {
        $('#add').on('click', function() {
          var newComment = document.getElementById('form-control').value;
          var fullUrl = 'http://localhost:8000/postComment/?improvementState=ONGOING&region=CoC&improvementId='+encodeURIComponent(Id)+'&comment='+encodeURIComponent(newComment)+'&userId='+encodeURIComponent(creator);
          $.ajax({
            type: 'GET',
            url:fullUrl,
            dataType:'json',
            success: function(getData) {
              var temp = $('#commentList');
              var count = getData.discussionList.length;
              var obj = getData.discussionList[count];
              temp.append("<li>"+creator +": "+newComment+"<li>");
            },
            error: function() {
              alert('error saving new(comment)');
            }
          });
        });
        $('#like').on('click', function() {
          var fullUrl = 'http://localhost:8000/upvote/?improvementState=ONGOING&region=CoC&improvementId='+encodeURIComponent(Id);
          var vote = 0;
          $.ajax({
            type: 'GET',
            url:fullUrl,
            dataType:'json',
            success: function(getData) {
              vote = getData.upvotes;
              getData.upvotes = vote;
              alert(vote);
            },
            error: function() {
              alert('error saving new(like)');
            }
          });
        });
});  
$('#detailBox').on('dialogclose', function(event) {
     location.reload();
 });


