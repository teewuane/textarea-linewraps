"use strict";

var t = document.getElementsByTagName('textarea')[0];


function getFontInfo(){
	return {
		family: window.getComputedStyle( t, null).getPropertyValue('font-family'),
		pixels: window.getComputedStyle( t, null).getPropertyValue('font-size')
	}
}


function getTextWidthCanvas(text, font) {
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	document.body.appendChild(canvas);
	var context = canvas.getContext("2d");
	context.font = font;
	var metrics = context.measureText(text);
	return metrics.width;
}

var font = getFontInfo();

function getTextWidth(text) {
	var width = getTextWidthCanvas(text, font.pixels + " " + font.family);
	return width;
}


function getTextareaWidth(){
	var re=/\r\n|\n\r|\n|\r/g;
	var lines = t.value.replace(re,"\n").split("\n");  // 4 lines
	var maxLineWidth = t.offsetWidth;
	var spaceCharWidth = getTextWidth(" ");
	var outer = [];
	outer.push([]);
	var lineCount = 0;
	var spaceLeft = maxLineWidth;

	for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

		var line = lines[lineIndex];  // string

		var words = line.split(' ');

		for (var wordIndex = 0; wordIndex < words.length; wordIndex++) {
			var word = words[wordIndex];
			var width = getTextWidth(word);
			spaceLeft -= (width + spaceCharWidth);

			if (spaceLeft > 0) {  // close to zero
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

	var newString = "";
	for (var i = 0; i < outer.length; i++) {
		newString += outer[i].join(' ');
		newString += "\n";
	}
	console.log(newString);

	return newString;
}