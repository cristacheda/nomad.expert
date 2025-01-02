<?php

/**
 *
 * @link              https://cristache.net
 * @since             1.0.3
 * @package           Nomad_Countries_Shortcode
 *
 * @wordpress-plugin
 * Plugin Name:       Nomad Countries Shortcode
 * Plugin URI:        https://nomad.expert
 * Description:       
 * Tested up to:      6.7.1
 * Version:           1.0.3
 * Requires at least: 6.7.1
 * Requires PHP:      7.4
 * Author:            Dragos Cristache
 * Author URI:        https://cristache.net
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function utm_user_scripts() {
    $plugin_url = plugin_dir_url( __FILE__ );
    wp_enqueue_style( 'style',  $plugin_url . "assets/css/nomad-countries-shortcode.css", array(), filemtime(plugin_dir_path(__FILE__) . "assets/css/nomad-countries-shortcode.css"), 'all' );
    wp_enqueue_style( 'fontawesome',  "https://fa.leadgap.ro/latest/css/all.min.css" );
    wp_enqueue_style( 'select2',  "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" );
    wp_enqueue_script( 'select2',  "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js", array('jquery'), null, true  );
    wp_enqueue_script( 'script',  $plugin_url . "assets/js/nomad-countries-shortcode.min.js", array('jquery'), filemtime(plugin_dir_path(__FILE__) . "assets/js/nomad-countries-shortcode.min.js"), true  );
}
add_action( 'wp_enqueue_scripts', 'utm_user_scripts' );

// Elementor - Remove Font Awesome 
add_action( 'elementor/frontend/after_register_styles',function() {
	foreach( [ 'solid', 'regular', 'brands' ] as $style ) {
		wp_deregister_style( 'elementor-icons-fa-' . $style );
	}
}, 20 );

add_shortcode( 'nomad_render_html', 'nomad_render_html' );
function nomad_render_html() {
	$plugin_url = plugin_dir_url( __FILE__ );
	ob_start();
?>
	<script>
		var plugin_url = '<?php echo $plugin_url; ?>';
	</script>
	<div id="app">
		<div class="container">
			<div id="form-container">
				<div class="row">
					<div class="col-md-6 col-12">
						<label for="origin-country-selector">Din ce țară călătorești?</label>
						<select disabled id="origin-country-selector"></select>
					</div>
					<div class="col-md-6 col-12" id="destination-country-selector-column">
						<label for="destination-country-selector">și în ce țară vrei să ajungi?</label>
						<select id="destination-country-selector" disabled="true">
							<option value="">Selectează o țară</option>
						</select>
					</div>
					<div class="col-12">
						<div id="result"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

<?php
	$output_string = ob_get_contents();
	ob_end_clean();
	return $output_string;
} ?>