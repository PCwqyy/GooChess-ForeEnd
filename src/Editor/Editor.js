/** @type {Map<String,String>} */
var Tags=new Map;
/** @param {String} t */
function LaunchEditor(t){
	Tags.clear();
	var Cells=document.getElementsByTagName('cell');
	var res=t.match(/^[^\(\)\s]+\(\d+,\d+,\d+\)/mg);
	for(var i=0;i<res.length;i++)
	{
		var res2=res[i].match(/^([^\(\)\s]+)\((\d+),(\d+),(\d+)\)/);
		Tags.set(new NAR(res2[2],res2[3],res2[4]).print(true),res2[1]);
	}
	for(var ele of Cells)
	{
		ele.addEventListener('click',(e)=>{
			e.target.classList.toggle('selected');
		});
	}
}
/** @param {HTMLElement} ele */
function GenCode(ele)
{
	var res="";
	res+=`[${ele.getAttribute('rows')}]\n`
	for(var i of Tags)
		res+=`${i[1]}(${i[0]})\n`;
	return res;
}
/** @param {String} t */
function ApplyTag(g,t){
	var C=document.getElementsByClassName('selected');
	var row=g.getAttribute('rows');
	for(var ele of C)
	{
		var pos=new XY(
			ele.parentElement.getAttribute('x'),
			ele.parentElement.getAttribute('y'));
		Tags.set(XYtoNAR(pos,row).print(true),t);
	}
	for(var ele of C)
		ele.classList.remove('selected');
	return GenCode(g);
}
