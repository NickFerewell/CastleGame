//tools, utilities
/*
class Utils{

    static Pi = 3.1415926535897932384;
    static Tau = 6.2831853071795864769;
    static degToRad = 0.0174532925199432957;
    static radToDeg = 57.2957795130823208767;

    Dist(from, to){
        return Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2);
    }
    Sub(from, what){
        return {x: from.x - what.x, y: from.y - what.y};
    }
    Add(term1, term2){
        return {x: term1.x + term2.x, y: term1.y + term2.y};
    }
    Mult(what, times){
        return {x: what.x * times, y: what.y * times};
    }
    Magnitude(vec){
        return Math.sqrt(vec.x**2 + vec.y**2);
    }
    Div(vec, times){
        if(times != 0){
            return {x: vec.x / times, y: vec.y / times};
        } else return {x: 0, y: 0}
    }
    Div2(vec, times){
        return this.ChangeMag(vec, this.Magnitude(vec)/times);
    }
    ChangeMag(vec, newMag){
        return this.Mult(vec, newMag/this.Magnitude(vec));
    }
    ChangeMagByRot(vec, newMag){
        var angle = Math.atan2(vec.y, vec.x); //arctg2
        return {x: newMag * cos(angle), y: newMag * sin(angle)};
    }
    Normalize(vec){
        var mag = this.Magnitude(vec);
        if(mag != 0){
            return this.Div(vec, this.Magnitude(vec));
        } else return {x: 1, y: 1};
    }

    Heading(vec){
        return Math.atan2(vec.y, vec.x);
    }

    ScalarMult(vec1, vec2){ //dot product
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    SqrtOfVec(vec){
        return this.Div(vec, sqrt(this.Magnitude(vec)));
    }

    SqrtOfVec2(vec){
        return this.ChangeMag(vec, sqrt(this.Magnitude(vec)));
    }

    SqrOfVec(vec){
        return this.Mult(vec, this.Magnitude(vec));
    }

    SqrOfVec2(vec){
        return this.ChangeMag(vec, this.Magnitude(vec)**2);
    }

    SqrOfVec3(vec){
        // return this.ScalarMult(vec, vec);
        // return this.Magnitude(vec)**2;
        return vec.x**2 + vec.y**2;
    }

    ChangeDir(vec, angle){
        var mag = this.Magnitude(vec);
        return NewVec(mag * sin(angle), mag * cos(angle));
    }

    ChangeDirToVec(vec, vecTo){
        return this.Mult(vecTo, this.Magnitude(vec)/this.Magnitude(vecTo));
    }

    VecfromAngle(length, angle){
        return{x: length * cos(angle), y: length * sin(angle)};
    }

    // VecFromVec()

    RotateVec(vec, angle){
        return {x: vec.x * cos(angle)  - vec.y * sin(angle), y: vec.x * sin(angle) + vec.y * cos(angle)};
    }

    CrossProduct(vec1, vec2){
        return vec1.x*vec2.y - vec1.y*vec2.x;
    }

    Copy(vec){
        return {x: vec.x, y: vec.y};
    }

    clamp(x, min, max){
        return Math.max(min, Math.min(x, max) );
    }

    drawArrow(base, vec, Color = "red") {
      push();
      stroke(Color);
      strokeWeight(3);
      fill(Color);
      translate(base.x, base.y);
      line(0, 0, vec.x, vec.y);
      rotate(this.Heading(vec));
      let arrowSize = 7;
      translate(this.Magnitude(vec) - arrowSize, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }

    drawArrowWithName(base, vec, name = " ", Color = "red", size = 1){
        push();
        scale(size)
        stroke(Color);
        strokeWeight(3);
        fill(Color);
        translate(base.x / size, base.y / size);
        line(0, 0, vec.x, vec.y);
        rotate(this.Heading(vec));
        let arrowSize = 7;
        translate(this.Magnitude(vec) - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        translate(0, 10)
        rotate(-this.Heading(vec));
        scale(1.2);
        stroke(0);
        strokeWeight(1);
        text(name, 0, 0)
        pop();
    }

    lerp(a, b, i){
        return (1 - i) * a + i * b;
    }

    lerp1(a, b, x){
        return a + x * (b-a);
    }

    Extend(obj, deep) {
        var argsStart,
            args,
            deepClone;

        if (typeof deep === 'boolean') {
            argsStart = 2;
            deepClone = deep;
        } else {
            argsStart = 1;
            deepClone = true;
        }

        for (var i = argsStart; i < arguments.length; i++) {
            var source = arguments[i];

            if (source) {
                for (var prop in source) {
                    if (deepClone && source[prop] && source[prop].constructor === Object) {
                        if (!obj[prop] || obj[prop].constructor === Object) {
                            obj[prop] = obj[prop] || {};
                            this.Extend(obj[prop], deepClone, source[prop]);
                        } else {
                            obj[prop] = source[prop];
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        }
        
        return obj;
    };

    Clone(obj, deep) {
        return this.Extend({}, deep, obj);
    };

    MatrixMultByVec(matrix, vec){
        // matrix = 
        // [[a, b],
        //  [c, d]];
        return [matrix[0][0] * vec[0] + matrix[0][1] * vec[1], matrix[1][0] * vec[0] + matrix[1][1] * vec[1]];
    }

    MatrixMultByNum(matrix, num){
        for(var i = 0; i < matrix.length; i++){
           for(var j = 0; j < matrix[i].length; j++){
                matrix[i][j] *= num;
            };
        };
        return matrix;
    }

    MatrixDet(matrix){
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    MatrixTranspon(matrix){
        return [[matrix[0][0], matrix[1][0]], [matrix[0][1], matrix[1][1]]];
    }

    ReverseMatrix(matrix){
        var det = this.MatrixDet(matrix);
        var minorMatrix = 
        [[matrix[1][1], matrix[1][0]],
         [matrix[0][1], matrix[0][0]]];
        var algebraicAddition = 
        [[minorMatrix[0][0], -minorMatrix[0][1]],
         [-minorMatrix[1][0], minorMatrix[1][1]]];
        return this.MatrixMultByNum(this.MatrixTranspon(algebraicAddition), 1/det);
    }

    FastReverseMatrix(matrix){
        var det = this.MatrixDet(matrix);
        var aAT = [
        [matrix[1][1],-matrix[0][1]],
        [-matrix[1][0],matrix[0][0]]];
        return this.MatrixMultByNum(aAT, 1/det);
    }

    numDigits(x) {
      	return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    numAllDigits(x) {
    	x = Number(String(x).replace(/[^0-9]/g, ''));
      	return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    truncateDecimals(number, digits) {
        var multiplier = Math.pow(10, digits),
            adjustedNum = number * multiplier,
            truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

        return truncatedNum / multiplier;
    };

    vectorLerp(vec1, vec2, i){
    	return this.Sub(this.Mult(vec1, 1-i),this.Mult(vec2, i));
    }

    vectorLerp2(vec1, vec2, i){
    	return {x: lerp(vec1.x, vec2.x, i), y: lerp(vec1.y, vec2.y, i)};
    }

    // randouble(low, high){
    //     return random() * (high - low) + low;
    // }
    getRandomInt(max) { //max is excluded
        return Math.floor(Math.random() * max);
    }

    nonlin(x){ //nonlinear 0 < y < 1 from any x. x = 0, y = 0.5
        return 1/(1+2.71828^(-x))
    }

    angleDiff(a, b){
        return math.abs((b - a + math.pi) % math.tau - math.pi)
    }

    angleDiffsg(a, b){
        return (b - a + this.Pi) % this.Tau - this.Pi;
    }

    degToRad(angle){
        return angle*this.Pi/180;
    }

    radToDeg(angle){
        return angle * this.radToDeg;
    }

    VecToString(vec){
        return "{"+vec.x+","+vec.y+"}";
    }

    IsVecsEqual(vec1, vec2){
        return vec1.x == vec2.x && vec1.y == vec2.y;
    }

    NewVec(x = 0, y = 0){
        return {x: x, y: y};
    }

    VecReverse(vec){
        return this.NewVec(-vec.x, -vec.y);
    }

    VecPerpL(vec){ //vector perpendicular on left to vec
        return this.NewVec(vec.y, -vec.x);
    }

    VecPerpL(vec){
        return this.NewVec(-vec.y, vec.x);
    }

    MirrorVec(vec){ //swap
        return this.NewVec(vec.y, vec.x);
    }

    RotateVec(vec, a){
        var c, s = math.cos(a), math.sin(a);
        return this.NewVec(vec.x*c - vec.y*s, vec.x*s + vec.y*c;
    }

    angleBetween(vec1, vec2){
        return this.Heading(this.Sub(vec2, vec1));
    }

    // projection of vec1 onto(from, out of) vec2
    rej(vec1, vec2){
        var p = this.Mult(vec2, this.ScalarMult(vec1, vec2) / this.ScalarMult(vec2, vec2));
        return this.Sub(vec1, p);
    }

    proj(vec1, vec2){
      return this.Mult(vec1, this.ScalarMult(vec1, vec2) / this.ScalarMult(vec2, vec2));
    }

    DistSqr(vec){
        return vec1.x*vec1.x + vec2.y*vec2.y;
    }

    fromPolar(r, a){ //fromAngle
        this.NewVec(r*cos(a), r*sin(a));
    }

    toPolar(vec){
        this.NewVec(this.Magnitude(vec), this.Heading(vec));
    }

    unpack(vec){ //toArray
      return [vec.x, vec.y];
    }

//     function vector:rdist(v, x)
//   x = x or math.tau
//   local a, b = math.min(self.x, v.x) % x, math.max(self.x, v.x) % x
//   local xd = math.min(b - a, a - b + x)
//   return math.sqrt((xd)^2 + (v.y-self.y)^2)
// end

// function vector:rdistp(v, x)
//   x = x or math.tau
//   local a, b = math.min(self.x, v.x) % x, math.max(self.x, v.x) % x
//   local xd = math.min(b - a, a - b + x)
//   return math.sqrt((xd*math.pi)^2 + (v.y-self.y)^2)
// end

}
*/


