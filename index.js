// 因為chrome等瀏覽器 要求有user行為 之後 才能發出聲音 所以加上這個
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

// 實體化七個音符的發聲物件
const synths = [ new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth()  ];

// 設定七個音符的音色 'sine弦波' (如果不設定聽起來像是普通的方波)
synths.forEach(e => e.oscillator.type = 'sine')

const gain = new Tone.Gain(0.6);
gain.toDestination();
synths.forEach(synth => synth.connect(gain));

// 播放loop
const $rows = document.body.querySelectorAll('.wrapper > .bar_wrapper'),
      notes = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
let index = 0;

Tone.Transport.scheduleRepeat(repeat, '8n');
Tone.Transport.start();

function repeat(time) {
  document.querySelectorAll("input[type=checkbox]").forEach(ele => ele.style.border = '' )

  let step = index % (8*4);  // 一小節有8拍 * 4個小節 (44拍 一格input是一個半拍)
  for (let i = 0; i < $rows.length; i++) {
    let synth = synths[i],
        note = notes[i];
    let $row = $rows[i].children[ step < 8 ? 0 : step < 16 ? 1 : step < 24 ? 2 : 3]
    let $input = $row.querySelector(`input:nth-child(${step%8+1})`)
    $input.style.border = '5px double rgb(69, 69, 44)'
    if ($input.checked) synth.triggerAttackRelease(note, '8n', time)
  }
  index++;
}

// reset button 把所有音符都關掉
const reset_button = document.querySelector(".reset.button")
reset_button.addEventListener('click', ()=>{
  document.querySelectorAll("input[type=checkbox]").forEach(ele => ele.checked = false )
})

// save buttom 存檔 並傳送到 mongoDB
const save_button = document.querySelector(".save.button")
save_button.addEventListener('click', ()=>{

  // 為了存到 mongodb  要先準備一個 json
  let piano_rolls_cookie = {
    si:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    la:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    sol: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fa:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mi:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    re:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dol:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }

  // 檢查整個鋼琴卷軸 把json格式填好
  notes_container = document.querySelectorAll('.bar_wrapper')
  for(let item of notes_container){
    let note_name = item.classList[0]
    for (let i=0; i<item.children.length; i++) {
      let bar = item.children[i]
      for (let j=0; j<bar.children.length; j++){
        piano_rolls_cookie[note_name][i*8+j] = bar.children[j].checked ? 1 : 0;
      }
    }
  }

  console.log(piano_rolls_cookie)
})





// si, la, sol, fa, mi, re, dol

// "si":  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "la":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "sol": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "fa":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "mi":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "re":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// "dol":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]