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
//_________________________________________________________________________________________________________

let markers = [];

//fetch("wp-content/themes/hello-elementor/data.geojson")
fetch("wp-content/themes/hello-elementor/assets/geojson/med_num.json")
    .then(response => response.json())
    .then(data => {
        console.log("Data : " + data);
        const parsedData = data; //parse data en JSON
        console.log("parsedData : " + parsedData);

        for (let tiersLieux of parsedData.features) {
            let content = {
                "lat": tiersLieux.geometry.coordinates[1],
                "long": tiersLieux.geometry.coordinates[0],
                "name": tiersLieux.properties.nom,
                "adress": tiersLieux.properties.adresse,
                "mail": tiersLieux.properties.email,
                "phone": tiersLieux.properties.tel,
                "website": tiersLieux.properties.url
            };

            //create the content of Popup
            let popupContent = `
                      <div class="name">${content.name}</div>
                      <div class="adress">${content.adress}</div>
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


    })
    .catch(error => console.error(error));