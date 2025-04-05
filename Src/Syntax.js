import * as G from "./Game.js";

var temp=new String();
var Tip=document.getElementById('Tip');

const ChoosList=
[
	"pawn",
	"bishop",
	"knight",
	"rook",
	"queen",
	"king",
	"gooshop",
	"gooking",
	"fircar",
	"seccar",
	"hoorse",
	"bomb",
	"goobomb",
	"stone",
	"trap",
	"rotator",
	"jumper",
	"jumplar",
	"portal",
	"diplomat",
	"deaf",
	"diploqueen",
	"diportal",
	"employee",
	"factory",
	"product",
	"cell"
];
var ChoosMatch='^(';
for(var ele of ChoosList)
	ChoosMatch+='|'+ele;
ChoosMatch+=')\\(\\d+,\\d+,\\d+\\)$';


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
var PosInTip=new G.NAR(-1,-1,-1);
var PosPlainPaint=false;
const ClassNamesForSign={
	O:"oto",
	M:"moove",
	J:"jump",
	E:"effect"
};

function WikiGroodClickFunc()
{

}

export function DecodeGrood()
{
	Decodings=document.querySelectorAll('div.GroodWrap>p');
	var res;
	for(var ch of Decodings)
	{
		temp=ch.textContent;
		var ele=ch.parentElement;
		ele.innerHTML='';
		// [size]
		res=temp.match(/^\[([1-9][0-9]*)\]$/m);
		var gr=new G.Grood(res[1],ele,WikiGroodClickFunc,false);
		// choos(N,A,R)
		res=temp.match(new RegExp(ChoosMatch,'gim'));
		if(res!=null)for(var i of res)
		{
			var type=i.match(/([a-z|A-Z])+/)[0];
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			gr.PlaceChoos(new G.NAR(tar[1],tar[2],tar[3]),type,-1);
		}
		// tag(N,A,R)
		res=temp.match(/^[OJME]!{0,1}\(\d+,\d+,\d+\)$/gm);
		if(res!=null)for(var i of res)
		{
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			var pos=new G.NAR(tar[1],tar[2],tar[3]);
			gr.SetSign(pos,"sign",ClassNamesForSign[i[0]]);
			if(i[1]=='!')
				gr.SetSign(pos,"only");
		}
		// (N1,A1,R1)->(N2,A2,R2)color
		res=temp.match(/^\(\d+,\d+,\d+\)->\(\d+,\d+,\d+\).+$/gm);
		if(res!=null)
		{
			var svgHead=`<svg class="arrows" height="${gr.element.firstChild.offsetHeight}" width="${gr.element.firstChild.offsetWidth}"><defs>`;
			var svgBody=`</defs>`;
			for(var i in res)
			{
				var tar=res[i].match(/\((\d+),(\d+),(\d+)\)->\((\d+),(\d+),(\d+)\)(.+)/);
				var pos1=new G.NAR(tar[1],tar[2],tar[3]);
				var pos2=new G.NAR(tar[4],tar[5],tar[6]);
				var p1=gr.QueryCellCenterClientPos(pos1);
				var p2=gr.QueryCellCenterClientPos(pos2);
				svgHead+=`<marker id="arrow${i}" markerWidth="3" markerHeight="3" refX="1" refY="1.5" orient="auto">
							<path d="M 0 0 L 0 3 L 2 1.5 Z" fill="${tar[7]}" />
						</marker>`
				svgBody+=`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
					stroke="${tar[7]}" stroke-width="10" marker-end="url(#arrow${i})" />`
			}
			svgBody+=`</svg>`;
			gr.element.innerHTML+=svgHead+svgBody;
		}
	}
	var groods=document.getElementsByTagName('grood');
	for(var ele of groods){
		ele.addEventListener('mouseleave',()=>{
			Tip.style.opacity=0;
		});
		ele.addEventListener('mouseenter',()=>{
			Tip.style.opacity=0.8;
		});
		ele.addEventListener('mousemove',(e)=>{
			Tip.style.left=`${e.clientX+10}px`;
			Tip.style.top=`${e.clientY+10}px`;
		});
	}
	var Cells=document.getElementsByTagName('cell');
	for(var ele of Cells)
		ele.addEventListener('mouseenter',(e)=>{
			PosInTip=G.XYtoNAR(new G.XY(
				Number(e.target.getAttribute('x')),
				Number(e.target.getAttribute('y'))),
				Number(e.target.parentElement.parentElement.parentElement.getAttribute('rows')));
				Tip.innerHTML=`${PosInTip.print(PosPlainPaint)}`;
		});
	document.body.addEventListener('keydown',(e)=>{
		if(e.key!='Shift')	return;
		PosPlainPaint=true;
		Tip.innerHTML=`${PosInTip.print(PosPlainPaint)}`;
	})
	document.body.addEventListener('keyup',(e)=>{
		if(e.key!='Shift')	return;
		PosPlainPaint=false;
		Tip.innerHTML=`${PosInTip.print(PosPlainPaint)}`;
	})
}