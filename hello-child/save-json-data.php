<?php
function createGeoJsonFileWithCptData()
{
    //Récupérer tous les tiers-lieux
    $args = array(
        'post_type' => 'annuaires',
        'posts_per_page' => -1, // Récupère tous les articles
    );

    $allTiersLieux = new WP_Query($args);

    // Créer un tableau vide pour stocker les données des tiers-lieux
    $tierslieux_data = array();

    if ($allTiersLieux->have_posts()) {
        while ($allTiersLieux->have_posts()) : $allTiersLieux->the_post();
            $tierslieux_fields = get_fields();
            $tierslieux_terms = get_the_terms(get_the_ID(), 'type');
            $tierslieux_service = get_the_terms(get_the_ID(), 'service');

            $typePlace = array();
            $services = array();

            if ($tierslieux_terms) {
                foreach ($tierslieux_terms as $type) {
                    $typePlace[] = $type->name;
                }
            }
            if ($tierslieux_service) {
                foreach ($tierslieux_service as $service) {
                    $services[] = $service->name;
                }
            };

            $tierslieux_item = array(
                "type" => "Feature",
                "geometry" => array(
                    "type" => "Point",
                    "coordinates" => array(
                        isset($tierslieux_fields['longitude']) ? floatval($tierslieux_fields['longitude']) : "",
                        isset($tierslieux_fields['latitude']) ? floatval($tierslieux_fields['latitude']) : "",
                    ),
                ),
                "properties" => array(
                    "identification" => array(
                        "etat" => isset($tierslieux_fields['state']) ? $tierslieux_fields['state'] : "",
                        "nom_long" => isset($tierslieux_fields['big_name']) ? $tierslieux_fields['big_name'] : "",
                        "nom_court" => get_the_title(),
                    ),
                    "coordonees" => array(
                        "adresse" => isset($tierslieux_fields['adresse']) ? $tierslieux_fields['adresse'] : "",
                        "code_postal" => isset($tierslieux_fields['postal_code']) ? $tierslieux_fields['postal_code'] : "",
                        "commune" => isset($tierslieux_fields['city']) ? $tierslieux_fields['city'] : "",
                        "telephone" => isset($tierslieux_fields['phone']) ? $tierslieux_fields['phone'] : "",
                        "telephone_special" => isset($tierslieux_fields['special_phone']) ? $tierslieux_fields['special_phone'] : "",
                        "mobile" => isset($tierslieux_fields['mobile_phone']) ? $tierslieux_fields['mobile_phone'] : "",
                        "mail" => isset($tierslieux_fields['email']) ? $tierslieux_fields['email'] : "",
                        "site_internet" => isset($tierslieux_fields['webSite']) ? $tierslieux_fields['webSite'] : "",
                    ),
                    "communication" => array(
                        "reseau_social_1" => isset($tierslieux_fields['reseau_social_1']) ? $tierslieux_fields['reseau_social_1'] : "",
                        "reseau_social_2" => isset($tierslieux_fields['reseau_social_2']) ? $tierslieux_fields['reseau_social_2'] : "",
                        "reseau_social_3" => isset($tierslieux_fields['reseau_social_3']) ? $tierslieux_fields['reseau_social_3'] : "",
                        "reseau_social_4" => isset($tierslieux_fields['reseau_social_4']) ? $tierslieux_fields['reseau_social_4'] : "",
                        "reseau_social_5" => isset($tierslieux_fields['reseau_social_5']) ? $tierslieux_fields['reseau_social_5'] : "",
                        "logo_url" => isset($tierslieux_fields['logo_url']) ? $tierslieux_fields['logo_url'] : "",
                    ),
                    "complement_info" => array(
                        "descriptif_court" => isset($tierslieux_fields['descriptif_court']) ? $tierslieux_fields['descriptif_court'] : "",
                        "descriptif_long" => isset($tierslieux_fields['descriptif_long']) ? $tierslieux_fields['descriptif_long'] : "",
                        "statut" => isset($tierslieux_fields['status_']) ? $tierslieux_fields['status_'] : "",
                        "classification" => isset($tierslieux_fields['classification']) ? $tierslieux_fields['classification'] : "",
                        "typePlace" => !empty($typePlace) ? $typePlace : "",
                        "services" => !empty($typePlace) ? $services : "",
                    ),
                    "maj" => array(
                        "date_MAJ" => isset($tierslieux_fields['date_MAJ']) ? $tierslieux_fields['date_MAJ'] : "",
                        "MAJ_Qui" => isset($tierslieux_fields['MAJ_Qui']) ? $tierslieux_fields['MAJ_Qui'] : "",
                    ),
                ),
            );

            // Ajouter le tiers-lieu au tableau des tiers-lieux
            $tierslieux_data["features"][] = $tierslieux_item;
        endwhile;


        // Convertir les données en JSON
        $tierslieux_json = json_encode($tierslieux_data, JSON_PRETTY_PRINT);

        // Décoder les entités HTML
        $tierslieux_json = html_entity_decode($tierslieux_json, ENT_QUOTES, 'UTF-8');

        // Enregistrer le JSON dans un fichier
        $file_path = get_stylesheet_directory() . '/assets/geojson/annuaire_tiers-lieux.json';
        file_put_contents($file_path, $tierslieux_json);
    } else {
        echo "aucun tiers-lieux";
    }
}

add_action('init', 'createGeoJsonFileWithCptData');