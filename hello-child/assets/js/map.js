/**
 * This code creates a map using LeafletJS, fetches a JSON file containing data about tiers-lieux (places for coworking, makerspace, fablabs, etc.) and displays them on the map and in a list. It also creates a filter form allowing to filter the displayed tiers-lieux by their type. 
 * The `createFilterBar()` function creates the filter form, adds an event listener on the `change` event of the form, and defines what happens when the form is changed. It retrieves the value of the selected option, clears the marker cluster group, loops over the markers, and adds the markers whose type corresponds to the selected option to the cluster group. Then, it displays or hides the cards according to the markers' display.
 * The `createListAndMapElement()` function creates the list and the markers on the map. It
 */

/* _______________________________________________________________________FUNCTION_______________________________________________________________________ */
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
/**
 * Filters the markers and list items based on the selected type places
 * and adds the filtered markers to the marker cluster group and shows/hides
 * the corresponding list items
 *
 * @param {Array} markers - An array of markers
 * @param {Array} typePlaceSelected - An array of selected type places
 * @param {NodeList} listItems - A NodeList of list items
 * @param {Object} markerClusterGroup - The marker cluster group object
 */
function filteredMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup) {
    markerClusterGroup.clearLayers();

    markers.forEach((marker) => {
        const markerTypePlaces = marker.properties.typePlace;
        const markerService = marker.properties.services;

        if ((typePlaceSelected.includes("all") || typePlaceSelected.some((type) => markerTypePlaces.includes(type)))
            && (serviceSelected.includes("all") || serviceSelected.some((type) => markerService.includes(type)))) {
            markerClusterGroup.addLayer(marker);
        }
    });
    map.addLayer(markerClusterGroup);

    listItems.forEach((card) => {
        let cardTypePlace = card.getElementsByClassName("type-place");
        let cardService = card.getElementsByClassName("services");

        if ((typePlaceSelected.includes("all") || typePlaceSelected.some((type) => cardTypePlace[0].textContent.includes(type)))
            && (serviceSelected.includes("all") || serviceSelected.some((type) => cardService[0].textContent.includes(type)))) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
/**
 * Creates a filter bar to select types of tiers-lieux and services.
 * @param {HTMLFormElement} form - The form element to add the filter bar to.
 * @param {L.Marker[]} markers - The markers to filter.
 * @param {Object} parsedData - The parsed data containing information about the tiers-lieux.
 * @param {L.MarkerClusterGroup} markerClusterGroup - The marker cluster group containing the markers.
 * @param {L.Map} map - The map to filter.
 */
function createFilterBar(form, markers, parsedData, markerClusterGroup, map) {
    form.innerHTML = `<div id="typePlaceForm">
                        <div class="select-selected">Quels types de tiers-lieux recherchez-vous ? + </div>
                        <div class="select-items select-hide"> 
                            <div class="option">
                                <span class="name-selected-items">Tous les types de Tiers-lieux</span>
                                <input type="checkbox" name="typePlace[]" id="all" value="all" checked>
                            </div>
                        </div>
                    </div>
                    <div id="servicesForm">
                        <div class="select-selected">Quels services recherchez-vous ? + </div>
                        <div class="select-items select-hide"> 
                            <div class="option">
                                <span class="name-selected-items">Tous les services</span>
                                <input type="checkbox" name="typePlace[]" id="all" value="all" checked>
                            </div>
                        </div>
                    </div>`;

    let typePlaceForm = document.getElementById("typePlaceForm");
    let servicesForm = document.getElementById("servicesForm");
    let typePlaceItem = typePlaceForm.querySelector('.select-items');
    let servicesItem = servicesForm.querySelector('.select-items');

    let typePlacePresent = ['all'];
    let servicePresent = ['all'];
    let features = parsedData.features

    for (let tiersLieux of features) {
        let typePlace = tiersLieux.properties.complement_info.typePlace;
        let services = tiersLieux.properties.complement_info.services;
        console.log(services);
        for (let typePlaceName of typePlace) {
            if ((!typePlacePresent.includes(typePlaceName)) && typePlaceName !== "") {
                typePlaceItem.innerHTML += `<div class="option">
                                                <span class="name-selected-items">` + typePlaceName + `</span>
                                                <input type="checkbox" id="` + typePlaceName + `" class="type-place-option" value="` + typePlaceName + `">
                                            </div>`;
                typePlacePresent.push(typePlaceName);
            }
        }

        for (let service of services) {
            if ((!servicePresent.includes(service)) && service !== "") {
                servicesItem.innerHTML += `<div class="option">
                                                <span class="name-selected-items">` + service + `</span>
                                                <input type="checkbox" id="` + service + `" class="type-place-option" value="` + service + `">
                                            </div>`;
                servicePresent.push(service);
            }
        }
    }

    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener("click", () => {
            let input = option.querySelector('input');
            console.log(input);
            if (input.checked) {
                input.removeAttribute('checked');
            } else {
                input.setAttribute('checked', 'checked');
            }
            const checkboxesTypePlace = typePlaceForm.querySelectorAll('#typePlaceForm input[type="checkbox"]');
            const checkboxeServices = servicesForm.querySelectorAll('#servicesForm input[type="checkbox"]');
            const listItems = list.querySelectorAll(".card");

            const typePlaceSelected = [];
            const serviceSelected = [];

            checkboxesTypePlace.forEach(checkbox => {
                if (checkbox.checked) {
                    typePlaceSelected.push(checkbox.value);
                }
            })

            checkboxeServices.forEach(checkbox => {
                if (checkbox.checked) {
                    serviceSelected.push(checkbox.value);
                }
            });

            filteredMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup)
        })
    })

    // Ouverture et fermeture de la liste déroulante typePlace
    const selectedTypePlace = document.querySelector('#typePlaceForm .select-selected');
    selectedTypePlace.addEventListener('click', function () {
        const selectedTypePlaceItems = document.querySelector('.select-items');
        if (selectedTypePlaceItems.classList.contains('select-hide')) {
            selectedTypePlaceItems.classList.remove('select-hide');
        } else {
            selectedTypePlaceItems.classList.add('select-hide');
        }
    });
    // Ouverture et fermeture de la liste déroulante typePlace
    const selectedServices = document.querySelector('#servicesForm .select-selected');
    selectedServices.addEventListener('click', function () {
        const selectedServicesItems = document.querySelector('#servicesForm .select-items');
        if (selectedServicesItems.classList.contains('select-hide')) {
            selectedServicesItems.classList.remove('select-hide');
        } else {
            selectedServicesItems.classList.add('select-hide');
        }
    });
}

