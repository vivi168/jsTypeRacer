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

function display_text(words, curword_index) {

  var text = "";
  $.each(words, function(index, value){
    if(index == curword_index)
      text += '<span class="current-word">' + words[index] + '</span> ';
    else
      text += words[index] + ' ';
  });

  return text;
}

$(document).ready(function() {
  // replace text simpler one for testing
  // text = "ain't nobody got time fo dat";

  $('#tinp').focus();

  $("#bg-change").change(function() {
    if(this.checked) {
      $('body').css('background-color', '#272727');
      $('body').css('color', '#EAEAEA');
    } else {
      $('body').css('background-color', '#FAFAFA');
      $('body').css('color', 'black');
    }
  });

  $("#hardcore").change(function() {
    if(this.checked) {
      hardcore_mode = true;
      $("#message").html('');
      $("#message").show();
    } else {
      hardcore_mode = false;
      $("#message").hide();
    }
  });

  $('#retry').click(function() {
    curword_index = 0;
    curletter_index = 0;
    curword = words[curword_index];

    buffer = "";

    start = false;
    start_time = 0;
    end_time = 0;
    need_correction = false;
    nberror = 0;
    $('#newtext').hide();
    $("#tinp").prop('disabled', false);
    $('#tsrc').html(display_text(words, curword_index));
    $('#res').text('');
    $("#tinp").css({'background-color' : '#fff'});
    $("#tinp").val('');
    $("#tinp").blur();
    $('#tinp').focus();
  });

  $('#newtext').click(function() {
    window.location.href = '/';
  });

  var words = text.split(" ");
  // Upper case letters and symbols account for 2 strokes
  var effective_text_length = text.length;// + text.replace(/[^A-Z]/g, "").length;
  var curword_index = 0;
  var curletter_index = 0;
  var curword = words[curword_index];

  var buffer = "";

  var start = false;
  var start_time = 0;
  var end_time = 0;
  var need_correction = false;
  var nberror = 0;
  var average_speed = 0;
  var hardcore_mode = false;

  $('#tsrc').html(display_text(words, curword_index));

  $("#tinp").on('keyup keydown', function(e) {

    if(!start) {
      start_time = new Date().getTime();
      start = true;
    }

    var keyCode = (e.keyCode ? e.keyCode : e.which);
    var keyVal = String.fromCharCode(keyCode);
    buffer = $("#tinp").val();

    // hitting escape = reset
    if(keyCode == 27) {
      $('#retry').click();
    }

    if(keyCode != 8) {
      curletter_index ++;
    }

    if(keyCode == 32) {
      // space press, go to next word
      if(buffer.replace(/\s+/g, '') == curword.replace(/\s+/g, '') && !need_correction) {
        $("#tinp").val('');
        $("#tinp").css({'background-color' : '#fff'});
        buffer = "";
        curletter_index = 0;
        curword_index ++;
        curword = words[curword_index];
        $('#tsrc').html(display_text(words, curword_index));
        e.preventDefault(); // cancel adding a space to the input box
      } else if(buffer.length == 0) { // first character of a word
        e.preventDefault();
      }
    }

    if(keyCode == 8) { // backspace
      if(curletter_index > 0) {
        curletter_index --;
      }
      buffer = buffer.substring(0, buffer.length - 1);
      if(buffer != curword.substring(0, buffer.length)) {
        // #99CC00 green
        $("#tinp").css({'background-color' : '#D08383'});
      }
      else
      {
        $("#tinp").css({'background-color' : '#fff'});
      }
    }

    if(curword_index == words.length-1 && buffer.replace(/\s+/g, '') == curword.replace(/\s+/g, '')) {

      $("#tinp").prop('disabled', true);
      $("#tinp").css({'background-color' : '#fff'});
      $("#tinp").val('');
      end_time = new Date().getTime();
      elapsed = (end_time - start_time) /1000;
      average_speed += speed(elapsed, effective_text_length, nberror);

      $("#res").html('Accuracy: <span class="bold">' + accuracy(nberror, effective_text_length).toFixed(2) + '%</span><br>Speed: <span class="bold">' + speed(elapsed, effective_text_length, nberror).toFixed(2) + ' wpm</span>');
      $("#res").show();
      $('#newtext').show();

      // send data
      $.ajax({
        type: "POST",
        url:"race",
        data: {user: guest_ip, wpm: speed(elapsed, effective_text_length, nberror), textId: curTextIndex},
        success:function(data){
          console.log(data);
        }
      });

    }

    if(buffer != curword.substring(0, buffer.length)) {
      $("#tinp").css({'background-color' : '#D08383'});
      if(!need_correction){
        nberror ++;
        need_correction = true;

        if(hardcore_mode) {
          $('#message').html("You typed <span class=\"wrong\">" + buffer + "</span> for the word <span class=\"wrong\">" + curword + "</span>");
          $('#newtext').click();
          $('#tinp').blur();
        }
      }
    } else {
      $("#tinp").css({'background-color' : '#fff'});
      need_correction = false;
    }

  });
});
