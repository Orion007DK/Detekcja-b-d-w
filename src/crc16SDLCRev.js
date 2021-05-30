
    //CRC 16 SDLC Reverse
    function makeCRCTable() {
        let c;
        let crcTable = [];
        for (let n = 0; n < 256; n++) {
          c = n;
          for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0x8810 ^ (c >>> 1)) : (c >>> 1)); //0x8810 to odwrócone 0x0811
          }
          crcTable[n] = c;
        }
        return crcTable;
      }

      export function crc16SDLCRevCode(s) {
          
        let crcTable = makeCRCTable();
        var crc = 0xFFFF;
        var j, i;
      
        for (i = 0; i < s.length; i++) {
      
          let c = s.charCodeAt(i);
          if (c > 255) {
            throw new RangeError();
          }
          j = (c ^ (crc >> 8)) & 0xFF;
          crc = crcTable[j] ^ (crc << 8);
        }
      
        return ((crc ^ 0) & 0xFFFF);
      

      };