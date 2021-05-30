import React from 'react';
import * as utils from '../utils.js';
import * as crc32 from '../crc32.js';
import * as crc16 from '../crc16.js';
import * as parityControl from '../parityControl.js';
import * as hammingCode from '../hammingCode';
import * as crc16SDLC from '../crc16SDLC';
import * as crc16SDLCRev from '../crc16SDLCRev';

const defaultState = {
  inputMessage: '',
  inputBits: '',
  inputWithControlData: '',
  inputWithWrongBits: '',
  wrongBits: '',
  outputBits: '',
  receivedData: '',
  receivedDataText: '',
  receivedDataCode: '',
  detectedErrorsNumber: '',
  realErrorsNumber: '',
  sendedDataSize: '',
  redundantDataSize: '',
  percentOfRedundantData: '',
  fixedDataCode: '',
  fixedText: '',
  wrongIndexes: [],
  errorsTable: [],
  inputWithControlDataToShow: '',
};

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithmType: 'crc16',
      ...defaultState,
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendSignal = this.sendSignal.bind(this);
    this.handleWrongBitSubmit = this.handleWrongBitSubmit.bind(this);
    this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
    this.handleGenerateSignalButtonClick = this.handleGenerateSignalButtonClick.bind(
        this);
    this.encode = this.encode.bind(this);

  }

  //wybór algorytmu
  onChangeRadioButton(event) {
    this.setState({algorithmType: event.target.value});
    this.clearVariables();
  }

  //generowanie sygnału
  handleGenerateSignalButtonClick(event) {
    let rand = Math.round(Math.random() * 1000 + 1000);
    this.setState(
        {inputMessage: String(rand), inputBits: utils.unpack(String(rand))});
  }