/**
 * Create a list of elements and markers on the map
 * @param {L.markerClusterGroup} markerClusterGroup - The marker group for the map
 * @param {Object} parsedData - The parsed data for the tiers
 *
 * The content object contains all the information about a location
 * @typedef {Object} content
 * @property {number} lat – The latitude of the location
 * @property {number} long – The longitude of the location
 * @property {string} name – The name of the location
 * @property {Object} address – The address of the location
 * @property {string} address.street - The street of the location
 * @property {string} adress.code - The postal code of the Offsite
 * @property {string} adress.city - The city of the co-location
 * @property {Object} contact – The contact information of the shop
 * @property {string} contact.tel - The phone number of the shop
 * @property {string} contact.email - The email address of the shop
 * @property {string} contact.webSite - The website of the shop
 * @property {Object} socialMedia - The links to the social networks of the shop
 * @property {string} socialMedia.url1 – The first social network link
 * @property {string} socialMedia.url2 – The second social network link
 * @property {string} socialMedia.url3 – The third social network link
 * @property {string} socialMedia.url4 – The fourth social network link
 * @property {string} desc - The short description of the third place
 * @property {string} accessibility – The accessibility of the third-party venue
 * @property {string} typePlace - The type of the location
 */
function createListAndMapElement(markerClusterGroup, parsedData) {
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
            "typePlace": tiersLieux.properties.complement_info.typePlace,
            "services": tiersLieux.properties.complement_info.services
        };

        //Create the content of Popup
        let popupContent = `<div class="name">${content.name}</div>`;
        //Create marker with lat and long; add custom icon and add popup
        let marker = L.marker([content.lat, content.long], { icon: iconCedille });
        marker.properties = { typePlace: content.typePlace, services: content.services }
        marker.bindPopup(popupContent);

        //Add marker to markerClusterGroup
        markerClusterGroup.addLayer(marker);
        //Add marker in markers array 
        markers.push(marker);
        map.addLayer(markerClusterGroup);

        //Create listElement 
        let item = createElementCard(content, map, marker)
        list.appendChild(item);


        //link marker to card
        markerEvent(marker, item);
    }
}
/**
 * Creates an HTML map element from the information of a location.
 * @param {Object} content - The object containing the information about the location.
        * @param {Object} map - The Leaflet object of the map.
        * @param {Object} marker - The marker Leaflet object associated with the Landmark.
        * @returns {HTMLElement} - The map element created.
        */
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
        "typePlace": createTypePlaceElement(content),
        "services": createServicesElement(content)
    };
    let keyName = ["name", "adress"];

    for (let key in fields) {
        if (keyName.includes(key)) {
            card.appendChild(fields[key]);
        } else {
            info.appendChild(fields[key]);
            card.appendChild(info)
        }
    }

    card.addEventListener("click", () => {
        map.setView(marker.getLatLng(), 16);
        marker.openPopup();
    });

    return card;
}

