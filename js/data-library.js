window.randomEventsLibrary = [
  {
    "id": 1,
    "events":[{
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
    }]
  },
  {
    "id": 2,
    "events":[{
      "type": "looseStrongness",
      "range": "randomOwnedPlanet",
      "when": "afterNextTurn",
      "duration": 2
    }]
  },
  {
    "id": 3,
    "events":[{
      "type": "malus",
      "range": "linkedToCurrentPlanet",
      "resource": "f",
      "value": 50,
      "modifier": "%",
      "when": "beforeInvade",
      "duration": 1
    }]
  }
];
