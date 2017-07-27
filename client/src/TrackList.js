/**
 * webGPSmap
 * Webentwicklung Hausarbeit Gruppenarbeit Gruppe 1
 *
 * Webclient
 *
 * Created by Dominik Wirtz & Philipp Dippel
 */
let $ = require("jquery");

module.exports = class TrackList {
	constructor(map, elevation)	{
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
		this.mobileMenu = $("#toggleButton");
		this.trackInfoContainer = $("#list");

		this.loadTrackListFromAPI(); //Loads all Track Names from REST API / Main entry Point

		this.nextButton.bind("click", () => {
			this.nextPage();
		});
		this.prevButton.bind("click", () => {
			this.prevPage();
		});
		this.prevButton.prop("disabled", true);

		this.mobileMenu.click(() =>	{
			console.log("Test");
			if (this.trackInfoContainer.css("display") === "none")		{
				console.log("grid");
				this.trackInfoContainer.css("display", "grid");
				this.update();
			}
			else			{
				console.log("none");
				this.trackInfoContainer.css("display", "none");
			}
		});

		/**
		 * On Windows Resize: caculate track list new.
		 */
		$(window).resize(() => {
			if ($(window).width() >= 600)			{
				this.trackInfoContainer.css("display", "grid");
			}
			this.update();
		});
	}

	update()	{
		this.calcItems();
		this.calcActivePage();
		if (this.page !== this.activeItemPage)			{
			this.page = this.activeItemPage;
		}
		this.addElementsToList();
	}

	/**
	 * If an selected entry exist on resize of Window -> Calculate and save the new page on which the selected item exist.
	 */
	calcActivePage()	{
		if (this.activeItem !== -1)		{
			this.activeItemPage = Math.floor(this.activeItem / this.maxItemsPossible);
		}
	}

	/**
	 * Main calculation for max. displayable List Items and for the pagination
	 */
	calcItems()	{
		this.maxItemsPossible = (Math.floor(this.itemsContainer.height() / 42));
		this.startItem = this.page * this.maxItemsPossible;
		if (this.startItem + this.maxItemsPossible <= this.lastItem)		{
			this.endItem = this.startItem + this.maxItemsPossible;
		}
		else		{
			this.endItem = this.lastItem;
		}

		this.maxPages = Math.ceil(this.lastItem / this.maxItemsPossible);

		if (this.page + 1 > this.maxPages)		{
			this.page = this.maxPages - 1;
		}

		this.pageIndex.text((this.page + 1) + "/" + (this.maxPages));
	}

	/**
	 * Main Function for adding Items to list HTML element.
	 */
	addElementsToList()	{
		this.calcItems(); //First calculate max displayable Items and pagination.
		$("li").remove(); //Remove all existing List-Items
		/**
		 * Add all new List Items and bind click event handler for selecting a track.
		 */
		for (let i = this.startItem; i < this.endItem; i++)		{
			this.itemsContainer.append("<li id='Item" + i + "' class='listItem'><p>" + this.tracksArray[i].name + "</p></li>");
			let item = $("#Item" + i);
			item.bind("click", () => {
				$("li").removeClass("activeTrack"); //Remove "active element" class on all list elements if new Element is selected.
				item.addClass("activeTrack");
				this.mymap.showTrackOnMap(this.tracksUrl + (i + 1));
				this.activeItem = i;
				this.elevation.draw(this.tracksUrl + (i + 1));
			});
			if (i === this.activeItem)			{
				item.addClass("activeTrack"); //Add "active track" class again if function is invoked by window resize
			}
		}
		if ($("li").length < this.maxItemsPossible)		{
			let index = this.maxItemsPossible - $("li").length;
			for (let i = 0; i < index; i++)			{
				this.itemsContainer.append("<li class='listItem spacerelement'><p> &nbsp; </p></li>"); //Add spacer item on last Page.
			}
		}

		this.checkButtons();
	}

	//Loads List of Aviable Tracks from REST API (main root of API)
	loadTrackListFromAPI()	{
		$.get("/tracks", (data) => {
			if (data.list instanceof Array)			{
				this.tracksArray = data.list;
				this.lastItem = data.list.length;
				this.tracksUrl = data.tracks.href; //Hand over URL for all individual list entries specified by the API.
			}
			this.addElementsToList();
		});
	}

	//Check if page before / afterwards exits and enable/disable buttons for pagination.
	checkButtons()	{
		this.prevButton.prop("disabled", false);
		this.nextButton.prop("disabled", false);

		if (this.page === 0)		{
			{
				this.prevButton.prop("disabled", true);
			}
		}

		if (this.page + 1 === this.maxPages)		{
			this.nextButton.prop("disabled", true);
		}
	}

	nextPage()	{
		if (this.page < this.maxPages)		{
			this.page += 1;
			this.calcItems();
			this.addElementsToList();
		}
		this.checkButtons();
	}

	prevPage()	{
		if (this.page !== 0)		{
			this.page -= 1;
			this.calcItems();
			this.addElementsToList();
		}

		this.checkButtons();
	}

};

