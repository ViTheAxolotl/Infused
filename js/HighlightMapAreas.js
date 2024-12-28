/*
Highlight map areas as translucent colored blocks. red = circle area, green = poly area, blue = rect area.
Highlight elements have:
- `data-map-name` attribute to indicate the name of the map element.
- `data-area-index` attribute to indicate the zero based index of the area element within map element.
Inspect the highlight element to see the attributes.
*/
(() => {
  document.querySelectorAll(`img[usemap^="#"]`).forEach(img => {
    let mapName = img.useMap.substr(1), map;
    if (!(map = document.querySelector(`map${img.useMap},map[name="${mapName}"]`))) return;
    Array.from(map.areas).forEach((area, ai) => {
      let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;
      let coords = area.coords.split(",");
      for (let i = coords.length - 1; i >= 0; i--) {
        coords[i] = parseInt(coords[i]);
        if (i & 1) {
          if (coords[i] > ymax) {
            ymax = coords[i]
          } else if (coords[i] < ymin) ymin = coords[i];
        } else if (coords[i] > xmax) {
          xmax = coords[i]
        } else if (coords[i] < xmin) xmin = coords[i];
      }
      switch (area.shape) {
        case "circle":
          styles = `\
left:${xmin + img.offsetLeft}px;\
top:${ymin + img.offsetTop}px;\
width:${xmax - xmin}px;\
height:${ymax - ymin}px;\
background:red;`;
          break;
        case "poly":
          styles = `\
left:${xmin + img.offsetLeft}px;\
top:${ymin + img.offsetTop}px;\
width:${xmax - xmin}px;\
height:${ymax - ymin}px;\
background:green;`;
          break;
        case "rect":
          styles = `\
left:${coords[0] + img.offsetLeft}px;\
top:${coords[1] + img.offsetTop}px;\
width:${Math.abs(coords[0] - coords[2])}px;\
height:${Math.abs(coords[1] - coords[3])}px;\
background:blue;`;
          break;
        default:
          return;
      }
      let hilite = document.createElement("DIV");
      hilite.dataset.mapName = mapName;
      hilite.dataset.areaIndex = ai;
      hilite.style.cssText = `opacity:0.3;position:absolute;z-index:2;${styles}`;
      img.parentNode.insertBefore(hilite, img);
    });
  });
})();
