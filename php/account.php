<?php

    $conn=mysqli_connect('xxx', 'xxx', 'xxx', 'xxx') or die ('Error! '.mysqli_connect_error($conn));

    if ($_POST["action"] == "login") {
        $email = $_POST["email"];
        $password = $_POST["password"];

        $query = "select * from Users where email = '$email'";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));

        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_array($result)) {
                $userID = $row["uid"];
                $userName = $row["name"];
                $pw = $row["password"];
            }
            
            if ($pw == $password) {
                $data = [true , $userID, $userName];
            } else {
                $data = ["Unauthorized access"];
            }
            
        } else {
            $data = ["User is not registered"];
        }

        
    } else if ($_POST["action"] == "register") {
        $name = $_POST["name"];
        $email = $_POST["email"];
        $password = $_POST["password"];

        $query = "select * from Users where email = '$email'";
        $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));
        if (mysqli_num_rows($result) == 0) {
            $query = "insert into Users values(NULL, '$name', '$email', '$password')";
            $result = mysqli_query($conn, $query) or die('Error! '.mysqli_error($conn));
            $data = ["successful resgistration"];
        } else {
            $data = ["Duplicated user's email address"];
        }
    }

    header('Content-type: application/json');
    echo json_encode($data);

    mysqli_free_result($result);
    mysqli_close($conn);  
    
?>
