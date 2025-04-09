import {Grood,XY,NAR,Sleep} from "../Game.js";
const ROWS=12;
var GroodMian=new Grood(ROWS,document.getElementById('GroodMain'),()=>{});
var ScaleButt=document.getElementById('ScaleButt');
ScaleButt.addEventListener('click',()=>{
	GroodMian.element.classList.toggle('Scaled');
})
//Debug
Debug.Grood=GroodMian;
Debug.XY=XY;
Debug.NAR=NAR;
var DebugIdInput=document.getElementById('DebugId');
async function DebugFunc(){
	var Id=DebugIdInput.value;
	GroodMian.ClearChooses();
	if(Id=='Move')
	{
		GroodMian.PlaceChoos(new XY(10,3),'pawn',210);
		await GroodMian.AnimMove(new XY(10,3),new XY(17,5));
	}
	if(Id=='Shoot')
	{
		console.log('acbd');
		GroodMian.PlaceChoos(new XY(17,5),'pawn',210);
		await GroodMian.AnimMove(new XY(17,5),new XY(23,5),true);
	}
	if(Id=='Teleport')
	{
		GroodMian.PlaceChoos(new XY(10,5),'pawn',210);
		GroodMian.PlaceChoos(new XY(13,5),'portal',210);
		GroodMian.PlaceChoos(new XY(16,7),'portal',210);
		await GroodMian.AnimTeleport(new XY(10,5),new XY(13,5),new XY(16,7),new XY(18,4));
	}
	if(Id=='GooExplode')
	{	
		GroodMian.PlaceChoos(new XY(1,1),'pawn',0);
		GroodMian.PlaceChoos(new XY(2,1),'pawn',20);
		GroodMian.PlaceChoos(new XY(3,1),'pawn',40);
		GroodMian.PlaceChoos(new XY(3,2),'pawn',60);
		GroodMian.PlaceChoos(new XY(4,1),'pawn',80);
		GroodMian.PlaceChoos(new XY(4,2),'pawn',100);
		GroodMian.PlaceChoos(new XY(5,1),'pawn',120);
		GroodMian.PlaceChoos(new XY(5,2),'goobomb',140);
		GroodMian.PlaceChoos(new XY(5,3),'pawn',160);
		GroodMian.PlaceChoos(new XY(6,1),'pawn',180);
		GroodMian.PlaceChoos(new XY(6,2),'pawn',200);
		GroodMian.PlaceChoos(new XY(6,3),'pawn',220);
		GroodMian.PlaceChoos(new XY(7,1),'pawn',240);
		GroodMian.PlaceChoos(new XY(7,2),'pawn',260);
		GroodMian.PlaceChoos(new XY(7,3),'pawn',280);
		GroodMian.PlaceChoos(new XY(7,4),'pawn',300);
		await GroodMian.AnimExplode(new XY(5,2));
	}
}
Debug.Func=DebugFunc;
Debug.Sleep=Sleep;