/**
 * This code creates a map using LeafletJS, fetches a JSON file containing data about tiers-lieux (places for coworking, makerspace, fablabs, etc.) and displays them on the map and in a list. It also creates a filter form allowing to filter the displayed tiers-lieux by their type. 
 * The `createFilterBar()` function creates the filter form, adds an event listener on the `change` event of the form, and defines what happens when the form is changed. It retrieves the value of the selected option, clears the marker cluster group, loops over the markers, and adds the markers whose type corresponds to the selected option to the cluster group. Then, it displays or hides the cards according to the markers' display.
 * The `createListAndMapElement()` function creates the list and the markers on the map. It
 */

/* __________FUNCTION__________ */
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
        marker.addEventListener("click", () => {
            item.classList.add("active");
            list.insertBefore(item, list.firstChild)
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
//NAME
function createNameElement(content) {
    let divName = createDomElement("div", "name");
    let name = createDomElement("p", "", content.name, "");

    divName.appendChild(name);

    return divName;
}
//DESC
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
function createTypePlaceElement(content) {
    let typePlace = createDomElement("div", "type-place");
    let typePlaceText = createDomElement("p", "", content.typePlace);

    typePlace.appendChild(typePlaceText);
    typePlace.style.display = "none"
    return typePlace;
}

//__________EVENTS__________
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
            marker.openPopup();
            map.setView(marker.getLatLng(), 12);
        });
    });
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

        cardsEvent(document.querySelectorAll('.card'));
    })
    .catch(error => console.error(error));