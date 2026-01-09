define(['OLBConstants'], function () {
    var countriesWithIban = ["Andorra", "Austria", "Bahrain", "Belgium", "Bosnia-Hercegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Faeroe Islands", "Finland", "France", "Georgia", "Germany", "Gibraltar", "Great Britain", "Greece", "Greenland", "Guernsey", "Hungary", "Iceland", "Ireland", "Isle of Man", "Isle of Man", "Italy", "Jersey", "Jersey", "Jordan", "Kasakhstan", "Kuwait", "Latvia", "Lebanon", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Palestinian Territory", "Poland", "Portugal", "Qatar", "Romania", "San Marino", "Saudi Arabia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Tunisia", "Turkey", "United Arab Emirates"]

    return {
        isCountrySupportsIBAN: function (country) {
            return countriesWithIban.indexOf(country) > -1;
        }
    }

})