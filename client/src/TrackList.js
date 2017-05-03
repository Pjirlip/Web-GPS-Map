/**
 * Created by Philipp on 28.04.17.
 */
let $ = require("jquery");

module.exports = class TrackList {
	constructor() {
		let tracksArray = null;
		const itemsContainer = $("#listItemsContainer");
		let maxItemsPossible = 0;
		let startItem = 0;
		let endItem = 0;
		let lastItem = 0;
		let timeout;
		let page = 0;
		let maxPages = 0;
		let pageIndex = $("#Pageindex");
		let nextButton = $("#buttonNext");
		let prevButton = $("#buttonBack");

		loadTrackListFromAPI();

		nextButton.bind("click", nextPage);
		prevButton.bind("click", prevPage);
		prevButton.prop("disabled", true);

		$(window).resize(function () {
			addElementsToList();
		});

		function calcItems() {
			maxItemsPossible = (Math.floor(itemsContainer.height() / 41));
			startItem = page * maxItemsPossible;
			if (startItem + maxItemsPossible <= lastItem) {
				endItem = startItem + maxItemsPossible;
			}
			else {
				endItem = lastItem;
			}

			maxPages = Math.floor(lastItem / maxItemsPossible);
			pageIndex.text((page + 1) + "/" + (maxPages + 1));
		}

		//Fügt Listenelemente in die UL ein und gibt jeder eine ID.
		function addElementsToList() {
			//Render First Block of Items
			calcItems();
			$("li").remove();
			for (let i = startItem; i < endItem; i++) {
				itemsContainer.append("<li id='Item" + i + "' class='listItem'><p>" + tracksArray[i].name + "</p></li>");
				let item = $("#Item" + i);
				item.bind("click", function () {
					console.log("Track wird geladen, von: " + item);
				});
				item.css("opacity", "0.2");
			}
			if($("li").length < maxItemsPossible)
			{
                itemsContainer.append("<li id='spacer'> </li>");
			}

			showAll();
			checkButtons();
		}
		//Läd die Daten und Ruft Add Element für alle Listenelemente auf
		function loadTrackListFromAPI() {
			$.get("http://localhost:8080/tracks", function (data) {
				if (data instanceof Array) {
					tracksArray = data;
					lastItem = data.length;
				}
				addElementsToList();
			});
		}

		function checkButtons() {
			prevButton.prop("disabled", false);
			nextButton.prop("disabled", false);

			if (page === 0) {
				{
					prevButton.prop("disabled", true);
				}
			}

			if (page === maxPages) {
				nextButton.prop("disabled", true);
			}
		}

		function nextPage() {
			if (page < maxPages) {
				page += 1;
				calcItems();
				addElementsToList();
			}
			checkButtons();
		}

		function prevPage() {
			if (page !== 0) {
				page -= 1;
				calcItems();
				addElementsToList();
			}

			checkButtons();
		}

		//Blendet alle ListenElemente ein. Ohne Aus und Einblenden Flickert die Liste beim neuladen.
		function showAll() {
			$("li").css("opacity", "1");
		}
	}

};

