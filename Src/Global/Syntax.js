import * as G from "./Game.js";

var temp=new String();
var Tip=document.getElementById('Tip');


/** @type {RegExpMatchArray} */
var match;
/** @param {String} Str */
export function PCMake(Str){
	// <details>
	match=Str.match(/^===[^!].+===$/gm);
	for(var i in match)
		Str=Str.replace(/^===[^!].+===$/m,
		`<details><summary>${match[i].substring(3,match[i].length-3)}</summary>\n`);
	Str=Str.replace(/^===!===$/gm,'</details>');
	// <grood>
	match=Str.match(/^```goochess$[^`]+^```$/gm);
	for(var i in match)
		Str=Str.replace(/^```goochess$[^`]+^```$/m,
			`<div class="GroodWrap">
				${match[i].substring(12,match[i].length-4)}
			</div>`);
	return Str;
}

var Decodings;
function WikiGroodClickFunc(){}
export function DecodeGrood()
{
	Decodings=document.querySelectorAll('div.GroodWrap>p');
	for(var ch of Decodings)
	{
		var text=ch.textContent;
		ch=ch.parentElement;
		ch.innerHTML='';
		var gr=new G.Grood(text,ch,WikiGroodClickFunc);
	}
}