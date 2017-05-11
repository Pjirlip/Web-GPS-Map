/**
 * Created by Philipp on 11.05.17.
 */
let $ = require("jquery");

module.exports = class Elevation {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.heights = [];
		this.maxHeight = -99999;
		this.minHeigth = 99999;
		this.maxPoints = 0;
		this.actualPoint = 0;
		console.log(this.ctx);
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
					if (coord[2] < this.minHeigth)				{
						this.minHeigth = coord[2];
					}

					this.maxPoints++;
				});

				resolve();
			});
		});

		this.promise.then(() =>		{
			this.actualPoint = 0;

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.calcHeight(this.heights[0]));

			this.heights.forEach((actualHeight) =>			{
				this.ctx.lineTo(Math.floor(this.actualPoint * this.canvas.width / this.maxPoints), this.calcHeight(actualHeight));
				this.actualPoint++;
			});
			this.ctx.moveTo(0, this.calcHeight(this.heights[0]));
			this.ctx.closePath();
			this.ctx.stroke();
			console.log("Punkte: " + this.maxPoints);
			console.log("max höhe: " + this.maxHeight);
			console.log("min höhe: " + this.minHeight);
		});
	}

	calcHeight(pHeight)	{
		return this.canvas.height - ((pHeight - this.minHeigth) / (this.maxHeight - this.minHeigth) * this.canvas.height);
	}

};
