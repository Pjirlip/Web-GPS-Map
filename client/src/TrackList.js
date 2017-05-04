/**
 * Created by Philipp on 28.04.17.
 */
let $ = require("jquery");

module.exports = class TrackList {
	constructor(map) {
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
		console.log(this.mymap);

		this.loadTrackListFromAPI();
		this.calcItems();

		this.nextButton.bind("click", () => {
			this.nextPage();
		});
		this.prevButton.bind("click", () => {
			this.prevPage();
		});
		this.prevButton.prop("disabled", true);

		$(window).resize(() => {
			this.addElementsToList();
		});
	}

	calcItems() {
		this.maxItemsPossible = (Math.floor(this.itemsContainer.height() / 35));
		this.startItem = this.page * this.maxItemsPossible;
		if (this.startItem + this.maxItemsPossible <= this.lastItem) {
			this.endItem = this.startItem + this.maxItemsPossible;
		}
		else {
			this.endItem = this.lastItem;
		}

		this.maxPages = Math.ceil(this.lastItem / this.maxItemsPossible);
		this.pageIndex.text((this.page + 1 ) + "/" + (this.maxPages));
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
				console.log(i);
				this.mymap.showTrackOnMap("http://localhost:8080/tracks/" + (i + 1));
			});
			item.css("opacity", "0.2");
		}
		if ($("li").length < this.maxItemsPossible)			{

			this.itemsContainer.append("<li class='listItem' id='spacer'> </li>");
		}

		this.showAll();
		this.checkButtons();
	}
	//Läd die Daten und Ruft Add Element für alle Listenelemente auf
	loadTrackListFromAPI() {
		$.get("http://localhost:8080/tracks", (data) => {
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

		if (this.page +1 === this.maxPages) {
			this.nextButton.prop("disabled", true);
		}
	}

	nextPage() {
		console.log(this);
		if (this.page < this.maxPages) {
			this.page += 1;
			this.calcItems();
			this.addElementsToList();
		}
		this.checkButtons();
	}

	prevPage() {
		console.log(this.page);
		if (this.page !== 0) {
			this.page -= 1;
			this.calcItems();
			this.addElementsToList();
		}

		this.checkButtons();
	}

	//Blendet alle ListenElemente ein. Ohne Aus und Einblenden Flickert die Liste beim neuladen.
	showAll() {
		$("li").css("opacity", "1");
	}

};

