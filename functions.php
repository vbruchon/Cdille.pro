<?php

/**
 * Theme functions and definitions
 *
 * @package HelloElementor
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

define('HELLO_ELEMENTOR_VERSION', '2.6.1');

if (!isset($content_width)) {
	$content_width = 800; // Pixels.
}

if (!function_exists('hello_elementor_setup')) {
	/**
	 * Set up theme support.
	 *
	 * @return void
	 */
	function hello_elementor_setup()
	{
		if (is_admin()) {
			hello_maybe_update_theme_version_in_db();
		}

		$hook_result = apply_filters_deprecated('elementor_hello_theme_load_textdomain', [true], '2.0', 'hello_elementor_load_textdomain');
		if (apply_filters('hello_elementor_load_textdomain', $hook_result)) {
			load_theme_textdomain('hello-elementor', get_template_directory() . '/languages');
		}

		$hook_result = apply_filters_deprecated('elementor_hello_theme_register_menus', [true], '2.0', 'hello_elementor_register_menus');
		if (apply_filters('hello_elementor_register_menus', $hook_result)) {
			register_nav_menus(['menu-1' => __('Header', 'hello-elementor')]);
			register_nav_menus(['menu-2' => __('Footer', 'hello-elementor')]);
		}

		$hook_result = apply_filters_deprecated('elementor_hello_theme_add_theme_support', [true], '2.0', 'hello_elementor_add_theme_support');
		if (apply_filters('hello_elementor_add_theme_support', $hook_result)) {
			add_theme_support('post-thumbnails');
			add_theme_support('automatic-feed-links');
			add_theme_support('title-tag');
			add_theme_support(
				'html5',
				[
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
				]
			);
			add_theme_support(
				'custom-logo',
				[
					'height'      => 100,
					'width'       => 350,
					'flex-height' => true,
					'flex-width'  => true,
				]
			);

			/*
			 * Editor Style.
			 */
			add_editor_style('classic-editor.css');

			/*
			 * Gutenberg wide images.
			 */
			add_theme_support('align-wide');

			/*
			 * WooCommerce.
			 */
			$hook_result = apply_filters_deprecated('elementor_hello_theme_add_woocommerce_support', [true], '2.0', 'hello_elementor_add_woocommerce_support');
			if (apply_filters('hello_elementor_add_woocommerce_support', $hook_result)) {
				// WooCommerce in general.
				add_theme_support('woocommerce');
				// Enabling WooCommerce product gallery features (are off by default since WC 3.0.0).
				// zoom.
				add_theme_support('wc-product-gallery-zoom');
				// lightbox.
				add_theme_support('wc-product-gallery-lightbox');
				// swipe.
				add_theme_support('wc-product-gallery-slider');
			}
		}
	}
}
add_action('after_setup_theme', 'hello_elementor_setup');

function hello_maybe_update_theme_version_in_db()
{
	$theme_version_option_name = 'hello_theme_version';
	// The theme version saved in the database.
	$hello_theme_db_version = get_option($theme_version_option_name);

	// If the 'hello_theme_version' option does not exist in the DB, or the version needs to be updated, do the update.
	if (!$hello_theme_db_version || version_compare($hello_theme_db_version, HELLO_ELEMENTOR_VERSION, '<')) {
		update_option($theme_version_option_name, HELLO_ELEMENTOR_VERSION);
	}
}

