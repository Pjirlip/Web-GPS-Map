/**
 * Created by Philipp on 28.04.17.
 */
let $ = require("jquery");

module.exports = class TrackList {
	constructor(map, elevation) {
		this.tracksArray = null;
		this.itemsContainer = $("#listItemsContainer");
		this.maxItemsPossible = 0;
		this.startItem = 1;
		this.endItem = 0;
		this.lastItem = 0;
		this.page = 0;
		this.maxPages = 0;
		this.pageIndex = $("#Pageindex");
		this.nextButton = $("#buttonNext");
		this.prevButton = $("#buttonBack");
		this.mymap = map;
		this.activeItem = -1;
		this.activeItemPage = 0;
		this.elevation = elevation;

		this.loadTrackListFromAPI();

		this.nextButton.bind("click", () => {
			this.nextPage();
		});
		this.prevButton.bind("click", () => {
			this.prevPage();
		});
		this.prevButton.prop("disabled", true);

		$(window).resize(() => {
			this.calcItems();
			this.calcActivePage();
			if (this.page !== this.activeItemPage) {
				this.page = this.activeItemPage;
			}
			this.addElementsToList();
		});
	}

	calcActivePage()	{
		if (this.activeItem !== -1) {
			this.activeItemPage = Math.floor(this.activeItem / this.maxItemsPossible);
		}
	}

	calcItems() {
		this.maxItemsPossible = (Math.floor(this.itemsContainer.height() / 42));
		this.startItem = this.page * this.maxItemsPossible;
		if (this.startItem + this.maxItemsPossible <= this.lastItem) {
			this.endItem = this.startItem + this.maxItemsPossible;
		}
		else {
			this.endItem = this.lastItem;
		}

		this.maxPages = Math.ceil(this.lastItem / this.maxItemsPossible);

		if (this.page + 1 > this.maxPages)		{
			this.page = this.maxPages - 1;
		}

		this.pageIndex.text((this.page + 1) + "/" + (this.maxPages));
	}

	//Fügt Listenelemente in die UL ein und gibt jeder eine ID.
	addElementsToList() {
		//Render First Block of Items
		this.calcItems();
		$("li").remove();
		for (let i = this.startItem; i < this.endItem; i++) {
			this.itemsContainer.append("<li id='Item" + i + "' class='listItem'><p>" + this.tracksArray[i].name + "</p></li>");
			let item = $("#Item" + i);
			item.bind("click", () => {
				$("li").removeClass("activeTrack");
				item.addClass("activeTrack");
				this.mymap.showTrackOnMap("/tracks/" + (i + 1));
				this.activeItem = i;
				this.elevation.draw("/tracks/" + (i + 1));
			});
			if (i === this.activeItem) {
				item.addClass("activeTrack");
			}
		}
		if ($("li").length < this.maxItemsPossible)			{
			this.itemsContainer.append("<li class='listItem' id='spacer'> </li>");
		}

		this.checkButtons();
	}
	//Läd die Daten und Ruft Add Element für alle Listenelemente auf
	loadTrackListFromAPI() {
		$.get("/tracks", (data) => {
			if (data instanceof Array) {
				this.tracksArray = data;
				this.lastItem = data.length;
			}
			this.addElementsToList();
		});
	}

	checkButtons() {
		this.prevButton.prop("disabled", false);
		this.nextButton.prop("disabled", false);

		if (this.page === 0) {
			{
				this.prevButton.prop("disabled", true);
			}
		}

		if (this.page + 1 === this.maxPages) {
			this.nextButton.prop("disabled", true);
		}
	}

	nextPage() {
		if (this.page < this.maxPages) {
			this.page += 1;
			this.calcItems();
			this.addElementsToList();
		}
		this.checkButtons();
	}

	prevPage() {
		if (this.page !== 0) {
			this.page -= 1;
			this.calcItems();
			this.addElementsToList();
		}

		this.checkButtons();
	}

};

