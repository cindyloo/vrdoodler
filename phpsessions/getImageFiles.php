<?PHP

$dir = $_GET["q"];
    // add trailing slash if missing
    if(substr($dir, -1) != "/") $dir .= "/";
	
	
$files = scandir($dir); 
$total = count($files); 

$images = array(); 
for($x = 0; $x <= $total; $x++): 
	$file_parts = pathinfo($files[$x]);
	if ($files[$x] != '.' && $files[$x] != '..' && $file_parts['extension'] == "jpg" ) { 
	$images[] = $files[$x]; }	
endfor;

$fcount = count($images);

for($temp = 0; $temp < $fcount; $temp++):if ($images){

	$filename = $images[$temp];

	//$handle = fopen($dir . $filename, "r");
	
  		echo ($filename);
    	
	//fclose($handle);
	//echo $contents . "EOF";
}endfor;
?>

