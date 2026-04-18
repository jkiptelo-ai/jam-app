import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
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
.app{width:100vw;height:100vh;display:flex;overflow:hidden;position:relative}
.mesh{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse 55% 45% at 15% 15%,rgba(232,68,90,.12) 0%,transparent 55%),
             radial-gradient(ellipse 45% 55% at 85% 85%,rgba(108,92,231,.12) 0%,transparent 55%)}

/* ── AUTH ── */
.auth-wrap{position:relative;z-index:10;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:16px}
.auth-box{width:100%;max-width:420px;background:var(--s1);border:1px solid var(--border2);border-radius:28px;padding:44px 38px;animation:fadeUp .5s cubic-bezier(.16,1,.3,1)}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.auth-logo{font-family:var(--fh);font-size:3rem;font-weight:800;letter-spacing:-2px;margin-bottom:4px}
.auth-logo em{color:var(--a1);font-style:normal}
.auth-sub{color:var(--muted);font-size:.85rem;margin-bottom:30px;line-height:1.5}
.tabs{display:flex;gap:4px;background:var(--bg);border-radius:12px;padding:4px;margin-bottom:24px}
.tab-btn{flex:1;padding:9px;border:none;border-radius:8px;background:transparent;color:var(--muted);font-family:var(--fb);font-size:.88rem;cursor:pointer;transition:all .2s}
.tab-btn.on{background:var(--a1);color:#fff;font-weight:600}
.field{margin-bottom:14px}
.field label{display:block;font-size:.72rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}
.field input{width:100%;padding:12px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.9rem;outline:none;transition:border-color .2s}
.field input:focus{border-color:var(--a1)}
.field input::placeholder{color:rgba(255,255,255,.2)}
.btn-primary{width:100%;padding:13px;background:var(--a1);border:none;border-radius:12px;color:#fff;font-family:var(--fh);font-size:.95rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:4px}
.btn-primary:hover{filter:brightness(1.1);box-shadow:0 0 28px rgba(232,68,90,.4);transform:translateY(-1px)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
.or-row{display:flex;align-items:center;gap:10px;margin:18px 0}
.or-line{flex:1;height:1px;background:var(--border)}
.or-txt{color:var(--muted);font-size:.75rem}
.soc-row{display:flex;gap:8px}
.soc-btn{flex:1;padding:10px 6px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.8rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:5px}
.soc-btn:hover{border-color:var(--border2);background:var(--s2)}
.auth-err{color:var(--a1);font-size:.78rem;margin-top:8px;text-align:center;min-height:16px}

/* ── LAYOUT ── */
.layout{position:relative;z-index:5;display:flex;width:100%;height:100%}

/* ── SIDEBAR ── */
.sidebar{width:66px;height:100%;background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:6px;flex-shrink:0}
.sb-logo{font-family:var(--fh);font-size:1.5rem;font-weight:800;color:var(--a1);margin-bottom:12px;letter-spacing:-1px}
.sb-btn{width:46px;height:46px;border-radius:13px;border:none;background:transparent;color:var(--muted);font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative}
.sb-btn:hover{background:var(--s2);color:var(--text)}
.sb-btn.on{background:var(--a1);color:#fff;box-shadow:0 0 18px rgba(232,68,90,.35)}
.sb-pip{position:absolute;top:8px;right:8px;width:7px;height:7px;background:var(--a3);border-radius:50%;border:2px solid var(--s1)}
.sb-gap{flex:1}
.me-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:#fff;border:2px solid var(--border2);cursor:pointer;transition:transform .2s}
.me-av:hover{transform:scale(1.05)}

/* ── FRIENDS PANEL (WhatsApp style) ── */
.wp-panel{width:300px;height:100%;background:var(--s1);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.wp-hd{padding:16px 14px 10px;display:flex;align-items:center;justify-content:space-between}
.wp-title{font-family:var(--fh);font-size:1rem;font-weight:700}
.wp-actions{display:flex;gap:6px}
.icon-btn{width:32px;height:32px;border-radius:9px;border:none;background:var(--s2);color:var(--muted);font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.icon-btn:hover{color:var(--text);background:var(--s3)}
.srch-bar{margin:0 10px 10px;position:relative}
.srch-bar input{width:100%;padding:9px 12px 9px 32px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.83rem;outline:none}
.srch-bar input::placeholder{color:var(--muted)}
.srch-ic{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:.85rem;pointer-events:none}
.chat-list{flex:1;overflow-y:auto;padding:0 6px}
.chat-item{display:flex;align-items:center;gap:10px;padding:10px 8px;border-radius:12px;cursor:pointer;transition:background .15s;margin-bottom:2px;position:relative}
.chat-item:hover{background:var(--s2)}
.chat-item.on{background:rgba(232,68,90,.1)}
.ci-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0;position:relative}
.ci-av.story-ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--a1),var(--a2));z-index:-1}
.ci-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;border:2px solid var(--s1)}
.ci-dot.online{background:var(--a3)}.ci-dot.offline{background:#3d3d5c}
.ci-info{flex:1;min-width:0}
.ci-name{font-size:.9rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ci-last{font-size:.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.ci-meta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.ci-time{font-size:.68rem;color:var(--muted)}
.ci-badge{min-width:18px;height:18px;background:var(--a3);border-radius:20px;font-size:.65rem;font-weight:700;color:#000;display:flex;align-items:center;justify-content:center;padding:0 5px}
.new-chat-btn{margin:10px 12px 12px;padding:10px;background:var(--a1);border:none;border-radius:12px;color:#fff;font-family:var(--fh);font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;width:calc(100% - 24px);display:flex;align-items:center;justify-content:center;gap:6px}
.new-chat-btn:hover{filter:brightness(1.1)}

/* ── WHATSAPP CHAT ── */
.wa-chat{flex:1;display:flex;flex-direction:column;height:100%;min-width:0;background:var(--bg)}
.wa-bg{position:absolute;inset:0;opacity:.03;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}

.wa-hd{padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--s1);flex-shrink:0;position:relative;z-index:2}
.wa-hd-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff;flex-shrink:0}
.wa-hd-info{flex:1;min-width:0}
.wa-hd-name{font-family:var(--fh);font-size:.95rem;font-weight:700}
.wa-hd-status{font-size:.72rem;color:var(--a3);margin-top:1px}
.wa-hd-acts{display:flex;gap:5px}
.wa-act{width:36px;height:36px;border-radius:10px;border:none;background:var(--s2);color:var(--muted);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.wa-act:hover{background:var(--a1);color:#fff}

.wa-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:2px;position:relative}
.date-sep{display:flex;align-items:center;justify-content:center;margin:10px 0}
.date-sep span{background:var(--s2);border:1px solid var(--border);padding:3px 12px;border-radius:20px;font-size:.68rem;color:var(--muted)}
.sys-note{text-align:center;font-size:.72rem;color:var(--muted);margin:8px 0;padding:4px 10px;background:var(--s2);border-radius:20px;width:fit-content;align-self:center}

.msg-wrap{display:flex;flex-direction:column;margin-bottom:2px}
.msg-wrap.me{align-items:flex-end}
.msg-wrap.them{align-items:flex-start}
.msg-bubble-row{display:flex;align-items:flex-end;gap:6px}
.msg-wrap.them .msg-bubble-row{flex-direction:row}
.msg-wrap.me .msg-bubble-row{flex-direction:row-reverse}
.msg-tiny-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#fff;flex-shrink:0}
.msg-card{max-width:65%;display:flex;flex-direction:column;gap:1px}
.msg-sender-name{font-size:.68rem;font-weight:600;padding:0 4px;margin-bottom:2px}

.wa-bubble{padding:8px 12px;border-radius:18px;font-size:.88rem;line-height:1.55;word-break:break-word;position:relative;max-width:100%}
.msg-wrap.them .wa-bubble{background:rgba(255,255,255,.06);color:var(--text);border-bottom-left-radius:4px;border-bottom-right-radius:18px;border-top-right-radius:18px;border-top-left-radius:18px}
.msg-wrap.me .wa-bubble{background:linear-gradient(135deg,var(--a1),var(--a2));color:#fff;border-bottom-right-radius:4px;border-bottom-left-radius:18px;border-top-right-radius:18px;border-top-left-radius:18px;box-shadow:0 14px 35px rgba(232,68,90,.08)}
.msg-footer{display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:4px;padding:0 2px;opacity:.85}
.msg-ts{font-size:.62rem;color:var(--muted)}
.msg-tick{font-size:.65rem;color:var(--a3)}

/* reply preview inside bubble */
.reply-preview{background:rgba(0,0,0,.2);border-left:3px solid var(--a3);border-radius:8px 8px 0 0;padding:5px 8px;margin-bottom:4px;font-size:.75rem;color:rgba(255,255,255,.7);cursor:pointer}
.reply-preview strong{display:block;font-size:.72rem;color:var(--a3);margin-bottom:1px}

.typing-row{display:flex;align-items:center;gap:4px;padding:8px 12px;background:var(--s2);border-radius:18px;border-bottom-left-radius:3px;width:fit-content}
.t-dot{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:tdot 1.2s infinite}
.t-dot:nth-child(2){animation-delay:.2s}.t-dot:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* input area */
.wa-input{padding:8px 12px 10px;background:var(--s1);border-top:1px solid var(--border);flex-shrink:0;position:relative;z-index:2}
.reply-bar{display:flex;align-items:center;gap:8px;background:var(--s2);border-radius:10px;padding:7px 10px;margin-bottom:7px}
.reply-bar-txt{flex:1;font-size:.78rem;color:var(--muted)}
.reply-bar-txt strong{color:var(--a3);display:block;font-size:.72rem}
.reply-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem;padding:0 4px}
.emoji-tray{display:flex;gap:5px;flex-wrap:wrap;padding:6px 2px 8px}
.em-btn{background:none;border:none;font-size:1.1rem;cursor:pointer;padding:3px;border-radius:7px;transition:transform .15s}
.em-btn:hover{transform:scale(1.3)}
.wa-input-row{display:flex;gap:7px;align-items:flex-end}
.wa-ta{flex:1;padding:10px 14px;background:var(--s2);border:1px solid var(--border);border-radius:24px;color:var(--text);font-family:var(--fb);font-size:.88rem;outline:none;resize:none;max-height:120px;line-height:1.45;transition:border-color .2s}
.wa-ta:focus{border-color:var(--a1)}
.wa-ta::placeholder{color:var(--muted)}
.wa-send{width:44px;height:44px;border-radius:50%;border:none;background:var(--a1);color:#fff;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.wa-send:hover{filter:brightness(1.1);box-shadow:0 0 18px rgba(232,68,90,.4)}
.wa-send:disabled{opacity:.4;cursor:not-allowed}
.wa-icon-btn{width:44px;height:44px;border-radius:50%;border:none;background:var(--s2);color:var(--muted);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.wa-icon-btn:hover{color:var(--text);background:var(--s3)}

/* empty/no convo state */
.no-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);text-align:center;padding:24px}
.no-chat-logo{font-family:var(--fh);font-size:2.5rem;font-weight:800;letter-spacing:-1px}
.no-chat-logo em{color:var(--a1);font-style:normal}
.no-chat p{font-size:.85rem;max-width:260px;line-height:1.6}

/* ── NEW CHAT MODAL ── */
.modal-ov{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.8);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--s1);border:1px solid var(--border2);border-radius:24px;padding:28px;width:min(360px,95vw);animation:scUp .3s cubic-bezier(.16,1,.3,1)}
@keyframes scUp{from{opacity:0;scale:.92}to{opacity:1;scale:1}}
.modal-title{font-family:var(--fh);font-size:1.1rem;font-weight:700;margin-bottom:16px}
.modal-input{width:100%;padding:11px 14px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.9rem;outline:none;margin-bottom:12px;transition:border-color .2s}
.modal-input:focus{border-color:var(--a1)}
.modal-input::placeholder{color:var(--muted)}
.modal-btns{display:flex;gap:8px}
.modal-cancel{flex:1;padding:10px;background:var(--s2);border:1px solid var(--border);border-radius:10px;color:var(--muted);font-family:var(--fb);font-size:.88rem;cursor:pointer;transition:all .2s}
.modal-cancel:hover{color:var(--text)}
.modal-ok{flex:1;padding:10px;background:var(--a1);border:none;border-radius:10px;color:#fff;font-family:var(--fh);font-size:.88rem;font-weight:700;cursor:pointer;transition:filter .2s}
.modal-ok:hover{filter:brightness(1.1)}

/* ── CALL OVERLAY ── */
.call-ov{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.9);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease}
.call-card{background:var(--s1);border:1px solid var(--border2);border-radius:28px;padding:44px 36px;text-align:center;width:320px;animation:scUp .3s cubic-bezier(.16,1,.3,1)}
.call-av-big{width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;margin:0 auto 14px;border:3px solid var(--a1);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(232,68,90,.35)}50%{box-shadow:0 0 0 18px rgba(232,68,90,0)}}
.call-name{font-family:var(--fh);font-size:1.3rem;font-weight:700;margin-bottom:4px}
.call-st{color:var(--muted);font-size:.85rem;margin-bottom:6px}
.call-dur{color:var(--a3);font-size:1.1rem;font-weight:600;margin-bottom:28px;font-variant-numeric:tabular-nums}
.call-btns{display:flex;justify-content:center;gap:14px}
.c-btn{width:54px;height:54px;border-radius:50%;border:none;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.c-btn.mute{background:var(--s2);color:var(--text)}.c-btn.mute:hover{background:var(--s3)}
.c-btn.end{background:#ef4444;color:#fff}.c-btn.end:hover{background:#dc2626;transform:scale(1.07)}
.c-btn.vid{background:var(--s2);color:var(--text)}.c-btn.vid:hover{background:var(--s3)}
.vid-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.vid-cell{background:var(--s2);border-radius:14px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-size:1.8rem;position:relative;overflow:hidden}
.vid-lbl{position:absolute;bottom:6px;left:6px;font-size:.68rem;background:rgba(0,0,0,.6);padding:2px 7px;border-radius:20px;color:#fff}

/* ── JAM ROOM ── */
.jam-page{flex:1;height:100%;overflow-y:auto}
.jam-inner{padding:24px;max-width:680px}
.page-title{font-family:var(--fh);font-size:1.6rem;font-weight:800;letter-spacing:-1px;margin-bottom:4px}
.page-title span{color:var(--a1)}
.page-sub{color:var(--muted);font-size:.83rem;margin-bottom:24px}
.sec-lbl{font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.src-row{display:flex;gap:10px;margin-bottom:20px}
.src-card{flex:1;padding:14px 10px;background:var(--s1);border:1px solid var(--border);border-radius:18px;cursor:pointer;transition:all .2s;text-align:center}
.src-card:hover{border-color:var(--a1);transform:translateY(-2px)}
.src-card.on{border-color:var(--a1);background:rgba(232,68,90,.08)}
.src-icon{font-size:1.6rem;margin-bottom:5px}
.src-name{font-family:var(--fh);font-size:.82rem;font-weight:700}
.src-desc{font-size:.68rem;color:var(--muted);margin-top:2px}
.url-row{display:flex;gap:8px;margin-bottom:20px}
.url-inp{flex:1;padding:10px 14px;background:var(--s1);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:var(--fb);font-size:.85rem;outline:none;transition:border-color .2s}
.url-inp:focus{border-color:var(--a1)}
.url-inp::placeholder{color:var(--muted)}
.url-btn{padding:10px 16px;background:var(--a1);border:none;border-radius:12px;color:#fff;font-family:var(--fh);font-size:.85rem;font-weight:700;cursor:pointer;transition:filter .2s;white-space:nowrap}
.url-btn:hover{filter:brightness(1.1)}
.player-card{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:22px;margin-bottom:20px;position:relative;overflow:hidden}
.player-card::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 60% 60% at 85% 50%,rgba(108,92,231,.12) 0%,transparent 60%)}
.np-row{display:flex;align-items:center;gap:14px;margin-bottom:18px}
.trk-art{width:58px;height:58px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.7rem;background:linear-gradient(135deg,var(--a2),var(--a1));transition:background .5s}
.trk-name{font-family:var(--fh);font-size:.95rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.trk-artist{font-size:.78rem;color:var(--muted);margin-top:2px}
.trk-src{font-size:.68rem;color:var(--a3);margin-top:3px}
.prog-bar{height:4px;background:var(--s3);border-radius:4px;cursor:pointer;margin-bottom:4px}
.prog-fill{height:100%;background:var(--a1);border-radius:4px;transition:width .5s linear}
.prog-times{display:flex;justify-content:space-between;font-size:.68rem;color:var(--muted);margin-bottom:12px}
.ctrl-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px}
.ctrl{background:none;border:none;color:var(--muted);font-size:1rem;cursor:pointer;padding:6px;border-radius:8px;transition:all .2s}
.ctrl:hover{color:var(--text);background:var(--s2)}
.ctrl.pp{width:44px;height:44px;border-radius:50%;background:var(--a1);color:#fff;font-size:1.1rem;display:flex;align-items:center;justify-content:center}
.ctrl.pp:hover{filter:brightness(1.1);box-shadow:0 0 18px rgba(232,68,90,.4)}
.vol-row{display:flex;align-items:center;gap:10px}
.vol-sl{flex:1;-webkit-appearance:none;appearance:none;height:3px;background:var(--s3);border-radius:3px;outline:none;cursor:pointer}
.vol-sl::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--a1);cursor:pointer}
.listeners-row{display:flex;align-items:center;gap:8px;margin-top:14px;border-top:1px solid var(--border);padding-top:14px}
.l-avs{display:flex}
.l-av{width:26px;height:26px;border-radius:50%;border:2px solid var(--s1);background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:.72rem;margin-left:-7px}
.l-av:first-child{margin-left:0}
.l-txt{font-size:.75rem;color:var(--muted)}
.queue-list{display:flex;flex-direction:column;gap:3px}
.q-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:11px;cursor:pointer;transition:background .15s}
.q-item:hover{background:var(--s2)}
.q-item.on{background:rgba(232,68,90,.1)}
.q-art{width:34px;height:34px;border-radius:8px;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.q-info{flex:1;min-width:0}
.q-name{font-size:.84rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.q-meta{font-size:.72rem;color:var(--muted);margin-top:1px}
.q-dur{font-size:.7rem;color:var(--muted);flex-shrink:0}

/* ── CINEMA ── */
.cinema-page{flex:1;height:100%;overflow-y:auto;display:flex;flex-direction:column}
.cinema-inner{padding:24px;max-width:900px;margin:0 auto;width:100%}
.cinema-player-wrap{background:#000;border-radius:16px;overflow:hidden;margin-bottom:20px;position:relative;aspect-ratio:16/9}
.cinema-iframe{width:100%;height:100%;border:none}
.cinema-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--muted);font-size:.9rem}
.cinema-placeholder span{font-size:3rem}
.cinema-controls-row{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
.cinema-url-inp{flex:1;min-width:200px;padding:11px 14px;background:var(--s1);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:var(--fb);font-size:.85rem;outline:none;transition:border-color .2s}
.cinema-url-inp:focus{border-color:var(--a1)}
.cinema-url-inp::placeholder{color:var(--muted)}
.cinema-load-btn{padding:11px 20px;background:var(--a1);border:none;border-radius:12px;color:#fff;font-family:var(--fh);font-size:.88rem;font-weight:700;cursor:pointer;transition:filter .2s;white-space:nowrap}
.cinema-load-btn:hover{filter:brightness(1.1)}
.cinema-share-btn{padding:11px 16px;background:var(--s1);border:1px solid var(--border);border-radius:12px;color:var(--text);font-family:var(--fb);font-size:.85rem;cursor:pointer;transition:all .2s;white-space:nowrap}
.cinema-share-btn:hover{border-color:var(--border2);background:var(--s2)}
.sync-bar{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:20px}
.sync-title{font-family:var(--fh);font-size:.85rem;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.sync-live{width:8px;height:8px;background:var(--a3);border-radius:50%;animation:blink 1.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.viewers-row{display:flex;gap:8px;flex-wrap:wrap}
.viewer-chip{display:flex;align-items:center;gap:5px;background:var(--s2);border-radius:20px;padding:4px 10px;font-size:.75rem}
.viewer-dot{width:6px;height:6px;border-radius:50%}
.cinema-chat{background:var(--s1);border:1px solid var(--border);border-radius:14px;overflow:hidden;flex:1;display:flex;flex-direction:column;min-height:200px}
.cinema-chat-hd{padding:12px 14px;border-bottom:1px solid var(--border);font-family:var(--fh);font-size:.85rem;font-weight:700}
.cinema-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:150px;max-height:200px}
.cinema-msg{display:flex;gap:7px;align-items:flex-start}
.cinema-msg-av{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#fff}
.cinema-msg-txt{font-size:.8rem;line-height:1.5}
.cinema-msg-name{font-weight:600;margin-right:4px}
.cinema-input-row{display:flex;gap:7px;padding:10px 12px;border-top:1px solid var(--border)}
.cinema-ta{flex:1;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--fb);font-size:.83rem;outline:none;transition:border-color .2s}
.cinema-ta:focus{border-color:var(--a1)}
.cinema-ta::placeholder{color:var(--muted)}
.cinema-send{width:36px;height:36px;border-radius:50%;border:none;background:var(--a1);color:#fff;font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── GAMES ── */
.games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:24px}
.g-card{background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:18px 14px;cursor:pointer;transition:all .2s;text-align:center}
.g-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.4)}
.g-icon{font-size:2rem;margin-bottom:8px}
.g-name{font-family:var(--fh);font-size:.88rem;font-weight:700}
.g-pl{font-size:.7rem;color:var(--muted);margin-top:2px}
.g-badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:.65rem;font-weight:700;margin-top:6px}
.lb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--s1);border:1px solid var(--border);border-radius:12px;margin-bottom:6px}

/* game overlays */
.g-ov{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.88);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;animation:fadeIn .3s ease}
.g-card-ov{background:var(--s1);border:1px solid var(--border2);border-radius:24px;padding:28px 24px;width:min(380px,95vw);text-align:center;animation:scUp .3s cubic-bezier(.16,1,.3,1);max-height:95vh;overflow-y:auto}
.g-title{font-family:var(--fh);font-size:1.3rem;font-weight:800;margin-bottom:4px}
.g-sub{font-size:.78rem;color:var(--muted);margin-bottom:14px}
.ttt-board{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:14px auto;max-width:230px}
.ttt-cell{aspect-ratio:1;background:var(--s2);border:none;border-radius:11px;font-size:1.7rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.ttt-cell:hover:not(:disabled){background:var(--bg);transform:scale(.96)}
.ttt-cell:disabled{cursor:default}
.ttt-cell.x{color:var(--a1)}.ttt-cell.o{color:var(--a2)}
.ttt-st{font-size:.85rem;color:var(--muted);margin-bottom:8px;min-height:20px}
.ttt-win{color:var(--a3)!important;font-weight:600}
.wordle-grid{display:grid;grid-template-rows:repeat(6,1fr);gap:5px;margin:10px auto;width:fit-content}
.w-row{display:flex;gap:5px}
.w-tile{width:44px;height:44px;border:2px solid var(--border2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:1.2rem;font-weight:800;text-transform:uppercase;transition:all .3s;color:var(--text)}
.w-tile.correct{background:#538d4e;border-color:#538d4e;color:#fff}
.w-tile.present{background:#b59f3b;border-color:#b59f3b;color:#fff}
.w-tile.absent{background:var(--s3);border-color:var(--s3);color:var(--muted)}
.w-tile.filled{border-color:var(--border2)}
.wordle-kbd{display:flex;flex-direction:column;gap:5px;margin-top:12px}
.kbd-row{display:flex;gap:4px;justify-content:center}
.kbd-key{min-width:30px;height:36px;padding:0 5px;background:var(--s2);border:none;border-radius:6px;color:var(--text);font-family:var(--fh);font-size:.72rem;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.kbd-key:hover{background:var(--s3)}
.kbd-key.correct{background:#538d4e;color:#fff}
.kbd-key.present{background:#b59f3b;color:#fff}
.kbd-key.absent{background:var(--bg);color:var(--muted)}
.kbd-key.wide{min-width:48px}
.trivia-q{font-size:.92rem;font-weight:500;margin-bottom:14px;line-height:1.5;text-align:left}
.trivia-opts{display:flex;flex-direction:column;gap:8px}
.t-opt{padding:10px 14px;background:var(--s2);border:1px solid var(--border);border-radius:11px;cursor:pointer;text-align:left;font-family:var(--fb);font-size:.85rem;color:var(--text);transition:all .2s}
.t-opt:hover:not(:disabled){background:var(--s3);border-color:var(--border2)}
.t-opt.correct{background:rgba(0,212,170,.2);border-color:var(--a3);color:var(--a3)}
.t-opt.wrong{background:rgba(232,68,90,.2);border-color:var(--a1);color:var(--a1)}
.t-opt:disabled{cursor:default}

/* ── DISCOVER ── */
.feed-page{flex:1;height:100%;overflow-y:auto}
.feed-inner{padding:22px;max-width:600px}
.story-scroll{display:flex;gap:10px;margin-bottom:22px;overflow-x:auto;padding-bottom:4px}
.story-scroll::-webkit-scrollbar{display:none}
.story-it{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;flex-shrink:0}
.story-ring{width:54px;height:54px;border-radius:50%;padding:2px;background:linear-gradient(135deg,var(--a1),var(--a2))}
.story-in{width:100%;height:100%;border-radius:50%;border:2px solid var(--bg);background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.story-nm{font-size:.65rem;color:var(--muted);text-align:center;max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.post{background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:15px;margin-bottom:14px}
.post-hd{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.post-av{width:38px;height:38px;border-radius:50%;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:1rem}
.post-author{font-weight:600;font-size:.88rem}
.post-time{font-size:.7rem;color:var(--muted)}
.post-body{font-size:.85rem;line-height:1.6;color:#ccc8ef;margin-bottom:10px}
.post-media{background:var(--s2);border-radius:12px;height:150px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:10px}
.post-acts{display:flex;gap:10px}
.post-act{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--muted);font-family:var(--fb);font-size:.78rem;cursor:pointer;padding:5px 9px;border-radius:8px;transition:all .2s}
.post-act:hover{background:var(--s2);color:var(--text)}
.post-act.liked{color:var(--a1)}

/* ── TOAST ── */
.toast{position:fixed;bottom:18px;right:18px;z-index:400;background:var(--s2);border:1px solid var(--border2);border-radius:13px;padding:11px 16px;font-size:.83rem;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.4);animation:slideIn .3s cubic-bezier(.16,1,.3,1);max-width:280px}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}

/* ── MOBILE ── */
@media(max-width:768px){
  .wp-panel{width:240px}
  .wa-bubble{font-size:.83rem}
}
@media(max-width:520px){
  .wp-panel{display:none}
  .sidebar{width:52px}
  .sb-btn{width:38px;height:38px}
}
`;

/* ════════════════════════════════
   FIREBASE REST
════════════════════════════════ */
const FB = "https://jam-realtime-chat-default-rtdb.firebaseio.com";
const fbRead  = async p => { try{ const r=await fetch(FB+p+".json"); return await r.json(); }catch{return null;} };
const fbPush  = async (p,d) => { try{ const r=await fetch(FB+p+".json",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...d,ts:Date.now()})}); return await r.json(); }catch{return null;} };
const fbWrite = async (p,d) => { try{ await fetch(FB+p+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}); }catch{} };

/* ════════════════════════════════
   MOCK DATA
════════════════════════════════ */
const FRIENDS_DATA = [
  {id:"zara",  name:"Zara Ahmed",   color:"#e8445a", status:"online",  last:"Listening to Bad Bunny 🎵", time:"now",  unread:3},
  {id:"leo",   name:"Leo Kaspar",   color:"#6c5ce7", status:"online",  last:"rematch??",                  time:"2m",   unread:1},
  {id:"maya",  name:"Maya Brooks",  color:"#00d4aa", status:"away",    last:"how's everything?",          time:"15m",  unread:0},
  {id:"kai",   name:"Kai Tanaka",   color:"#f0a500", status:"online",  last:"Watch party tonight!",       time:"1h",   unread:0},
  {id:"sofia", name:"Sofia Reyes",  color:"#fd79a8", status:"offline", last:"Last seen 3h ago",           time:"3h",   unread:0},
  {id:"niko",  name:"Niko Petrov",  color:"#74b9ff", status:"online",  last:"Jamming on Spotify 🎸",      time:"5m",   unread:2},
];

const INIT_MSGS = {
  zara: [
    {id:"z1",from:"them",text:"heyyy!! wanna do a jam session tonight? 🎵",ts:Date.now()-3600000},
    {id:"z2",from:"me",  text:"YES omg I've been waiting for this 🙌",ts:Date.now()-3500000},
    {id:"z3",from:"them",text:"I'll start a Spotify room — my new playlist is 🔥",ts:Date.now()-3400000},
    {id:"z4",from:"me",  text:"perfect, adding Leo and Maya too",ts:Date.now()-3300000},
  ],
  leo: [
    {id:"l1",from:"them",text:"rematch??",ts:Date.now()-7200000},
    {id:"l2",from:"me",  text:"you just got lucky last time 😤",ts:Date.now()-7100000},
    {id:"l3",from:"them",text:"sure sure, accept the invite 😂",ts:Date.now()-7000000},
  ],
  maya: [
    {id:"m1",from:"them",text:"how's everything going? 🌈",ts:Date.now()-14400000},
    {id:"m2",from:"me",  text:"pretty good! working on some stuff",ts:Date.now()-14000000},
  ],
  kai:  [{id:"k1",from:"them",text:"Watch party tonight for Dune 2!! 🏜️",ts:Date.now()-3600000}],
  niko: [{id:"n1",from:"them",text:"Jamming on Spotify rn, join! 🎸",ts:Date.now()-1800000}],
};

const TRACKS = [
  {title:"WHERE SHE GOES",artist:"Bad Bunny",src:"Spotify",em:"🎵",dur:213},
  {title:"Blinding Lights",artist:"The Weeknd",src:"Spotify",em:"🌙",dur:200},
  {title:"HUMBLE.",artist:"Kendrick Lamar",src:"YouTube",em:"🎤",dur:177},
  {title:"Levitating",artist:"Dua Lipa",src:"Spotify",em:"✨",dur:203},
  {title:"Espresso",artist:"Sabrina Carpenter",src:"Spotify",em:"☕",dur:175},
];

const POSTS_DATA = [
  {id:1,author:"Zara Ahmed",em:"🌟",time:"2m ago",body:"Started a Jam music room 🎵 vibing to Bad Bunny — join us!",media:"🎵",likes:24,comments:8,liked:false},
  {id:2,author:"Kai Tanaka",em:"🔥",time:"18m ago",body:"Watch party for Dune 2 starts in 30 mins!! 🍿 Grab snacks!",media:"🎬",likes:41,comments:15,liked:false},
  {id:3,author:"Niko Petrov",em:"🎸",time:"1h ago",body:"Just beat the chess championship 👑 who's next?",media:null,likes:13,comments:6,liked:true},
];

const TRIVIA_QS = [
  {q:"What is the capital of Kenya?",opts:["Mombasa","Nairobi","Kisumu","Nakuru"],ans:1},
  {q:"Which planet is the Red Planet?",opts:["Venus","Jupiter","Mars","Saturn"],ans:2},
  {q:"Who painted the Mona Lisa?",opts:["Van Gogh","Picasso","Da Vinci","Monet"],ans:2},
  {q:"Largest ocean on Earth?",opts:["Atlantic","Indian","Arctic","Pacific"],ans:3},
  {q:"How many sides does a hexagon have?",opts:["5","6","7","8"],ans:1},
];

const WORDLE_WORDS = ["CRANE","SLATE","AUDIO","BRICK","CLOUD","FLAME","GLORY","HONEY","LIGHT","TIGER"];
const KBD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];
const EMOJIS = "😂❤️🔥🎵🎮🌟👀😍🙌💯🎉😭🤩💪🙏".split("");

/* ════════════════════════════════
   HELPERS
════════════════════════════════ */
const COLORS = ["#e8445a","#6c5ce7","#00d4aa","#f0a500","#e17055","#74b9ff","#fd79a8","#55efc4"];
const pickColor = name => { let h=0; for(let c of name) h=(h*31+c.charCodeAt(0))%COLORS.length; return COLORS[h]; };
const initials  = name => (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const fmt       = s => Math.floor(s/60)+":"+(String(s%60).padStart(2,"0"));
const fmtTime   = ts => ts ? new Date(ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "";
const fmtDate   = ts => {
  if(!ts) return "";
  const d=new Date(ts), t=new Date();
  if(d.toDateString()===t.toDateString()) return "Today";
  const y=new Date(t); y.setDate(y.getDate()-1);
  if(d.toDateString()===y.toDateString()) return "Yesterday";
  return d.toLocaleDateString();
};

// extract YouTube embed URL
const toEmbedUrl = url => {
  if(!url) return null;
  try{
    const u = new URL(url);
    if(u.hostname.includes("youtube.com")){
      const id = u.searchParams.get("v");
      if(id) return "https://www.youtube.com/embed/"+id+"?autoplay=1";
    }
    if(u.hostname.includes("youtu.be")){
      const id = u.pathname.slice(1);
      if(id) return "https://www.youtube.com/embed/"+id+"?autoplay=1";
    }
    // try direct embed for other video sites
    return url;
  }catch{ return null; }
};

/* ════════════════════════════════
   LIVE MESSAGES HOOK
════════════════════════════════ */
function useLiveMsgs(roomId){
  const [msgs,setMsgs] = useState([]);
  useEffect(()=>{
    if(!roomId){setMsgs([]);return;}
    setMsgs([]);
    const poll = async()=>{
      const d = await fbRead("/cinema/"+roomId+"/chat");
      if(!d) return;
      setMsgs(Object.entries(d).map(([id,v])=>({id,...v})).sort((a,b)=>a.ts-b.ts));
    };
    poll();
    const iv=setInterval(poll,2500);
    return()=>clearInterval(iv);
  },[roomId]);
  return msgs;
}

/* ════════════════════════════════
   ROOT
════════════════════════════════ */
export default function Jam(){
  /* auth */
  const [screen,setScreen]   = useState("app");
  const [authTab,setAuthTab] = useState("login");
  const [nameVal,setNameVal] = useState("");
  const [emailVal,setEmailVal] = useState("");
  const [pwVal,setPwVal]     = useState("");
  const [authErr,setAuthErr] = useState("");
  const [user,setUser]       = useState({name:"You",email:"you@jam.app",color:"#e8445a"});

  /* nav */
  const [nav,setNav] = useState("chat");

  /* chat */
  const [friends,setFriends] = useState(FRIENDS_DATA);
  const [activeFriend,setActiveFriend] = useState(FRIENDS_DATA[0]);
  const [messages,setMessages] = useState(INIT_MSGS);
  const [chatInput,setChatInput] = useState("");
  const [showEmoji,setShowEmoji] = useState(false);
  const [replyTo,setReplyTo]   = useState(null);
  const [aiLoading,setAiLoading] = useState(false);
  const [typing,setTyping]       = useState(false);
  const [showNewChat,setShowNewChat] = useState(false);
  const [newChatName,setNewChatName] = useState("");
  const msgsEndRef = useRef(null);

  /* call */
  const [callOn,setCallOn]   = useState(false);
  const [callSecs,setCallSecs] = useState(0);
  const [muted,setMuted]     = useState(false);
  const [videoOn,setVideoOn] = useState(false);
  const callRef = useRef(null);

  /* music */
  const [playing,setPlaying] = useState(false);
  const [trkIdx,setTrkIdx]   = useState(0);
  const [prog,setProg]       = useState(0);
  const [vol,setVol]         = useState(80);
  const [srcMode,setSrcMode] = useState("Spotify");
  const [musicUrl,setMusicUrl] = useState("");
  const musicRef = useRef(null);

  /* cinema */
  const [cinemaUrl,setCinemaUrl]     = useState("");
  const [cinemaEmbed,setCinemaEmbed] = useState(null);
  const [cinemaChat,setCinemaChat]   = useState("");
  const [cinemaRoomId]               = useState("room1");
  const cinemaMsgs = useLiveMsgs(cinemaRoomId);
  const cinemaChatEnd = useRef(null);

  /* games */
  const [game,setGame]   = useState(null);
  const [board,setBoard] = useState(Array(9).fill(null));
  const [xTurn,setXTurn] = useState(true);
  const [tttW,setTttW]   = useState(null);
  const [wTarget]        = useState(()=>WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)]);
  const [wGuesses,setWGuesses] = useState([]);
  const [wCurrent,setWCurrent] = useState("");
  const [wDone,setWDone]       = useState(false);
  const [wMsg,setWMsg]         = useState("");
  const [tIdx,setTIdx]   = useState(0);
  const [tScore,setTScore] = useState(0);
  const [tSel,setTSel]   = useState(null);
  const [tDone,setTDone] = useState(false);

  /* discover */
  const [posts,setPosts] = useState(POSTS_DATA);

  /* toast */
  const [toast,setToast] = useState(null);
  const toastRef = useRef(null);

  /* ── EFFECTS ── */
  useEffect(()=>{ msgsEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,typing,activeFriend]);
  useEffect(()=>{ cinemaChatEnd.current?.scrollIntoView({behavior:"smooth"}); },[cinemaMsgs]);

  useEffect(()=>{
    if(callOn){ callRef.current=setInterval(()=>setCallSecs(s=>s+1),1000); }
    else{ clearInterval(callRef.current); setCallSecs(0); }
    return()=>clearInterval(callRef.current);
  },[callOn]);

  useEffect(()=>{
    if(playing){
      musicRef.current=setInterval(()=>{
        setProg(p=>{ if(p>=TRACKS[trkIdx].dur){setTrkIdx(i=>(i+1)%TRACKS.length);return 0;} return p+1; });
      },1000);
    } else clearInterval(musicRef.current);
    return()=>clearInterval(musicRef.current);
  },[playing,trkIdx]);

  useEffect(()=>{
    if(game!=="wordle") return;
    const h=e=>wKey(e.key.toUpperCase());
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[game,wCurrent,wGuesses,wDone]);

  /* ── TOAST ── */
  const showToast = useCallback((icon,msg)=>{
    setToast({icon,msg});
    clearTimeout(toastRef.current);
    toastRef.current=setTimeout(()=>setToast(null),3000);
  },[]);

  /* ── AUTH ── */
  const doAuth = ()=>{
    const name = nameVal.trim() || emailVal.split("@")[0];
    if(!name){setAuthErr("Please enter your name");return;}
    const color = pickColor(name);
    setUser({name,email:emailVal,color});
    setScreen("app");
    showToast("👋","Welcome to Jam, "+name+"!");
  };

  /* ── SEND CHAT MESSAGE (AI powered) ── */
  const sendChat = async()=>{
    if(!chatInput.trim()||aiLoading||!activeFriend) return;
    const txt = chatInput.trim();
    setChatInput(""); setShowEmoji(false); setReplyTo(null);
    const fid = activeFriend.id;
    const newMsg = {id:"m"+Date.now(),from:"me",text:txt,ts:Date.now(),replyTo:replyTo?{text:replyTo.text,from:replyTo.from}:null};
    setMessages(p=>({...p,[fid]:[...(p[fid]||[]),newMsg]}));
    setFriends(f=>f.map(x=>x.id===fid?{...x,unread:0,last:txt}:x));
    setTyping(true); setAiLoading(true);

    const replies = [
      "Sounds great! 🎵",
      "Haha, I’m in!",
      "That sounds awesome!",
      "Can’t wait — let’s go!",
      "That’s fire 🔥",
      "I’ll join you in a bit."
    ];
    const replyText = replies[Math.floor(Math.random()*replies.length)];

    setTimeout(()=>{
      setTyping(false);
      const replyMsg = {id:"r"+Date.now(),from:"them",text:replyText,ts:Date.now()};
      setMessages(p=>({...p,[fid]:[...(p[fid]||[]),replyMsg]}));
      setFriends(f=>f.map(x=>x.id===fid?{...x,last:replyText}:x));
      setAiLoading(false);
    }, 900);
  };

  /* ── NEW CONTACT ── */
  const addContact = ()=>{
    const name = newChatName.trim();
    if(!name) return;
    const id = "custom_"+Date.now();
    const newFriend = {id,name,color:pickColor(name),status:"online",last:"Say hello!",time:"now",unread:0};
    setFriends(p=>[newFriend,...p]);
    setMessages(p=>({...p,[id]:[]}));
    setActiveFriend(newFriend);
    setShowNewChat(false);
    setNewChatName("");
  };

  /* ── TTT ── */
  const checkTTT = b=>{
    const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const [a,c,d] of lines) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a];
    if(b.every(Boolean)) return "draw"; return null;
  };
  const clickTTT = i=>{
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

  /* ── WORDLE ── */
  const wKeyColors={};
  wGuesses.forEach(g=>[...g].forEach((c,i)=>{
    if(c===wTarget[i]) wKeyColors[c]="correct";
    else if(wTarget.includes(c)&&wKeyColors[c]!=="correct") wKeyColors[c]="present";
    else if(!wKeyColors[c]) wKeyColors[c]="absent";
  }));
  const wTileState=(row,col)=>{
    if(row>=wGuesses.length) return "";
    const c=wGuesses[row][col]; if(!c) return "";
    if(c===wTarget[col]) return "correct";
    if(wTarget.includes(c)) return "present"; return "absent";
  };
  const wKey=k=>{
    if(wDone) return;
    if(k==="⌫"||k==="BACKSPACE"){setWCurrent(p=>p.slice(0,-1));return;}
    if(k==="ENTER"){
      if(wCurrent.length!==5){setWMsg("5 letters needed");return;}
      const ng=[...wGuesses,wCurrent]; setWGuesses(ng); setWCurrent(""); setWMsg("");
      if(wCurrent===wTarget){setWDone(true);setWMsg("🎉 You got it!");return;}
      if(ng.length>=6){setWDone(true);setWMsg("Answer: "+wTarget);}
      return;
    }
    if(wCurrent.length<5&&/^[A-Z]$/.test(k)) setWCurrent(p=>p+k);
  };

  /* ── TRIVIA ── */
  const pickTrivia=i=>{
    if(tSel!==null) return; setTSel(i);
    if(i===TRIVIA_QS[tIdx].ans) setTScore(s=>s+1);
    setTimeout(()=>{
      if(tIdx+1>=TRIVIA_QS.length){setTDone(true);return;}
      setTIdx(s=>s+1); setTSel(null);
    },1200);
  };

  /* ── CINEMA ── */
  const loadCinema=()=>{
    const embed = toEmbedUrl(cinemaUrl);
    if(embed){ setCinemaEmbed(embed); showToast("🎬","Video loaded! Share the Jam link with friends to watch together"); }
    else showToast("⚠️","Please paste a valid YouTube link");
  };
  const sendCinemaChat=async()=>{
    if(!cinemaChatInput.trim()||!user) return;
    await fbPush("/cinema/"+cinemaRoomId+"/chat",{text:cinemaChatInput.trim(),sender:user.name,color:user.color});
    setCinemaChatInput("");
  };
  const [cinemaChatInput,setCinemaChatInput] = useState("");

  /* ── GROUPED MESSAGES ── */
  const groupMsgs=(msgs)=>{
    const out=[]; let lastDate=null;
    (msgs||[]).forEach(m=>{
      const d=fmtDate(m.ts);
      if(d!==lastDate){out.push({type:"date",label:d});lastDate=d;}
      out.push({type:"msg",...m});
    });
    return out;
  };

  /* ════════════════════════════════
     RENDER AUTH
  ════════════════════════════════ */
  if(screen==="auth") return(
    <><style>{CSS}</style>
    <div className="app"><div className="mesh"/>
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">J<em>a</em>m</div>
        <p className="auth-sub">Your world, together. Chat · Music · Cinema · Play · Connect.</p>
        <div className="tabs">
          <button className={"tab-btn"+(authTab==="login"?" on":"")} onClick={()=>setAuthTab("login")}>Sign In</button>
          <button className={"tab-btn"+(authTab==="signup"?" on":"")} onClick={()=>setAuthTab("signup")}>Sign Up</button>
        </div>
        {authTab==="signup"&&<div className="field"><label>Full Name</label><input placeholder="Your name" value={nameVal} onChange={e=>setNameVal(e.target.value)}/></div>}
        <div className="field"><label>Email</label><input type="email" placeholder="you@example.com" value={emailVal} onChange={e=>setEmailVal(e.target.value)}/></div>
        <div className="field"><label>Password</label><input type="password" placeholder="••••••••" value={pwVal} onChange={e=>setPwVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAuth()}/></div>
        <div className="auth-err">{authErr}</div>
        <button className="btn-primary" onClick={doAuth}>{authTab==="login"?"Sign In to Jam 🎵":"Create Account 🚀"}</button>
        <div className="or-row"><div className="or-line"/><span className="or-txt">or</span><div className="or-line"/></div>
        <div className="soc-row">
          {[["🎵","Spotify"],["▶","YouTube"],["🍎","Apple"]].map(([ic,lb])=>(
            <button key={lb} className="soc-btn" onClick={()=>{setEmailVal("demo@jam.app");setPwVal("demo");setNameVal(lb+" User");setTimeout(doAuth,50);}}>
              {ic} {lb}
            </button>
          ))}
        </div>
      </div>
    </div>
    {toast&&<div className="toast"><span>{toast.icon}</span>{toast.msg}</div>}
    </div></>
  );

  /* ════════════════════════════════
     RENDER APP
  ════════════════════════════════ */
  const curMsgs   = activeFriend ? (messages[activeFriend.id]||[]) : [];
  const grouped   = groupMsgs(curMsgs);
  const trk       = TRACKS[trkIdx];

  return(
    <><style>{CSS}</style>
    <div className="app"><div className="mesh"/>
    <div className="layout">

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div className="sb-logo">J</div>
        {[
          {id:"discover",ic:"🌍",tip:"Discover"},
          {id:"chat",    ic:"💬",tip:"Chat",pip:friends.some(f=>f.unread>0)},
          {id:"jam",     ic:"🎵",tip:"Jam Room"},
          {id:"cinema",  ic:"🎬",tip:"Cinema"},
          {id:"games",   ic:"🎮",tip:"Games"},
        ].map(n=>(
          <button key={n.id} className={"sb-btn"+(nav===n.id?" on":"")} title={n.tip} onClick={()=>setNav(n.id)}>
            {n.ic}{n.pip&&nav!=="chat"&&<span className="sb-pip"/>}
          </button>
        ))}
        <div className="sb-gap"/>
        <div className="me-av" style={{background:user?.color||"#e8445a"}} title={user?.name}>
          {initials(user?.name||"?")}
        </div>
      </div>

      {/* ══════════ CHAT ══════════ */}
      {nav==="chat"&&<>
        {/* WhatsApp panel */}
        <div className="wp-panel">
          <div className="wp-hd">
            <span className="wp-title">Chats</span>
            <div className="wp-actions">
              <button className="icon-btn" title="New chat" onClick={()=>setShowNewChat(true)}>✏️</button>
            </div>
          </div>
          <div className="srch-bar">
            <span className="srch-ic">🔍</span>
            <input placeholder="Search or start new chat"/>
          </div>
          <div className="chat-list">
            {friends.map(f=>(
              <div key={f.id} className={"chat-item"+(activeFriend?.id===f.id?" on":"")}
                onClick={()=>{setActiveFriend(f);setFriends(p=>p.map(x=>x.id===f.id?{...x,unread:0}:x));}}>
                <div className={"ci-av"+(f.unread?" story-ring":"")} style={{background:f.color}}>
                  {initials(f.name)}
                  <span className={"ci-dot "+(f.status==="online"?"online":"offline")}/>
                </div>
                <div className="ci-info">
                  <div className="ci-name">{f.name}</div>
                  <div className="ci-last">{f.last}</div>
                </div>
                <div className="ci-meta">
                  <div className="ci-time">{f.time}</div>
                  {f.unread>0&&<div className="ci-badge">{f.unread}</div>}
                </div>
              </div>
            ))}
          </div>
          <button className="new-chat-btn" onClick={()=>setShowNewChat(true)}>✏️ New Chat</button>
        </div>

        {/* Chat window */}
        {activeFriend?(
          <div className="wa-chat">
            {/* header */}
            <div className="wa-hd">
              <div className="wa-hd-av" style={{background:activeFriend.color}}>
                {initials(activeFriend.name)}
              </div>
              <div className="wa-hd-info">
                <div className="wa-hd-name">{activeFriend.name}</div>
                <div className="wa-hd-status">
                  {activeFriend.status==="online"?"● online":activeFriend.status==="away"?"◌ away":"○ last seen recently"}
                </div>
              </div>
              <div className="wa-hd-acts">
                <button className="wa-act" title="Video call" onClick={()=>{setCallOn(true);setVideoOn(true);showToast("📹","Video call started");}}>📹</button>
                <button className="wa-act" title="Voice call" onClick={()=>{setCallOn(true);setVideoOn(false);showToast("📞","Calling "+activeFriend.name+"...");}}>📞</button>
                <button className="wa-act" title="Cinema" onClick={()=>setNav("cinema")}>🎬</button>
              </div>
            </div>

            {/* messages */}
            <div className="wa-msgs">
              <div className="sys-note">Messages are end-to-end encrypted 🔒</div>
              {grouped.map((item,i)=>{
                if(item.type==="date") return(
                  <div key={i} className="date-sep"><span>{item.label}</span></div>
                );
                const isMe = item.from==="me";
                return(
                  <div key={item.id} className={"msg-wrap "+(isMe?"me":"them")}>
                    <div className="msg-bubble-row">
                      {!isMe&&<div className="msg-tiny-av" style={{background:activeFriend.color}}>{initials(activeFriend.name)}</div>}
                      <div className="msg-card" onDoubleClick={()=>setReplyTo(item)}>
                        {item.replyTo&&(
                          <div className="reply-preview" onClick={()=>{}}>
                            <strong>{item.replyTo.from==="me"?user?.name:activeFriend.name}</strong>
                            {item.replyTo.text}
                          </div>
                        )}
                        <div className="wa-bubble">{item.text}</div>
                        <div className="msg-footer">
                          <span className="msg-ts">{fmtTime(item.ts)}</span>
                          {isMe&&<span className="msg-tick">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {typing&&(
                <div className="msg-wrap them">
                  <div className="msg-bubble-row">
                    <div className="msg-tiny-av" style={{background:activeFriend.color}}>{initials(activeFriend.name)}</div>
                    <div className="typing-row"><div className="t-dot"/><div className="t-dot"/><div className="t-dot"/></div>
                  </div>
                </div>
              )}
              <div ref={msgsEndRef}/>
            </div>

            {/* input */}
            <div className="wa-input">
              {replyTo&&(
                <div className="reply-bar">
                  <div className="reply-bar-txt">
                    <strong>{replyTo.from==="me"?user?.name:activeFriend.name}</strong>
                    {replyTo.text}
                  </div>
                  <button className="reply-close" onClick={()=>setReplyTo(null)}>✕</button>
                </div>
              )}
              {showEmoji&&(
                <div className="emoji-tray">
                  {EMOJIS.map(e=><button key={e} className="em-btn" onClick={()=>setChatInput(p=>p+e)}>{e}</button>)}
                </div>
              )}
              <div className="wa-input-row">
                <button className="wa-icon-btn" onClick={()=>setShowEmoji(p=>!p)}>😊</button>
                <button className="wa-icon-btn" onClick={()=>showToast("📎","Attach coming soon")}>📎</button>
                <textarea
                  className="wa-ta"
                  placeholder={"Message"}
                  rows={1}
                  value={chatInput}
                  onChange={e=>setChatInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                />
                <button className="wa-send" onClick={sendChat} disabled={aiLoading||!chatInput.trim()}>➤</button>
              </div>
            </div>
          </div>
        ):(
          <div className="no-chat">
            <div className="no-chat-logo">J<em>a</em>m</div>
            <p>Select a chat to start messaging, or tap <strong>New Chat</strong> to add someone.</p>
            <p style={{fontSize:".75rem",marginTop:4}}>Double-tap any message to reply to it</p>
          </div>
        )}
      </>}

      {/* ══════════ JAM ROOM ══════════ */}
      {nav==="jam"&&(
        <div className="jam-page">
          <div className="jam-inner">
            <div className="page-title">🎵 <span>Jam</span> Room</div>
            <p className="page-sub">Listen together in real time</p>
            <div className="sec-lbl">Connect a Source</div>
            <div className="src-row">
              {[["🎵","Spotify","Stream any song"],["▶","YouTube","Play any video"],["📻","Radio","Live stations"]].map(([ic,nm,desc])=>(
                <div key={nm} className={"src-card"+(srcMode===nm?" on":"")} onClick={()=>{setSrcMode(nm);showToast(ic,"Connected to "+nm);}}>
                  <div className="src-icon">{ic}</div>
                  <div className="src-name">{nm}</div>
                  <div className="src-desc">{desc}</div>
                </div>
              ))}
            </div>
            <div className="url-row">
              <input className="url-inp" placeholder={"Paste "+srcMode+" link to sync..."} value={musicUrl} onChange={e=>setMusicUrl(e.target.value)}/>
              <button className="url-btn" onClick={()=>{if(musicUrl){showToast("🔗","Syncing with friends!");setMusicUrl("");}else showToast("⚠️","Paste a link first");}}>Sync</button>
            </div>
            <div className="player-card">
              <div className="sec-lbl" style={{padding:0,marginBottom:12}}>Now Playing · {srcMode}</div>
              <div className="np-row">
                <div className="trk-art" style={{background:playing?"linear-gradient(135deg,var(--a1),var(--a2))":"var(--s2)"}}>{trk.em}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="trk-name">{trk.title}</div>
                  <div className="trk-artist">{trk.artist}</div>
                  <div className="trk-src">via {trk.src}</div>
                </div>
              </div>
              <div className="prog-bar" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.floor(((e.clientX-r.left)/r.width)*trk.dur));}}>
                <div className="prog-fill" style={{width:((prog/trk.dur)*100)+"%"}}/>
              </div>
              <div className="prog-times"><span>{fmt(prog)}</span><span>{fmt(trk.dur)}</span></div>
              <div className="ctrl-row">
                <button className="ctrl" onClick={()=>showToast("🔀","Shuffle on")}>🔀</button>
                <button className="ctrl" onClick={()=>{setTrkIdx(i=>(i-1+TRACKS.length)%TRACKS.length);setProg(0);}}>⏮</button>
                <button className="ctrl pp" onClick={()=>setPlaying(p=>!p)}>{playing?"⏸":"▶"}</button>
                <button className="ctrl" onClick={()=>{setTrkIdx(i=>(i+1)%TRACKS.length);setProg(0);}}>⏭</button>
                <button className="ctrl" onClick={()=>showToast("🔁","Repeat on")}>🔁</button>
              </div>
              <div className="vol-row">
                <span>🔈</span>
                <input type="range" className="vol-sl" min={0} max={100} value={vol} onChange={e=>setVol(+e.target.value)}/>
                <span style={{fontSize:".72rem",color:"var(--muted)",minWidth:30}}>{vol}%</span>
              </div>
              <div className="listeners-row">
                <div className="l-avs">{["🌟","🎮","🔥"].map((e,i)=><div key={i} className="l-av">{e}</div>)}</div>
                <span className="l-txt">Zara, Leo & Kai are listening</span>
              </div>
            </div>
            <div className="sec-lbl">Queue</div>
            <div className="queue-list">
              {TRACKS.map((t,i)=>(
                <div key={i} className={"q-item"+(i===trkIdx?" on":"")} onClick={()=>{setTrkIdx(i);setProg(0);setPlaying(true);}}>
                  <div className="q-art">{t.em}</div>
                  <div className="q-info">
                    <div className="q-name" style={{color:i===trkIdx?"var(--a1)":""}}>{t.title}</div>
                    <div className="q-meta">{t.artist} · {t.src}</div>
                  </div>
                  <div className="q-dur">{fmt(t.dur)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CINEMA ══════════ */}
      {nav==="cinema"&&(
        <div className="cinema-page">
          <div className="cinema-inner">
            <div className="page-title">🎬 <span>Cinema</span></div>
            <p className="page-sub">Paste a YouTube link — everyone watches together in sync</p>

            {/* controls */}
            <div className="cinema-controls-row">
              <input
                className="cinema-url-inp"
                placeholder="Paste YouTube link here (e.g. youtube.com/watch?v=...)"
                value={cinemaUrl}
                onChange={e=>setCinemaUrl(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&loadCinema()}
              />
              <button className="cinema-load-btn" onClick={loadCinema}>▶ Load</button>
              <button className="cinema-share-btn" onClick={()=>{navigator.clipboard?.writeText(window.location.href);showToast("🔗","Link copied! Share with friends to watch together");}}>🔗 Share</button>
            </div>

            {/* video player */}
            <div className="cinema-player-wrap">
              {cinemaEmbed?(
                <iframe
                  className="cinema-iframe"
                  src={cinemaEmbed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Cinema"
                />
              ):(
                <div className="cinema-placeholder">
                  <span>🎬</span>
                  <div>Paste a YouTube link above and press Load</div>
                  <div style={{fontSize:".75rem",color:"var(--muted)"}}>Share the Jam link with friends to watch together</div>
                </div>
              )}
            </div>

            {/* sync bar */}
            <div className="sync-bar">
              <div className="sync-title"><div className="sync-live"/>{cinemaEmbed?"Watching now":"Ready to watch"}</div>
              <div className="viewers-row">
                {(user?[user,...friends.slice(0,3)]:[...friends.slice(0,3)]).map((f,i)=>(
                  <div key={i} className="viewer-chip">
                    <div className="viewer-dot" style={{background:f.color||"var(--a3)"}}/>
                    <span style={{color:f.color||"var(--a3)",fontWeight:500,fontSize:".72rem"}}>{f.name?.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* live cinema chat */}
            <div className="cinema-chat">
              <div className="cinema-chat-hd">💬 Live Chat</div>
              <div className="cinema-msgs">
                {cinemaMsgs.length===0&&<div style={{color:"var(--muted)",fontSize:".78rem",textAlign:"center",padding:"16px 0"}}>No messages yet — say something!</div>}
                {cinemaMsgs.map(m=>(
                  <div key={m.id} className="cinema-msg">
                    <div className="cinema-msg-av" style={{background:m.color||"var(--a2)"}}>{initials(m.sender||"?")}</div>
                    <div className="cinema-msg-txt">
                      <span className="cinema-msg-name" style={{color:m.color}}>{m.sender}</span>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={cinemaChatEnd}/>
              </div>
              <div className="cinema-input-row">
                <input
                  className="cinema-ta"
                  placeholder="Say something..."
                  value={cinemaChatInput}
                  onChange={e=>setCinemaChatInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&sendCinemaChat()}
                />
                <button className="cinema-send" onClick={sendCinemaChat}>➤</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ GAMES ══════════ */}
      {nav==="games"&&(
        <div className="jam-page">
          <div className="jam-inner">
            <div className="page-title">🎮 <span>Games</span></div>
            <p className="page-sub">Play with friends in real time</p>
            <div className="games-grid">
              {[
                {id:"ttt",    nm:"Tic Tac Toe",ic:"⭕",pl:"vs AI",   badge:"Play",    col:"#e8445a"},
                {id:"wordle", nm:"Wordle",     ic:"📝",pl:"Solo",    badge:"New",     col:"#6c5ce7"},
                {id:"trivia", nm:"Trivia",     ic:"🧠",pl:"Solo",    badge:"Hot",     col:"#00d4aa"},
                {id:"chess",  nm:"Chess",      ic:"♟️",pl:"2 player",badge:"Classic", col:"#f0a500"},
              ].map(g=>(
                <div key={g.id} className="g-card" style={{borderColor:nav===g.id?"var(--a1)":"var(--border)"}}
                  onClick={()=>{
                    if(g.id==="ttt"){setBoard(Array(9).fill(null));setXTurn(true);setTttW(null);setGame("ttt");}
                    else if(g.id==="wordle"){setWGuesses([]);setWCurrent("");setWDone(false);setWMsg("");setGame("wordle");}
                    else if(g.id==="trivia"){setTIdx(0);setTScore(0);setTSel(null);setTDone(false);setGame("trivia");}
                    else showToast("🎮",g.nm+" coming soon!");
                  }}>
                  <div className="g-icon">{g.ic}</div>
                  <div className="g-name">{g.nm}</div>
                  <div className="g-pl">{g.pl}</div>
                  <div className="g-badge" style={{background:g.col+"22",color:g.col}}>{g.badge}</div>
                </div>
              ))}
            </div>
            <div className="sec-lbl">Leaderboard</div>
            {friends.slice(0,4).map((f,i)=>(
              <div key={f.id} className="lb-item">
                <div style={{width:22,textAlign:"center",fontFamily:"var(--fh)",fontWeight:700,color:["var(--a1)","#94a3b8","#cd7f32","var(--muted)"][i]}}>{["🥇","🥈","🥉","#4"][i]}</div>
                <div style={{width:32,height:32,borderRadius:"50%",background:f.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".78rem",fontWeight:700,color:"#fff"}}>{initials(f.name)}</div>
                <div style={{flex:1,fontSize:".86rem",fontWeight:500}}>{f.name}</div>
                <div style={{fontSize:".78rem",color:"var(--muted)"}}>{[2840,2100,1870,1640][i]} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ DISCOVER ══════════ */}
      {nav==="discover"&&(
        <div className="feed-page">
          <div className="feed-inner">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div className="page-title">Discover</div>
              <button className="icon-btn" onClick={()=>showToast("✍️","Create post coming soon")}>✏️</button>
            </div>
            <div className="sec-lbl">Stories</div>
            <div className="story-scroll">
              <div className="story-it" onClick={()=>showToast("➕","Add your story")}>
                <div className="story-ring"><div className="story-in" style={{background:"rgba(232,68,90,.15)"}}>➕</div></div>
                <span className="story-nm">You</span>
              </div>
              {friends.map(f=>(
                <div key={f.id} className="story-it" onClick={()=>showToast("👁️",f.name+"'s story")}>
                  <div className="story-ring">
                    <div className="story-in" style={{background:f.color,color:"#fff",fontWeight:700,fontSize:".85rem"}}>{initials(f.name)}</div>
                  </div>
                  <span className="story-nm">{f.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
            <div className="sec-lbl">Feed</div>
            {posts.map(p=>(
              <div key={p.id} className="post">
                <div className="post-hd">
                  <div className="post-av" style={{background:pickColor(p.author),color:"#fff",fontWeight:700,fontSize:".8rem"}}>{initials(p.author)}</div>
                  <div style={{flex:1}}>
                    <div className="post-author">{p.author}</div>
                    <div className="post-time">{p.time}</div>
                  </div>
                  <button className="icon-btn">···</button>
                </div>
                <div className="post-body">{p.body}</div>
                {p.media&&<div className="post-media">{p.media}</div>}
                <div className="post-acts">
                  <button className={"post-act"+(p.liked?" liked":"")} onClick={()=>setPosts(ps=>ps.map(x=>x.id===p.id?{...x,liked:!x.liked,likes:x.liked?x.likes-1:x.likes+1}:x))}>
                    {p.liked?"❤️":"🤍"} {p.likes}
                  </button>
                  <button className="post-act" onClick={()=>showToast("💬","Comments coming soon")}>💬 {p.comments}</button>
                  <button className="post-act" onClick={()=>showToast("🔗","Link copied!")}>🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* ══ CALL OVERLAY ══ */}
    {callOn&&(
      <div className="call-ov" onClick={e=>e.target===e.currentTarget&&setCallOn(false)}>
        <div className="call-card">
          {videoOn&&(
            <div className="vid-grid">
              <div className="vid-cell" style={{fontSize:"1.5rem",fontWeight:700,color:user?.color}}>{initials(user?.name||"?")}<div className="vid-lbl">You</div></div>
              <div className="vid-cell">
                {activeFriend&&<div style={{fontSize:"1.5rem",fontWeight:700,color:activeFriend.color}}>{initials(activeFriend.name)}</div>}
                <div className="vid-lbl">{activeFriend?.name.split(" ")[0]||"Friend"}</div>
              </div>
            </div>
          )}
          {!videoOn&&(
            <div className="call-av-big" style={{background:activeFriend?.color||"var(--a1)"}}>
              {initials(activeFriend?.name||"?")}
            </div>
          )}
          <div className="call-name">{activeFriend?.name||"Friend"}</div>
          <div className="call-st">{videoOn?"Video Call":"Voice Call"}</div>
          <div className="call-dur">{fmt(callSecs)}</div>
          <div className="call-btns">
            <button className="c-btn mute" onClick={()=>setMuted(m=>!m)}>{muted?"🔇":"🎙️"}</button>
            <button className="c-btn end" onClick={()=>{setCallOn(false);setVideoOn(false);showToast("📞","Call ended — "+fmt(callSecs));}}>📵</button>
            <button className="c-btn vid" onClick={()=>setVideoOn(v=>!v)}>{videoOn?"🚫📹":"📹"}</button>
          </div>
        </div>
      </div>
    )}

    {/* ══ NEW CHAT MODAL ══ */}
    {showNewChat&&(
      <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowNewChat(false)}>
        <div className="modal">
          <div className="modal-title">New Chat</div>
          <input className="modal-input" placeholder="Enter contact name..." value={newChatName} onChange={e=>setNewChatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addContact()} autoFocus/>
          <div className="modal-btns">
            <button className="modal-cancel" onClick={()=>setShowNewChat(false)}>Cancel</button>
            <button className="modal-ok" onClick={addContact}>Start Chat</button>
          </div>
        </div>
      </div>
    )}

    {/* ══ TTT ══ */}
    {game==="ttt"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-card-ov">
          <div className="g-title">⭕ Tic Tac Toe</div>
          <div className="g-sub">You ❌ vs AI ⭕</div>
          <div className={"ttt-st"+(tttW?" ttt-win":"")}>{tttW?(tttW==="draw"?"Draw 🤝":tttW==="❌"?"You win! 🎉":"AI wins 🤖"):(xTurn?"Your turn ❌":"AI thinking...")}</div>
          <div className="ttt-board">
            {board.map((cell,i)=>(
              <button key={i} className={"ttt-cell"+(cell==="❌"?" x":cell==="⭕"?" o":"")} onClick={()=>clickTTT(i)} disabled={!!cell||!!tttW||!xTurn}>{cell}</button>
            ))}
          </div>
          <button className="btn-primary" style={{marginTop:12}} onClick={()=>{setBoard(Array(9).fill(null));setXTurn(true);setTttW(null);}}>New Game 🔄</button>
          <button style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--fb)"}} onClick={()=>setGame(null)}>Close</button>
        </div>
      </div>
    )}

    {/* ══ WORDLE ══ */}
    {game==="wordle"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-card-ov">
          <div className="g-title">📝 Wordle</div>
          <div className="g-sub">Guess the 5-letter word</div>
          {wMsg&&<div style={{fontSize:".82rem",color:wDone&&wGuesses.slice(-1)[0]===wTarget?"var(--a3)":"var(--a1)",marginBottom:8,fontWeight:600}}>{wMsg}</div>}
          <div className="wordle-grid">
            {Array(6).fill(null).map((_,row)=>(
              <div key={row} className="w-row">
                {Array(5).fill(null).map((_,col)=>{
                  const isActive=row===wGuesses.length;
                  const ch=isActive?(wCurrent[col]||""):(wGuesses[row]?.[col]||"");
                  const state=wTileState(row,col);
                  return <div key={col} className={"w-tile"+(state?" "+state:ch?" filled":"")}>{ch}</div>;
                })}
              </div>
            ))}
          </div>
          <div className="wordle-kbd">
            {KBD_ROWS.map((row,i)=>(
              <div key={i} className="kbd-row">
                {row.map(k=><button key={k} className={"kbd-key"+(k.length>1?" wide":"")+" "+(wKeyColors[k]||"")} onClick={()=>wKey(k)}>{k}</button>)}
              </div>
            ))}
          </div>
          {wDone&&<button className="btn-primary" style={{marginTop:12}} onClick={()=>{setWGuesses([]);setWCurrent("");setWDone(false);setWMsg("");}}>Play Again 🔄</button>}
          <button style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--fb)"}} onClick={()=>setGame(null)}>Close</button>
        </div>
      </div>
    )}

    {/* ══ TRIVIA ══ */}
    {game==="trivia"&&(
      <div className="g-ov" onClick={e=>e.target===e.currentTarget&&setGame(null)}>
        <div className="g-card-ov">
          <div className="g-title">🧠 Trivia</div>
          {!tDone?(
            <>
              <div className="g-sub">Question {tIdx+1}/{TRIVIA_QS.length} · Score: {tScore}</div>
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
              <div style={{fontFamily:"var(--fh)",fontSize:"1.1rem",color:"var(--a3)",fontWeight:700,marginBottom:8}}>Score: {tScore}/{TRIVIA_QS.length}</div>
              <div className="g-sub">{tScore>=4?"Amazing! 🔥":tScore>=2?"Good job! 👍":"Keep practising! 💪"}</div>
              <button className="btn-primary" style={{marginTop:12}} onClick={()=>{setTIdx(0);setTScore(0);setTSel(null);setTDone(false);}}>Play Again 🔄</button>
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
