var music = [
  "./media/efecto_sonido_neon.mp3",
  "./media/1.mp3",
  "./media/2.mp3",
  "./media/3.mp3",
  "./media/4.mp3",
  "./media/5.mp3",
  "./media/6.mp3",
  "./media/7.mp3",
  "./media/8.mp3",
];
var numberPlay = 0;
$("#audio source").attr("src", music[numberPlay]);
$("audio")[0].load();

$("#play").on("click", function () {
  console.log($("audio")[0]);
  $("audio")[0].play();
});
$("#stop").on("click", function () {
  $("audio")[0].pause();
});
$("#next").on("click", function () {
  numberPlay < 8 ? numberPlay++ : numberPlay;
  $("#audio source").attr("src", music[numberPlay]);
  $("audio")[0].load();
});
$("#prev").on("click", function () {
  numberPlay > 0 ? numberPlay-- : numberPlay;
  $("#audio source").attr("src", music[numberPlay]);
  $("audio")[0].load();
});

var answerCorrect;
var wins;
var losts;
var t = 30;
var myInterval;
sessionStorage.wins
  ? (wins = JSON.parse(sessionStorage.getItem("wins", wins)))
  : (wins = 0);
sessionStorage.losts
  ? (losts = JSON.parse(sessionStorage.getItem("losts", losts)))
  : (losts = 0);

$("#yes").one("click", function () {
  $(".course").css("display", "none");
  $("#wins").text("Wins: " + wins);
  $("#losts").text("Losts: " + losts);
  play();
});

function play() {
  $("#loading").css("display", "flex");
  $.ajax({
    url: "https://opentdb.com/api.php?amount=1",
    type: "GET",
    dataType: "json",

    success: function (data) {
      console.log(data);
      presentQuestion(data);
      answerCorrect = correctAnswer(data);
    },
    error: function (err) {
      console.log(err);
    },
  });
  $("#timer").text("Time: " + t);
  clearInterval(myInterval);
  interval();
}

function interval() {
  myInterval = setInterval(function () {
    t--;
    $("#timer").text("Time: " + t);
    $("#check").on("click", function () {
      clearInterval(myInterval);
      t = 30;
    });
    $("#answers").on("keypress", function (e) {
      if (e.key == "Enter") {
        clearInterval(myInterval);
        t = 30;
      }
    });
    if (t === 0) {
      clearInterval(myInterval);
      t = 30;
      lost();
      $("#continue").on("click", function () {
        play();
        $("#result").hide();
        $("#wins").text("Wins: " + wins);
        $("#losts").text("Losts: " + losts);
        $("#check").css("visibility", "hidden");
      });
    }
  }, 1000);
}

function htmlDecode(frase) {
  return frase
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú");
}

function presentQuestion(data) {
  if (data) {
    $("#loading").css("display", "none");
    $("#questions").css("display", "flex");
  }
  $("#question").text("");
  $("#answers").html("");
  var result = data.results;
  var question = result[0].question;
  var questionDecode = htmlDecode(question);
  var answers = result[0].incorrect_answers;
  answers.push(result[0].correct_answer);
  $("#question").text(questionDecode);
  console.log("Answers: ", answers);
  let mixAnswers = answers.sort(() => Math.random() - 0.5);
  for (const answer of mixAnswers) {
    $("#answers").append(
      '<span><input type="radio" name="answer">' + answer + "</input></span>"
    );
  }
}

function correctAnswer(data) {
  let correct = data.results[0].correct_answer;
  console.log(correct);
  return correct;
}

$("#answers").on("change", "input", function () {
  if ("input[name='answer']:checked") {
    $("#check").css("visibility", "visible");
  }
  if (
    $("#check")[0].outerHTML ===
    '<button id="check" style="visibility: visible;">Answer</button>'
  ) {
    $("#answers").on("keypress", function (e) {
      if (e.key == "Enter") {
        var radioSelected = $("input[name='answer']:checked")
          .parent("span")
          .text();
        if (answerCorrect === radioSelected) {
          win();
        } else {
          lost();
        }
      }
    });
  }
});

$("#check").on("click", function () {
  var radioSelected = $("input[name='answer']:checked").parent("span").text();
  if (answerCorrect === radioSelected) {
    win();
  } else {
    lost();
  }
});

$("#continue").on("click", function () {
  play();
  $("#result").hide();
  $("#wins").text("Wins: " + wins);
  $("#losts").text("Losts: " + losts);
  $("#check").css("visibility", "hidden");
});

function lost() {
  losts++;
  var answerShow = htmlDecode(answerCorrect);
  sessionStorage.setItem("losts", JSON.stringify(losts));
  $("#questions").hide();
  $("#result").show();
  $("#answerResult").text("Wrong! " + "The correct answer was: " + answerShow);
}

function win() {
  wins++;
  sessionStorage.setItem("wins", JSON.stringify(wins));
  $("#questions").hide();
  $("#result").show();
  $("#answerResult").text("Win!");
}
