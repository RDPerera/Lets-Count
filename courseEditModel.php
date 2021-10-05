<?php

class CourseEditModel extends Database
{
    public function getCourseDetails($courseId)
    {
        $query = "SELECT * FROM course WHERE course_id='$courseId' LIMIT 1";
        $row = mysqli_query($GLOBALS["db"], $query);

        return mysqli_fetch_assoc($row);
    }

    public function nameCheck($name, $courseId)
    {
        $name = mysqli_real_escape_string($GLOBALS["db"], $name);

        $query = "SELECT * FROM course WHERE course_name='$name' AND course_id<>'$courseId' LIMIT 1";
        $result = mysqli_query($GLOBALS["db"], $query);

        return mysqli_fetch_assoc($result);
    }

    public function updateCourse($id, $name, $description, $year)
    {
        $id = mysqli_real_escape_string($GLOBALS["db"], $id);
        $name = mysqli_real_escape_string($GLOBALS["db"], $name);
        $description = mysqli_real_escape_string($GLOBALS["db"], $description);
        $year = mysqli_real_escape_string($GLOBALS["db"], $year);

        $query = "UPDATE course SET course_name='$name', course_description='$description', year='$year' WHERE course_id = '$id'";

        mysqli_query($GLOBALS["db"], $query);
    }
}
