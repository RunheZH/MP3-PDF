num_clickables = 0

function addAMeasure() {
    addAJQResizable('measures', num_clickables);
    num_clickables += 1;
}

function removeAMeasure() {
    if (num_clickables > 0) {
        num_clickables -= 1;
        var element = document.getElementById("measure" + num_clickables);
        document.getElementById('measures').removeChild(element);
    }
}

function addAJQResizable(parentId, elementId) {
    var parent = document.getElementById(parentId);
    var newElement = document.createElement("div");
    newElement.className = "draggable";
    newElement.id = "measure" + elementId;
    parent.appendChild(newElement);

    $(function () {
        $(".draggable").draggable();
        $(".draggable").resizable();
    });
}

function confirmMeasuresPos () {
    $(function () {
        $(".draggable").draggable('disable');
        $(".draggable").resizable('disable');
    });
}

function editMeasuresPos() {
    $(function () {
        $(".draggable").draggable('enable');
        $(".draggable").resizable('enable');
    });
}

function goToLearning() {
    confirmMeasuresPos();
    document.getElementById('audio').pause();
    document.getElementById("set_measure").style.display = 'none';
    document.getElementById("learning").style.display = 'initial';
    document.getElementById("playing").style.display = 'none';
}

function goToSetting() {
    document.getElementById('audio').pause();
    document.getElementById("set_measure").style.display = 'initial';
    document.getElementById("learning").style.display = 'none';
    document.getElementById("playing").style.display = 'none';
}

function goToPlaying() {
    document.getElementById('audio').pause();
    document.getElementById("set_measure").style.display = 'none';
    document.getElementById("learning").style.display = 'none';
    document.getElementById("playing").style.display = 'initial';

    parent = document.getElementById('measures');
    measures = parent.childNodes;

    for (var i = 0; i < measures.length; i++) {
        child_id = measures[i].id;
        measures[i].onclick = (function (id) {
            return function () {
            var mp3 = document.getElementById('audio');
            child = document.getElementById(id);
            mp3.currentTime = child.play_time;
            mp3.play(); }})(child_id);
    }

    $('.draggable').css({ border: 'transparent' });
}

function startLearning() {
    document.getElementById('audio').pause();
    var mp3 = document.getElementById('audio');
    mp3.currentTime = 0;
    mp3.play();

    var parent = document.getElementById('measures');
    children = parent.childNodes;
    for (var i = 0; i < children.length; i ++) {
        child_id = children[i].id
        children[i].onclick = (function (id) {
            return function() {
            var mp3 = document.getElementById('audio');
            child = document.getElementById(id);
            child.play_time = mp3.currentTime; }})(child_id);
    }
}