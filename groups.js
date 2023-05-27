import { hp } from "./lib.js";
import { InnerGroups } from "./innerGroups.js";

const innerGroups = new InnerGroups()
export class Groups {
  constructor() {}
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
    text
  )
  return div
}

function renderGroups(receiver, group, admin = {}) {
  receiver.innerHTML = "";
  const groupNames = Object.keys(group)
  for (let name of groupNames) {
    const content = innerGroups[name]({
      value: group[name],
      capital: admin.capital[0],
    })
    const groupDiv = hp.setDom('div', {
      class: `subgroupDiv`,
    })
    groupDiv.appendChild(content)
    receiver.appendChild(groupDiv)
  }
}

function renderDiv(text, className) {
  const div = hp.setDom(
    'div',
    {
      class: `${className}`
    }
  )
  hp.setInnerText(
    div,
    hp.capitalizeWords(text)
  )
  return div
}

Groups.prototype.Geography = function(data) {
  const { receiver, group, name } = data;
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Communication = function(data) {
  const { receiver, group, name } = data;
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Identification = function(data) {
  const { receiver, group, name } = data
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Administration = function(data) {
  const { receiver, group, name } = data
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Currency = function(data) {
  const { receiver, group, name } = data
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Language = function(data) {
  const { receiver, group, name } = data
  renderGroups(receiver, group[name], group[`Administration`])
}
Groups.prototype.Miscellaneous = function(data) {
  const { receiver, group, name } = data
  renderGroups(receiver, group[name], group[`Administration`])
}
