fetch('https://api.openagenda.com/v2/agendas/60004897/events?' +
    'includeFileds[]=uid' +
    '&includeFields[]=image' +
    '&includeFields[]=title' +
    '&includeFields[]=description' +
    '&includeFields[]=timings' +
    '&includeFields[]=location' +
    '&includeFields[]=registration&' +
    '&key=6debd66784b441a680c4353748d8675e')
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data); //parse data en JSON
        events = parsedData['events'];
        let now = Date.now();

        const upcommingEvents = events.filter(event => {
            const endDate = new Date(event.lastTiming.end);
            return endDate.getTime() > now;
        })
        //Récupère la div généré par le shortcodes 
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events');
        
        //Pour chaque event
        upcommingEvents.forEach(event => {
            const eventLink = document.createElement('a');
            eventLink.href = event.registration[0].value
            eventLink.className = "event-link"
            
            //Container un event
            let eventContainer = document.createElement('div')
            eventContainer.classList.add('event');

            //Créer l' img de l'event
            const eventImg = document.createElement('img');
            eventImg.src = event.image.base + event.image.filename;

            //Créer le titre de l'event
            const eventTitle = document.createElement('h2');
            eventTitle.textContent = event.title.fr;

            //Créer la description de l'event
            const eventDesc = document.createElement('p');
            eventDesc.classList.add('desc')
            eventDesc.textContent = event.description.fr;

            //Créer la date  de l'event
            let div = document.createElement('div')
            div.classList.add('date');

            img = document.createElement('img');
            img.src = "/wp-content/themes/hello-child/assets/images/banderolles.png";

            const eventDate = document.createElement('p');
            const startDate = new Date(event.lastTiming.begin);
            const endDate = new Date(event.lastTiming.end);

            if (startDate.toLocaleDateString() === endDate.toLocaleDateString()) {
                eventDate.textContent = endDate.toLocaleDateString();
                img.style.height = "80%";
            } else {
                eventDate.textContent = startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString();
            }
            div.appendChild(img);
            div.appendChild(eventDate);

            //Créer le lieux de l'event
            let divLocate = document.createElement('div')
            divLocate.classList.add('location');

            imgPin = document.createElement('img');
            imgPin.src = "/wp-content/themes/hello-child/assets/images/pin.png";

            let location = document.createElement('div')
            location.classList.add('location-text')

            const locationName = document.createElement('p')
            locationName.classList.add("location-name")
            locationName.textContent = event.location.name;


            const eventLocation = document.createElement('p');
            eventLocation.classList.add("event-location")
            eventLocation.textContent = event['location']['address'];

            divLocate.appendChild(imgPin);
            location.appendChild(locationName);
            location.appendChild(eventLocation);
            divLocate.appendChild(location)

            //Ajout des éléments au container event
            eventContainer.appendChild(eventImg);
            eventContainer.appendChild(eventTitle);
            eventContainer.appendChild(eventDesc);
            eventContainer.appendChild(div);
            eventContainer.appendChild(divLocate);
            eventLink.appendChild(eventContainer)

            //Ajout de evenContainer à EventsContainer
            eventsContainer.appendChild(eventLink);
        });
        document.body.appendChild(eventsContainer)
    })
    .catch(error => console.error(error));


/**
 * Un evenement c'est une image, un titre, une description, horraires, lieux, 
 */