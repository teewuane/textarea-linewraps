function applyLineBreaks(textarea) {
	"use strict";
	// Requires the css rule "line-break" to be "strict" or "loose". 
	// {line-break: strict;}
	// Also requires the attribte "wrap" to be "hard".

	function getPaddingAndBorder() {
		var borderLeft = parseInt(window.getComputedStyle( textarea, null).getPropertyValue('border-left-width'));
		var paddingLeft = parseInt(window.getComputedStyle( textarea, null).getPropertyValue('padding-left'));
		var borderRight = parseInt(window.getComputedStyle( textarea, null).getPropertyValue('border-right-width'));
		var paddingRight = parseInt(window.getComputedStyle( textarea, null).getPropertyValue('padding-right'));

		return borderLeft + paddingLeft + borderRight + paddingRight;
	}


	function getTextWidthCanvas(text, font) {
		var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
		document.body.appendChild(canvas);

		var context = canvas.getContext("2d");
		context.font = font;
		var metrics = context.measureText(text);
		return metrics.width;
	}

	function getFontInfo(){
		return {
			family: window.getComputedStyle( textarea, null).getPropertyValue('font-family'),
			pixels: window.getComputedStyle( textarea, null).getPropertyValue('font-size')
		}
	}

	var font = getFontInfo();

	function getTextWidth(text) {
		var width = getTextWidthCanvas(text, font.pixels + " " + font.family);
		return width;
	}

	var re=/\r\n|\n\r|\n|\r/g;
	var lines = textarea.value.replace(re,"\n").split("\n");  // 4 lines
	var maxLineWidth = textarea.offsetWidth;
	var spaceCharWidth = getTextWidth(" ");
	var outer = [];
	outer.push([]);
	var lineCount = 0;
	var spaceLeft = maxLineWidth;
	var paddingAndBorder = getPaddingAndBorder();

	for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

		var line = lines[lineIndex];  // string

		var words = line.split(' ');

		for (var wordIndex = 0; wordIndex < words.length; wordIndex++) {
			var word = words[wordIndex];
			var width = getTextWidth(word);
			spaceLeft -= (width + spaceCharWidth);

			if (spaceLeft > (0 + paddingAndBorder)) {  // close to zero
				outer[lineCount].push(word);
			} else {
				// linebreak here.
				lineCount++;
				outer.push([]); // empty array.

				outer[lineCount].push(word);

				spaceLeft = (maxLineWidth - width);
			}
		}
		spaceLeft = maxLineWidth;
		lineCount++;
		outer.push([]);
	}

	var lastArray = outer[outer.length - 1];

	if (lastArray.length === 0) {
		// DROP THE LAST ARRAY!
		outer.pop();
	}

	var newString = "";

	for (var i = 0; i < outer.length; i++) {
		newString += outer[i].join(' ');
		if (i !== (outer.length - 1)) {
			// only add the new line if it is not the last line.
			newString += "\n";
		}
	}

	// remove the canvas so it doesn't interfere.
	document.body.removeChild(getTextWidth.canvas);

	return newString;
}