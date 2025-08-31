var Text=document.querySelector('textarea#textarea');
var CharMap={};
const START='e000',END='e07f';
async function FetchMap(){
	await fetch('/Assets/Lang/PCLangMap.json')
		.then((response)=>{
			return response.json();
		}).then((data)=>{
			CharMap=data;
		});
}
await FetchMap();

function GetDescription(unicode){
	try{
		if(CharMap[unicode].length==0)
			return `u${unicode}`;
		return CharMap[unicode];
	}catch(e){
		return `u${unicode}`;
	}
}
function FillChar(ele,unicode){
	var ch=String.fromCharCode(parseInt(unicode,16));
	ele.querySelector('div.character').textContent=ch;
	ele.querySelector('div.unicode').textContent=GetDescription(unicode);
}
function CreateCell(pEle,unicode){
	var cell=document.createElement('div');
	cell.className='cell';
	cell.innerHTML=`<div class="character">
						${String.fromCharCode(parseInt(unicode,16))}
					</div>
					<div class="unicode">${GetDescription(unicode)}</div>`
	cell.firstChild.addEventListener('click',(e)=>{
		Text.value+=e.target.textContent.trim();
	})
	pEle.appendChild(cell);
	return cell;
}

var Dict=document.querySelector('div#CharList');
var CellEles=[];
function FillUpCell(ele,start,end)
{
	var i=parseInt(start,16);
	var e=parseInt(end,16);
	for(;i<=e;i++)
		CellEles.push(CreateCell(ele,i.toString(16)));
}
FillUpCell(Dict,START,END);
var Search=document.querySelector('input#search');
Search.addEventListener('input',()=>{
	const key=Search.value.trim();
	if(key)
	{
		var i=parseInt(START,16);
		var e=parseInt(END,16);
		for(;i<=e;i++)
			if(GetDescription(i.toString(16)).match(key))
				CellEles[i-parseInt(START,16)].style.display='block';
			else
				CellEles[i-parseInt(START,16)].style.display='none';
	}
	else
		CellEles.forEach((cell)=>{cell.style.display='block'});
});

var Query=document.querySelector('input#code');
CreateCell(document.querySelector('div#CharQuery'),'e000');
var Result=document.querySelector('div#CharQuery>div.cell');
Query.addEventListener('input',()=>{
	const unicode=Query.value.trim();
	FillChar(Result, unicode);
});

window.FillChar=(from,to)=>{
	var i=parseInt(from,16);
	var e=parseInt(to,16);
	for(;i<=e;i++)
		Text.value+=String.fromCharCode(i);
}
window.GenJson=(from,to)=>{
	var res='';
	var i=parseInt(from,16);
	var e=parseInt(to,16);
	for(;i<=e;i++)
		res+=`"${i.toString(16)}": "",`+'\n';
	console.log(res);
	return 'done!';
}