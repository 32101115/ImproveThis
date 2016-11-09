
$(function () {
        $.ajax({
            url:'http://localhost:8000/postComment/?improvementState=ONGOING&region=CoC&improvementId=1&comment=this%20is%20a%20very%20good%20idea&userId=qkorner3',
            method: 'GET',
            dataType: 'json',
            success: function(getData) {
                document.getElementById("Name").innerHTML = getData.creator;
                document.getElementById("Region").innerHTML = getData.region;
                document.getElementById("Desc").innerHTML = getData.description;
                var temp = $('#commentList');
                for (var i = 0; i < getData.discussionList.length; i++) {
                    var obj = getData.discussionList[i];
                    temp.append("<li>"+obj.userId +": "+obj.contents+"</li>");
                }
            },
            error: function() {
                    alert('error loading data');
            }
        });
        $('#add').on('click', function() {
          var newComment = document.getElementById('form-control').value;
          var fullUrl = 'http://localhost:8000/postComment/?improvementState=ONGOING&region=CoC&improvementId=1&comment='+encodeURIComponent(newComment)+'&userId=qkorner3';
          $.ajax({
            type: 'GET',
            url:fullUrl,
            dataType:'json',
            success: function(getData) {
              var temp = $('#commentList');
              var count = 0;
                for (var i = 0; i < getData.discussionList.length; i++) {
                    count++;
                }
              temp.append("<li>"+getData.discussionList[count].userId +": "+getData.discussionList[count].contents+"/<li>");
            },
            error: function() {
              alert('error saving new');
            }
          });
        });
        $('#like').on('click', function() {
          var fullUrl = 'http://localhost:8000/upvote/?improvementState=ONGOING&region=CoC&improvementId=1';
          var vote = 0;
          $.ajax({
            type: 'GET',
            url:fullUrl,
            dataType:'json',
            success: function(getData) {
              vote = getData.upvotes + 1;
              getData.upvotes = vote;
              alert(vote);
            },
            error: function() {
              alert('error saving new');
            }
          });
        });
    
});  