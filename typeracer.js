function accuracy(nbe, size) {
    if(nbe == 0)
        return 100;
    return (size - nbe)/size*100;

}

function speed(elapsed, size, nbe) {
    nb_min = elapsed / 60;
    wpm = ((size / 5)) / nb_min;

    return wpm;
}

function displayText(words, curWordIndex) {

    var text = "";
    $.each(words, function(index, value){
        if(index == curWordIndex)
            text += '<span class="current-word">' + words[index] + '</span> ';
        else
            text += words[index] + ' ';
    });

    return text;
}

$(document).ready(function(){
    // var texts= ["the quick brown fox jumps over the lazy dog"];

    $('#tinp').focus();

    $("#bg-change").change(function() {
        if(this.checked) {
            $('body').css('background-color', '#272727');
            $('body').css('color', '#EAEAEA');
        }
        else {
            $('body').css('background-color', '#FAFAFA');
            $('body').css('color', 'black');
        }
    });

    $("#hardcore").change(function() {
        if(this.checked) {
            hardcoreMode = true;
            $("#message").html('');
            $("#message").show();
        }
        else {
            hardcoreMode = false;
            $("#message").hide();
        }
    });

    $('#restart').click(function(){
        curWordIndex = 0;
        curLetterIndex = 0;
        curWord = words[curWordIndex];

        buffer = "";

        start = false;
        start_time = 0;
        end_time = 0;
        needCorrection = false;
        nberror = 0;
        $('#retry').hide()
        $("#tinp").prop('disabled', false);
        $('#tsrc').html(displayText(words, curWordIndex));
        $('#res').hide();
        $('#this-text').hide();
        $("#tinp").css({'background-color' : '#fff'});
        $("#tinp").val('');
        $("#tinp").blur();
        $('#tinp').focus();
    });

    $('#retry').click(function(){
        text = texts[Math.floor(Math.random() * texts.length)];
        //text = texts[rangen(texts.length)];
        words = text.split(" ");
        effective_text_length = text.length + text.replace(/[^A-Z]/g, "").length;
        curWordIndex = 0;
        curLetterIndex = 0;
        curWord = words[curWordIndex];

        buffer = "";

        start = false;
        start_time = 0;
        end_time = 0;
        needCorrection = false;
        nberror = 0;
        $('#retry').hide()
        $("#tinp").prop('disabled', false);
        $('#tsrc').html(displayText(words, curWordIndex));
        $('#res').hide();
        $('#this-text').hide();
        $("#tinp").css({'background-color' : '#fff'});
        $("#tinp").val('');
        $("#tinp").blur();
        $('#tinp').focus();
        // console.log(curWord);
    });

    var curTextIndex = Math.floor(Math.random() * texts.length);
    //var curTextIndex = rangen(texts.length);

    var text = texts[curTextIndex];

    var words = text.split(" ");
    // Upper case letters and symbols account for 2 strokes
    var effective_text_length = text.length + text.replace(/[^A-Z]/g, "").length + text.replace(/[a-z0-9 ]/gi, "").length;
    var curWordIndex = 0;
    var curLetterIndex = 0;
    var curWord = words[curWordIndex];

    var buffer = "";

    var start = false;
    var start_time = 0;
    var end_time = 0;
    var needCorrection = false;
    var nberror = 0;
    var average_speed = 0;
    var nb_test = 0;
    var tmpError = 0;
    var hardcoreMode = false;
    $('#retry').hide()
    $('#tsrc').html(displayText(words, curWordIndex));

    $("#tinp").on('keyup keydown', function(e){

        if(!start) {
            start_time = new Date().getTime();
            start = true;
        }

        var keyCode = (e.keyCode ? e.keyCode : e.which);
        var keyVal = String.fromCharCode(keyCode);
        buffer = $("#tinp").val();

        // hitting escape = reset
        if(keyCode == 27) {
            $('#restart').click();
        }

        if(keyCode != 8) {
            curLetterIndex ++;
        }

        if(keyCode == 32) {
        // space press, go to next word
        if(buffer.replace(/\s+/g, '') == curWord.replace(/\s+/g, '') && !needCorrection) {
            $("#tinp").val('');
            $("#tinp").css({'background-color' : '#fff'});
            buffer = "";
            curLetterIndex = 0;
            curWordIndex ++
            curWord = words[curWordIndex];
            $('#tsrc').html(displayText(words, curWordIndex));
                e.preventDefault(); // cancel adding a space to the input box
            }
            else if(buffer.length == 0) { // first character of a word
                e.preventDefault();

            }
        }

        if(keyCode == 8) { // backspace
            if(curLetterIndex > 0) {
                curLetterIndex --;
            }
            buffer = buffer.substring(0, buffer.length - 1);
            if(buffer != curWord.substring(0, buffer.length)) {
            // #99CC00 green
            $("#tinp").css({'background-color' : '#D08383'});
        }
        else
        {
            $("#tinp").css({'background-color' : '#fff'});
        }

    }

    if(curWordIndex == words.length-1 && buffer.replace(/\s+/g, '') == curWord.replace(/\s+/g, '')) {

        $("#tinp").prop('disabled', true);
        $("#tinp").css({'background-color' : '#fff'});
        $("#tinp").val('');
        end_time = new Date().getTime();
        elapsed = (end_time - start_time) /1000;
            // console.log(elapsed);
            average_speed += speed(elapsed, effective_text_length, nberror);

            nb_test ++;
            $("#res").html('Accuracy: <span class="bold">' + accuracy(nberror, effective_text_length).toFixed(2) + '%</span><br>Speed: <span class="bold">' + speed(elapsed, effective_text_length, nberror).toFixed(2) + ' wpm</span>');
            $("#res").show();
            $('#retry').show()

        }

        if(buffer != curWord.substring(0, buffer.length)) {
            $("#tinp").css({'background-color' : '#D08383'});
            if(!needCorrection){
                nberror ++;
                needCorrection = true;

                if(hardcoreMode) {
                    $('#message').html("You typed <span class=\"wrong\">" + buffer + "</span> for the word <span class=\"wrong\">" + curWord + "</span>");

                    $('#retry').click();
                    $('#tinp').blur();
                }
            }
        }
        else
        {
            $("#tinp").css({'background-color' : '#fff'});
            needCorrection = false;
        }

    });

});
