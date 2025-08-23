import * as Text from '../Lang.js';
const Sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
var codeEle=document.querySelector('div#code');
var desEle=document.querySelector('div#description');
var tri=document.querySelector('div#triangle');
async function set()
{
	codeEle.textContent=code;
	if(Text.Has(`HTTPError.Description.${code}`))
		Text.SetEleTransable(desEle,`HTTPError.Description.${code}`);
	else
		desEle.innerHTML='';
}

var code=404,scale=1;
set();
tri.addEventListener('click',async()=>{
	code++;
	set();
	scale-=0.1;
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
	await Sleep(210);
	scale+=0.1;
	tri.style.scale=Math.max(0.9,Math.min(1,scale));
});