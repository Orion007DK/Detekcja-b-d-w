   export function oppositeNumber(string, index) {
        if(index<1 || index>string.length){
         return string;
        }
   
      let s =string.charAt(index-1);   
      if(s=='1')
       s=0;
      else if(s=='0')
       s=1;
       else return string;
      return string.substr(0, index-1)+ s + string.substr(index);
      }

      export function oppositeNumberFrom0(string, index) {
        if(index<0 || index>=string.length){
         return string;
        }
   
      let s =string.charAt(index);   
      if(s=='1')
       s=0;
      else if(s=='0')
       s=1;
       else return string;
      return string.substr(0, index)+ s + string.substr(index+1);
      }


   //Uważać, input musi być stringiem! wywoływać np. unpack(String(input))
   //wypisuje binarną wersję kodu ascii danego tekstu
   export function unpack(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      let bin = input[i].charCodeAt().toString(2);
      result += Array(8 - bin.length + 1).join('0') + bin + ' ';
    }

    return result;
  }

  export function unpackWithoutSpaces(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        let bin = input[i].charCodeAt().toString(2);
        result += Array(8 - bin.length + 1).join('0') + bin;
    }
    
    return result;
    }

      //convert dec to bin with leading zeros
  export function dec2bin(s){
    let x=s.toString(2)
    for(let i=0; i<x.length%8; i++)
      x="0"+x;
    return x;
  }

  export function asciiBinToString(s){
    let text='';
    console.log("Tekst: "+s)
    for(let i=0; i<s.length; i=i+8)
    {
      text=text+String.fromCharCode(parseInt(s.substr(i,8),2))
    }
    console.log("asciiText: "+text)
    return text;

  }

  export function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
