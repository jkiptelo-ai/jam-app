import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, remove, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfaqmdxpwOqs7GwBUadjHj_2Eh2nprlj4",
  authDomain: "jam-app-76645.firebaseapp.com",
  databaseURL: "https://jam-app-76645-default-rtdb.firebaseio.com",
  projectId: "jam-app-76645",
  storageBucket: "jam-app-76645.firebasestorage.app",
  messagingSenderId: "819322781490",
  appId: "1:819322781490:web:535f94161b231ffc8d612b"
};

const CLOUDINARY_CLOUD = "defynojxf";
const CLOUDINARY_PRESET = "e5jozzri";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Upload file to Cloudinary
const uploadToCloudinary = async (file, onProgress) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_URL);
    xhr.upload.onprogress = e => { if(e.lengthComputable && onProgress) onProgress(Math.round(e.loaded/e.total*100)); };
    xhr.onload = () => { const r = JSON.parse(xhr.responseText); if(r.secure_url) resolve(r.secure_url); else reject(r); };
    xhr.onerror = reject;
    xhr.send(fd);
  });
};

const getYTId = url => { const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/); return m?m[1]:null; };
const COLORS = ["#e8445a","#6c5ce7","#00d4aa","#f0a500","#e17055","#74b9ff","#fd79a8","#00b894","#a29bfe","#55efc4"];
const pickColor = n => { let h=0; for(let c of (n||"")) h=(h*31+c.charCodeAt(0))%COLORS.length; return COLORS[h]; };
const initials = n => (n||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const fmt = s => Math.floor(s/60)+":"+(String(s%60).padStart(2,"0"));
const nowTime = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const getChatId = (a,b) => [a,b].sort().join("_");
const fmtDate = ts => { if(!ts) return ""; const d=new Date(ts),t=new Date(); if(d.toDateString()===t.toDateString()) return "Today"; const y=new Date(t); y.setDate(y.getDate()-1); if(d.toDateString()===y.toDateString()) return "Yesterday"; return d.toLocaleDateString(); };
const EMOJIS = "😂❤️🔥🎵🎮🌟👀😍🙌💯🎉😭🤩💪🙏😊🎶".split("");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07080d;--s1:#0f1018;--s2:#161720;--s3:#1e2030;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);
  --a1:#e8445a;--a2:#6c5ce7;--a3:#00d4aa;--a4:#f0a500;
  --text:#eeeaf8;--muted:#7a7898;
  --fh:'Syne',sans-serif;--fb:'DM Sans',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--fb);overflow:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--s3);border-radius:10px}
.app{width:100vw;height:100vh;display:flex;overflow:hidden}
.mesh{position:fixed;inset:0;pointer-events:none;z-index:0;background:
  radial-gradient(ellipse 55% 45% at 15% 15%,rgba(232,68,90,.1) 0%,transparent 55%),
  radial-gradient(ellipse 45% 55% at 85% 85%,rgba(108,92,231,.1) 0%,transparent 55%)}

