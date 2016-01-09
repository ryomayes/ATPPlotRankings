<?php
	require 'connect.php';

	if (isset($_POST['query'])) {
		$html = '';
		$html .= '<li class="result list-group-item">';
		$html .= '<p>name</p>';
		$html .= '</li>';

		$search_string = preg_replace("/[^A-Za-z0-9]/", " ", $_POST['query']);
		$search_string = $sql_db->real_escape_string($search_string);
		
		if (strlen($search_string) >= 1 && $search_string !== ' ') {

			$query = "SELECT * FROM atp_players where name LIKE '%".$search_string."%'";
			

			$result = $sql_db->query($query);
			$count = 0;
			while($count < 5 && ($results = $result->fetch_array())) {
				$result_array[] = $results;
				$count++;
			}
			if (isset($result_array)) {
				foreach ($result_array as $result) {
					$lowerRes = strtolower($result["name"]);
					$lower_str = strtolower($search_string);
					$name = preg_replace("/".$lower_str."/i", "<b class='highlight'>".$lower_str."</b>", $lowerRes);
					$output = str_replace('name', $name, $html);

					echo($output);
				}
			}
		}
	} elseif (isset($_POST['queryRand'])) {

		$query = "SELECT name FROM atp_players ORDER BY RAND() LIMIT 1";
		$result = $sql_db->query($query);
		$final = $result->fetch_array(MYSQLI_ASSOC);
		echo($final["name"]);
	}
?>