/**
 * Created by dominik.wirtz on 27.04.17.
 */

module.exports = class ListTracks {
    constructor(datafolder) {
        this.tracklist = {};
        this.trackobjects = {};
        this.datafolder = datafolder;

        const fs = require('fs');

        let files = (fs.readdir(this.datafolder, (err, files) => {
            let regex = new RegExp(".+\.json$");

            files.forEach(file => {
                if (file.match(regex)) {
                    let id = file.split(".",1).toString();

                    this.trackobjects[id] = JSON.parse(fs.readFileSync(this.datafolder + "/" + file));

                    this.tracklist[id] = this.trackobjects[id].features[0].properties.name;
                }
            });
        }));
    }
};
