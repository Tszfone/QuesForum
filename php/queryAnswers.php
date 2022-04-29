<?php
    $conn=mysqli_connect('sophia.cs.hku.hk', 'tfcheng', 'data*526', 'tfcheng') or die ('Error! '.mysqli_connect_error($conn));

    function formatOutput($row, $uid) {
        print "<div id=aid".$row['aid']." class='ans'>";
        print "<p class='name'>".$row['uname']."</p>";
        print "<p class='ansCreateDate'>answered on ".$row['time']."</p>";
        if ($uid == $row["uid"]) {
            print "<button class='delete_answer_btn' onclick='deleteAnswer(event)'>Delete</button>";
        }
        print "<p class='answer'>".$row['content']."</p>";
        print "</div>";
    }


    if ($_POST["action"] == "showAll") {
        $qid = $_POST["qid"];
        $uid = $_POST["uid"];

        $query = "select * from Answer where qid = '$qid' order by time";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));
        while($row = mysqli_fetch_array($result)) {
            formatOutput($row, $uid);
        }
    } else if ($_POST["action"] == "postAns") {
        $qid = $_POST["qid"];
        $content = $_POST["answer"];
        $uid = $_POST["uid"];
        $uname = $_POST["uname"];
        $time = $_POST["time"];

        // insert record
        $query = "insert into Answer values(NULL, '$qid', '$content', '$uid', '$uname', '$time')";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));

        $query = "update Question set answer = answer + 1 where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));
        
    } else if ($_POST["action"] == "delete") {
        $aid = $_POST["aid"];
        $qid = $_POST["qid"];
        
        $query = "delete from Answer where aid = '$aid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));

        $query = "update Question set answer = answer - 1 where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));

    } else if ($_POST["action"] == "count") {
        $uid = $_POST["uid"];
        $query = "selete aid from Answer where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        $count = 0;
        while($row = mysqli_fetch_array($result)) {
            $count = $count + 1;
        }
        echo $count;
    }


    mysqli_free_result($result);
    mysqli_free_result($result2);
    
    mysqli_close($conn);  

?>