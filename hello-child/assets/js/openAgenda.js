fetch('https://api.openagenda.com/v2/agendas/60004897/events?key=6debd66784b441a680c4353748d8675e')
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
            eventDesc.textContent = event.description.fr;

            //Créer l'horraires de l'event
            const eventDate = document.createElement('p');
            const startDate = new Date(event.lastTiming.begin);
            const endDate = new Date(event.lastTiming.end);
            eventDate.textContent = startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString();

            //Créer le lieux de l'event
            const locationName = document.createElement('p')
            locationName.textContent = event.location.name;


            const eventLocation = document.createElement('p');
            eventLocation.textContent = event['location']['address'];


            //Ajout des éléments au container event
            eventContainer.appendChild(eventImg);
            eventContainer.appendChild(eventTitle);
            eventContainer.appendChild(eventDesc);
            eventContainer.appendChild(eventDate);
            eventContainer.appendChild(locationName)
            eventContainer.appendChild(eventLocation)

            //Ajout de evenContainer à EventsContainer
            eventsContainer.appendChild(eventContainer);
        });
        document.body.appendChild(eventsContainer)
    })
    .catch(error => console.error(error));


/**
 * Un evenement c'est une image, un titre, une description, horraires, lieux, 
 */