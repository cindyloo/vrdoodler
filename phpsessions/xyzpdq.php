<?php include "base.php"; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<title>User Management System (Tom Cameron for NetTuts)</title>
<link rel="stylesheet" href="../style.css" type="text/css" />

<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
</head>  
<body>  
<div id="main">

<?php
function login(){

if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username']))
{
?>
 
     <h1>Member Area</h1>
     <pThanks for logging in! You are <code><?=$_SESSION['Username']?></code> and your email address is <code><?=$_SESSION['EmailAddress']?></code>.</p>
      
<?php
}
elseif(!empty($_POST['username']) && !empty($_POST['password']))
{
    $username = mysql_real_escape_string($_POST['username']);
    $password = md5(mysql_real_escape_string($_POST['password']));
     
    $checklogin = mysql_query("SELECT * FROM users WHERE Username = '".$username."' AND Password = '".$password."'");
     
    if(mysql_num_rows($checklogin) == 1)
    {
        $row = mysql_fetch_array($checklogin);
        $email = $row['EmailAddress'];
         
        $_SESSION['Username'] = $username;
        $_SESSION['EmailAddress'] = $email;
        $_SESSION['LoggedIn'] = 1;
         
        echo "<h1>Success</h1>";
        echo "<p>We are now redirecting you to the member area.</p>";
        echo "<meta http-equiv='refresh' content='=2;index.php' />";
    }
    else
    {
        echo "<h1>Error</h1>";
        echo "<p>Sorry, your account could not be found. Please <a href=\"index.php\">click here to try again</a>.</p>";
    }
}
else
{
?>
    <script>
    	function showLogin(){
    		document.getElementById("loginsection").style.display = "inline-block";
    	}
    	
    </script>
    
	<div id="loginsection" >

   
	  <div data-role="main" class="ui-content">
		<a href="#login" data-rel="popup" class="">Login or Register</a>

		<div data-role="popup" id="login" class="ui-content" style="min-width:250px;">
    		<h1>Member Login</h1>
     
   			<p>Welcome! Please either login below, or <a href="register.php">click here to register</a>.</p>
 
			<form method="post" action="index.php" name="loginform" id="loginform">
			<fieldset>
				<label for="username">Username:</label><input type="text" name="username" id="username" /><br />
				<label for="password">Password:</label><input type="password" name="password" id="password" /><br />
				<input type="submit" name="login" id="login" value="Login" />
			</fieldset>
			</form>
    	</div>
  	</div>

</div>    
<?php
} //else

} //function login

?>
 
<?php
	login();
?>

</div>
</body>
</html>