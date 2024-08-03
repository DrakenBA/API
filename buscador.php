<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['location'])) {
    $location = urlencode($_GET['location']);
    $apiKey = 'AIzaSyCp498S6w1qWLbgXg_QpG4pw2EGWECwYkQ';
    $url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+$location&key=$apiKey";

    $response = file_get_contents($url);
    if ($response === FALSE) {
        die(json_encode(['status' => 'ERROR', 'message' => 'Error occurred while fetching data']));
    }

    $responseDecoded = json_decode($response, true);

    header('Content-Type: application/json');
    echo json_encode($responseDecoded);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['newPlaceName']) && isset($_POST['newPlaceAddress'])) {
    // Código para registrar un nuevo lugar (esto puede ser guardado en una base de datos)
    $newPlaceName = $_POST['newPlaceName'];
    $newPlaceAddress = $_POST['newPlaceAddress'];

    // Aquí podrías agregar el código para guardar el nuevo lugar en tu base de datos
    // Para el propósito de este ejemplo, vamos a simular una respuesta con una ubicación fija
    $response = [
        'status' => 'SUCCESS',
        'message' => 'Lugar registrado con éxito',
        'location' => [
            'lat' => 19.654793, // Coordenadas ficticias para el ejemplo
            'lng' =>  -99.082141
        ],
        'placeId' => 'nuevo_lugar_id' // ID ficticio para el ejemplo
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['placeId']) && isset($_POST['rating'])) {
    // Código para calificar un lugar (esto puede ser guardado en una base de datos)
    $placeId = $_POST['placeId'];
    $rating = $_POST['rating'];

    // Aquí podrías agregar el código para guardar la calificación en tu base de datos

    echo json_encode(['status' => 'SUCCESS', 'message' => 'Lugar calificado con éxito']);
} else {
    echo json_encode(['status' => 'INVALID_REQUEST']);
}
?>
