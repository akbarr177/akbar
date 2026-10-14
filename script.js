const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();
$('#themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  $('#themeToggle').textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
});
const modal = $('#gameModal'), area = $('#gameArea'), title = $('#modalTitle');
let cleanupGame = null;
function openGame(name) {
  if (cleanupGame) { cleanupGame(); cleanupGame = null; }
  modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  const games = {number:'Tebak Angka',word:'Tebak Kata',rps:'Batu Gunting Kertas',memory:'Game Memori',runner:'Runner',tetris:'Tetris Mini'};
  title.textContent = games[name] || 'Mini Game';
  ({number:renderNumber,word:renderWord,rps:renderRPS,memory:renderMemory,runner:renderRunner,tetris:renderTetris}[name] || renderNumber)();
}
function closeGame() {
  if (cleanupGame) { cleanupGame(); cleanupGame=null; }
  modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
}
$('#closeModal').addEventListener('click',closeGame);
modal.addEventListener('click',e=>{if(e.target===modal)closeGame()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGame()});
$$('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));
function shell(html){area.innerHTML=`<div class="game-ui">${html}</div>`}
function message(txt){const m=$('.game-message');if(m)m.textContent=txt}
function renderNumber(){
 let secret=Math.floor(Math.random()*100)+1, tries=0;
 shell(`<p>Aku sudah memilih angka dari <b>1 sampai 100</b>. Coba tebak!</p><form id="guessForm"><input id="guessInput" type="number" min="1" max="100" placeholder="Masukkan angka..." required><button class="game-action">Tebak!</button></form><p id="guessTries">Kesempatan berjalan: 0</p><div class="game-message" aria-live="polite"></div><button class="game-action" id="restart">↻ Mulai Ulang</button>`);
 const form=$('#guessForm'), inp=$('#guessInput');
 form.addEventListener('submit',e=>{e.preventDefault();const n=Number(inp.value);if(n<1||n>100){message('Masukkan angka antara 1 dan 100 ya!');return}tries++;$('#guessTries').textContent=`Jumlah tebakan: ${tries}`;if(n===secret){message(`🎉 Benar! Angkanya ${secret}. Kamu berhasil dalam ${tries} tebakan!`);form.querySelector('button').disabled=true}else message(n<secret?'⬆️ Terlalu kecil! Coba angka lebih besar.':'⬇️ Terlalu besar! Coba angka lebih kecil.');inp.value='';inp.focus()});
 $('#restart').addEventListener('click',renderNumber);
}
function renderWord(){
 const words=[['KOMPUTER','Perangkat elektronik untuk mengolah data.'],['JARINGAN','Menghubungkan beberapa perangkat agar bisa berkomunikasi.'],['KEYBOARD','Alat untuk mengetik di komputer.'],['INTERNET','Jaringan global yang menghubungkan banyak perangkat.'],['MONITOR','Layar untuk menampilkan gambar dari komputer.'],['ROUTER','Perangkat untuk mengarahkan lalu lintas jaringan.']];
 let item=words[Math.floor(Math.random()*words.length)], guessed=[], wrong=0, max=6;
 function draw(){shell(`<p>Petunjuk: <b>${item[1]}</b></p><div style="text-align:center;font-size:28px;letter-spacing:5px;margin:20px 0">${[...item[0]].map(c=>guessed.includes(c)?c:'_').join(' ')}</div><p style="text-align:center">Kesalahan: ${wrong}/${max}</p><div class="choices">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c=>`<button class="choice-btn" style="font-size:15px;min-width:35px;padding:8px" data-letter="${c}" ${guessed.includes(c)||wrong>=max||[...item[0]].every(x=>guessed.includes(x))?'disabled':''}>${c}</button>`).join('')}</div><div class="game-message" aria-live="polite">${wrong>=max?'😅 Kesempatan habis. Kata yang benar: '+item[0]:[...item[0]].every(x=>guessed.includes(x))?'🎉 Hebat! Kamu berhasil menebak kata!':''}</div><button class="game-action" id="wordRestart">Kata Baru ↻</button>`);$$('[data-letter]').forEach(b=>b.addEventListener('click',()=>{const c=b.dataset.letter;guessed.push(c);if(!item[0].includes(c))wrong++;draw()}));$('#wordRestart').addEventListener('click',renderWord)}
 draw();
}
function renderRPS(){
 let score=[0,0,0];const options=[['batu','✊'],['kertas','✋'],['gunting','✌️']];
 shell(`<p style="text-align:center">Pilih jurusmu dan lawan komputer!</p><div class="choices">${options.map(([n,e])=>`<button class="choice-btn" data-rps="${n}" aria-label="${n}">${e}<small style="display:block;font-size:11px">${n}</small></button>`).join('')}</div><div class="game-message" aria-live="polite">Pilih batu, kertas, atau gunting.</div><p id="rpsScore" style="text-align:center;font-weight:900">Kamu 0 · Komputer 0 · Seri 0</p><button class="game-action" id="rpsReset">Reset Skor</button>`);
 const beats={batu:'gunting',gunting:'kertas',kertas:'batu'};
 $$('[data-rps]').forEach(b=>b.addEventListener('click',()=>{const you=b.dataset.rps, cpu=options[Math.floor(Math.random()*3)][0];let result;if(you===cpu){score[2]++;result='Seri!'}else if(beats[you]===cpu){score[0]++;result='🎉 Kamu menang!'}else{score[1]++;result='Komputer menang!'}message(`${you} vs ${cpu}. ${result}`);$('#rpsScore').textContent=`Kamu ${score[0]} · Komputer ${score[1]} · Seri ${score[2]}`}));
 $('#rpsReset').addEventListener('click',()=>{score=[0,0,0];$('#rpsScore').textContent='Kamu 0 · Komputer 0 · Seri 0';message('Skor direset. Ayo main lagi!')});
}
function renderMemory(){
 let symbols=['⭐','🌟','🐰','🌙','💜','🐱','🍀','🚀'], deck=[...symbols,...symbols].sort(()=>Math.random()-.5), flipped=[],matched=[],moves=0,locked=false;
 shell(`<p>Cari pasangan emoji yang sama. <b>Langkah: <span id="moves">0</span></b></p><div class="memory-board">${deck.map((x,i)=>`<button class="memory-card" data-card="${i}" aria-label="Kartu ${i+1}">?</button>`).join('')}</div><div class="game-message" aria-live="polite"></div><button class="game-action" id="memoryRestart">↻ Acak Ulang</button>`);
 const cards=$$('.memory-card');
 cards.forEach((c,i)=>c.addEventListener('click',()=>{if(locked||flipped.includes(i)||matched.includes(i))return;c.textContent=deck[i];c.classList.add('flipped');flipped.push(i);if(flipped.length===2){moves++;$('#moves').textContent=moves;const [a,b]=flipped;if(deck[a]===deck[b]){matched.push(a,b);cards[a].classList.add('matched');cards[b].classList.add('matched');flipped=[];if(matched.length===deck.length)message(`🏆 Semua pasangan ditemukan dalam ${moves} langkah!`)}else{locked=true;setTimeout(()=>{cards[a].textContent='?';cards[b].textContent='?';cards[a].classList.remove('flipped');cards[b].classList.remove('flipped');flipped=[];locked=false},700)}}}));
 $('#memoryRestart').addEventListener('click',renderMemory);
}
function renderRunner(){
 shell(`<p>Tekan tombol <b>LOMPAT</b> untuk melewati rintangan. Game ini versi mini—kejar skor setinggi mungkin!</p><div class="runner-box" id="runnerBox"><div class="runner-avatar">🏃</div><div class="obstacle">🪨</div></div><p>Skor: <b id="runnerScore">0</b></p><button class="game-action" id="jumpBtn">⬆ LOMPAT</button><button class="game-action" id="runnerStart">▶ Mulai / Ulang</button><div class="game-message" id="runnerMsg">Tekan Mulai untuk bermain.</div>`);
 let running=false,score=0,timer=null,hopTimeout=null,jumping=false;
 const box=$('#runnerBox'),avatar=$('.runner-avatar',box),obstacle=$('.obstacle',box);
 function stop(){running=false;clearInterval(timer);clearTimeout(hopTimeout);box.classList.remove('running')}
 function jump(){if(!running||jumping)return;jumping=true;avatar.style.transform='translateY(-55px)';hopTimeout=setTimeout(()=>{avatar.style.transform='';jumping=false},420)}
 $('#jumpBtn').addEventListener('click',jump);
 $('#runnerStart').addEventListener('click',()=>{stop();score=0;$('#runnerScore').textContent='0';$('#runnerMsg').textContent='Lompat sebelum rintangan datang!';running=true;box.classList.add('running');timer=setInterval(()=>{score++;$('#runnerScore').textContent=score;if(score%8===0)$('#runnerMsg').textContent='Mantap! Terus berlari!'},500);});
 const key=e=>{if(e.code==='Space'&&modal.classList.contains('show')){e.preventDefault();jump()}};
 document.addEventListener('keydown',key);
 cleanupGame=()=>{stop();document.removeEventListener('keydown',key)};
}
function renderTetris(){
 let grid=Array(200).fill(0),score=0,ended=false,timer=null;
 const shapes=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
 let shape=shapes[Math.floor(Math.random()*shapes.length)],x=3,y=0;
 function cells(){let out=[];shape.forEach((row,dy)=>row.forEach((v,dx)=>{if(v)out.push([x+dx,y+dy])}));return out}
 function valid(nx,ny,sh=shape){return sh.every((row,dy)=>row.every((v,dx)=>!v||(nx+dx>=0&&nx+dx<10&&ny+dy<20&&(ny+dy<0||!grid[(ny+dy)*10+nx+dx]))))}
 function render(){shell(`<p>Gunakan tombol panah ← → untuk menggeser, ↓ untuk mempercepat, dan ↑ untuk memutar balok.</p><div style="display:flex;justify-content:space-between;margin:0 auto 10px;max-width:300px">Skor: <b id="tetrisScore">${score}</b><span>${ended?'Game Over':''}</span></div><div class="tetris-board">${grid.map((v,i)=>`<div class="tetris-cell ${v?'filled':''}" data-cell="${i}"></div>`).join('')}</div><div class="tetris-controls"><button class="game-action" id="left">←</button><button class="game-action" id="rotate">↻</button><button class="game-action" id="down">↓</button><button class="game-action" id="right">→</button></div><div class="game-message">${ended?'Game over! Skor: '+score:'Susun balok untuk membentuk baris penuh.'}</div><button class="game-action" id="tetrisRestart">Mulai Ulang</button>`);
 cells().forEach(([cx,cy])=>{if(cy>=0&&cy<20){const el=$(`[data-cell="${cy*10+cx}"]`);if(el)el.classList.add('filled')}});
 $('#left').addEventListener('click',()=>move(-1,0));$('#right').addEventListener('click',()=>move(1,0));$('#down').addEventListener('click',()=>move(0,1));$('#rotate').addEventListener('click',rotate);$('#tetrisRestart').addEventListener('click',renderTetris);
 }
 function spawn(){shape=shapes[Math.floor(Math.random()*shapes.length)];x=3;y=0;if(!valid(x,y)){ended=true;clearInterval(timer);render()}}
 function lock(){cells().forEach(([cx,cy])=>{if(cy>=0)grid[cy*10+cx]=1});let rows=0;for(let r=19;r>=0;r--){if(grid.slice(r*10,r*10+10).every(Boolean)){grid.splice(r*10,10);grid.unshift(...Array(10).fill(0));rows++;r++}}score+=rows*100;spawn()}
 function move(dx,dy){if(ended)return;if(valid(x+dx,y+dy)){x+=dx;y+=dy}else if(dy===1)lock();render()}
 function rotate(){if(ended)return;const sh=shape[0].map((_,i)=>shape.map(row=>row[i]).reverse());if(valid(x,y,sh))shape=sh;render()}
 render();timer=setInterval(()=>{if(!ended)move(0,1)},650);
 const key=e=>{if(!modal.classList.contains('show'))return;if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')move(-1,0);if(e.key==='ArrowRight')move(1,0);if(e.key==='ArrowDown')move(0,1);if(e.key==='ArrowUp')rotate()}};
 document.addEventListener('keydown',key);
 cleanupGame=()=>{clearInterval(timer);document.removeEventListener('keydown',key)};
}
