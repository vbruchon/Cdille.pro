//Création de map, icon, tileLayer
let mapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const map = L.map("map").setView([44.7241, 5.0864], 9);

let iconCedille = L.icon({
    iconUrl: "wp-content/themes/hello-elementor/assets/images/markerC.png",
    iconSize: [65, 67]
});


L.tileLayer(mapUrl, {
    maxZoom: 19,
    attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
}).addTo(map);

let markers = [];

//_________________________________________________________________________________________________________
fetch("wp-content/themes/hello-child/assets/geojson/newData.json")
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data); //parse data en JSON


        let serviceController = {}; //Array of services (unique)
        //Pour chaque TL dans ParsedData.features
        for (let tiersLieux of parsedData.features) {
            //content = object contenant le contenu d\'un tiers-Lieux à chaque fois
            let content = {
                "lat": tiersLieux.geometry.coordinates[0],
                "long": tiersLieux.geometry.coordinates[1],
                "name": tiersLieux.properties.identification.nom_long,
                "adress": tiersLieux.properties.adresse,
                "services": tiersLieux.properties.services,
                "mail": tiersLieux.properties.contact.mail,
                "phone": tiersLieux.properties.contact.telephone,
                "website": tiersLieux.properties.contact.site_internet
            };


            //Trnasformer le content.services[] en une liste à puce
            let servicesList = "Services proposés : <ul>";

            for (let service of content.services) {
                if (!(service in serviceController)) {
                    serviceController[service] = true;
                }
                servicesList += "<li>" + service + "</li>";
            }
            servicesList += "</ul>";


            //create the content of Popup
            let popupContent = `
                <div class="name">${content.name}</div>
                <div class="adress">${content.adress}</div>
                <div class="services">${servicesList}</div>
                <div class="mail">
                    <a href="mailto: ${content.mail}">Mail : ${content.mail}</a>
                </div>
                <div class="phone">
                    <a href="tel: ${content.phone}">N° tél : ${content.phone}</a>
                </div>
                <div class="website">
                    <a href="${content.website}">Site internet : ${content.website}</a>
                </div>
          `;
            //Ajout du marker à la map + ajout d\'une popup au clique sur le marker
            let marker = L.marker([content.lat, content.long], { icon: iconCedille }).addTo(map);
            marker.bindPopup(popupContent);

            markers.push(marker)
        }













        //Création du filtre L.Control
        let filter = L.control({ position: "topright" }); 
        filter.onAdd = function (map) {
            let form = document.getElementById("filter-form"); //catch form
            //Add radio all in the filterController
            form.innerHTML += `
                <input type="radio" id="all" name="type" value="all" checked>
                <label for="all">Tous les Tiers-Lieux</label><br>
              `;

            //Loop for add service in the filtercontroller
            for (let service in serviceController) {
                form.innerHTML += `
                  <input type="radio" id="${service}" name="type" value="${service}">
                  <label for="${service}">${service}</label><br>
                `;
            }
            L.DomEvent.on(form, "change", function (e) {
                let radios = form.elements.type;
                let selectedType;
                let filteredMarkers = [];

                for (let radio of radios) {
                    if (radio.checked) {
                        selectedType = radio.value;
                        break;
                    }
                }
                if (selectedType === "all") {
                    markers.forEach(function (marker) {
                        marker.addTo(map);
                    });
                } else {
                    markers.forEach(function (marker) {
                        if (marker.getPopup().getContent().indexOf(selectedType) >= 0) {
                            marker.addTo(map);
                        } else {
                            marker.removeFrom(map);
                        }
                    });
                }
            });
            return form;
        };
        filter.addTo(map)
    })
    .catch(error => console.error(error));