const http = require('http');
const fs = require('fs');

var JavaScriptEncode = function(str){

    var hex=new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');

    // 转16进制
    function changeTo16Hex(charCode){
        return "\\x" + charCode.charCodeAt(0).toString(16);
    }

    function encodeCharx(original) {

        var found = true;
        var thecharchar = original.charAt(0);
        var thechar = original.charCodeAt(0);
        switch(thecharchar) {
            case '\n': return "\\n"; break; //newline
            case '\r': return "\\r"; break; //Carriage return
            case '\'': return "\\'"; break;
            case '"': return "\\\""; break;
            case '\&': return "\\&"; break;
            case '\\': return "\\\\"; break;
            case '\t': return "\\t"; break;
            case '\b': return "\\b"; break;
            case '\f': return "\\f"; break;
            case '/': return "\\x2F"; break;
            case '<': return "\\x3C"; break;
            case '>': return "\\x3E"; break;
            default:
                found=false;
                break;
        }
        if(!found){
            if(thechar > 47 && thechar < 58){ //数字
                return original;
            }

            if(thechar > 64 && thechar < 91){ //大写字母
                return original;
            }

            if(thechar > 96 && thechar < 123){ //小写字母
                return original;
            }

            if(thechar>127) { //大于127用unicode
                var c = thechar;
                var a4 = c%16;
                c = Math.floor(c/16);
                var a3 = c%16;
                c = Math.floor(c/16);
                var a2 = c%16;
                c = Math.floor(c/16);
                var a1 = c%16;
                return "\\u"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+"";
            }
            else {
                return changeTo16Hex(original);
            }

        }
    }

    var preescape = str;
    var escaped = "";
    for(var i=0; i < preescape.length; i++){
        escaped = escaped + encodeCharx(preescape.charAt(i));
    }
    return escaped;
}

const proxy = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(fs.readFileSync('./4.xss.html').toString().replace('{{replaceJs}}}' , "bbb'" + ";alert('xss')+'" ));
    // res.end(fs.readFileSync('./4.xss.html').toString().replace('{{replaceJs}}}' , JavaScriptEncode("bbb'" + ";alert('xss')+'" )));

}).listen(3000);


