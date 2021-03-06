const _ = require('lodash')

const check = (string) => {
  const regex = /\{{([^}]+)\}}/g

  const iterator = string.matchAll(regex)

  const results = []

  for (let match of iterator) results.push(match[1])

  return results
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const replace = (string, replacers) => {
  const matches = check(string)

  if (matches.length === 0) return string

  const stringWithVars = matches.reduce(
    (r, match) => {
      const [key, defaultVal] = match.split('|')
      const val = _.get(replacers, key) || defaultVal
      return replacers && val ? r.replace(new RegExp(`{{${escapeRegExp(match)}}}`, 'g'), val) : r
    },
    string
  )

  const stringWithVarsAndDeletedBrackets = matches.reduce(
    (r, key) => r.replace(new RegExp(`{{${key}}}`, 'g'), ''),
    stringWithVars
  )

  return stringWithVarsAndDeletedBrackets
}

const getValuesFromItem = (stringWithPossibleVars, item) => {
  const varNames = check(stringWithPossibleVars)

  if (varNames.length === 0) return item[stringWithPossibleVars]

  const replacer = varNames.reduce(
    (r, varName) => ({ ...r, [varName]: item[varName] }),
    {}
  )

  return replace(stringWithPossibleVars, replacer)
}

module.exports = {
  check,
  replace,
  getValuesFromItem,
}