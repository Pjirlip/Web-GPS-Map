/**
 * Created by dominik.wirtz on 27.04.17.
 */


class ListTracks {
    constructor() {
        this.tracklist = [];
        this.trackobjects = [];
    }

    readTrackList() {
        const fs = require('fs');
        var tmp = [];

        files = (fs.readdir(dataFolder, (err, files) => {

            var regex = new RegExp(".+\.json$");
            if (!files) {
                return;
            }
            files.forEach(file => {
                if (!file.match(regex)) {
                    return
                }

                var tmp = JSON.parse(fs.readFileSync(dataFolder + "/" + file)).features[0].properties.name;
                tmp.push(tmp);
            });
        }));
        this.trackobjects = tmp;
    }

}