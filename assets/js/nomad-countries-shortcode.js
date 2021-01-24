var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/ro.json"));

(function ($) {
	'use strict';

	var originCountrySelector = $('#origin-country-selector'),
		destinationCountrySelector = $('#destination-country-selector'),
		result,
		fileName,
		body = $('body'),
		githubDbFolder = 'https://github.com/cristacheda/nomad.expert/tree/gh-pages/data/documents/',
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

	// originCountrySelector.find('option')[1].attr('selected','selected');

	originCountrySelector.change(function () {
		fileName = $(this).val();
		if (fileName) {
			$.getJSON(plugin_url + 'data/documents/' + fileName, function (json) {
				result = json;
				buildDestinationCountrySelector(result);
			});
		} else {
			resetDestinationCountrySelector();
		}
	});

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
			result.append(`<p id="info">Pentru a călători în <span class="country-name"><img class="flag" src="${plugin_url}/assets/img/country-flags/${country.code}.svg"> ${country.translatedName}</span> ai nevoie de <span class="documents ${documentclass}">${country.documents}</span>.</p>`);
		}

		if (country.emergency) {
			result.append(`<p id="emergency" class="blockquote"><strong>⚠️ Atenție!</strong> ${country.emergency}</p>`);
		}

		if (country.warning) {
			result.append(`<p id="warning" class="blockquote">${country.warning}</p>`);
		}

		if (country.comment) {
			result.append(`<p id="comment" class="blockquote">${country.comment}</p>`);
		}

		if (country.misiune) {
			result.append(`<p id="mission" class="blockquote">${country.misiune}</p>`);
		}

		if (country.vaccine) {
			result.append(`<p id="vaccine">${country.vaccine}</p>`);
		}

		// de adăugat steaguri
		if (country.affiliation) {
			result.append(`<p id="affiliation">Afiliere: ${country.affiliation}</p>`);
		}

		if (country.source) {
			result.append(`<p id="source"><a target="_blank" rel="noopener" href="${country.source}">Sursa informațiilor</a></p>`);

			$.getJSON('https://restcountries.eu/rest/v2/alpha/' + country.code + '?fields=capital;population;timezones;currencies;languages', function (json) {
				$('#source').before('<ul id="facts"></ul>');
				var facts = $('#facts');
				if (json) {
					// console.log(json);
					facts.append(`<li class="first"><strong>Fun facts!</strong></li>`);
					facts.append(`<li>Capitala: ${json.capital}</li>`);
					facts.append(`<li>Populație: ${json.population.toLocaleString()}</li>`);
					facts.append(`<li>Fus orar principal: ${json.timezones[0]}</li>`);
					facts.append(`<li>Moneda principală: ${json.currencies[0].name}</li>`);
					facts.append(`<li>Limba principală: ${json.languages[0].name}</li>`);
					if (country.funfact) {
						facts.append(`<li>${country.funfact}</li>`);
					}
				}
			});
		}

		if (fileName && githubDbFolder) {
			result.append(`<p id="edit"><a target="_blank" rel="noopener" href="${githubDbFolder}/${fileName}"><i class="fal fa-edit"></i> Corectează informațiile</a></p>`);
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