/**
 * webGPSmap
 * Webentwicklung Hausarbeit Gruppenarbeit Gruppe 1
 *
 * Webclient
 *
 * Created by Dominik Wirtz & Philipp Dippel
 *
 *
 *
 *
 * Main Elevation-Map Class for Tracks.
 * Draw height information on Canvas for selected Track and also calculates:
 * - the max Height
 * - the min Height
 * - the distance traveled upwards
 * - the distance traveled downwards
 * - the absolute traveled distance
 */
let $ = require("jquery");

module.exports = class Elevation {
	constructor(map) {
		this.canvas = document.getElementById("elevation");
		this.ctx = this.canvas.getContext("2d");
		this.selection = false;
		this.getSize();
		this.heights = [];
		this.maxHeight = -99999;
		this.minHeight = 99999;
		this.maxPoints = 0;
		this.meterRauf = 0;
		this.meterRunter = 0;
		this.lastheight = -99999;
		this.mymap = map;
		this.distance = 0.0;
		this.latlongOld = null;
		this.latLongNew = null;
		this.markerGroup = this.mymap.leaflet.layerGroup();

		this.redMarker = new this.mymap.leaflet.Icon({
			iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
			shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		this.greenMarker = new this.mymap.leaflet.Icon({
			iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
			shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

        //Redraw Canvas if size of Window changed
		$(window).resize(() =>		{
			this.getSize();
		});
	}

	/**
	 * Main Function for drawing the Canvas. Loads the selected track information from REST API and calculates track metrics.
	 */
	draw(trackURL)	{
		this.promise = new Promise((resolve) => {
			this.heights = [];
			this.maxPoints = 0;
			this.maxHeight = -99999;
			this.minHeight = 99999;
			this.lastheight = -99999;
			this.meterRauf = 0;
			this.meterRunter = 0;
			this.latlongOld = null;
			this.latLongNew = null;
			this.distance = 0.0;
			this.getSize();
			$.getJSON(trackURL, (data) => {
				data.features[0].geometry.coordinates.forEach((coord) => {
					this.heights.push(coord[2]);
					this.calcRaufRunter(coord[2]);
					this.setMinMax(coord[2]);
					this.calcDistance(coord[1], coord[0]);
					this.maxPoints++;
				});
				this.maxPoints--;

				this.markerGroup.clearLayers();
				let start = this.mymap.leaflet.marker([data.features[0].geometry.coordinates[0][1], data.features[0].geometry.coordinates[0][0]], { icon: this.greenMarker }).bindPopup("Start of Track");
				let end = this.mymap.leaflet.marker([data.features[0].geometry.coordinates[this.maxPoints][1], data.features[0].geometry.coordinates[this.maxPoints][0]], { icon: this.redMarker }).bindPopup("End of Track");

				this.markerGroup = this.mymap.leaflet.layerGroup([start, end]).addTo(this.mymap.map);

				resolve();
			});
		});

		this.promise.then(() =>		{
			this.selection = true;
			this.drawPoints();

			$("#downHill").text("Bergab: " + Math.ceil(this.meterRunter) + " m");
			$("#upHill").text("Bergauf: " + Math.ceil(this.meterRauf) + " m");
			$("#maxHeight").text("Maximale Höhe: " + Math.ceil(this.maxHeight) + " m");
			$("#minHeight").text("Minimale Höhe: " + Math.floor(this.minHeight) + " m");
			$("#trackDistance").text("Strecke: " + Math.ceil(this.distance) + " m");
		});
	}

	//Draws complete Path with all point pnformations.
	drawPoints()	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.canvas.height);

		let point = 0.0;
		this.heights.forEach(() => {
			this.ctx.lineTo(point * this.canvas.width / this.maxPoints, this.calcHeight(this.heights[point]));
			point++;
		});

		this.ctx.lineTo(this.canvas.width, this.canvas.height);
		this.ctx.closePath();
		this.ctx.fill();
	}

	//Calculate drawing-height for point depending on size of the canvas
	calcHeight(pHeight)	{
		return this.canvas.height - ((pHeight - this.minHeight) / (this.maxHeight - this.minHeight) * this.canvas.height);
	}

	//Calculates Information for traveled distance upwards and downwards
	calcRaufRunter(hight) {
		if (this.lastheight === -99999) {
			this.lastheight = hight;
		}
		else if (hight > this.lastheight) {
			this.meterRauf += hight - this.lastheight;
			this.lastheight = hight;
		}
		else if (hight < this.lastheight) {
			this.meterRunter += this.lastheight - hight;
			this.lastheight = hight;
		}
	}

	//Saves min and max Height of selected Track
	setMinMax(minmaxHoehe) {
		if (minmaxHoehe > this.maxHeight)				{
			this.maxHeight = minmaxHoehe;
		}
		if (minmaxHoehe < this.minHeight)				{
			this.minHeight = minmaxHoehe;
		}
	}

	//Function for calculating the traveled distance
	calcDistance(lat, long)	{
		if (this.latlongOld === null)		{
			this.latlongOld = this.mymap.leaflet.latLng(lat, long);
			this.latLongNew = this.mymap.leaflet.latLng(lat, long);
		}
		else			{
			this.latLongNew = this.mymap.leaflet.latLng(lat, long);
			this.distance = this.distance + this.latlongOld.distanceTo(this.latLongNew);
			this.latlongOld = this.latLongNew;
		}
	}

	//Get container size of the canvas element and set the size of the canvas itself
	getSize()	{
		let parent = $("#canvasContainer");
		this.canvas.width = parent.width() * 2;
		this.canvas.height = (parent.height() + 5) * 2;

		if (this.selection !== false)		{
			this.drawPoints();
		}
	}

};
