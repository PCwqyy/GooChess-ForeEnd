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

function CreateBoard(){
	for(let i=1;i<=rows*2-1;i++){
		row[i]=document.createElement('div');
		row[i].classList.add('row');
		cell[i]=new Array;
		if(i%2==0)
			row[i].classList.add('odd');
		for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
			cell[i][j]=document.createElement('div');
			cell[i][j].classList.add('cell');
			cell[i][j].style.transform="rotate(180deg)";
			if(i%2==1){
				cell[i][j].style.transform="rotate(0deg)";
				cell[i][j].classList.add('light');
			}
			if(i)
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