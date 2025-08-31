import {PCMake,DecodeGrood} from "../Global/Syntax.js";
import "../Global/marked.js";
var Main=document.getElementById("Main");
console.log(marked);
async function LoadMdF(src)
{
	await fetch(src,{headers:{'Cache-Control':'no-cache'}})
		.then((response)=>{return response.text()})
		.then((data)=>{
			var temp=PCMake(data);
			Main.innerHTML=marked.parse(temp);
			DecodeGrood();
		})
		.catch((reason)=>{console.error(reason);});
	};
window.LoadMd=LoadMdF;