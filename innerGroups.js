import { hp } from "./lib.js";


export class InnerGroups {
  constructor() {}
}

function renderDiv(attr = {}) {
  return hp.setDom(
    'div', attr
  )
}


function renders(content, name) {
  const outerDiv = renderDiv({ class: 'outerDiv' })
  const headerDiv = renderDiv({ class: 'headerDiv' })
  const bodyDiv = renderDiv({ class: 'bodyDiv' })
  hp.setInnerText(
    headerDiv,
    hp.capitalizeWords(name)
  )
  hp.setInnerText(
    bodyDiv,
    content
  )
  outerDiv.appendChild(headerDiv)
  outerDiv.appendChild(bodyDiv)
  return outerDiv
}


InnerGroups.prototype.name = function(names) {
  const { value, capital } = names;
  const { common, nativeName, official } = value;
  const content = `${common}. Is the commonly used name for the country. This name is recognized worldwide and is the name that most people use to refer to the country.
   ${official}. This name is used in formal contexts, such as in diplomatic communications, government documents, and international treaties.
   `
   /*
   ${nativeName}. native name(s). Which can be name or names of this country in its language.
   */
  return renders(content, 'names')
}

InnerGroups.prototype.independent = function(independent) {
  const { value, capital } = independent;
  const indep = {
    true: `This country is independent`,
    false: `This country isn't independent`,
  }
  const content = `${value}. A country is considered independent when it has sovereignty, which means that it has the power to rule itself without being subject to the authority of another country or external entity.
  ${indep[value]}`
  return renders(content, 'independent')

}
InnerGroups.prototype.region = function(region) {
  const { value, capital } = region;
  const content = `It belongs to a region of ${value}.`
  return renders(content, 'region')
}
InnerGroups.prototype.subregion = function(subregion) {
  const { value, capital } = subregion;
  return renders(value, 'subregion')
}
InnerGroups.prototype.latlng = function(latlng) {
  const { value, capital } = latlng;
  return renders(value, 'latitude and longitude')
}
InnerGroups.prototype.landlocked = function(landlocked) {
  const { value, capital } = landlocked;
  return renders(value, 'landlocked or borderd')
}

InnerGroups.prototype.area = function(area) {
  const { value, capital } = area;
  return renders(value, 'The area in km squared')
}

InnerGroups.prototype.population = function(population) {
  const { value, capital } = population;
  return renders(hp.formatNumber(value, ','), 'population of the country')
}

InnerGroups.prototype.tld = function(tld) {

  const { value, capital } = tld;
  const content = `The TLD or tld [${value}] is the country code top-level domain (ccTLD)`;
  return renders(content, 'Top Level Domain')
}

InnerGroups.prototype.idd = function(idd) {
  const { value, capital } = idd;
  return renders('nothing yet', 'idd')
}
InnerGroups.prototype.timezones = function(timezones) {
  const { value, capital } = timezones;
  let time = getCurrentTimeInTimeZone(value[0]);
  const content = `The current time is 
  ${time.both[12]}
  With the timezone of ${value[0]}`
  return renders(content, 'Timezone')
}
InnerGroups.prototype.cca2 = function(data) {
  return renderDiv()
}
InnerGroups.prototype.ccn3 = function(data) {
  return renderDiv()
}
InnerGroups.prototype.cca3 = function(data) {
  return renderDiv()
}
InnerGroups.prototype.status = function(data) {
  return renderDiv()
}
InnerGroups.prototype.unMember = function(unMember) {
  const { value, capital } = unMember;
  return renders(value, 'Member of United Nations')
}
InnerGroups.prototype.capital = function(capital) {
  const { value } = capital;
  return renders(value, 'Capital City')
}

InnerGroups.prototype.startOfWeek = function(startOfWeek) {
  const { value } = startOfWeek;
  return renders(value, 'Start of week')
}
InnerGroups.prototype.currencies = function(currencies) {
  const { value } = currencies;
  const content = `The currency is "${Object.keys(value)[0]}", which is called "${value[Object.keys(value)[0]].name}" and uses the [${value[Object.keys(value)[0]].symbol}] as the symbol`
  return renders(content, 'Currencies')
}
InnerGroups.prototype.languages = function(languages) {
  const { value } = languages;
  const keys = Object.keys(value)
  return renders(hp.getString(value), 'Languages')
}
InnerGroups.prototype.demonyms = function(demonyms) {
  const { value } = demonyms;
  return renders(value, 'Demonyms')
}
InnerGroups.prototype.translations = function(translations) {
  const { value } = translations;
  return renders(value, 'Translations')
}

InnerGroups.prototype.maps = function(maps) {
  const { value } = maps;
  return renders(value, 'Maps')
}
InnerGroups.prototype.car = function(car) {
  const { value } = car;
  return renders(value, 'Car')
}
InnerGroups.prototype.continents = function(continents) {
  const { value } = continents;
  return renders(value, 'Continents')
}
InnerGroups.prototype.flags = function(flags) {
  const { value } = flags;
  return renders(value, 'Flags')
}
InnerGroups.prototype.coatOfArms = function(coatOfArms) {
  const { value } = coatOfArms;
  return renders(value, 'Coat of arms')
}
InnerGroups.prototype.capitalInfo = function(capitalInfo) {
  const { value } = capitalInfo;
  return renders(value, 'Capital info')
}

function getCurrentTimeInTimeZone(timezone) {
  let offset = parseInt(timezone.replace("UTC", ""));
  let currentTime = new Date();
  let utcOffset = currentTime.getTimezoneOffset();
  let adjustedTime = new Date(currentTime.getTime() + (offset * 60 + utcOffset) * 60 * 1000);

  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };
  let formattedTime12 = adjustedTime.toLocaleString('en-US', options);

  options.hour12 = false;
  let formattedTime24 = adjustedTime.toLocaleString('en-US', options);

  let output = {
    day: adjustedTime.toLocaleDateString('en-US', { weekday: 'long' }),
    month: adjustedTime.toLocaleDateString('en-US', { month: 'long' }),
    date: adjustedTime.getDate(),
    year: adjustedTime.getFullYear(),
    hr: {
      '12': adjustedTime.getHours() % 12 || 12, // get hours in 12-hour format
      '24': adjustedTime.getHours() // get hours in 24-hour format
    },
    min: adjustedTime.getMinutes(),
    sec: adjustedTime.getSeconds(),
    both: {
      '12': formattedTime12,
      '24': formattedTime24
    }
  };


  return output;
}
