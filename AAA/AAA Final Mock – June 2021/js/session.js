$( document ).ready(function() {
    "use strict";
    var log = 'core/log';
    var keepaliveInterval = 120 * 60000;
    var id = decodeURIComponent(document.cookie);
    id = id.split("=")[1]
    function doKeepAlive() {
        $.ajax({
            url: 'https://elearningpat.com/lib/sessionkeepalive_ajax.php',
            dataType: 'json',
            type: 'POST',
            data: {
                'MoodleSession': id,
                'time': $.now()
            },
            headers: {
                'Cache-Control': 'no-cache',
                'Expires': '-1'
            },
            success: function(result) {
                clearInterval(keepaliveInterval);
                console.log("session")
                setTimeout(function() { doKeepAlive(); }, 10000);
            },
            error: function(request) {
                console.log("done test error");
                setTimeout(function() { doKeepAlive(); }, 10000);
                if (request.status == 403) {
                    console.log("success", request)
                } else if (request.status >= 300 && request.status <= 399) {
                    log.debug('moodle-local_session_keepalive-keepalive: ' +
                            'A cached copy of the keepalive answer was returned so it\'s reliablity cannot be guaranteed');
                }
            }
        });
    }
    doKeepAlive();
})
