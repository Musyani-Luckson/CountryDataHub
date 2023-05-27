import { hp } from "./lib.js";
import { Countries } from './Countries.js';
import { FullCountry } from './fullCountry.js';
import { Groups } from './groups.js';

const countries = new Countries();
const fullCountry = new FullCountry();
const groups = new Groups();

const countryInfo = hp.getDom('#countryDetails')
const allCountries = hp.getDom('#landingPagecountries')
const offcanvasUpper = hp.getDom('#offcanvasUpper')

const groupedDetailsDiv = hp.getDom('#groupedDetailsDiv')

function groupObjectKeys(obj) {
  const result = {};
  const categories = [
    ['Identification', ['cca2x', 'cca3x', 'ccn3x']],
  ['Geography', ['name', 'region', 'subregion', 'population', 'area', 'latlng', 'independent', 'landlocked']],
  ['Administration', ['capital', 'statusx', 'startOfWeek', 'unMember']],
  ['Language', ['languages', 'demonymsx']],
  ['Currency', ['currencies']],
  ['Communication', ['tld', 'iddx', 'timezones']],
  ['Miscellaneous', ['continentsx', 'mapsx', 'flagsx', 'coatOfArmsx', 'capitalInfox', 'carx', 'translationsx']]
];

  Object.entries(obj).forEach(([key, value]) => {
    categories.forEach(([categoryName, categoryKeys]) => {
      if (categoryKeys.includes(key)) {
        if (!result[categoryName]) {
          result[categoryName] = {};
        }
        result[categoryName][key] = value;
      }
    });
  });

  return result;
}



function renderFlag(flagSrc, flagAlt) {
  const flagDiv = hp.setDom('div', { class: 'flagDiv' });
  const img = hp.setDom('img', { src: flagSrc, alt: flagAlt });
  flagDiv.appendChild(img);
  return flagDiv;
}

function renderCountryName(commonName) {
  const countryName = hp.setDom('div', { class: 'countryName' });
  hp.setInnerText(countryName, commonName);
  return countryName;
}

function renderCountryRegion(region) {
  const countryRegion = hp.setDom('div', { class: 'countryInfo' });
  hp.setInnerText(countryRegion, `Region: ${region}`);
  return countryRegion;
}

function renderCountryPopulation(population) {
  const countryPopulation = hp.setDom('div', { class: 'countryInfo' });
  hp.setInnerText(countryPopulation, `Population: ${hp.formatNumber(population, ',')}`);
  return countryPopulation;
}

function renderCountryLanguage(languages) {
  const countryLanguage = hp.setDom('div', { class: 'countryInfo' });
  hp.setInnerText(countryLanguage, `Language: ${languages}`);
  return countryLanguage;
}

function renderCountry(country, instance, hp) {
  const countryAnchor = hp.setDom('div', { class: 'country', 'data-bs-toggle': 'offcanvas', 'data-bs-target': '#demo' });
  const briefDetailsContainer = hp.setDom('div', { class: 'briefDetailsContainer' });

  const flag = instance.getFlagOfACountry(country, 'png');
  const commonName = instance.getCountryNames(country).common;
  const region = instance.getCountryInfo(country).region;
  const population = instance.getCountryInfo(country).population;
  const languages = instance.getCountryInfo(country).languages;

  const flagDiv = renderFlag(flag.src, flag.alt);
  const countryName = renderCountryName(commonName);
  const countryRegion = renderCountryRegion(region);
  const countryPopulation = renderCountryPopulation(population);
  const countryLanguage = renderCountryLanguage(languages);

  briefDetailsContainer.appendChild(countryName);
  briefDetailsContainer.appendChild(countryRegion);
  briefDetailsContainer.appendChild(countryPopulation);
  briefDetailsContainer.appendChild(countryLanguage);

  countryAnchor.appendChild(flagDiv);
  countryAnchor.appendChild(briefDetailsContainer);
  const data = {
    element: countryAnchor,
    country: country,
    flag: flag,
    instance: instance,
    hp: hp,
  }
  handleCountry(data)
  return countryAnchor;
}

function handleCountry(data) {
  const { element, country, flag, instance, hp } = data
  element.addEventListener('click', () => {
    const brandName = hp.getDom('#brandName');
    offcanvasUpper.innerHTML = "";
    const result = groupObjectKeys(country);
    hp.setInnerText(
      brandName,
      instance.getCountryNames(country).common
    )
    offcanvasUpper.appendChild(renderFlag(flag.src, flag.alt))
    // renderGroupNav({ group: result })
    renderGroups(
      groupedDetailsDiv,
      result,
      instance
    )
  })
}

function renderGroupNav(data) {
  const navUl = hp.getDom('#navUl');
  navUl.innerHTML = "";
  const { group } = data;
  const names = ['Home', ...Object.keys(group)]
  for (let name of names) {
    let li, a;
    if (hp.capitalizeWords(name) === 'Home') {
      li = hp.setDom('li', { class: 'nav-item', 'data-bs-dismiss': 'offcanvas' })
      navUl.appendChild(li)
      a = hp.setDom('a', { class: 'nav-link' })
      li.appendChild(a)
    } else {
      li = hp.setDom('li', { class: 'nav-item' })
      navUl.appendChild(li)
      a = hp.setDom('a', { class: 'nav-link', href: `#${name.toLowerCase()}` })
      li.appendChild(a)
    }
    hp.setInnerText(
      a,
      hp.capitalizeWords(name)
    )
  }
}

