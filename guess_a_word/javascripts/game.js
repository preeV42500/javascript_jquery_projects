var $letters = $("#spaces"),
    $guesses = $("#guesses"),
    $apples = $("#apples"),
    $message = $("#message"),
    $replay = $("#replay");

var randomWord = (function() {
  var words = ["abacus", "quotient", "octothrope", "proselytize", "stipend"];

  // returns an array without the given word
  function without() {
    var new_arr = [],
        args = Array.prototype.slice.call(arguments);

    words.forEach(function(el) {
      if (args.indexOf(el) === -1) {
        new_arr.push(el);
      }
    });
    return new_arr;
  }
  // selects a random word from the words array
  return function() {
    var word = words[Math.floor(Math.random() * words.length)];
    words = without(word); // re-assign words array to returned array without the selected word
    return word;
  };
})();

function Game() {
  this.incorrect = 0;
  this.letters_guessed = [];
  this.correct_spaces = 0;
  this.word = randomWord();
  if (!this.word) {
    this.displayMessage("Sorry, I've run out of words!");
    this.toggleReplayLink(false);
    return this;
  }
  this.word = this.word.split("");
  this.init();
}

Game.prototype = {
  guesses: 6,
  createBlanks: function() { // creates number of spans equal to word length, appends these to spaces div in DOM
    var spaces = (new Array(this.word.length + 1)).join("<span></span>");
    $letters.find("span").remove();
    $letters.append(spaces);
    this.$spaces = $("#spaces span"); // store jQuery collection of spans
  },
  fillBlanksFor: function(letter) {
    var self = this;
    self.word.forEach(function(l, i) {
      // if letter passed in matches letter in word
      if (letter === l) {
        self.$spaces.eq(i).text(letter); // get span at that index, set its text to the correctly guessed letter
        self.correct_spaces++;
      }
    });
  },
  processGuess: function(e) {
    var letter = String.fromCharCode(e.which);
    if (notALetter(e.which)) { return; }
    if(this.duplicateGuess(letter)) { return; } // check if letter has already been guessed

    if ($.inArray(letter, this.word) !== -1) { // if letter is in word array, fill in blanks where letter appears
      this.fillBlanksFor(letter);
      this.renderGuess(letter);

      if (this.correct_spaces === this.$spaces.length) { // win condition
        this.win();
      }
    }
    else {
      this.renderIncorrectGuess(letter);
    }
    if (this.incorrect === this.guesses) { // loss condition
      this.lose();
    }
  },
  win: function() {
    this.unbind(); // unbind the keypress listener
    this.displayMessage("You win!");
    this.toggleReplayLink(true);
    this.setGameStatus("win");
  },
  lose: function() {
    this.unbind();
    this.displayMessage("Sorry! You're out of guesses");
    this.toggleReplayLink(true);
    this.setGameStatus("lose");
  },
  duplicateGuess: function(letter) {
    var duplicate = this.letters_guessed.indexOf(letter) !== -1;
    if (!duplicate) { this.letters_guessed.push(letter); }
    return duplicate;
  },
  renderIncorrectGuess: function(letter) {
    this.incorrect++;
    this.renderGuess(letter);
    this.setClass();
  },
  setClass: function() {
    $apples.removeClass().addClass("guess_" + this.incorrect);
  },
  renderGuess: function(letter) { // creates span with text set to letter and appends to guesses div
    $("<span />", {
      text: letter
    }).appendTo($guesses);
  },
  displayMessage: function(text) {
    $message.text(text);
  },
  toggleReplayLink: function(which) {
    $replay.toggle(which);
  },
  emptyGuesses: function() {
    $guesses.find("span").remove();
  },
  unbind: function() {
    $(document).off(".game"); // unbind any previous keypress event
  },
  bind: function() {
    $(document).on("keypress.game", this.processGuess.bind(this)); // bind keypress event to document
  },
  setGameStatus: function(status) {
    $(document.body).removeClass();
    if (status) {
      $(document.body).addClass(status);
    }
  },
  init: function() {
    this.bind();
    this.setClass();
    this.toggleReplayLink(false);
    this.emptyGuesses();
    this.createBlanks();
    this.setGameStatus();
    this.displayMessage("");
  }
};

// function that checks if key pressed is a letter
function notALetter(code) {
  var a_code = 97,
      z_code = 122;
  return code < a_code || code > z_code;
}

new Game();

$replay.on("click", function(e) { // create new Game instance when link is clicked
  e.preventDefault();
  new Game();
});
