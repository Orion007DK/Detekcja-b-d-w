//returns text with parity bits 8bits of data + parity bit
export function encodeParity(textBits){
    let textWithControlData='';
    for(let i=0; i<textBits.length; i=i+8){
        let sum=0;
        for(let j=0;j<8;j++)
        {
            textWithControlData=textWithControlData+textBits[i+j]
            sum=sum+parseInt(textBits[i+j])
        }
        let controlData=sum%2;
        textWithControlData=textWithControlData+controlData;
    }
    return textWithControlData
}

export function encodeParityToShow(textBits){
    let textWithControlData='';
    for(let i=0; i<textBits.length; i=i+8){
        let sum=0;
        for(let j=0;j<8;j++)
        {
            textWithControlData=textWithControlData+textBits[i+j]
            sum=sum+parseInt(textBits[i+j])
        }
        let controlData=sum%2;
        textWithControlData=textWithControlData+" "+controlData+" ";
    }
    return textWithControlData
}


//returns decoded text
export function decodeParity(encodedText){
    if(encodedText.length<=0)
    return "";
    let text=''
    for(let i=0; i<encodedText.length; i=i+9)
        text=text+encodedText.substr(i, 8)

    console.log(text)
    return text
}

export function fixDataWithParityBit(encodedText){
    let errors=0;
    let textWithControlData='';
    let errorsTable = new Array(encodedText.length)
    for(let ii=0; ii<encodedText.length; ii++){
       errorsTable[ii]=0;
   }
    for(let i=0; i<encodedText.length; i=i+9){
        let sum=0;
        for(let j=0;j<8;j++)
        {
            textWithControlData=textWithControlData+encodedText[i+j]
            sum=sum+parseInt(encodedText[i+j])
        }
        let controlData=sum%2;
        if(controlData!=encodedText[i+8]){
            errors++;
            for(let j=i;j<i+9;j++)
            errorsTable[j]=1
        }
    }
    console.log(errorsTable)
    return [errors, errorsTable]
}