/*________CARD_ELEMENT_______*/
function createNameElement(content) {
    let divName = createDomElement("div", "name");
    let name = createDomElement("p", "", content.name, "");

    divName.appendChild(name);

    return divName;
}
function createDescElement(content) {
    let desc = createDomElement("div", "desc");
    let descText = createDomElement("p", "", content.desc);

    desc.appendChild(descText);

    return desc;
}
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
function createTelElement(content) {
    let divTel = createDomElement("div", "tel");
    let tel = createDomElement("p", "", content.contact.tel);

    divTel.appendChild(tel);

    return divTel;
}
function createEmailElement(content) {
    let divEmail = createDomElement("div", "email");
    let email = createDomElement("p", "", content.contact.email);

    divEmail.appendChild(email);

    return divEmail;
}
function createWebSiteElement(content) {
    let webSite = createDomElement("div", "web-site");
    let webSiteText = createDomElement("p", "", content.contact.webSite);

    webSite.appendChild(webSiteText);

    return webSite;
}
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
function createTypePlaceElement(content) {
    let typePlace = createDomElement("div", "type-place");
    let typePlaceText = createDomElement("p", "", content.typePlace);

    typePlace.appendChild(typePlaceText);
    typePlace.style.display = "none"
    return typePlace;
}

function createServicesElement(content) {
    let services = createDomElement("div", "services");
    let servicesText = createDomElement("p", "", content.services);

    services.appendChild(servicesText);
    services.style.display = "none"
    return services;
}

//__________EVENTS__________
/**
 * Add click event listeners to each card element in the provided array
 * @param {Array < HTMLElement >} cards - An array of card elements to add click event listeners to
        */
function cardEvent(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => {
            let info = card.querySelector(".info");
            // Check if clicked card is already active
            const isActive = card.classList.contains('active');

            // Remove active class from all other cards 
            cards.forEach(otherCard => {
                let otherInfo = otherCard.querySelector(".info");
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    toggleActiveCard(otherCard);
                }
            });
            toggleActiveCard(card);

        });
    });
}

/**
 * Adds click event listener to a marker.
 * Disables all other cards except the corresponding one.
 * Activates or deactivates the corresponding card.
 * Inserts the corresponding card at the beginning of the list.
 *
 * @param {L.Marker} marker - The marker to add the event listener to.
 * @param {HTMLElement} item - The corresponding card element to activate or deactivate.
 */
function markerEvent(marker, item) {
    marker.addEventListener("click", () => {
        let allCards = document.querySelectorAll('.card');

        // Désactiver toutes les autres cartes
        allCards.forEach(otherCard => {
            if (otherCard !== item && otherCard.classList.contains('active')) {
                toggleActiveCard(otherCard);
            }
        });

        // Activer ou désactiver la carte correspondante
        toggleActiveCard(item);
        list.insertBefore(item, list.firstChild);
    });
}
/**
 * Toggles the active state of a card and hides or shows its "info" element
 * @param {HTMLElement} card - The card element to toggle the active state and info visibility for
 */
function toggleActiveCard(card) {
    const isActive = card.classList.contains('active');
    let info = card.querySelector(".info");

    if (isActive) {
        card.classList.remove('active');
        info.classList.add("hidden");
    } else {
        card.classList.add('active');
        info.classList.remove("hidden");
    }
}

//_________________________________________________________________________________________________________________________________________________________


/**_____________VARIABLE_____________ */
//Création de map, icon, tileLayer
let mapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const map = L.map("map").setView([44.7241, 5.0864], 9);
let iconCedille = L.icon({ iconUrl: "/wp-content/themes/hello-child/assets/images/markerC.png", iconSize: [65, 67] });
L.tileLayer(mapUrl, { maxZoom: 19, attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).addTo(map);

let markers = [];
let buttonsCreated = false;
const jsonData = "/wp-content/themes/hello-child/assets/geojson/newData.json";

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

        createFilterBar(form, markers, parsedData, markerClusterGroup, map);
        createListAndMapElement(markerClusterGroup, parsedData);
        cardEvent(document.querySelectorAll('.card'));
    })
    .catch(error => console.error(error));




/**
 * Quand j'arrive sur la page dans les deux formulaires all est checked.
 * 
 * J'écoute les changements sur typeplaceform et servicesform
 * Si l'
 */

