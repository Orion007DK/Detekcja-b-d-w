import testUtils from "react-dom/test-utils"
import * as utils from './utils.js'
//returns a text with Hamming control bits, 4 bits of data, 3 control bits
export function encodeHamming3_7(text){
    let codedText=''
    console.log(text)
    for(let i=0; i<text.length; i=i+4)
    {
        let c1=(parseInt(text[i])+parseInt(text[i+1])+parseInt(text[i+3]))%2
        let c2=(parseInt(text[i])+parseInt(text[i+2])+parseInt(text[i+3]))%2
        let c3=(parseInt(text[i+1])+parseInt(text[i+2])+parseInt(text[i+3]))%2
        codedText=codedText+c1+c2+text[i]+c3+text[i+1]+text[i+2]+text[i+3]
    }
    return codedText;
}

export function encodeHamming3_7ToShow(text){
    let codedText=''
    console.log(text)
    for(let i=0; i<text.length; i=i+4)
    {
        let c1=(parseInt(text[i])+parseInt(text[i+1])+parseInt(text[i+3]))%2
        let c2=(parseInt(text[i])+parseInt(text[i+2])+parseInt(text[i+3]))%2
        let c3=(parseInt(text[i+1])+parseInt(text[i+2])+parseInt(text[i+3]))%2
        //console.log("c1: "+c1+" c2: "+c2+" c3: "+c3)
        codedText=codedText+c1+c2+text[i]+c3+text[i+1]+text[i+2]+text[i+3]+" "
      //  console.log("txt: "+text[i]+text[i+1]+text[i+2]+text[i+3])
    }
    return codedText;
}

export function encodeHamming4_12(text){
    let codedText=''
    console.log(text)
    for(let i=0; i<text.length; i=i+8)
    {
        let c1=(parseInt(text[i])+parseInt(text[i+1])+parseInt(text[i+3])+parseInt(text[i+4])+parseInt(text[i+6]))%2
        let c2=(parseInt(text[i])+parseInt(text[i+2])+parseInt(text[i+3])+parseInt(text[i+5])+parseInt(text[i+6]))%2
        let c3=(parseInt(text[i+1])+parseInt(text[i+2])+parseInt(text[i+3])+parseInt(text[i+7]))%2
        let c4=(parseInt(text[i+4])+parseInt(text[i+5])+parseInt(text[i+6])+parseInt(text[i+7]))%2
      //  console.log("c1: "+c1+" c2: "+c2+" c3: "+c3+" c4: "+c4)
        codedText=codedText+c1+c2+text[i]+c3+text[i+1]+text[i+2]+text[i+3]+c4+text[i+4]+text[i+5]+text[i+6]+text[i+7]
    }
    return codedText;
}

export function decodeHamming3_7(encodedText){
    let decodedText='';
    for(let i=0; i<encodedText.length; i=i+7){
      decodedText=decodedText+encodedText[i+2]+encodedText[i+4]+encodedText[i+5]+encodedText[i+6]
    }
    return decodedText;
}

export function decodeHamming4_12(encodedText){
    let decodedText='';
    for(let i=0; i<encodedText.length; i=i+12){
      decodedText=decodedText+encodedText[i+2]+encodedText[i+4]+encodedText[i+5]+encodedText[i+6]+encodedText[i+8]
      +encodedText[i+9]+encodedText[i+10]+encodedText[i+11]
    }
    return decodedText;
}


    export function fixHamming(encodedText, TotalBlockLength){
        let fixedText=''
        let errorsNumber=0;
        let errorsTable = new Array(encodedText.length)
         for(let ii=0; ii<encodedText.length; ii++){
            errorsTable[ii]=0;
        }
        //wyznaczanie bloku
        for(let i=0; i<encodedText.length; i=i+TotalBlockLength){
        let encodedTextBlock=(encodedText.substr(i,TotalBlockLength))
        var mask = 0;
        //sprawdzanie poprawności
        for (let k = 0; k < TotalBlockLength; k++) {
            if (encodedTextBlock[k] == 1) 
                mask ^= k+1;  
        }

        if (mask != 0)  // wystąpił błąd
        {
            errorsTable[i+mask-1]=2; //oznaczenie poprawności bitów
            errorsNumber++ //zliczanie liczby błędów
            var ErrorBit = mask - 1;

            if (ErrorBit < encodedTextBlock.length)
            {
                       encodedTextBlock=utils.oppositeNumberFrom0(encodedTextBlock, ErrorBit)
            }
        }
           
        fixedText=fixedText+encodedTextBlock;
    }
    return [fixedText, errorsNumber, errorsTable]
}