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
 * Creates a filter bar to filter markers on a map and cards on a list based on the type of places.
 * @param {HTMLElement} form - The form element to append the select element to.
 * @param {Array} markers - The array of Leaflet markers to filter.
 * @param {Object} parsedData - The parsed GeoJSON data.
 * @param {L.markerClusterGroup} markerClusterGroup - The Leaflet marker cluster group.
 * @param {L.Map} map - The Leaflet map object.
*/
function createFilterBar(form, markers, parsedData, markerClusterGroup, map) {
    form.innerHTML = `<select name="typePlace" id="typePlaceForm">
                            <option class="type-place-option" value="all" selected>Tous les tiers-lieu</option>
                         </select>`;
    let typePlaceForm = document.getElementById("typePlaceForm");
    let typePlacePresent = ['all'];
    let features = parsedData.features

    for (let tiersLieux of features) {
        let typePlace = tiersLieux.properties.complement_info.typePlace;

        for (tp of typePlace) {
            if ((!typePlacePresent.includes(tp)) && tp !== "") {
                typePlaceForm.innerHTML += '<option id="' + tp + ' class="type-place-option" value="' + tp + '">' + tp + '</option>';
                typePlacePresent.push(tp);
            }
        }

    }


    typePlaceForm.addEventListener("change", () => {
        let selectedIndex = typePlaceForm.selectedIndex;
        let typePlaceSelected;
        let optionSelected;


        if (selectedIndex !== -1) {
            optionSelected = typePlaceForm.options[selectedIndex];
            typePlaceSelected = optionSelected.value
        }

        markerClusterGroup.clearLayers();
        const listItems = list.querySelectorAll(".card");


        markers.forEach((marker) => {
            const markerTypePlaces = marker.properties.typePlace

            if (typePlaceSelected === "all") {
                markerClusterGroup.addLayer(marker);
            } else {
                for (let type of markerTypePlaces) {
                    if (type === typePlaceSelected) {
                        markerClusterGroup.addLayer(marker);
                    }
                }

            }
            map.addLayer(markerClusterGroup)
        });
        map.addLayer(markerClusterGroup)

        listItems.forEach((card) => {
            let cardTypePlace = card.getElementsByClassName("type-place");

            if (cardTypePlace[0].textContent.includes(typePlaceSelected) || typePlaceSelected === "all") {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    })
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
            "typePlace": tiersLieux.properties.complement_info.typePlace
        };

        //Create the content of Popup
        let popupContent = `<div class="name">${content.name}</div>`;
        //Create marker with lat and long; add custom icon and add popup
        let marker = L.marker([content.lat, content.long], { icon: iconCedille });
        marker.properties = { typePlace: content.typePlace }
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
        "typePlace": createTypePlaceElement(content)
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

//__________EVENTS__________
/**
 * Add click event listeners to each card element in the provided array
 * @param {Array<HTMLElement>} cards - An array of card elements to add click event listeners to
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
            marker.openPopup();
            map.setView(marker.getLatLng(), 12);
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

//DOM ELEMENT
let list = document.getElementById("list");
let form = document.getElementById("filter-form");
let contentDiv = document.getElementById("content-div");
let mapDiv = document.getElementById("map");
//_________________________________________________________________________________________________________________________________________________________



fetch("/wp-content/themes/hello-child/assets/geojson/newData.json")
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