<?php
header("Access-Control-Allow-Origin: *");
var_dump($_POST);

if(isset($_POST['authkey']) && $_POST['authkey']!="" ){
	if(isset($_POST['wmdata'])){
		file_put_contents("userdata/".$_POST['authkey'].".data" , $_POST['wmdata'] );
	}else{
		echo "datafile";
	}
}else{
	echo "Authentication";
}