//Из Tools,Utilities,Instruments lib. Надо постоянно обновлять этот файл, чтобы он совпадал с тем.
class Utilities{
    //Всякие константы:
    static Pi = 3.1415926535897932384;
    static Tau = 6.2831853071795864769;
    static degToRad = 0.0174532925199432957;
    static radToDeg = 57.2957795130823208767;

    static CSS_COLOR_NAMES = [
      "AliceBlue",
      "AntiqueWhite",
      "Aqua",
      "Aquamarine",
      "Azure",
      "Beige",
      "Bisque",
      "Black",
      "BlanchedAlmond",
      "Blue",
      "BlueViolet",
      "Brown",
      "BurlyWood",
      "CadetBlue",
      "Chartreuse",
      "Chocolate",
      "Coral",
      "CornflowerBlue",
      "Cornsilk",
      "Crimson",
      "Cyan",
      "DarkBlue",
      "DarkCyan",
      "DarkGoldenRod",
      "DarkGray",
      "DarkGrey",
      "DarkGreen",
      "DarkKhaki",
      "DarkMagenta",
      "DarkOliveGreen",
      "DarkOrange",
      "DarkOrchid",
      "DarkRed",
      "DarkSalmon",
      "DarkSeaGreen",
      "DarkSlateBlue",
      "DarkSlateGray",
      "DarkSlateGrey",
      "DarkTurquoise",
      "DarkViolet",
      "DeepPink",
      "DeepSkyBlue",
      "DimGray",
      "DimGrey",
      "DodgerBlue",
      "FireBrick",
      "FloralWhite",
      "ForestGreen",
      "Fuchsia",
      "Gainsboro",
      "GhostWhite",
      "Gold",
      "GoldenRod",
      "Gray",
      "Grey",
      "Green",
      "GreenYellow",
      "HoneyDew",
      "HotPink",
      "IndianRed",
      "Indigo",
      "Ivory",
      "Khaki",
      "Lavender",
      "LavenderBlush",
      "LawnGreen",
      "LemonChiffon",
      "LightBlue",
      "LightCoral",
      "LightCyan",
      "LightGoldenRodYellow",
      "LightGray",
      "LightGrey",
      "LightGreen",
      "LightPink",
      "LightSalmon",
      "LightSeaGreen",
      "LightSkyBlue",
      "LightSlateGray",
      "LightSlateGrey",
      "LightSteelBlue",
      "LightYellow",
      "Lime",
      "LimeGreen",
      "Linen",
      "Magenta",
      "Maroon",
      "MediumAquaMarine",
      "MediumBlue",
      "MediumOrchid",
      "MediumPurple",
      "MediumSeaGreen",
      "MediumSlateBlue",
      "MediumSpringGreen",
      "MediumTurquoise",
      "MediumVioletRed",
      "MidnightBlue",
      "MintCream",
      "MistyRose",
      "Moccasin",
      "NavajoWhite",
      "Navy",
      "OldLace",
      "Olive",
      "OliveDrab",
      "Orange",
      "OrangeRed",
      "Orchid",
      "PaleGoldenRod",
      "PaleGreen",
      "PaleTurquoise",
      "PaleVioletRed",
      "PapayaWhip",
      "PeachPuff",
      "Peru",
      "Pink",
      "Plum",
      "PowderBlue",
      "Purple",
      "RebeccaPurple",
      "Red",
      "RosyBrown",
      "RoyalBlue",
      "SaddleBrown",
      "Salmon",
      "SandyBrown",
      "SeaGreen",
      "SeaShell",
      "Sienna",
      "Silver",
      "SkyBlue",
      "SlateBlue",
      "SlateGray",
      "SlateGrey",
      "Snow",
      "SpringGreen",
      "SteelBlue",
      "Tan",
      "Teal",
      "Thistle",
      "Tomato",
      "Turquoise",
      "Violet",
      "Wheat",
      "White",
      "WhiteSmoke",
      "Yellow",
      "YellowGreen",
    ];
    
