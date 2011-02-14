<?php
define("MAX_SIZE",210400);
if($_FILES["uploadfile"]["size"] > MAX_SIZE) echo "toobig";
else{
	$uploaddir = './uploads/'; 
	$file = $uploaddir . basename($_FILES['uploadfile']['name']); 
	 
	if (move_uploaded_file($_FILES['uploadfile']['tmp_name'], $file)) { 
	  echo "success"; 
	} else {
		echo "error";
	}
}

?>