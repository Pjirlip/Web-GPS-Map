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
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.calcHeight(this.heights[0]));

			for (let i = 1; i < this.canvas.width; i++) {
				this.ctx.lineTo(i, this.calcHeight(this.heights[Math.floor(i * this.maxPoints / this.canvas.width)]));
			}
			this.ctx.moveTo(0, this.calcHeight(this.heights[0]));
			this.ctx.closePath();
			this.ctx.stroke();
		});
	}

	calcHeight(pHeight)	{
		return this.canvas.height - ((pHeight - this.minHeight) / (this.maxHeight - this.minHeight) * this.canvas.height);
	}

};
