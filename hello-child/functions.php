<?php

/* enqueue script for parent theme stylesheeet */
function childtheme_parent_styles()
{
    // enqueue style
    wp_enqueue_style('parent', get_template_directory_uri() . '/style.css');
}
add_action('wp_enqueue_scripts', 'childtheme_parent_styles');

require_once('short-codes.php');

/* function my_theme_enqueue_scripts()
{
	// charge les fichiers seulement si le shortcode est utilisé sur la page
	if (has_shortcode(get_post()->post_content, 'simple_map')) {
		wp_enqueue_style('simple_map-css', get_stylesheet_directory_uri() . '/assets/css/map.css');
		//wp_enqueue_script('simple_map-js', get_stylesheet_directory_uri() . '/assets/js/map.js', 1.0, true);
	}

	if (has_shortcode(get_post()->post_content, 'openagenda_events_list')) {
		wp_enqueue_script('openagenda_events_list-js', get_stylesheet_directory_uri() . '/assets/js/openAgenda.js', 1.0, true);
	}
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_scripts'); */

