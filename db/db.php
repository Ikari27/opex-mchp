<?php

$host = "localhost";
$user = "root";
$password = "A80069-Daniel";
$dbname = "opex_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $badge_id = $_POST["badge_id"];
    $email = $_POST["email"];

    $password = password_hash(
        $_POST["password"],
        PASSWORD_DEFAULT
    );

    $sql = "INSERT INTO users
    (first_name,last_name,badge_id,email,password)
    VALUES
    ('$first_name','$last_name','$badge_id','$email','$password')";

    if($conn->query($sql)){
    echo "Registration Successful!";
} else {
    echo "Error: " . $conn->error;
}
}

?>