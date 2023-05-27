import { hp } from "./lib.js";

export class Countries {
  #data = null;
  async fetchData() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      this.#validateData(data);
      this.#data = data;
    } catch (error) {
      console.error('Failed to fetch countries data:', error);
      throw error;
    }
  }
  getData() {
    const countries = this.getAllCountryNames();
    const names = hp.sortArr(Object.keys(countries));
    const countriesObj = {};
    for (const name of names) {
      countriesObj[name] = countries[name];
    }
    return countriesObj
  }

  #validateData(data) {
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format');
    }
    data.forEach(country => {
      if (typeof country !== 'object' || country === null) {
        throw new Error('Invalid data format');
      }
    });
  }
  getFlagOfACountry(countryObj, svg_png) {
    const validTypes = ["svg", "png"];
    if (!validTypes.includes(svg_png)) {
      throw new Error(`Invalid flag type: ${svg_png}`);
    }
    const flags = countryObj.flags;
    return { src: flags[svg_png], alt: flags.alt };
  }
  getCountryByName(name) {
    name = hp.capitalizeWords(name)

    if (!Object.values(this.getData())) {
      throw new Error('Data not available');
    }
    const country = Object.values(this.getData()).find((country) => country.name.common === name);
    return country;
  }
  getCountryNames(countryObj) {
    return countryObj.name;
  }

  getAllCountryNames() {
    if (!this.#data) {
      throw new Error('Data not available');
    }
    const countriesObj = {};
    this.#data.map((item) => {
      const names = this.getCountryNames(item)
      countriesObj[names.common] = item
    })
    return countriesObj;
  }
  getCountryInfo(countryObj) {
    const { continents, region, population, languages } = countryObj;
    const languageNames = languages;
    return {
      region,
      population,
      languages: getString(languageNames),
      continents: getString(continents),
    };
  }
  groupCountries() {
    const countryNames = this.getData()
    const result = { all: { All: countryNames }, continents: { All: countryNames }, regions: { All: countryNames } }
    Object.values(countryNames).forEach(country => {
      const countryInfo = this.getCountryInfo(country)
      const continent = countryInfo.continents
      const region = countryInfo.region
      const name = this.getCountryNames(country).common

      if (!result.continents[continent]) result.continents[continent] = {}
      result.continents[continent][name] = countryNames[name]

      if (!result.regions[region]) result.regions[region] = {}
      result.regions[region][name] = countryNames[name]
    })
    return result
  }


}

function getString(languageNames) {
  if (!languageNames) {
    return ' ';
  }
  return Object.values(languageNames).join(', ');
}

