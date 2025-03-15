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
			`<grood>${match[i].substring(12,match[i].length-4)}</grood>`);
	return Str;
}

/** @param {Event} e */
function WikiCell(e)
{
	i=e.target.parentElement.getAttribute('x');
	j=e.target.parentElement.getAttribute('y');
	r=e.target.parentElement.parentElement.parentElement.getAttribute('rows');
}
var Groods;
var ChoosMatch=new String;
var PosInTip=new NAR(-1,-1,-1);
var PosPlainPaint=false;
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
		res=temp.match(/^\[([1-9][0-9]*)\]/m);
		ele.innerHTML='';
		CreateBoard(ele,WikiCell,Number(res[1]),false);
		res=temp.match(new RegExp(ChoosMatch,'gim'));
		if(res!=null)for(i of res)
		{
			var src=i.match(/([a-z|A-Z])+/)[0];
			src='../../Icon/Chooses/'+src[0].toUpperCase()+src.substring(1)+'.svg';
			var C=document.createElement('choos');
			C.style.backgroundImage=`url(${src})`;
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			var pos=NARtoXY(new NAR(tar[1],tar[2],tar[3]),ele.getAttribute('rows'));
			cell[pos.x][pos.y].appendChild(C);
		}			
		res=temp.match(/[OJME]!{0,1}\(\d+,\d+,\d+\)/gm);
		if(res!=null)for(i of res)
		{
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			var pos=NARtoXY(new NAR(tar[1],tar[2],tar[3]),ele.getAttribute('rows'));
			cell[pos.x][pos.y].classList.add("sign");
			switch(i[0])
			{
				case 'O':
					cell[pos.x][pos.y].classList.add("oto");
				break;
				case 'J':
					cell[pos.x][pos.y].classList.add("jump");
				break;
				case 'M':
					cell[pos.x][pos.y].classList.add("moove");
				break;
				case 'E':
					cell[pos.x][pos.y].classList.add("effect");
				break;
			}
			if(i[1]=='!')
				cell[pos.x][pos.y].classList.add("only");
		}
	}
	Cells=document.getElementsByTagName('cell');
	for(var ele of Cells)
	{
		ele.addEventListener('mouseenter',(e)=>{
			Tip.style.opacity='1';
			PosInTip=XYtoNAR(new XY(
				Number(e.target.getAttribute('x')),
				Number(e.target.getAttribute('y'))),
				Number(e.target.parentElement.parentElement.getAttribute('rows')));
				Tip.innerHTML=`${PosInTip.print(PosPlainPaint)}`;
			});
		ele.addEventListener('mouseleave',(e)=>{
			Tip.style.opacity=0;
		});
		ele.addEventListener('mousemove',(e)=>{
			Tip.style.left=`${e.clientX+10}px`;
			Tip.style.top=`${e.clientY+10}px`;
		});
	}
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