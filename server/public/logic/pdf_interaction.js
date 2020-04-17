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
    $('.draggable').css({ border: '' });
    $('.draggable').hover(function () {
        $(this).css("background-color", "");
        $(this).css("opacity", "");
        $(this).css("border", "");
    });
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
            mp3.currentTime = child.getAttribute('play_time');
            mp3.play(); }})(child_id);
    }

    $('.draggable').css({ border: 'transparent' });
    $('.draggable').hover(function () {
        $(this).css("background-color", "red");
        $(this).css("opacity", "0.5");
    },
    // make background-color back to transparent when mouse exit the draggable
    function () {
        $(this).css("background-color", "");
        $(this).css("opacity", "");
        $(this).css("border", "transparent");
    });
}

function startLearning() {
    document.getElementById('audio').pause();
    var mp3 = document.getElementById('audio');
    mp3.currentTime = 0;
    setTimeout(function() {mp3.play()}, 2000);

    var parent = document.getElementById('measures');
    children = parent.childNodes;
    for (var i = 0; i < children.length; i ++) {
        //children[i].classList.add("clickable");
        child_id = children[i].id
        children[i].onclick = (function (id) {
            return function() {
            var mp3 = document.getElementById('audio');
            child = document.getElementById(id);
            child.setAttribute('play_time', mp3.currentTime); }})(child_id);
    }
}

function exportMeasures() {
    file_name = document.getElementById('export_button').value + ".csv";
    measures = document.getElementById('measures').childNodes;

    csv_str = ""
    for (var i = 0; i < num_clickables; i++){
        csv_str += measures[i].id;
        csv_str += ",";
        csv_str += measures[i].style.top;
        csv_str += ",";
        csv_str += measures[i].style.left;
        csv_str += ",";
        csv_str += measures[i].style.width;
        csv_str += ",";
        csv_str += measures[i].style.height;
        csv_str += ",";
        csv_str += measures[i].getAttribute('play_time');
        csv_str += "\n";
    }

    // write to a .csv file
    var blob = new Blob([csv_str], { type: 'text/csv;charset=utf-8;' });

    // download the .csv file
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function loadCSV() {
    csv_file = document.currentScript.getAttribute('csv');
    var csv_data = "";

    // get data from .csv file
    $.ajax({
        url: csv_file,
        success: function (data) {
            csv_data = data;
        },
        async: false
    });

    rows = csv_data.split("\n");
    for (var i = 0; i < rows.length-1; i++){
        cols = rows[i].split(",");
        width = cols[3]? cols[3]: 90;
        height = cols[4]? cols[4] : 90;
        play_time = cols[5]? cols[5] : 0;
        loadMeasure(cols[0], cols[1], cols[2], width, height, play_time);
    }
}

function loadMeasure(measure_id, top, left, width, height, play_time) {
    var parent = document.getElementById('measures');
    var newElement = document.createElement("div");
    newElement.className = "clickable";
    newElement.id = measure_id;
    newElement.style.top = top;
    newElement.style.left = left;
    newElement.style.width = width;
    newElement.style.height = height;
    newElement.setAttribute('play_time', play_time);
    newElement.onclick = (function (id) {
            return function () {
                var mp3 = document.getElementById('audio');
                child = document.getElementById(id);
                mp3.currentTime = child.getAttribute('play_time');
                mp3.play();
            }
        })(measure_id);
    parent.appendChild(newElement);
}