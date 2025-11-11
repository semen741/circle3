const tg = window.Telegram?.WebApp;
const params = new URLSearchParams(window.location.search);
const file_id = params.get('file_id');
const chat_id = Number(params.get('chat_id')) || undefined;

const apiBase = (window.location.origin.replace(/:\d+$/, '')) + '/api'; // на проде будет /api

async function postJSON(url, data) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!r.ok) throw new Error('API error');
  return r.json();
}

document.getElementById('go').onclick = async () => {
  const start = Number(document.getElementById('start').value);
  const end = Number(document.getElementById('end').value);
  const body = {
    file_id,
    chat_id,
    start_time: start,
    end_time: end,
    effects: { mute: document.getElementById('mute').checked, contrast: Number(document.getElementById('contrast').value), blur: Number(document.getElementById('blur').value) }
  };
  try {
    const { job_id } = await postJSON(apiBase + '/process', body);
    if (tg) { tg.close(); }
    alert('Задача поставлена: ' + job_id);
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
};
