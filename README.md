Resemblance
============
This package contains functions to get the percentage of resemblance (likeness, similarity) between two strings or two objects.

The algorithm used is actually quite simple : it does a case-insensitive **levenshtein distance**, and also ignores non-alphanumerical characters (such as spaces, dashes, dots, etc).

> Quick jump to examples :

> [Simple string resemblance](#ex1)

> [Object resemblance](#ex2)

> [Get similar objects from a set](#ex3)

## How to use ?
The package contains 3 functions :
```js
var resemblance = require('resemblance');
// this modules has 3 functions :
// resemblance.compareStrings(a, b)
// resemblance.compareObjects(a, b, weights)
// resemblance.getSimilar(obj, set, threshold, weights)
```

## Examples
#### <a name="ex1"></a>Simple string comparison (percentage of resemblance)
```js
// the following two strings are a perfect match
// 100% resemblance :
resemblance.compareStrings('Saint-Étienne', 'SAINT ETIENNE');
```
```js
// 90% resemblance :
resemblance.compareStrings('0123456789', '123456789');
```
```js
// 50% resemblance :
resemblance.compareStrings('abc def', 'abc xyz');
```
```js
// 0% resemblance :
resemblance.compareStrings('Hello World', '');
```

#### <a name="ex2"></a>Object comparison (percentage of resemblance)
```js
// 100% resemblance :
var a = { name: 'David' };
var b = { name: 'David' };
var weights = { name: 100 };
resemblance.compareObjects(a, b, weights);
```
```js
// 67% resemblance :
resemblance.compareObjects(
  { a: 'a', b: 'b', c: 'c' },
  { a: 'a', b: 'c', c: 'b' },
  { a: 67, b: 33, c: 0 }
);
// a is 100% similar,
// b is 100% different,
// c does not matter (weight = 0)
```

#### <a name="ex3"></a>Get similar objects from a set
In this example, we would like to find similar `address` objects. the `set` parameter can be fetched from a database, for example.
```js
// object to compare
var address = {
  num: '17',
  way: 'Boulevard Antoine de Saint-Exupéry',
  zip: '69009',
  city: 'Lyon',
  country: 'France'
};

// object set
var addresses = [
  {
    num: '17',
    way: 'BOULEVARD SAINT EXUPERY',
    zip: '69009',
    city: 'LYON',
    country: 'FR',
    geoloc: {
      lat: 45,
      lon: 119
    }
  },
  {
    num: '17',
    way: 'Rue Antoine de Saint-Exupéry',
    zip: '69140',
    city: 'Rillieux-la-Pape',
    country: 'France'
  }
];

// weights of each properties
// note that property names can be deeper than one
// level for example, we could put some weight on
// the 'geoloc.lat' property
var weights = {
  num: 20,
  way: 35,
  zip: 15,
  city: 20,
  country: 10,
  geoloc: 0
};

// get addresses that are more than 50% similar
resemblance.getSimilar(obj, set, weights, 0.5)

// returns :
[
  {
    resemblance: 0.8283333333333333,
    obj: {
      num: '17',
      way: 'BOULEVARD SAINT EXUPERY',
      zip: '69009',
      city: 'LYON',
      country: 'FR',
      geoloc: {
        lat: 45,
        lon: 119
      }
    }
  },
  {
    resemblance: 0.6426190476190476,
    obj: {
      num: '17',
      way: 'Rue Antoine de Saint-Exupéry',
      zip: '69140',
      city: 'Rillieux-la-Pape',
      country: 'France'
    }
  }
]
```
