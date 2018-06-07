/*
 * Create a list that holds all of your cards; add the various scoring parameters.
 */

let icons=['bicycle', 'bicycle', 'rocket', 'rocket', 'balance-scale', 'balance-scale', 'bell', 'bell', 'book', 'book', 'bolt', 'bolt', 'car', 'car', 'chess', 'chess'],
	opened = [],
	match = 0,
	moves = 0,
	$deck = $('.deck'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$ratingStars = $('.fa-star'),
	$restart = $('.restart'),
	delay = 400,
	currentTimer,
	second = 0,
	$timer = $('.timer'),
	totalCard = icons.length / 2,
	rank3stars = 12,
	rank2stars = 18,
	rank1stars = 24;

	/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page (I'm using the append method for this rather than list the cards individually in the HTML as in the starter code.)
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


// Starts Game
function initGame() {
	var cards = shuffle(icons);
	$deck.empty();
	match = 0;
	moves = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addCardListener();

	resetTimer(currentTimer);
	minute=0; second = 0;
	$timer.text(`${minute}`,`${second}`)
	initTime();
};
// Sets star rating and final score
function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}
	return { score: rating };
};

// End Game using Sweet Alert (https://sweetalert.js.org/guides/#getting-started)
function endGame(moves, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Well Done! You Have A Good Memory!',
		text: 'You made ' + moves + ' Moves and scored ' + score + ' Stars in ' + second + ' Seconds.',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Click here or refresh browser to play again'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Reset Game using Sweet Alert (https://sweetalert.js.org/guides/#getting-started)
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Are you sure you want to restart?',
		text: "All of your moves will be Lost!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Yes, Restart Game!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let addCardListener = function () {

	// Card turn-over and identify specific card
	$deck.find('.card').bind('click', function () {
		var $this = $(this)
      
		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var card = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(card);

		// Compare card with open card
		if (opened.length > 1) {
			if (card === opened[0]) {
				$deck.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$deck.find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$deck.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
		}

		// End game if all cards match
		if (totalCard === match) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(function () {
				endGame(moves, score);
			}, 500);
		}
	});
};


function initTime() {
	currentTimer = setInterval(function () {
		$timer.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetTimer(timer) {
	if (timer) {
		clearInterval(timer);
	}
};

initGame();
