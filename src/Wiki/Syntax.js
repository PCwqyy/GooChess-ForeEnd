var Input=document.getElementById('Input');
var Main=document.getElementById("Main");

Input.addEventListener('change',function(event)
{
	const files=event.target.files;
	if (files.length==0)
		return;
	const file=files[0];
	const reader=new FileReader();
	reader.onload=function(e)
		{Main.innerHTML=marked.parse(e.target.result);}
	reader.onerror=function(e)
		{console.error("Fail read file");};
	reader.readAsText(file);
});