<?php
    $conn=mysqli_connect('sophia.cs.hku.hk', 'tfcheng', 'data*526', 'tfcheng') or die ('Error! '.mysqli_connect_error($conn));

    function formatOutput ($row, $exist) {
        print "<div id=qid".$row['qid']." class='question'>";

        print "<p class='space'>".$row['space']."</p>";

        print "<div class='createInfo'>";
        print "<p class='creatorName'>".$row['creatorName']."</p>";
        print "<p class='createDate'>".$row['time']."</p>";
        print "</div>";

        print "<article class='content'>";
        print "<h3 onclick='goQuestion(event)'>".$row['title']."</h3>";
        print "<p>".$row['content']."</p>";
        print "</article>";

        print "<br>";
        if ($exist) {
            print "<button class='sbtn' onclick='upvoteQuestion(event)'>▲ Upvote (".count(json_decode($row['up'])).")</button>";
        } else {
            print "<button class='sbtn' onclick='upvoteQuestion(event)'>△ Upvote (".count(json_decode($row['up'])).")</button>";
        }
        
        print "<button class='sbtn' onclick='showAnswersBelow(event)'>🖊️ Answer (".$row['answer'].")</button>";
        
        print "<div class='abma' style='display:none;'>";

        print "<div class='answersBelow' style='display:none;'>";
        print "</div>";

        print "<div class='my_ans' style='display:none;'>";
        print "<p class='uname'></p>";
        print "<p class='postAns' onclick='goNewAnsBox(event)'>Post your new answer.</p>";
        print "</div>";

        print "</div>";

		print "</div>";
    }

    function singleFormatOutput($row, $exist) {
        if ($exist) {
            print "<button class='ubtn' onclick='upvoteQuestion(event)'>▲ Upvote (".count(json_decode($row['up'])).")</button>";
        } else {
            print "<button class='ubtn' onclick='upvoteQuestion(event)'>△ Upvote (".count(json_decode($row['up'])).")</button>";
        }
        
        print "<button id='edit_btn' class='sbtn' onclick='showEditor()' style='display: none;'>Edit</button>";
        print "<button id='delete_btn' class='sbtn' onclick='deleteQuestion()' style='display: none;'>Delete</button>";
        
        print "<p class='space'>".$row['space']."</p>";
        
        print "<div class='createInfo'>";
        print "<p id=".$row["creatorid"]." class='name'>".$row['creatorName']."</p>";
        print "<p class='createDate'>posted on ".$row['time']."</p>";
        print "</div>";

        print "<article class='content'>";
        print "<h3>".$row['title']."</h3>";
        print "<p>".$row['content']."</p>";
        print "</article>";
    }
    
    if ($_POST["action"] == "showAll") {
        if ($_POST["filter"] == "alFilter") {
            $query = "select * from Question where space='Algorithm' order by time desc";
        } else if ($_POST["filter"] == "mlFilter") {
            $query = "select * from Question where space='Machine Learning' order by time desc";
        } else if ($_POST["filter"] == "syFilter") {
            $query = "select * from Question where space='System' order by time desc";
        } else if ($_POST["filter"] == "jsFilter") {
            $query = "select * from Question where space='Javascript' order by time desc";
        } else {
            $query = 'select * from Question order by time desc';
        }
        $uid = $_POST["uid"];

        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        while($row = mysqli_fetch_array($result)) {
            $upvote_list = json_decode($row['up'], false);

            $exist = false;
            if (in_array($uid, $upvote_list)) {
                $exist = true;
            }
        
            formatOutput($row, $exist);
        }


    } else if ($_POST["action"] == "showHot") {
        if ($_POST["filter"] == "alFilter") {
            $query = "select * from Question where space='Algorithm' order by up desc";
        } else if ($_POST["filter"] == "mlFilter") {
            $query = "select * from Question where space='Machine Learning' order by up desc";
        } else if ($_POST["filter"] == "syFilter") {
            $query = "select * from Question where space='System' order by up desc";
        } else if ($_POST["filter"] == "jsFilter") {
            $query = "select * from Question where space='Javascript' order by up desc";
        } else {
            $query = 'select * from Question order by up desc';
        }
        $uid = $_POST["uid"];

        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        while($row = mysqli_fetch_array($result)) {
            $upvote_list = json_decode($row['up'], false);
            $exist = false;
            if (in_array($uid, $upvote_list)) {
                $exist = true;
            }
            formatOutput($row, $exist);
        }


    } else if ($_POST["action"] == "add") {
        $space = $_POST["space"];
        $title = $_POST["title"];
        $content = $_POST["content"];
        $time = $_POST["time"];
        $creatorid = $_POST["creatorid"];
        $creatorName = $_POST["creatorName"];

        $query = "insert into Question values(NULL, '$space', '$title', '$content', 0, '[]', '$time', '$creatorid', '$creatorName')";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));
        echo "Question added";


    } else if ($_POST["action"] == "showOne") {
        $qid = $_POST["qid"];
        $uid = $_POST["uid"];
        $query = "select * from Question where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        while($row = mysqli_fetch_array($result)) {
            $upvote_list = json_decode($row['up'], false);
            $creatorid = $row["creatorid"];
            $exist = false;
            if (in_array($uid, $upvote_list)) {
                $exist = true;
            }
            singleFormatOutput($row, $exist);
        }
        

    } else if ($_POST["action"] == "edit") {
        $space = $_POST["space"];
        $title = $_POST["title"];
        $content = $_POST["content"];
        $qid = $_POST["qid"];

        $query = "update Question set space = '$space', title = '$title', content = '$content' where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));


    } else if ($_POST["action"] == "delete") {
        $qid = $_POST["qid"];
        $query = "delete from Question where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));

        $query = "delete from Answer where qid = '$qid'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        
    } else if ($_POST["action"] == "search") {
        $searchKey = $_POST["searchKey"];
        $query = "select * from Question where title like '%$searchKey%'";
        $result = mysqli_query($conn, $query) or die ('Failed to query '.mysqli_error($conn));
        
        while($row = mysqli_fetch_array($result)) {
            $upvote_list = json_decode($row['up'], false);

            $exist = false;
            if (in_array($uid, $upvote_list)) {
                $exist = true;
            }
        
            formatOutput($row, $exist);
        }

    }

    mysqli_free_result($result);
    mysqli_close($conn);  
?>
