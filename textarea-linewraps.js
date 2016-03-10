function calculateWraps(t) {
	// this will take a textarea and calculate where "/n" should be inserted.
	// var t = document.getElementsByTagName('textarea')[0];

	if (t === undefined) {
		t = document.getElementsByTagName('textarea')[0];
	}

	var fontFamily = window.getComputedStyle( t, null).getPropertyValue('font-family');
	var fontSize = window.getComputedStyle( t, null).getPropertyValue('font-size');

	function setInlineNoPadMargin(element) {
		element.style.display = "inline-block";
		element.style.margin = "0";
		element.style.padding = "0";
	}

	function placeOffScreen(element) {
		return; // keep on screen for now.
		element.style.position = "fixed";
		element.style.left = "-100000px";
	}

	function setFontAndSize(element) {
		element.style.fontFamily = fontFamily;
		element.style.fontSize = fontSize;
	}

	var results = document.getElementById('html-results');
	var iTest = document.getElementById('i-test');
	var iSpaceITest = document.getElementById('i-space-i-test');

	if (iSpaceITest === null){
		results = document.createElement('div');
		results.setAttribute('id', 'html-results');
		setFontAndSize(results);
		setInlineNoPadMargin(results);
		placeOffScreen(results);  // comment out for debug
		document.body.appendChild(results);

		iTest = document.createElement('div');
		iTest.setAttribute('id', 'i-test');
		iTest.innerText = "i";
		setFontAndSize(iTest);
		setInlineNoPadMargin(iTest);
		placeOffScreen(iTest);
		document.body.appendChild(iTest);

		iSpaceITest = document.createElement('div');
		iSpaceITest.setAttribute('id', 'i-space-i-test');
		iSpaceITest.innerText = "i i";
		setFontAndSize(iSpaceITest);
		setInlineNoPadMargin(iSpaceITest);
		placeOffScreen(iSpaceITest);
		document.body.appendChild(iSpaceITest);
	}

	var iWidth = iTest.offsetWidth;

	var spaceWidth = iSpaceITest.offsetWidth - (iWidth * 2);

	var wrapsApplied = 0;

	var chars = t.value;

	var runningWidth = 0;

	var newString = "";

	var lineBreakOpps = [];

	function clearResults() {
		while (results.hasChildNodes()) {
			results.removeChild(results.lastChild);
		}
	}
	clearResults();

	function insertNewLine() {
		runningWidth = 0; // reset running width
		var newline = document.createElement("div");
		results.appendChild(newline);
		newString += "\n";
	}

	function setAttrs(element, w, runningWidth, oIndex) {
		element.style.width = w + "px";

		element.setAttribute('data-runningWidth', runningWidth);
		element.setAttribute('id', ('char-index-'+oIndex));
		element.setAttribute('data-char-width', w);
	}

	function insertSpaceChar(i) {
	lineBreakOpps.push(i);
		var space = document.createElement("span");
		setFontAndSize(space);
		setInlineNoPadMargin(space);
		space.innerHTML = " ";
		results.appendChild(space);
		setAttrs(space, spaceWidth, runningWidth, i);
		newString += " ";

		return spaceWidth;
	}

	function insertChar(i) {
		var theChar = chars[i];
		var char = document.createElement("div");
		setFontAndSize(char);
		setInlineNoPadMargin(char);
		char.innerHTML = theChar;
		results.appendChild(char);
		setAttrs(char, char.offsetWidth, runningWidth, i);
		newString += theChar;

		return char.offsetWidth;
	}

	function insertLineBreakAtLastOpp(currentIndex) {

		var wordWidth = 0;
		var lastOpp = lineBreakOpps.slice(-1).pop();
		var insertBreakAt = lastOpp;

		var htmlEl = document.getElementById("char-index-" + lastOpp);

		for (var i = lastOpp; i <= currentIndex; i++) {
			wordWidth += parseInt(document.getElementById("char-index-"+i).getAttribute('data-char-width'));
		}

		var breakAt;
		var newline = document.createElement("div");
		htmlEl.parentNode.insertBefore(newline, htmlEl.nextSibling);
		wrapsApplied += 1;
		insertBreakAt += wrapsApplied; // 13 + 1 + 1 = 15
		newString = newString.slice(0, insertBreakAt) + "\n" + newString.slice(insertBreakAt);

		return wordWidth;
	}

	for (var i = 0; i < chars.length; i++) {
		var theChar = chars[i];
		var charWidth = null;

		switch (theChar) {
			case "\n":
				insertNewLine();
				break;
			case " ":
				charWidth = insertSpaceChar(i);
				break;
			default:
				charWidth = insertChar(i);
				break;
		}

		runningWidth += charWidth;

		console.log(wrapsApplied);
		if (runningWidth >= t.offsetWidth-wrapsApplied-3) {
			var lastWordWidth = 0;

			lastWordWidth = insertLineBreakAtLastOpp(i);

			runningWidth = lastWordWidth; // reset running width
		}
	}

	return newString;
}

function incTest() {
	var t = document.getElementsByTagName('textarea')[0];

	t.style.width = t.offsetWidth + 1 + "px";
	console.log("new width is: " + t.offsetWidth);
	calculateWraps();
}

function decTest() {
	var t = document.getElementsByTagName('textarea')[0];

	t.style.width = t.offsetWidth - 1 + "px";
	console.log("new width is: " + t.offsetWidth);
	calculateWraps();
}