/* AUTH */
.auth-wrap{position:relative;z-index:10;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:16px}
.auth-card{width:100%;max-width:420px;background:var(--s1);border:1px solid var(--border2);border-radius:28px;padding:44px 38px;animation:fadeUp .5s cubic-bezier(.16,1,.3,1)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.auth-logo{font-family:var(--fh);font-size:3rem;font-weight:800;letter-spacing:-2px;margin-bottom:4px}
.auth-logo em{color:var(--a1);font-style:normal}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:28px}
.auth-tabs{display:flex;gap:4px;background:var(--bg);border-radius:12px;padding:4px;margin-bottom:22px}
.auth-tab{flex:1;padding:9px;border:none;border-radius:8px;background:transparent;color:var(--muted);font-family:var(--fb);font-size:.88rem;cursor:pointer;transition:all .2s}
.auth-tab.on{background:var(--a1);color:#fff;font-weight:600}
.field{margin-bottom:13px}
.field label{display:block;font-size:.72rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}
.field input{width:100%;padding:11px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.9rem;outline:none;transition:border-color .2s}
.field input:focus{border-color:var(--a1)}
.field input::placeholder{color:rgba(255,255,255,.18)}
.btn-red{width:100%;padding:13px;background:var(--a1);border:none;border-radius:12px;color:#fff;font-family:var(--fh);font-size:.95rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:4px}
.btn-red:hover{filter:brightness(1.1);box-shadow:0 0 28px rgba(232,68,90,.4);transform:translateY(-1px)}
.btn-red:disabled{opacity:.5;cursor:not-allowed;transform:none}
.auth-err{color:var(--a1);font-size:.78rem;margin-top:8px;text-align:center;min-height:16px}

/* LAYOUT */
.layout{position:relative;z-index:5;display:flex;width:100%;height:100%}

/* SIDEBAR */
.sidebar{width:66px;height:100%;background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:5px;flex-shrink:0}
.sb-logo{font-family:var(--fh);font-size:1.4rem;font-weight:800;color:var(--a1);margin-bottom:12px;letter-spacing:-1px}
.sb-btn{width:46px;height:46px;border-radius:13px;border:none;background:transparent;color:var(--muted);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative}
.sb-btn:hover{background:var(--s2);color:var(--text)}
.sb-btn.on{background:var(--a1);color:#fff;box-shadow:0 0 18px rgba(232,68,90,.35)}
.sb-gap{flex:1}
.me-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:#fff;border:2px solid var(--border2);cursor:pointer}

/* PANEL */
.panel{width:280px;height:100%;background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.panel-hd{padding:16px 14px 10px;display:flex;align-items:center;justify-content:space-between}
.panel-title{font-family:var(--fh);font-size:1rem;font-weight:700}
.srch{margin:0 10px 10px;position:relative}
.srch input{width:100%;padding:8px 12px 8px 30px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text);font-family:var(--fb);font-size:.82rem;outline:none}
.srch input::placeholder{color:var(--muted)}
.srch-ic{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:.85rem;pointer-events:none}
.contact-list{flex:1;overflow-y:auto;padding:0 6px 8px}
.contact-item{display:flex;align-items:center;gap:9px;padding:10px 8px;border-radius:11px;cursor:pointer;transition:background .15s;margin-bottom:2px}
.contact-item:hover{background:var(--s2)}
.contact-item.on{background:rgba(232,68,90,.1)}
.c-av{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;color:#fff;flex-shrink:0}
.c-info{flex:1;min-width:0}
.c-name{font-size:.88rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c-sub{font-size:.72rem;color:var(--muted);margin-top:1px}
.no-contacts{padding:20px 14px;text-align:center;color:var(--muted);font-size:.8rem;line-height:1.7}

/* CHAT */
.chat-area{flex:1;display:flex;flex-direction:column;height:100%;min-width:0;background:var(--bg)}
.chat-hd{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--s1);flex-shrink:0}
.chat-hd-name{font-family:var(--fh);font-size:.95rem;font-weight:700}
.chat-hd-sub{font-size:.71rem;color:var(--a3);margin-top:1px}
.chat-hd-acts{display:flex;gap:5px;margin-left:auto}
.hd-btn{width:34px;height:34px;border-radius:9px;border:none;background:var(--s2);color:var(--muted);font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.hd-btn:hover{background:var(--a1);color:#fff}
.msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:2px;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.date-div{display:flex;justify-content:center;margin:10px 0}
.date-chip{background:var(--s2);border-radius:20px;padding:3px 12px;font-size:.68rem;color:var(--muted)}
.msg-wrap{display:flex;flex-direction:column;margin-bottom:1px}
.msg-wrap.me{align-items:flex-end}
.bubble{max-width:65%;padding:9px 12px 5px;border-radius:14px;font-size:.87rem;line-height:1.55;word-break:break-word}
.bubble.them{background:var(--s2);border-top-left-radius:3px}
.bubble.me{background:#005c4b;color:#e9fdd7;border-top-right-radius:3px}
.b-time{font-size:.62rem;color:rgba(255,255,255,.35);text-align:right;margin-top:2px}
.bubble.them .b-time{color:var(--muted)}
.msg-img{max-width:220px;border-radius:12px;margin-top:4px;cursor:pointer}
.msg-video{max-width:240px;border-radius:12px;margin-top:4px}
.msg-audio{width:200px;margin-top:4px}
.input-area{padding:9px 12px 11px;border-top:1px solid var(--border);background:var(--s1);flex-shrink:0}
.emoji-tray{display:flex;gap:5px;margin-bottom:6px;flex-wrap:wrap}
.em{background:none;border:none;font-size:1.05rem;cursor:pointer;padding:2px 4px;border-radius:6px;transition:transform .15s}
.em:hover{transform:scale(1.3)}
.input-row{display:flex;gap:7px;align-items:flex-end}
.msg-ta{flex:1;padding:10px 14px;background:var(--bg);border:none;border-radius:22px;color:var(--text);font-family:var(--fb);font-size:.87rem;outline:none;resize:none;max-height:100px;line-height:1.45}
.msg-ta::placeholder{color:var(--muted)}
.send-btn{width:42px;height:42px;border-radius:50%;border:none;background:var(--a1);color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.send-btn:hover{filter:brightness(1.1)}
.send-btn:disabled{opacity:.4;cursor:not-allowed}
.em-toggle{width:42px;height:42px;border-radius:50%;border:none;background:var(--s2);color:var(--muted);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.attach-btn{width:42px;height:42px;border-radius:50%;border:none;background:var(--s2);color:var(--muted);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.attach-btn:hover{color:var(--text)}
.upload-prog{height:3px;background:var(--s3);border-radius:3px;margin-bottom:6px}
.upload-prog-fill{height:100%;background:var(--a1);border-radius:3px;transition:width .3s}

/* PAGE */
.page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.page-inner{padding:22px;max-width:640px}
.page-title{font-family:var(--fh);font-size:1.6rem;font-weight:800;letter-spacing:-1px;margin-bottom:4px}
.page-title em{color:var(--a1);font-style:normal}
.page-sub{color:var(--muted);font-size:.83rem;margin-bottom:22px}
.sec-lbl{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}

/* EXPLORE */
.user-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--s1);border:1px solid var(--border);border-radius:14px;margin-bottom:8px}
.user-av{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;flex-shrink:0;cursor:pointer}
.user-info{flex:1;min-width:0}
.user-name{font-size:.9rem;font-weight:600}
.user-sub{font-size:.73rem;color:var(--muted);margin-top:2px}
.follow-btn{padding:7px 16px;border-radius:20px;border:none;font-family:var(--fh);font-size:.78rem;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0}
.follow-btn.follow{background:var(--a1);color:#fff}
.follow-btn.follow:hover{filter:brightness(1.1)}
.follow-btn.following{background:var(--s2);color:var(--muted);border:1px solid var(--border2)}
.follow-btn.following:hover{background:rgba(232,68,90,.15);color:var(--a1);border-color:var(--a1)}
.follow-btn.mutual{background:var(--a3);color:var(--bg)}

/* PROFILE */
.profile-card{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:24px;margin-bottom:20px;text-align:center}
.profile-av-big{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;color:#fff;margin:0 auto 12px;border:3px solid var(--a1)}
.profile-name{font-family:var(--fh);font-size:1.2rem;font-weight:700}
.profile-email{font-size:.78rem;color:var(--muted);margin-top:3px}
.profile-stats{display:flex;justify-content:center;gap:24px;margin-top:16px}
.stat{text-align:center}
.stat-num{font-family:var(--fh);font-size:1.1rem;font-weight:700}
.stat-lbl{font-size:.7rem;color:var(--muted);margin-top:2px}
.logout-btn{margin-top:16px;padding:9px 20px;background:none;border:1px solid var(--border2);border-radius:20px;color:var(--muted);font-family:var(--fb);font-size:.82rem;cursor:pointer;transition:all .2s}
.logout-btn:hover{border-color:var(--a1);color:var(--a1)}

/* STORIES */
.stories-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;margin-bottom:20px}
.stories-row::-webkit-scrollbar{display:none}
.story-it{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;flex-shrink:0}
.story-ring{width:60px;height:60px;border-radius:50%;padding:2.5px;background:linear-gradient(135deg,var(--a1),var(--a2))}
.story-ring.add{background:var(--s2);border:2px dashed var(--border2)}
.story-in{width:100%;height:100%;border-radius:50%;border:2.5px solid var(--bg);background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;overflow:hidden}
.story-in img{width:100%;height:100%;object-fit:cover}
.story-nm{font-size:.64rem;color:var(--muted);text-align:center;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* STORY OVERLAY */
.story-ov{position:fixed;inset:0;z-index:300;background:#000;display:flex;align-items:center;justify-content:center}
.story-viewer{width:min(400px,100vw);height:100vh;position:relative;display:flex;align-items:center;justify-content:center}
.story-prog{position:absolute;top:0;left:0;right:0;padding:12px 12px 0;display:flex;gap:4px;z-index:2}
.story-prog-bar{flex:1;height:3px;background:rgba(255,255,255,.3);border-radius:3px;overflow:hidden}
.story-prog-fill{height:100%;background:#fff;border-radius:3px;transition:width .1s linear}
.story-content{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:70px 24px 80px;position:relative}
.story-bg{position:absolute;inset:0;z-index:0}
.story-bg img,.story-bg video{width:100%;height:100%;object-fit:cover}
.story-text-big{font-family:var(--fh);font-size:1.6rem;font-weight:800;text-align:center;z-index:1;text-shadow:0 2px 20px rgba(0,0,0,.6);max-width:90%}
.story-user-row{position:absolute;top:50px;left:14px;right:44px;display:flex;align-items:center;gap:8px;z-index:2}
.story-close{position:absolute;top:50px;right:14px;background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;z-index:10}

/* CLIPS */
.clips-page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.clips-inner{padding:16px;max-width:600px}
.clip-card{background:var(--s1);border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-bottom:16px}
.clip-media{width:100%;aspect-ratio:9/16;max-height:500px;background:#000;position:relative;overflow:hidden;cursor:pointer}
.clip-media video{width:100%;height:100%;object-fit:cover}
.clip-media iframe{width:100%;height:100%;border:none}
.clip-media img{width:100%;height:100%;object-fit:cover}
.clip-play-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.3)}
.clip-play-btn{width:60px;height:60px;background:rgba(0,0,0,.6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.6rem}
.clip-info{padding:12px 14px}
.clip-user-row{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.clip-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;color:#fff;flex-shrink:0}
.clip-username{font-size:.88rem;font-weight:600}
.clip-time{font-size:.7rem;color:var(--muted);margin-left:auto}
.clip-caption{font-size:.85rem;color:var(--muted);margin-bottom:10px;line-height:1.5}
.clip-acts{display:flex;gap:12px}
.clip-act{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--muted);font-family:var(--fb);font-size:.8rem;cursor:pointer;padding:5px 8px;border-radius:8px;transition:all .2s}
.clip-act:hover{background:var(--s2);color:var(--text)}
.clip-act.liked{color:var(--a1)}
.add-clip-form{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:20px}
.add-clip-title{font-family:var(--fh);font-size:.9rem;font-weight:700;margin-bottom:12px}
.clip-inp{width:100%;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.85rem;outline:none;margin-bottom:8px;transition:border-color .2s}
.clip-inp:focus{border-color:var(--a1)}
.clip-inp::placeholder{color:var(--muted)}
.tab-row{display:flex;gap:4px;background:var(--bg);border-radius:10px;padding:3px;margin-bottom:12px}
.tab{flex:1;padding:8px;border:none;border-radius:7px;background:transparent;color:var(--muted);font-family:var(--fb);font-size:.82rem;cursor:pointer;transition:all .2s}
.tab.on{background:var(--a1);color:#fff;font-weight:600}
.file-drop{border:2px dashed var(--border2);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:8px;color:var(--muted);font-size:.85rem}
.file-drop:hover{border-color:var(--a1);color:var(--text)}
.file-drop input{display:none}
.post-btn{padding:10px 20px;background:var(--a1);border:none;border-radius:10px;color:#fff;font-family:var(--fh);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s}
.post-btn:hover{filter:brightness(1.1)}
.post-btn:disabled{opacity:.5;cursor:not-allowed}
.prog-bar-wrap{margin-bottom:8px}
.prog-bar{height:5px;background:var(--s3);border-radius:5px;overflow:hidden}
.prog-fill{height:100%;background:var(--a1);border-radius:5px;transition:width .3s}
.prog-txt{font-size:.75rem;color:var(--muted);margin-top:4px}

/* MUSIC ROOM */
.music-page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.music-inner{padding:22px;max-width:700px}
.player-card{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:22px;margin-bottom:20px;position:relative;overflow:hidden}
.player-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 85% 50%,rgba(108,92,231,.15) 0%,transparent 60%);pointer-events:none}
.np-row{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.trk-art{width:64px;height:64px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.8rem;overflow:hidden;background:var(--s2)}
.trk-art img{width:100%;height:100%;object-fit:cover}
.trk-name{font-family:var(--fh);font-size:1rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.trk-artist{font-size:.78rem;color:var(--muted);margin-top:2px}
.trk-src{font-size:.68rem;color:var(--a3);margin-top:3px}
.prog-bar2{height:5px;background:var(--s3);border-radius:5px;cursor:pointer;margin-bottom:5px}
.prog-fill2{height:100%;background:var(--a1);border-radius:5px}
.prog-times{display:flex;justify-content:space-between;font-size:.68rem;color:var(--muted);margin-bottom:14px}
.ctrl-row{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px}
.ctrl{background:none;border:none;color:var(--muted);font-size:1.05rem;cursor:pointer;padding:7px;border-radius:8px;transition:all .2s}
.ctrl:hover{color:var(--text);background:var(--s2)}
.ctrl.pp{width:48px;height:48px;border-radius:50%;background:var(--a1);color:#fff;font-size:1.2rem;display:flex;align-items:center;justify-content:center}
.ctrl.pp:hover{filter:brightness(1.1);box-shadow:0 0 18px rgba(232,68,90,.4)}
.vol-row{display:flex;align-items:center;gap:10px}
.vol-sl{flex:1;-webkit-appearance:none;appearance:none;height:3px;background:var(--s3);border-radius:3px;outline:none;cursor:pointer}
.vol-sl::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--a1);cursor:pointer}
.listeners-row{display:flex;align-items:center;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
.l-avs{display:flex}
.l-av{width:26px;height:26px;border-radius:50%;border:2px solid var(--s1);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff;margin-left:-7px}
.l-av:first-child{margin-left:0}
.queue-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:11px;cursor:pointer;transition:background .15s}
.queue-item:hover{background:var(--s2)}
.queue-item.on{background:rgba(232,68,90,.1)}
.q-art{width:38px;height:38px;border-radius:8px;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;overflow:hidden}
.q-art img{width:100%;height:100%;object-fit:cover}

/* WATCH TOGETHER */
.watch-page{flex:1;height:100%;overflow-y:auto;background:var(--bg)}
.watch-inner{padding:22px;max-width:800px}
.watch-screen{width:100%;aspect-ratio:16/9;background:#000;border-radius:16px;overflow:hidden;margin-bottom:14px;border:1px solid var(--border);position:relative}
.watch-screen iframe,.watch-screen video{width:100%;height:100%;border:none}
.watch-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--muted)}
.watch-chat{background:var(--s1);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-top:14px}
.watch-chat-hd{padding:11px 14px;border-bottom:1px solid var(--border);font-family:var(--fh);font-size:.88rem;font-weight:700;display:flex;align-items:center;gap:8px}
.watch-msgs{height:200px;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:5px}
.watch-msg{font-size:.82rem;display:flex;gap:6px}
.watch-msg-name{font-weight:600;flex-shrink:0}
.watch-msg-text{color:var(--muted)}
.watch-inp-row{display:flex;gap:7px;padding:9px 10px;border-top:1px solid var(--border)}
.watch-inp{flex:1;padding:7px 12px;background:var(--bg);border:1px solid var(--border);border-radius:20px;color:var(--text);font-family:var(--fb);font-size:.82rem;outline:none}
.watch-inp::placeholder{color:var(--muted)}
.watch-send{padding:7px 14px;background:var(--a1);border:none;border-radius:20px;color:#fff;font-size:.82rem;cursor:pointer;font-family:var(--fh);font-weight:700}
.watch-controls{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.watch-ctrl-btn{padding:8px 14px;border-radius:10px;border:none;background:var(--s2);color:var(--text);font-family:var(--fb);font-size:.82rem;cursor:pointer;transition:all .2s}
.watch-ctrl-btn:hover{background:var(--s3)}
.watch-ctrl-btn.active{background:var(--a1);color:#fff}
.viewer-count{font-size:.78rem;color:var(--a3);display:flex;align-items:center;gap:5px}

/* CALL */
.call-ov{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.92);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center}
.call-box{background:var(--s1);border:1px solid var(--border2);border-radius:28px;padding:40px 36px;text-align:center;width:300px;animation:scUp .3s cubic-bezier(.16,1,.3,1)}
@keyframes scUp{from{opacity:0;scale:.9}to{opacity:1;scale:1}}
.call-av-big{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;color:#fff;margin:0 auto 12px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(232,68,90,.3)}50%{box-shadow:0 0 0 16px rgba(232,68,90,0)}}
.call-name{font-family:var(--fh);font-size:1.2rem;font-weight:700;margin-bottom:4px}
.call-st{color:var(--muted);font-size:.82rem;margin-bottom:6px}
.call-dur{color:var(--a3);font-size:1rem;font-weight:600;margin-bottom:24px;font-variant-numeric:tabular-nums}
.call-btns{display:flex;justify-content:center;gap:14px}
.c-btn{width:50px;height:50px;border-radius:50%;border:none;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.c-btn.mute{background:var(--s2);color:var(--text)}
.c-btn.end{background:#ef4444;color:#fff}
.c-btn.end:hover{background:#dc2626;transform:scale(1.06)}
.c-btn.vid{background:var(--s2);color:var(--text)}

/* TOAST */
.toast{position:fixed;bottom:18px;right:18px;z-index:500;background:var(--s2);border:1px solid var(--border2);border-radius:13px;padding:11px 16px;font-size:.83rem;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:slideIn .3s cubic-bezier(.16,1,.3,1);max-width:280px}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.spin{width:18px;height:18px;border:2px solid var(--border2);border-top-color:var(--a1);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);text-align:center;padding:24px}
.empty-icon{font-size:3rem;opacity:.35}
.empty-title{font-family:var(--fh);font-size:1rem;font-weight:700;color:var(--text)}
.empty-sub{font-size:.81rem;max-width:260px;line-height:1.6}

@media(max-width:640px){.panel{width:220px}}
@media(max-width:480px){.panel{display:none}}
`;

export default function Jam() {
  const [screen, setScreen] = useState("loading");
  const [authTab, setAuthTab] = useState("login");
  const [nameVal, setNameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [pwVal, setPwVal] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [nav, setNav] = useState("chat");
  const [allUsers, setAllUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const [followers, setFollowers] = useState({});
  const [mutuals, setMutuals] = useState([]);
  const [friend, setFriend] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadProg, setUploadProg] = useState(0);
  const [uploading, setUploading] = useState(false);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  // stories
  const [stories, setStories] = useState([]);
  const [storyText, setStoryText] = useState("");
  const [storyColor, setStoryColor] = useState("#e8445a");
  const [storyTab, setStoryTab] = useState("text");
  const [viewStory, setViewStory] = useState(null);
  const [storyProg, setStoryProg] = useState(0);
  const [storyUploading, setStoryUploading] = useState(false);
  const [storyUploadProg, setStoryUploadProg] = useState(0);
  const storyFileRef = useRef(null);
  const storyTimer = useRef(null);

  // clips
  const [clips, setClips] = useState([]);
  const [clipTab, setClipTab] = useState("link");
  const [clipUrl, setClipUrl] = useState("");
  const [clipCaption, setClipCaption] = useState("");
  const [clipUploading, setClipUploading] = useState(false);
  const [clipUploadProg, setClipUploadProg] = useState(0);
  const [activeClip, setActiveClip] = useState(null);
  const clipFileRef = useRef(null);

  // music
  const [musicTab, setMusicTab] = useState("link");
  const [musicUrl, setMusicUrl] = useState("");
  const [musicRoom, setMusicRoom] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicProg, setMusicProg] = useState(0);
  const [musicVol, setMusicVol] = useState(80);
  const [musicUploading, setMusicUploading] = useState(false);
  const [musicUploadProg, setMusicUploadProg] = useState(0);
  const audioRef = useRef(null);
  const musicFileRef = useRef(null);
  const musicTimer = useRef(null);

  // watch
  const [watchTab, setWatchTab] = useState("link");
  const [watchUrl, setWatchUrl] = useState("");
  const [watchRoom, setWatchRoom] = useState(null);
  const [watchChat, setWatchChat] = useState([{name:"Jam",text:"Welcome to the Watch Room! 🎬",color:"#e8445a"}]);
  const [watchChatInput, setWatchChatInput] = useState("");
  const [watchUploading, setWatchUploading] = useState(false);
  const [watchUploadProg, setWatchUploadProg] = useState(0);
  const watchFileRef = useRef(null);
  const watchVideoRef = useRef(null);
  const watchMsgsRef = useRef(null);

  // call
  const [callOn, setCallOn] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const callRef = useRef(null);

  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  const showToast = (icon, msg) => {
    setToast({icon,msg});
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(null), 3500);
  };

  // ── AUTH STATE ──
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u => {
      if(u){
        const snap = await get(ref(db,`users/${u.uid}`));
        const data = snap.val();
        if(data) setUser(data);
        else setUser({uid:u.uid,email:u.email,name:u.email.split("@")[0],color:pickColor(u.email)});
        setScreen("app");
      } else { setUser(null); setScreen("auth"); }
    });
    return ()=>unsub();
  },[]);

  // ── USERS ──
  useEffect(()=>{ if(!user) return; return onValue(ref(db,"users"), snap=>{ const d=snap.val(); if(d) setAllUsers(Object.values(d).filter(u=>u.uid!==user.uid)); }); },[user]);
  useEffect(()=>{ if(!user) return; return onValue(ref(db,`following/${user.uid}`), snap=>setFollowing(snap.val()||{})); },[user]);
  useEffect(()=>{ if(!user) return; return onValue(ref(db,`followers/${user.uid}`), snap=>setFollowers(snap.val()||{})); },[user]);
  useEffect(()=>{ const m=allUsers.filter(u=>following[u.uid]&&followers[u.uid]); setMutuals(m); },[following,followers,allUsers]);

  // ── MESSAGES ──
  useEffect(()=>{
    if(!user||!friend) return;
    const chatId=getChatId(user.uid,friend.uid);
    return onValue(ref(db,`messages/${chatId}`), snap=>{ const d=snap.val(); if(d) setMsgs(Object.values(d).sort((a,b)=>a.ts-b.ts)); else setMsgs([]); });
  },[user,friend]);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  // ── STORIES ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"stories"), snap=>{
      const d=snap.val();
      if(d){ const now=Date.now(); setStories(Object.values(d).filter(s=>now-s.createdAt<86400000).sort((a,b)=>b.createdAt-a.createdAt)); }
      else setStories([]);
    });
  },[user]);

  // ── CLIPS ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"clips"), snap=>{ const d=snap.val(); if(d) setClips(Object.entries(d).map(([id,v])=>({id,...v})).sort((a,b)=>b.createdAt-a.createdAt)); else setClips([]); });
  },[user]);

  // ── MUSIC ROOM ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"musicRoom"), snap=>{ const d=snap.val(); if(d) setMusicRoom(d); else setMusicRoom(null); });
  },[user]);

  // ── WATCH ROOM ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"watchRoom"), snap=>{ const d=snap.val(); if(d) setWatchRoom(d); else setWatchRoom(null); });
  },[user]);

  // ── WATCH CHAT ──
  useEffect(()=>{
    if(!user) return;
    return onValue(ref(db,"watchChat"), snap=>{ const d=snap.val(); if(d) setWatchChat(Object.values(d).sort((a,b)=>a.ts-b.ts)); else setWatchChat([]); });
  },[user]);

  useEffect(()=>{ if(watchMsgsRef.current) watchMsgsRef.current.scrollTop=watchMsgsRef.current.scrollHeight; },[watchChat]);

  // ── STORY TIMER ──
  useEffect(()=>{
    if(!viewStory) return;
    setStoryProg(0);
    storyTimer.current=setInterval(()=>setStoryProg(p=>{ if(p>=100){setViewStory(null);return 0;} return p+(100/50); }),100);
    return ()=>clearInterval(storyTimer.current);
  },[viewStory]);

  // ── CALL TIMER ──
  useEffect(()=>{ if(callOn){callRef.current=setInterval(()=>setCallSecs(s=>s+1),1000);}else{clearInterval(callRef.current);setCallSecs(0);} return()=>clearInterval(callRef.current); },[callOn]);

  // ── MUSIC TIMER ──
  useEffect(()=>{
    if(musicRoom?.type==="local"&&audioRef.current){
      if(musicPlaying) audioRef.current.play().catch(()=>{});
      else audioRef.current.pause();
    }
    if(musicRoom?.type==="youtube"&&musicPlaying){
      musicTimer.current=setInterval(()=>setMusicProg(p=>p+1),1000);
    } else clearInterval(musicTimer.current);
    return()=>clearInterval(musicTimer.current);
  },[musicPlaying,musicRoom]);

  // ── FOLLOW ──
  const toggleFollow = async u => {
    if(!user) return;
    if(following[u.uid]){ await remove(ref(db,`following/${user.uid}/${u.uid}`)); await remove(ref(db,`followers/${u.uid}/${user.uid}`)); showToast("👋","Unfollowed "+u.name); }
    else { await set(ref(db,`following/${user.uid}/${u.uid}`),true); await set(ref(db,`followers/${u.uid}/${user.uid}`),true); showToast("✅","Following "+u.name); }
  };

  // ── AUTH ──
  const doAuth = async () => {
    setAuthErr(""); setAuthLoading(true);
    try {
      if(authTab==="signup"){
        if(!nameVal.trim()){setAuthErr("Enter your name");setAuthLoading(false);return;}
        if(pwVal.length<6){setAuthErr("Password needs 6+ characters");setAuthLoading(false);return;}
        const cred=await createUserWithEmailAndPassword(auth,emailVal,pwVal);
        await set(ref(db,`users/${cred.user.uid}`),{uid:cred.user.uid,name:nameVal.trim(),email:emailVal,color:pickColor(nameVal.trim()),joinedAt:Date.now()});
      } else { await signInWithEmailAndPassword(auth,emailVal,pwVal); }
    } catch(e){
      const m={"auth/email-already-in-use":"Email already used","auth/wrong-password":"Wrong password","auth/invalid-credential":"Wrong email or password","auth/user-not-found":"No account found","auth/invalid-email":"Invalid email"};
      setAuthErr(m[e.code]||e.message);
    }
    setAuthLoading(false);
  };

  // ── SEND MSG ──
  const sendMsg = async () => {
    if(!input.trim()||sending||!friend||!user) return;
    const text=input.trim(); setInput(""); setShowEmoji(false); setSending(true);
    const chatId=getChatId(user.uid,friend.uid);
    await push(ref(db,`messages/${chatId}`),{text,senderId:user.uid,senderName:user.name,color:user.color,ts:Date.now(),time:nowTime(),type:"text"});
    setSending(false);
  };

  // ── SEND FILE IN CHAT ──
  const sendFile = async file => {
    if(!friend||!user) return;
    setUploading(true); setUploadProg(0);
    try {
      const url = await uploadToCloudinary(file, setUploadProg);
      const type = file.type.startsWith("video")?"video":file.type.startsWith("audio")?"audio":"image";
      const chatId=getChatId(user.uid,friend.uid);
      await push(ref(db,`messages/${chatId}`),{url,type,senderId:user.uid,senderName:user.name,color:user.color,ts:Date.now(),time:nowTime()});
    } catch(e){ showToast("❌","Upload failed"); }
    setUploading(false); setUploadProg(0);
  };

  // ── POST STORY ──
  const postStory = async (file) => {
    if(storyTab==="text"&&!storyText.trim()) return;
    setStoryUploading(true);
    try {
      let storyData = {authorId:user.uid,authorName:user.name,authorColor:user.color,createdAt:Date.now(),type:storyTab};
      if(storyTab==="text"){ storyData.text=storyText.trim(); storyData.color=storyColor; }
      else if(file){
        const url=await uploadToCloudinary(file,setStoryUploadProg);
        storyData.mediaUrl=url; storyData.mediaType=file.type.startsWith("video")?"video":"image";
      }
      await push(ref(db,"stories"),storyData);
      setStoryText(""); showToast("✨","Story posted!");
    } catch(e){ showToast("❌","Story upload failed"); }
    setStoryUploading(false); setStoryUploadProg(0);
  };

  // ── POST CLIP ──
  const postClip = async (file) => {
    setClipUploading(true); setClipUploadProg(0);
    try {
      let clipData={caption:clipCaption.trim(),authorId:user.uid,authorName:user.name,authorColor:user.color,createdAt:Date.now(),likes:{}};
      if(clipTab==="link"){
        const ytId=getYTId(clipUrl.trim());
        if(!ytId){showToast("❌","Paste a valid YouTube link");setClipUploading(false);return;}
        clipData.ytId=ytId; clipData.type="youtube"; clipData.embedUrl="https://www.youtube.com/embed/"+ytId;
      } else if(file){
        const url=await uploadToCloudinary(file,setClipUploadProg);
        clipData.videoUrl=url; clipData.type="local";
        clipData.thumb=url.replace("/upload/","/upload/w_400,h_600,c_fill/so_1/");
      }
      await push(ref(db,"clips"),clipData);
      setClipUrl(""); setClipCaption(""); showToast("🎬","Clip posted!");
    } catch(e){ showToast("❌","Upload failed: "+e.message); }
    setClipUploading(false); setClipUploadProg(0);
  };

  // ── START MUSIC ROOM ──
  const startMusicRoom = async (file) => {
    setMusicUploading(true);
    try {
      let roomData={startedBy:user.uid,startedByName:user.name,startedAt:Date.now()};
      if(musicTab==="link"){
        const ytId=getYTId(musicUrl.trim());
        if(!ytId){showToast("❌","Paste a valid YouTube link");setMusicUploading(false);return;}
        roomData.type="youtube"; roomData.ytId=ytId; roomData.embedUrl="https://www.youtube.com/embed/"+ytId+"?autoplay=1";
        roomData.title=musicUrl; roomData.artist="YouTube";
      } else if(file){
        const url=await uploadToCloudinary(file,setMusicUploadProg);
        roomData.type="local"; roomData.audioUrl=url; roomData.title=file.name.replace(/\.[^/.]+$/,""); roomData.artist=user.name;
      }
      await set(ref(db,"musicRoom"),roomData);
      setMusicPlaying(true); showToast("🎵","Music room started!");
    } catch(e){ showToast("❌","Failed to start music room"); }
    setMusicUploading(false); setMusicUploadProg(0);
  };

  // ── START WATCH ROOM ──
  const startWatchRoom = async (file) => {
    setWatchUploading(true);
    try {
      let roomData={startedBy:user.uid,startedByName:user.name,startedAt:Date.now()};
      if(watchTab==="link"){
        const ytId=getYTId(watchUrl.trim());
        if(!ytId){showToast("❌","Paste a valid YouTube link");setWatchUploading(false);return;}
        roomData.type="youtube"; roomData.ytId=ytId; roomData.embedUrl="https://www.youtube.com/embed/"+ytId+"?autoplay=1";
      } else if(file){
        const url=await uploadToCloudinary(file,setWatchUploadProg);
        roomData.type="local"; roomData.videoUrl=url;
      }
      await set(ref(db,"watchRoom"),roomData);
      showToast("🎬","Watch party started! Share the link!");
    } catch(e){ showToast("❌","Failed to start watch party"); }
    setWatchUploading(false); setWatchUploadProg(0);
  };

  const sendWatchChat = async () => {
    if(!watchChatInput.trim()) return;
    await push(ref(db,"watchChat"),{name:user.name,text:watchChatInput.trim(),color:user.color,ts:Date.now()});
    setWatchChatInput("");
  };

  const likeClip = async clip => {
    const liked=clip.likes&&clip.likes[user.uid];
    if(liked) await remove(ref(db,`clips/${clip.id}/likes/${user.uid}`));
    else await set(ref(db,`clips/${clip.id}/likes/${user.uid}`),true);
  };

  const myStory=stories.find(s=>s.authorId===user?.uid);
  const seen=new Set(); const otherStories=[];
  stories.forEach(s=>{ if(s.authorId!==user?.uid&&!seen.has(s.authorId)){seen.add(s.authorId);otherStories.push(s);} });

  if(screen==="loading") return (
    <><style>{CSS}</style><div className="app"><div className="mesh"/>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,position:"relative",zIndex:10}}>
      <div style={{fontFamily:"var(--fh)",fontSize:"2.5rem",fontWeight:800,letterSpacing:"-2px"}}>J<span style={{color:"var(--a1)"}}>a</span>m</div>
      <div className="spin"/>
    </div></div></>
  );

  if(screen==="auth") return (
    <><style>{CSS}</style><div className="app"><div className="mesh"/>
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo">J<em>a</em>m</div>
      <p className="auth-sub">Chat · Clips · Stories · Music · Watch — together.</p>
      <div className="auth-tabs">
        <button className={"auth-tab"+(authTab==="login"?" on":"")} onClick={()=>setAuthTab("login")}>Sign In</button>
        <button className={"auth-tab"+(authTab==="signup"?" on":"")} onClick={()=>setAuthTab("signup")}>Create Account</button>
      </div>
      {authTab==="signup"&&<div className="field"><label>Full Name</label><input placeholder="Your name" value={nameVal} onChange={e=>setNameVal(e.target.value)}/></div>}
      <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={emailVal} onChange={e=>setEmailVal(e.target.value)}/></div>
      <div className="field"><label>Password</label><input type="password" placeholder="Min 6 characters" value={pwVal} onChange={e=>setPwVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAuth()}/></div>
      <div className="auth-err">{authErr}</div>
      <button className="btn-red" onClick={doAuth} disabled={authLoading}>{authLoading?"Please wait...":(authTab==="login"?"Sign In 🔐":"Create Account 🚀")}</button>
    </div></div>
    {toast&&<div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div></>
  );

  return (
    <><style>{CSS}</style><div className="app"><div className="mesh"/>
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sb-logo">J</div>
        {[
          {id:"chat",ic:"💬",tip:"Messages"},
          {id:"explore",ic:"🔍",tip:"Explore"},
          {id:"clips",ic:"🎬",tip:"Clips"},
          {id:"stories",ic:"✨",tip:"Stories"},
          {id:"music",ic:"🎵",tip:"Music Together"},
          {id:"watch",ic:"📺",tip:"Watch Together"},
          {id:"profile",ic:"👤",tip:"Profile"},
        ].map(n=>(
          <button key={n.id} className={"sb-btn"+(nav===n.id?" on":"")} title={n.tip} onClick={()=>setNav(n.id)}>{n.ic}</button>
        ))}
        <div className="sb-gap"/>
        <div className="me-av" style={{background:user?.color||"var(--a1)"}} title={user?.name} onClick={()=>setNav("profile")}>{initials(user?.name||"?")}</div>
      </div>

      {/* ══ CHAT ══ */}
      {nav==="chat"&&<>
        <div className="panel">
          <div className="panel-hd"><span className="panel-title">Messages</span><span style={{fontSize:".7rem",color:"var(--muted)"}}>Mutuals only</span></div>
          <div className="srch"><span className="srch-ic">🔍</span><input placeholder="Search..."/></div>
          <div className="contact-list">
            {mutuals.length===0?(
              <div className="no-contacts">💬 No mutual follows yet!<br/>Go to <strong>Explore</strong> to follow people.<br/>Once they follow back you can chat!</div>
            ):mutuals.map(f=>(
              <div key={f.uid} className={"contact-item"+(friend?.uid===f.uid?" on":"")} onClick={()=>setFriend(f)}>
                <div className="c-av" style={{background:f.color||pickColor(f.name)}}>{initials(f.name)}</div>
                <div className="c-info"><div className="c-name">{f.name}</div><div className="c-sub">Mutual · Tap to chat</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-area">
          {friend?(
            <>
              <div className="chat-hd">
                <div style={{width:38,height:38,borderRadius:"50%",background:friend.color||pickColor(friend.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:".88rem",fontWeight:700,color:"#fff",flexShrink:0}}>{initials(friend.name)}</div>
                <div><div className="chat-hd-name">{friend.name}</div><div className="chat-hd-sub">🔒 Private conversation</div></div>
                <div className="chat-hd-acts">
                  <button className="hd-btn" onClick={()=>{setCallOn(true);setVideoOn(false);showToast("📞","Calling "+friend.name+"...")}}>📞</button>
                  <button className="hd-btn" onClick={()=>{setCallOn(true);setVideoOn(true);showToast("📹","Video call started")}}>📹</button>
                </div>
              </div>

              <div className="msgs">
                {msgs.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:".8rem",margin:"20px 0"}}>Say hi to {friend.name}! 👋<br/><span style={{fontSize:".72rem"}}>🔒 Only you two can see this</span></div>}
                {msgs.map((m,i)=>{
                  const isMe=m.senderId===user.uid;
                  const prev=msgs[i-1];
                  const showDate=!prev||fmtDate(m.ts)!==fmtDate(prev.ts);
                  return(
                    <div key={i}>
                      {showDate&&<div className="date-div"><div className="date-chip">{fmtDate(m.ts)}</div></div>}
                      <div className={"msg-wrap"+(isMe?" me":"")}>
                        <div className={"bubble"+(isMe?" me":" them")}>
                          {m.type==="image"&&<img src={m.url} className="msg-img" alt="img"/>}
                          {m.type==="video"&&<video src={m.url} className="msg-video" controls/>}
                          {m.type==="audio"&&<audio src={m.url} className="msg-audio" controls/>}
                          {(!m.type||m.type==="text")&&m.text}
                          <div className="b-time">{m.time}{isMe&&" ✓✓"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef}/>
              </div>

              <div className="input-area">
                {uploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:uploadProg+"%"}}/></div><div className="prog-txt">Uploading {uploadProg}%...</div></div>}
                {showEmoji&&<div className="emoji-tray">{EMOJIS.map(e=><button key={e} className="em" onClick={()=>setInput(p=>p+e)}>{e}</button>)}</div>}
                <div className="input-row">
                  <button className="em-toggle" onClick={()=>setShowEmoji(p=>!p)}>😊</button>
                  <button className="attach-btn" onClick={()=>fileInputRef.current?.click()}>📎</button>
                  <input type="file" ref={fileInputRef} style={{display:"none"}} accept="image/*,video/*,audio/*" onChange={e=>e.target.files[0]&&sendFile(e.target.files[0])}/>
                  <textarea className="msg-ta" placeholder={"Message "+friend.name+"..."} rows={1} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}/>
                  <button className="send-btn" onClick={sendMsg} disabled={sending||!input.trim()}>➤</button>
                </div>
              </div>
            </>
          ):(
            <div className="empty">
              <div className="empty-icon">💬</div>
              <div className="empty-title">{mutuals.length===0?"No mutual follows yet":"Select a chat"}</div>
              <div className="empty-sub">{mutuals.length===0?"Go to Explore, follow someone, and when they follow back you can chat privately!":"Pick someone from the list"}</div>
              {mutuals.length===0&&<button className="btn-red" style={{width:"auto",padding:"10px 24px",marginTop:8}} onClick={()=>setNav("explore")}>Go to Explore 🔍</button>}
            </div>
          )}
        </div>
      </>}

      {/* ══ EXPLORE ══ */}
      {nav==="explore"&&(
        <div className="page"><div className="page-inner">
          <div className="page-title">🔍 <em>Explore</em></div>
          <p className="page-sub">Follow people to connect and chat with them</p>
          {mutuals.length>0&&<><div className="sec-lbl">💬 Mutuals — You can chat!</div>
            {mutuals.map(u=>(
              <div key={u.uid} className="user-card">
                <div className="user-av" style={{background:u.color||pickColor(u.name)}} onClick={()=>{setFriend(u);setNav("chat")}}>{initials(u.name)}</div>
                <div className="user-info"><div className="user-name">{u.name}</div><div className="user-sub">✅ Mutual follow</div></div>
                <button className="follow-btn mutual" onClick={()=>toggleFollow(u)}>Mutual ✓</button>
              </div>
            ))}<div style={{height:14}}/></>}
          {allUsers.filter(u=>following[u.uid]&&!followers[u.uid]).length>0&&<>
            <div className="sec-lbl">⏳ You Follow — Waiting for follow back</div>
            {allUsers.filter(u=>following[u.uid]&&!followers[u.uid]).map(u=>(
              <div key={u.uid} className="user-card">
                <div className="user-av" style={{background:u.color||pickColor(u.name)}}>{initials(u.name)}</div>
                <div className="user-info"><div className="user-name">{u.name}</div><div className="user-sub">Waiting for follow back</div></div>
                <button className="follow-btn following" onClick={()=>toggleFollow(u)}>Following</button>
              </div>
            ))}<div style={{height:14}}/></>}
          {allUsers.filter(u=>!following[u.uid]&&followers[u.uid]).length>0&&<>
            <div className="sec-lbl">👋 Follow Back — They follow you!</div>
            {allUsers.filter(u=>!following[u.uid]&&followers[u.uid]).map(u=>(
              <div key={u.uid} className="user-card">
                <div className="user-av" style={{background:u.color||pickColor(u.name)}}>{initials(u.name)}</div>
                <div className="user-info"><div className="user-name">{u.name}</div><div className="user-sub">Follows you · Follow back to chat!</div></div>
                <button className="follow-btn follow" onClick={()=>toggleFollow(u)}>Follow Back</button>
              </div>
            ))}<div style={{height:14}}/></>}
          <div className="sec-lbl">👥 All People on Jam</div>
          {allUsers.filter(u=>!following[u.uid]&&!followers[u.uid]).map(u=>(
            <div key={u.uid} className="user-card">
              <div className="user-av" style={{background:u.color||pickColor(u.name)}}>{initials(u.name)}</div>
              <div className="user-info"><div className="user-name">{u.name}</div><div className="user-sub">{u.email}</div></div>
              <button className="follow-btn follow" onClick={()=>toggleFollow(u)}>Follow</button>
            </div>
          ))}
          {allUsers.length===0&&<div style={{color:"var(--muted)",fontSize:".83rem",padding:"12px 0"}}>No other users yet. Share your link!</div>}
          <div style={{marginTop:22,padding:14,background:"var(--s1)",border:"1px solid var(--border)",borderRadius:14}}>
            <div style={{fontFamily:"var(--fh)",fontSize:".88rem",fontWeight:700,marginBottom:6}}>📤 Invite Friends</div>
            <div style={{fontSize:".78rem",color:"var(--muted)",marginBottom:8}}>Share this link:</div>
            <div style={{fontSize:".82rem",color:"var(--a1)",fontWeight:600,cursor:"pointer"}} onClick={()=>{navigator.clipboard?.writeText("https://jam-app-smoky.vercel.app");showToast("📋","Link copied!")}}>jam-app-smoky.vercel.app 📋</div>
          </div>
        </div></div>
      )}

      {/* ══ CLIPS ══ */}
      {nav==="clips"&&(
        <div className="clips-page"><div className="clips-inner">
          <div className="page-title">🎬 <em>Clips</em></div>
          <p className="page-sub">Short videos from the community</p>
          <div className="add-clip-form">
            <div className="add-clip-title">+ Post a Clip</div>
            <div className="tab-row">
              <button className={"tab"+(clipTab==="link"?" on":"")} onClick={()=>setClipTab("link")}>🔗 YouTube Link</button>
              <button className={"tab"+(clipTab==="file"?" on":"")} onClick={()=>setClipTab("file")}>📁 Upload Video</button>
            </div>
            {clipTab==="link"&&<input className="clip-inp" placeholder="Paste YouTube link..." value={clipUrl} onChange={e=>setClipUrl(e.target.value)}/>}
            {clipTab==="file"&&(
              <div className="file-drop" onClick={()=>clipFileRef.current?.click()}>
                <input type="file" ref={clipFileRef} style={{display:"none"}} accept="video/*" onChange={e=>e.target.files[0]&&postClip(e.target.files[0])}/>
                📁 Click to upload video from your device
              </div>
            )}
            <input className="clip-inp" placeholder="Add a caption..." value={clipCaption} onChange={e=>setClipCaption(e.target.value)}/>
            {clipUploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:clipUploadProg+"%"}}/></div><div className="prog-txt">Uploading {clipUploadProg}%...</div></div>}
            {clipTab==="link"&&<button className="post-btn" onClick={()=>postClip(null)} disabled={clipUploading||!clipUrl.trim()}>{clipUploading?"Uploading...":"Post Clip 🎬"}</button>}
          </div>
          {clips.length===0&&<div className="empty" style={{height:"auto",padding:"40px 0"}}><div className="empty-icon">🎬</div><div className="empty-title">No clips yet</div><div className="empty-sub">Be the first to post!</div></div>}
          {clips.map(clip=>(
            <div key={clip.id} className="clip-card">
              <div className="clip-media" onClick={()=>setActiveClip(activeClip===clip.id?null:clip.id)}>
                {activeClip===clip.id?(
                  clip.type==="youtube"?<iframe src={clip.embedUrl+"?autoplay=1"} allow="autoplay;encrypted-media" allowFullScreen/>
                  :<video src={clip.videoUrl} controls autoPlay style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                ):(
                  <>
                    {clip.type==="youtube"?<img src={"https://img.youtube.com/vi/"+clip.ytId+"/mqdefault.jpg"} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                    :<video src={clip.videoUrl} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                    <div className="clip-play-icon"><div className="clip-play-btn">▶</div></div>
                  </>
                )}
              </div>
              <div className="clip-info">
                <div className="clip-user-row">
                  <div className="clip-av" style={{background:clip.authorColor||pickColor(clip.authorName)}}>{initials(clip.authorName||"?")}</div>
                  <div className="clip-username">{clip.authorName}</div>
                  <div className="clip-time">{new Date(clip.createdAt).toLocaleDateString()}</div>
                </div>
                {clip.caption&&<div className="clip-caption">{clip.caption}</div>}
                <div className="clip-acts">
                  <button className={"clip-act"+(clip.likes&&clip.likes[user.uid]?" liked":"")} onClick={()=>likeClip(clip)}>{clip.likes&&clip.likes[user.uid]?"❤️":"🤍"} {Object.keys(clip.likes||{}).length}</button>
                  <button className="clip-act" onClick={()=>showToast("💬","Comments coming soon!")}>💬 Comment</button>
                  <button className="clip-act" onClick={()=>{navigator.clipboard?.writeText(clip.videoUrl||("https://youtu.be/"+clip.ytId));showToast("🔗","Copied!");}}>🔗 Share</button>
                </div>
              </div>
            </div>
          ))}
        </div></div>
      )}

      {/* ══ STORIES ══ */}
      {nav==="stories"&&(
        <div className="page"><div className="page-inner">
          <div className="page-title">✨ <em>Stories</em></div>
          <p className="page-sub">Disappear after 24 hours</p>
          <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:16,padding:16,marginBottom:20}}>
            <div style={{fontFamily:"var(--fh)",fontSize:".9rem",fontWeight:700,marginBottom:10}}>+ Add Your Story</div>
            <div className="tab-row">
              <button className={"tab"+(storyTab==="text"?" on":"")} onClick={()=>setStoryTab("text")}>💬 Text</button>
              <button className={"tab"+(storyTab==="image"?" on":"")} onClick={()=>setStoryTab("image")}>🖼️ Photo</button>
              <button className={"tab"+(storyTab==="video"?" on":"")} onClick={()=>setStoryTab("video")}>🎥 Video</button>
            </div>
            {storyTab==="text"&&(
              <>
                <input className="clip-inp" placeholder="What's on your mind? 💭" value={storyText} onChange={e=>setStoryText(e.target.value)} maxLength={120}/>
                <div className="sec-lbl" style={{marginBottom:6}}>Color</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  {["#e8445a","#6c5ce7","#00d4aa","#f0a500","#e17055","#0984e3","#fd79a8","#2d3436"].map(c=>(
                    <div key={c} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:storyColor===c?"3px solid #fff":"2px solid transparent",transition:"all .15s"}} onClick={()=>setStoryColor(c)}/>
                  ))}
                </div>
                {storyUploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:storyUploadProg+"%"}}/></div></div>}
                <button className="post-btn" onClick={()=>postStory(null)} disabled={storyUploading||!storyText.trim()}>{storyUploading?"Posting...":"Post Story ✨"}</button>
              </>
            )}
            {(storyTab==="image"||storyTab==="video")&&(
              <>
                <div className="file-drop" onClick={()=>storyFileRef.current?.click()}>
                  <input type="file" ref={storyFileRef} style={{display:"none"}} accept={storyTab==="image"?"image/*":"video/*"} onChange={e=>e.target.files[0]&&postStory(e.target.files[0])}/>
                  {storyTab==="image"?"🖼️ Click to upload a photo":"🎥 Click to upload a video"}
                </div>
                {storyUploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:storyUploadProg+"%"}}/></div><div className="prog-txt">Uploading {storyUploadProg}%...</div></div>}
              </>
            )}
          </div>
          <div className="sec-lbl">Active Stories</div>
          <div className="stories-row">
            {myStory&&(
              <div className="story-it" onClick={()=>setViewStory(myStory)}>
                <div className="story-ring">
                  <div className="story-in" style={{background:myStory.color||"var(--s2)"}}>
                    {myStory.mediaUrl?<img src={myStory.mediaUrl} alt=""/>:myStory.text?.slice(0,2)}
                  </div>
                </div>
                <span className="story-nm">Your Story</span>
              </div>
            )}
            {otherStories.map(s=>(
              <div key={s.authorId} className="story-it" onClick={()=>setViewStory(s)}>
                <div className="story-ring">
                  <div className="story-in" style={{background:s.authorColor||pickColor(s.authorName)}}>
                    {s.mediaUrl?<img src={s.mediaUrl} alt=""/>:initials(s.authorName||"?")}
                  </div>
                </div>
                <span className="story-nm">{(s.authorName||"?").split(" ")[0]}</span>
              </div>
            ))}
          </div>
          {stories.length===0&&<div className="empty" style={{height:"auto",padding:"40px 0"}}><div className="empty-icon">✨</div><div className="empty-title">No stories yet</div><div className="empty-sub">Post your first story above!</div></div>}
        </div></div>
      )}

      {/* ══ MUSIC TOGETHER ══ */}
      {nav==="music"&&(
        <div className="music-page"><div className="music-inner">
          <div className="page-title">🎵 <em>Music</em> Together</div>
          <p className="page-sub">Everyone hears the same music at the same time</p>

          {!musicRoom?(
            <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:20,padding:22,marginBottom:20}}>
              <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,marginBottom:12}}>Start a Music Room</div>
              <div className="tab-row">
                <button className={"tab"+(musicTab==="link"?" on":"")} onClick={()=>setMusicTab("link")}>🔗 YouTube Link</button>
                <button className={"tab"+(musicTab==="file"?" on":"")} onClick={()=>setMusicTab("file")}>🎵 Upload Audio</button>
              </div>
              {musicTab==="link"&&<input className="clip-inp" placeholder="Paste YouTube music link..." value={musicUrl} onChange={e=>setMusicUrl(e.target.value)}/>}
              {musicTab==="file"&&(
                <div className="file-drop" onClick={()=>musicFileRef.current?.click()}>
                  <input type="file" ref={musicFileRef} style={{display:"none"}} accept="audio/*,video/*" onChange={e=>e.target.files[0]&&startMusicRoom(e.target.files[0])}/>
                  🎵 Click to upload audio/music from your device<br/>
                  <span style={{fontSize:".75rem",color:"var(--muted)"}}>Supports MP3, WAV, AAC, M4A</span>
                </div>
              )}
              {musicUploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:musicUploadProg+"%"}}/></div><div className="prog-txt">Uploading {musicUploadProg}%...</div></div>}
              {musicTab==="link"&&<button className="post-btn" style={{marginTop:8}} onClick={()=>startMusicRoom(null)} disabled={musicUploading||!musicUrl.trim()}>{musicUploading?"Starting...":"Start Music Room 🎵"}</button>}
            </div>
          ):(
            <div className="player-card">
              <div style={{fontFamily:"var(--fh)",fontSize:".8rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:12}}>Now Playing — Live for Everyone</div>
              <div className="np-row">
                <div className="trk-art">{musicRoom.type==="youtube"?"🎵":"🎵"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="trk-name">{musicRoom.title||"Music Room"}</div>
                  <div className="trk-artist">Started by {musicRoom.startedByName}</div>
                  <div className="trk-src">{musicRoom.type==="youtube"?"YouTube":"Uploaded"}</div>
                </div>
                <button className="post-btn" style={{background:"var(--s2)",color:"var(--muted)"}} onClick={async()=>{ await remove(ref(db,"musicRoom")); setMusicPlaying(false); showToast("⏹️","Music room ended"); }}>End Room</button>
              </div>

              {musicRoom.type==="youtube"&&(
                <div style={{width:"100%",aspectRatio:"16/9",borderRadius:12,overflow:"hidden",marginBottom:16,background:"#000"}}>
                  <iframe src={musicRoom.embedUrl} width="100%" height="100%" allow="autoplay;encrypted-media" allowFullScreen style={{border:"none"}}/>
                </div>
              )}
              {musicRoom.type==="local"&&(
                <audio ref={audioRef} src={musicRoom.audioUrl} style={{width:"100%",marginBottom:16}} controls onPlay={()=>setMusicPlaying(true)} onPause={()=>setMusicPlaying(false)}/>
              )}

              <div className="vol-row">
                <span style={{fontSize:".85rem"}}>🔈</span>
                <input type="range" className="vol-sl" min={0} max={100} value={musicVol} onChange={e=>{setMusicVol(+e.target.value);if(audioRef.current)audioRef.current.volume=e.target.value/100;}}/>
                <span style={{fontSize:".75rem",color:"var(--muted)",minWidth:"28px"}}>{musicVol}%</span>
              </div>

              <div className="listeners-row">
                <div className="l-avs">
                  {mutuals.slice(0,4).map((f,i)=><div key={i} className="l-av" style={{background:f.color||pickColor(f.name)}}>{initials(f.name)}</div>)}
                </div>
                <span style={{fontSize:".75rem",color:"var(--muted)"}}>Listening together • Share: jam-app-smoky.vercel.app</span>
              </div>
            </div>
          )}
        </div></div>
      )}

      {/* ══ WATCH TOGETHER ══ */}
      {nav==="watch"&&(
        <div className="watch-page"><div className="watch-inner">
          <div className="page-title">📺 <em>Watch</em> Together</div>
          <p className="page-sub">Watch videos in sync with your friends</p>

          {!watchRoom?(
            <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:20,padding:22,marginBottom:20}}>
              <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,marginBottom:12}}>Start a Watch Party</div>
              <div className="tab-row">
                <button className={"tab"+(watchTab==="link"?" on":"")} onClick={()=>setWatchTab("link")}>🔗 YouTube Link</button>
                <button className={"tab"+(watchTab==="file"?" on":"")} onClick={()=>setWatchTab("file")}>📁 Upload Video</button>
              </div>
              {watchTab==="link"&&<input className="clip-inp" placeholder="Paste YouTube link..." value={watchUrl} onChange={e=>setWatchUrl(e.target.value)}/>}
              {watchTab==="file"&&(
                <div className="file-drop" onClick={()=>watchFileRef.current?.click()}>
                  <input type="file" ref={watchFileRef} style={{display:"none"}} accept="video/*" onChange={e=>e.target.files[0]&&startWatchRoom(e.target.files[0])}/>
                  📁 Click to upload a video from your device<br/>
                  <span style={{fontSize:".75rem",color:"var(--muted)"}}>Supports MP4, MOV, AVI, MKV</span>
                </div>
              )}
              {watchUploading&&<div className="prog-bar-wrap"><div className="prog-bar"><div className="prog-fill" style={{width:watchUploadProg+"%"}}/></div><div className="prog-txt">Uploading {watchUploadProg}%...</div></div>}
              {watchTab==="link"&&<button className="post-btn" style={{marginTop:8}} onClick={()=>startWatchRoom(null)} disabled={watchUploading||!watchUrl.trim()}>{watchUploading?"Starting...":"Start Watch Party 📺"}</button>}
            </div>
          ):(
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div className="viewer-count">🔴 Live Watch Party — {mutuals.length+1} watching</div>
                <button className="watch-ctrl-btn" onClick={async()=>{ await remove(ref(db,"watchRoom")); await remove(ref(db,"watchChat")); showToast("⏹️","Watch party ended"); }}>End Party</button>
              </div>
              <div className="watch-screen">
                {watchRoom.type==="youtube"?<iframe src={watchRoom.embedUrl} allow="autoplay;encrypted-media" allowFullScreen/>
                :<video ref={watchVideoRef} src={watchRoom.videoUrl} controls style={{width:"100%",height:"100%"}}/>}
              </div>
            </>
          )}

          <div className="watch-chat">
            <div className="watch-chat-hd">💬 Live Chat {watchRoom&&<span style={{fontSize:".72rem",color:"var(--a3)",marginLeft:"auto"}}>🔴 Live</span>}</div>
            <div className="watch-msgs" ref={watchMsgsRef}>
              {watchChat.map((m,i)=>(
                <div key={i} className="watch-msg">
                  <span className="watch-msg-name" style={{color:m.color||"var(--a1)"}}>{m.name}:</span>
                  <span className="watch-msg-text">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="watch-inp-row">
              <input className="watch-inp" placeholder="React to what's happening..." value={watchChatInput} onChange={e=>setWatchChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendWatchChat()}/>
              <button className="watch-send" onClick={sendWatchChat}>Send</button>
            </div>
          </div>
        </div></div>
      )}

      {/* ══ PROFILE ══ */}
      {nav==="profile"&&(
        <div className="page"><div className="page-inner">
          <div className="page-title">👤 <em>Profile</em></div>
          <div className="profile-card">
            <div className="profile-av-big" style={{background:user?.color||"var(--a1)"}}>{initials(user?.name||"?")}</div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <div className="profile-stats">
              <div className="stat"><div className="stat-num">{Object.keys(following).length}</div><div className="stat-lbl">Following</div></div>
              <div className="stat"><div className="stat-num">{Object.keys(followers).length}</div><div className="stat-lbl">Followers</div></div>
              <div className="stat"><div className="stat-num">{mutuals.length}</div><div className="stat-lbl">Mutuals</div></div>
              <div className="stat"><div className="stat-num">{clips.filter(c=>c.authorId===user?.uid).length}</div><div className="stat-lbl">Clips</div></div>
            </div>
            <button className="logout-btn" onClick={()=>{ signOut(auth); showToast("👋","Signed out"); }}>Sign Out</button>
          </div>
          <div className="sec-lbl">Your Clips</div>
          {clips.filter(c=>c.authorId===user?.uid).length===0
            ?<div style={{color:"var(--muted)",fontSize:".83rem",padding:"12px 0"}}>No clips yet — post one in the Clips tab!</div>
            :clips.filter(c=>c.authorId===user?.uid).map(clip=>(
              <div key={clip.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--s1)",border:"1px solid var(--border)",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>setNav("clips")}>
                {clip.type==="youtube"?<img src={"https://img.youtube.com/vi/"+clip.ytId+"/default.jpg"} style={{width:48,height:36,borderRadius:8,objectFit:"cover"}} alt=""/>
                :<video src={clip.videoUrl} style={{width:48,height:36,borderRadius:8,objectFit:"cover"}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:".85rem",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{clip.caption||"Clip"}</div>
                  <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:2}}>{Object.keys(clip.likes||{}).length} likes</div>
                </div>
              </div>
            ))}
        </div></div>
      )}
    </div>

    {/* STORY VIEWER */}
    {viewStory&&(
      <div className="story-ov" onClick={()=>setViewStory(null)}>
        <div className="story-viewer">
          <div className="story-prog"><div className="story-prog-bar"><div className="story-prog-fill" style={{width:storyProg+"%"}}/></div></div>
          <div className="story-content" onClick={e=>e.stopPropagation()}>
            <div className="story-bg" style={{background:viewStory.color||"#111"}}>
              {viewStory.mediaType==="image"&&viewStory.mediaUrl&&<img src={viewStory.mediaUrl} alt="story"/>}
              {viewStory.mediaType==="video"&&viewStory.mediaUrl&&<video src={viewStory.mediaUrl} autoPlay loop muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
            </div>
            <div className="story-user-row">
              <div style={{width:32,height:32,borderRadius:"50%",background:viewStory.authorColor||pickColor(viewStory.authorName),display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:"#fff"}}>{initials(viewStory.authorName||"?")}</div>
              <div style={{fontSize:".85rem",fontWeight:600,color:"#fff"}}>{viewStory.authorName}</div>
              <div style={{fontSize:".7rem",color:"rgba(255,255,255,.6)",marginLeft:"auto"}}>{new Date(viewStory.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
            {viewStory.text&&<div className="story-text-big" style={{color:viewStory.color||"#fff"}}>{viewStory.text}</div>}
          </div>
          <button className="story-close" onClick={()=>setViewStory(null)}>✕</button>
        </div>
      </div>
    )}

    {/* CALL */}
    {callOn&&(
      <div className="call-ov" onClick={e=>e.target===e.currentTarget&&setCallOn(false)}>
        <div className="call-box">
          <div className="call-av-big" style={{background:friend?.color||"var(--a1)",border:"3px solid var(--a3)"}}>{initials(friend?.name||"?")}</div>
          <div className="call-name">{friend?.name}</div>
          <div className="call-st">{videoOn?"Video Call":"Voice Call"}</div>
          <div className="call-dur">{fmt(callSecs)}</div>
          <div className="call-btns">
            <button className="c-btn mute" onClick={()=>setMuted(m=>!m)}>{muted?"🔇":"🎙️"}</button>
            <button className="c-btn end" onClick={()=>{setCallOn(false);setVideoOn(false);showToast("📞","Call ended — "+fmt(callSecs))}}>📵</button>
            <button className="c-btn vid" onClick={()=>setVideoOn(v=>!v)}>{videoOn?"🚫📹":"📹"}</button>
          </div>
        </div>
      </div>
    )}

    {toast&&<div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div></>
  );
}
