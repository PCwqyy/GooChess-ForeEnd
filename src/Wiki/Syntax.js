var Input=document.getElementById('Input');
var Main=document.getElementById("Main");
var Tip=document.getElementById('Tip');

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
	i=e.target.getAttribute('x');
	j=e.target.getAttribute('y');
	r=e.target.parentElement.parentElement.getAttribute('rows');
	console.log(`(${XYtoNAR(new XY(i,j),r).print()})`);
}
var groodCnt=0;
var Groods;
function RunGrood()
{
	Groods=document.getElementsByTagName('grood');
	for(var ele of Groods)
	{
		temp=ele.textContent;
		res=temp.match(/^\[([1-9][0-9]*)\]/);
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
}

var temp=new String();
Input.addEventListener('change',function(event)
{
	const files=event.target.files;
	if (files.length==0)
		return;
	const file=files[0];
	const reader=new FileReader();
	reader.onload=function(e)
	{
		temp=PCMake(e.target.result);
		Main.innerHTML=marked.parse(temp);
		RunGrood();
	}
	reader.onerror=function(e)
		{console.error("Fail reading file");};
	reader.readAsText(file);
});