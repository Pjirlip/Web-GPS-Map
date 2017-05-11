/**
 * Created by Philipp on 28.04.17.
 */

const Map = require("./Map");
const TrackList = require("./TrackList");
const Elevation = require("./Elevation");

let myMap = new Map();
let elevation = new Elevation();
let tracklist = new TrackList(myMap, elevation);

