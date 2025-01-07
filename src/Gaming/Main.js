const RomeApl={1:'i',2:'ii',3:'iii',4:'iv',5:'v',6:'vi',7:'vii',8:'viii',9:'ix',10:'x',11:'xi',12:'xii',13:'xiii',14:'xiv'};

// 坐标
class XY{
	constructor(x,y)
	{
		this.x=x;
		this.y=y;
	}
	print(){return `${this.x},${this.y}`;}
}
class NAR{
	constructor(num,alp,rom)
	{
		this.num=num;
		this.alp=alp;
		this.rom=rom;
	}
	print(plain=false)
	{
		if(plain)
			return `${this.num},${this.alp},${this.rom}`;
		return `${this.num},${String.fromCharCode(96+this.alp)},${RomeApl[this.rom]}`;
	}
}
/** @returns {NAR} */
function XYtoNAR(a,rows){
	return new NAR(
		Math.floor(a.x/2)+1,
		Math.floor((2*rows+2*a.y-a.x)/2),
		rows-a.y+1);
	}
/** @returns {XY} */
function NARtoXY(a,rows){
	b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

// 布置棋盘
const Shooter={
	1:new XY(15,4),2:new XY(15,5),3:new XY(17,5),
	4:new XY(9,1),5:new XY(9,5),6:new XY(15,1),
	7:new XY(23,5),8:new XY(23,8),9:new XY(15,8)
};
const Side={num:'red',alp:'blue',rom:'yellow'};
/** @type {Array<Element>} */
var row=new Array;
/** @type {Array< Array<Element> >} */
var cell=new Array;

/** @param {HTMLElement} thisGrood 
  * @param {function} func 
  * @param {number} rows 
  * @param {boolean} game 
  */
function CreateBoard(thisGrood,func,rows,game=true){
	thisGrood.setAttribute('rows',`${rows}`);
	for(let i=1;i<=rows*2-1;i++){
		row[i]=document.createElement('div');
		row[i].classList.add('row');
		cell[i]=new Array;
		if(i%2==0)	row[i].classList.add('black');
		for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
			cell[i][j]=document.createElement('cell');
			cell[i][j].setAttribute('x',`${i}`);
			cell[i][j].setAttribute('y',`${j}`);
			if(game)
			{
				// 确定shooter
				for(q in Shooter)
					if(Shooter[q].x==i&&Shooter[q].y==j){
						cell[i][j].classList.add('shooter');
						break;
					}
				// 确定三方位置
				var thisNar=XYtoNAR(new XY(i,j),rows);
				if(thisNar.num<=4)	cell[i][j].classList.add(Side.num);
				if(thisNar.alp<=4)	cell[i][j].classList.add(Side.alp);
				if(thisNar.rom<=4)	cell[i][j].classList.add(Side.rom);
			}
			//点击事件
			cell[i][j].addEventListener('click',func);
			row[i].appendChild(cell[i][j]);
		}
		thisGrood.appendChild(row[i]);
	}
	return;
}

function QueryPos(x,y){
	if(typeof x==String)	x=Number(x);
	if(typeof y==String)	y=Number(y);
	var pos=cell[x][y].getBoundingClientRect();
	if(x%2==1)	return {left:pos.x+pos.width/2,top:pos.y+pos.height*2/3};
	else		return {left:pos.x+pos.width/2,top:pos.y+pos.height/3};
}

var MeasurerChoos=document.getElementById('measurerChoos');
/** @param {Element} ch choos */
function ChoosToCell(ch,x,y){
	var posh=MeasurerChoos.getBoundingClientRect();
	ch.style.left=`${QueryPos(x,y).left-posh.width/2}px`;
	ch.style.top=`${QueryPos(x,y).top-posh.height/2}px`;
}

function ScaleBoard(){
	Grood.classList.toggle("Scaled");
}
