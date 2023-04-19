<?php

//MAP WITH NEW DATA LADROME 
function shortcode_map_tiersLieux_drome()
{
	// Charger les fichiers CSS et JavaScript
	wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', array(), '1.9.3');
	wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', array(), '1.9.3');
	wp_enqueue_script('map-js', get_stylesheet_directory_uri() . '/assets/js/mapDrome.js', array('leaflet-js'), '1.0.0', true);

	$map_div = '<div id="map"></div>';

	return $map_div;
}

add_shortcode('simple_map_drome', 'shortcode_map_tiersLieux_drome');

function openagenda_events()
{
	wp_enqueue_script('openagenda-events-list-js', get_stylesheet_directory_uri() . '/assets/js/openAgenda.js', 1.0, true);
	wp_enqueue_style('openagenda-envents-list-css', get_stylesheet_directory_uri() . '/assets/css/openAganda-list.css', 1.0, true);

	$event_div = '<div id="events"></div>';
	return $event_div;
}
add_shortcode('openagenda_events_list', 'openagenda_events');

//MAP WITH MY GEOJSON DATA
function shortcode_map_tiersLieux()
{
	// Charger les fichiers CSS et JavaScript
	wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', array(), '1.9.3');
	wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', array(), '1.9.3');
	wp_enqueue_script('map-js', get_stylesheet_directory_uri() . '/assets/js/map.js', array('leaflet-js'), '1.0.0', true);
	wp_enqueue_style('map-css', get_stylesheet_directory_uri() . '/assets/css/map.css', array(), '1.0.0');

	wp_enqueue_script('markerCluster-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js', array('leaflet-js'), '1.0.0', true);
	wp_enqueue_style('markerCluster-css', get_stylesheet_directory_uri() . '/dist/MarkerCluster.css', array(), '1.0.0');
	wp_enqueue_style('markerClusterDefault-css', get_stylesheet_directory_uri() . '/dist/MarkerCluster.Default.css', array(), '1.0.0');

	// Créer les div nécessaires
	$content = '<div id="content-div"><div id="list"></div><div id="map"></div></div>';
	$form_div = '<form id="filter-form"></form>';

	// Retourner le contenu généré
	return $form_div . $content;
}
add_shortcode('simple_map', 'shortcode_map_tiersLieux');


/* function openAgenda_detail_event($atts)
{
	$a = shortcode_atts(array('id' => '#'), $atts);
	// Récupérez les détails de l'événement en utilisant l'API OpenAgenda et le shortcode que vous avez créé.
	$id = get_query_var('id');

	$event_div = '<p>Bienvenue sur les détails de l\'article ';
	$event_div .= $id;
	$event_div .= '</p>';

	return $event_div;
}
add_shortcode('openAgenda-detail-event', 'openAgenda_detail_event');
 */