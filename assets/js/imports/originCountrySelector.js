var originCountrySelector = $('#origin-country-selector');
var countries = [
    {
        "code" : "RO",
        "name" : "Romania",
        "file" : "romania.json"
    },
];

function buildOriginCountrySelector(countries) {
    originCountrySelector.append(`<option value="">Selectează o țară</option>`);
    for (let index = 0; index < countries.length; index++) {
        var country = countries[index];
        // console.log(element.name);
        if (country) {
            originCountrySelector.append(`<option value="${country.code}">${country.name}</option>`);
        }
    }
}

buildOriginCountrySelector(countries);