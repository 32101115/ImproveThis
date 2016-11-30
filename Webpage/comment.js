var main = 'http://localhost:8000/getImprovement/?improvementState=ONGOING&region=CoC&improvementId=';
var Id;
var dialog;
var commenter;
var region;
function openComment(id) {
  Id = id;
    $( "#detailBox" ).dialog();
          $.ajax({
              url:main+encodeURIComponent(Id),
              method: 'GET',
              dataType: 'json',
              success: function(getData) {
                    displayComment(getData);
              },
              error: function() {
                      alert('error loading data(comment list)');
              }
          });
}
$(function () {
        $('#add').on('click', function() {
          if (commenter != null) {
            var newComment = document.getElementById('form-control').value;
            var fullUrl = 'http://localhost:8000/postComment/?improvementState=ONGOING&region=CoC&improvementId='
                +encodeURIComponent(Id)+'&comment='+encodeURIComponent(newComment)+'&userId='+encodeURIComponent(commenter);
              $.ajax({
                type: 'GET',
                url:fullUrl,
                dataType:'json',
                success: function(getData) {
                  var temp = $('#commentList');
                  var count = getData.discussionList.length;
                  var obj = getData.discussionList[count];
                  temp.append("<li>"+commenter +": "+newComment+"<li>");
                },
                error: function() {
                  alert('error saving new(comment)');
                }
              });
            } else {
              alert("please log in first");
            }
          }); 
            $('#like').on('click', function() {
              if (commenter != null) {
                var fullUrl = 'http://localhost:8000/upvote/?improvementState=ONGOING&region=CoC&improvementId='
                              +encodeURIComponent(Id);
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
              } else {
                alert("please log in first");
              }
            });
});  
$('#detailBox').on('dialogclose', function(event) {
    deleteTable(Id);
    deleteComment();
 });
function getCommenter(commenter) {
    this.commenter = commenter;
}
function displayComment(getData) {
    document.getElementById("Name").innerHTML = getData.creator;
    document.getElementById("Region").innerHTML = getData.location;
    document.getElementById("Desc").innerHTML = getData.description;
    var temp = $('#commentList');
    for (var i = 0; i < getData.discussionCount; i++) {
        var obj = getData.discussionList[i];
        temp.append("<li>"+obj.userId +": "+obj.contents+"</li>");
    }
}
function deleteComment() {
    $("#commentList").html(""); 

}

