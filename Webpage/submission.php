<?php
// Fetching Values From URL
$number2 = $_POST['number1'];
$title2 = $_POST['title1'];
$des2 = $_POST['des1'];
$name2 = $_POST['name1'];
$date2 = $_POST['date1'];
$view2 = $_POST['view1'];
$like2 = $_POST['like1'];

$connection = mysql_connect("localhost", "root", ""); // Establishing Connection with Server..
$db = mysql_select_db("mydba", $connection); // Selecting Database
if (isset($_POST['number1'])) {
$query = mysql_query("insert into form_element(new-number, new-title, new-des, 
new-name, new-date, new-view, new-like) values ('$number2', '$title2', '$des2',
'$name2','$date2','$view2','$like2')"); //Insert Query
echo "Form Submitted succesfully";
}
mysql_close($connection); // Connection Closed
?>