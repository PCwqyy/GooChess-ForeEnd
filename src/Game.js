const RomeApl={
	1:'i',2:'ii',3:'iii',4:'iv',5:'v',
	6:'vi',7:'vii',8:'viii',9:'ix',10:'x',
	11:'xi',12:'xii',13:'xiii',14:'xiv'};
// 坐标
export class XY{
	constructor(x,y)
	{
		this.x=x;
		this.y=y;
	}
	print(){return `${this.x},${this.y}`;}
}
export class NAR{
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
		return `${this.num}, ${String.fromCharCode(96+this.alp)}, ${RomeApl[this.rom]}`;
	}
}
/** @returns {NAR} */
export function XYtoNAR(a,rows){
	return new NAR(
		Math.floor(a.x/2)+1,
		Math.floor((2*rows+2*a.y-a.x)/2),
		rows-a.y+1);
	}
/** @returns {XY} */
export function NARtoXY(a,rows){
	var b=new XY(2*a.num-2,rows-a.rom+1);
	if(2*rows+2*b.y-b.x!=2*a.alp)	b.x++;
	return b;
}

/** @param {String} type */
export function GetChoosIconPath(type){
	return `../../Icon/Chooses/${type}.svg`;
}

export class Choos{
	/** 
	 * @param {String} t type
	 * @param {NAR} p position
	 * @param {Number} h hue
	 */
	constructor(t,p,h)
	{
		this.type;
		this.hue;
		this.element=document.createElement('choos');
		this.SetType(t);
		this.SetHue(h);
		this.pos=p;
	}
	SetType(t){
		this.type=t;
		this.element.style.backgroundImage=`url(${GetChoosIconPath(t)})`;
	}
	/** @param {Number} h hue */
	SetHue(h){
		if(!h instanceof Number)
			return NaN;
		if(h==-1)
			this.element.style.filter=`brightness(2) grayscale(1)`;
		else
			this.element.style.filter=`hue-rotate(${h}deg)`
		this.hue=h;
	}
	Hide(){
		this.element.style.opacity='0';
	}
	Show(){
		this.element.style.opacity='1';
	}
}

// 布置棋盘
const Shooter={
	1:new XY(15,4),2:new XY(15,5),3:new XY(17,5),
	4:new XY(9,1),5:new XY(9,5),6:new XY(15,1),
	7:new XY(23,5),8:new XY(23,8),9:new XY(15,8)
};
const Side={num:'red',alp:'blue',rom:'yellow'};

