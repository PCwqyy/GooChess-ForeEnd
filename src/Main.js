const Grood=document.getElementById('Grood');
const rows=12;
const RomeApl={1:'i',2:'ii',3:'iii',4:'iv',5:'v',6:'vi',7:'vii',8:'viii',9:'ix',10:'x',11:'xi',12:'xii',13:'xiii',14:'xiv'};

class XY{
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
}
class NAR{
	constructor(num,alp,rom){
		this.num=num;
		this.alp=alp;
		this.rom=rom;
	}
	print(){
		return `${this.num},${String.fromCharCode(96+this.alp)},${RomeApl[this.rom]}`;
	}
}
function XYtoNAR(a){
	return new NAR(
		Math.floor(a.x/2)+1,
		Math.floor((2*rows+2*a.y-a.x)/2),
		rows-a.y+1);
}
function NARtoXY(a){
	b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

var row=new Array;
var cell=new Array;
const Shooter={
	1:new XY(15,4),2:new XY(15,5),3:new XY(17,5),
	4:new XY(7,1),5:new XY(9,1),6:new XY(7,4),
	7:new XY(9,5),8:new XY(15,1),9:new XY(17,1),
	10:new XY(23,4),11:new XY(23,5),12:new XY(23,8),
	13:new XY(23,9),14:new XY(17,9),15:new XY(15,8)
};


function CreateBoard(){
	for(let i=1;i<=rows*2-1;i++){
		row[i]=document.createElement('div');
		row[i].classList.add('row');
		cell[i]=new Array;
		if(i%2==0)
			row[i].classList.add('black');
		for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
			cell[i][j]=document.createElement('div');
			cell[i][j].classList.add('cell');
			for(q in Shooter)
				if(Shooter[q].x==i&&Shooter[q].y==j){
					cell[i][j].classList.add('shooter');
					break;
				}
			var thisNar=XYtoNAR(new XY(i,j));
			if(thisNar.num<=4)	cell[i][j].classList.add('red');
			if(thisNar.alp<=4)	cell[i][j].classList.add('blue');
			if(thisNar.rom<=4)	cell[i][j].classList.add('yellow');
			row[i].appendChild(cell[i][j]);
			cell[i][j].addEventListener('click',()=>{
				console.log(`(${i},${j}) (${XYtoNAR(new XY(i,j)).print()})`);
			});
		}
		Grood.appendChild(row[i]);
	}
}

function ScaleBoard(){
	Grood.classList.toggle("Scaled");
}