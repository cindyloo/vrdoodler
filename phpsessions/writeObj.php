<?PHP

$unique_identifier = (isset($_POST['username']))?trim($_POST['username']):'';
$upload_directory = $_SERVER['DOCUMENT_ROOT'] . '/assets/doodleverse/' . $unique_identifier . '/scene/obj';

if (!file_exists($upload_directory)) {
	chdir($_SERVER['DOCUMENT_ROOT']);
    mkdir ( $upload_directory, 0777, true);
}
$original_filename = basename($_POST['filename']);
$destination = $upload_directory . "/" . $original_filename;

echo $destination;

if(isset($_FILES['file']) and !$_FILES['file']['error']){
    $fname = "11" . ".wav";

    move_uploaded_file($_FILES['file']['tmp_name'],$destination);
}


?>