<?php

/**
 *
 * @link              https://cristache.net
 * @since             1.0.1
 * @package           Nomad_Countries_Shortcode
 *
 * @wordpress-plugin
 * Plugin Name:       Nomad Countries Shortcode
 * Plugin URI:        https://nomad.expert
 * Description:       
 * Version:           1.0.1
 * Author:            Dragos Cristache
 * Author URI:        https://cristache.net
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function utm_user_scripts() {
    $plugin_url = plugin_dir_url( __FILE__ );
    wp_enqueue_style( 'style',  $plugin_url . "assets/css/nomad-countries-shortcode.css" );
    wp_enqueue_script( 'script',  $plugin_url . "assets/js/nomad-countries-shortcode.min.js", array('jquery'), null, true  );
}
add_action( 'wp_enqueue_scripts', 'utm_user_scripts' );

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
						<select id="origin-country-selector"></select>
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