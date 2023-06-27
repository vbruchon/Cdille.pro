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
            "lat": tiersLieux.geometry.coordinates[0],
            "long": tiersLieux.geometry.coordinates[1],
            "name": tiersLieux.properties.identification.nom_court,
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
            "logo": tiersLieux.properties.communication.logo_url,
            "desc": tiersLieux.properties.complement_info.descriptif_court,
            "accessibility": tiersLieux.properties.complement_info.accessibilite,
            "typePlace": tiersLieux.properties.complement_info.typePlace,
            "services": tiersLieux.properties.complement_info.services
        };

        //Create the content of Popup
        let popupContent = `  <a href="${content.contact.webSite}" target="_blank">
                                <div class="name-popup">${content.name}</div>
                                <img class="logo" src="${content.logo}">
                            </a>`;
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
            if (key === "typePlace") {
                const br = document.createElement('br');
                info.appendChild(br)
            }
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
    let name = createDomElement("h2", "", content.name, "");

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
    let streetText = createDomElement("p", "", content.adress.street + ",\u00A0\u00A0" + content.adress.code + "\u00A0\u00A0" + content.adress.city);

    adress.appendChild(streetText);

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
    let webSiteText = createDomElement("a", "", "Site internet");
    webSiteText.href = content.contact.webSite

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
    let typePlace = createDomElement("ul", "type-place");
    for (type of content.typePlace) {
        let typePlaceText = createDomElement("li", "", type);
        typePlace.appendChild(typePlaceText);
    }

    return typePlace;
}

 function createServicesElement(content) {
    let services = createDomElement("ul", "services");

    for (service of content.services) {
        let servicesText = createDomElement("li", "", service);
        services.appendChild(servicesText);
    }

    return services;
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
 function removeListAndMapButtons() {
    return document.getElementById("button").remove()
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