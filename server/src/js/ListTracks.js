/**
 * Created by dominik.wirtz on 27.04.17.
 */

module.exports = class ListTracks {
    constructor(datafolder) {
        this.tracklist = {};
        this.trackobjects = {};
        this.datafolder = datafolder.toString();

        const fs = require('fs');
        let files = (fs.readdir(this.datafolder, (err, files) => {
            if (files){
                files.forEach(file => {

                    let id = file.split(".",1).toString();

                    fs.readFile(this.datafolder + "/" + file, (err, data) => {
                        try {
                            this.trackobjects[id] = JSON.parse(data);
                            this.tracklist[id] = this.trackobjects[id].features[0].properties.name;
                        }
                        catch(e) {
                            console.info(`${file} is no JSON file`);
                        }
                    });

                });
            } else {
                console.error(`No Files to add!`)
            }

        }));


    }
};
