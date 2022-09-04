document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

const synths = [ new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth()  ];

synths[0].oscillator.type = 'sine';
synths[1].oscillator.type = 'sine';
synths[2].oscillator.type = 'sine';
synths[3].oscillator.type = 'sine';
synths[4].oscillator.type = 'sine';
synths[5].oscillator.type = 'sine';
synths[6].oscillator.type = 'sine';

const gain = new Tone.Gain(0.6);
gain.toMaster();

synths.forEach(synth => synth.connect(gain));

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

const reset_button = document.querySelector(".reset_button")
reset_button.addEventListener('click', ()=>{
  document.querySelectorAll("input[type=checkbox]").forEach(ele => ele.checked = false )
})

// let trying2code_Piano_Rolls_cookie = {
//   si:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   la:  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   sol: [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   fa:  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   mi:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   re:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   do:  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// }

// // array 和 div > 4*div > 8*input 怎麼對應 ?
// for(let i=0; i<1; i++){
//   for(let j=0; j<trying2code_Piano_Rolls_cookie.do.length; j++){
//     let bar = Math.floor(j / 8); 
//     let $row = $rows[i].children[bar]
//     let input = $row.querySelector(`input:nth-child(${j%8+1})`)
//     console.log(input)
//   }
// }
