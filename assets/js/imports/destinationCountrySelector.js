var json = require('../../data/documents/romania.json');
var destinationCountrySelector = $('#destination-country-selector');

function buildDestinationCountrySelector(json) {
    destinationCountrySelector.append(`<option value="">Selectează o țară</option>`);
    for (let index = 0; index < json.length; index++) {
        var country = json[index];
        // console.log(element.name);
        if ( country.documents ) {
            destinationCountrySelector.append(`<option value="${country.code}">${country.name}</option>`);
        }
    }
}

buildDestinationCountrySelector(json);

function findCountry(countryCode, json) {
    var country = json.find(item => item.code === countryCode);
    return country;
}

function buildResults(country) {
    var info = $('#info'),
        comment = $('#comment'),
        source = $('#source');
    
        info.text(`Pentru a călători în ${country.name} ai nevoie de ${country.documents}.`);
    comment.text(country.comment);
    source.html(`<a href="${country.source}">Sursa informațiilor</a>`);
}

destinationCountrySelector.change(function() {
    var countryCode = $(this).val();
    // console.log(countryCode);
    var country = findCountry(countryCode, json);
    // console.log(country);
    buildResults(country);
});