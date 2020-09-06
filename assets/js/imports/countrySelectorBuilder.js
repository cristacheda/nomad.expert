var originCountrySelector = $('#origin-country-selector');
var destinationCountrySelector = $('#destination-country-selector');
var result;
var availableCountries = [
    {
        "code": "RO",
        "name": "Romania",
        "file": "romania.json"
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

originCountrySelector.change(function () {
    var fileName = $(this).val();
    $.getJSON('../../data/documents/' + fileName, function (json) {
        result = json;
        buildDestinationCountrySelector(result);
    })  
});

function buildDestinationCountrySelector(json) {
    destinationCountrySelector.append(`<option value="">Selectează o țară</option>`);
    for (let index = 0; index < json.length; index++) {
        var country = json[index];
        if ( country.documents ) {
            destinationCountrySelector.append(`<option value="${country.code}">${country.name}</option>`);
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
        source = $('#source');
    
        info.text(`Pentru a călători în ${country.name} ai nevoie de ${country.documents}.`);
    comment.text(country.comment);
    source.html(`<a href="${country.source}">Sursa informațiilor</a>`);
}

destinationCountrySelector.change(function() {
    var countryCode = $(this).val();
    var country = findCountry(countryCode, result);
    buildResults(country);
});
