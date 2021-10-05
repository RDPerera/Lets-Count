<?php

class LecturerTopicPage extends AlecFramework
{
    public function __construct()
    {
        $this->authorization("lec");
        $this->helper("linker");
        $this->lecturerTopicPageModel = $this->model("lecturerTopicPageModel");
    }

    public function index($courseId)
    {
        $data["courseName"] = $this->lecturerTopicPageModel->getCourseName($courseId);
        $data["topicDetails"] = $this->lecturerTopicPageModel->getTopicDetails($courseId);
        $data["topicQuizSummary"] = $this->lecturerTopicPageModel->getQuizCount($courseId);
        $data["quizDetails"] = $this->lecturerTopicPageModel->getQuizDetails($courseId);

        $this->view("lecturer/lecturerTopicPageView", $data);
    }
}
