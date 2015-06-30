'use strict';

var stripDiacritics = require('diacritics').remove;
var levenshtein = require('fast-levenshtein').get;
var _ = require('lodash');

exports.getSimilar = getSimilar;
exports.compareObjects = compareObjects;
exports.compareStrings = compareStrings;

function getSimilar (obj, set, weights, threshold) {
  var similar = [];
  threshold = threshold || -1;
  _.forEach(set, function forEach (setObj) {
    var resemblance = compareObjects(obj, setObj, weights);
    if (resemblance > threshold) {
      similar.push({
        resemblance: resemblance,
        obj: _.cloneDeep(setObj)
      });
    }
  });

  // sort results so that best match is result[0]
  return similar.sort(function descendingResemblance (a, b) {
    return b.resemblance - a.resemblance;
  });
}

function compareStrings (a, b) {
  // test falsy values
  a = a || '';
  b = b || '';

  // to string
  a = JSON.stringify(a);
  b = JSON.stringify(b);

  // unify case
  a = a.toLowerCase();
  b = b.toLowerCase();

  // remove diacritics
  a = stripDiacritics(a);
  b = stripDiacritics(b);

  // remove non alphanumerical characters
  a = a.replace(/[^\w]+/g, '');
  b = b.replace(/[^\w]+/g, '');

  // likeness
  return 1 - (levenshtein(a, b) / Math.max(Math.max(a.length, b.length), 1));
}

function compareObjects (a, b, weights) {
  var resemblance = 0;
  var totalWeight = 0;
  var propWeight, aPropValue, bPropValue;

  _.forOwn(weights, function forOwn (weight, key) {
    propWeight = _.isNumber(weight) ? weight : 0;

    aPropValue = _.has(a, key) ? _.get(a, key) : '';
    bPropValue = _.has(b, key) ? _.get(b, key) : '';

    resemblance += compareStrings(aPropValue, bPropValue) * propWeight;
    totalWeight += propWeight;
  });

  if (totalWeight === 0) {
    return 1;
  }
  return resemblance / totalWeight;
}
