var creator;
var id;
function createList() {
  $.ajax({
        url:'http://bda7007d.ngrok.io/getImprovement/?improvementState=ONGOING&region=CoC&improvementId='
            +encodeURIComponent(id),
        method: 'GET',
        dataType: 'json',
        success: function(getData) {
          console.log(getData.title);
          var date = new Date(getData.creationDate);
          time = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
          document.getElementById("title").innerHTML = getData.title;
          document.getElementById("creator").innerHTML = getData.creator;
          document.getElementById("desc").innerHTML = getData.description;
          document.getElementById("date").innerHTML = time;     
          document.getElementById("likes").innerHTML = getData.upvotes;               
          displayComment(getData);
        },
        error: function() {
                alert('error loading data(list)');
        }
  });
}

function setId() {
  this.id = sessionStorage.getItem("list");
  createList();
}
function setCreator(creator) {
  this.creator = creator;
}

function displayComment(getData) {
    var temp = $('#showComments');
    for (var i = 0; i < getData.discussionCount; i++) {
        var obj = getData.discussionList[i];
        temp.append("<li>"+obj.userId +": "+obj.contents+"</li>");
    }
}
function newComment() {
  if (creator != null) {
      var newComment = document.getElementById('newComment').value;
      if (newComment != null) {
        var fullUrl = 'http://bda7007d.ngrok.io/postComment/?improvementState=ONGOING&region=CoC&improvementId='
            +encodeURIComponent(id)+'&comment='+encodeURIComponent(newComment)+'&userId='+encodeURIComponent(creator);
          $.ajax({
            type: 'GET',
            url:fullUrl,
            dataType:'json',
            success: function(getData) {
              var temp = $('#showComments');
              var count = getData.discussionList.length;
              var obj = getData.discussionList[count];
              temp.append("<li>"+creator +": "+newComment+"</li>");
            },
            error: function() {
              alert('error saving new(comment)');
            }
          });
          document.getElementById("newComment").value = "";
        } else {
          alert("empty comment");
        }
      } else {
        alert("no creator");
      }
}
function newLikes() {
  if (creator != null) {
      var fullUrl = 'http://bda7007d.ngrok.io/upvote/?improvementState=ONGOING&region=CoC&improvementId='
                    +encodeURIComponent(id);
      $.ajax({
        type: 'GET',
        url:fullUrl,
        dataType:'json',
        success: function(getData) {
          document.getElementById("likes").innerHTML = getData.upvotes;          
        },
        error: function() {
          alert('error saving new(like)');
        }
      });
    } else {
      alert("please log in first");
    }
}




