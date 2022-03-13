"use strict";
$(".ui-dialog").resizable({
    handles: { se: '.react-resizable-handle' },minHeight: 500
});
var scr = document.createElement('script');
scr.onload = function() {
    display("Loaded: " + typeof ko);
};

scr.onerror = function() {
    display("Error");
};

scr.src = "../env.js";
document.querySelector("script").parentNode.appendChild(scr);


$(".ui-dialog").resizable({ distance: 30 });

$( function() {
    $( "#leftNav" ).resizable();
    $(".ui-dialog").resizable({
        handles: { se: '.react-resizable-handle' }
    });
});

function flag(d) {
    var el = document.getElementById(d);
    var flagData = JSON.parse(sessionStorage.getItem("flag"));
    if(el.classList[1] == "inactive") {
        flagData.push(d);
        sessionStorage.setItem("flag", JSON.stringify(flagData));
        el.classList.remove("inactive");
        el.classList.add("active");
    } else {
        removeFlag = flagData.filter(e => e != d);
        sessionStorage.setItem("flag", JSON.stringify(removeFlag));
        el.classList.remove("active");
        el.classList.add("inactive");
    }
}

function check(d) {
    var el = document.getElementById(d);
    var checkData = JSON.parse(sessionStorage.getItem("check"));
    if(el.innerHTML == "Unseen") {
        checkData.push(d);
        el.innerHTML="Not Attempted";
        sessionStorage.setItem("check", JSON.stringify(checkData));
    }
}

function navlink(url, num) {
    if(num == '1') {
        document.getElementById("popup_resource_word").contentWindow.setData("WordQ1");
        document.getElementById("popup_resource_excel").contentWindow.setSpreadSheetData("1", rscoid);
    } else if(num == '2') {
        document.getElementById("popup_resource_word").contentWindow.setData("WordQ2");
        document.getElementById("popup_resource_excel").contentWindow.setSpreadSheetData("2", rscoid);
    } else if(num == '3') {
        document.getElementById("popup_resource_word").contentWindow.setData("WordQ3");
        document.getElementById("popup_resource_excel").contentWindow.setSpreadSheetData("3", rscoid);
    } else if(num == '4') {
        document.getElementById("popup_resource_word").contentWindow.setData("WordQ4");
        document.getElementById("popup_resource_excel").contentWindow.setSpreadSheetData("4", rscoid);
    }
    setTimeout(function() { window.location.href = url; }, 1000);
}

$( function() {
    var a = 3;
    $(".dragme").draggable({ containment:"#root", handle: ".ui-dialog-titlebar", start: function( event, ui ) { $(this).context.style.zIndex = a++; } });
});

