import { replacements } from "./replacements"
import { alphabetsFrequencies } from "./frequencyDicts"

const alphabetsInString = {
  'cyrillic': 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
  'latin': 'abcdefghijklmnopqrstuvwxyz'
}

function runAlgorithm(mode, text, shift = 0) {
  let resultText = ''
  if (text.length < 100) {
      alert('Размер сообщения мал, могут быть неточности!')
    }

  if (mode == 'encrypt') {
    resultText = encryptText(text.toLowerCase(), shift)

  } else resultText = decryptText(text.toLowerCase()) /*.replaceAll(' ', '')*/

  return resultText
}


function encryptText(text, shift) {
  const filteredText = text.replace(/[ёЁ!?.,@#%&*~'"<>/_-`^$(){}|+-=:;— \n0123456789]/g, match => replacements[match])
  let encryptedText = ''

  for (let index = 0; index < filteredText.length; index++) {
    let alphabet = ''
    let normalShift = shift
    let charIndex = 0

    const char = filteredText[index]

    if (isCyrillic(char)) {
      normalShift = shift % 32
      alphabet = alphabetsInString['cyrillic']
      charIndex = alphabet.indexOf(char)

    } else if (isLatin(char)) {
      normalShift = shift % 26
      alphabet = alphabetsInString['latin']
      charIndex = alphabet.indexOf(char)

    } else {
      break
    }

    encryptedText += (alphabet.at((charIndex + normalShift) % alphabet.length))

    if ((index + 1) != 0 && (index + 1) % 5 == 0) {
      encryptedText += ' '
    }
  }

  return encryptedText
}

function decryptText(text) {
  let bestShift = 0;
  let bestScore = Infinity;
  let bestText = '';

  for (let shift = 0; shift < 33; shift++) { 

    const shiftedText = shiftText(text, shift);
    const frequencies = createFreqDict(shiftedText)
    const score = MLS(frequencies)

    if (score < bestScore) {
      bestScore = score;
      bestShift = shift;
      bestText = shiftedText;
    }
  }

  return bestText
}




function shiftText(text, shift) {
  const shiftedArr = text.split('').map(char => {
    const alphabet = isLatin(char) ? alphabetsInString['latin'] : alphabetsInString['cyrillic']
    const charIndex = alphabet.indexOf(char);

    if (charIndex === -1) return char;
    return alphabet[(charIndex - shift + alphabet.length) % alphabet.length];
  });

  return shiftedArr.join('')
}


function createFreqDict(text) {
  const alphabet = alphabetsInString['latin'] + alphabetsInString['cyrillic']
  const currentFreqs = Object.fromEntries([...alphabet].map(char => [char, 0]));
  let total = 0;

  for (const char of text) {

    if (currentFreqs[char] !== undefined) {
      currentFreqs[char] += 1;
      total += 1;
    }
  }

  const frequencies = {};
  for (const char of alphabet) {
    frequencies[char] = total != 0 ? currentFreqs[char] / total : 0;
  }

  return frequencies;
}


function MLS(freqs) {

  let sum = 0;
  const expectedFreqs = alphabetsFrequencies

  for (const char in freqs) {

    const diff = freqs[char] - (expectedFreqs[char] || 0);
    sum += diff * diff;
  }
  
  return sum;
}


const isCyrillic = (text) => {
  return /[а-яё]/i.test(text);
};

const isLatin = (text) => {
  return /[a-z]/i.test(text);
};

const hasNumbers = (text) => {
  return /[0-9]/i.test(text);
};


export default runAlgorithm