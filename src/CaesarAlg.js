import { replacements } from "./replacements"
import { alphabetsFrequencies } from "./frequencyDicts"

const alphabetsInString = {
  'cyrillic': 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
  'latin': 'abcdefghijklmnopqrstuvwxyz'
}

function runAlgorithm(mode, text, shift = 0) {
  let result = ['', undefined]
  const filteredText = text.replace(/[ёЁ!?.,@#%&*~'"<>/_-`^$(){}|+-=:;— \n0123456789]/g, match => replacements[match]).trim()

  if (text.length < 100 && mode == 'hack') {
      alert('Размер сообщения мал, могут быть неточности!')
    }

  if (mode == 'encrypt') {
    result[0] = leftShiftText(filteredText.toLowerCase(), -shift)

  } else if (mode == 'hack') {
    result = hackText(filteredText.toLowerCase()) 

  } else {
    result[0] = leftShiftText(filteredText.toLowerCase(), shift)
  }

  console.log(result);
  return result
}



function hackText(text) {
  let bestShift = 0;
  let bestScore = Infinity;
  let bestText = '';

  for (let shift = 0; shift < 33; shift++) { 

    const shiftedText = leftShiftText(text, shift);
    const frequencies = createFreqDict(shiftedText)
    const score = MLS(frequencies)

    if (score < bestScore) {
      bestScore = score;
      bestShift = shift;
      bestText = shiftedText;
    }
  }

  return [bestText, bestShift]
}


function leftShiftText(text, shift) {
  const shiftedArr = text.split('').map(char => {
    const alphabet = isLatin(char) ? alphabetsInString['latin'] : alphabetsInString['cyrillic']
    const charIndex = alphabet.indexOf(char);

    const normalShift = shift % alphabet.length

    return alphabet[(charIndex - normalShift + alphabet.length) % alphabet.length];
  });

  return shiftedArr.join('').replace(/.{5}/g, '$& ')
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