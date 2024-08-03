let map;
let infowindow;
const markers = {};
const placeDetails = {};

function initialize() {
    const initialLocation = new google.maps.LatLng(19.714401, -98.977789);
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialLocation,
        zoom: 15
    });
    infowindow = new google.maps.InfoWindow();
}

function findPlaces() {
    const location = document.getElementById('location').value;
    if (!location) {
        alert('Por favor ingresa una ubicacion.');
        return;
    }
    console.log(`Buscando lugares en: ${location}`);
    fetch(`buscador.php?location=${location}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data.status === 'OK') {
                for (let i = 0; i < data.results.length; i++) {
                    createMarker(data.results[i]);
                }
                const firstResultLocation = data.results[0].geometry.location;
                map.setCenter(new google.maps.LatLng(firstResultLocation.lat, firstResultLocation.lng));
            } else {
                console.error('Error en la búsqueda:', data.status);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });

    markers[place.place_id] = marker;
    placeDetails[place.place_id] = {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || 'No disponible'
    };

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(`<div><strong>${place.name}</strong><br>Calificacion: ${place.rating || 'No disponible'}</div>`);
        infowindow.open(map, this);
    });
}

function addNewPlace() {
    const name = document.getElementById('newPlaceName').value;
    const address = document.getElementById('newPlaceAddress').value;

    if (!name || !address) {
        alert('Por favor completa todos los campos.');
        return;
    }

    console.log(`Registrando nuevo lugar: ${name} en ${address}`);

    fetch('buscador.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `newPlaceName=${encodeURIComponent(name)}&newPlaceAddress=${encodeURIComponent(address)}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert(data.message);

        // Limpiar los campos de entrada
        document.getElementById('newPlaceName').value = '';
        document.getElementById('newPlaceAddress').value = '';

        // Mostrar el nuevo lugar en el mapa
        if (data.location) {
            const newLocation = new google.maps.LatLng(data.location.lat, data.location.lng);
            const marker = new google.maps.Marker({
                map: map,
                position: newLocation,
                title: name
            });

            markers[data.placeId] = marker;
            placeDetails[data.placeId] = {
                name: name,
                address: address,
                rating: 'No calificado'
            };

            infowindow.setContent(`<div><strong>${name}</strong><br>${address}</div>`);
            infowindow.open(map, marker);
            map.setCenter(newLocation);
        }
    })
    .catch(error => {
        console.error('Error al registrar el lugar:', error);
    });
}

function ratePlace() {
    const placeId = document.getElementById('placeId').value;
    const rating = document.getElementById('rating').value;

    if (!placeId || !rating) {
        alert('Por favor completa todos los campos.');
        return;
    }

    console.log(`Calificando lugar con ID ${placeId} con una calificacion de ${rating}`);

    fetch('buscador.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `placeId=${encodeURIComponent(placeId)}&rating=${encodeURIComponent(rating)}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert(data.message);

        // Limpiar los campos de entrada
        document.getElementById('placeId').value = '';
        document.getElementById('rating').value = '';

        // Actualizar el marcador con la nueva calificación
        if (placeDetails[placeId]) {
            placeDetails[placeId].rating = rating;

            if (markers[placeId]) {
                infowindow.setContent(`<div><strong>${placeDetails[placeId].name}</strong><br>Calificacion: ${rating}</div>`);
                infowindow.open(map, markers[placeId]);
            }
        }
    })
    .catch(error => {
        console.error('Error al calificar el lugar:', error);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
