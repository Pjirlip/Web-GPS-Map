/**
 * Created by Philipp on 28.04.17.
 */

module.exports = (function ()
{
    let map = leaflet.map("map").setView([49.76425, 6.64039], 13);

    leaflet.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 17
    }).addTo(map);

});

