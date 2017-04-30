/**
 * Created by Philipp on 28.04.17.
 */
let $ = require("jquery");

module.exports = class Client {
	constructor() {
		const itemsContainer = $("#listItemsContainer");
		let maxItemsPossible = (Math.floor(itemsContainer.height() / 35));
		let start = 0;
		let end = maxItemsPossible;
		let id = 0;
		let timeout;

		loadTableOfContent();

		$(document).ready(showAll);

		$(window).resize(function () {
			id = 0;
			$("li").remove(); //Alle Elemente in der Liste entfernen
			maxItemsPossible = (Math.floor(itemsContainer.height() / 35)); //Die Maximale Anzahl an möglichen Listenelementen berechnen
			end = maxItemsPossible;
			loadTableOfContent();
			clearTimeout(timeout);
			timeout = setTimeout(showAll, 300);
		});
		//Fügt Listenelemente in die UL ein und gibt jeder eine ID.
		function addElement(element) {
			itemsContainer.append("<li id='Item" + id + "' class='listItem'>" + element + "</li>");
			let item = $("#Item" + id);
			item.bind("click", function () {
				console.log("Track wird geladen, von: " + item);
			});
			item.css("opacity", "0");
			id++;
		}
		//Läd die Daten und Ruft Add Element für alle Listenelemente auf
		function loadTableOfContent() {
			$.get("http://localhost:8080/tracks", function (data) {
				if (data instanceof Array) {
					const countTracks = data.length;
                    //Render First Block of Items
					for (let i = start; i < end; i++) {
						addElement(data[i].name);
					}
				}
			});
		}
		//Blendet alle ListenElemente ein. Ohne Aus und Einblenden Flickert die Liste beim neuladen.
		function showAll() {
			$("*").css("opacity", "1");
		}
	}

};

