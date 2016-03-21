<?PHP

$dir = "../assets/doodleverse"; //$_GET["q"];
    // add trailing slash if missing
    if(substr($dir, -1) != "/") $dir .= "/";
	
	
$files = scandir($dir); 
$total = count($files); 

$images = array(); 
for($x = 0; $x <= $total; $x++): if ($files[$x] != '.' && $files[$x] != '..' ) { $images[] = $files[$x]; }	
endfor;


$filename = $images[0];
$handle = fopen($dir . $filename, "r");
$filesize = filesize($dir.$filename);
$contents = fread($handle, $filesize);
fclose($handle);

echo $contents;
?>

