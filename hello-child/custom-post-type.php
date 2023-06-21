<? 
function annuaire_custom_post_type()
{
    //CPT
    $labels = array(
        'name' => _x('Tiers-Lieux', 'Post Type General Name'),
        'singular_name'       => _x('Tiers-lieu', 'Post Type Singular Name'),
        'menu_name'           => __('Annuaires Tiers-lieux'),
        // Les différents libellés de l'administration 		
        'all_items'           => __('Tous les tiers-lieux'),
        'view_item'           => __('Voir les tiers-lieux'),
        'add_new_item'        => __('Ajouter un nouveau tiers-lieux'),
        'add_new'             => __('Ajouter'),
        'edit_item'           => __('Editer le tiers-lieu'),
        'update_item'         => __('Modifier le tiers-lieu'),
        'search_items'        => __('Rechercher un tiers-lieu'),
        'not_found'           => __('Non trouvée'),
        'not_found_in_trash'  => __('Non trouvée dans la corbeille'),
    );

    $args = array(
        'label'               => __('Annuaires des Tiers-Lieux'),
        'labels'              => $labels,
        'menu_position'          => 4,
        'menu_icon'            => 'dashicons-admin-multisite',
        'supports'            => array('title', 'thumbnail', 'custom-fields'),
        /* options supplémentaires*/ 
        'show_in_rest'          => true,
        'hierarchical'        => false,
        'public'              => true,
        'rewrite'              => array('slug' => 'annuaires-tiers-lieux'),
    );
    register_post_type('annuaires', $args);

    //Taxonomy
    $labels = array(
        'name' => 'Types',
        'new_item_name' => 'Nouveu type',
        'parent_item' => 'Type parentes',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
    );
    register_taxonomy('type', 'annuaires', $args);

    //Taxonomy
    $labels = array(
        'name' => 'Services',
        'new_item_name' => 'Nouveau service',
        'parent_item' => 'Service parents',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
    );
    register_taxonomy('service', 'annuaires', $args);
}

add_action('after_setup_theme', 'annuaire_custom_post_type', 0);
