<?PHP

$dir = "../assets/doodleverse"; //$_GET["q"];
    // add trailing slash if missing
    if(substr($dir, -1) != "/") $dir .= "/";
	
	
$files = scandir($dir); 
$total = count($files); 

$images = array(); 
for($x = 0; $x <= $total; $x++): if ($files[$x] != '.' && $files[$x] != '..' ) { $images[] = $files[$x]; }	
endfor;

$fcount = count($images);

for($temp = 0; $temp <= $fcount; $temp++):if ($images){

	$filename = $images[$temp];

	//$handle = fopen($dir . $filename, "r");
	//$filesize = filesize($dir.$filename);
	//$contents = fread($handle, $filesize);
	//fclose($handle);
	$contents = file_get_contents($dir . $filename);
	echo $contents . 'EOF' ;
}endfor;





?>

