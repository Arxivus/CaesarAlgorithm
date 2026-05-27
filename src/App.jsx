import { useRef, useState } from 'react'
import styles from './App.module.css'
import laurel from './assets/laurel.png'
import Select from 'react-select'
import { customStyles } from './selectStyles'
import runAlgorithm from './CaesarAlg'

const modeOptions = [
  { value: 'encrypt', label: 'Зашифровать текст' },
  { value: 'decrypt', label: 'Расшифровать текст' },
  { value: 'hack', label: 'Взломать зашифрованный текст' },
]

function App() {

  const [selectedMode, setSelectedMode] = useState('');
  const [text, setText] = useState('');
  const [shift, setShift] = useState(0);
  const [foundShift, setFoundShift] = useState()
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
    if (text == '') {
      alert('Нет текста!')
      return
    }

    if (!Number.isInteger(shift) && selectedMode != 'hack') {
      alert('Сдвиг должен быть целым числом!')
      return
    }

    if (selectedMode != '') {
      setFoundShift(undefined)

      const result = runAlgorithm(selectedMode, text, shift)
      setChangedText(result[0])

      if (result[1])
        setFoundShift(result[1])
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cipherBlock}>
        <div className={styles.title}>
          <img src={`${laurel}`} />
          <h1>Шифр Цезаря</h1>
          <img src={`${laurel}`} />
        </div>
        <p className={styles.description}>Здесь вы можете зашифровать расшифровать и взомать текст по алгоритму шифра Цезаря на кирилице или латинице </p>
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
          selectedMode == 'encrypt' || selectedMode == 'decrypt' ? (
            <div className={styles.setup}>
              <p>Укажите сдвиг (в количестве символов):</p>
              <input
                type="number"
                placeholder='0'
                step="1"
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
                onChange={(e) => setText(e.target.value.trim())}
              />
            </div>)
            :
            <></>
        }

        {
          text.length > 5 ?
            (
              <div className={styles.operationBtns}>
                <button onClick={handleRunClick}>
                  {selectedMode == 'encrypt' ? 'Зашифровать' : selectedMode == 'decrypt' ? 'Расшифровать' : 'Взломать'}
                </button>
                <button onClick={clearText}>Очистить поле</button>
              </div>
            )
            :
            <></>
        }

        {
          changedText != '' ?
            (<div>
              <p>Результат:</p>
              {foundShift ? (<p>Сдвиг: {foundShift}</p>) : <></>}
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
