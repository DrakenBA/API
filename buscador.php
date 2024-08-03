<?php
if (isset($_GET['location'])) {
    $location = urlencode($_GET['location']);
    $apiKey = 'AIzaSyCp498S6w1qWLbgXg_QpG4pw2EGWECwYkQ';
    $url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+$location&key=$apiKey";

    $response = file_get_contents($url);
    if ($response === FALSE) {
        die('Error occurred');
    }

    $responseDecoded = json_decode($response, true);

    header('Content-Type: application/json');
    echo json_encode($responseDecoded);
} else {
    echo json_encode(['status' => 'NO_LOCATION']);
}
?>
