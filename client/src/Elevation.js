/**
 * Created by Philipp on 11.05.17.
 */
let $ = require("jquery");

module.exports = class Elevation {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.heights = [];
		this.maxHeight = 0;
		this.minHeigth = 10000000000;
		this.maxPoints = 0;
		this.actualPoint = 0;
	}

	draw(trackURL)	{
		this.promise = new Promise((resolve) => {
			this.heights = [];
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
			this.ctx.clearRect(0, 0, 400, 120);
			this.ctx.moveTo(0, this.calcHeight(this.heights[0]));

			this.heights.forEach((actualHeight) =>			{
				this.ctx.lineTo(this.actualPoint, this.calcHeight(actualHeight));
				this.actualPoint++;
			});
			this.ctx.stroke();
		});
	}

	calcHeight(pHeight)	{
		return (pHeight - this.minHeigth) / (this.maxHeight - this.minHeigth) * 120;
	}

};
