/**
 * This code creates a map using LeafletJS, fetches a JSON file containing data about tiers-lieux (places for coworking, makerspace, fablabs, etc.) and displays them on the map and in a list. It also creates a filter form allowing to filter the displayed tiers-lieux by their type. 
 * The `createFilterBar()` function creates the filter form, adds an event listener on the `change` event of the form, and defines what happens when the form is changed. It retrieves the value of the selected option, clears the marker cluster group, loops over the markers, and adds the markers whose type corresponds to the selected option to the cluster group. Then, it displays or hides the cards according to the markers' display.
 * The `createListAndMapElement()` function creates the list and the markers on the map. It
 */
function checkScreenSize() {
    if (window.innerWidth < 768 && !buttonsCreated) {
        createListAndMapButtons();
        buttonsCreated = true;
    } else if (window.innerWidth >= 768 && buttonsCreated) {
        removeListAndMapButtons();
        buttonsCreated = false;
    }
}

function fixMapLoadingBugs(map) {
    setInterval(function () {
        map.invalidateSize();
    }, 100);
}

/**_____________VARIABLE_____________ */
//Création de map, icon, tileLayer
let mapUrl = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const map = L.map("map").setView([44.7241, 5.0864], 9);
let iconCedille = L.icon({ iconUrl: "/wp-content/themes/hello-child/assets/images/markerC.png", iconSize: [65, 67] });
L.tileLayer(mapUrl, { maxZoom: 19, attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).addTo(map);

let markers = [];
let buttonsCreated = false;
const jsonData = "/wp-content/themes/hello-child/assets/geojson/annuaire_tiers-lieux.json";

//DOM ELEMENT
let list = document.getElementById("list");
let form = document.getElementById("filter-form");
let contentDiv = document.getElementById("content-div");
let mapDiv = document.getElementById("map");

fetch(jsonData)
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data);

        //Create a ClusterGroup to group markers
        let markerClusterGroup = L.markerClusterGroup();

        // appel initial pour vérifier la taille de l'écran
        checkScreenSize();
        createFilterBar(form, parsedData);
        // Appeler la fonction lors du chargement de la page
        initializeFilterbarWithUrlParams();
        const typePlace = document.querySelector('#typePlace');
        let typePlaceSelected = typePlace.value;
        const service = document.querySelector('#services');
        let serviceSelected = service.value;
        createListAndMapElement(markerClusterGroup, parsedData);
        const listItems = document.querySelectorAll(".card");
        console.log(listItems);
        cardEvent(document.querySelectorAll('.card'));

        fixMapLoadingBugs(map)
        filterMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup);

        // ajouter un écouteur pour vérifier la taille de l'écran lorsque l'utilisateur redimensionne la fenêtre
        window.addEventListener("resize", checkScreenSize);
        typePlace.addEventListener("change", () => {
            const typePlaceSelected = typePlace.value
            const serviceSelected = service.value

            filterMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup);
        })
        service.addEventListener("change", () => {
            const typePlaceSelected = typePlace.value
            const serviceSelected = service.value

            filterMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup);
        })
    })
    .catch(error => console.error(error));