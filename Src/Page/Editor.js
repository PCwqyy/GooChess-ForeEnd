import * as G from '../Global/Game.js'
import {DecodeGrood} from "../Global/Syntax.js"
/** @type {Map<String,String>} */
var Tags=new Map;
/** @type {HTMLElement} */
var lastEle=null;
/** @param {String} t */
function LaunchEditor(t){
	Tags.clear();
	var Cells=document.getElementsByTagName('cell');
	var res=t.match(/^[^\(\)\s]+\(\d+,\d+,\d+\)/mg);
	if(res!=null) for(var i=0;i<res.length;i++)
	{
		var res2=res[i].match(/^([^\(\)\s]+)\((\d+),(\d+),(\d+)\)/);
		Tags.set(new G.NAR(res2[2],res2[3],res2[4]).print(true),res2[1]);
	}
	var res=t.match(/^\(\d+,\d+,\d+\)->\(\d+,\d+,\d+\)[^\(\)\s]+/mg);
	if(res!=null) for(var i=0;i<res.length;i++)
		Tags.set(res[i],'Arrow');
	for(var ele of Cells)
	{
		ele.addEventListener('click',(e)=>{
			e.target.classList.toggle('selected');
			if(!e.target.classList.contains('selected'))
				return;
			if(lastEle!=null)	lastEle.id=null;
			e.target.id='last';
			lastEle=e.target;
		});
	}
}
/** @param {HTMLElement} ele */
function GenCode(ele)
{
	var res="";
	res+=`[${ele.getAttribute('rows')}]\n`
	for(var i of Tags)
		if(i[1]!='Arrow')
			res+=`${i[1]}(${i[0]})\n`;
		else
			res+=`${i[0]}\n`;
	return res;
}
/** @param {String} t */
function ApplyTag(g,t){
	var C=document.getElementsByClassName('selected');
	var row=g.getAttribute('rows');
	for(var ele of C)
	{
		var pos=new G.XY(
			ele.parentElement.getAttribute('x'),
			ele.parentElement.getAttribute('y'));
		Tags.set(G.XYtoNAR(pos,row).print(true),t);
	}
	for(var ele of C)
		ele.classList.remove('selected');
	return GenCode(g);
}
/** @param {String} c */
export function AddArrow(g,c){
	var C=document.getElementsByClassName('selected');
	var prev;
	for(var e of C)
		if(e.id!='last')
			prev=e;
	var posP=G.XYtoNAR(new G.XY(
		prev.parentElement.getAttribute('x'),
		prev.parentElement.getAttribute('y')),
		g.getAttribute('rows'));
	var posL=G.XYtoNAR(new G.XY(
		lastEle.parentElement.getAttribute('x'),
		lastEle.parentElement.getAttribute('y')),
		g.getAttribute('rows'));
	Tags.set(`(${posP.print(true)})->(${posL.print(true)})${c}`,'Arrow');
	return GenCode(g);
}

var Input=document.getElementById('Input');
var Tag=document.getElementById('Tag');
var ViewBox=document.getElementById('View');
function Load()
{
	ViewBox.innerHTML=
		`<div class="GroodWrap">
			<p>${Input.value}</p>
		</div>`;
	DecodeGrood();
	LaunchEditor(Input.value);
}
function Apply()
{
	LaunchEditor(Input.value);
	if(Tag.value.length==0)
		return;
	var Grood=document.getElementsByTagName('grood')[0];
	Input.value=ApplyTag(Grood,Tag.value);
	Tag.value='';
	Load();
}
function Arrow(){
	if(Tag.value.length==0)
		return;
	var Grood=document.getElementsByTagName('grood')[0];
	Input.value=AddArrow(Grood,Tag.value);
	Tag.value='';
	Load();
}
window.ButtonFuncs={};
window.ButtonFuncs.Load=Load;
window.ButtonFuncs.Apply=Apply;
window.ButtonFuncs.Arrow=Arrow;