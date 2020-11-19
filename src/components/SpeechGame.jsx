import React, { useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

function SpeechGame({ user, socket }) {
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
    const phrase = phrases[randomPhrase()];

    setDisabled(true);
    setPhrase(`${phrase}`);
    setResult('두구두구두구두구두구두구');

    const grammar = `#JSGF V1.0; grammar phrase; public <phrase> = ${phrase};`;
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.lang = 'ko';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    const startGame = () => recognition.start();

    startGame();

    recognition.onaudiostart = () => {
      setRecognitionState('...인식중');
    };

    recognition.onspeechstart = () => {
      console.log(' speech capturing ');
    };

    const debounceFunc = _.debounce(result => {
      if(result.split(' ').join('') === phrase.split(' ').join('')) {
        setResult('👍');
        setButtonText('다음 문제');
        setDisabled(false);
      } else {
        setResult('다시 한번 말 해 주세요...');
        recognition.start();
      }
    }, 2000);

    recognition.onresult = ev => {
      const speechResult = ev.results[0][0].transcript;

      setRecognitionState(`${speechResult}`);

      debounceFunc(speechResult);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = ev => {
      setDisabled(true);
      setButtonText('error');
      setRecognitionState(`${ev.error}`);
    };
  };

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'column' }}>
      {isDisabled
        ? <button disabled>게임 중 입니다.</button>
        : <button onClick={testSpeech}>{buttonText || 'Start!!!!!'}</button>
      }
        <h1 style={{ color:'#292929'}} className='phrase'>{isPhrase}</h1>
        <div className='output'>
          <h3>{recognitionState}</h3>
        </div>
        <h3 style={{ fontSize:'30px'}}className='result'>{result}</h3>
      </div>
    </div>
  );
}

export default SpeechGame;

SpeechGame.propTypes = {
  user: PropTypes.object,
  socket: PropTypes.object,
};
