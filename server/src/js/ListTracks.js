/**
 * Created by dominik.wirtz on 27.04.17.
 */


class ListTracks {
    constructor(datafolder) {
        this.tracklist = [];
        this.trackobjects = [];
        this.datafolder = datafolder;

    readTrackList() {
        const fs = require('fs');

        var tmp = [];

        files = (fs.readdir(this.dataFolder, (err, files) => {

            var regex = new RegExp(".+\.json$");
            if (!files) {
                return;
            }
            files.forEach(file => {
                if (!file.match(regex)) {
                    return
                }

                var tmp = JSON.parse(fs.readFileSync(this.dataFolder + "/" + file)).features[0].properties.name;
                tmp.push(tmp);
            });
        }));
        this.trackobjects = tmp;
    }

}