var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/ro.json"));
const {flag} = require('country-emoji');

var originCountrySelector = $('#origin-country-selector'),
    destinationCountrySelector = $('#destination-country-selector'),
    result,
    fileName,
    body = $('body'),
    githubDbFolder = 'https://github.com/cristacheda/nomad.expert/tree/gh-pages/data/documents/',
    availableCountries = [
                            {
                                "code": "RO",
                                "name": "Romania",
                                "file": "romania.json",
                            }
                        ];

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
        $.getJSON('/data/documents/' + fileName, function (json) {
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
        if ( country.documents ) {
            destinationCountrySelector.append(`<option value="${country.code}">${country.translatedName}</option>`);
        }
    }
}

function findCountry(countryCode, result) {
    var country = result.find(item => item.code === countryCode);
    return country;
}

function buildResults(country) {
    var info = $('#info'),
        comment = $('#comment'),
        warning = $('#warning'),
        source = $('#source'),
        result = $('#result');
    
    info.html(`Pentru a călători în <span>${flag(country.code)} ${country.translatedName}</span> ai nevoie de <span>${country.documents}</span>.`);
    comment.text(country.comment);
    if (country.warning) {
        warning.show();
        warning.text(country.warning);
    } else {
        warning.hide();
    }
    source.html(`<a target="_blank" rel="noopener" href="${country.source}">Sursa informațiilor</a>`);
    result.show();
    body.toggleClass('results-visible');
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

function buildEditLink(fileName) {
    $('#edit').html(`<a target="_blank" rel="noopener" href="${githubDbFolder}/${fileName}"><i class="fal fa-edit"></i> Corectează informațiile</a>`);
}

destinationCountrySelector.change(function() {
    var countryCode = $(this).val();
    if (countryCode) {
        var country = findCountry(countryCode, result);
        buildResults(country); 
    } else {
        hideResults();
    }
    buildEditLink(fileName);
});

// destinationCountrySelector.select2({
//     theme: "classic",
// });

// originCountrySelector.select2({
//     theme: "classic",
// });