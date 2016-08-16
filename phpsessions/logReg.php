<?php include "base.php"; 
;


echo $_POST['username']. ", " . $_POST['password'] . ", " . $_POST['email'];

$_SESSION['Username'] = "";
			$_SESSION['EmailAddress'] = "";
			$_SESSION['LoggedIn'] = 0;
echo "session" .  $_SESSION['Username'] . ", " . $_SESSION['LoggedIn'];
if(!empty($_POST['username']) && !empty($_POST['password']))
{
    $username = $_POST['username'];
    $password =$_POST['password'];


    $email =$_POST['email'];

echo $username . ", " . $password . ", " . $email;
    if (empty($_POST['email'])) {
    	//assume this is a login
    	
 		
		$stmt = $conn->prepare('SELECT * FROM users WHERE Username = :name AND Password = :pwd');

		$stmt->bindValue(':name', $username);
		$stmt->bindValue(':pwd', $password);
		$stmt->execute();
		
		$checklogin = $stmt->fetchAll();
   		echo count($checklogin);
		
		if ($checklogin > 0) {
		//$checklogin = mysql_query("SELECT * FROM users WHERE Username = '".$username."' AND Password = '".$password."'");

			$row = mysql_fetch_array($checklogin);
			$email = $row['EmailAddress'];
		 
			$_SESSION['Username'] = $username;
			$_SESSION['EmailAddress'] = $email;
			$_SESSION['LoggedIn'] = 1;
		 
			echo "<script>setResults('Successfully logged in.');</script>";
			echo "<script>setUserAndEmail('" . $username . "','" . $email . "');</script>";
		}
		else
		{
			echo "console.log('Error')";
			echo "<script>setResults('Sorry, your account could not be found. Please try again');</script>";
			
		}
	}
	elseif (!empty($_POST['email'])){ //assume this is a registration

  		
     	if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    		echo "<script>setResults('Sorry, your email is not valid. Please try again');</script>";
    		exit;
		}
		$email = $_POST['email'];
		$stmt = $conn->prepare("SELECT count(*) FROM users WHERE Username = :name");

		$stmt->bindValue(':name', $username);
		$stmt->execute();
		$checkusername = $stmt->fetchAll();

	  	
		$number_of_rows = $stmt->fetchColumn(); 
		echo $number_of_rows;		
		if ($number_of_rows > 0) {
			echo "console.log('Error')";
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
			
			echo $username . ", " . $password . ", " . $email;
			if(!$registerquery)
			{
			
				$_SESSION['Username'] = $username;
				$_SESSION['EmailAddress'] = $email;
				$_SESSION['LoggedIn'] = 0;
				echo "console.log('Success Registering')";
				echo "<script>setResults('Success Registering. Now please login.');</script>";
				
			}
			else
			{
				echo "<script>setResults('Sorry, your registration failed. Please try again');</script>";   
			}       
		 }
	}
}
else
{
	echo "something isn't working";
}
?>