    //document.gameVersion = document.querySelector('meta[name="gameVersion"]').content; //Чтобы не искать в интернетах, как получить значение аргумента, оставляю это здесь.

    /* //Отключяет контекстное меню на правую кнопку мыши.
    window.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);
    */

    /* //Делает скриншот (gameCanvas = document.getElementById("defaultCanvas0");)
    function saveScreenshot(){
        //console.log("processing screenshot");
        var dataURL = gameCanvas.toDataURL("image/png"); //image/jpeg
        var link = document.createElement("a");
        document.body.appendChild(link); // Firefox requires the link to be in the body :(
        link.href = dataURL;
        link.download = "screenshot.png"; //.jpg
        link.click();
        document.body.removeChild(link);
    }
    */

    /* Как пользоваться локальным хранилищем в браузере:
    localStorage.setItem("DEBUG_MODE", value); //Назначает переменной значение
    localStorage.getItem("DEBUG_MODE", value); //Получает от переменной значение
    */

    static Dist(from, to){
        return Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2);
    }
    static Sub(from, what){
        return {x: from.x - what.x, y: from.y - what.y};
    }
    static Add(term1, term2){
        return {x: term1.x + term2.x, y: term1.y + term2.y};
    }
    static Mult(what, times){
        return {x: what.x * times, y: what.y * times};
    }
    static Magnitude(vec){
        return Math.sqrt(vec.x**2 + vec.y**2);
    }
    static Div(vec, times){
        if(times != 0){
            return {x: vec.x / times, y: vec.y / times};
        } else return {x: 0, y: 0}
    }
    static Div2(vec, times){
        return myChangeMag(vec, myMagnitude(vec)/times);
    }
    static ChangeMag(vec, newMag){
        return myMult(vec, newMag/myMagnitude(vec));
    }
    static ChangeMagByRot(vec, newMag){
        var angle = Math.atan2(vec.y, vec.x); //arctg2
        return {x: newMag * cos(angle), y: newMag * sin(angle)};
    }
    static Normalize(vec){
        var mag = myMagnitude(vec);
        if(mag != 0){
            return myDiv(vec, myMagnitude(vec));
        } else return {x: 1, y: 1};
    }

    static Heading(vec){
        return Math.atan2(vec.y, vec.x);
    }

    static ScalarMult(vec1, vec2){ //dot product
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static SqrtOfVec(vec){
        return myDiv(vec, sqrt(myMagnitude(vec)));
    }

    static SqrtOfVec2(vec){
        return myChangeMag(vec, sqrt(myMagnitude(vec)));
    }

    static SqrOfVec(vec){
        return myMult(vec, myMagnitude(vec));
    }

    static SqrOfVec2(vec){
        return myChangeMag(vec, myMagnitude(vec)**2);
    }

    static SqrOfVec3(vec){
        // return myScalarMult(vec, vec);
        // return myMagnitude(vec)**2;
        return vec.x**2 + vec.y**2;
    }

    static ChangeDir(vec, angle){
        var mag = this.Magnitude(vec);
        return NewVec(mag * sin(angle), mag * cos(angle));
    }

    static ChangeDirToVec(vec, vecTo){
        return myMult(vecTo, myMagnitude(vec)/myMagnitude(vecTo));
    }

    static VecfromAngle(length, angle){
        return{x: length * cos(angle), y: length * sin(angle)};
    }

    static RotateVec(vec, angle){
        return {x: vec.x * cos(angle)  - vec.y * sin(angle), y: vec.x * sin(angle) + vec.y * cos(angle)};
    }

    static CrossProduct(vec1, vec2){
        return vec1.x*vec2.y - vec1.y*vec2.x;
    }

    static Copy(vec){
        return {x: vec.x, y: vec.y};
    }

    static clamp(x, min, max){
        return Math.max(min, Math.min(x, max) );
    }

    static drawArrow(base, vec, myColor = "red") {
      push();
      stroke(myColor);
      strokeWeight(3);
      fill(myColor);
      translate(base.x, base.y);
      line(0, 0, vec.x, vec.y);
      rotate(myHeading(vec));
      let arrowSize = 7;
      translate(myMagnitude(vec) - arrowSize, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
    }

    static drawArrowWithName(base, vec, name = " ", myColor = "red", size = 1){
        push();
        scale(size)
        stroke(myColor);
        strokeWeight(3);
        fill(myColor);
        translate(base.x / size, base.y / size);
        line(0, 0, vec.x, vec.y);
        rotate(myHeading(vec));
        let arrowSize = 7;
        translate(myMagnitude(vec) - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        translate(0, 10)
        rotate(-myHeading(vec));
        scale(1.2);
        stroke(0);
        strokeWeight(1);
        text(name, 0, 0)
        pop();
    }

    static lerp(a, b, i){
        return (1 - i) * a + i * b;
    }

    static Extend(obj, deep) { //Вроде бы не работает
        var argsStart,
            args,
            deepClone;

        if (typeof deep === 'boolean') {
            argsStart = 2;
            deepClone = deep;
        } else {
            argsStart = 1;
            deepClone = true;
        }

        for (var i = argsStart; i < arguments.length; i++) {
            var source = arguments[i];

            if (source) {
                for (var prop in source) {
                    if (deepClone && source[prop] && source[prop].constructor === Object) {
                        if (!obj[prop] || obj[prop].constructor === Object) {
                            obj[prop] = obj[prop] || {};
                            myExtend(obj[prop], deepClone, source[prop]);
                        } else {
                            obj[prop] = source[prop];
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        }
        
        return obj;
    };

    static Clone(obj, deep) {
        return myExtend({}, deep, obj);
    };

    static MatrixMultByVec(matrix, vec){
        // matrix = 
        // [[a, b],
        //  [c, d]];
        return [matrix[0][0] * vec[0] + matrix[0][1] * vec[1], matrix[1][0] * vec[0] + matrix[1][1] * vec[1]];
    }

    static MatrixMultByNum(matrix, num){
        for(var i = 0; i < matrix.length; i++){
           for(var j = 0; j < matrix[i].length; j++){
                matrix[i][j] *= num;
            };
        };
        return matrix;
    }

    static MatrixDet(matrix){
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    static MatrixTranspon(matrix){
        return [[matrix[0][0], matrix[1][0]], [matrix[0][1], matrix[1][1]]];
    }

    static ReverseMatrix(matrix){
        var det = myMatrixDet(matrix);
        var minorMatrix = 
        [[matrix[1][1], matrix[1][0]],
         [matrix[0][1], matrix[0][0]]];
        var algebraicAddition = 
        [[minorMatrix[0][0], -minorMatrix[0][1]],
         [-minorMatrix[1][0], minorMatrix[1][1]]];
        return myMatrixMultByNum(myMatrixTranspon(algebraicAddition), 1/det);
    }

    static FastReverseMatrix(matrix){
        var det = myMatrixDet(matrix);
        var aAT = [
        [matrix[1][1],-matrix[0][1]],
        [-matrix[1][0],matrix[0][0]]];
        return myMatrixMultByNum(aAT, 1/det);
    }

    static numDigits(x) {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    static numAllDigits(x) {
        x = Number(String(x).replace(/[^0-9]/g, ''));
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    static truncateDecimals(number, digits) {
        var multiplier = Math.pow(10, digits),
            adjustedNum = number * multiplier,
            truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

        return truncatedNum / multiplier;
    };

    static vectorLerp(vec1, vec2, i){
        return mySub(myMult(vec1, 1-i),myMult(vec2, i));
    }

    static vectorLerp2(vec1, vec2, i){
        return {x: lerp(vec1.x, vec2.x, i), y: lerp(vec1.y, vec2.y, i)};
    }
    // randouble(low, high){
    //     return random() * (high - low) + low;
    // }
    static getRandomInt(max) { //max is excluded
        return Math.floor(Math.random() * max);
    }

    static nonlin(x){ //nonlinear 0 < y < 1 from any x. x = 0, y = 0.5
        return 1/(1+2.71828^(-x))
    }

    static angleDiff(a, b){
        return math.abs((b - a + math.pi) % math.tau - math.pi)
    }

    static angleDiffsg(a, b){
        return (b - a + this.Pi) % this.Tau - this.Pi;
    }

    static degToRad(angle){
        return angle*this.Pi/180;
    }

    static radToDeg(angle){
        return angle * this.radToDeg;
    }

    static VecToString(vec){
        return "{"+vec.x+","+vec.y+"}";
    }

    static IsVecsEqual(vec1, vec2){
        return vec1.x == vec2.x && vec1.y == vec2.y;
    }

    static NewVec(x = 0, y = 0){
        return {x: x, y: y};
    }

    static VecReverse(vec){
        return this.NewVec(-vec.x, -vec.y);
    }

    static VecPerpL(vec){ //vector perpendicular on left to vec
        return this.NewVec(vec.y, -vec.x);
    }

    static VecPerpL(vec){
        return this.NewVec(-vec.y, vec.x);
    }

    static MirrorVec(vec){ //swap
        return this.NewVec(vec.y, vec.x);
    }

    static RotateVec(vec, a){
        var c = math.cos(a);
        var s = math.sin(a);
        return this.NewVec(vec.x*c - vec.y*s, vec.x*s + vec.y*c);
    }

    static angleBetween(vec1, vec2){
        return this.Heading(this.Sub(vec2, vec1));
    }

    // projection of vec1 onto(from, out of) vec2
    static rej(vec1, vec2){
        var p = this.Mult(vec2, this.ScalarMult(vec1, vec2) / this.ScalarMult(vec2, vec2));
        return this.Sub(vec1, p);
    }

    static proj(vec1, vec2){
      return this.Mult(vec1, this.ScalarMult(vec1, vec2) / this.ScalarMult(vec2, vec2));
    }

    static DistSqr(vec){
        return vec1.x*vec1.x + vec2.y*vec2.y;
    }

    static fromPolar(r, a){ //fromAngle
        this.NewVec(r*cos(a), r*sin(a));
    }

    static toPolar(vec){
        this.NewVec(this.Magnitude(vec), this.Heading(vec));
    }

    static unpack(vec){ //toArray
      return [vec.x, vec.y];
    }

    //Перевести позже:
    //     function vector:rdist(v, x)
    //   x = x or math.tau
    //   local a, b = math.min(self.x, v.x) % x, math.max(self.x, v.x) % x
    //   local xd = math.min(b - a, a - b + x)
    //   return math.sqrt((xd)^2 + (v.y-self.y)^2)
    // end

    // function vector:rdistp(v, x)
    //   x = x or math.tau
    //   local a, b = math.min(self.x, v.x) % x, math.max(self.x, v.x) % x
    //   local xd = math.min(b - a, a - b + x)
    //   return math.sqrt((xd*math.pi)^2 + (v.y-self.y)^2)
    // end

    static randFromArray(array){
        return array[int(random(array.length-1))];
    }

    static range(from, to, dif){
        let x=[];
        let i = from;
        x.push(i);
        do{
            i += dif;
            x.push(i);
        }while(i <= to * dif);
        return x;
    }

    static scaleRect(rect, dif){
        // if(dif > 0){
        //     dif = 1 / dif;
        // }
        // rect.w = (rect.w / 100) * dif;
        // rect.h = (rect.h / 100) * dif;
        // rect.x += rect.w / 2;
        // rect.y += rect.h / 2;
        let centerX = rect.x + (rect.w / 2);
        let centerY = rect.y + (rect.h / 2);
        rect.w = (rect.w / 100) * dif;
        rect.h = (rect.h / 100) * dif;
        rect.x = centerX - (rect.w / 2);
        rect.y = centerY - (rect.h / 2);
    }

    static getBBox(shape){
        let x = 0, y = 0, w = 0, h = 0;
        shape.forEach(point => {
            if(point.x < x){x = point.x};
            if(point.x > w){w = point.x};
            if(point.y < y){y = point.y};
            if(point.y > h){h = point.y};
        });
        return [x, y, w, h];
    }

    static inside(point, poly){
        let result = false;
        // console.log(point, poly);
        let j = poly.length - 1;
        // console.log(j);
        for (let i = 0; i < poly.length; i++) {
            if ( (poly[i].y < point.y && poly[j].y >= point.y || poly[j].y < point.y && poly[i].y >= point.y) &&
                (poly[i].x + (point.y - poly[i].y) / (poly[j].y - poly[i].y) * (poly[j].x - poly[i].x) < point.x) )
                result = !result;
            j = i;
        }
        // return true;
        return result;
    }

    static isPointInRect(rect, point){
        answer = false;
        if(point.x <= rect.x + rect.w && point.x >= rect.x && point.y <= rect.y + rect.h && point.y >= rect.y){
            answer = !answer;
        }
        return answer;
    }
    
    static checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
           // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    }

    static getRandomCSSColor(){
        return this.randFromArray(this.CSS_COLOR_NAMES);
    }

    /**
     * Convert an integer to a roman numeral
     * @param {number} num
     *      An integer number
     * @return {string|false}
     *      Returns false if not a valid (nonzero) number, or a roman numeral string
     */
    static romanize (num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                   "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }
}