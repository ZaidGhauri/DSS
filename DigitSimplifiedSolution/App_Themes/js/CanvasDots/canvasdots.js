$.fn.canvaDots = function (options) {
    this.options = {};
    this.options.speed = 2;
    this.options.sizeMultiplier = 0.5;
    this.options.showDirectionVector = false;
    this.options.showConnections = true;
    this.options.sizeDependConnections = false;
    this.options.magnetPowerDelimiter = 10;
    this.options.mouseReaction = true;
    this.options.randomBounceSides = true;
    this.options.fillCircles = false;
    this.options.moveDirection = 'random';
    this.options.dotsColor = [255,255,255,1];
    this.options.linesColor = [255,255,255];

    this.shapeCreated = false;
    this.callback;

    var self = this;

    var canvas, context;
    canvas = document.getElementById('myCanvas6');
    context = canvas.getContext('2d');

    var w, h, mx_distance;
    var delimiter = 0.4;

    this.attr('width', self.parent().innerWidth()).attr('height', self.parent().innerHeight());
    w = this.innerWidth();
    h = this.innerHeight();

    var specificArrays = [];
    var saOffsetX = 0;
    var saOffsetY = 0;

    var estimatedCount = Math.pow((w*h),delimiter);

    var in_array = function(needle, haystack, strict) {
        var found = false, key, strict = !!strict;
        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                found = true;
                break;
            }
        }
        return found;
    }

    var getSpeed = function(){
        return (Math.random()*(self.options.speed*2))-self.options.speed;
    };

    var getSpeedCorrection = function(){
        return getSpeed()/4;
    };

    var getSpeedCorrectionModule = function(){
        return getSpeedModule()/4;
    };

    var getSpeedModule = function(){
        return (Math.random()*self.options.speed);
    };

    var getConnections = function(dot, key){
        for(var i=key+1; i<dots.length; i++){
            var distance = Math.pow((Math.pow((dots[i]['x']-dot['x']),2)+Math.pow((dots[i]['y']-dot['y']),2)),0.5);
            if(distance<=mx_distance){
                if(self.options.showConnections)
                    createLine(dot['x'], dot['y'], dots[i]['x'], dots[i]['y'], distance);

                dots[key]['connections']++;
                dots[i]['connections']++;
            }
        }
    };

    var createLine = function(x,y,x1,y1, distance){
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x1,y1);

        var alpha = 1-(distance/mx_distance);
        context.strokeStyle="rgba("+self.options.linesColor[0]+", "+self.options.linesColor[1]+", "+self.options.linesColor[2]+", "+alpha+")";

        context.stroke();
    };

    var moveLines = function(){
        clearCanvas();
        var linesOnPosition = 0;
        var linesWithNecessaryPosition = 0;
        var necessaryPosition = false;
        for(var i=0; i<dots.length; i++){
            if(self.options.showConnections || self.options.sizeDependConnections)
                getConnections(dots[i], i);

            setPoint(dots[i]);
            dots[i]['connections']=0;

            switch (self.options.moveDirection){
                case 'up': dots[i]['y']+=dots[i]['s_y']; dots[i]['s_x']=0; break;
                case 'down': dots[i]['y']+=dots[i]['s_y']; dots[i]['s_x']=0; break;
                case 'left': dots[i]['x']+=dots[i]['s_x']; dots[i]['s_y']=0; break;
                case 'right': dots[i]['x']+=dots[i]['s_x']; dots[i]['s_y']=0; break;
                default: dots[i]['x']+=dots[i]['s_x'];
                    dots[i]['y']+=dots[i]['s_y']; break;
            }

            if(dots[i]['x'] >= w) {
                switch (self.options.moveDirection){
                    case 'right': dots[i]['x'] = 0; break;
                    default: dots[i]['x'] = w;
                        dots[i]['s_x']*=-1; break;
                }
                if(self.options.randomBounceSides || self.options.moveDirection!='random') {
                    dots[i]['s_x'] = getSpeed();
                    dots[i]['s_y'] = getSpeed();
                }
                if(self.options.moveDirection=='right')
                    dots[i]['y']=Math.ceil(Math.random()*h);
            }

            if(dots[i]['x'] <= 0) {
                switch (self.options.moveDirection){
                    case 'left':  dots[i]['x'] = w; ;break;
                    default:  dots[i]['x'] = 0;
                        dots[i]['s_x']*=-1; break;
                }
                if(self.options.randomBounceSides || self.options.moveDirection!='random') {
                    dots[i]['s_x'] = getSpeed();
                    dots[i]['s_y'] = getSpeed();
                }
                if(self.options.moveDirection=='left')
                    dots[i]['y']=Math.ceil(Math.random()*h);
            }

            if(dots[i]['y'] >= h) {
                switch (self.options.moveDirection){
                    case 'down':  dots[i]['y'] = 0; break;
                    default:  dots[i]['y'] = h;
                        dots[i]['s_y'] *= -1; break;
                }
                if(self.options.randomBounceSides || self.options.moveDirection!='random') {
                    dots[i]['s_y'] = getSpeed();
                    dots[i]['s_x'] = getSpeed();
                }

                if(self.options.moveDirection=='down')
                    dots[i]['x']=Math.ceil(Math.random()*w);
            }

            if(dots[i]['y'] <= 0) {
                switch (self.options.moveDirection){
                    case 'up': dots[i]['y'] = h; break;
                    default: dots[i]['y'] = 0;
                        dots[i]['s_y']*=-1; break;
                }
                if(self.options.randomBounceSides || self.options.moveDirection!='random') {
                    dots[i]['s_y'] = getSpeed();
                    dots[i]['s_x'] = getSpeed();
                }

                if(self.options.moveDirection=='up')
                    dots[i]['x']=Math.ceil(Math.random()*w);
            }

            if(!self.options.randomBounceSides && self.options.moveDirection!='random') {
                if ((dots[i]['s_y'] > self.options.speed || dots[i]['s_y'] == 0))
                    dots[i]['s_y'] = getSpeed();

                if ((dots[i]['s_x'] > self.options.speed || dots[i]['s_x'] == 0))
                    dots[i]['s_x'] = getSpeed();
            }

            switch (self.options.moveDirection){
                case 'up': dots[i]['s_y'] = Math.pow(Math.pow(dots[i]['s_y'],2),0.5)*-1; break;
                case 'down': dots[i]['s_y'] = Math.pow(Math.pow(dots[i]['s_y'],2),0.5); break;
                case 'left':  dots[i]['s_x'] = Math.pow(Math.pow(dots[i]['s_x'],2),0.5)*-1; break;
                case 'right': dots[i]['s_x'] = Math.pow(Math.pow(dots[i]['s_x'],2),0.5); break;
            }

            if(self.options.moveDirection=='random') {
                var magnet = checkMagnetDots(dots[i], i);

                if(dots[i]['r_x']>-1 && dots[i]['r_y']>-1){
                    if(!magnet){
                        necessaryPosition = true;
                        var dx = (dots[i]['r_x']+saOffsetX)-dots[i]['x'];
                        var dy = (dots[i]['r_y']+saOffsetY)-dots[i]['y'];
                        var distance = Math.sqrt((Math.pow(dx,2)+Math.pow(dy,2)));

                        dots[i]['s_x']=dx/mx_distance;
                        dots[i]['s_y']=dy/mx_distance;

                        if(dots[i]['s_x']>self.options.speed)
                            dots[i]['s_x']=self.options.speed;
                        if(dots[i]['s_x']<self.options.speed*(-1))
                            dots[i]['s_x']=self.options.speed*(-1);

                        if (dots[i]['s_y'] > self.options.speed)
                            dots[i]['s_y'] = self.options.speed;
                        if (dots[i]['s_y'] < self.options.speed * (-1))
                            dots[i]['s_y'] = self.options.speed * (-1);


                        if (distance < 10)
                            linesOnPosition++;
                    }
                    linesWithNecessaryPosition++;
                }
            }
        }

        if(necessaryPosition && linesOnPosition==linesWithNecessaryPosition) {
            this.shapeCreated = true;
            if(typeof(self.callback)=='function') {
                self.callback(linesOnPosition);
                self.callback = false;
            }
        }
    };

    var checkMagnetDots = function(dot, key){
        var magnets = false;
        for(var mkey in magnet_dots){
            var distance = Math.pow((Math.pow((magnet_dots[mkey]['x']-dot['x']),2)+Math.pow((magnet_dots[mkey]['y']-dot['y']),2)),0.5);

            if(distance<=mx_distance){
                magnets = true;
                if(dot['x']<magnet_dots[mkey]['x']) {
                    if(dot['y']<magnet_dots[mkey]['y'])
                        dots[key]['s_x'] -= (((1 - ((magnet_dots[mkey]['x'] - dot['x']) / mx_distance)) * (1 - ((magnet_dots[mkey]['y'] - dot['y']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                    else
                        dots[key]['s_x'] -= (((1 - ((magnet_dots[mkey]['x'] - dot['x']) / mx_distance)) * (1 - ((dot['y'] - magnet_dots[mkey]['y']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                } else {
                    if(dot['y']<magnet_dots[mkey]['y'])
                        dots[key]['s_x'] += (((1 - ((dot['x'] - magnet_dots[mkey]['x']) / mx_distance)) * (1 - ((magnet_dots[mkey]['y'] - dot['y']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                    else
                        dots[key]['s_x'] += (((1 - ((dot['x'] - magnet_dots[mkey]['x']) / mx_distance)) * (1 - ((dot['y'] - magnet_dots[mkey]['y']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                }

                if(dot['y']<magnet_dots[mkey]['y']) {
                    if(dot['x']<magnet_dots[mkey]['x'])
                        dots[key]['s_y'] -= (((1 - ((magnet_dots[mkey]['y'] - dot['y']) / mx_distance)) * (1 - ((magnet_dots[mkey]['x'] - dot['x']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                    else
                        dots[key]['s_y'] -= (((1 - ((magnet_dots[mkey]['y'] - dot['y']) / mx_distance)) * (1 - ((dot['x'] - magnet_dots[mkey]['x']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                } else {
                    if(dot['x']<magnet_dots[mkey]['x'])
                        dots[key]['s_y'] += (((1 - ((dot['y'] - magnet_dots[mkey]['y']) / mx_distance)) * (1 - ((magnet_dots[mkey]['x'] - dot['x']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                    else
                        dots[key]['s_y'] += (((1 - ((dot['y'] - magnet_dots[mkey]['y']) / mx_distance)) * (1 - ((dot['x'] - magnet_dots[mkey]['x']) / mx_distance))) * self.options.speed) / self.options.magnetPowerDelimiter;
                }
            }
        }
        return magnets;
    };

    var clearCanvas = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    var setPoint = function(dot){
        context.beginPath();
        context.strokeStyle = "rgba("+self.options.dotsColor[0]+", "+self.options.dotsColor[1]+", "+self.options.dotsColor[2]+", "+self.options.dotsColor[3]+")";
        var size = 2;
        if(self.options.sizeDependConnections){
            size = (dot['connections']*self.options.sizeMultiplier)+1;
        }
        context.arc(dot['x'],dot['y'],size,0,2*Math.PI);
        if(self.options.fillCircles){
            context.fillStyle = "rgba("+self.options.dotsColor[0]+", "+self.options.dotsColor[1]+", "+self.options.dotsColor[2]+", "+self.options.dotsColor[3]+")";
            context.fill();
        }
        context.stroke();

        if(self.options.showDirectionVector) {
            context.beginPath();
            context.moveTo(dot['x'], dot['y']);
            context.lineTo(dot['x'] + (dot['s_x'] * 10), dot['y'] + (dot['s_y'] * 10));
            context.strokeStyle = "rgba("+self.options.linesColor[0]+", "+self.options.linesColor[1]+", "+self.options.linesColor[2]+", 0.25)";
            context.stroke();
        }
    };

    for(var key in options)
        this.options[key] = options[key];

    if(this.options.speed<0)
        this.options.speed = 0;

    if(this.options.sizeMultiplier<0)
        this.options.sizeMultiplier = 0;

    if(typeof(this.options.showDirectionVector)!='boolean')
        this.options.showDirectionVector = false;

    if(typeof(this.options.showConnections)!='boolean')
        this.options.showConnections = true;

    if(typeof(this.options.sizeDependConnections)!='boolean')
        this.options.sizeDependConnections = false;

    if(typeof(this.options.mouseReaction)!='boolean')
        this.options.mouseReaction = true;

    if(typeof(this.options.randomBounceSides)!='boolean')
        this.options.randomBounceSides = true;

    if(this.options.magnetPowerDelimiter<0)
        this.options.magnetPowerDelimiter = 0;

    if(!in_array(this.options.moveDirection, ['up', 'down', 'left', 'right', 'random']))
        this.options.moveDirection = 'random';

    if(typeof(this.options.fillCircles)!='boolean')
        this.options.fillCircles = true;

    if(this.options.dotsColor.length!=4 || this.options.dotsColor[0]<0 || this.options.dotsColor[0]>255 || this.options.dotsColor[1]<0 || this.options.dotsColor[1]>255 || this.options.dotsColor[2]<0 || this.options.dotsColor[2]>255 || this.options.dotsColor[3]<0 || this.options.dotsColor[3]>1)
        this.options.dotsColor = [255,255,255,1];

    if(this.options.linesColor.length!=3 || this.options.linesColor[0]<0 || this.options.linesColor[0]>255 || this.options.linesColor[1]<0 || this.options.linesColor[1]>255 || this.options.linesColor[2]<0 || this.options.linesColor[2]>255)
        this.options.linesColor = [255,255,255];

    self = this;

    var dots =  [];
    for(var i=0; i<estimatedCount; i++){
        dots[i] = Array();
        dots[i]['s_x']=getSpeed();
        dots[i]['s_y']=getSpeed();
        dots[i]['x']=Math.ceil(Math.random()*w);
        dots[i]['y']=Math.ceil(Math.random()*h);
        dots[i]['r_x'] = -1;
        dots[i]['r_y'] = -1;
        dots[i]['connections'] = 0;
    }
    mx_distance = Math.pow((w*h),0.7)/dots.length;

    var magnet_dots = [];
    magnet_dots[0] = {};
    magnet_dots[0]['x'] = -1000;
    magnet_dots[0]['y'] = -1000;

    this.setSpeed = function(speed){
        if(parseInt(speed)>=0) {
            this.options.speed = parseInt(speed);
            return true;
        }
        return false;
    };

    this.setSizeDependConnections = function(sizeDependConnections){
        if(typeof(sizeDependConnections)=='boolean'){
            this.options.sizeDependConnections = sizeDependConnections;
            self = this;
            return true;
        }
        return false;
    };

    this.setSizeMultiplier = function(sizeMultiplier){
        if(parseFloat(sizeMultiplier)>=0) {
            this.options.sizeMultiplier = parseFloat(sizeMultiplier);
            self = this;
            return true;
        }
        return false;
    };

    this.setShowDirectionVector = function(showDirectionVector){
        if(typeof(showDirectionVector)=='boolean') {
            this.options.showDirectionVector = showDirectionVector;
            self = this;
            return true;
        }
        return false;
    };

    this.setShowConnections = function(showConnections){
        if(typeof(showConnections)=='boolean') {
            this.options.showConnections = showConnections;
            self = this;
            return true;
        }
        return false;
    };

    this.setMouseReaction = function(mouseReaction){
        if(typeof(mouseReaction)=='boolean') {
            this.options.mouseReaction = mouseReaction;
            if(!this.options.mouseReaction){
                magnet_dots[0]['x'] = -1000;
                magnet_dots[0]['y'] = -1000;
            }
            self = this;
            return true;
        }

        return false;
    };

    this.setRandomBounceSides = function(randomBounceSides){
        if(typeof(randomBounceSides)=='boolean') {
            this.options.randomBounceSides = randomBounceSides;
            self = this;
            return true;
        }
        return false;
    };

    this.setMoveDirection = function(moveDirection){
        if(in_array(moveDirection, ['up', 'down', 'left', 'right', 'random'])) {
            this.options.moveDirection = moveDirection;
            self = this;
            return true;
        }
        return false;
    };

    this.setFillCircles = function(fillCircles){
        if(typeof(fillCircles)!='boolean') {
            this.options.fillCircles = fillCircles;
            return true;
        }
        return false;
    };

    this.setDotsColor = function(dotsColor){
        if(dotsColor.length==4 && dotsColor[0]>=0 && dotsColor[0]<=255 && dotsColor[1]>=0 && dotsColor[1]<=255 && dotsColor[2]>=0 && dotsColor[2]<=255 && dotsColor[3]>=0 && dotsColor[3]<=1) {
            this.options.dotsColor = dotsColor;
            self = this;
            return true;
        }
        return false;
    };

    this.setLinesColor = function(linesColor){
        if(linesColor.length==3 && linesColor[0]<0 && linesColor[0]>255 && linesColor[1]<0 && linesColor[1]>255 && linesColor[2]<0 && linesColor[2]>255) {
            this.options.linesColor = linesColor;
            self = this;
            return true;
        }
        return false;
    };

    this.loadMagnetDots = function(dots){
        magnet_dots = [];
        magnet_dots[0] = {};
        magnet_dots[0]['x'] = -1000;
        magnet_dots[0]['y'] = -1000;

        for(var key=1; key<=dots.length; key++)
            magnet_dots[key]=dots[key-1];

        return true;
    }

    this.stopAnimation = function(){
        clearTimeout(this.timeout);
        return true;
    }

    this.startAnimation = function(){
        this.timeout = setInterval(function(){
            moveLines();
        },20);
        return true;
    }

    //TO DOCUMENTATION
    this.loadSpecificArray = function(id, array){
        specificArrays[id]=[];

        for(var key in array)
            specificArrays[id][key]=array[key];

        if(array.length>estimatedCount) {
            for(var i = Math.ceil(estimatedCount); i<array.length; i++){
                dots[i] = Array();
                dots[i]['s_x']=getSpeed();
                dots[i]['s_y']=getSpeed();
                dots[i]['x']=Math.ceil(Math.random()*w);
                dots[i]['y']=Math.ceil(Math.random()*h);
                dots[i]['r_x'] = -1;
                dots[i]['r_y'] = -1;
                dots[i]['connections'] = 0;
            }
            estimatedCount=array.length;
        }
        return true;
    }

    this.setSpecificArray = function(id, callback){
        this.destroytSpecificArrays();
        for(var key in specificArrays[id]){
            dots[key]['r_x']=specificArrays[id][key]['x'];
            dots[key]['r_y']=specificArrays[id][key]['y'];
        }
        this.callback = callback;
        self = this;
    }

    this.destroytSpecificArrays = function(){
        this.shapeCreated = false;
        for(var key in dots){
            if(dots[key]['r_x']!=-1 || dots[key]['r_y']!=-1) {
                dots[key]['r_x'] = -1;
                dots[key]['r_y'] = -1;
                dots[key]['s_x'] = getSpeed();
                dots[key]['s_y'] = getSpeed();
            }
        }
    }

    this.setSpecificArrayOffsetX = function(x){
        saOffsetX = Math.ceil(x);
    }

    this.setSpecificArrayOffsetY = function(y){
        saOffsetY = Math.ceil(y);
    }

    this.getStatusShape = function(){
        return this.shapeCreated;
    }

    $(window).resize(function(){
        self.attr('width', self.parent().innerWidth()).attr('height', self.parent().innerHeight());
        w = self.innerWidth();
        h = self.innerHeight();
        mx_distance = Math.pow((w*h),0.7)/dots.length;
        if(self.options.mouseReaction && self.options.moveDirection=='random') {
            magnet_dots[0]['x'] = Math.ceil(w / 2);
            magnet_dots[0]['y'] = Math.ceil(h / 2);
        }
    });

    this.mousemove(function(e){
        if(self.options.mouseReaction && self.options.moveDirection=='random') {
            magnet_dots[0]['x'] = e.offsetX;
            magnet_dots[0]['y'] = e.offsetY;
        }
    });

    this.startAnimation();

    return this;
};

//console.log('PLUGIN CANVASDOTS')
//console.log('BUY: http://codecanyon.net/item/canvas-dots/16227884');
//console.log('SEE EXMAPLE: http://canvasdots.cc.ua/');
