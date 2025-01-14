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

/** @type {RegExpMatchArray} */
var match;
/** @param {String} Str */
function PCMake(Str){
	// <details>
	match=Str.match(/^===[^!].+===$/gm);
	for(i in match)
		Str=Str.replace(/^===[^!].+===$/m,
		`<details><summary>${match[i].substring(3,match[i].length-3)}</summary>\n`);
	Str=Str.replace(/^===!===$/gm,'</details>');
	// <grood>
	match=Str.match(/^```goochess$[^`]+^```$/gm);
	for(i in match)
		Str=Str.replace(/^```goochess$[^`]+^```$/m,
			`<grood>${match[i].substring(13,match[i].length-5)}</grood>`);
	return Str;
}

/** @param e {Event} */
function WikiCell(e)
{
	i=e.target.parentElement.getAttribute('x');
	j=e.target.parentElement.getAttribute('y');
	r=e.target.parentElement.parentElement.parentElement.getAttribute('rows');
	console.log(`(${XYtoNAR(new XY(i,j),r).print()})`);
}
var groodCnt=0;
var Groods;
var ChoosMatch=new String;
function RunGrood()
{
	ChoosMatch='^(';
	for(ele of ChoosList)
		ChoosMatch+='|'+ele;
	ChoosMatch+=')\\(\\d+,\\d+,\\d+\\)$';
	Groods=document.getElementsByTagName('grood');
	for(var ele of Groods)
	{
		temp=ele.textContent;
		res=temp.match(/^\[([1-9][0-9]*)\]/);
		ele.innerHTML='';
		CreateBoard(ele,WikiCell,Number(res[1]),false);
	}
	Cells=document.getElementsByTagName('cell')
	for(var ele of Cells)
	{
		ele.addEventListener('mouseenter',(e)=>{
			Tip.style.opacity='1';
		var pos=XYtoNAR(
			new XY(
				Number(e.target.getAttribute('x')),
				Number(e.target.getAttribute('y'))),
				Number(e.target.parentElement.parentElement.getAttribute('rows')));
				Tip.innerHTML=`${pos.print()}<br>${pos.print(true)}`;
			});
		ele.addEventListener('mouseleave',(e)=>{
			Tip.style.opacity=0;
		});
		ele.addEventListener('mousemove',(e)=>{
			Tip.style.left=`${e.clientX+10}px`;
			Tip.style.top=`${e.clientY+10}px`;
		});
	}
	for(ele of Groods)
	{
		res=temp.match(new RegExp(ChoosMatch,'gim'));
		for(i in res)
		{
			var src=res[i].match(/[a-z|A-Z]+/)[0];
			src='../../Icon/Chooses/'+src[0].toUpperCase()+src.substring(1)+'.svg';
			var C=document.createElement('choos');
			C.style.backgroundImage=`url(${src})`;
			var tar=res[i].match(/\((\d+),(\d+),(\d+)\)/);
			var pos=NARtoXY(new NAR(tar[1],tar[2],tar[3]),ele.getAttribute('rows'));
			cell[pos.x][pos.y].appendChild(C);
		}			
	}
}