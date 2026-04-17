import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a26;
    --border: #ffffff12;
    --accent: #ff4d6d;
    --accent2: #7c3aed;
    --accent3: #06d6a0;
    --text: #f0eeff;
    --muted: #8885a8;
    --glow: 0 0 40px #ff4d6d33;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow: hidden; }

  .app { width: 100vw; height: 100vh; display: flex; flex-direction: column; position: relative; overflow: hidden; }

  /* ── NOISE OVERLAY ── */
  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ── GRADIENT MESH ── */
  .mesh {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: 
      radial-gradient(ellipse 60% 50% at 20% 20%, #ff4d6d18 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 80% 80%, #7c3aed18 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 60% 30%, #06d6a010 0%, transparent 50%);
  }

  /* ── AUTH SCREEN ── */
  .auth {
    position: relative; z-index: 10;
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  }

  .auth-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 48px 40px; width: 420px; max-width: 95vw;
    backdrop-filter: blur(20px);
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .logo { font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; letter-spacing: -2px; margin-bottom: 6px; }
  .logo span { color: var(--accent); }
  .tagline { color: var(--muted); font-size: 0.9rem; margin-bottom: 36px; }

  .tabs { display: flex; gap: 4px; background: var(--bg); border-radius: 12px; padding: 4px; margin-bottom: 28px; }
  .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
  .tab-btn.active { background: var(--accent); color: white; font-weight: 500; }

  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
  .form-input {
    width: 100%; padding: 12px 16px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: #ffffff30; }

  .btn-primary {
    width: 100%; padding: 14px; background: var(--accent); border: none; border-radius: 12px;
    color: white; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em; transition: all 0.2s; margin-top: 8px;
  }
  .btn-primary:hover { background: #ff2d52; box-shadow: 0 0 30px #ff4d6d66; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .divider-line { flex: 1; height: 1px; background: var(--border); }
  .divider-text { color: var(--muted); font-size: 0.8rem; }

  .social-login { display: flex; gap: 8px; }
  .social-btn {
    flex: 1; padding: 11px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 1.2rem; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
  }
  .social-btn:hover { border-color: #ffffff30; background: var(--surface2); }

  /* ── MAIN APP LAYOUT ── */
  .main { position: relative; z-index: 10; display: flex; width: 100%; height: 100%; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 72px; height: 100%; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; padding: 16px 0; gap: 8px;
    flex-shrink: 0;
  }

  .sidebar-logo { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--accent); margin-bottom: 16px; }

  .nav-btn {
    width: 48px; height: 48px; border-radius: 14px; border: none; background: transparent;
    color: var(--muted); font-size: 1.3rem; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s; position: relative;
  }
  .nav-btn:hover { background: var(--surface2); color: var(--text); }
  .nav-btn.active { background: var(--accent); color: white; box-shadow: 0 0 20px #ff4d6d55; }
  .nav-btn .badge {
    position: absolute; top: 6px; right: 6px; width: 8px; height: 8px;
    background: var(--accent3); border-radius: 50%; border: 2px solid var(--surface);
  }

  .sidebar-spacer { flex: 1; }
  .avatar-sm {
    width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accent);
    overflow: hidden; cursor: pointer; transition: transform 0.2s;
  }
  .avatar-sm:hover { transform: scale(1.05); }
  .avatar-sm img { width: 100%; height: 100%; object-fit: cover; }

  /* ── CONTENT ── */
  .content { flex: 1; display: flex; height: 100%; overflow: hidden; }

  /* ── PANEL ── */
  .panel { width: 280px; height: 100%; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
  .panel-header { padding: 20px 16px 12px; display: flex; align-items: center; justify-content: space-between; }
  .panel-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; }
  .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: var(--surface2); color: var(--muted); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .icon-btn:hover { color: var(--text); background: var(--border); }

  .search-bar { margin: 0 12px 12px; position: relative; }
  .search-bar input { width: 100%; padding: 9px 12px 9px 34px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.85rem; outline: none; }
  .search-bar input::placeholder { color: var(--muted); }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 0.9rem; }

  .friend-list { flex: 1; overflow-y: auto; padding: 0 8px; }
  .friend-list::-webkit-scrollbar { width: 4px; }
  .friend-list::-webkit-scrollbar-track { background: transparent; }
  .friend-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .friend-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-radius: 12px;
    cursor: pointer; transition: background 0.15s; margin-bottom: 2px;
  }
  .friend-item:hover { background: var(--surface2); }
  .friend-item.active { background: var(--accent)18; }

  .avatar { position: relative; flex-shrink: 0; }
  .avatar-img { width: 40px; height: 40px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 600; color: var(--text); overflow: hidden; }
  .status-dot { position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--surface); }
  .status-dot.online { background: var(--accent3); }
  .status-dot.away { background: #f59e0b; }
  .status-dot.offline { background: #475569; }

  .friend-info { flex: 1; min-width: 0; }
  .friend-name { font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .friend-status { font-size: 0.75rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .friend-time { font-size: 0.7rem; color: var(--muted); flex-shrink: 0; }

  /* ── CHAT MAIN ── */
  .chat-main { flex: 1; display: flex; flex-direction: column; height: 100%; min-width: 0; }

  .chat-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; background: var(--surface);
  }
  .chat-header-info { flex: 1; }
  .chat-header-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; }
  .chat-header-status { font-size: 0.78rem; color: var(--accent3); }
  .chat-actions { display: flex; gap: 6px; }

  .action-btn {
    width: 36px; height: 36px; border-radius: 10px; border: none; background: var(--surface2);
    color: var(--muted); font-size: 1rem; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s;
  }
  .action-btn:hover { background: var(--accent); color: white; transform: scale(1.05); }
  .action-btn.active { background: var(--accent3); color: var(--bg); }

  .messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg-group { display: flex; gap: 10px; }
  .msg-group.mine { flex-direction: row-reverse; }

  .msg-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; align-self: flex-end; }

  .msg-content { max-width: 65%; display: flex; flex-direction: column; gap: 4px; }
  .msg-group.mine .msg-content { align-items: flex-end; }

  .msg-sender { font-size: 0.72rem; color: var(--muted); padding: 0 8px; }

  .msg-bubble {
    padding: 10px 14px; border-radius: 18px; font-size: 0.88rem; line-height: 1.5;
    background: var(--surface2); color: var(--text); position: relative;
    border-bottom-left-radius: 4px;
  }
  .msg-group.mine .msg-bubble {
    background: var(--accent); color: white;
    border-bottom-left-radius: 18px; border-bottom-right-radius: 4px;
  }
  .msg-time { font-size: 0.68rem; color: var(--muted); padding: 0 8px; }

  .typing-indicator { display: flex; align-items: center; gap: 4px; padding: 10px 14px; background: var(--surface2); border-radius: 18px; border-bottom-left-radius: 4px; width: fit-content; }
  .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: bounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  .chat-input-area { padding: 12px 16px; border-top: 1px solid var(--border); background: var(--surface); }
  .chat-input-row { display: flex; gap: 8px; align-items: flex-end; }
  .chat-input {
    flex: 1; padding: 12px 16px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 14px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; resize: none; max-height: 120px; line-height: 1.4; transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--accent); }
  .chat-input::placeholder { color: var(--muted); }
  .send-btn {
    width: 44px; height: 44px; border-radius: 12px; border: none; background: var(--accent);
    color: white; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s; flex-shrink: 0;
  }
  .send-btn:hover { background: #ff2d52; box-shadow: 0 0 20px #ff4d6d55; }
  .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .attach-btn {
    width: 44px; height: 44px; border-radius: 12px; border: none; background: var(--surface2);
    color: var(--muted); font-size: 1.1rem; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s; flex-shrink: 0;
  }
  .attach-btn:hover { color: var(--text); background: var(--border); }

  /* ── CALL OVERLAY ── */
  .call-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: #000000cc; backdrop-filter: blur(20px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .call-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 28px;
    padding: 48px 40px; text-align: center; width: 340px;
    animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes scaleIn { from { opacity: 0; scale: 0.9; } to { opacity: 1; scale: 1; } }

  .call-avatar { width: 100px; height: 100px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 16px; border: 3px solid var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 #ff4d6d44; } 50% { box-shadow: 0 0 0 20px #ff4d6d00; } }

  .call-name { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; }
  .call-status { color: var(--muted); font-size: 0.9rem; margin-bottom: 36px; }
  .call-duration { color: var(--accent3); font-size: 1.2rem; font-weight: 500; margin-bottom: 32px; font-variant-numeric: tabular-nums; }

  .call-controls { display: flex; justify-content: center; gap: 16px; }
  .call-btn {
    width: 56px; height: 56px; border-radius: 50%; border: none; font-size: 1.3rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .call-btn.mute { background: var(--surface2); color: var(--text); }
  .call-btn.mute:hover { background: var(--border); }
  .call-btn.end { background: #ef4444; color: white; }
  .call-btn.end:hover { background: #dc2626; transform: scale(1.05); }
  .call-btn.video { background: var(--surface2); color: var(--text); }
  .call-btn.video:hover { background: var(--border); }

  /* ── JAM ROOM (Music/Watch Party) ── */
  .jam-room {
    flex: 1; height: 100%; display: flex; flex-direction: column; background: var(--bg);
    overflow-y: auto;
  }
  .jam-room::-webkit-scrollbar { width: 4px; }
  .jam-room::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .jam-hero {
    padding: 32px 32px 0; display: flex; align-items: flex-start; justify-content: space-between;
  }
  .jam-hero-title { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; line-height: 1.1; }
  .jam-hero-title span { color: var(--accent); }

  .section-title { font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }

  .music-player {
    margin: 24px 32px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 24px; position: relative; overflow: hidden;
  }
  .music-player::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 70% at 80% 50%, var(--accent2)20, transparent 60%);
    pointer-events: none;
  }
  .now-playing { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .track-art {
    width: 64px; height: 64px; border-radius: 12px; background: var(--accent2);
    display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;
    overflow: hidden;
  }
  .track-info { flex: 1; min-width: 0; }
  .track-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .track-artist { font-size: 0.82rem; color: var(--muted); }
  .track-source { font-size: 0.72rem; color: var(--accent3); margin-top: 2px; }

  .progress-bar-wrap { margin-bottom: 8px; cursor: pointer; }
  .progress-bar { height: 4px; background: var(--surface2); border-radius: 4px; position: relative; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.3s linear; }
  .progress-times { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted); margin-top: 4px; }

  .player-controls { display: flex; align-items: center; justify-content: center; gap: 12px; }
  .ctrl-btn { background: none; border: none; color: var(--muted); font-size: 1.1rem; cursor: pointer; padding: 6px; border-radius: 8px; transition: all 0.2s; }
  .ctrl-btn:hover { color: var(--text); background: var(--surface2); }
  .ctrl-btn.play-pause {
    width: 46px; height: 46px; border-radius: 50%; background: var(--accent);
    color: white; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
  }
  .ctrl-btn.play-pause:hover { background: #ff2d52; box-shadow: 0 0 20px #ff4d6d55; }

  .listeners { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
  .listener-avatars { display: flex; }
  .listener-av { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--surface); background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; margin-left: -8px; }
  .listener-av:first-child { margin-left: 0; }
  .listeners-text { font-size: 0.78rem; color: var(--muted); }

  .source-cards { display: flex; gap: 12px; margin: 0 32px 24px; }
  .source-card {
    flex: 1; padding: 16px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .source-card:hover { border-color: var(--accent); background: var(--surface2); transform: translateY(-2px); }
  .source-card.active { border-color: var(--accent); background: var(--accent)15; }
  .source-icon { font-size: 1.8rem; margin-bottom: 8px; }
  .source-name { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 700; }
  .source-desc { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }

  /* ── WATCH PARTY ── */
  .watch-section { margin: 0 32px 24px; }
  .watch-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    overflow: hidden; cursor: pointer; transition: all 0.2s;
  }
  .watch-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .watch-thumb { height: 140px; background: #000; display: flex; align-items: center; justify-content: center; font-size: 3rem; position: relative; overflow: hidden; }
  .watch-thumb::after { content: '▶'; position: absolute; width: 50px; height: 50px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; opacity: 0; transition: opacity 0.2s; }
  .watch-card:hover .watch-thumb::after { opacity: 1; }
  .watch-info { padding: 12px 14px; }
  .watch-title { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; }
  .watch-meta { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
  .watch-live { display: inline-block; padding: 2px 8px; background: #ef4444; border-radius: 4px; font-size: 0.7rem; font-weight: 700; color: white; margin-right: 6px; }

  /* ── GAMES ── */
  .games-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 32px 24px; }
  .game-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 20px 16px; cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .game-card:hover { border-color: var(--accent2); transform: translateY(-2px); background: var(--surface2); }
  .game-icon { font-size: 2.2rem; margin-bottom: 10px; }
  .game-name { font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700; }
  .game-players { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .game-badge { display: inline-block; padding: 2px 8px; background: var(--accent2)33; color: var(--accent2); border-radius: 20px; font-size: 0.68rem; font-weight: 600; margin-top: 6px; }

  /* ── GAME: TIC TAC TOE ── */
  .ttt-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: #000000cc; backdrop-filter: blur(20px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  }
  .ttt-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 24px;
    padding: 32px; width: 360px; text-align: center;
    animation: scaleIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .ttt-title { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 20px; }
  .ttt-board { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin: 20px auto; max-width: 240px; }
  .ttt-cell {
    aspect-ratio: 1; background: var(--surface2); border: 2px solid var(--border);
    border-radius: 12px; font-size: 1.8rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s;
    border: none;
  }
  .ttt-cell:hover:not(:disabled) { background: var(--bg); transform: scale(0.96); }
  .ttt-cell:disabled { cursor: default; }
  .ttt-cell.x { color: var(--accent); }
  .ttt-cell.o { color: var(--accent2); }
  .ttt-status { font-size: 0.9rem; color: var(--muted); margin-bottom: 16px; }
  .ttt-win { color: var(--accent3) !important; font-weight: 600; font-size: 1rem !important; }

  /* ── DISCOVER / FEED ── */
  .feed { flex: 1; height: 100%; overflow-y: auto; padding: 24px; }
  .feed::-webkit-scrollbar { width: 4px; }
  .feed::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .feed-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .feed-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; }

  .story-row { display: flex; gap: 12px; margin-bottom: 28px; overflow-x: auto; padding-bottom: 8px; }
  .story-row::-webkit-scrollbar { display: none; }
  .story-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0; }
  .story-ring { width: 58px; height: 58px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, var(--accent), var(--accent2)); }
  .story-inner { width: 100%; height: 100%; border-radius: 50%; border: 2px solid var(--bg); background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
  .story-name { font-size: 0.68rem; color: var(--muted); text-align: center; max-width: 58px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .post-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 16px; margin-bottom: 16px; }
  .post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .post-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .post-meta { flex: 1; }
  .post-author { font-weight: 500; font-size: 0.9rem; }
  .post-time { font-size: 0.73rem; color: var(--muted); }
  .post-body { font-size: 0.88rem; line-height: 1.6; margin-bottom: 12px; color: #d0ccff; }
  .post-media { background: var(--surface2); border-radius: 12px; height: 180px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin-bottom: 12px; }
  .post-actions { display: flex; gap: 16px; }
  .post-action { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: all 0.2s; }
  .post-action:hover { background: var(--surface2); color: var(--text); }
  .post-action.liked { color: var(--accent); }

  /* ── NOTIFICATIONS DOT ── */
  .notif-dot {
    display: inline-block; width: 8px; height: 8px; background: var(--accent);
    border-radius: 50; margin-left: 4px; animation: ping 1s infinite;
  }
  @keyframes ping { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 200;
    background: var(--surface2); border: 1px solid var(--border); border-radius: 14px;
    padding: 12px 18px; font-size: 0.88rem; display: flex; align-items: center; gap: 10px;
    animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 8px 32px #00000080;
  }
  @keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  .toast-icon { font-size: 1.1rem; }

  /* ── SCROLLBAR ── */
  * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
`;

// ── MOCK DATA ─────────────────────────────────────────────────────────────────

const FRIENDS = [
  { id: 1, name: "Zara Ahmed", emoji: "🌟", status: "online", statusText: "Listening to Bad Bunny 🎵", time: "now" },
  { id: 2, name: "Leo Kaspar", emoji: "🎮", status: "online", statusText: "Playing Chess", time: "2m" },
  { id: 3, name: "Maya Brooks", emoji: "🌈", status: "away", statusText: "Away", time: "15m" },
  { id: 4, name: "Kai Tanaka", emoji: "🔥", status: "online", statusText: "Watch party — Dune 2", time: "1h" },
  { id: 5, name: "Sofia Reyes", emoji: "✨", status: "offline", statusText: "Last seen 3h ago", time: "3h" },
  { id: 6, name: "Niko Petrov", emoji: "🎸", status: "online", statusText: "Jamming on Spotify", time: "5m" },
  { id: 7, name: "Aisha Musa", emoji: "💜", status: "away", statusText: "Be back soon", time: "30m" },
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, from: "them", text: "hey!! wanna do a jam session tonight? 🎵", time: "7:42 PM" },
    { id: 2, from: "me", text: "YES omg I've been waiting for this 🙌", time: "7:43 PM" },
    { id: 3, from: "them", text: "I'll start a Spotify room — my new playlist is 🔥", time: "7:44 PM" },
    { id: 4, from: "me", text: "perfect, adding Leo and Maya too", time: "7:44 PM" },
  ],
  2: [
    { id: 1, from: "them", text: "rematch??", time: "6:10 PM" },
    { id: 2, from: "me", text: "you just got lucky last time 😤", time: "6:11 PM" },
    { id: 3, from: "them", text: "sure sure, accept the invite 😂", time: "6:12 PM" },
  ],
  3: [
    { id: 1, from: "them", text: "how's everything going? 🌈", time: "3:00 PM" },
    { id: 2, from: "me", text: "pretty good! working on some stuff", time: "3:05 PM" },
  ],
};

const POSTS = [
  { id: 1, author: "Zara Ahmed", emoji: "🌟", time: "2m ago", body: "Started a Jam music room 🎵 we're vibing to Bad Bunny rn — join us if you want! 💃", media: "🎵", likes: 24, comments: 8, liked: false },
  { id: 2, author: "Kai Tanaka", emoji: "🔥", time: "18m ago", body: "Watch party for Dune 2 is starting in 30 mins!! Grab your popcorn 🍿 — link in the chat", media: "🎬", likes: 41, comments: 15, liked: false },
  { id: 3, author: "Niko Petrov", emoji: "🎸", time: "1h ago", body: "just beat the chess championship in the Games room 👑 who's next?", media: null, likes: 13, comments: 6, liked: true },
  { id: 4, author: "Maya Brooks", emoji: "🌈", time: "2h ago", body: "Throwback to last night's Jam session — we went for 4 hours straight 😭❤️", media: "📸", likes: 67, comments: 22, liked: false },
];

const TRACKS = [
  { title: "WHERE SHE GOES", artist: "Bad Bunny", source: "Spotify", emoji: "🎵", duration: 213 },
  { title: "Blinding Lights", artist: "The Weeknd", source: "Spotify", emoji: "🌙", duration: 200 },
  { title: "HUMBLE.", artist: "Kendrick Lamar", source: "YouTube", emoji: "🎤", duration: 177 },
  { title: "Levitating", artist: "Dua Lipa", source: "Spotify", emoji: "✨", duration: 203 },
];

const GAMES = [
  { id: "ttt", name: "Tic Tac Toe", icon: "⭕", players: "2 players", badge: "Playing now", color: "#ff4d6d" },
  { id: "wordle", name: "Wordle Duel", icon: "📝", players: "2 players", badge: "New", color: "#7c3aed" },
  { id: "trivia", name: "Trivia Night", icon: "🧠", players: "2–8 players", badge: "Hot", color: "#06d6a0" },
  { id: "chess", name: "Chess", icon: "♟️", players: "2 players", badge: "Classic", color: "#f59e0b" },
];

const WATCH = [
  { title: "Dune: Part Two", meta: "2h 46m · Sci-Fi · 4K", emoji: "🏜️", live: true },
  { title: "Poor Things", meta: "2h 21m · Drama · HD", emoji: "🎭", live: false },
  { title: "The Bear S3", meta: "Episode 4 · Drama · HD", emoji: "🍳", live: false },
];

// ── FORMAT TIME ───────────────────────────────────────────────────────────────
const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function Jam() {
  const [screen, setScreen] = useState("auth"); // auth | app
  const [authTab, setAuthTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const [activeNav, setActiveNav] = useState("chat"); // chat | jam | discover
  const [activeFriend, setActiveFriend] = useState(FRIENDS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [callActive, setCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [callMuted, setCallMuted] = useState(false);
  const [callVideo, setCallVideo] = useState(false);
  const callTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeSource, setActiveSource] = useState("Spotify");
  const musicTimer = useRef(null);

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [tttWinner, setTttWinner] = useState(null);

  const [posts, setPosts] = useState(POSTS);
  const [toast, setToast] = useState(null);

  // ── EFFECTS ──
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (callActive) {
      callTimer.current = setInterval(() => setCallSeconds(s => s + 1), 1000);
    } else {
      clearInterval(callTimer.current);
      setCallSeconds(0);
    }
    return () => clearInterval(callTimer.current);
  }, [callActive]);

  useEffect(() => {
    if (playing) {
      musicTimer.current = setInterval(() => {
        setProgress(p => {
          if (p >= TRACKS[trackIdx].duration) {
            nextTrack(); return 0;
          }
          return p + 1;
        });
      }, 1000);
    } else {
      clearInterval(musicTimer.current);
    }
    return () => clearInterval(musicTimer.current);
  }, [playing, trackIdx]);

  // ── AUTH ──
  const handleAuth = () => {
    if (!email || !password) return showToast("⚠️", "Please fill all fields");
    const name = authTab === "signup" ? username : email.split("@")[0];
    setUser({ name, email, emoji: "🎵" });
    setScreen("app");
    showToast("👋", "Welcome to Jam, " + name + "!");
  };

  // ── TOAST ──
  const showToast = (icon, msg) => {
    setToast({ icon, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // ── SEND MESSAGE (AI-powered) ──
  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;
    const text = inputText.trim();
    setInputText("");
    const fid = activeFriend.id;
    const newMsg = { id: Date.now(), from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => ({ ...prev, [fid]: [...(prev[fid] || []), newMsg] }));

    setIsTyping(true);
    setLoading(true);
    try {
      const history = (messages[fid] || []).slice(-6).map(m => ({ role: m.from === "me" ? "user" : "assistant", content: m.text }));
      history.push({ role: "user", content: text });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ${activeFriend.name}, a cool friend on a social app called Jam. You're casual, fun, and use emojis occasionally. Keep replies short (1-3 sentences). Current status: \"${activeFriend.statusText}\". Be in character.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "lol 😂";
      setIsTyping(false);
      setMessages(prev => ({
        ...prev,
        [fid]: [...(prev[fid] || []), { id: Date.now() + 1, from: "them", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]
      }));
    } catch {
      setIsTyping(false);
      setMessages(prev => ({
        ...prev,
        [fid]: [...(prev[fid] || []), { id: Date.now() + 1, from: "them", text: "hey can't talk rn, ttyl! 👋", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]
      }));
    }
    setLoading(false);
  };

  // ── MUSIC ──
  const nextTrack = () => { setTrackIdx(i => (i + 1) % TRACKS.length); setProgress(0); };
  const prevTrack = () => { setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };

  // ── TIC TAC TOE ──
  const checkWinner = (b) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,c,d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    if (b.every(Boolean)) return "draw";
    return null;
  };
  const handleTTT = (i) => {
    if (board[i] || tttWinner) return;
    const nb = [...board]; nb[i] = xTurn ? "❌" : "⭕";
    setBoard(nb);
    const w = checkWinner(nb);
    if (w) { setTttWinner(w); return; }
    setXTurn(!xTurn);
    // AI move
    setTimeout(() => {
      const empty = nb.map((v,idx) => v ? null : idx).filter(v => v !== null);
      if (!empty.length) return;
      const ai = empty[Math.floor(Math.random() * empty.length)];
      const nb2 = [...nb]; nb2[ai] = "⭕";
      setBoard(nb2);
      const w2 = checkWinner(nb2);
      if (w2) setTttWinner(w2);
      else setXTurn(true);
    }, 500);
  };

  // ── POST LIKE ──
  const toggleLike = (id) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post));
  };

  // ── RENDER AUTH ──
  if (screen === "auth") return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="mesh" /><div className="noise" />
        <div className="auth">
          <div className="auth-card">
            <div className="logo">J<span>a</span>m</div>
            <p className="tagline">Your world, together. Music · Watch · Play · Connect.</p>
            <div className="tabs">
              <button className={`tab-btn ${authTab === "login" ? "active" : ""}`} onClick={() => setAuthTab("login")}>Sign In</button>
              <button className={`tab-btn ${authTab === "signup" ? "active" : ""}`} onClick={() => setAuthTab("signup")}>Create Account</button>
            </div>
            {authTab === "signup" && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" placeholder="your cool username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
            </div>
            <button className="btn-primary" onClick={handleAuth}>{authTab === "login" ? "Sign In to Jam 🎵" : "Create Account 🚀"}</button>
            <div className="divider"><div className="divider-line" /><span className="divider-text">or continue with</span><div className="divider-line" /></div>
            <div className="social-login">
              <button className="social-btn" onClick={() => { setEmail("demo@jam.app"); setPassword("demo"); setTimeout(handleAuth, 100); }}>🎵 Spotify</button>
              <button className="social-btn" onClick={() => { setEmail("demo@jam.app"); setPassword("demo"); setTimeout(handleAuth, 100); }}>▶ YouTube</button>
              <button className="social-btn" onClick={() => { setEmail("demo@jam.app"); setPassword("demo"); setTimeout(handleAuth, 100); }}>🍎 Apple</button>
            </div>
          </div>
        </div>
        {toast && <div className="toast"><span className="toast-icon">{toast.icon}</span>{toast.msg}</div>}
      </div>
    </>
  );

  // ── RENDER APP ──
  const curMsgs = messages[activeFriend.id] || [];
  const track = TRACKS[trackIdx];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="mesh" /><div className="noise" />

        <div className="main">
          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sidebar-logo">J</div>
            <button className={`nav-btn ${activeNav === "discover" ? "active" : ""}`} title="Discover" onClick={() => setActiveNav("discover")}>🌍</button>
            <button className={`nav-btn ${activeNav === "chat" ? "active" : ""}`} title="Chat" onClick={() => setActiveNav("chat")}>
              💬<span className="badge" />
            </button>
            <button className={`nav-btn ${activeNav === "jam" ? "active" : ""}`} title="Jam Room" onClick={() => setActiveNav("jam")}>🎵</button>
            <button className={`nav-btn ${activeNav === "games" ? "active" : ""}`} title="Games" onClick={() => setActiveNav("games")}>🎮</button>
            <button className={`nav-btn ${activeNav === "watch" ? "active" : ""}`} title="Watch Together" onClick={() => setActiveNav("watch")}>🎬</button>
            <div className="sidebar-spacer" />
            <div className="avatar-sm" title={user?.name}>
              <div style={{ width:"100%",height:"100%",background:"var(--accent2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem" }}>{user?.emoji}</div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">
            {/* ── CHAT ── */}
            {activeNav === "chat" && (
              <>
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Messages</span>
                    <button className="icon-btn" onClick={() => showToast("✉️","New message")}>✏️</button>
                  </div>
                  <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search friends..." />
                  </div>
                  <div className="friend-list">
                    {FRIENDS.map(f => (
                      <div key={f.id} className={`friend-item ${activeFriend.id === f.id ? "active" : ""}`} onClick={() => setActiveFriend(f)}>
                        <div className="avatar">
                          <div className="avatar-img">{f.emoji}</div>
                          <span className={`status-dot ${f.status}`} />
                        </div>
                        <div className="friend-info">
                          <div className="friend-name">{f.name}</div>
                          <div className="friend-status">{f.statusText}</div>
                        </div>
                        <div className="friend-time">{f.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chat-main">
                  <div className="chat-header">
                    <div className="avatar">
                      <div className="avatar-img" style={{fontSize:"1.3rem"}}>{activeFriend.emoji}</div>
                      <span className={`status-dot ${activeFriend.status}`} />
                    </div>
                    <div className="chat-header-info">
                      <div className="chat-header-name">{activeFriend.name}</div>
                      <div className="chat-header-status">{activeFriend.status === "online" ? "● Online" : activeFriend.status === "away" ? "◌ Away" : "○ Offline"}</div>
                    </div>
                    <div className="chat-actions">
                      <button className="action-btn" title="Voice Call" onClick={() => { setCallActive(true); showToast("📞", `Calling ${activeFriend.name}...`); }}>📞</button>
                      <button className="action-btn" title="Video Call" onClick={() => { setCallActive(true); setCallVideo(true); showToast("📹", `Video call with ${activeFriend.name}`); }}>📹</button>
                      <button className="action-btn" title="Start Jam" onClick={() => { setActiveNav("jam"); showToast("🎵","Jam room opened!"); }}>🎵</button>
                      <button className="action-btn" title="Play Game" onClick={() => { setActiveNav("games"); }}>🎮</button>
                    </div>
                  </div>

                  <div className="messages">
                    {curMsgs.map(msg => (
                      <div key={msg.id} className={`msg-group ${msg.from === "me" ? "mine" : ""}`}>
                        {msg.from !== "me" && <div className="msg-avatar">{activeFriend.emoji}</div>}
                        <div className="msg-content">
                          <div className={`msg-bubble ${msg.from === "me" ? "mine" : ""}`}>{msg.text}</div>
                          <div className="msg-time">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="msg-group">
                        <div className="msg-avatar">{activeFriend.emoji}</div>
                        <div className="msg-content">
                          <div className="typing-indicator">
                            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="chat-input-area">
                    <div className="chat-input-row">
                      <button className="attach-btn" onClick={() => showToast("📎","Attach feature coming soon")}>📎</button>
                      <textarea
                        className="chat-input"
                        placeholder={`Message ${activeFriend.name}...`}
                        rows={1}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      />
                      <button className="send-btn" onClick={sendMessage} disabled={loading || !inputText.trim()}>➤</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── JAM ROOM ── */}
            {activeNav === "jam" && (
              <div className="jam-room">
                <div className="jam-hero">
                  <div>
                    <div className="jam-hero-title">🎵 <span>Jam</span> Room</div>
                    <p style={{color:"var(--muted)",fontSize:"0.85rem",marginTop:"6px"}}>Listen together in real time</p>
                  </div>
                </div>

                <div style={{padding:"0 32px",marginBottom:"16px",marginTop:"24px"}}>
                  <div className="section-title">Connect a Source</div>
                  <div className="source-cards">
                    {["Spotify","YouTube"].map(src => (
                      <div key={src} className={`source-card ${activeSource===src?"active":""}`} onClick={() => { setActiveSource(src); showToast(src==="Spotify"?"🎵":"▶",`Connected to ${src}`); }}>
                        <div className="source-icon">{src==="Spotify"?"🎵":"▶"}</div>
                        <div className="source-name">{src}</div>
                        <div className="source-desc">{src==="Spotify"?"Stream any song":"Play any video"}</div>
                      </div>
                    ))}
                    <div className="source-card" onClick={() => showToast("📻","Radio coming soon!")}>
                      <div className="source-icon">📻</div>
                      <div className="source-name">Radio</div>
                      <div className="source-desc">Live stations</div>
                    </div>
                  </div>
                </div>

                <div className="music-player">
                  <div className="section-title">Now Playing · {activeSource}</div>
                  <div className="now-playing">
                    <div className="track-art" style={{background: playing ? "linear-gradient(135deg,var(--accent),var(--accent2))" : "var(--surface2)", transition:"background 0.5s"}}>{track.emoji}</div>
                    <div className="track-info">
                      <div className="track-name">{track.title}</div>
                      <div className="track-artist">{track.artist}</div>
                      <div className="track-source">via {track.source}</div>
                    </div>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width:`${(progress/track.duration)*100}%`}} />
                    </div>
                    <div className="progress-times"><span>{fmt(progress)}</span><span>{fmt(track.duration)}</span></div>
                  </div>
                  <div className="player-controls">
                    <button className="ctrl-btn" onClick={() => showToast("🔀","Shuffle on")}>🔀</button>
                    <button className="ctrl-btn" onClick={prevTrack}>⏮</button>
                    <button className="ctrl-btn play-pause" onClick={() => setPlaying(p => !p)}>{playing ? "⏸" : "▶"}</button>
                    <button className="ctrl-btn" onClick={nextTrack}>⏭</button>
                    <button className="ctrl-btn" onClick={() => showToast("🔁","Repeat on")}>🔁</button>
                  </div>
                  <div className="listeners">
                    <div className="listener-avatars">
                      {["🌟","🎮","🔥"].map((e,i) => <div key={i} className="listener-av">{e}</div>)}
                    </div>
                    <span className="listeners-text">Zara, Leo and Kai are listening</span>
                  </div>
                </div>

                <div style={{padding:"0 32px",marginBottom:"16px"}}>
                  <div className="section-title">Queue</div>
                  {TRACKS.map((t,i) => (
                    <div key={i} onClick={() => { setTrackIdx(i); setProgress(0); setPlaying(true); }} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px",borderRadius:"12px",cursor:"pointer",background:i===trackIdx?"var(--accent)15":"transparent",marginBottom:"4px",transition:"background 0.15s"}}>
                      <div style={{width:"36px",height:"36px",borderRadius:"8px",background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>{t.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"0.88rem",fontWeight:i===trackIdx?"600":"400",color:i===trackIdx?"var(--accent)":"var(--text)"}}>{t.title}</div>
                        <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{t.artist} · {t.source}</div>
                      </div>
                      <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{fmt(t.duration)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── GAMES ── */}
            {activeNav === "games" && (
              <div className="jam-room">
                <div className="jam-hero" style={{marginBottom:"24px"}}>
                  <div>
                    <div className="jam-hero-title">🎮 <span>Games</span></div>
                    <p style={{color:"var(--muted)",fontSize:"0.85rem",marginTop:"6px"}}>Play with friends in real time</p>
                  </div>
                </div>
                <div style={{padding:"0 32px",marginBottom:"8px"}}><div className="section-title">Available Games</div></div>
                <div className="games-grid">
                  {GAMES.map(g => (
                    <div key={g.id} className="game-card" onClick={() => { if (g.id === "ttt") { setGame("ttt"); setBoard(Array(9).fill(null)); setXTurn(true); setTttWinner(null); } else showToast("🎮", `${g.name} coming soon!`); }}>
                      <div className="game-icon">{g.icon}</div>
                      <div className="game-name">{g.name}</div>
                      <div className="game-players">{g.players}</div>
                      <div className="game-badge" style={{background:`${g.color}22`,color:g.color}}>{g.badge}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"0 32px",marginTop:"8px"}}>
                  <div className="section-title">Leaderboard</div>
                  {FRIENDS.slice(0,4).map((f,i) => (
                    <div key={f.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 8px",borderRadius:"12px",marginBottom:"4px",background:"var(--surface)",border:"1px solid var(--border)"}}>
                      <div style={{width:"24px",textAlign:"center",fontFamily:"Syne",fontWeight:"700",color:i===0?"var(--accent)":i===1?"#94a3b8":i===2?"#cd7f32":"var(--muted)",fontSize:i===0?"1rem":"0.85rem"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
                      <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center"}}>{f.emoji}</div>
                      <div style={{flex:1,fontSize:"0.88rem",fontWeight:"500"}}>{f.name}</div>
                      <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>{[2840,2100,1870,1640][i]} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WATCH ── */}
            {activeNav === "watch" && (
              <div className="jam-room">
                <div className="jam-hero" style={{marginBottom:"24px"}}>
                  <div>
                    <div className="jam-hero-title">🎬 <span>Watch</span> Together</div>
                    <p style={{color:"var(--muted)",fontSize:"0.85rem",marginTop:"6px"}}>Sync movies & shows with friends</p>
                  </div>
                </div>
                <div className="watch-section">
                  <div className="section-title">Watch Parties</div>
                  {WATCH.map((w,i) => (
                    <div key={i} className="watch-card" style={{marginBottom:"12px"}} onClick={() => showToast("🎬",`Joining watch party: ${w.title}`)}>
                      <div className="watch-thumb" style={{fontSize:"4rem",background:`linear-gradient(135deg,#1a1a26,#0a0a0f)`}}>{w.emoji}</div>
                      <div className="watch-info">
                        <div className="watch-title">{w.live && <span className="watch-live">LIVE</span>}{w.title}</div>
                        <div className="watch-meta">{w.meta} {w.live && "· 12 watching"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="watch-section">
                  <div className="section-title">Add Your Own</div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <input style={{flex:1,padding:"11px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px",color:"var(--text)",fontFamily:"DM Sans",fontSize:"0.85rem",outline:"none"}} placeholder="Paste YouTube or streaming link..." />
                    <button className="btn-primary" style={{width:"auto",padding:"11px 18px",margin:0,borderRadius:"12px"}} onClick={() => showToast("🎬","Watch party created!")}>Start Party</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── DISCOVER ── */}
            {activeNav === "discover" && (
              <div className="feed">
                <div className="feed-header">
                  <div className="feed-title">Discover</div>
                  <button className="icon-btn">✨</button>
                </div>
                <div className="section-title">Stories</div>
                <div className="story-row">
                  <div className="story-item" onClick={() => showToast("➕","Your story")}>
                    <div className="story-ring"><div className="story-inner" style={{background:"var(--accent)20"}}>➕</div></div>
                    <span className="story-name">Your Story</span>
                  </div>
                  {FRIENDS.slice(0,5).map(f => (
                    <div key={f.id} className="story-item" onClick={() => showToast("👁️",`Viewing ${f.name}'s story`)}>
                      <div className="story-ring"><div className="story-inner">{f.emoji}</div></div>
                      <span className="story-name">{f.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
                <div className="section-title" style={{marginTop:"8px"}}>Feed</div>
                {posts.map(p => (
                  <div key={p.id} className="post-card">
                    <div className="post-head">
                      <div className="post-avatar">{p.emoji}</div>
                      <div className="post-meta">
                        <div className="post-author">{p.author}</div>
                        <div className="post-time">{p.time}</div>
                      </div>
                      <button className="icon-btn">···</button>
                    </div>
                    <div className="post-body">{p.body}</div>
                    {p.media && <div className="post-media">{p.media}</div>}
                    <div className="post-actions">
                      <button className={`post-action ${p.liked?"liked":""}`} onClick={() => toggleLike(p.id)}>{p.liked?"❤️":"🤍"} {p.likes}</button>
                      <button className="post-action" onClick={() => showToast("💬","Comments coming soon")}>💬 {p.comments}</button>
                      <button className="post-action" onClick={() => showToast("🔗","Link copied!")}>🔗 Share</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CALL OVERLAY ── */}
        {callActive && (
          <div className="call-overlay" onClick={e => e.target === e.currentTarget && setCallActive(false)}>
            <div className="call-card">
              <div className="call-avatar">{activeFriend.emoji}</div>
              <div className="call-name">{activeFriend.name}</div>
              <div className="call-status">{callVideo ? "Video Call" : "Voice Call"}</div>
              <div className="call-duration">{fmt(callSeconds)}</div>
              <div className="call-controls">
                <button className="call-btn mute" onClick={() => setCallMuted(m => !m)} title="Mute">{callMuted ? "🔇" : "🎙️"}</button>
                <button className="call-btn end" onClick={() => { setCallActive(false); setCallVideo(false); showToast("📞", "Call ended"); }} title="End Call">📵</button>
                <button className="call-btn video" onClick={() => setCallVideo(v => !v)} title="Toggle Video">{callVideo ? "📹" : "📷"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TTT OVERLAY ── */}
        {game === "ttt" && (
          <div className="ttt-overlay" onClick={e => e.target === e.currentTarget && setGame(null)}>
            <div className="ttt-card">
              <div className="ttt-title">⭕ Tic Tac Toe</div>
              <p style={{fontSize:"0.8rem",color:"var(--muted)",marginBottom:"4px"}}>You ❌ vs AI ⭕</p>
              <div className={`ttt-status ${tttWinner ? "ttt-win" : ""}`}>
                {tttWinner ? (tttWinner === "draw" ? "It's a draw! 🤝" : tttWinner === "❌" ? "You win! 🎉" : "AI wins! 🤖") : (xTurn ? "Your turn ❌" : "AI thinking...")}
              </div>
              <div className="ttt-board">
                {board.map((cell, i) => (
                  <button key={i} className={`ttt-cell ${cell === "❌" ? "x" : cell === "⭕" ? "o" : ""}`} onClick={() => handleTTT(i)} disabled={!!cell || !!tttWinner || !xTurn}>{cell}</button>
                ))}
              </div>
              <button className="btn-primary" style={{marginTop:"8px"}} onClick={() => { setBoard(Array(9).fill(null)); setXTurn(true); setTttWinner(null); }}>New Game 🔄</button>
              <button style={{width:"100%",marginTop:"8px",padding:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"10px",color:"var(--muted)",cursor:"pointer",fontFamily:"DM Sans"}} onClick={() => setGame(null)}>Close</button>
            </div>
          </div>
        )}

        {toast && <div className="toast"><span className="toast-icon">{toast.icon}</span>{toast.msg}</div>}
      </div>
    </>
  );
}

