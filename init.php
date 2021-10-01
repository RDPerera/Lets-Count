<?php

// Autoload function

spl_autoload_register('loadClass');


function loadClass($className)
{
    $className = strtolower($className);
    $path = "../core/classes/";
    $extension = ".php";
    $fullPath = $path . $className . $extension;

    if (!file_exists($fullPath)) {
        return false;
    }

    include $fullPath;
}

// Create routing object
$router = new Router;

