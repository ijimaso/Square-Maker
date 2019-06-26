const defaultCenterPoint = [48.871605, 2.301888];

const map = L.map("mapid", {
    center: defaultCenterPoint,
    zoom: 15,
});

// 初期マーカー
// 初期指定矩形
let marker = L.marker([0, 0]);
let rectangle = L.rectangle([[0, 0], [1, 1]]);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
        foo: "bar",
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(map);

// 地図をクリックしたら，クリックした座標をマーカーで可視化
// 座標をフォームに挿入
map.on("click", (event) => {
    map.removeLayer(marker);
    const clickedCoordinate = [event.latlng.lat, event.latlng.lng];
    marker = L.marker(clickedCoordinate).addTo(map);
    document.getElementById("centerCoordinate").value = clickedCoordinate;
});

// 左下，右上の座標を計算
const calcCornerPoint = (centerCoordinate, distance, heading) => {
    const earchRadius = 6378150;
    const lat = centerCoordinate[0];
    const lng = centerCoordinate[1];

    // 移動した分の緯度の差分を計算
    const latDistance = distance * Math.cos(heading * Math.PI / 180);
    const earthCircle = 2 * Math.PI * earchRadius;
    const latPerMeter = 360 / earthCircle;
    const latDelta = latDistance * latPerMeter;

    const newLat = lat + latDelta;

    // 経度計算
    const lngDistance = distance * Math.sin(heading * Math.PI / 180);
    const earthRadiusAtLng = earchRadius * Math.cos(newLat * Math.PI / 180);
    const earthCircleAtLng = 2 * Math.PI * earthRadiusAtLng;
    const lngPerMeter = 360 / earthCircleAtLng;
    const lngDelta = lngDistance * lngPerMeter;
    const newLng = lng + lngDelta;

    const newCoordinate = [newLat, newLng];
    return newCoordinate;
};

document.getElementById("button").addEventListener("click", () => {
    map.removeLayer(rectangle);
    const centerCoordinate = document.getElementById("centerCoordinate").value.split(",").map((latlng) => Number(latlng));
    const lengthRect = Number(document.getElementById("lengthRect").value);
    const distance = (lengthRect / 2) * Math.sqrt(2);
    const lowLeftCoordinate = calcCornerPoint(centerCoordinate, distance, 225);
    const upRightCoordinate = calcCornerPoint(centerCoordinate, distance, 45);
    rectangle = L.rectangle([lowLeftCoordinate, upRightCoordinate]).addTo(map);
    document.getElementById("lowLeftCoordinate").textContent = `座標(lowLeft): ${lowLeftCoordinate}`;
    document.getElementById("upRightCoordinate").textContent = `座標(upRight): ${upRightCoordinate}`;
});