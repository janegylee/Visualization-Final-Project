export default {
  init: function () {
    return {
      total: 0,
      netflix: 0,
      hulu: 0,
      prime: 0,
      disney: 0,
      IMDB_Total: 0,
      IMDB_Count: 0,
      Rotten_Total: 0,
      Rotten_Count: 0,
      IMDB: 0,
      Rotten: 0,
    };
  },

  mapProcess: function (data) {
    const obj = {};

    for (let i = 0; i < data.length; i++) {
      let datum = data[i];

      const country = datum['Country'];
      const imdb = datum['IMDB'] ? datum['IMDB'] : 0;
      const rotten = datum['Rotten'] ? datum['Rotten'] : '0%';
      const disney = datum['Disney+'] ? datum['Disney+'] : 0;
      const netflix = datum['Netflix'] ? datum['Netflix'] : 0;
      const hulu = datum['Hulu'] ? datum['Hulu'] : 0;
      const prime = datum['Prime'] ? datum['Prime'] : 0;

      if (country === null || country === undefined || country === '') continue;
      if (rotten === null) continue;

      // Split the country
      const countries = country.split(',');
      const firstCountry = countries[0];

      if (obj[firstCountry] === undefined) {
        obj[firstCountry] = this.init();
      }

      const rottenNumber = parseInt(rotten.substring(0, rotten.length - 1));

      const countryObj = obj[firstCountry];
      countryObj['total']++;
      countryObj['netflix'] += netflix;
      countryObj['hulu'] += hulu;
      countryObj['prime'] += prime;
      countryObj['disney'] += disney;

      if (imdb !== 0) {
        countryObj['IMDB_Total'] += imdb;
        countryObj['IMDB_Count']++;
        countryObj['IMDB'] =
          countryObj['IMDB_Total'] / countryObj['IMDB_Count'];
      }

      if (rotten !== '0%') {
        countryObj['Rotten_Total'] += rottenNumber;
        countryObj['Rotten_Count']++;
        countryObj['Rotten'] =
          countryObj['Rotten_Total'] / countryObj['Rotten_Count'];
      }
    }

    return obj;
  },
  // barProcess @Param {}
  // return array of objects
  barProcess: function (obj) {
    const arr = [];

    const netflix = {};
    netflix.platform = 'Netflix';
    netflix.count = obj['netflix'];
    arr.push(netflix);

    const disney = {};
    disney.platform = 'Disney+';
    disney.count = obj['disney'];
    arr.push(disney);

    const prime = {};
    prime.platform = 'Prime';
    prime.count = obj['prime'];
    arr.push(prime);

    const hulu = {};
    hulu.platform = 'Hulu';
    hulu.count = obj['hulu'];
    arr.push(hulu);

    return arr;
  },

  starProcess: function (number) {
    const arr = [0, 0, 0, 0, 0];
    let index = 0;
    while (number > 0) {
      arr[index] = Math.min(+number.toFixed(2), 2) / 2;
      number -= 2;
      index++;
    }

    return arr;
  },
};
