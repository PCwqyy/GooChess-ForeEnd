import '../Global/marked.js';
var Main=document.getElementById('Main');
var Speed=30;

fetch('../../Docs/About.md')
	.then((response)=>{return response.text();})
	.then((data)=>{
		Main.innerHTML=marked.parse(data);
		Main.style.top='0px';
		var h=Main.getBoundingClientRect().height;
		Main.style.transition=`${h/Speed}s linear`;
		setTimeout(()=>{
			Main.style.top=`-${h}px`;
		},500);
	})
	.catch((reason)=>{console.error(reason);});