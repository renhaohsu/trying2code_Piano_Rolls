// 因為chrome等瀏覽器 要求有user行為 之後 才能發出聲音 所以加上這個
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

// 實體化七個音符的發聲物件
const synths = [new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth(), new Tone.Synth()];

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
  document.querySelectorAll("input[type=checkbox]").forEach(ele => ele.style.border = '')

  let step = index % (8 * 4);  // 一小節有8拍 * 4個小節 (44拍 一格input是一個半拍)
  for (let i = 0; i < $rows.length; i++) {
    let synth = synths[i],
      note = notes[i];
    let $row = $rows[i].children[step < 8 ? 0 : step < 16 ? 1 : step < 24 ? 2 : 3]
    let $input = $row.querySelector(`input:nth-child(${step % 8 + 1})`)
    $input.style.border = '5px double rgb(69, 69, 44)'
    if ($input.checked) synth.triggerAttackRelease(note, '8n', time)
  }
  index++;
}

// reset button 把所有音符都關掉
const reset_button = document.querySelector(".reset.button")
reset_button.addEventListener('click', () => {
  document.querySelectorAll("input[type=checkbox]").forEach(ele => ele.checked = false)
})

// save buttom 存檔 並傳送到 mongoDB
const save_button = document.querySelector(".save.button")
save_button.addEventListener('click', () => {

  // 為了存到 mongodb  要先準備一個 json
  let piano_rolls_cookie = {
    si: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    la: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    sol: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fa: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mi: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    re: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    dol: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }

  // 檢查整個鋼琴卷軸 把json格式填好
  notes_container = document.querySelectorAll('.bar_wrapper')
  for (let item of notes_container) {
    let note_name = item.classList[0]
    for (let i = 0; i < item.children.length; i++) {
      let bar = item.children[i]
      for (let j = 0; j < bar.children.length; j++) {
        piano_rolls_cookie[note_name][i * 8 + j] = bar.children[j].checked ? 1 : 0;
      }
    }
  }

  console.log(piano_rolls_cookie)

  // POST 到 mongoDB   修改自MDN https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // 複製 MDN 的 改了參數就work了 MDN萬歲
  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  postData("https://portfolio.zesterisk.repl.co/api/workouts/", piano_rolls_cookie).then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
  });

})


// 頁面載入時 去mongoDB抓第一筆json資料 填入鋼琴卷軸
document.addEventListener("DOMContentLoaded", function() {
  const fetchWorkouts = async () => {
    const response = await fetch('https://portfolio.zesterisk.repl.co/api/workouts/')
    const json = await response.json()

    if (response.ok) {
      // console.log(json[0])
      // 檢查整個鋼琴卷軸 把json格式填好
      notes_container = document.querySelectorAll('.bar_wrapper')
      for (let item of notes_container) {
        let note_name = item.classList[0]
        for (let i = 0; i < item.children.length; i++) {
          let bar = item.children[i]
          for (let j = 0; j < bar.children.length; j++) {
            bar.children[j].checked = (json[[json.length-1]][note_name][i * 8 + j] == 1);
          }
        }
      }

    }
  }
  fetchWorkouts()
});