<?php
	require 'connect.php';

	$search_string = "";
	$query = "";
	if (isset($_POST['query'])) {
		$search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query']);
		$search_string = $sql_db->real_escape_string($search_string);
		$query = "SELECT * FROM atp_player_ranks where name = '$search_string'";
	}
	elseif (isset($_POST['query2'])) {
		$search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query2']);
		$search_string = $sql_db->real_escape_string($search_string);
		$query = "SELECT * FROM atp_similarities where name = '$search_string'";
	}
	$result = $sql_db->query($query);	
	while ($results = $result->fetch_array(MYSQLI_ASSOC)) {
		$resultArray[] = $results;
	}
	echo json_encode($resultArray);
?>