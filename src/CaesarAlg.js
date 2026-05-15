import { replacements } from "./replacements"
import { alphabetsFrequencies } from "./frequencyDicts"

const alphabetsInString = {
  'cyrillic': 'абвгдежзийклмнопрстуфхцчшщъыьэюя',
  'latin': 'abcdefghijklmnopqrstuvwxyz'
}

function runAlgorithm(mode, text, shift = 0) {
  let resultText = ''
  const keyboardLayout = isCyrillic(text) && isLatin(text) ? 'mixed'
    : isCyrillic(text) ? 'cyrillic'
      : isLatin(text) ? 'latin'
        : 'unknown'

  if (keyboardLayout == 'mixed' || keyboardLayout == 'unknown') alert('Неизвестный или смешанный алфавит!')

  const normalShift = keyboardLayout == 'cyrillic' ? Math.abs(shift) % 32 : Math.abs(shift) % 26
  const alphabetFreqs = alphabetsFrequencies[keyboardLayout]

  if (mode == 'encrypt') {
    resultText = encryptText(text.toLowerCase(), shift, alphabetsInString[keyboardLayout])

  } else resultText = decryptText(text.toLowerCase(), alphabetFreqs, alphabetsInString[keyboardLayout])

  return resultText
}


function encryptText(text, shift, alphabet) {
  const filteredText = text.replace(/[ёЁ!?.,@#%&*~'"<>/_-`^$(){}|+-=:;— \n0123456789]/g, match => replacements[match])
  let encryptedText = ''

  for (let index = 0; index < filteredText.length; index++) {
    const char = filteredText[index]
    const charIndex = alphabet.indexOf(char)

    encryptedText += (alphabet.at((charIndex + shift) % alphabet.length))

    if ((index + 1) != 0 && (index + 1) % 5 == 0) {
      encryptedText += ' '
    }
  }

  return encryptedText
}

function decryptText(text, alphabetFreqs, alphabet) {
  let bestShift = 0;
  let bestScore = Infinity;
  let bestText = '';

  for (let shift = 0; shift < alphabet.length; shift++) {

    const shiftedText = shiftText(text, shift, alphabet);
    const frequencies = createFreqDict(shiftedText, alphabet)
    console.log(frequencies);
    const score = MLS(frequencies, alphabet, alphabetFreqs)

    if (score < bestScore) {
      bestScore = score;
      bestShift = shift;
      bestText = shiftedText;
    }
  }

  return bestText
}




function shiftText(text, shift, alphabet) {
  const shiftedArr = text.split('').map(char => {
    const charIndex = alphabet.indexOf(char);

    if (charIndex === -1) return char;
    return alphabet[(charIndex - shift + alphabet.length) % alphabet.length];
  });

  return shiftedArr.join('')
}


function createFreqDict(text, alphabet) {
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


function MLS(freqs, alphabet, expectedFreqs) {
  let sum = 0;
  for (const char of alphabet) {
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