var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/ro.json"));

(function ($) {
	'use strict';

	var originCountrySelector = $('#origin-country-selector'),
		destinationCountrySelector = $('#destination-country-selector'),
		result,
		fileName,
		body = $('body'),
		githubDbFolder = 'https://github.com/cristacheda/nomad.expert/tree/master/',
		availableCountries = [{
			"code": "RO",
			"name": "Romania",
			"file": "romania.json",
		}];

	function buildOriginCountrySelector(countries) {
		originCountrySelector.append(`<option value="">Selectează o țară</option>`);
		for (let index = 0; index < countries.length; index++) {
			var country = countries[index];
			if (country) {
				originCountrySelector.append(`<option value="${country.file}">${country.name}</option>`);
			}
		}
	}

	buildOriginCountrySelector(availableCountries);

	originCountrySelector.change(function () {
		fileName = $(this).val();
		if (fileName) {
			//https://raw.githubusercontent.com/cristacheda/nomad.expert/refs/heads/gh-pages/data/documents/
			//https://raw.githubusercontent.com/cristacheda/nomad.expert/refs/heads/master/
			//$.getJSON( "https://mytravelpapers.com/json.php" )
			$.getJSON( "https://raw.githubusercontent.com/cristacheda/nomad.expert/refs/heads/master/" + fileName )
			.done(function( json ) {
				result = json;
				buildDestinationCountrySelector(result);
			})
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				$('#result').append("Eroare în JSON: " +err).show();
				console.log( "Request Failed: " + err );
			});
		} else {
			resetDestinationCountrySelector();
		}
	});

	originCountrySelector.find('option').eq(1).attr('selected','selected');
	originCountrySelector.trigger('change');

	function resetDestinationCountrySelector() {
		if (destinationCountrySelector.length > 0) {
			destinationCountrySelector.find('option:not(:first)').remove();
			destinationCountrySelector.attr('disabled', true);
		}
	}

	function buildDestinationCountrySelector(json) {
		destinationCountrySelector.removeAttr('disabled');
		for (let index = 0; index < json.length; index++) {
			var country = json[index];

			country.translatedName = countries.getName(country.code, "ro");

			if (country.documents) {
				destinationCountrySelector.append(`<option value="${country.code}">${country.translatedName}</option>`);
			}
		}
	}

	// dev
	// $(document).ready(function() {
	// 	destinationCountrySelector.val('YE').trigger('change');
	// });

	originCountrySelector.select2({
        placeholder: 'Selectează o țară',
        width: '100%',
    });

	destinationCountrySelector.select2({
        placeholder: 'Selectează o țară',
        width: '100%',
        
        // Template for displaying options in the dropdown
        templateResult: function(state) {
            if (!state.id) {
                return state.text; // Return the default text for placeholder or blank option
            }
            // Format the option with the flag and the country name
            var flagUrl = `/wp-content/plugins/nomad.expert/assets/img/country-flags/${state.id}.SVG`;
            var flagImage = `<span><img src="${flagUrl}" class="flag" style="width: 20px; height: 15px; margin-right: 10px;">${state.text}</span>`;
            return $(flagImage); // Return the formatted option
        },
        
        // Template for displaying the selected option
        templateSelection: function(state) {
            if (!state.id) {
                return state.text; // Return the default text
            }
            var flagUrl = `/wp-content/plugins/nomad.expert/assets/img/country-flags/${state.id}.SVG`;
            var flagImage = `<span><img src="${flagUrl}" class="flag" style="width: 20px; height: 15px; margin-right: 10px;">${state.text}</span>`;
            return $(flagImage); // Return the formatted selected option
        }
    });

	function findCountry(countryCode, result) {
		var country = result.find(item => item.code === countryCode);
		return country;
	}

	function buildResults(country) {

		var documentclass = '';
		if (country.documents.includes("Carte de Identitate")) {
			documentclass = "idcard";
		}
		if (country.documents == "Pașaport") {
			documentclass = "passport";
		}
		if (country.documents == "Pașaport și Viză") {
			documentclass = "visa";
		}

		var result = $('#result');
		result.empty();

		if (country.documents) {
			result.append(`<p id="info">Pentru a călători în <span class="country-name"><img class="flag" src="/wp-content/plugins/nomad.expert/assets/img/country-flags/${country.code}.SVG"> ${country.translatedName}</span> ai nevoie de <span class="documents ${documentclass}">${country.documents}</span>.</p>`);
		}

		if (country.emergency) {
			result.append(`<div id="emergency" class="d-flex flex-lg-row flex-column mb-4">
				<p class="col-lg-3 block-header d-flex flex-column justify-content-center align-content-center text-center p-lg-2">Alertă de călătorie!</p>
				<p class="col-lg-9 content p-lg-2 mb-0"><strong>⚠️ Atenție!</strong> ${country.emergency}</p>
			</div>`);
		}

		if (country.warning) {
			result.append(`<div id="warning" class="d-flex flex-lg-row flex-column mb-4">
				<p class="col-lg-3 block-header d-flex flex-column justify-content-center align-content-center p-lg-2 text-center">Alertă de călătorie!</p>
				<p class="col-lg-9 content p-lg-2 mb-0"><strong>⚠️ Atenție!</strong> ${country.warning}</p>
			</div>`);
		}

		if (country.comment) {
			result.append(`<div id="comment" class="${documentclass} d-flex flex-lg-row flex-column mb-4">
				<p class="col-lg-3 block-header d-flex flex-column justify-content-center align-content-center p-lg-2 text-center">Condiții de intrare</p>
				<p class="col-lg-9 content p-lg-2 mb-0">${country.comment}</p>
			</div>`);
		}

		if (country.misiune || country.vaccine || country.affiliation) {
			result.append(`<div id="extra" class="d-flex flex-lg-row flex-column">
				<p class="col-lg-3 block-header d-flex flex-column justify-content-center align-content-center p-lg-2 text-center"></p>
				<div class="col-lg-9 content p-lg-2"></div>
			</div>`);
		}

		if (country.misiune) {
			result.find("#extra .block-header").append(`Misiune diplomatică<br><br>`);
			result.find("#extra .content").append(`<p id="mission">${country.misiune}</p>`);
		}

		if (country.vaccine) {
			result.find("#extra .block-header").append(`Vaccin<br><br>`);
			result.find("#extra .content").append(`<p id="vaccine">${country.vaccine}</p>`);
		}

		if (country.affiliation) {
			result.find("#extra .block-header").append(`Afiliere<br><br>`);
			result.find("#extra .content").append(`<p id="affiliation">Afiliere: ${country.affiliation}</p>`);
		}

		if (country.source) {
			result.append(`<p id="source"><a target="_blank" rel="noopener" href="${country.source}">Sursa informațiilor</a></p>`);

			$.getJSON('https://restcountries.com/v3.1/alpha/' + country.code + '?fields=capital,population,timezones,currencies,languages', function (json) {
				result.find("#extra .content").append('<ul id="facts" class="pl-3"></ul>');
				var facts = $('#facts');
				if (json) {
					// console.log(json);
					facts.append(`<li>Capitala: ${json.capital}</li>`);
					facts.append(`<li>Populație: ${json.population.toLocaleString()}</li>`);
					facts.append(`<li>Fus orar principal: ${json.timezones[0]}</li>`);
					facts.append(`<li>Moneda principală: ${json.currencies[Object.keys(json.currencies)[0]].name}</li>`);
					facts.append(`<li>Limba principală: ${json.languages[Object.keys(json.languages)[0]]}</li>`);
					if (country.funfact) {
						facts.append(`<li>${country.funfact}</li>`);
					}
				}
			});
		}

		if (fileName && githubDbFolder) {
			result.append(`<p id="edit"><a target="_blank" rel="noopener" href="${githubDbFolder}${fileName}"><i class="fal fa-edit"></i> Corectează informațiile</a></p>`);
		}

		result.show();
		// body.toggleClass('results-visible');
	}

	function hideResults() {
		var info = $('#info'),
			comment = $('#comment'),
			warning = $('#warning'),
			source = $('#source'),
			result = $('#result');

		result.hide();
		info.empty();
		comment.empty();
		warning.empty();
		source.empty();
	}

	destinationCountrySelector.change(function () {
		var countryCode = $(this).val();
		if (countryCode) {
			var country = findCountry(countryCode, result);
			buildResults(country);
		} else {
			hideResults();
		}
	});

})(jQuery);
