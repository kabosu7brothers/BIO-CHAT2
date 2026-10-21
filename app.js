import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://sdorkxwgzdynyjnkmpzi.supabase.co/rest/v1/'; // 自分のURL
const SUPABASE_ANON_KEY = 'sb_publishable_Mttjc-U-xVtUP9hYBblLdA_jQpHrUUN'; // 自分のAnon Key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 質問一覧表示
async function loadQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const list = document.getElementById('question-list');
  list.innerHTML = '';
  data.forEach(q => {
      const div = document.createElement('div');
  div.classList.add('question-card');
  div.innerHTML = `
    <a href="question.html?id=${q.id}" class="question-title">${q.title}</a>
    <p class="asker">質問者: ${q.asker}</p>
  `;
  list.appendChild(div);
});
}

// 質問投稿
async function postQuestion() {
  const title = document.getElementById('question-title').value.trim();
  const body = document.getElementById('question-body').value.trim();
  const asker = document.getElementById('asker-name').value.trim();
  if (!title || !body || !asker) return alert("全て入力してください");

  const { error } = await supabase
    .from('questions')
    .insert([{ title, body, asker }]);

  if (error) console.error(error);
  else loadQuestions();
}

// 質問詳細表示
async function loadQuestionDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return console.error(error);

  const detailDiv = document.getElementById('question-detail');
  detailDiv.classList.add('question-card');
  detailDiv.innerHTML =
    `<h1>${data.title}</h1><p>${data.body}</p><p>質問者: ${data.asker}</p>`;

  loadAnswers(id);
}

// 回答一覧表示
async function loadAnswers(questionId) {
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true });

  if (error) return console.error(error);

  const list = document.getElementById('answer-list');
  list.innerHTML = '';
  data.forEach(a => {
     const div = document.createElement('div');
  div.classList.add('answer-card');
  div.innerHTML = `
    <p>${a.body}</p>
    <p class="responder">回答者: ${a.responder}</p>
  `;
  list.appendChild(div);
});
}

// 回答投稿
async function postAnswer() {
  const params = new URLSearchParams(window.location.search);
  const questionId = params.get('id');
  const body = document.getElementById('answer-body').value.trim();
  const responder = document.getElementById('responder-name').value.trim();
  if (!body || !responder) return alert("全て入力してください");

  const { error } = await supabase
    .from('answers')
    .insert([{ question_id: questionId, body, responder }]);

  if (error) console.error(error);
  else loadAnswers(questionId);
}

// ページ判定
if (document.getElementById('question-list')) {
  loadQuestions();
  document.getElementById('post-question').addEventListener('click', postQuestion);
}
if (document.getElementById('question-detail')) {
  loadQuestionDetail();
  document.getElementById('post-answer').addEventListener('click', postAnswer);
}
