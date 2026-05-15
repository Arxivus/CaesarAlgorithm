import { useRef, useState } from 'react'
import styles from './App.module.css'
import img from './assets/caesar.jpg'
import laurel from './assets/laurel.png'
import Select from 'react-select'
import { customStyles } from './selectStyles'
import runAlgorithm from './CaesarAlg'

const modeOptions = [
  { value: 'encrypt', label: 'Зашифровать текст' },
  { value: 'decrypt', label: 'Расшифровать текст' },
]

function App() {

  const [selectedMode, setSelectedMode] = useState('');
  const [text, setText] = useState('');
  const [shift, setShift] = useState(null);
  const [changedText, setChangedText] = useState('')

  const textRef = useRef(null)

  const clearText = () => {
    textRef.current.value = ''
    setText('')
  }

  const handleModeChange = (option) => {
    setSelectedMode(option.value)
  }

  const handleRunClick = () => {
    if (shift && selectedMode == 'encrypt' || selectedMode == 'decrypt') {
      const result = runAlgorithm(selectedMode, text, shift)
      setChangedText(result)
      console.log(result)

    } else alert('Введите значение сдвига!')
  }

  return (
    <div className={styles.wrapper}>
      <img className={styles.mainImg} src={`${img}`} />
      <div className={styles.cipherBlock}>
        <div className={styles.title}>
          <img src={`${laurel}`} />
          <h1>Шифр Цезаря</h1>
          <img src={`${laurel}`} />
        </div>
        <p className={styles.description}>Здесь вы можете зашифровать и расшифровать текст по алгоритму шифра Цезаря на кирилице или латинице </p>
        <div className={styles.setup}>
          <p>Выберите, что вы хотите сделать:</p>
          <Select
            placeholder={'Выберите...'}
            styles={customStyles}
            options={modeOptions}
            onChange={handleModeChange}
          ></Select>
        </div>
        {
          selectedMode == 'encrypt' ? (
            <div className={styles.setup}>
              <p>Укажите сдвиг (в количестве символов):</p>
              <input
                type="number"
                onChange={(e) => setShift(Number(e.target.value))}
              />
            </div>
          ) 
          : 
          (<div></div>)
        }
        {
          selectedMode != '' ?
            (<div>
              <textarea
                ref={textRef}
                className={styles.textInput}
                type="text"
                placeholder='Введите сюда текст...'
                onChange={(e) => setText(e.target.value)}
              />
            </div>)
            :
            <></>
        }

        {
          text.length > 5 ?
            (
              <div className={styles.operationBtns}>
                <button onClick={handleRunClick}>{selectedMode == 'encrypt' ? 'Зашифровать' : 'Расшифровать'}</button>
                <button onClick={clearText}>Очистить поле</button>
              </div>
            )
            :
            <></>
        }

        {
          changedText != '' ?
            (<div>
              <textarea
                className={styles.textInput}
                type="text"
                value={changedText}
                readOnly
              />
            </div>)
            :
            <></>
        }
      </div>
    </div>
  )
}

export default App