$( document ).ready(function() {
    console.log("title", name);
    document.getElementById('title').innerHTML = name;
    var endTime = JSON.parse(sessionStorage.getItem("c"));
    if(endTime == 0){
        setInterval(function () {
            var seconds = JSON.parse(sessionStorage.getItem("s"));
            var fiveMin = JSON.parse(sessionStorage.getItem("t"));
            var timeleft = fiveMin - seconds % fiveMin;
            var hours = Math.floor(timeleft / 3600)
            var minutes = Math.floor((timeleft % 3600) / 60)
            var seconds11 = timeleft - hours * 3600 - minutes * 60
            var result = hours +" : "+minutes+" : "+seconds11
            // var result = parseInt(timeleft / 60) + ':' + timeleft % 60;
            if(document.getElementById('timer')) {
                if(timeleft < 61) {
                    document.getElementById('timer').style.color = "red";
                }
                document.getElementById('timer').innerHTML = result;
            }
            if(timeleft == 1) {
                sessionStorage.setItem("c", 1);
                alert("Time Out")
                submit();
            }
            seconds = seconds + 1;
            sessionStorage.setItem("s", seconds);
        }, 1000);
    }
    function bacup_timer(timeleft_backup) {
        sessionStorage.setItem("bacupTimer", JSON.stringify(timeleft_backup));
        console.log("timeleft_backup", timeleft_backup);
        var interval = setInterval(function () {
            var sec = JSON.parse(sessionStorage.getItem("bacupTimer"));
            sec = sec - 1;
            console.log("sec", sec);
            if(sec == 0) {
                // clearInterval(interval);
                sec = sec + 180;
                sessionStorage.setItem("bacupTimer", JSON.stringify(sec));
                wait_backup();
            }
            sessionStorage.setItem("bacupTimer", JSON.stringify(sec));
        }, 1000);
    }
    function wait_backup() {
        console.log("wait_backup")
        document.getElementById("popup_excel_b1").contentWindow.submitSpreadSheet();
        document.getElementById("popup_excel_b2").contentWindow.submitSpreadSheet();
        document.getElementById("popup_excel_b3").contentWindow.submitSpreadSheet();
        document.getElementById("popup_word_b1").contentWindow.submitBackupWord("Q1", rscoid);
        document.getElementById("popup_word_b2").contentWindow.submitBackupWord("Q2", rscoid);
        document.getElementById("popup_word_b3").contentWindow.submitBackupWord("Q3", rscoid);
        // document.getElementById("popup_word_b4").contentWindow.submitBackupWord("Q4", rscoid);
        // sessionStorage.setItem("bacupTimer", JSON.stringify(20));
        // console.log('checl', JSON.parse(sessionStorage.getItem("bacupTimer")))
        // bacup_timer(20);
    }

    if(!sessionStorage.getItem("bacupTimer")){
        bacup_timer(180);
    } else {
        var sec = JSON.parse(sessionStorage.getItem("bacupTimer"));
        bacup_timer(sec);
    }

    function submit() {
        if(document.getElementById("popup_resource_word")) {
            document.getElementById('timer').style.display = "none";
            setTimeout(function() {
                onTimeout();
            }, 1000);
        } else {
            window.location.href = "./exit.html";
        }
    }

    if(!sessionStorage.getItem("flag")){
        sessionStorage.setItem("flag", "[]");
    } else {
        var flagInit = JSON.parse(sessionStorage.getItem("flag"));
        flagInit.forEach(element => {
            var ele = document.getElementById(element);
            ele.classList.remove("inactive");
            ele.classList.add("active");
        });
    }

    if(!sessionStorage.getItem("check")){
        sessionStorage.setItem("check", "[]");
    } else {
        var checkInit = JSON.parse(sessionStorage.getItem("check"));
        checkInit.forEach(element => {
            var ele = document.getElementById(element);
            ele.innerHTML = "Not Attempted";
        });
    }

    if(!sessionStorage.getItem("AnswerCheck")){
        sessionStorage.setItem("AnswerCheck", "[]");
    } else {
        var checkInit = JSON.parse(sessionStorage.getItem("AnswerCheck"));
        checkInit.forEach(element => {
            var ele = $(element)
            ele[0].innerHTML = "Attempted";
            ele[0].style.color = "#595959";
        });
    }

    $('.navigator_popup')[0].style.visibility = 'hidden';
    $(".calculator").click(function() {
        $('.calc')[0].style.visibility = 'visible';
    });

    $(".scratch-pad").click(function() {
        $('.notepad')[0].style.visibility = 'visible';
    });

    $(".navigator").click(function() {
        $('.navigator_popup')[0].style.visibility = 'visible';
    });

    $( ".leftQuestionNav .leftNavDetail" ).click(function() {
        $(this).find('.dragme')[0].style.visibility = 'visible';
    });

    $( ".icon-close" ).click(function() {
        $(this).closest('.dragme')[0].style.visibility = 'hidden';
        event.stopPropagation();
        $(this).parent().parent().find('.dragme')[0].style.visibility = 'hidden';
    });

    $( ".close-all" ).click(function() {
        var element = $('.dragme');
        for(var i=0; i<element.length; i++) {
            element[i].style.visibility = 'hidden';
        }
    });

    $(".highlight-dropdown").click(function() {
        var classList = document.getElementById('colorPickerDialogContainer').className.split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
            if (classList[i] === 'hideDialog') {
                document.getElementById("colorPickerDialogContainer").classList.add('showDialog');
                document.getElementById("colorPickerDialogContainer").classList.remove('hideDialog');
            } else {
                document.getElementById("colorPickerDialogContainer").classList.add('hideDialog');
                document.getElementById("colorPickerDialogContainer").classList.remove('showDialog');
            }
        }
    });

    var highlighter, underline;
    rangy.init();
    highlighter = rangy.createHighlighter();
    underline = rangy.createHighlighter();
    function getSelectedText(bc) {
        highlighter.addClassApplier(rangy.createClassApplier(bc));
        highlighter.highlightSelection(bc);
        var selTxt = rangy.getSelection();
        rangy.getSelection().removeAllRanges();
    }

    $( ".highlightblock" ).click(function(element) {
        if(element.currentTarget.classList[0] == "hilet") {
            if(element.currentTarget.classList[1] == "remove") {
                removeHighlights();
            } else {
                var test = document.getElementById("displayBlock").classList.length - 1;
                getSelectedText(document.getElementById("displayBlock").classList[test]);
            }
            document.getElementById("colorPickerDialogContainer").classList.add('hideDialog');
            document.getElementById("colorPickerDialogContainer").classList.remove('showDialog');
        } else {
            document.getElementById("colorPickerDialogContainer").classList.add('hideDialog');
            document.getElementById("colorPickerDialogContainer").classList.remove('showDialog');
            document.getElementById('displayBlock').className = '';
            document.getElementById("displayBlock").classList.add(element.currentTarget.classList[2]);
            getSelectedText(element.currentTarget.classList[2]);
        }
    });

    function removeHighlights() {
        var selection;
        if (window.getSelection)
            selection = window.getSelection();
        else if (typeof document.selection != "undefined")
            selection = document.selection;
        var range = selection.getRangeAt(0);
        if (range && !selection.isCollapsed) {
            if (selection.anchorNode.parentNode == selection.focusNode.parentNode) {
                var span = document.createElement('span');
                span.className = 'highlight';
                range.surroundContents(span);
            }
        }
    }

    $( ".strikethrough" ).click(function(element) {
            underline.addClassApplier(rangy.createClassApplier("underlinetext"));
            underline.highlightSelection("underlinetext");
            var selTxt = rangy.getSelection();
            rangy.getSelection().removeAllRanges();
    })

    $( ".unstrike" ).click(function(element) {
        // var set;
        // if (window.getSelection)
        //     set = window.getSelection();
        // else if (typeof document.selection != "undefined")
        //     set = document.selection;
        // var range = set.getRangeAt(0);
        // if (range && !set.isCollapsed) {
        //     if (set.anchorNode.parentNode == set.focusNode.parentNode) {
        //         var span = "</span><span class='removeunderline'></span>"
        //         // var span = document.createElement('span');
        //         // span.className = 'removeunderline';
        //         range.surroundContents(span);
        //     }
        // }
        underline.removeAllHighlights();
    })
});
