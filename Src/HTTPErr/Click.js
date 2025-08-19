import {Text} from '../Lang.js';
var codeEle=document.querySelector('div#code');
var desEle=document.querySelector('div#description');
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

var code=404;
set();
document.querySelector('div#triangle').addEventListener('click',()=>{
	code++;
	set();
});