/**
 * Created by Philipp on 11.05.17.
 */
let $ = require("jquery");

module.exports = class Elevation {
	constructor() {
		this.canvas = document.getElementById("elevation");
		this.ctx = this.canvas.getContext("2d");
		this.heights = [];
		this.maxHeight = -99999;
		this.minHeigth = 99999;
		this.maxPoints = 0;
	}

	draw(trackURL)	{
		this.promise = new Promise((resolve) => {
			this.heights = [];
			this.maxPoints = 0;
			this.actualPoint = 0;
			this.maxHeight = -99999;
			this.minHeight = 99999;
			$.getJSON(trackURL, (data) => {
				data.features[0].geometry.coordinates.forEach((coord) => {
					this.heights.push(coord[2]);

					if (coord[2] > this.maxHeight)				{
						this.maxHeight = coord[2];
					}
					if (coord[2] < this.minHeight)				{
						this.minHeight = coord[2];
					}

					this.maxPoints++;
				});

				resolve();
			});
		});

		this.promise.then(() =>		{
			this.ctx.lineWidth = 1;
			this.ctx.lineCap = "round";
			this.ctx.lineJoin = "round";
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.canvas.height);

			var point = 0.0;
			this.heights.forEach((actualHeight) => {
				this.ctx.lineTo(point * this.canvas.width / this.maxPoints, this.calcHeight(this.heights[point]));
				point++;
			});

			this.ctx.lineTo(this.canvas.width, this.canvas.height);
			this.ctx.closePath();
			this.ctx.fill();
		});
	}

	calcHeight(pHeight)	{
		return this.canvas.height - ((pHeight - this.minHeight) / (this.maxHeight - this.minHeight) * this.canvas.height);
	}

};