//obsługuje pole do wpisywania tekstu sygnału
  handleChange(event) {
    event.preventDefault();
    let name = event.target.name;
    this.setState({[name]: event.target.value});
    if (name === 'inputMessage') {
      this.setState({inputBits: utils.unpack(event.target.value)});
    }

  }

  encode(event) {
    event.preventDefault();
    if (this.state.inputMessage === '') {
      return;
    }
    let dataWithCode = null;
    let dataWithCodeToShow=null;
    switch (this.state.algorithmType) {
      case 'crc32':
        dataWithCode = (utils.dec2bin(
            crc32.crc32Code(this.state.inputMessage))) +
            utils.unpackWithoutSpaces(this.state.inputMessage);
            dataWithCodeToShow = (utils.dec2bin(
              crc32.crc32Code(this.state.inputMessage))) + " " +
              utils.unpackWithoutSpaces(this.state.inputMessage);
        break;
      case 'crc16':
        dataWithCode = (utils.dec2bin(
            crc16.crc16Code(this.state.inputMessage))) +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        dataWithCodeToShow = (utils.dec2bin(
            crc16.crc16Code(this.state.inputMessage))) + " " +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        break;
      case 'crc16sdlc':
        dataWithCode = (utils.dec2bin(
            crc16SDLC.crc16SDLCCode(this.state.inputMessage))) +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        dataWithCodeToShow = (utils.dec2bin(
            crc16SDLC.crc16SDLCCode(this.state.inputMessage))) + " " +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        break;
      case 'crc16sdlcrev':
        dataWithCode = (utils.dec2bin(
            crc16SDLCRev.crc16SDLCRevCode(this.state.inputMessage))) +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        dataWithCodeToShow = (utils.dec2bin(
            crc16SDLCRev.crc16SDLCRevCode(this.state.inputMessage))) + " " +
            utils.unpackWithoutSpaces(this.state.inputMessage);
        break;
      case 'parityControl':
        dataWithCode = parityControl.encodeParity(
            utils.unpackWithoutSpaces(this.state.inputMessage));
        dataWithCodeToShow=parityControl.encodeParityToShow(
          utils.unpackWithoutSpaces(this.state.inputMessage));
        break;
      case 'hammingCode':
        dataWithCode = hammingCode.encodeHamming3_7(
            utils.unpackWithoutSpaces(this.state.inputMessage));
        dataWithCodeToShow=hammingCode.encodeHamming3_7ToShow(
          utils.unpackWithoutSpaces(this.state.inputMessage));
        break;
    }

    this.setState({inputWithControlDataToShow: dataWithCodeToShow})
    this.setState({inputWithControlData: dataWithCode});
    this.setState({inputWithWrongBits: dataWithCode});
  }

  async sendSignal(event) {
    event.preventDefault();
    if (this.state.inputWithWrongBits === '') {
      return;
    }

    this.setState({receivedData: this.state.inputWithWrongBits});
    if (this.state.algorithmType === 'crc32') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            this.state.inputWithWrongBits.substr(32,
                this.state.inputWithWrongBits.length - 32)),
      });

      let calculatedCRC32Code = crc32.crc32Code(this.state.receivedDataText);
      let receivedCRC32Code = String(parseInt(text.substr(0, 32), 2));
      this.countDataForCRC(32);
      let errorsTable = new Array(this.state.inputWithWrongBits.length);

      if (String(calculatedCRC32Code) === String(receivedCRC32Code)) {
        this.setState({detectedErrorsNumber: 0});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 0;
        }
      } else {
        this.setState({detectedErrorsNumber: 1});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 1;
        }
      }
      this.setState({errorsTable: errorsTable});

      this.countErrors();
    } else if (this.state.algorithmType === 'crc16sdlc') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            this.state.inputWithWrongBits.substr(16,
                this.state.inputWithWrongBits.length - 16)),
      });
      let calculatedCRC16SLDCCode = crc16SDLC.crc16SDLCCode(
          this.state.receivedDataText);
      let receivedCRC16SDLCCode = String(parseInt(text.substr(0, 16), 2));
      this.countDataForCRC(16);
      let errorsTable = new Array(this.state.inputWithWrongBits.length);
      if (String(calculatedCRC16SLDCCode) === String(receivedCRC16SDLCCode)) {
        this.setState({detectedErrorsNumber: 0});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 0;
        }
      } else {
        this.setState({detectedErrorsNumber: 1});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 1;
        }
      }
      this.setState({errorsTable: errorsTable});
      this.countErrors();
    } else if (this.state.algorithmType === 'crc16sdlcrev') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            this.state.inputWithWrongBits.substr(16,
                this.state.inputWithWrongBits.length - 16)),
      });
      let calculatedCRC16SLDCRevCode = crc16SDLCRev.crc16SDLCRevCode(
          this.state.receivedDataText);
      let receivedCRC16SDLCRevCode = String(parseInt(text.substr(0, 16), 2));
      this.countDataForCRC(16);
      let errorsTable = new Array(this.state.inputWithWrongBits.length);
      if (String(calculatedCRC16SLDCRevCode) ===
          String(receivedCRC16SDLCRevCode)) {
        this.setState({detectedErrorsNumber: 0});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 0;
        }
      } else {
        this.setState({detectedErrorsNumber: 1});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 1;
        }
      }
      this.setState({errorsTable: errorsTable});
      this.countErrors();
    } else if (this.state.algorithmType === 'crc16') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            this.state.inputWithWrongBits.substr(16,
                this.state.inputWithWrongBits.length - 16)),
      });
      let calculatedCRC16Code = crc16.crc16Code(this.state.receivedDataText);
      let receivedCRC16Code = String(parseInt(text.substr(0, 16), 2));
      this.countDataForCRC(16);
      let errorsTable = new Array(this.state.inputWithWrongBits.length);
      if (String(calculatedCRC16Code) === String(receivedCRC16Code)) {
        this.setState({detectedErrorsNumber: 0});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 0;
        }
      } else {
        this.setState({detectedErrorsNumber: 1});
        for (let ii = 0; ii < this.state.inputWithWrongBits.length; ii++) {
          errorsTable[ii] = 1;
        }
      }
      this.setState({errorsTable: errorsTable});
      this.countErrors();
    } else if (this.state.algorithmType === 'parityControl') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            parityControl.decodeParity(this.state.inputWithWrongBits)),
      });
      let [errorsNumber, errorsTable] = parityControl.fixDataWithParityBit(
          this.state.inputWithWrongBits);

      this.setState(
          {detectedErrorsNumber: errorsNumber, errorsTable: errorsTable});
      this.countErrors();
      this.countRedundantDataForParity();
    } else if (this.state.algorithmType === 'hammingCode') {
      let text = this.state.inputWithWrongBits;
      await this.setState({
        receivedDataText: utils.asciiBinToString(
            hammingCode.decodeHamming3_7(this.state.inputWithWrongBits)),
      });
      let [fixedText, errorsNumber, errorsTable] = hammingCode.fixHamming(
          this.state.inputWithWrongBits, 7);
      this.setState({detectedErrorsNumber: errorsNumber});
      this.setState({errorsTable: errorsTable});
      if (errorsNumber > 0) {
        this.setState({fixedDataCode: fixedText});
        this.setState({
          fixedText: utils.asciiBinToString(
              hammingCode.decodeHamming3_7(fixedText)),
        });
      }
      this.countErrors();
      this.countRedundantDataForHammingCode(7, 4);
    }

  }

  countErrors() {
    if (this.state.inputWithControlData === this.state.inputWithWrongBits) {
      this.setState({realErrorsNumber: 0});
    } else {
      let errors = 0;
      for (let i = 0; i < this.state.inputWithWrongBits.length; i++) {
        if (this.state.inputWithControlData.charAt(i) !==
            this.state.inputWithWrongBits.charAt(i)) {
          this.state.wrongIndexes.push(i);
          errors++;
        }
      }
      this.setState({realErrorsNumber: errors});
    }
  }

  countDataForCRC(crcSize) {
    this.setState({sendedDataSize: this.state.inputWithWrongBits.length});
    this.setState({redundantDataSize: crcSize});
    this.setState({
      percentOfRedundantData: Math.round(
          100 * (crcSize / this.state.inputWithWrongBits.length)),
    });
  }

  countRedundantDataForParity() {
    this.setState({sendedDataSize: this.state.inputWithWrongBits.length});
    this.setState(
        {redundantDataSize: this.state.inputWithWrongBits.length / 9});
    this.setState({
      percentOfRedundantData: Math.round(100 *
          ((this.state.inputWithWrongBits.length / 9) /
              this.state.inputWithWrongBits.length)),
    });
  }

  countRedundantDataForHammingCode(TotalBlockLength, DataBlockLength) {
    this.setState({sendedDataSize: this.state.inputWithWrongBits.length});
    this.setState({
      redundantDataSize: ((this.state.inputWithWrongBits.length /
          TotalBlockLength) * (TotalBlockLength-DataBlockLength)),
    });
    this.setState({
      percentOfRedundantData: Math.round(100 * ((this.state.redundantDataSize) /
          this.state.inputWithWrongBits.length)),
    });
  }

  handleWrongBitSubmit(event) {
    event.preventDefault();
    let result = utils.oppositeNumber(this.state.inputWithWrongBits,
        this.state.wrongBits);
    this.setState({inputWithWrongBits: result});
  }

  clearVariables() {
    this.setState(defaultState);
  }

  changeBit(i) {
    this.setState({
      inputWithWrongBits: utils.oppositeNumber(this.state.inputWithWrongBits,
          i),
    });
  }

  render() {
    return (

        <div>
          <h2>Nadawanie sygnału</h2>
          <div className="radios" onChange={this.onChangeRadioButton}>
            <input type="radio" value="crc16" id="crc16"
                   name="algorithmTypeRadio"
                   defaultChecked/>
            <label htmlFor="crc16">CRC16</label>

            <input type="radio" value="crc32" id="crc32"
                   name="algorithmTypeRadio"/>
            <label htmlFor="crc32">CRC32</label>

            <input type="radio" value="crc16sdlc" id="SDLC"
                   name="algorithmTypeRadio"/>
            <label htmlFor="SDLC">SDLC</label>

            <input type="radio" value="crc16sdlcrev" id="SDLCRev"
                   name="algorithmTypeRadio"/>
            <label htmlFor="SDLCRev">SDLC Reverse</label>

            <input type="radio" value="hammingCode" id="hammingCode"
                   name="algorithmTypeRadio"/>
            <label htmlFor="hammingCode">kodowanie Hamminga</label>

            <input type="radio" value="parityControl" id="parityControl"
                   name="algorithmTypeRadio"/>
            <label htmlFor="parityControl">kontrola parzystości</label>
          </div>

          <form onSubmit={this.handleWrongBitSubmit}>

            <div className="label">
              Sygnał wejściowy:
            </div>
            <div>
              <input name="inputMessage" type="text"
                     value={this.state.inputMessage}
                     autoComplete="off"
                     onChange={this.handleChange}/>
              <button onClick={this.handleGenerateSignalButtonClick}>
                Wygeneruj losowy Sygnał
              </button>
            </div>
            <div className="label">
              Zapis bitowy sygnału wejściowego:
            </div>
            <div>
              <textarea value={this.state.inputBits} readOnly/>
            </div>
            <button onClick={this.encode}>Zakoduj</button>
            <br/>
            <br/>
            {this.state.inputWithWrongBits.length > 0 ? (
                <div>
                  <div className="label">
                    Sygnał do wysłania:
                  </div>
                  <code>
                    {this.state.inputWithControlDataToShow}
                  </code>
                  <br/>
                  <div className="label">
                    Sygnał z zakłóceniami:
                  </div>
                  <code>
                    {[...this.state.inputWithWrongBits].map((bit, index) => (
                        <span key={index} className={'' +
                        (bit === this.state.inputWithControlData.charAt(index) ?
                            'black' :
                            'red') + ' clickable'}
                              onClick={() => this.changeBit(
                                  index + 1)}>{bit}</span>
                    ))}
                  </code>
                  <br/>
                  <br/>
                  <div className="label">
                    Generacja zakłóceń:
                  </div>
                  Kliknij na wybrany bit w zapisie powyżej lub wprowadź numer
                  bitu: <input name="wrongBits"
                               type="number"
                               min="1"
                               max={this.state.inputWithControlData.length}
                               value={this.state.wrongBits}
                               onChange={this.handleChange}/>
                  &nbsp;
                  <input type="submit" className="bg-red" value="Zamień"/>
                  <br/>
                  <br/>
                  <button onClick={this.sendSignal}>Wyślij sygnał</button>
                </div>
            ) : (
                <div className="output">Zakoduj sygnał, aby wprowadzić
                  zakłócenia.</div>
            )}
          </form>
          <br/>
          <h2>Odbieranie sygnału</h2>

          {this.state.receivedData.length > 0 ? (
              <div className="output">
                <div>
                  Wyjście:<br/>
                  <code>
                    {[...this.state.receivedData].map((bit, index) => (
                        <span key={index} className={'' +
                        //(bit === this.state.inputWithControlData.charAt(index) ?
                        (this.state.errorsTable[index] === 0 ? 'green'
                            : this.state.errorsTable[index] === 1 ?
                                'orange' : 'red')}>{bit}</span>
                    ))}
                  </code>
                </div>

                {this.state.fixedDataCode.length > 0 ? (
                    <div>
                      Poprawione wyjście:<br/>
                      <code>{this.state.fixedDataCode}</code>
                    </div>
                ) : false}

                <div>
                  Odebrany tekst: {this.state.receivedDataText}
                </div>

                {this.state.fixedText.length > 0 ? (
                    <div>
                      Poprawiony tekst: {this.state.fixedText}
                    </div>
                ) : false}

                <table>
                  <tbody>
                  <tr>
                    <td>
                      Liczba wykrytych błędów:
                    </td>
                    <td>
                      {this.state.detectedErrorsNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Liczba wszystkich błędów:
                    </td>
                    <td>
                      {this.state.realErrorsNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Wielkość odebranych danych:
                    </td>
                    <td>
                      {this.state.sendedDataSize} bitów
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Wielkość wysłanych danych redundantnych:
                    </td>
                    <td>
                      {this.state.redundantDataSize} bitów
                      ({this.state.percentOfRedundantData} %)
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
          ) : (
              <div className="output">Oczekiwanie na przesłanie sygnału.</div>
          )}

        </div>
    );
  }

}

export default NameForm;
