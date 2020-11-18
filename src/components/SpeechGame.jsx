import React, { useState } from 'react';

function SpeechGame() {
  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('');
  const [result, setResult] = useState('');
  const [recognitionState, setRecognitionState] = useState('');
  const [isPhrase, setPhrase] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

  const phrases = [
    '도토리가 문을 도로록 드르륵 두루룩 열었는가? 드로록 도루륵 두르룩 열었는가?',
    '산골 찹쌀 촌 찹쌀 갯골 찹쌀 햇찹쌀',
    '서울특별시 특허허가과 허가과장 허과장',
    '신진 샹송가수의 신춘 샹송쇼',
    '육통통장 적금통장은 황색적금통장이고, 팔통통장 적금통장은 녹색적금통장이다.',
    '이병원 병원의 원장 이병원 원장의 이병원 원장 원장실에 들어가기 위한 원장실 키',
    '정말 정말 절망스런 종말',
    '한국관광공사 곽진광 관광과장',
    '안 촉촉한 초코칩 나라에 살던 안 촉촉한 초코칩이 촉촉한 초코칩 나라의 촉촉한 초코칩을 보고 촉촉한 초코칩이 되고 싶어서 촉촉한 초코칩 나라에 갔는데, 촉촉한 초코칩 나라의 촉촉한 문지기가 넌 촉촉한 초코칩이 아니고 안 촉촉한 초코칩이니까 안 촉촉한 초코칩 나라에서 살라고 해서 안 촉촉한 초코칩은 촉촉한 초코칩이 되는 것을 포기하고 안 촉촉한 눈물을 흘리며 안 촉촉한 초코칩 나라로 돌아갔다.',
    '슭곰발',
    '왕밤빵왕밤빵왕밤빵왕밤빵왕밤빵',
  ];

  const randomPhrase = () => {
    const number = Math.floor(Math.random() * phrases.length);
    return number;
  };

  const testSpeech = () => {
    setButtonText('게임이 진행 중 입니다.');

    const phrase = phrases[randomPhrase()];

    setPhrase(`${phrase}`);
    setResult('두구두구두구두구두구두구');
    setRecognitionState('...인식 중');

    const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.lang = 'ko';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = ev => {
      const speechResult = ev.results[0][0].transcript;

      setRecognitionState(`${speechResult}`);

      speechResult.split(' ').join('') === phrase.split(' ').join('')
        ? setResult('👍')
        : setResult('❌');
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setDisabled(false);
      setButtonText('다음');
    };

    recognition.onerror = ev => {
      setDisabled(false);
      setButtonText('error');
      setRecognitionState(`${ev.error}`);
    };
  };

  return (
    <div>
      {!isDisabled && <button onClick={testSpeech}>{buttonText || 'start Game'}</button>}
      <div>
        <p className='phrase'>{isPhrase}</p>
        <h3 className='result'>{result}</h3>
        <h1 className='output'>{recognitionState}</h1>
      </div>
    </div>
  );
}

export default SpeechGame;
