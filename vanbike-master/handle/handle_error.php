<?php
if(isset($_POST['error'])) {
	session_start();
	$_SESSION['error'] = $_POST['error'];
}
?>