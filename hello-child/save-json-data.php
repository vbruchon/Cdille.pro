<?php

function my_save_json_data()
{
    $url = 'http://cedille.ftalps.fr/wp-content/themes/hello-elementor/geojson/data.json';
    $file_path = get_stylesheet_directory() . '/geojson/myNewData.json';

    // Récupération des données depuis l'URL
    $data = file_get_contents($url);

    // Décodage des données JSON
    $json_data = json_decode($data, true);

    // Enregistrement des données dans un fichier JSON
    file_put_contents($file_path, json_encode($json_data));
    echo "save";
}

// Exécution de la fonction lors de l'activation du thème ou du plugin
add_action('init', 'my_save_json_data');
