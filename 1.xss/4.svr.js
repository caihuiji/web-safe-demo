const http = require('http');
const fs = require('fs');

var spCharCodes = '[\\u0000-\\u001F]|\\u00F1|\\u000B|\\u000C|\\u00A0|\\uFEFF|\\u1680|\\u180E|[\\u2000-\\u200F]|\\u2028|\\u2029|\\u202F|\\u205F|\\u3000';
var norCharStr = '\'|"|>|<';

var JavaScriptEncode = (function(str){

    var norChar = '\\n|\\r|\\\\|'+norCharStr;
    var reg = new RegExp(norChar+'|'+spCharCodes, 'g');

    var escapeMap = {};
    norChar.split('|').forEach(function(str)
    {
        if (str == '<')
        {
            // 防</script> xss
            escapeMap[str] = '\\u003c';
        }
        else if (str.length == 1)
        {
            escapeMap[str] = '\\'+str;
        }
        else if (str.length == 2 && str[0] == '\\')
        {
            escapeMap[eval('"'+str+'"')] = str;
        }
    });

    function rp(str) {
        return escapeMap[str] || '\\u'+zeroize(str.charCodeAt(0).toString(16), 4, 0);
    }
    return function(str) {
        if (str === null || str === undefined || typeof str == 'function') return '';

        return (''+str).replace(reg, rp);
    };
}())

const proxy = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(fs.readFileSync('./4.xss.html').toString().replace('{{replaceJs}}}' , "bbb'" + ";alert('xss')+'" ));
    // res.end(fs.readFileSync('./4.xss.html').toString().replace('{{replaceJs}}}' , JavaScriptEncode("bbb'" + ";alert('xss')+'" )));

}).listen(3000);


