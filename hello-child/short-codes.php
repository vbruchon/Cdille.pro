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
	ob_start();
?>
	<div id="events"></div>
<?php
	return ob_get_clean();
}
add_shortcode('openagenda_events_list', 'openagenda_events');



//MAP WITH MY GEOJSON DATA
function shortcode_map_tiersLieux()
{
	// Charger les fichiers CSS et JavaScript
	wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', array(), '1.9.3');
	wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', array(), '1.9.3');
	wp_enqueue_script('markerCluster-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js', array('leaflet-js'), '1.5.3', true);

	// Charger le fichier JavaScript filterbar.js
	/* 	wp_enqueue_script('filterbar-js', get_stylesheet_directory_uri() . '/assets/js/map/filterbar.js', array('leaflet-js'), '1.0.0', true);
 */
	// Charger le fichier JavaScript map.js
	wp_enqueue_script('leaflet-js', get_stylesheet_directory_uri() . '/assets/js/map/leaflet.js', array(), '1.0.0', true);
	wp_enqueue_script('markerCluster-js', get_stylesheet_directory_uri() . '/assets/js/map/markerCluster.js', array(), '1.0.0', true);
	wp_enqueue_script('listAndMap-js', get_stylesheet_directory_uri() . '/assets/js/map/listAndMap.js', array('leaflet-js', 'markerCluster-js'), '1.0.0', true);
	wp_enqueue_script('filterBar-js', get_stylesheet_directory_uri() . '/assets/js/map/filterBar.js', array('listAndMap-js'), '1.0.0', true);
	wp_enqueue_script('map-js', get_stylesheet_directory_uri() . '/assets/js/map/map.js', array('leaflet-js', 'markerCluster-js', 'listAndMap-js', 'filterBar-js'), '1.0.0', true);

	// Charger les fichiers CSS personnalisés
	wp_enqueue_style('map-css', get_stylesheet_directory_uri() . '/assets/css/map.css', array(), '1.0.0');

	// Créer les div nécessaires
	$content = '<div id="content-div"><div id="list"></div><div id="map"></div></div>';
	$form_div = '<form  method="get" id="filter-form"></form>';

	// Retourner le contenu généré
	return $form_div . $content;
}
add_shortcode('simple_map', 'shortcode_map_tiersLieux');


function display_latest_post()
{
	wp_enqueue_style('last-posts-css', get_stylesheet_directory_uri() . '/assets/css/lastest_post.css', array(), '1.0.0');

	$args = array(
		'post_type' => 'post',
		'posts_per_page' => 3,
		'no_found_rows' => true,  // Empêche la récupération des commentaires pour chaque article
		'update_post_meta_cache' => false  // Empêche la récupération des métadonnées pour chaque article
	);
	$latest_post = new WP_Query($args); ?>
	<div id="last-posts">
		<?php
		while ($latest_post->have_posts()) : $latest_post->the_post(); ?>
			<div class="latest-post">
				<img src="<?php the_post_thumbnail() ?>" alt="">
				<h2 class="latest-post-title"><?php the_title(); ?></h2>
			</div>
		<?php
		endwhile;
		wp_reset_postdata();  // Réinitialise les données de publication après la boucle
		?>
	</div>
<?php
}
add_shortcode('latest_post', 'display_latest_post');