export class Grood{
	constructor(rows,parentElement,clickFunc,game=true)
	{
		this.rows=rows;
		this.element=document.createElement('grood');
		this.chooses=new Array;
		/** @type {Array<Array<HTMLElement>>} */
		this.cells=new Array(this.rows*2);
		this.DrawGrood(game);
		parentElement.appendChild(this.element);
		this.element.addEventListener('click',clickFunc);
	}
	/**
	 * @param {boolean} game is in game 
	 */
	DrawGrood(game=true){
		this.element.setAttribute('rows',`${this.rows}`);
		var row=new Array(this.rows*2);
		for(let i=1;i<=this.rows*2-1;i++){
			row[i]=document.createElement('div');
			row[i].classList.add('row');
			this.cells[i]=new Array(this.rows);
			if(i%2==0)	row[i].classList.add('black');
			for(let j=1;j<=Math.floor((i-1)/2)+1;j++){
				this.cells[i][j]=document.createElement('cell');
				this.cells[i][j].setAttribute('x',`${i}`);
				this.cells[i][j].setAttribute('y',`${j}`);
				var preform=document.createElement('span');
				this.cells[i][j].appendChild(preform);
				if(game)
				{
					// 确定shooter
					for(var q in Shooter)
						if(Shooter[q].x==i&&Shooter[q].y==j){
							this.cells[i][j].classList.add('shooter');
							break;
						}
					// 确定三方位置
					var thisNar=XYtoNAR(new XY(i,j),this.rows);
					if(thisNar.num<=4)	this.cells[i][j].classList.add(Side.num);
					if(thisNar.alp<=4)	this.cells[i][j].classList.add(Side.alp);
					if(thisNar.rom<=4)	this.cells[i][j].classList.add(Side.rom);
				}
				row[i].appendChild(this.cells[i][j]);
			}
			this.element.appendChild(row[i]);
		}
		return;
	}
	/** @param {NAR|XY} pos */
	GetChoosIdByPos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var id=this.cells[pos.x][pos.y].getAttribute('choosId');
		return id;
	}
	/**
	 * @param {NAR|XY} pos
	 * @param {String} type
	 * @param {Number} hue
	 */
	PlaceChoos(pos,type,hue){
		if(pos instanceof XY)
			pos=XYtoNAR(pos,this.rows);
		if(this.GetChoosIdByPos(pos)!=undefined)
			return;
		var ch=new Choos(type,pos,hue);
		this.AppendChoos(ch);
	}
	/** @param {Choos} c */
	AppendChoos(c){
		var id=this.chooses.push(c);
		var pos=NARtoXY(c.pos,this.rows);
		this.cells[pos.x][pos.y].appendChild(c.element);
		this.cells[pos.x][pos.y].setAttribute('choosId',`${id-1}`);
	}
	/** @param {NAR|XY} pos */
	RemoveChoos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var id=tar.getAttribute('choosId');
		tar.removeChild(this.chooses[id].element);
		tar.setAttribute('choosId','-1');
		return id;
	}
	/** 带动画
	 * @param {NAR|XY} from
	 * @param {NAR|XY} to
	 */
	MoveChoos(from,to){
		if(from instanceof NAR)
			from=NARtoXY(from,this.rows);
		var id=this.GetChoosIdByPos(from);
		if(id==undefined||id=='-1')
			return 'No choos to move';
		if(to instanceof NAR)
			to=NARtoXY(to,this.rows);
		if(this.GetChoosIdByPos(to)!=undefined)
			return 'Already exist a choos';
		if(from==to)
			return 'You no move :(';
		var prefromer=document.createElement('choos');
		prefromer.style.backgroundImage=
			`url(${GetChoosIconPath(this.chooses[id].type)})`;
		prefromer.classList.add('prefromer');
		var fromPos=this.QueryClientPos(from);
		var toPos=this.QueryClientPos(to);
		prefromer.style.left=`${fromPos.x}px`;
		prefromer.style.top=`${fromPos.y}px`;
		this.element.appendChild(prefromer);
		this.chooses[id].Hide();
		setTimeout(()=>{
			prefromer.style.left=`${toPos.x}px`;
			prefromer.style.top=`${toPos.y}px`;
		},10);
		setTimeout(()=>{
			this.RemoveChoos(from);
			this.chooses[id].pos=XYtoNAR(to,this.rows);
			this.AppendChoos(this.chooses[id]);
			this.chooses[id].Show();
			this.element.removeChild(prefromer);
		},2000);
		return 'moved';
	}
	/** @param {NAR|XY} pos */
	QueryClientPos(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var measurer=document.createElement('choos');
		tar.appendChild(measurer);
		var posc=measurer.getBoundingClientRect();
		var posg=this.element.getBoundingClientRect();
		tar.removeChild(measurer);
		return {x:posc.x-posg.x,y:posc.y-posg.y};
	}
	/** @param {NAR|XY} pos */
	QueryCellCenter(pos){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		var tar=this.cells[pos.x][pos.y];
		var black=tar.parentElement.classList.contains('black');
		return {
			x:tar.offsetLeft-this.element.offsetLeft+tar.offsetWidth/2,
			y:tar.offsetTop-this.element.offsetTop+(black?1:2)/3*tar.offsetHeight,
		};
	}
	/** @param {NAR|XY} pos */
	SetSign(pos,...signs){
		if(pos instanceof NAR)
			pos=NARtoXY(pos,this.rows);
		for(var i of signs)
			this.cells[pos.x][pos.y].classList.add(i);
	}
};