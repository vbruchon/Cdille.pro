<?php 

//MAP WITH NEW DATA LADROME 
function shortcode_map_tiersLieux_drome()
{
	// Charger les fichiers CSS et JavaScript
	wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', array(), '1.9.3');
	wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', array(), '1.9.3');
	wp_enqueue_script('map-js', get_stylesheet_directory_uri() . '/assets/js/mapDrome.js', array('leaflet-js'), '1.0.0', true);

	$map_div = '<div id="map"></div>';

	return $map_div ;
}

add_shortcode('simple_map_drome', 'shortcode_map_tiersLieux_drome');

function openagenda_events()
{
    wp_enqueue_script('openagenda_events_list-js', get_stylesheet_directory_uri() . '/assets/js/openAgenda.js', 1.0, true);

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

	// Créer les div nécessaires
    $list_div = '<div id="list"></div>';
	$map_div = '<div id="map"></div>';
	$form_div = '<form id="filter-form"></form>';

    $content = '<div id ="content">'. $list_div . $map_div . '</div>';

	// Retourner le contenu généré
	return $content;
}
add_shortcode('simple_map', 'shortcode_map_tiersLieux');
