/**
 * Creates a filter bar to select types of tiers-lieux and services.
 * @param {HTMLFormElement} form - The form element to add the filter bar to.
 * @param {L.Marker[]} markers - The markers to filter.
 * @param {Object} parsedData - The parsed data containing information about the tiers-lieux.
 * @param {L.MarkerClusterGroup} markerClusterGroup - The marker cluster group containing the markers.
 * @param {L.Map} map - The map to filter.
 */
function createFilterBar(form, parsedData) {
    form.innerHTML = `
      <select id="typePlace" name="typePlace"></select>
      <select id="services" name="services"></select>
      <div id="resetDiv">
          <button id="resetFiltersButton">Réinitialiser les filtres</button>
      </div>`;

    const typePlaceForm = document.getElementById("typePlace");
    typePlaceForm.innerHTML += `<option value="all" selected>Tous les tiers-lieux</option>`;

    const servicesForm = document.getElementById("services");
    servicesForm.innerHTML += `<option value="all" selected>Tous les services</option>`;

    const features = parsedData.features;
    const typePlacePresent = ['all'];
    const servicePresent = ['all'];

    for (const tiersLieux of features) {
        const typePlace = tiersLieux.properties.complement_info.typePlace;
        const services = tiersLieux.properties.complement_info.services;

        for (const typePlaceName of typePlace) {
            if (!typePlacePresent.includes(typePlaceName) && typePlaceName !== "") {
                typePlaceForm.innerHTML += `<option value="${typePlaceName}">${typePlaceName}</option>`;
                typePlacePresent.push(typePlaceName);
            }
        }

        for (const service of services) {
            if (!servicePresent.includes(service) && service !== "") {
                servicesForm.innerHTML += `<option value="${service}">${service}</option>`;
                servicePresent.push(service);
            }
        }
    }
}

function initializeFilterbarWithUrlParams() {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const typePlace = urlParams.get('typePlace');
    const services = urlParams.getAll('service');

    // Sélectionner les valeurs dans le formulaire
    const typePlaceSelect = document.querySelector('#typePlace');
    const serviceSelect = document.querySelector('#services');

    // Sélectionner la valeur de typePlace dans le menu déroulant
    if (typePlace) {
        const typePlaceOption = typePlaceSelect.querySelector(`option[value="${typePlace}"]`);
        if (typePlaceOption) {
            typePlaceOption.selected = true;
        }
    }

    if (services) {
        const serviceOption = serviceSelect.querySelector(`option[value="${services}"]`);
        if (serviceOption) {
            serviceOption.selected = true;
        }
    }
}

function filterMapAndList(markers, typePlaceSelected, serviceSelected, listItems, markerClusterGroup) {
    markerClusterGroup.clearLayers();

    const foundMarkers = markers.filter((marker) => {
        const markerTypePlaces = marker.properties.typePlace;
        const markerServices = marker.properties.services;

        return (
            (typePlaceSelected === "all" || markerTypePlaces.includes(typePlaceSelected)) &&
            (serviceSelected === "all" || markerServices.includes(serviceSelected))
        );
    });
    console.log(foundMarkers);

    foundMarkers.forEach((marker) => markerClusterGroup.addLayer(marker));
    map.addLayer(markerClusterGroup);
    listItems.forEach((card, index) => {
        const cardTypePlace = card.getElementsByClassName("type-place")[0].textContent;
        const cardServices = card.getElementsByClassName("services")[0].textContent;

        if (
            (typePlaceSelected === "all" || cardTypePlace.includes(typePlaceSelected)) &&
            (serviceSelected === "all" || cardServices.includes(serviceSelected))
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    const noResultsMessage = document.querySelector(".no-results");
    if (foundMarkers.length === 0 && !noResultsMessage) {
        const message = createDomElement("div", "no-results");
        message.textContent = "Aucun tiers-lieu dans la sélection des filtres";
        list.appendChild(message);
    } else if (foundMarkers.length > 0 && noResultsMessage) {
        noResultsMessage.remove();
    }
    const filteredElements = [foundMarkers, listItems];
    updateURL(typePlaceSelected, serviceSelected);

    return filteredElements;
}

function updateURL(typePlaceSelected, serviceSelected) {
    const url = new URL(window.location.href);
    const baseUrl = url.origin + url.pathname;

    if (typePlaceSelected === "all") {
        url.searchParams.delete("typePlace");
    } else {
        url.searchParams.set("typePlace", typePlaceSelected);
    }

    if (serviceSelected === "all") {
        url.searchParams.delete("service");
    } else {
        url.searchParams.set("service", serviceSelected);
    }

    history.pushState(null, "", url.toString());
}