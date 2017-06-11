/**
 * webGPSmap
 * Webentwicklung Hausarbeit Gruppenarbeit Gruppe 1
 *
 * Webserver
 *
 * Created by Dominik Wirtz & Philipp Dippel
 */

module.exports = class ListTracks {
	constructor(datafolder) {
		this.tracklist = {};
		this.tracklist.tracks = { href: "/tracks/" };
		this.tracklist.list = [];
		this.trackobjects = {};
		this.datafolder = datafolder.toString();
		this.fs = require("fs");

        /**
         * Read data folder and generate list of files in var files
         */
		this.fs.readdir(this.datafolder, (err, files) => {
			if (files) {
				files.forEach(file => {
					let id = parseInt(file.split(".")[0]);
                    /**
                     * Read all files of list and parse Data to trackobjects
                     * fill tracklist with propertie name of JSON File
                     */
					this.fs.readFile(this.datafolder + "/" + file, (err, data) => {
						try {
							// Parse file to JSON Object and add to trackobject
							this.trackobjects[id] = JSON.parse(data);
							// add Entry to tracklist with name of Track from JSON Objekt
							this.tracklist.list.push({ id: id, name: this.trackobjects[id].features[0].properties.name });
							// Sortiere this.tracklist array nach id
							this.tracklist.list.sort((a, b) => { return a.id - b.id; });
						}
						catch (e) {
                            // Parsed file is no JSON
							console.info(`${file} is no JSON file`);
						}
					});
				});
			}
            // DataFolder is empty
			else {
				console.error("No Files to add!");
			}
		});
	}
};