function renderGroupName(text) {
  const div = hp.setDom(
    'div',
    {
      class: `groupName`
    }
  )
  hp.setInnerText(
    div,
    hp.capitalizeWords(text)
  )
  return div;
}

function renderGroups(receiver, group, instance) {
  receiver.innerHTML = "";
  const groupNames = Object.keys(group)
  for (let name of groupNames) {
    const groupDiv = hp.setDom('div', {
      class: `groupDiv`,
      id: name.toLowerCase()
    })
    groupDiv.appendChild(renderGroupName(name))
    receiver.appendChild(groupDiv)
    const groupBody = hp.setDom('div', { class: 'groupBody' })
    groupDiv.appendChild(groupBody)

    const data = {
      receiver: groupBody,
      group: group,
      name: name,
    }
    groups[name](data)
  }
}

function renderCountries(receiver, instance, countries) {
  const countryAnchors = Object.keys(countries)
    .map((countryName) => renderCountry(countries[countryName], instance, hp));
  receiver.innerHTML = "";
  countryAnchors.forEach((countryAnchor) => {
    receiver.appendChild(countryAnchor);
  });
  if (!hp.isNotEmpty(countries)) {
    hp.setInnerText(
      receiver,
      `No country was found!`
    )
  }
}

function renderZoneOptions(receiver, receiverA, countryGroup, instance) {
  const key = 'regions'
  const zoneOptions = Object.keys(countryGroup)
  renderOptions(receiver, zoneOptions, key)
  const zoneOptionsA = Object.keys(countryGroup[key])
  renderOptions(receiverA, zoneOptionsA, 'all')
  hp.setInnerText(
    hp.getDom('#zonedLabel'),
    hp.capitalizeWords(key)
  )
  const cluttered = getCountriesByGroup(
    zone,
    zoned,
    countryGroup,
    hp
  )
  renderCountries(
    hp.getDom(`#landingPagecountries`),
    instance,
    cluttered
  );
}

function handleZones(zones, zoned, group) {
  zones.addEventListener(`input`, () => {
    const zone = zones.value
    const countryGroup = countries.groupCountries()
    const zonedOptions = Object.keys(countryGroup[zone])
    renderOptions(zoned, zonedOptions, 'all')
    hp.setInnerText(
      hp.getDom('#zonedLabel'),
      hp.capitalizeWords(zone)
    )
  })
}

function handleZoned(zoned, zone, countryGroup, instance) {
  zoned.addEventListener(`input`, () => {
    const countries = getCountriesByGroup(
      zone,
      zoned,
      countryGroup,
      hp
    )
    renderCountries(
      hp.getDom(`#landingPagecountries`),
      instance,
      countries
    );
  })
}

function renderOptions(receiver, options, selected) {
  receiver.innerHTML = "";
  for (let name of options) {
    const option = hp.setDom('option', { value: name.toLowerCase() })
    if (option.value === selected) {
      option.selected = true;
    }
    hp.setInnerText(
      option,
      hp.capitalizeWords(name)
    )
    receiver.appendChild(option)
  }
}

function findCountryNames(str, countries) {
  const names = Object.keys(countries)
  let found = {};
  for (let i = 0; i < names.length; i++) {
    if (names[i].toLowerCase().includes(str.toLowerCase())) {
      found[names[i]] = countries[names[i]]
    }
  }
  return found;
}

function searchForACountry(zoned, zone, countryGroup, instance) {
  const input = hp.getDom('#country')
  input.addEventListener(`input`, () => {
    const value = hp.capitalizeWords(input.value.trim())

    const countries = getCountriesByGroup(
      zone,
      zoned,
      countryGroup,
      hp
    )

    let found = findCountryNames(
      value,
      countries
    )
    renderCountries(
      hp.getDom(`#landingPagecountries`),
      instance,
      found
    );

  })
}

function getCountriesByGroup(zone, zoned, countryGroup, hp) {
  if (!zone || !zoned || !countryGroup || !hp) {
    throw new Error('Missing required parameters');
  }
  const { value: zoneValue } = zone;
  const { value: zonedValue } = zoned;
  const group = { type: zoneValue, name: hp.capitalizeWords(zonedValue) };
  const { type, name } = group;
  if (!countryGroup[type] || !countryGroup[type][name]) {
    throw new Error(`No countries found for ${type} ${name}`);
  }
  return countryGroup[type][name];
}

countries.fetchData()
  .then(() => {
    const zones = hp.getDom('#zone');
    const zoned = hp.getDom('#zoned');
    const countryGroup = countries.groupCountries();
    renderZoneOptions(zones, zoned, countryGroup, countries);
    handleZones(zones, zoned, countryGroup, countries);
    handleZoned(zoned, zones, countryGroup, countries);
    searchForACountry(zoned, zones, countryGroup, countries);
  })
  .catch((error) => {
    console.error(`Failed to fetch countries data: ${error}`);
  });
