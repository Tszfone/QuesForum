<?php
    $conn=mysqli_connect('sophia.cs.hku.hk', 'tfcheng', 'data*526', 'tfcheng') or die ('Error! '.mysqli_connect_error($conn));

    if ($_POST["action"] == "upvote") {
        $qid = $_POST["qid"];
        $uid = $_POST["uid"];

        $query = "select * from Question where qid = '$qid'";
        
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        while($row = mysqli_fetch_array($result)) {
            $upvote_list = json_decode($row['up'], true);
        }

        $exist = false;
        if (count($upvote_list) != 0) {
            if (in_array(intval($uid), $upvote_list)) {
                $exist = true;
            }
        }
        
        if ($exist == false) {
            array_push($upvote_list, intval($uid));
            $new_upvote_list = json_encode($upvote_list);
            $query = "update Question set up = '$new_upvote_list' where qid = '$qid'";
            
            $data = ["▲ Upvote(".count($upvote_list).")"];

        } else {
            $key = array_search(intval($uid), $upvote_list);
            if ($key !== null) {
                unset($upvote_list[$key]);
            }
            $new_upvote_list = json_encode($upvote_list);
            $query = "update Question set up = '$new_upvote_list' where qid = '$qid'";
            
            $data = ["△ Upvote(".count($upvote_list).")"];
        }

        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        
        header('Content-type: application/json');
        echo json_encode($data);
    }

    mysqli_free_result($result);
    mysqli_close($conn); 
?>