<?php

class PasswordRecoveryModel extends Database
{
    public function emailCheck($email)
    {
        $email = mysqli_real_escape_string($GLOBALS["db"], $email);
        $query = "SELECT * FROM user WHERE email='$email' LIMIT 1";

        $result = mysqli_query($GLOBALS["db"], $query);

        return mysqli_fetch_assoc($result);
    }

    public function changePassword($email, $password)
    {
        $email = mysqli_real_escape_string($GLOBALS["db"], $email);
        $password = mysqli_real_escape_string($GLOBALS["db"], $password);

        $password = password_hash($password, PASSWORD_DEFAULT);

        $query = "UPDATE user SET pass='$password' WHERE email='$email'";
        $result = mysqli_query($GLOBALS["db"], $query);

        return $result;
    }
}
