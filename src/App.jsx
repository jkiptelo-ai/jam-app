import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfaqmdxpwOqs7GwBUadjHj_2Eh2nprlj4",
  authDomain: "jam-app-76645.firebaseapp.com",
  databaseURL: "https://jam-app-76645-default-rtdb.firebaseio.com",
  projectId: "jam-app-76645",
  storageBucket: "jam-app-76645.firebasestorage.app",
  messagingSenderId: "819322781490",
  appId: "1:819322781490:web:535f94161b231ffc8d612b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--surface:#12121a;--surface2:#1a1a26;
  --border:#ffffff12;--accent:#ff4d6d;--accent2:#7c3aed;--accent3:#06d6a0;
  --text:#f0eeff;--muted:#8885a8;
  --fh:'Syne',sans-serif;--fb:'DM Sans',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--fb);overflow:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
.app{width:100vw;height:100vh;display:flex;flex-direction:column;position:relative;overflow:hidden}
.mesh{position:fixed;inset:0;pointer-events:none;z-index:0;background:
  radial-gradient(ellipse 60% 50% at 20% 20%,#ff4d6d18 0%,transparent 60%),
  radial-gradient(ellipse 50% 60% at 80% 80%,#7c3aed18 0%,transparent 60%)}

/* AUTH */
.auth{position:relative;z-index:10;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.auth-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:48px 40px;width:420px;max-width:95vw;animation:fadeUp .6s cubic-bezier(.16,1,.3,1)}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.logo{font-family:var(--fh);font-size:3rem;font-weight:800;letter-spacing:-2px;margin-bottom:6px}
.logo span{color:var(--accent)}
.tagline{color:var(--muted);font-size:.9rem;margin-bottom:36px}
.tabs{display:flex;gap:4px;background:var(--bg);border-radius:12px;padding:4px;margin-bottom:28px}
.tab-btn{flex:1;padding:10px;border:none;border-radius:8px;background:transparent;color:var(--muted);font-family:var(--fb);font-size:.9rem;cursor:pointer;transition:all .2s}
.tab-btn.active{background:var(--accent);color:white;font-weight:500}
.form-group{margin-bottom:16px}
.form-label{display:block;font-size:.8rem;color:var(--muted);margin-bottom:6px;letter-spacing:.05em;text-transform:uppercase}
.form-input{width:100%;padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.95rem;outline:none;transition:border-color .2s}
.form-input:focus{border-color:var(--accent)}
.form-input::placeholder{color:#ffffff30}
.btn-primary{width:100%;padding:14px;background:var(--accent);border:none;border-radius:12px;color:white;font-family:var(--fh);font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:8px}
.btn-primary:hover{background:#ff2d52;box-shadow:0 0 30px #ff4d6d66;transform:translateY(-1px)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
.auth-err{color:var(--accent);font-size:.8rem;margin-top:8px;text-align:center;min-height:18px}

/* LAYOUT */
.main{position:relative;z-index:10;display:flex;width:100%;height:100%}

/* SIDEBAR */
.sidebar{width:68px;height:100%;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:8px;flex-shrink:0}
.sidebar-logo{font-family:var(--fh);font-size:1.4rem;font-weight:800;color:var(--accent);margin-bottom:16px}
.nav-btn{width:46px;height:46px;border-radius:13px;border:none;background:transparent;color:var(--muted);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.nav-btn:hover{background:var(--surface2);color:var(--text)}
.nav-btn.active{background:var(--accent);color:white;box-shadow:0 0 18px #ff4d6d55}
.sidebar-spacer{flex:1}
.me-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:white;border:2px solid var(--border);cursor:pointer}

/* CONTACTS PANEL */
.panel{width:280px;height:100%;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.panel-header{padding:18px 14px 10px;display:flex;align-items:center;justify-content:space-between}
.panel-title{font-family:var(--fh);font-size:1rem;font-weight:700}
.icon-btn{width:30px;height:30px;border-radius:8px;border:none;background:var(--surface2);color:var(--muted);font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.icon-btn:hover{color:var(--text)}
.search-bar{margin:0 10px 10px;position:relative}
.search-bar input{width:100%;padding:8px 12px 8px 30px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text);font-family:var(--fb);font-size:.83rem;outline:none}
.search-bar input::placeholder{color:var(--muted)}
.search-icon{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:.85rem}
.friend-list{flex:1;overflow-y:auto;padding:0 6px 8px}
.friend-item{display:flex;align-items:center;gap:9px;padding:10px 8px;border-radius:11px;cursor:pointer;transition:background .15s;margin-bottom:2px}
.friend-item:hover{background:var(--surface2)}
.friend-item.active{background:rgba(255,77,109,.1)}
.av-wrap{position:relative;flex-shrink:0}
.av-img{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:white}
.status-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;border:2px solid var(--surface)}
.status-dot.online{background:var(--accent3)}
.status-dot.offline{background:#475569}
.f-info{flex:1;min-width:0}
.f-name{font-size:.88rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.f-status{font-size:.73rem;color:var(--muted);margin-top:1px}
.no-friends{padding:24px 16px;text-align:center;color:var(--muted);font-size:.83rem;line-height:1.6}

/* CHAT */
.chat-main{flex:1;display:flex;flex-direction:column;height:100%;min-width:0;background:var(--bg)}
.chat-header{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--surface);flex-shrink:0}
.chat-header-name{font-family:var(--fh);font-size:.95rem;font-weight:700}
.chat-header-status{font-size:.72rem;color:var(--accent3)}
.chat-actions{display:flex;gap:5px;margin-left:auto}
.action-btn{width:34px;height:34px;border-radius:9px;border:none;background:var(--surface2);color:var(--muted);font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.action-btn:hover{background:var(--accent);color:white}
.messages{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:3px}
.msg-wrap{display:flex;flex-direction:column;margin-bottom:2px}
.msg-wrap.mine{align-items:flex-end}
.bubble{max-width:65%;padding:9px 13px 6px;border-radius:16px;font-size:.87rem;line-height:1.55;word-break:break-word;position:relative}
.bubble.them{background:var(--surface2);border-top-left-radius:3px}
.bubble.mine{background:#005c4b;color:#e9fdd7;border-top-right-radius:3px}
.bubble-time{font-size:.63rem;color:rgba(255,255,255,.4);text-align:right;margin-top:3px}
.bubble.them .bubble-time{color:var(--muted)}
.msg-sender{font-size:.68rem;color:var(--muted);padding:0 4px;margin-bottom:2px}
.typing-wrap{display:flex;gap:4px;padding:9px 13px;background:var(--surface2);border-radius:16px;border-top-left-radius:3px;width:fit-content;align-items:center}
.t-dot{width:5px;height:5px;border-radius:50%;background:var(--muted);animation:td 1.2s infinite}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes td{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.chat-input-area{padding:10px 14px 12px;border-top:1px solid var(--border);background:var(--surface);flex-shrink:0}
.emoji-tray{display:flex;gap:5px;margin-bottom:7px;flex-wrap:wrap}
.em{background:none;border:none;font-size:1.05rem;cursor:pointer;padding:2px 4px;border-radius:6px;transition:transform .15s}
.em:hover{transform:scale(1.3)}
.input-row{display:flex;gap:7px;align-items:flex-end}
.chat-ta{flex:1;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:22px;color:var(--text);font-family:var(--fb);font-size:.88rem;outline:none;resize:none;max-height:100px;line-height:1.45;transition:border-color .2s}
.chat-ta:focus{border-color:var(--accent)}
.chat-ta::placeholder{color:var(--muted)}
.send-btn{width:42px;height:42px;border-radius:50%;border:none;background:var(--accent);color:white;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.send-btn:hover{filter:brightness(1.1)}
.send-btn:disabled{opacity:.4;cursor:not-allowed}
.em-toggle{width:42px;height:42px;border-radius:50%;border:none;background:var(--surface2);color:var(--muted);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* EMPTY / WELCOME */
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);text-align:center;padding:24px}
.empty-icon{font-size:3rem;opacity:.4}
.empty-title{font-family:var(--fh);font-size:1rem;font-weight:700;color:var(--text)}
.empty-sub{font-size:.82rem;max-width:260px;line-height:1.6}

/* JAM ROOM */
.jam-page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.jam-inner{padding:26px;max-width:700px}
.page-title{font-family:var(--fh);font-size:1.7rem;font-weight:800;letter-spacing:-1px;margin-bottom:4px}
.page-title em{color:var(--accent);font-style:normal}
.page-sub{color:var(--muted);font-size:.83rem;margin-bottom:22px}
.sec-lbl{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.player-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:22px;margin-bottom:20px;position:relative;overflow:hidden}
.player-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 85% 50%,rgba(124,58,237,.12) 0%,transparent 60%);pointer-events:none}
.np-row{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.trk-art{width:58px;height:58px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.7rem;transition:background .5s}
.trk-name{font-family:var(--fh);font-size:.95rem;font-weight:700}
.trk-artist{font-size:.78rem;color:var(--muted);margin-top:2px}
.trk-src{font-size:.68rem;color:var(--accent3);margin-top:3px}
.prog-bar{height:4px;background:var(--surface2);border-radius:4px;cursor:pointer;margin-bottom:4px}
.prog-fill{height:100%;background:var(--accent);border-radius:4px;transition:width .5s linear}
.prog-times{display:flex;justify-content:space-between;font-size:.68rem;color:var(--muted);margin-bottom:12px}
.ctrl-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px}
.ctrl{background:none;border:none;color:var(--muted);font-size:1.05rem;cursor:pointer;padding:7px;border-radius:8px;transition:all .2s}
.ctrl:hover{color:var(--text);background:var(--surface2)}
.ctrl.pp{width:46px;height:46px;border-radius:50%;background:var(--accent);color:white;font-size:1.1rem;display:flex;align-items:center;justify-content:center}
.ctrl.pp:hover{filter:brightness(1.1);box-shadow:0 0 18px #ff4d6d55}
.vol-row{display:flex;align-items:center;gap:10px}
.vol-sl{flex:1;-webkit-appearance:none;appearance:none;height:3px;background:var(--surface2);border-radius:3px;outline:none;cursor:pointer}
.vol-sl::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--accent);cursor:pointer}
.src-row{display:flex;gap:10px;margin-bottom:18px}
.src-card{flex:1;padding:14px 10px;background:var(--surface);border:1px solid var(--border);border-radius:16px;cursor:pointer;transition:all .2s;text-align:center}
.src-card:hover{border-color:var(--accent);transform:translateY(-2px)}
.src-card.on{border-color:var(--accent);background:rgba(255,77,109,.08)}
.src-icon{font-size:1.6rem;margin-bottom:6px}
.src-name{font-family:var(--fh);font-size:.82rem;font-weight:700}
.src-desc{font-size:.68rem;color:var(--muted);margin-top:2px}
.url-row{display:flex;gap:8px;margin-bottom:18px}
.url-inp{flex:1;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:11px;color:var(--text);font-family:var(--fb);font-size:.85rem;outline:none;transition:border-color .2s}
.url-inp:focus{border-color:var(--accent)}
.url-inp::placeholder{color:var(--muted)}
.url-btn{padding:10px 16px;background:var(--accent);border:none;border-radius:11px;color:white;font-family:var(--fh);font-size:.85rem;font-weight:700;cursor:pointer;white-space:nowrap}
.url-btn:hover{filter:brightness(1.1)}
.q-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:11px;cursor:pointer;transition:background .15s}
.q-item:hover{background:var(--surface2)}
.q-item.on{background:rgba(255,77,109,.1)}
.q-art{width:36px;height:36px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.q-name{font-size:.85rem;font-weight:500}
.q-meta{font-size:.72rem;color:var(--muted)}
.q-dur{font-size:.7rem;color:var(--muted);margin-left:auto}

/* CINEMA */
.cinema-screen{width:100%;aspect-ratio:16/9;background:#000;border-radius:16px;overflow:hidden;margin-bottom:14px;border:1px solid var(--border)}
.cinema-screen iframe{width:100%;height:100%;border:none}
.cinema-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--muted)}
.cinema-placeholder-icon{font-size:3.5rem;opacity:.4}
.cinema-chat{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-top:16px}
.cinema-chat-hd{padding:11px 14px;border-bottom:1px solid var(--border);font-family:var(--fh);font-size:.88rem;font-weight:700}
.cinema-msgs{height:180px;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.cinema-msg{font-size:.81rem;display:flex;gap:5px}
.cinema-msg-name{font-weight:600;flex-shrink:0}
.cinema-msg-text{color:var(--muted)}
.cinema-inp-row{display:flex;gap:7px;padding:9px 10px;border-top:1px solid var(--border)}
.cinema-inp{flex:1;padding:7px 12px;background:var(--bg);border:1px solid var(--border);border-radius:20px;color:var(--text);font-family:var(--fb);font-size:.82rem;outline:none}
.cinema-inp::placeholder{color:var(--muted)}
.cinema-send{padding:7px 14px;background:var(--accent);border:none;border-radius:20px;color:white;font-size:.82rem;cursor:pointer;font-family:var(--fh);font-weight:700}

/* GAMES */
.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:12px;margin-bottom:22px}
.g-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 14px;cursor:pointer;transition:all .2s;text-align:center}
.g-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.4)}
.g-icon{font-size:2rem;margin-bottom:8px}
.g-name{font-family:var(--fh);font-size:.88rem;font-weight:700}
.g-pl{font-size:.7rem;color:var(--muted);margin-top:2px}
.g-badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:.65rem;font-weight:700;margin-top:6px}

/* game overlays */
.g-ov{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.88);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.g-box{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:28px 24px;width:min(380px,95vw);text-align:center;animation:scUp .3s cubic-bezier(.16,1,.3,1);max-height:95vh;overflow-y:auto}
@keyframes scUp{from{opacity:0;scale:.9}to{opacity:1;scale:1}}
.g-title{font-family:var(--fh);font-size:1.3rem;font-weight:800;margin-bottom:4px}
.g-sub{font-size:.78rem;color:var(--muted);margin-bottom:14px}
.ttt-board{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px auto;max-width:220px}
.ttt-cell{aspect-ratio:1;background:var(--surface2);border:none;border-radius:10px;font-size:1.7rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.ttt-cell:hover:not(:disabled){background:var(--bg);transform:scale(.96)}
.ttt-cell:disabled{cursor:default}
.ttt-cell.x{color:var(--accent)}.ttt-cell.o{color:var(--accent2)}
.ttt-st{font-size:.85rem;color:var(--muted);margin-bottom:8px;min-height:20px}
.ttt-win{color:var(--accent3)!important;font-weight:600}
.wordle-grid{display:grid;grid-template-rows:repeat(6,1fr);gap:5px;margin:10px auto;width:fit-content}
.wordle-row{display:flex;gap:5px}
.w-tile{width:44px;height:44px;border:2px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:1.2rem;font-weight:800;text-transform:uppercase;transition:all .3s;color:var(--text)}
.w-tile.correct{background:#538d4e;border-color:#538d4e;color:white}
.w-tile.present{background:#b59f3b;border-color:#b59f3b;color:white}
.w-tile.absent{background:var(--surface2);border-color:var(--surface2);color:var(--muted)}
.w-tile.filled{border-color:var(--border)}
.wordle-kbd{display:flex;flex-direction:column;gap:5px;margin-top:10px}
.kbd-row{display:flex;gap:4px;justify-content:center}
.kbd-key{min-width:30px;height:36px;padding:0 5px;background:var(--surface2);border:none;border-radius:6px;color:var(--text);font-family:var(--fh);font-size:.72rem;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.kbd-key:hover{background:var(--surface2)}
.kbd-key.correct{background:#538d4e;color:white}
.kbd-key.present{background:#b59f3b;color:white}
.kbd-key.absent{background:var(--bg);color:var(--muted)}
.kbd-key.wide{min-width:46px}
.trivia-q{font-size:.92rem;font-weight:500;margin-bottom:14px;line-height:1.55;text-align:left}
.trivia-opts{display:flex;flex-direction:column;gap:8px}
.t-opt{padding:11px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:11px;cursor:pointer;text-align:left;font-family:var(--fb);font-size:.85rem;color:var(--text);transition:all .2s}
.t-opt:hover:not(:disabled){background:var(--surface2)}
.t-opt.correct{background:rgba(6,214,160,.2);border-color:var(--accent3);color:var(--accent3)}
.t-opt.wrong{background:rgba(255,77,109,.2);border-color:var(--accent);color:var(--accent)}
.t-opt:disabled{cursor:default}

/* CALL */
.call-ov{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.9);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center}
.call-box{background:var(--surface);border:1px solid var(--border);border-radius:28px;padding:40px 36px;text-align:center;width:320px;animation:scUp .3s cubic-bezier(.16,1,.3,1)}
.call-av{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.2rem;margin:0 auto 14px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,77,109,.35)}50%{box-shadow:0 0 0 18px rgba(255,77,109,0)}}
.call-name{font-family:var(--fh);font-size:1.3rem;font-weight:700;margin-bottom:4px}
.call-status{color:var(--muted);font-size:.85rem;margin-bottom:6px}
.call-dur{color:var(--accent3);font-size:1.1rem;font-weight:600;margin-bottom:26px;font-variant-numeric:tabular-nums}
.call-btns{display:flex;justify-content:center;gap:14px}
.c-btn{width:52px;height:52px;border-radius:50%;border:none;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.c-btn.mute{background:var(--surface2);color:var(--text)}
.c-btn.end{background:#ef4444;color:white}
.c-btn.end:hover{background:#dc2626;transform:scale(1.06)}
.c-btn.vid{background:var(--surface2);color:var(--text)}

/* DISCOVER */
.discover-page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.discover-inner{padding:22px;max-width:600px}
.story-row{display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px}
.story-row::-webkit-scrollbar{display:none}
.story-it{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;flex-shrink:0}
.story-ring{width:56px;height:56px;border-radius:50%;padding:2px;background:linear-gradient(135deg,var(--accent),var(--accent2))}
.story-in{width:100%;height:100%;border-radius:50%;border:2px solid var(--bg);background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.story-nm{font-size:.65rem;color:var(--muted);text-align:center;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.post{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:15px;margin-bottom:14px}
.post-hd{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.post-av{width:38px;height:38px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.post-author{font-weight:600;font-size:.88rem}
.post-time{font-size:.7rem;color:var(--muted)}
.post-body{font-size:.86rem;line-height:1.6;color:#ccc8ef;margin-bottom:10px}
.post-media{background:var(--surface2);border-radius:12px;height:160px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;margin-bottom:10px}
.post-acts{display:flex;gap:10px}
.post-act{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--muted);font-family:var(--fb);font-size:.78rem;cursor:pointer;padding:5px 9px;border-radius:8px;transition:all .2s}
.post-act:hover{background:var(--surface2);color:var(--text)}
.post-act.liked{color:var(--accent)}

/* TOAST */
.toast{position:fixed;bottom:18px;right:18px;z-index:400;background:var(--surface2);border:1px solid var(--border);border-radius:13px;padding:11px 16px;font-size:.83rem;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:slideIn .3s cubic-bezier(.16,1,.3,1);max-width:280px}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}

/* MOBILE */
@media(max-width:600px){.panel{width:220px}}
@media(max-width:480px){.panel{display:none}}
`;

const TRACKS = [
  {title:"WHERE SHE GOES",artist:"Bad Bunny",src:"Spotify",em:"🎵",dur:213},
  {title:"Blinding Lights",artist:"The Weeknd",src:"Spotify",em:"🌙",dur:200},
  {title:"HUMBLE.",artist:"Kendrick Lamar",src:"YouTube",em:"🎤",dur:177},
  {title:"Levitating",artist:"Dua Lipa",src:"Spotify",em:"✨",dur:203},
  {title:"Espresso",artist:"Sabrina Carpenter",src:"Spotify",em:"☕",dur:175},
];

const POSTS_DATA = [
  {id:1,author:"Jam Community",em:"🌟",time:"just now",body:"Welcome to Jam! 🎵 Chat with friends, watch movies together, play games and more!",media:"🎵",likes:0,comments:0,liked:false},
  {id:2,author:"Jam Community",em:"🔥",time:"just now",body:"Try the Cinema room — paste any YouTube link and watch together in sync! 🎬",media:"🎬",likes:0,comments:0,liked:false},
];

const TRIVIA_QS = [
  {q:"What is the capital of Kenya?",opts:["Mombasa","Nairobi","Kisumu","Nakuru"],ans:1},
  {q:"Which planet is the Red Planet?",opts:["Venus","Jupiter","Mars","Saturn"],ans:2},
  {q:"Who painted the Mona Lisa?",opts:["Van Gogh","Picasso","Da Vinci","Monet"],ans:2},
  {q:"What is the largest ocean?",opts:["Atlantic","Indian","Arctic","Pacific"],ans:3},
  {q:"How many sides does a hexagon have?",opts:["5","6","7","8"],ans:1},
];

const WORDLE_WORDS = ["CRANE","SLATE","AUDIO","BRICK","CLOUD","FLAME","LIGHT","MONEY","PIANO","STORM"];
const KBD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];
const EMOJIS = "😂❤️🔥🎵🎮🌟👀😍🙌💯🎉😭🤩💪".split("");
const COLORS = ["#e8445a","#6c5ce7","#00d4aa","#f0a500","#e17055","#74b9ff","#fd79a8","#00b894"];
const pickColor = (name) => { let h=0; for(let c of (name||"")) h=(h*31+c.charCodeAt(0))%COLORS.length; return COLORS[h]; };
const initials = (name) => (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const fmt = s => Math.floor(s/60)+":"+(String(s%60).padStart(2,"0"));
const nowTime = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const getChatId = (a,b) => [a,b].sort().join("_");

export default function Jam() {
  // auth
  const [screen, setScreen] = useState("loading");
  const [authTab, setAuthTab] = useState("login");
  const [nameVal, setNameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [pwVal, setPwVal] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(null);

  // nav + chat
  const [nav, setNav] = useState("chat");
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // call
  const [callOn, setCallOn] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const callTimer = useRef(null);

  // music
  const [playing, setPlaying] = useState(false);
  const [trkIdx, setTrkIdx] = useState(0);
  const [prog, setProg] = useState(0);
  const [vol, setVol] = useState(80);
  const [srcMode, setSrcMode] = useState("Spotify");
  const [musicUrl, setMusicUrl] = useState("");
  const musicTimer = useRef(null);

  // cinema
  const [cinemaUrl, setCinemaUrl] = useState("");
  const [cinemaActive, setCinemaActive] = useState(false);
  const [cinemaInput, setCinemaInput] = useState("");
  const [cinemaMsgs, setCinemaMsgs] = useState([
    {name:"Jam",text:"Paste a YouTube link to start watching together! 🎬",color:"#e8445a"},
  ]);
  const [cinemaChatInput, setCinemaChatInput] = useState("");

  // games
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [tttW, setTttW] = useState(null);
  const [wTarget] = useState(()=>WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)]);
  const [wGuesses, setWGuesses] = useState([]);
  const [wCur, setWCur] = useState("");
  const [wDone, setWDone] = useState(false);
  const [wMsg, setWMsg] = useState("");
  const [tIdx, setTIdx] = useState(0);
  const [tScore, setTScore] = useState(0);
  const [tSel, setTSel] = useState(null);
  const [tDone, setTDone] = useState(false);

  // discover
  const [posts, setPosts] = useState(POSTS_DATA);

  // toast
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  const showToast = (icon, msg) => {
    setToast({icon,msg});
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(null), 3000);
  };

  // ── AUTH STATE ──
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u) => {
      if(u){
        const snap = await new Promise(res => onValue(ref(db,`users/${u.uid}`), res, {onlyOnce:true}));
        const data = snap.val();
        if(data){ setUser(data); }
        else { setUser({uid:u.uid,email:u.email,name:u.email.split("@")[0],color:"#e8445a"}); }
        setScreen("app");
      } else {
        setUser(null);
        setScreen("auth");
      }
    });
    return ()=>unsub();
  },[]);

  // ── LOAD ALL USERS (friends) ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"users"),(snap)=>{
      const data = snap.val();
      if(data){
        const list = Object.values(data).filter(u=>u.uid!==user.uid);
        setFriends(list);
        if(!friend && list.length>0) setFriend(list[0]);
      }
    });
  },[user]);

  // ── LOAD MESSAGES ──
  useEffect(()=>{
    if(!user||!friend) return;
    const chatId = getChatId(user.uid, friend.uid);
    return onValue(ref(db,`messages/${chatId}`),(snap)=>{
      const data = snap.val();
      if(data){
        setMsgs(Object.values(data).sort((a,b)=>a.ts-b.ts));
      } else {
        setMsgs([]);
      }
    });
  },[user,friend]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  // call timer
  useEffect(()=>{
    if(callOn){ callTimer.current=setInterval(()=>setCallSecs(s=>s+1),1000); }
    else{ clearInterval(callTimer.current); setCallSecs(0); }
    return()=>clearInterval(callTimer.current);
  },[callOn]);

  // music timer
  useEffect(()=>{
    if(playing){
      musicTimer.current=setInterval(()=>{
        setProg(p=>{
          if(p>=TRACKS[trkIdx].dur){setTrkIdx(i=>(i+1)%TRACKS.length);return 0;}
          return p+1;
        });
      },1000);
    } else clearInterval(musicTimer.current);
    return()=>clearInterval(musicTimer.current);
  },[playing,trkIdx]);

  // ── SIGN UP / SIGN IN ──
  const doAuth = async () => {
    setAuthErr(""); setAuthLoading(true);
    try {
      if(authTab==="signup"){
        if(!nameVal.trim()){ setAuthErr("Please enter your name"); setAuthLoading(false); return; }
        if(!emailVal||!pwVal){ setAuthErr("Please fill all fields"); setAuthLoading(false); return; }
        if(pwVal.length<6){ setAuthErr("Password must be at least 6 characters"); setAuthLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, emailVal, pwVal);
        const newUser = {
          uid: cred.user.uid,
          name: nameVal.trim(),
          email: emailVal,
          color: pickColor(nameVal.trim()),
          status: "online",
          joinedAt: Date.now()
        };
        await set(ref(db,`users/${cred.user.uid}`), newUser);
      } else {
        if(!emailVal||!pwVal){ setAuthErr("Please fill all fields"); setAuthLoading(false); return; }
        await signInWithEmailAndPassword(auth, emailVal, pwVal);
      }
    } catch(err){
      if(err.code==="auth/email-already-in-use") setAuthErr("Email already registered. Sign in instead.");
      else if(err.code==="auth/wrong-password"||err.code==="auth/invalid-credential") setAuthErr("Wrong email or password.");
      else if(err.code==="auth/user-not-found") setAuthErr("No account found. Create one instead.");
      else if(err.code==="auth/invalid-email") setAuthErr("Please enter a valid email.");
      else setAuthErr("Error: "+err.message);
    }
    setAuthLoading(false);
  };

  // ── SEND MESSAGE ──
  const sendMsg = async () => {
    if(!input.trim()||sending||!friend||!user) return;
    const text = input.trim();
    setInput(""); setShowEmoji(false); setSending(true);
    const chatId = getChatId(user.uid, friend.uid);
    await push(ref(db,`messages/${chatId}`),{
      text,
      senderId: user.uid,
      senderName: user.name,
      color: user.color,
      ts: Date.now(),
      time: nowTime()
    });
    setSending(false);
  };

  // ── CINEMA ──
  const getYTId = url => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return m?m[1]:null;
  };
  const loadCinema = () => {
    if(!cinemaInput.trim()){ showToast("⚠️","Paste a YouTube link first"); return; }
    const id = getYTId(cinemaInput.trim());
    if(!id){ showToast("❌","Paste a valid YouTube link"); return; }
    setCinemaUrl("https://www.youtube.com/embed/"+id+"?autoplay=1&rel=0");
    setCinemaActive(true);
    showToast("🎬","Cinema started!");
  };
  const sendCinemaMsg = () => {
    if(!cinemaChatInput.trim()) return;
    setCinemaMsgs(p=>[...p,{name:user?.name||"You",text:cinemaChatInput,color:user?.color||"#e8445a"}]);
    setCinemaChatInput("");
  };

  // ── TTT ──
  const checkTTT = b => {
    const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const[a,c,d]of lines) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a];
    if(b.every(Boolean)) return "draw"; return null;
  };
  const clickTTT = i => {
    if(board[i]||tttW||!xTurn) return;
    const nb=[...board]; nb[i]="❌"; setBoard(nb);
    const w=checkTTT(nb); if(w){setTttW(w);return;} setXTurn(false);
    setTimeout(()=>{
      const empty=nb.map((v,idx)=>v?null:idx).filter(v=>v!==null);
      if(!empty.length) return;
      const ai=empty[Math.floor(Math.random()*empty.length)];
      const nb2=[...nb]; nb2[ai]="⭕"; setBoard(nb2);
      const w2=checkTTT(nb2); if(w2) setTttW(w2); else setXTurn(true);
    },600);
  };

  // ── WORDLE ──
  const wColors={};
  wGuesses.forEach(g=>[...g].forEach((c,i)=>{
    if(c===wTarget[i]) wColors[c]="correct";
    else if(wTarget.includes(c)&&wColors[c]!=="correct") wColors[c]="present";
    else if(!wColors[c]) wColors[c]="absent";
  }));
  const wTileState=(row,col)=>{
    if(row>=wGuesses.length) return "";
    const c=wGuesses[row][col]; if(!c) return "";
    if(c===wTarget[col]) return "correct";
    if(wTarget.includes(c)) return "present";
    return "absent";
  };
  const wKey=k=>{
    if(wDone) return;
    if(k==="⌫"||k==="BACKSPACE"){setWCur(p=>p.slice(0,-1));return;}
    if(k==="ENTER"){
      if(wCur.length!==5){setWMsg("Need 5 letters");return;}
      const ng=[...wGuesses,wCur]; setWGuesses(ng); setWCur(""); setWMsg("");
      if(wCur===wTarget){setWDone(true);setWMsg("🎉 Brilliant!");return;}
      if(ng.length>=6){setWDone(true);setWMsg("Answer: "+wTarget);}
      return;
    }
    if(wCur.length<5&&/^[A-Z]$/.test(k)) setWCur(p=>p+k);
  };
  useEffect(()=>{
    if(game!=="wordle") return;
    const h=e=>wKey(e.key.toUpperCase());
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[game,wCur,wGuesses,wDone]);

  // ── TRIVIA ──
  const pickTrivia=i=>{
    if(tSel!==null) return; setTSel(i);
    if(i===TRIVIA_QS[tIdx].ans) setTScore(s=>s+1);
    setTimeout(()=>{
      if(tIdx+1>=TRIVIA_QS.length){setTDone(true);return;}
      setTIdx(s=>s+1); setTSel(null);
    },1200);
  };

  const trk = TRACKS[trkIdx];

  // ── LOADING ──
  if(screen==="loading") return (
    <><style>{STYLES}</style>
    <div className="app"><div className="mesh"/>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{fontFamily:"var(--fh)",fontSize:"2.5rem",fontWeight:800,letterSpacing:"-2px"}}>J<span style={{color:"var(--accent)"}}>a</span>m</div>
      <div style={{color:"var(--muted)",fontSize:".85rem"}}>Loading...</div>
    </div>
    </div></>
  );

  // ── AUTH ──
  if(screen==="auth") return (
    <><style>{STYLES}</style>
    <div className="app"><div className="mesh"/>
    <div className="auth">
      <div className="auth-card">
        <div className="logo">J<span>a</span>m</div>
        <p className="tagline">Chat · Music · Cinema · Games — together.</p>
        <div className="tabs">
          <button className={"tab-btn"+(authTab==="login"?" active":"")} onClick={()=>setAuthTab("login")}>Sign In</button>
          <button className={"tab-btn"+(authTab==="signup"?" active":"")} onClick={()=>setAuthTab("signup")}>Create Account</button>
        </div>
        {authTab==="signup"&&(
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={nameVal} onChange={e=>setNameVal(e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={emailVal} onChange={e=>setEmailVal(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min 6 characters" value={pwVal} onChange={e=>setPwVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAuth()}/>
        </div>
        <div className="auth-err">{authErr}</div>
        <button className="btn-primary" onClick={doAuth} disabled={authLoading}>
          {authLoading?"Please wait...":(authTab==="login"?"Sign In 🔐":"Create Account 🚀")}
        </button>
      </div>
    </div>
    {toast&&<div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div></>
  );

  // ── APP ──
  return (
    <><style>{STYLES}</style>
    <div className="app"><div className="mesh"/>
    <div className="main">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">J</div>
        {[
          {id:"chat",ic:"💬",tip:"Chat"},
          {id:"discover",ic:"🌍",tip:"Discover"},
          {id:"jam",ic:"🎵",tip:"Music Room"},
          {id:"cinema",ic:"🎬",tip:"Cinema"},
          {id:"games",ic:"🎮",tip:"Games"},
        ].map(n=>(
          <button key={n.id} className={"nav-btn"+(nav===n.id?" active":"")} title={n.tip} onClick={()=>setNav(n.id)}>{n.ic}</button>
        ))}
        <div className="sidebar-spacer"/>
        <div className="me-av" style={{background:user?.color||"#e8445a"}} title={user?.name}>
          {initials(user?.name||"?")}
        </div>
      </div>

      {/* ══ CHAT ══ */}
      {nav==="chat"&&<>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Chats</span>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search users..."/>
          </div>
          <div className="friend-list">
            {friends.length===0?(
              <div className="no-friends">
                👋 No other users yet!<br/>Share the link with friends so they can sign up and appear here.
              </div>
            ):friends.map(f=>(
              <div key={f.uid} className={"friend-item"+(friend?.uid===f.uid?" active":"")} onClick={()=>setFriend(f)}>
                <div className="av-wrap">
                  <div className="av-img" style={{background:f.color||pickColor(f.name)}}>{initials(f.name)}</div>
                  <span className="status-dot online"/>
                </div>
                <div className="f-info">
                  <div className="f-name">{f.name}</div>
                  <div className="f-status">{f.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {friend?(
            <>
              <div className="chat-header">
                <div className="av-img" style={{width:40,height:40,borderRadius:"50%",background:friend.color||pickColor(friend.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",fontWeight:700,color:"white",flexShrink:0}}>
                  {initials(friend.name)}
                </div>
                <div style={{flex:1}}>
                  <div className="chat-header-name">{friend.name}</div>
                  <div className="chat-header-status">● Online</div>
                </div>
                <div className="chat-actions">
                  <button className="action-btn" onClick={()=>{setCallOn(true);setVideoOn(false);showToast("📞","Calling "+friend.name+"...")}}>📞</button>
                  <button className="action-btn" onClick={()=>{setCallOn(true);setVideoOn(true);showToast("📹","Video call started")}}>📹</button>
                  <button className="action-btn" onClick={()=>setNav("jam")}>🎵</button>
                  <button className="action-btn" onClick={()=>setNav("cinema")}>🎬</button>
                </div>
              </div>

              <div className="messages">
                {msgs.length===0&&(
                  <div style={{textAlign:"center",color:"var(--muted)",fontSize:".8rem",marginTop:20}}>
                    Say hello to {friend.name}! 👋
                  </div>
                )}
                {msgs.map((m,i)=>{
                  const isMe=m.senderId===user.uid;
                  return(
                    <div key={i} className={"msg-wrap"+(isMe?" mine":"")}>
                      {!isMe&&<div className="msg-sender" style={{color:m.color}}>{m.senderName}</div>}
                      <div className={"bubble"+(isMe?" mine":" them")}>
                        {m.text}
                        <div className="bubble-time">{m.time}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef}/>
              </div>

              <div className="chat-input-area">
                {showEmoji&&(
                  <div className="emoji-tray">
                    {EMOJIS.map(e=><button key={e} className="em" onClick={()=>setInput(p=>p+e)}>{e}</button>)}
                  </div>
                )}
                <div className="input-row">
                  <button className="em-toggle" onClick={()=>setShowEmoji(p=>!p)}>😊</button>
                  <textarea
                    className="chat-ta"
                    placeholder={"Message "+friend.name+"..."}
                    rows={1}
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}
                  />
                  <button className="send-btn" onClick={sendMsg} disabled={sending||!input.trim()}>➤</button>
                </div>
              </div>
            </>
          ):(
            <div className="empty">
              <div className="empty-icon">💬</div>
              <div className="empty-title">No chats yet</div>
              <div className="empty-sub">
                Share your app link with friends. Once they sign up they will appear here automatically!<br/><br/>
                <strong style={{color:"var(--accent)"}}>jam-app-smoky.vercel.app</strong>
              </div>
            </div>
          )}
        </div>
      </>}

      {/* ══ DISCOVER ══ */}
      {nav==="discover"&&(
        <div className="discover-page">
          <div className="discover-inner">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div>
                <div className="page-title" style={{marginBottom:2}}>Discover</div>
                <p style={{color:"var(--muted)",fontSize:".83rem"}}>What's happening</p>
              </div>
            </div>
            {friends.length>0&&(
              <>
                <div className="sec-lbl">People</div>
                <div className="story-row">
                  {friends.map(f=>(
                    <div key={f.uid} className="story-it" onClick={()=>{setFriend(f);setNav("chat")}}>
                      <div className="story-ring">
                        <div className="story-in" style={{background:f.color||pickColor(f.name),fontSize:"1rem",fontWeight:700,color:"white"}}>{initials(f.name)}</div>
                      </div>
                      <span className="story-nm">{f.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="sec-lbl" style={{marginTop:8}}>Feed</div>
            {posts.map(p=>(
              <div key={p.id} className="post">
                <div className="post-hd">
                  <div className="post-av">{p.em}</div>
                  <div><div className="post-author">{p.author}</div><div className="post-time">{p.time}</div></div>
                </div>
                <div className="post-body">{p.body}</div>
                {p.media&&<div className="post-media">{p.media}</div>}
                <div className="post-acts">
                  <button className={"post-act"+(p.liked?" liked":"")} onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}:x))}>
                    {p.liked?"❤️":"🤍"} {p.likes}
                  </button>
                  <button className="post-act">💬 {p.comments}</button>
                  <button className="post-act" onClick={()=>showToast("🔗","Copied!")}>🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ JAM ROOM ══ */}
      {nav==="jam"&&(
        <div className="jam-page">
          <div className="jam-inner">
            <div className="page-title">🎵 <em>Jam</em> Room</div>
            <p className="page-sub">Listen together in real time</p>
            <div className="sec-lbl">Source</div>
            <div className="src-row">
              {[["🎵","Spotify","Stream music"],["▶","YouTube","Play videos"],["📻","Radio","Live stations"]].map(([ic,nm,desc])=>(
                <div key={nm} className={"src-card"+(srcMode===nm?" on":"")} onClick={()=>{setSrcMode(nm);showToast(ic,"Connected to "+nm)}}>
                  <div className="src-icon">{ic}</div><div className="src-name">{nm}</div><div className="src-desc">{desc}</div>
                </div>
              ))}
            </div>
            <div className="url-row">
              <input className="url-inp" placeholder={"Paste "+srcMode+" link..."} value={musicUrl} onChange={e=>setMusicUrl(e.target.value)}/>
              <button className="url-btn" onClick={()=>{if(musicUrl){showToast("🔗","Syncing!");setMusicUrl("");}else showToast("⚠️","Paste a link first")}}>Sync</button>
            </div>
            <div className="player-card">
              <div className="sec-lbl" style={{padding:0,marginBottom:12}}>Now Playing · {srcMode}</div>
              <div className="np-row">
                <div className="trk-art" style={{background:playing?"linear-gradient(135deg,var(--accent),var(--accent2))":"var(--surface2)"}}>{trk.em}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="trk-name">{trk.title}</div>
                  <div className="trk-artist">{trk.artist}</div>
                  <div className="trk-src">via {trk.src}</div>
                </div>
              </div>
              <div className="prog-bar" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.floor(((e.clientX-r.left)/r.width)*trk.dur))}}>
                <div className="prog-fill" style={{width:((prog/trk.dur)*100)+"%"}}/>
              </div>
              <div className="prog-times"><span>{fmt(prog)}</span><span>{fmt(trk.dur)}</span></div>
              <div className="ctrl-row">
                <button className="ctrl" onClick={()=>showToast("🔀","Shuffle on")}>🔀</button>
                <button className="ctrl" onClick={()=>{setTrkIdx(i=>(i-1+TRACKS.length)%TRACKS.length);setProg(0)}}>⏮</button>
                <button className="ctrl pp" onClick={()=>setPlaying(p=>!p)}>{playing?"⏸":"▶"}</button>
                <button className="ctrl" onClick={()=>{setTrkIdx(i=>(i+1)%TRACKS.length);setProg(0)}}>⏭</button>
                <button className="ctrl" onClick={()=>showToast("🔁","Repeat on")}>🔁</button>
              </div>
              <div className="vol-row">
                <span style={{fontSize:".85rem"}}>🔈</span>
                <input type="range" className="vol-sl" min={0} max={100} value={vol} onChange={e=>setVol(+e.target.value)}/>
                <span style={{fontSize:".75rem",color:"var(--muted)",minWidth:"28px"}}>{vol}%</span>
              </div>
            </div>
            <div className="sec-lbl">Queue</div>
            {TRACKS.map((t,i)=>(
              <div key={i} className={"q-item"+(i===trkIdx?" on":"")} onClick={()=>{setTrkIdx(i);setProg(0);setPlaying(true)}}>
                <div className="q-art">{t.em}</div>
                <div><div className="q-name" style={{color:i===trkIdx?"var(--accent)":""}}>{t.title}</div><div className="q-meta">{t.artist} · {t.src}</div></div>
                <div className="q-dur">{fmt(t.dur)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ CINEMA ══ */}
      {nav==="cinema"&&(
        <div className="jam-page">
          <div className="jam-inner">
            <div className="page-title">🎬 <em>Cinema</em></div>
            <p className="page-sub">Paste any YouTube link and watch together with friends</p>
            <div className="url-row">
              <input className="url-inp" placeholder="Paste YouTube link e.g. https://youtube.com/watch?v=..." value={cinemaInput} onChange={e=>setCinemaInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loadCinema()}/>
              <button className="url-btn" style={{background:"var(--accent2)"}} onClick={loadCinema}>▶ Watch</button>
            </div>
            <div className="cinema-screen">
              {cinemaActive?(
                <iframe src={cinemaUrl} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
              ):(
                <div className="cinema-placeholder">
                  <div className="cinema-placeholder-icon">🎬</div>
                  <div style={{fontSize:".85rem"}}>Paste a YouTube link above to start watching</div>
                  <div style={{fontSize:".72rem",color:"var(--muted)"}}>Share the link with friends so they can join</div>
                </div>
              )}
            </div>
            <div className="cinema-chat">
              <div className="cinema-chat-hd">💬 Live Reactions</div>
              <div className="cinema-msgs">
                {cinemaMsgs.map((m,i)=>(
                  <div key={i} className="cinema-msg">
                    <span className="cinema-msg-name" style={{color:m.color}}>{m.name}:</span>
                    <span className="cinema-msg-text">{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="cinema-inp-row">
                <input className="cinema-inp" placeholder="React to the movie..." value={cinemaChatInput} onChange={e=>setCinemaChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendCinemaMsg()}/>
                <button className="cinema-send" onClick={sendCinemaMsg}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ GAMES ══ */}
      {nav==="games"&&(
        <div className="jam-page">
          <div className="jam-inner">
            <div className="page-title">🎮 <em>Games</em></div>
            <p className="page-sub">Play and have fun</p>
            <div className="games-grid">
              {[
                {id:"ttt",nm:"Tic Tac Toe",ic:"⭕",pl:"vs AI",badge:"Play now",col:"#e8445a"},
                {id:"wordle",nm:"Wordle",ic:"📝",pl:"Solo",badge:"New",col:"#6c5ce7"},
                {id:"trivia",nm:"Trivia Night",ic:"🧠",pl:"Solo",badge:"Hot",col:"#00d4aa"},
                {id:"chess",nm:"Chess",ic:"♟️",pl:"Coming soon",badge:"Soon",col:"#f0a500"},
              ].map(g=>(
                <div key={g.id} className="g-card" onClick={()=>{
                  if(g.id==="ttt"){setBoard(Array(9).fill(null));setXTurn(true);setTttW(null);setGame("ttt")}
                  else if(g.id==="wordle"){setWGuesses([]);setWCur("");setWDone(false);setWMsg("");setGame("wordle")}
                  else if(g.id==="trivia"){setTIdx(0);setTScore(0);setTSel(null);setTDone(false);setGame("trivia")}
                  else showToast("🎮",g.nm+" coming soon!")
                }}>
                  <div className="g-icon">{g.ic}</div>
                  <div className="g-name">{g.nm}</div>
                  <div className="g-pl">{g.pl}</div>
                  <div className="g-badge" style={{background:g.col+"22",color:g.col}}>{g.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

    {/* CALL */}
    {callOn&&(
      <div className="call-ov" onClick={e=>e.target===e.currentTarget&&setCallOn(false)}>
        <div className="call-box">
          <div className="call-av" style={{background:friend?.color||"var(--accent)",border:"3px solid var(--accent3)"}}>
            {initials(friend?.name||"?")}
          </div>
          <div className="call-name">{friend?.name}</div>
          <div className="call-status">{videoOn?"Video Call":"Voice Call"}</div>
          <div className="call-dur">{fmt(callSecs)}</div>
          <div className="call-btns">
            <button className="c-btn mute" onClick={()=>setMuted(m=>!m)}>{muted?"🔇":"🎙️"}</button>
            <button className="c-btn end" onClick={()=>{setCallOn(false);setVideoOn(false);showToast("📞","Call ended — "+fmt(callSecs))}}>📵</button>
            <button className="c-btn vid" onClick={()=>setVideoOn(v=>!v)}>{videoOn?"🚫📹":"📹"}</button>
          </div>
        </div>
      </div>
    )}

    {/* TTT */}
    {game==="ttt"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-box">
          <div className="g-title">⭕ Tic Tac Toe</div>
          <div className="g-sub">You ❌ vs AI ⭕</div>
          <div className={"ttt-st"+(tttW?" ttt-win":"")}>{tttW?(tttW==="draw"?"Draw 🤝":tttW==="❌"?"You win! 🎉":"AI wins 🤖"):(xTurn?"Your turn ❌":"AI thinking...")}</div>
          <div className="ttt-board">
            {board.map((cell,i)=>(
              <button key={i} className={"ttt-cell"+(cell==="❌"?" x":cell==="⭕"?" o":"")} onClick={()=>clickTTT(i)} disabled={!!cell||!!tttW||!xTurn}>{cell}</button>
            ))}
          </div>
          <button className="btn-primary" style={{marginTop:12}} onClick={()=>{setBoard(Array(9).fill(null));setXTurn(true);setTttW(null)}}>New Game 🔄</button>
          <button style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--fb)"}} onClick={()=>setGame(null)}>Close</button>
        </div>
      </div>
    )}

    {/* WORDLE */}
    {game==="wordle"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-box">
          <div className="g-title">📝 Wordle</div>
          <div className="g-sub">Guess the 5-letter word in 6 tries</div>
          {wMsg&&<div style={{fontSize:".82rem",color:wDone&&wGuesses.slice(-1)[0]===wTarget?"var(--accent3)":"var(--accent)",marginBottom:8,fontWeight:600}}>{wMsg}</div>}
          <div className="wordle-grid">
            {Array(6).fill(null).map((_,row)=>(
              <div key={row} className="wordle-row">
                {Array(5).fill(null).map((_,col)=>{
                  const isActive=row===wGuesses.length;
                  const ch=isActive?(wCur[col]||""):(wGuesses[row]?.[col]||"");
                  const state=wTileState(row,col);
                  return<div key={col} className={"w-tile"+(state?" "+state:ch?" filled":"")}>{ch}</div>
                })}
              </div>
            ))}
          </div>
          <div className="wordle-kbd">
            {KBD_ROWS.map((row,i)=>(
              <div key={i} className="kbd-row">
                {row.map(k=><button key={k} className={"kbd-key"+(k.length>1?" wide":"")+" "+(wColors[k]||"")} onClick={()=>wKey(k)}>{k}</button>)}
              </div>
            ))}
          </div>
          {wDone&&<button className="btn-primary" style={{marginTop:12}} onClick={()=>{setWGuesses([]);setWCur("");setWDone(false);setWMsg("")}}>Play Again 🔄</button>}
          <button style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--fb)"}} onClick={()=>setGame(null)}>Close</button>
        </div>
      </div>
    )}

    {/* TRIVIA */}
    {game==="trivia"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-box">
          <div className="g-title">🧠 Trivia Night</div>
          {!tDone?(
            <>
              <div className="g-sub">Question {tIdx+1} of {TRIVIA_QS.length}</div>
              <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,color:"var(--accent3)",marginBottom:8}}>Score: {tScore}</div>
              <div className="trivia-q">{TRIVIA_QS[tIdx].q}</div>
              <div className="trivia-opts">
                {TRIVIA_QS[tIdx].opts.map((o,i)=>(
                  <button key={i} className={"t-opt"+(tSel!==null?(i===TRIVIA_QS[tIdx].ans?" correct":i===tSel?" wrong":""):"")} onClick={()=>pickTrivia(i)} disabled={tSel!==null}>{o}</button>
                ))}
              </div>
            </>
          ):(
            <>
              <div style={{fontSize:"3rem",margin:"16px 0"}}>🏆</div>
              <div style={{fontFamily:"var(--fh)",fontSize:"1.1rem",color:"var(--accent3)",fontWeight:700,marginBottom:8}}>Score: {tScore}/{TRIVIA_QS.length}</div>
              <div className="g-sub">{tScore>=4?"Amazing! 🔥":tScore>=2?"Good job! 👍":"Keep going! 💪"}</div>
              <button className="btn-primary" style={{marginTop:12}} onClick={()=>{setTIdx(0);setTScore(0);setTSel(null);setTDone(false)}}>Play Again 🔄</button>
            </>
          )}
          <button style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--fb)"}} onClick={()=>setGame(null)}>Close</button>
        </div>
      </div>
    )}

    {toast&&<div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div></>
  );
}