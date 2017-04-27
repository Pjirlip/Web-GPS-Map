/**
 * Created by dominik.wirtz on 27.04.17.
 */

module.exports = class ListTracks {
    constructor(datafolder) {
        this.tracklist = [];
        this.trackobjects = [];
        this.datafolder = datafolder;

        const fs = require('fs');

        let files = (fs.readdir(this.datafolder, (err, files) => {
            let regex = new RegExp(".+\.json$");
            if (!files) {
                return;
            }
            files.forEach(file => {
                if (!file.match(regex)) {
                    return
                }
                let id = file.split(".",1).toString();
                let name =  JSON.parse(fs.readFileSync("" + this.datafolder +"/" + file)).features[0].properties.name;

                let tmp = JSON.stringify({id, name});
                // ;

                this.tracklist.push(tmp);
                this.trackobjects.push(JSON.parse(fs.readFileSync("" + this.datafolder +"/" + file)));
            });
        }));
    }
};
