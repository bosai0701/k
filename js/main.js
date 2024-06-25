//difftimeは秒数を指定することで、差を足し引きできる
function GetyyyyMMddHHmmss(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();

    var month = (today.getMonth() + 1).toString();
    month = ("0" + month).slice(-2);

    var day = today.getDate().toString();
    day = ("0" + day).slice(-2);

    var hour = today.getHours().toString();
    hour = ("0" + hour).slice(-2);

    var minute = today.getMinutes().toString();
    minute = ("0" + minute).slice(-2);

    var second = today.getSeconds().toString()
    second = ("0" + second).slice(-2);

    return year + month + day + hour + minute + second;
}

function GetyyyyMMdd(difftime = 0) {
    var today = new Date();
    today.setSeconds(today.getSeconds() - difftime);

    var year = today.getFullYear().toString();

    var month = (today.getMonth() + 1).toString();
    month = ("0" + month).slice(-2);

    var day = today.getDate().toString();
    day = ("0" + day).slice(-2);

    var hour = today.getHours().toString();
    hour = ("0" + hour).slice(-2);

    var minute = today.getMinutes().toString();
    minute = ("0" + minute).slice(-2);

    var second = today.getSeconds().toString()
    second = ("0" + second).slice(-2);

    return year + month + day;
}

var map = L.map('map', {
    center: [34.9558, 139.8139],
    zoom: 9,
    zoomControl: false,
    maxZoom: 9,
    minZoom: 1,
});
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);

//p波マーカー初期化
var pwave = L.circle([0, 0], {
    radius: 0,
    color: 'blue',
    fillColor: '#399ade',
    fillOpacity: 0.5,
}).addTo(map);

//s波マーカー初期化
var swave = L.circle([0, 0], {
    radius: 0,
    color: '#dc143c',
    fillColor: '#dc143c',
    fillOpacity: 0.1,
}).addTo(map);


$(function () {
    $.when(
        //$.getJSON(`https://weather-kyoshin.west.edge.storage-yahoo.jp/RealTimeData/${GetyyyyMMdd()}/${GetyyyyMMddHHmmss()}.json?${new Date().getTime()}`)
        //　↑　リアルタイムで描画させる時はこのように記述するが、PC内の時間との差により取得できない場合があるため調節が必要である。
        $.getJSON(`https://weather-kyoshin.west.edge.storage-yahoo.jp/RealTimeData/20201216/20201216140000.json`)
        //20201216/20201216140000の部分はいずれ使えなくなるため自分で変更して確認すること。
　　　　//https://www.data.jma.go.jp/svd/eew/data/nc/fc_hist/index.htmlここから調べられる。
    ).done(function (yahoo_data) {
        //p波とs波のデータがあるかどうか
        if (yahoo_data.psWave === null)
　　　　 {
            //p波とs波がない場合は半径0mに設定して見えないようにする。
            swave.setRadius(0);
            pwave.setRadius(0);
            return;
        }
        //p波とs波のデータを取り出す。
        let p = yahoo_data.psWave.items[0].pRadius;
        let s = yahoo_data.psWave.items[0].sRadius;
        //このときのp波とs波の値の単位はkmなのでmに変換させる。
        p *= 1000;
        s *= 1000;

        //中心点(震源の緯度経度)を取り出す。
        let lat = yahoo_data.psWave.items[0].latitude.replace("N", "");
        let lng = yahoo_data.psWave.items[0].longitude.replace("E", "");
        let psCenter = new L.LatLng(lat, lng);

        //s波を更新
        swave.setLatLng(psCenter);
        swave.setRadius(s);
        //p波を更新
        pwave.setLatLng(psCenter);
        pwave.setRadius(p);
    }).fail(function () {
        console.log("error");
    })
});
