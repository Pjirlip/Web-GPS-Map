/**
 * Created by Philipp on 28.04.17.
 */

const Map = require("./Map");
const TrackList = require("./TrackList");
const Elevation = require("./Elevation");

let myMap = new Map();
var canvas = document.getElementById("elevation");
var ctx = canvas.getContext("2d");
let elevation = new Elevation(canvas, ctx);
let tracklist = new TrackList(myMap, elevation);

