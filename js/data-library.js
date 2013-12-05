window.randomEventsLibrary = {
  1: [{
    "type": "bonus",
    "range": "allPlanet",
    "resource": "a",
    "value": 10,
    "modifier": "%",
    "when": "direct",
    "wait": 2,
    "duration": 1
  },{
    "type": "malus",
    "range": "allOwnedPlanet",
    "resource": "d",
    "value": 3,
    "modifier": "abs",
    "when": "beforeNextTurn",
    "duration": 3
  }],
  2: [{
    "type": "looseStrongness",
    "range": "randomOwnedPlanet",
    "when": "afterNextTurn",
    "duration": 2
  }],
  3:[{
    "type": "malus",
    "range": "linkedToCurrentPlanet",
    "resource": "f",
    "value": 50,
    "modifier": "%",
    "when": "beforeInvade",
    "duration": 1
  }]
};
