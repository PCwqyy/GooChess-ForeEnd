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
for(ele of ChoosList)
	ChoosMatch+='|'+ele;
ChoosMatch+=')\\(\\d+,\\d+,\\d+\\)$';


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
			`<div class="GroodWarp">
				<grood>
					${match[i].substring(12,match[i].length-4)}
				</grood>
			</div>`);
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
var PosInTip=new NAR(-1,-1,-1);
var PosPlainPaint=false;
const ClassNamesForSign={
	O:"oto",
	M:"moove",
	J:"jump",
	E:"effect"
};

/** 
 * @param {HTMLElement} cell 
 * @param {HTMLElement} grood
*/
function CellCenterToGrood(cell,grood)
{
	return {
		x:cell.offsetLeft-grood.offsetLeft+cell.offsetWidth/2,
		y:cell.offsetTop-grood.offsetTop+
			(cell.parentElement.classList.contains('black')?1:2)*cell.offsetHeight/3,
	};
}

function RunGrood()
{
	Groods=document.getElementsByTagName('grood');
	for(var ele of Groods)
	{
		temp=ele.textContent;
		ele.innerHTML='';
		// [size]
		res=temp.match(/^\[([1-9][0-9]*)\]$/m);
		CreateBoard(ele,WikiCell,Number(res[1]),false);
		// choos(N,A,R)
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
		// tag(N,A,R)
		res=temp.match(/^[OJME]!{0,1}\(\d+,\d+,\d+\)$/gm);
		if(res!=null)for(i of res)
		{
			var tar=i.match(/\((\d+),(\d+),(\d+)\)/);
			var pos=NARtoXY(new NAR(tar[1],tar[2],tar[3]),ele.getAttribute('rows'));
			cell[pos.x][pos.y].classList.add("sign");
			cell[pos.x][pos.y].classList.add(ClassNamesForSign[i[0]]);
			if(i[1]=='!')
				cell[pos.x][pos.y].classList.add("only");
		}
		// (N1,A1,R1)->(N2,A2,R2)color
		res=temp.match(/^\(\d+,\d+,\d+\)->\(\d+,\d+,\d+\).+$/gm);
		if(res!=null)
		{
			var svgHead=`<svg class="arrows" height="${ele.offsetHeight}" width="${ele.offsetWidth}"><defs>`;
			var svgBody=`</defs>`;
			for(i in res)
			{
				var tar=res[i].match(/\((\d+),(\d+),(\d+)\)->\((\d+),(\d+),(\d+)\)(.+)/);
				var pos1=NARtoXY(new NAR(tar[1],tar[2],tar[3]),ele.getAttribute('rows'));
				var pos2=NARtoXY(new NAR(tar[4],tar[5],tar[6]),ele.getAttribute('rows'));
				var p1=CellCenterToGrood(cell[pos1.x][pos1.y],ele);
				var p2=CellCenterToGrood(cell[pos2.x][pos2.y],ele);
				svgHead+=`<marker id="arrow${i}" markerWidth="3" markerHeight="3" refX="1" refY="1.5" orient="auto">
							<path d="M 0 0 L 0 3 L 2 1.5 Z" fill="${tar[7]}" />
						</marker>`
				svgBody+=`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
					stroke="${tar[7]}" stroke-width="10" marker-end="url(#arrow${i})" />`
			}
			svgBody+=`</svg>`;
			ele.parentElement.innerHTML+=svgHead+svgBody;
		}
	}
	Cells=document.getElementsByTagName('cell');
	for(var ele of Cells)
	{
		ele.addEventListener('mouseenter',(e)=>{
			PosInTip=XYtoNAR(new XY(
				Number(e.target.getAttribute('x')),
				Number(e.target.getAttribute('y'))),
				Number(e.target.parentElement.parentElement.getAttribute('rows')));
				Tip.innerHTML=`${PosInTip.print(PosPlainPaint)}`;
			Tip.style.opacity='0.8';
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