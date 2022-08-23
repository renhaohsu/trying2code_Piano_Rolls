// const synth = new Tone.Synth();
// synth.oscillator.type = "sine";
// synth.toMaster();

// const piano = document.getElementById("piano");

// piano.addEventListener("mousedown", e => {
//     synth.triggerAttack(e.target.dataset.note);
// });

// piano.addEventListener("mouseup", e => {
//     synth.triggerRelease();
// });


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

// function repeat(time) {
//   let step = index % (8*1);  // 一小節有8拍 (44拍 一格input是一個半拍)
//   for (let i = 0; i < $rows.length; i++) {
//     let synth = synths[i],
//         note = notes[i],
//         $row = $rows[i],
//         $input = $row.querySelector(`input:nth-child(${step+1})`);
//       //   console.log($input)
//     if ($input.checked) synth.triggerAttackRelease(note, '8n', time);
//   }
//   index++;
// }

function repeat(time) {
  let step = index % (8*4);  // 一小節有8拍 * 4個小節 (44拍 一格input是一個半拍)
  for (let i = 0; i < $rows.length; i++) {
    let synth = synths[i],
        note = notes[i];
    let $row = $rows[i].children[ step < 8 ? 0 : step < 16 ? 1 : step < 24 ? 2 : 3]
    let $input = $row.querySelector(`input:nth-child(${step%8+1})`)
    if ($input.checked) synth.triggerAttackRelease(note, '8n', time)
  }
  index++;
}