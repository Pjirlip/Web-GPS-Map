/**
 * Created by Philipp on 28.04.17.
 */
let $ = require("jquery");
const Map = require("./Map");
const TrackList = require("./TrackList");
const Elevation = require("./Elevation");

$(document).ready(()=>{
	let myMap = new Map();
	let elevation = new Elevation(myMap);
	let tracklist = new TrackList(myMap, elevation);
});
