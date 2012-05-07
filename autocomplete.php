<?php
if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
  header('HTTP/1.0 404 Not Found');
  exit;
}

	//maximum number of results to return
	$max_return = 5;
	
	$term = htmlspecialchars($_GET['search_term']);
	
	/*** mysql hostname ***/
	$hostname = 'localhost';
	
	/*** mysql username ***/
	$username = 'root';
	
	/*** mysql password ***/
	$password = '';
	
	$database = "search_db";
	
	try {
	    $dbh = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
    }
	catch(PDOException $e) {
	    //echo $e->getMessage();
	    return false;
    }
	
	$results = array();
	
	$query_count = 1;
	
	while($max_return > 0 && $query_count <= 3){
	
		$query = $dbh->prepare("SELECT term FROM searchable WHERE term LIKE :term LIMIT :max");
		
		switch($query_count){
			case 1:
				$query->bindValue(':term', $term.'%', PDO::PARAM_STR);
				break;
			case 2:
				$query->bindValue(':term', '%'.$term, PDO::PARAM_STR);
				break;
			case 3:
				$query->bindValue(':term', '%'.$term.'%', PDO::PARAM_STR);
				break;
		
		}
		
		$query->bindValue(':max', $max_return, PDO::PARAM_INT);
		
		try {
			$query->execute();
		}
		catch(PDOException $e) {
		    return false;
		    //echo $e->getMessage();
	    }
		
		$rows = $query->rowCount();
		
		
		
		if($rows > 0) {
			$query_result = $query->fetchAll(PDO::FETCH_ASSOC);
			foreach($query_result as $r) {
				$push = true;
				foreach($results as $i){
					if($r == $i) {
						$push = false;
					}
				}
				if($push){
					array_push($results, $r);
				}
			}
			$max_return -= $rows;
		}
		$query_count++;
	}

	if(count($results) > 0) {
		echo json_encode($results);
	} else {
		return false;
	}
?>