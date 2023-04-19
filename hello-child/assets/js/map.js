//Création de map, icon, tileLayer
let mapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const map = L.map("map").setView([44.7241, 5.0864], 9);
let iconCedille = L.icon({ iconUrl: "/wp-content/themes/hello-child/assets/images/markerC.png", iconSize: [65, 67] });
L.tileLayer(mapUrl, { maxZoom: 19, attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).addTo(map);


// Create feature group for all markers
let allMarkersGroup = L.featureGroup().addTo(map);
// Create feature group for filtered markers
let filteredMarkersGroup = L.featureGroup().addTo(map);
let markers = [];

//DOM ELEMENT
let list = document.getElementById("list");
let form = document.getElementById("filter-form");
let contentDiv = document.getElementById("content-div");
let mapDiv = document.getElementById("map");

let buttonsCreated = false;

fetch("/wp-content/themes/hello-child/assets/geojson/newData.json")
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data); //parse data en JSON

        let markerClusterGroup = L.markerClusterGroup();//Create a ClusterGroup to group markers

        createFilterBar(form, filteredMarkersGroup, allMarkersGroup, markers);
        /*         window.addEventListener("resize", () => {
                    if (window.innerWidth < 768) {
                        createListAndMapButtons();
                    }
                }) */

        // appel initial pour vérifier la taille de l'écran
        checkScreenSize();

        createMapAndListElement(markers, markerClusterGroup, parsedData);

        //Center layer map with respect to the coordinate of all clusterGroups
        map.fitBounds(markerClusterGroup.getBounds(), { minZoom: 9 });
        map.addLayer(markerClusterGroup);

        cardsEvent(document.querySelectorAll('.card'));

        fixMapLoadingBugs(map)

        // ajouter un écouteur pour vérifier la taille de l'écran lorsque l'utilisateur redimensionne la fenêtre
        window.addEventListener("resize", checkScreenSize);
    })
    .catch(error => console.error(error));


function checkScreenSize() {
    if (window.innerWidth < 768 && !buttonsCreated) {
        createListAndMapButtons();
        buttonsCreated = true;
    } else if (window.innerWidth >= 768 && buttonsCreated) {
        removeListAndMapButtons();
        buttonsCreated = false;
    }
}

function removeListAndMapButtons() {
    return document.getElementById("button").remove()
}




/**
 * Creates an HTML element with the specified tag, id or class and content.
 * @param {string} balise - The HTML tag of the element to create.
 * @param {string} idOrClass - The identifier or the class of the element to create. 
 * If the argument starts with a '#', the identifier will be used, otherwise the class will be used.
 * @param {string} [content] - The textual content of the element. Optional.
 * @param {string} [innerHtml] - The HTML content of the element. Optional.
 * @returns {HTMLElement} The created HTML element.
 */
function createDomElement(balise, idOrClass = "", content = "", innerHtml = "") {
    let domElement = document.createElement(balise);

    if (idOrClass !== "") {
        if (idOrClass[0] === "#") {
            domElement.id = idOrClass.slice(1);
        } else {
            domElement.className = idOrClass;
        }
    }

    if (content !== "") {
        domElement.textContent = content;
    }
    if (innerHtml != "") {
        domElement.innerHTML = innerHtml;
    }

    return domElement;
}

function createFilterBar(form, filteredMarkersGroup, allMarkersGroup, markers) {
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

            markers.forEach((marker) => {
                allMarkersGroup.addLayer(marker);
            })
            filteredMarkersGroup = allMarkersGroup;
        } else {
            numSelected = parseInt(selectedType);

            filteredMarkersGroup.clearLayers();

            // Add filtered markers to the filteredMarkersGroup
            for (var i = 0; i < numSelected; i++) {
                filteredMarkersGroup.addLayer(markers[i]);
            }

            // Remove unfiltered markers from the allMarkersGroup
            markers.forEach(function (marker) {
                if (!filteredMarkersGroup.hasLayer(marker)) {
                    allMarkersGroup.removeLayer(marker);
                }
            });
        }
        // Centering on the boundaries of the filtered markers
        map.fitBounds(filteredMarkersGroup.getBounds());


        // Browse all markers and add or remove from the map incording to the value of numSelected
        markers.forEach((marker, index) => {
            if (index < numSelected) {
                marker.addTo(map);
            } else {
                marker.removeFrom(map);
            }
        });


        // Display elements of the list incording to markers display 
        const listItems = list.querySelectorAll(".card");

        for (let i = 0; i < listItems.length; i++) {
            if (i < numSelected) {
                listItems[i].style.display = "block";
            } else {
                listItems[i].style.display = "none";
            }
        }
    });

}

function createListAndMapButtons() {
    const buttonDiv = createDomElement('div', "#button");

    const buttonList = createDomElement('button', 'list-active');
    const buttonMap = createDomElement('button', 'button-map');

    buttonDiv.appendChild(buttonList);
    buttonDiv.appendChild(buttonMap);
    contentDiv.insertBefore(buttonDiv, contentDiv.firstChild);

    buttonList.addEventListener("click", () => {
        buttonList.classList.remove("button-list");
        buttonList.classList.add("list-active");
        list.style.display = "block";

        mapDiv.style.display = "none";
        buttonMap.classList.remove("map-active");
        buttonMap.classList.add("button-map");
    });

    buttonMap.addEventListener("click", () => {
        buttonMap.classList.remove("button-map");
        buttonMap.classList.add("map-active");
        mapDiv.style.display = "block";

        list.style.display = "none";
        buttonList.classList.remove("list-active");
        buttonList.classList.add("button-list");
    });
}

