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
		let page = 2;
		calcItems();
		loadTrackListFromAPI();

		$(document).ready(showAll);

		$(window).resize(function () {
			$("li").remove(); //Alle Elemente in der Liste entfernen
			calcItems();
			addElementsToList();
			clearTimeout(timeout);
			timeout = setTimeout(showAll, 100);
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
		}

		//Fügt Listenelemente in die UL ein und gibt jeder eine ID.
		function addElementsToList() {
			//Render First Block of Items
			for (let i = startItem; i < endItem; i++) {
				itemsContainer.append("<li id='Item" + i + "' class='listItem'><p>" + tracksArray[i].name + "</p></li>");
				let item = $("#Item" + i);
				item.bind("click", function () {
					console.log("Track wird geladen, von: " + item);
				});
				item.css("opacity", "0.2");
			}
		}
		//Läd die Daten und Ruft Add Element für alle Listenelemente auf
		function loadTrackListFromAPI() {
			$.get("http://localhost:8080/tracks", function (data) {
				if (data instanceof Array) {
					tracksArray = data;
					lastItem = data.length;
				}
				calcItems();
				addElementsToList();
			});
		}

		function nextPage() {
			page += 1;
			calcItems();
			addElementsToList();
		}
		//Blendet alle ListenElemente ein. Ohne Aus und Einblenden Flickert die Liste beim neuladen.
		function showAll() {
			$("li").css("opacity", "1");
		}
	}

};

