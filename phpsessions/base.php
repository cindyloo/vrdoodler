<?php
session_start();
 
$dbhost = "vrdoodlercom.fatcowmysql.com/"; // this will ususally be 'localhost', but can sometimes differ
$dbname = "doodlers"; // the name of the database that you are going to use for this project
$dbuser = "user_1"; // the username that you created, or were given, to access your database
$dbpass = "_vrdoodler12*"; // the password that you created, or were given, to access your database
 
//mysql_connect($dbhost, $dbuser, $dbpass) or die("MySQL Error: " . mysql_error());
//mysql_select_db($dbname) or die("MySQL Error: " . mysql_error());
$cnstr = "mysql:host=vrdoodlercom.fatcowmysql.com;dbname=doodlers";

$conn = new PDO( $cnstr,$dbuser,$dbpass);
?>