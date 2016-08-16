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
<script src="../js/app.js"></script>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '147502459013864',
      xfbml      : true,
      version    : 'v2.7'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
</head>  
<body>  
<div id="main">


<?php
if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username']))
{
?>
 
     <h1>Member Area</h1>
     <pThanks for logging in or registering! You are <code><?=$_SESSION['Username']?></code> and your email address is <code><?=$_SESSION['EmailAddress']?></code>.</p>
      
<?php
}
elseif(!empty($_POST['username']) && !empty($_POST['password']))
{
    $username = $_POST['username'];
    $password =$_POST['password'];
     echo "<h1>checking...</h1>";
    $email =$_POST['email'];
    
    if (empty($_POST['email'])) {
    	//assume this is a login
    	
 		
		$stmt = $conn->prepare('SELECT * FROM users WHERE Username = :name AND Password = :pwd');

		$stmt->bindValue(':name', $username);
		$stmt->bindValue(':pwd', $password);
		$stmt->execute();


		$checklogin = $stmt->fetch(PDO::FETCH_NUM);
   
   
		//$checklogin = mysql_query("SELECT * FROM users WHERE Username = '".$username."' AND Password = '".$password."'");
	 
		if($checklogin == 1)
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
	elseif (!empty($_POST['email'])){ //assume this is a registration

  		echo "<h1>checking email</h1>";
     
     	$stmt = $conn->prepare("SELECT count(*) FROM users WHERE Username = :name");

		$stmt->bindValue(':name', $username);
		$stmt->execute();
		 $checkusername = $stmt->fetchAll();

	  	echo count($checkusername);
		$number_of_rows = $stmt->fetchColumn(); 
		echo $number_of_rows;		
		if ($number_of_rows > 0) {
			echo "<h1>Error</h1>";
			echo "<p>Sorry, that username is taken. Please go back and try again.</p>";
		 }
		 else
		 {
			$stmt = $conn->prepare('INSERT INTO users (Username, Password, EmailAddress) VALUES(:name, :pwd, :email)');

			$stmt->bindValue(':name', $username);
			$stmt->bindValue(':pwd', $password);
			$stmt->bindValue(':email', $email);
			$stmt->execute();
			$registerquery =  $stmt->fetch(PDO::FETCH_NUM);
			
			echo $registerquery;
			if(!$registerquery)
			{
				echo "<h1>Success</h1>";
				echo "<p>Your account was successfully created. Sending you to main page";
				echo "<script>setUserAndEmail('" . $username . "','" . $email . "');</script>";
			}
			else
			{
				echo "<h1>Error</h1>";
				echo "<p>Sorry, your registration failed. Please go back and try again.</p>";    
			}       
		 }
	}
}
else
{
?>
	<div data-role="main" class="ui-content">
	
		<a href="#login" data-rel="popup" class="">Login</a>
		<a href="#register" data-rel="popup" class="">Register</a>
		
		<div data-role="popup" id="login" class="ui-content" style="min-width:250px;">
    		<h1>Member Login</h1>
     
			<form method="post" action="logReg.php" name="loginform" id="loginform">
				<fieldset>
					<label for="username">Username:</label><input type="text" name="username" id="username" /><br />
					<label for="password">Password:</label><input type="password" name="password" id="password" /><br />
					<input type="submit" name="login" id="login" value="Login" />
				</fieldset>
			</form>
    	</div>
    	
    	
    	<div data-role="popup" id="register" class="ui-content" style="min-width:250px;">
    		<h1>Registration</h1>
     
   			<p>Welcome! Please enter below to register</a>.</p>
 
			<form method="post" action="logReg.php" name="registerform" id="registerform">
				<fieldset>
					<label for="username">Username:</label><input type="text" name="username" id="username" /><br />
					<label for="password">Password:</label><input type="password" name="password" id="password" /><br />
					<label for="email">Email Address:</label><input type="text" name="email" id="email" /><br />
					<input type="submit" name="register" id="register" value="Register" />
				</fieldset>
			</form>
    	</div>
  </div>

<?php
}
?>
</div>    

</body>
</html>