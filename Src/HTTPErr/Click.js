import {Text} from '../Lang.js';
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
var codeEle=document.querySelector('div#code');
var desEle=document.querySelector('div#description');
var tri=document.querySelector('div#triangle');
async function set()
{
	codeEle.textContent=code;
	console.log
	var t=await Text(`HTTPError.Description.${code}`);
	console.log(t);
	if(!t.startsWith('HTTPError.Description.'))
		desEle.textContent=t;
	else
		desEle.innerHTML='';
}

var code=404,scale=1;
set();
tri.addEventListener('click',async()=>{
	code++;
	set();
	scale-=0.1;
	console.log(scale);
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
	await Sleep(210);
	scale+=0.1;
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
});