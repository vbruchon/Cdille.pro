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
let list = document.getElementById("list");
let form = document.getElementById("filter-form");


fetch("wp-content/themes/hello-child/assets/geojson/newData.json")
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data); //parse data en JSON

        for (let tiersLieux of parsedData.features) {
            //content = object contains the tiers-lieux's content
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
                    "url1": tiersLieux.properties.communication.reseau_social_1,
                    "url2": tiersLieux.properties.communication.reseau_social_2,
                    "url3": tiersLieux.properties.communication.reseau_social_3,
                    "url4": tiersLieux.properties.communication.reseau_social_4,
                },
                "desc": tiersLieux.properties.complement_info.descriptif_court,
                "accessibility": tiersLieux.properties.complement_info.accessibilite,
            };

            //Create the content of Popup
            let popupContent = `<div class="name">${content.name}</div>`;

            //Add marker to the map and add bindPopup
            let marker = L.marker([content.lat, content.long], { icon: iconCedille }).addTo(map);
            marker.bindPopup(popupContent);
            //Add marker in markers array 
            markers.push(marker);


            let item = createElementCard(content, map, marker)
            list.appendChild(item);
        }

        //Create form
        form.innerHTML += ` <input type="radio" id="all" name="type" value="all" checked>
                            <label for="all">Tous les Tiers-Lieux</label><br>

                            <input type="radio" id="5" name="type" value="5">
                            <label for="five">5 Tiers-Lieux</label><br>

                            <input type="radio" id="2" name="type" value="2">
                            <label for="two">2 Tiers-Lieux</label><br>
        `;

        form.addEventListener("change", (e) => {
            let radios = form.elements.type;
            let selectedType;
            let numSelected;

            for (let radio of radios) {
                if (radio.checked) {
                    selectedType = radio.value;
                    break;
                }
            }

            // Determines the number of markers to display based on the selected value
            if (selectedType === "all") {
                numSelected = markers.length;
            } else {
                numSelected = parseInt(selectedType);
            }

            // Browse all markers and add or remove from the map incording to the value of numSelected
            markers.forEach((marker, index) => {
                if (index < numSelected) {
                    marker.addTo(map);
                } else {
                    marker.removeFrom(map);
                }
            });

            // Display elements of the list incording to markers display 
            const listItems = list.querySelectorAll(".list-item");

            for (let i = 0; i < listItems.length; i++) {
                if (i < numSelected) {
                    listItems[i].style.display = "block";
                } else {
                    listItems[i].style.display = "none";
                }
            }
        });

        // Catch all .card
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active classe at all other cards 
                cards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                    }
                });
                // Add active classe at current card
                card.classList.add('active');
            });
        });
    })
    .catch(error => console.error(error));







function createElementCard(content, map, marker) {
    let card = document.createElement("div");
    card.classList.add("card");


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
        card.appendChild(fields[key]);
    }

    card.addEventListener("click", () => {
        marker.openPopup();
        map.setView(marker.getLatLng(), 9);
    });

    return card;
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
    street.appendChild(streetText);

    let code = document.createElement("div");
    code.classList.add("code");
    let codeText = document.createElement("p");
    codeText.innerHTML = content.adress.code;
    code.appendChild(codeText);

    let city = document.createElement("div");
    city.classList.add("city");
    let cityText = document.createElement("p");
    cityText.innerHTML = content.adress.city;
    city.appendChild(cityText);


    adress.appendChild(street);
    adress.appendChild(code)
    adress.appendChild(city)

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

//SocialMedia
function createSocialMediaElement(content) {
    let socialMedia = document.createElement("div");
    socialMedia.classList.add("social-media");

    let urlSocialMedia = [content.socialMedia.url1, content.socialMedia.url2, content.socialMedia.url3, content.socialMedia.url4];
    console.log(urlSocialMedia);

    let imgSocialMedia = {
        "facebook": "wp-content/themes/hello-child/assets/images/facebook.png",
        "instagram": "wp-content/themes/hello-child/assets/images/instagram.png",
        "twitter": "wp-content/themes/hello-child/assets/images/twitter.png",
        "linkedin": "wp-content/themes/hello-child/assets/images/linkedin.png"
    };

    for (let i = 0; i < urlSocialMedia.length; i++) {
        if (urlSocialMedia[i] !== "") {
            let url = new URL(urlSocialMedia[i]);
            let domain = url.hostname.replace("www.", "").replace(".com", "");

            for (let key in imgSocialMedia) {
                if (domain === key) {
                    let img = document.createElement("img");
                    img.src = imgSocialMedia[key];

                    let link = document.createElement("a");
                    link.href = urlSocialMedia[i];
                    link.classList.add(key);


                    link.appendChild(img);
                    socialMedia.appendChild(link);
                }
            }
        }
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

//Accessibility
function createAccessibilityElement(content) {
    let accessibility = document.createElement("div");
    accessibility.classList.add("accessibility");

    let accessibilityText = document.createElement("p");
    accessibilityText.innerHTML = content.accessibility;

    accessibility.appendChild(accessibilityText);

    return accessibility;
}
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



/* let carte = document.querySelectorAll(".carte");
for (let i = 0; i < carte.length; i++) {
carte[i].addEventListener("click", () => {
    map.setView(marker.getLatLng(), 12);
});
}*/