if (!function_exists('hello_elementor_scripts_styles')) {
	/**
	 * Theme Scripts & Styles.
	 *
	 * @return void
	 */
	function hello_elementor_scripts_styles()
	{
		$enqueue_basic_style = apply_filters_deprecated('elementor_hello_theme_enqueue_style', [true], '2.0', 'hello_elementor_enqueue_style');
		$min_suffix          = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';

		if (apply_filters('hello_elementor_enqueue_style', $enqueue_basic_style)) {
			wp_enqueue_style(
				'hello-elementor',
				get_template_directory_uri() . '/style' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}

		if (apply_filters('hello_elementor_enqueue_theme_style', true)) {
			wp_enqueue_style(
				'hello-elementor-theme-style',
				get_template_directory_uri() . '/theme' . $min_suffix . '.css',
				[],
				HELLO_ELEMENTOR_VERSION
			);
		}
	}
}
add_action('wp_enqueue_scripts', 'hello_elementor_scripts_styles');

if (!function_exists('hello_elementor_register_elementor_locations')) {
	/**
	 * Register Elementor Locations.
	 *
	 * @param ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $elementor_theme_manager theme manager.
	 *
	 * @return void
	 */
	function hello_elementor_register_elementor_locations($elementor_theme_manager)
	{
		$hook_result = apply_filters_deprecated('elementor_hello_theme_register_elementor_locations', [true], '2.0', 'hello_elementor_register_elementor_locations');
		if (apply_filters('hello_elementor_register_elementor_locations', $hook_result)) {
			$elementor_theme_manager->register_all_core_location();
		}
	}
}
add_action('elementor/theme/register_locations', 'hello_elementor_register_elementor_locations');

if (!function_exists('hello_elementor_content_width')) {
	/**
	 * Set default content width.
	 *
	 * @return void
	 */
	function hello_elementor_content_width()
	{
		$GLOBALS['content_width'] = apply_filters('hello_elementor_content_width', 800);
	}
}
add_action('after_setup_theme', 'hello_elementor_content_width', 0);

if (is_admin()) {
	require get_template_directory() . '/includes/admin-functions.php';
}

/**
 * If Elementor is installed and active, we can load the Elementor-specific Settings & Features
 */

// Allow active/inactive via the Experiments
require get_template_directory() . '/includes/elementor-functions.php';

/**
 * Include customizer registration functions
 */
function hello_register_customizer_functions()
{
	if (is_customize_preview()) {
		require get_template_directory() . '/includes/customizer-functions.php';
	}
}
add_action('init', 'hello_register_customizer_functions');

if (!function_exists('hello_elementor_check_hide_title')) {
	/**
	 * Check hide title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title($val)
	{
		if (defined('ELEMENTOR_VERSION')) {
			$current_doc = Elementor\Plugin::instance()->documents->get(get_the_ID());
			if ($current_doc && 'yes' === $current_doc->get_settings('hide_title')) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter('hello_elementor_page_title', 'hello_elementor_check_hide_title');

/**
 * Wrapper function to deal with backwards compatibility.
 */
if (!function_exists('hello_elementor_body_open')) {
	function hello_elementor_body_open()
	{
		if (function_exists('wp_body_open')) {
			wp_body_open();
		} else {
			do_action('wp_body_open');
		}
	}
}


function my_theme_enqueue_scripts()
{
	// charge les fichiers seulement si le shortcode est utilisé sur la page
	if (has_shortcode(get_post()->post_content, 'simple_map')) {
		wp_enqueue_style('simple_map-css', get_stylesheet_directory_uri() . '/assets/css/map.css');
		//wp_enqueue_script('simple_map-js', get_stylesheet_directory_uri() . '/assets/js/map.js', 1.0, true);
	}
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_scripts');


function shortcode_map_tiersLieux()
{
	return '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
	<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
	integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
	crossorigin=""></script>
	
	<div id="map"></div>
	<form id="filter-form"></form>

	<script>

		//Création de map, icon, tileLayer
	let mapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
	const map = L.map("map").setView([44.7241, 5.0864], 9);
	
	let iconCedille = L.icon({
		iconUrl: "wp-content/themes/hello-elementor/assets/images/markerC.png",
		iconSize: [65, 67]
	  });
	  
	
	L.tileLayer(mapUrl, {
	  maxZoom: 19,
	  attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
	}).addTo(map);
	//_________________________________________________________________________________________________________
	
	let markers = [];
	
	//fetch("wp-content/themes/hello-elementor/data.geojson")
	fetch("wp-content/themes/hello-elementor/assets/geojson/data.geojson")
	  .then(response => response.text())
	  .then(data => {
		const parsedData = JSON.parse(data); //parse data en JSON
	
	
		let serviceController = {}; //Array of services (unique)
	
		//Pour chaque TL dans ParsedData.features
		for (let tiersLieux of parsedData.features) {
		  //content = object contenant le contenu d\'un tiers-Lieux à chaque fois
		  let content = {
			"lat": tiersLieux.geometry.coordinates.lat,
			"long": tiersLieux.geometry.coordinates.long,
			"name": tiersLieux.properties.nom,
			"adress": tiersLieux.properties.adresse,
			"services": tiersLieux.properties.services,
			"mail": tiersLieux.properties.contact.mail,
			"phone": tiersLieux.properties.contact.telephone,
			"website": tiersLieux.properties.contact.site_internet
		  };
	
		  //TRnasformer le content.services[] en une liste à puce
		  let servicesList = "Services proposés : <ul>";
	
		  for (let service of content.services) {
			if (!(service in serviceController)) {
			  serviceController[service] = true;
			}
			servicesList += "<li>" + service + "</li>";
		  }
		  servicesList += "</ul>";
	
	
		  //create the content of Popup
		  let popupContent = `
				  <div class="name">${content.name}</div>
				  <div class="adress">${content.adress}</div>
				  <div class="services">${servicesList}</div>
				  <div class="mail">
					<a href="mailto: ${content.mail}">Mail : ${content.mail}</a>
				  </div>
				  <div class="phone">
					<a href="tel: ${content.phone}">N° tél : ${content.phone}</a>
				  </div>
				  <div class="website">
					<a href="${content.website}">Site internet : ${content.website}</a>
				  </div>
				`;
		  //Ajout du marker à la map + ajout d\'une popup au clique sur le marker
		  let marker = L.marker([content.lat, content.long], { icon: iconCedille }).addTo(map);
		  marker.bindPopup(popupContent);

		  markers.push(marker)
		}
	
		//Création du filtre L.Control
		let filter = L.control({ position: "topright" }); //Create L;control with position on map
		filter.onAdd = function (map) {
		  let form = document.getElementById("filter-form"); //catch form
		  //Add radio all in the filterController
		  form.innerHTML += `
			<input type="radio" id="all" name="type" value="all" checked>
			<label for="all">Tous les Tiers-Lieux</label><br>
		  `;
	
		  //Loop for add service in the filtercontroller
		  for (let service in serviceController) {
			form.innerHTML += `
			  <input type="radio" id="${service}" name="type" value="${service}">
			  <label for="${service}">${service}</label><br>
			`;
		  }
			L.DomEvent.on(form, "change", function (e) {
				let radios = form.elements.type;
				let selectedType;
				let filteredMarkers = [];
			  
				for (let radio of radios) {
				  if (radio.checked) {
					selectedType = radio.value;
					break;
				  }
				}
				if (selectedType === "all") {
					markers.forEach(function (marker) {
					  marker.addTo(map);
					});
				  } else {
					markers.forEach(function (marker) {
					  if (marker.getPopup().getContent().indexOf(selectedType) >= 0) {
						marker.addTo(map);
					  } else {
						marker.removeFrom(map);
					  }
					});
				  }
		  });
		  return form;
		};
		filter.addTo(map)
	  })
	  .catch(error => console.error(error));
	</script>';
}

add_shortcode('simple_map', 'shortcode_map_tiersLieux');

/* function shortcode_list_events_openagenda()
{
	$response = wp_safe_remote_get('https://api.openagenda.com/v2/agendas/{60004897}/events?key={6debd66784b441a680c4353748d8675e}');
	if (!is_wp_error($response) && is_array($response)) :
		$data = json_decode((wp_remote_retrieve_body($response)), true);
		if (isset($data['events']) && !empty($data['events'])) :
			$events = $data['events'];
			$output = '<ul>';
			foreach ($events as $event) :
				$output .= '<li><a href="' . $event['url'] . '">' . $event['title'] . '</a></li>';
			endforeach;
			$output .= '</ul>';
			return $output;
		endif;
	endif;
/* 	return '<script>
	fetch(\'https://api.openagenda.com/v2/agendas/{60004897}/events?key={6debd66784b441a680c4353748d8675e}\')
    .then(response => response.text())
    .then(data => {
        const parsedData = JSON.parse(data); //parse data en JSON
        console.log(parsedData)
    })
    .catch(error => console.error(error));	
	</script>'; 
}
add_shortcode('openagenda_events', 'shortcode_list_events_openagenda'); */

/* function openagenda_events() {
    $api_key = '6debd66784b441a680c4353748d8675e';
    $agenda_id = '60004897';

    $url = "https://api.openagenda.com/v1/agendas/$agenda_id/events?key=$api_key";
    $response = wp_remote_request( $url );
    $body = wp_remote_retrieve_body( $response );
    $data = json_decode( $body );

    $events = $data->data;

    $output = '<ul>';
    foreach ( $events as $event ) {
        $output .= '<li>';
        $output .= '<a href="' . $event->url . '">' . $event->title . '</a>';
        $output .= '</li>';
    }
    $output .= '</ul>';

    return $output;
}
add_shortcode( 'openagenda', 'openagenda_events' ); */


/* 
	

	 */
