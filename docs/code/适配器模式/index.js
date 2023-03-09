const googleMap = {
  show() {
    console.log('show map');
  },
};

const baiduMap = {
  display() {
    console.log('display map');
  },
};

const baiduMapAdapter = {
  show() {
    return baiduMap.display();
  },
};

const renderMap = function (map) {
  if (map instanceof Function) {
    map.show();
  }
};

renderMap(googleMap);
renderMap(baiduMapAdapter);
