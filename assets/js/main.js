// Intellia Kin — script partagé
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const burger = document.getElementById('burgerBtn');
  const mnav = document.getElementById('mnav');
  if (burger && mnav){
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('#mnav a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }));
  }

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Contact form (demo only — no backend)
  const cform = document.getElementById('cform');
  if (cform){
    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('formStatus').textContent = "Message prêt à être envoyé — connectez ce formulaire à votre messagerie pour l'activer.";
    });
  }

  // Hero network animation ("K-Node" motif)
  const canvas = document.getElementById('netcanvas');
  if (canvas){
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width * devicePixelRatio;
      h = canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const count = Math.max(14, Math.floor((rect.width * rect.height) / 46000));
      nodes = Array.from({length: count}, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.6 + 1) * devicePixelRatio
      }));
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      const linkDist = 150 * devicePixelRatio;
      for (let i=0; i<nodes.length; i++){
        const n = nodes[i];
        if (!reduceMotion){
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        for (let j=i+1; j<nodes.length; j++){
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < linkDist){
            ctx.strokeStyle = `rgba(0,201,167,${0.16 * (1 - dist/linkDist)})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes){
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,102,255,0.55)'; ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener('resize', () => { resize(); if(reduceMotion) draw(); });
  }
});

/* ============================================================
   OUTIL DE DIAGNOSTIC IA — basé sur la Fiche de Découverte
   ============================================================ */
const DIAG_QUESTIONS = [
  {
    key: 'profil',
    q: "Quel type d'organisation représentez-vous ?",
    opts: [
      { label: "Une PME ou une entreprise établie", val: 'pme' },
      { label: "Une startup ou un projet entrepreneurial", val: 'entrepreneur' },
      { label: "Je suis étudiant(e) ou jeune diplômé(e)", val: 'etudiant' },
      { label: "Une institution publique ou une ONG", val: 'institution' }
    ]
  },
  {
    key: 'usage_ia',
    q: "Utilisez-vous déjà des outils d'intelligence artificielle ?",
    opts: [
      { label: "Non, jamais", val: 'non' },
      { label: "Un peu, de façon occasionnelle", val: 'occasionnel' },
      { label: "Oui, régulièrement", val: 'regulier' },
      { label: "Je ne sais pas trop ce que ça change", val: 'inconnu' }
    ]
  },
  {
    key: 'difficulte',
    q: "Quelle est votre principale difficulté aujourd'hui ?",
    opts: [
      { label: "Des tâches répétitives qui prennent trop de temps", val: 'automatisation' },
      { label: "Un manque de compétences en interne", val: 'competences' },
      { label: "Je ne sais pas identifier les bons cas d'usage", val: 'cas_usage' },
      { label: "Je veux former mes équipes ou moi-même", val: 'formation' }
    ]
  },
  {
    key: 'objectif',
    q: "Quel résultat recherchez-vous en priorité ?",
    opts: [
      { label: "Gagner du temps et réduire les coûts", val: 'gain_temps' },
      { label: "Être conseillé avant de me lancer", val: 'conseil' },
      { label: "Être formé(e) ou former mes équipes", val: 'formation' },
      { label: "Réaliser un projet déjà identifié", val: 'projet' }
    ]
  }
];

const DIAG_RESULTS = {
  academie: {
    tag: "Notre recommandation",
    title: "L'Académie de l'Intelligence Artificielle",
    text: "Votre priorité est de monter en compétences — sur vous-même ou vos équipes — avant d'aller plus loin. C'est exactement l'objectif de notre Académie : des formations courtes et pratiques, une reconversion professionnelle, ou un programme d'insertion pour les jeunes diplômés.",
    link: "academie.html",
    linktext: "Découvrir l'Académie de l'IA"
  },
  conseil: {
    tag: "Notre recommandation",
    title: "Le Conseil en Intelligence Artificielle",
    text: "Vous avez besoin d'y voir clair avant d'agir. Notre pôle Conseil commence par un audit de votre maturité numérique, un diagnostic de vos processus, puis une feuille de route priorisée et réaliste pour votre organisation.",
    link: "conseil.html",
    linktext: "Découvrir le Conseil en IA"
  },
  accompagnement: {
    tag: "Notre recommandation",
    title: "L'Accompagnement de projets",
    text: "Vous avez déjà une idée ou un projet en tête. Notre pôle Accompagnement des projets vous aide à choisir les bons outils, gérer le changement dans vos équipes et mesurer les résultats après la mise en œuvre.",
    link: "accompagnement.html",
    linktext: "Découvrir l'accompagnement de projets"
  }
};

function diagRecommend(answers){
  if (answers.objectif === 'formation' || answers.difficulte === 'formation' || answers.profil === 'etudiant') return DIAG_RESULTS.academie;
  if (answers.objectif === 'projet') return DIAG_RESULTS.accompagnement;
  if (answers.difficulte === 'competences' || answers.difficulte === 'cas_usage' || answers.objectif === 'conseil' || answers.usage_ia === 'non' || answers.usage_ia === 'inconnu') return DIAG_RESULTS.conseil;
  return DIAG_RESULTS.conseil;
}

function initDiagnostic(){
  const root = document.getElementById('diagRoot');
  if (!root) return;
  let current = 0;
  const answers = {};
  const stepsEl = root.querySelectorAll('.diag-step');
  const progressBar = root.querySelector('.diag-progress-bar');
  const backBtn = root.querySelector('.diag-back');
  const resultEl = root.querySelector('.diag-result');

  function renderProgress(){
    progressBar.style.width = ((current) / DIAG_QUESTIONS.length) * 100 + '%';
    backBtn.disabled = current === 0;
  }

  function selectOption(qKey, val, optEl){
    answers[qKey] = val;
    optEl.parentElement.querySelectorAll('.diag-opt').forEach(o => o.classList.remove('selected'));
    optEl.classList.add('selected');
    setTimeout(() => {
      if (current < DIAG_QUESTIONS.length - 1){
        stepsEl[current].classList.remove('active');
        current++;
        stepsEl[current].classList.add('active');
        renderProgress();
      } else {
        stepsEl[current].classList.remove('active');
        showResult();
      }
    }, 220);
  }

  function showResult(){
    progressBar.style.width = '100%';
    const rec = diagRecommend(answers);
    resultEl.querySelector('.rtag').textContent = rec.tag;
    resultEl.querySelector('h2').textContent = rec.title;
    resultEl.querySelector('p').textContent = rec.text;
    const link = resultEl.querySelector('.diag-cta-link');
    link.href = rec.link;
    link.textContent = rec.linktext;
    resultEl.classList.add('active');
  }

  backBtn.addEventListener('click', () => {
    if (current === 0) return;
    stepsEl[current].classList.remove('active');
    current--;
    stepsEl[current].classList.add('active');
    renderProgress();
  });

  DIAG_QUESTIONS.forEach((q, i) => {
    const opts = stepsEl[i].querySelectorAll('.diag-opt');
    opts.forEach(optEl => {
      optEl.addEventListener('click', () => selectOption(q.key, optEl.dataset.val, optEl));
    });
  });

  renderProgress();
}
document.addEventListener('DOMContentLoaded', initDiagnostic);