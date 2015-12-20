sokoban = 
{
  div:null,
  x:0,
  y:0,

  currentx:0,
  currenty:0,
  targetx:0,
  targety:0,

  // public
  onLoad:function()
  {
    var iDiv = document.createElement('div');
    iDiv.innerHTML = this.build();
    iDiv.style.position = "absolute";
    iDiv.style.left = "-120px";
    iDiv.style.top = "220px";
    document.getElementsByTagName('body')[0].appendChild(iDiv);

    var iDiv = document.createElement('div');
    iDiv.style.position = "absolute";
    iDiv.style.width = "83px";
    iDiv.style.height = "84px";
    iDiv.style.background = "url(chicken.gif)";
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    this.div = iDiv;
 
    this.updatePosition();
    this.copyPosition();

    document.getElementById("welcome").innerHTML = "Sokoban, build 5"; //navigator.userAgent;

    setInterval(function()
    {
      sokoban.convergePosition();
    }, 1000/30);
     
  },

  move:function(dx, dy)
  {
    var newobj = this.getmap(this.x + dx, this.y + dy);
    var advobj = this.getmap(this.x + dx*2, this.y + dy*2);
    if ( (newobj == "*" || newobj == "0") && (advobj == "." || advobj == "O") )
    {
      this.setBlock(this.x + dx, this.y + dy, newobj == "*" ? "." : "O");
      this.setBlock(this.x + dx*2, this.y + dy*2, advobj == 'O' ? '0' : '*');
      var newobj = this.getmap(this.x + dx, this.y + dy);
    }

    if ( newobj != "." && newobj != "O" && newobj != "S" )
      return;
  
    this.x += dx;
    this.y += dy;
    this.updatePosition();
  },

  // private
  copyPosition:function()
  {
    this.currentx = this.targetx;
    this.currenty = this.targety;
  },

  convergePosition:function()
  {
    this.currentx = this.currentx * 0.6 + this.targetx * 0.4;
    this.currenty = this.currenty * 0.6 + this.targety * 0.4;
    this.div.style.left = this.currentx.toFixed(1) + "px";
    this.div.style.top = this.currenty.toFixed(1) + "px";
  },

  setBlock:function(x, y, t)
  {
    var id = "blk_"+x+"_"+y+"_";
    var src = "free.gif";
    var flat = t == "." || t == "O";
    switch ( t )
    {
      case '.': src = "free.gif"; break;
      case '*': src = "block.gif"; break;
      case '0': src = "block1.gif"; break;
      case 'O': src = "dest.gif"; break;
    }

    document.getElementById(id + "b").style.display = flat ? "" : "none";
    document.getElementById(id + "t").style.display = flat ? "none" : "";
    document.getElementById(id + "l").style.display = flat ? "none" : "";
    document.getElementById(id + "r").style.display = flat ? "none" : "";
    document.getElementById(id + "b").src = src;
    document.getElementById(id + "t").src = src;
    document.getElementById(id + "l").src = src;
    document.getElementById(id + "r").src = src;
   
    this.setmap(x, y, t);
  },

  updatePosition:function()
  {
    var translate = 'scale(1, 0.5) rotate(-30deg) translate('+x*50+'px,'+y*50+'px)';

    var cosa = Math.cos(-30/180*Math.PI);
    var sina = Math.sin(-30/180*Math.PI);

    var x = this.x*50;
    var y = this.y*50;
    var nx = x * cosa - y * sina;
    var ny = x * sina + y * cosa;

    this. /*div.style.left*/ targetx = (-20 + -120 + nx); // + "px";
    this. /*div.style.top*/ targety = (-55 + 220 + ny*0.5); // + "px";


    var z = ((15-x)+y*16)*10 + 9;
    this.div.style.zIndex = z;
  },

  level: levels[0],

  getmap:function(x, y)
  {
    return this.level[y].charAt(x);
  },

  setmap:function(x, y, t)
  {
    this.level[y] = this.level[y].substr(0, x) + t + this.level[y].substr(x+1);
  },

  build:function()
  {
    var level = this.level;

    block = function(x, y, t)
    {
      var src = "free.gif";
      if ( t == '#' )
        src = "wall.gif";
      if ( t == '*' )
        src = "block.gif";
      if ( t == 'O' )
        src = "dest.gif";
      if ( t == 'S' )
      {
        sokoban.x = x;
        sokoban.y = y;
      }

      var translate = 'scale(1, 0.5) rotate(-30deg) translate('+x*50+'px,'+y*50+'px)';

      var z = ((15-x)+y*16)*10;
      var flat = t != "#" && t != "*";
      var id = "blk_"+x+"_"+y+"_";
      var alpha = (0.4+y/16/2 - x/19/3).toFixed(2);

      return '' + 
        '<img id="'+id+'b" src="'+src+'" style="opacity:'+alpha+'; width:50px; height:50px; position:absolute; display:' + (!flat ? 'none' : '') + '; z-index:'+(z+0)+'; -webkit-transform: '+translate+'">' +
        '<img id="'+id+'t" src="'+src+'" style="width:50px; height:50px; position:absolute; display:' + (flat ? 'none' : '') + '; z-index:'+(z+4)+'; -webkit-transform: '+translate+' translate(10px, -20px)">' +
        '<img id="'+id+'r" src="'+src+'" style="width:50px; height:50px; position:absolute; display:' + (flat ? 'none' : '') + '; z-index:'+(z+2)+'; -webkit-transform: '+translate+' skewX(-30deg) translate(13px,15px) scale(1, 0.5)">' +
        '<img id="'+id+'l" src="'+src+'" style="width:50px; height:50px; position:absolute; display:' + (flat ? 'none' : '') + '; z-index:'+(z+1)+'; -webkit-transform: '+translate+' skewY(-60deg) translate(-20px,-45px) scale(0.25, 1)">';
    }

    var lvl = "";
    for (var y=0; y<16; y++)
      for (var x=0; x<19; x++) 
        lvl += block(x, y, this.getmap(x,y));

    return lvl;
  }
};