function createMapAndListElement(markers, markerClusterGroup, parsedData) {
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

        //Create marker with lat and long; add custom icon and add popup
        let marker = L.marker([content.lat, content.long], { icon: iconCedille });
        marker.bindPopup(popupContent);

        //Add marker to markerClusterGroup
        markerClusterGroup.addLayer(marker);
        //Add marker in markers array 
        markers.push(marker);

        let item = createElementCard(content, map, marker)

        list.appendChild(item);
        marker.addEventListener("click", () => {
            item.classList.add("active");
        });
    }
}

function createElementCard(content, map, marker) {
    let card = createDomElement("div", "card");
    let info = createDomElement("div", "info hidden");
    let fields = {
        "name": createNameElement(content),
        "desc": createDescElement(content),
        "adress": createAdressElement(content),
        "tel": createTelElement(content),
        "email": createEmailElement(content),
        "webSite": createWebSiteElement(content),
        "social": createSocialMediaElement(content),
        "accessibility": createAccessibilityElement(content)
    };

    for (let key in fields) {
        if (key === "name" || key === "desc" || key === "adress") {
            card.appendChild(fields[key]);
        } else {
            info.appendChild(fields[key]);
            card.appendChild(info)
        }
    }

    card.addEventListener("click", () => {
        marker.openPopup();
        map.setView(marker.getLatLng(), 9);
    });

    return card;
}

//NAME
function createNameElement(content) {
    let divName = createDomElement("div", "name");
    let name = createDomElement("p", "", content.name, "");

    divName.appendChild(name);

    return divName;
}

//Description
function createDescElement(content) {
    let desc = createDomElement("div", "desc");
    let descText = createDomElement("p", "", content.desc);

    desc.appendChild(descText);

    return desc;
}

//ADRESS
function createAdressElement(content) {
    let adress = createDomElement("div", "adress");
    let street = createDomElement("div", "street");
    let streetText = createDomElement("p", "", content.adress.street, "");
    let code = createDomElement("div", "code");
    let codeText = createDomElement("p", "", content.adress.code);
    let city = createDomElement("div", "city");
    let cityText = createDomElement("p", "", content.adress.city);

    street.appendChild(streetText);
    code.appendChild(codeText);
    city.appendChild(cityText);

    adress.appendChild(street);
    adress.appendChild(code)
    adress.appendChild(city)

    return adress;
}


//TEL
function createTelElement(content) {
    let divTel = createDomElement("div", "tel");
    let tel = createDomElement("p", "", content.contact.tel);

    divTel.appendChild(tel);

    return divTel;
}
//EMAIL
function createEmailElement(content) {
    let divEmail = createDomElement("div", "email");
    let email = createDomElement("p", "", content.contact.email);

    divEmail.appendChild(email);

    return divEmail;
}

//Website
function createWebSiteElement(content) {
    let webSite = createDomElement("div", "web-site");
    let webSiteText = createDomElement("p", "", content.contact.webSite);

    webSite.appendChild(webSiteText);

    return webSite;
}

//SocialMedia
function createSocialMediaElement(content) {
    let socialMedia = createDomElement("div", "social-media");
    let urlSocialMedia = [content.socialMedia.url1, content.socialMedia.url2, content.socialMedia.url3, content.socialMedia.url4];
    let imgSocialMedia = {
        "facebook": "/wp-content/themes/hello-child/assets/images/facebook.png",
        "instagram": "/wp-content/themes/hello-child/assets/images/instagram.png",
        "twitter": "/wp-content/themes/hello-child/assets/images/twitter.png",
        "linkedin": "/wp-content/themes/hello-child/assets/images/linkedin.png"
    };

    for (let i = 0; i < urlSocialMedia.length; i++) {
        if (urlSocialMedia[i] !== "") {
            let url = new URL(urlSocialMedia[i]);
            let domain = url.hostname.replace("www.", "").replace(".com", "");

            for (let key in imgSocialMedia) {
                if (domain === key) {
                    let img = document.createElement("img");
                    img.src = imgSocialMedia[key];

                    let link = createDomElement("a", key);
                    link.href = urlSocialMedia[i];

                    link.appendChild(img);

                    socialMedia.appendChild(link);
                }
            }
        }
    }
    return socialMedia;
}

//Accessibility
function createAccessibilityElement(content) {
    let accessibility = createDomElement("div", "accessibility");
    let accessibilityText = createDomElement("p", "", content.accessibility);

    accessibility.appendChild(accessibilityText);

    return accessibility;
}

function fixMapLoadingBugs(map) {
    setInterval(function () {
        map.invalidateSize();
    }, 100);
}



function cardsEvent(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => {


            let info = card.querySelector(".info");
            // Check if clicked card is already active
            const isActive = card.classList.contains('active');

            // Remove active class from all other cards 
            cards.forEach(otherCard => {
                let otherInfo = otherCard.querySelector(".info");
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    otherInfo.classList.add("hidden");
                }
            });

            // Add or remove active class at clicked card
            if (isActive) {
                card.classList.remove('active');
                info.classList.add("hidden");
            } else {
                card.classList.add('active');
                info.classList.remove("hidden");

            }
        });
    });
}


