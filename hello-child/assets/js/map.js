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

        //LISTE
        let list = document.getElementById("list");

        //MAP
        let serviceController = {}; //Array of services (unique)
        //Pour chaque TL dans ParsedData.features
        for (let tiersLieux of parsedData.features) {
            //content = object contenant le contenu d\'un tiers-Lieux à chaque fois
            let content = {
                "lat": tiersLieux.geometry.coordinates[1],
                "long": tiersLieux.geometry.coordinates[0],
                "name": tiersLieux.properties.identification.nom_long,
                "adress": {
                    "street": tiersLieux.properties.coordonees.adresse,
                    "code": tiersLieux.properties.coordonees.code_postal,
                    "city": tiersLieux.properties.coordonees.commune,
                },
                "contact": {
                    "tel": tiersLieux.properties.coordonees.telephone,
                    "email": tiersLieux.properties.coordonees.mail,
                    "webSite": tiersLieux.properties.coordonees.site_internet,
                },
                "socialMedia": {
                    "fb": tiersLieux.properties.communication.reseau_social_1,
                    "insta": tiersLieux.properties.communication.reseau_social_2,
                    "linkedin": tiersLieux.properties.communication.reseau_social_3,
                    "twitter": tiersLieux.properties.communication.reseau_social_4,
                },
                "desc": tiersLieux.properties.complement_info.descriptif_court,
                "accessibility": tiersLieux.properties.complement_info.accessibilite,
            };


            //create the content of Popup
            let popupContent = `<div class="name">${content.name}</div>`;

            //Ajout du marker à la map + ajout d\'une popup au clique sur le marker
            let marker = L.marker([content.lat, content.long], { icon: iconCedille }).addTo(map);
            marker.bindPopup(popupContent);

            markers.push(marker);


            createElementList(content, map, marker, list);

        }
    })
    .catch(error => console.error(error));

function createElementList(content, map, marker, list) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("carte");


    let fields = {
        "name": createNameElement(content),
        "desc": createDescElement(content),
        "address": createAdressElement(content),
        "tel": createTelElement(content),
        "email": createEmailElement(content),
        "webSite": createWebSiteElement(content),
        "social": createSocialMediaElement(content),
        "accessibility": createAccessibilityElement(content)
    };

    for (let key in fields) {
        fields[key].addEventListener("click", () => {
            map.setView(marker.getLatLng(), 9);
        });
        list.appendChild(fields[key]);
    }

}



//NAME
function createNameElement(content) {
    let divName = document.createElement("div");
    divName.classList.add("name");

    let name = document.createElement("p");
    name.innerHTML = content.name;

    divName.appendChild(name);

    return divName;
}
//ADRESS
function createAdressElement(content) {
    let adress = document.createElement("div");
    adress.classList.add("adress");

    let street = document.createElement("div");
    street.classList.add("street");
    let streetText = document.createElement("p");
    streetText.innerHTML = content.adress.street;

    let code = document.createElement("div");
    code.classList.add("code");
    let codeText = document.createElement("p");
    codeText.innerHTML = content.adress.code;

    let city = document.createElement("div");
    city.classList.add("city");
    let cityText = document.createElement("p");
    cityText.innerHTML = content.adress.city;


    adress.appendChild(street, code, city);

    return adress;
}
//TEL
function createTelElement(content) {
    let divTel = document.createElement("div");
    divTel.classList.add("tel");

    let tel = document.createElement("p");
    tel.innerHTML = content.contact.tel;

    divTel.appendChild(tel);

    return divTel;
}
//EMAIL
function createEmailElement(content) {
    let divEmail = document.createElement("div");
    divEmail.classList.add("email");

    let email = document.createElement("p");
    email.innerHTML = content.contact.email;

    divEmail.appendChild(email);

    return divEmail;
}

//Website
function createWebSiteElement(content) {
    let webSite = document.createElement("div");
    webSite.classList.add("web-site");

    let webSiteText = document.createElement("p");
    webSiteText.innerHTML = content.contact.webSite;

    webSite.appendChild(webSiteText);

    return webSite;
}

//ADRESS
function createSocialMediaElement(content) {
    let socialMedia = document.createElement("div");
    socialMedia.classList.add("social-media");


    if (content.fb !== "") {
        let facebook = document.createElement("div");
        facebook.classList.add("fb");

        let facebookText = document.createElement("p");
        facebookText.innerHTML = content.socialMedia.fb;
        facebook.appendChild(facebookText);

        socialMedia.appendChild(facebook);
    }

    if (content.insta !== "") {
        let insta = document.createElement("div");
        insta.classList.add("insta");

        let instaText = document.createElement("p");
        instaText.innerHTML = content.socialMedia.insta;
        insta.appendChild(instaText);

        socialMedia.appendChild(insta);
    }

    if (content.linkedin !== "") {
        //Create div.tweeter
        let linkedin = document.createElement("div");
        linkedin.classList.add("linkedin");
        //Create p 
        let linkedinText = document.createElement("p");
        linkedinText.innerHTML = content.socialMedia.linkedin;
        linkedin.appendChild(linkedinText);

        socialMedia.appendChild(linkedin);
    }

    if (content.twitter !== "") {
        //Create div.tweeter
        let twiter = document.createElement("div");
        twiter.classList.add("twitter");
        //Create p 
        let twiterText = document.createElement("p");
        twiterText.innerHTML = content.socialMedia.twitter;
        twiter.appendChild(twiterText);

        socialMedia.appendChild(twiter);
    }

    return socialMedia;
}

//Description
function createDescElement(content) {
    let desc = document.createElement("div");
    desc.classList.add("desc");

    let descText = document.createElement("p");
    descText.innerHTML = content.desc;

    desc.appendChild(descText);

    return desc;
}

//Eccessibilité
function createAccessibilityElement(content) {
    let accessibility = document.createElement("div");
    accessibility.classList.add("accessibility");

    let accessibilityText = document.createElement("p");
    accessibilityText.innerHTML = content.accessibility;

    accessibility.appendChild(accessibilityText);

    return accessibility;
}

/* 
nom_long V
adresse   V
code_postal   V
commune  V
mail V
telephone V
reseau_social_1 v
reseau_social_2 v 
reseau_social_3 v
reseau_social_4 v
reseau_social_5 v
descriptif_court
accessibilite


*/
/* //Création du filtre L.Control
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
    filter.addTo(map) */