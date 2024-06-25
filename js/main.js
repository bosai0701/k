function GetyyyyMMddHHmmss(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);
    var hour = ("0" + today.getHours()).slice(-2);
    var minute = ("0" + today.getMinutes()).slice(-2);
    var second = ("0" + today.getSeconds()).slice(-2);

    return year + month + day + hour + minute + second;
}

function GetyyyyMMdd(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);

    return year + month + day;
}

function getIntensityColor(intensity) {
    if (intensity >= 7) return '#920000';
    if (intensity >= 6.5) return '#ea0012';
    if (intensity >= 6) return '#ff2e00';
    if (intensity >= 5.5) return '#ff7800';
    if (intensity >= 5) return '#ffb400';
    if (intensity >= 4) return '#ffda88';
    if (intensity >= 3) return '#00abef';
    if (intensity >= 2) return '#73c4e8';
    return '#b5d4e8';
}

var map = L.map('map', {
    center: [34.9558, 139.8139],
    zoom: 9,
    zoomControl: false,
    maxZoom: 9,
    minZoom: 1,
});
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

var pwave = L.circle([0, 0], {
    radius: 0,
    color: 'blue',
    fillColor: '#399ade',
    fillOpacity: 0.5,
}).addTo(map);

var swave = L.circle([0, 0], {
    radius: 0,
    color: '#dc143c',
    fillColor: '#dc143c',
    fillOpacity: 0.1,
}).addTo(map);

var epicenter = L.marker([0, 0]).addTo(map);

$(function () {
    function updateEarthquakeData() {
        var currentTime = new Date().getTime();
        var requestTime = GetyyyyMMddHHmmss(0);

        $.getJSON(`https://weather-kyoshin.west.edge.storage-yahoo.jp/RealTimeData/${GetyyyyMMdd()}/${requestTime}.json?${currentTime}`)
            .done(function (yahoo_data) {
                if (yahoo_data.psWave === null) {
                    swave.setRadius(0);
                    pwave.setRadius(0);
                    epicenter.setLatLng([0, 0]);
                    return;
                }

                let p = yahoo_data.psWave.items[0].pRadius * 1000;
                let s = yahoo_data.psWave.items[0].sRadius * 1000;

                let lat = parseFloat(yahoo_data.psWave.items[0].latitude.replace("N", ""));
                let lng = parseFloat(yahoo_data.psWave.items[0].longitude.replace("E", ""));
                let psCenter = new L.LatLng(lat, lng);

                swave.setLatLng(psCenter);
                swave.setRadius(s);
                pwave.setLatLng(psCenter);
                pwave.setRadius(p);
                epicenter.setLatLng(psCenter);

                let intensity = yahoo_data.psWave.items[0].intensity;
                let color = getIntensityColor(intensity);

                pwave.setStyle({ color: color, fillColor: color });
                swave.setStyle({ color: color, fillColor: color });
            })
            .fail(function () {
                console.log("error");
            });
    }

    setInterval(updateEarthquakeData, 1000); // 1秒ごとに更新
    updateEarthquakeData(); // 初回の更新
});
