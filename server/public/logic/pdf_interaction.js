function addAClickable(parentId, elementId, top_pos, left_pos, height, width) {
    // get the click position: 
    var parent = document.getElementById(parentId);
    var newElement = document.createElement("div");
    newElement.className = "clickable";
    newElement.id = "sub" + elementId;
    newElement.style.cssText = "height:" + height + "px; width:" + width + "px;" +
    "top:" + top_pos + "px; left:" + left_pos + "px;";
    newElement.onclick = function (e) { getClickPos(e, elementId)};
    parent.appendChild(newElement);
}

function getClickPos (e, id) {
    var mp3 = document.getElementById('audio');
    mp3.currentTime = (id) * (mp3.duration / 12);
    mp3.play();
    //console.log(id);
    //console.log(e.offsetX, e.offsetY);
}


// TODO: hardcoded for now
pos_x = 0;
pos_y = 0;
for (var i = 0; i < 12; i ++) {
    if (i % 4 == 0) {
        pos_x += 200;
        pos_y = 0;
    }
    addAClickable('music_score', i, pos_x, pos_y + i % 4 * 200, 200, 200);
}
