const $=(id)=>document.getElementById(id);
const state={dashboard:null,sources:[]};

const EXAMS={
  ENARE:{
    label:"ENARE — Enfermagem",
    search:"ENARE Enfermagem",
    focus:"Residência multiprofissional/uniprofissional",
    topics:["SAE e Processo de Enfermagem","SUS e Saúde Coletiva","Semiologia e Semiotécnica","Fundamentos de Enfermagem","Urgência e Emergência","Saúde do Adulto e Idoso","Saúde da Mulher","Saúde da Criança","Epidemiologia e Vigilância","Segurança do Paciente"]
  },
  EBSERH:{
    label:"EBSERH — Enfermagem",
    search:"EBSERH Enfermagem Área Assistencial",
    focus:"Concurso hospitalar da rede HU Brasil",
    topics:["Conhecimentos Específicos","SUS e Legislação em Saúde","Legislação EBSERH","Segurança do Paciente","Urgência e UTI","Controle de Infecção","Processo de Enfermagem","Português","Farmacologia","CME"]
  },
  MINISTERIO_SAUDE:{
    label:"Ministério da Saúde — Enfermagem/Saúde",
    search:"Ministério da Saúde concurso enfermagem CPNU",
    focus:"Concursos e seleções do Ministério da Saúde",
    topics:["SUS e Legislação","Políticas Públicas de Saúde","PNAB e Atenção Primária","Epidemiologia e Vigilância","Redes de Atenção","Conhecimentos de Enfermagem","Urgência e Emergência","Segurança do Paciente","Ética e Legislação","Gestão em Saúde"]
  }
};

function esc(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

async function api(url,options={}){
  const response=await fetch(url,{
    credentials:"same-origin",
    ...options,
    headers:{
      ...(options.body?{"Content-Type":"application/json"}:{}),
      ...(options.headers||{})
    }
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||"Não foi possível concluir esta ação.");
  return data;
}

function splitTerms(value){
  return String(value||"").split(",").map((item)=>item.trim()).filter(Boolean).slice(0,12);
}

function fmtDate(value){
  if(!value) return "";
  return new Date(value).toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"short"});
}

function actionForTask(task){
  const tema=encodeURIComponent(task.tema||"");
  if(task.tipo==="TEORIA") return {label:"Abrir aula",href:"/aulas?q="+tema};
  if(task.tipo==="QUESTOES") return {label:"Praticar",href:"/questoes?tema="+tema};
  if(task.tipo==="REVISAO") return {label:"Revisar",href:"/flashcards?tema="+tema};
  if(task.tipo==="SIMULADO") return {label:"Simulado",href:"/simulado"};
  return null;
}

function sourceCard(source){
  const badge=source.oficial
    ? '<span class="source-badge">FONTE OFICIAL</span>'
    : '<span class="source-badge reference">REFERÊNCIA DE ESTRUTURA</span>';
  return `<article class="source-card">
    <div>
      ${badge}
      <strong>${esc(source.titulo||source.title)}</strong>
      <span>${esc(source.dominio||source.domain||"")} ${source.pdf?"· PDF":""}</span>
    </div>
    <a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte</a>
  </article>`;
}

function taskCard(task){
  const action=actionForTask(task);
  return `<article class="task-card ${task.concluida?"done":""}" data-task-id="${task.id}">
    <div class="task-type"><span>${esc(task.tipo)}</span><small>${task.duracaoMinutos?task.duracaoMinutos+" min":""}</small></div>
    <h3>${esc(task.titulo)}</h3>
    <p>${esc(task.tema||"Recuperação")}</p>
    <div class="task-actions">
      ${action?`<a href="${action.href}">${action.label}</a>`:""}
      ${task.tipo!=="DESCANSO"?`<button type="button" class="primary" data-complete-task="${task.id}">${task.concluida?"Desmarcar":"Concluir"}</button>`:""}
    </div>
  </article>`;
}

function bindTaskButtons(root){
  root?.querySelectorAll("[data-complete-task]").forEach((button)=>{
    button.addEventListener("click",async ()=>{
      const id=Number(button.dataset.completeTask);
      const task=[...(state.dashboard?.todayTasks||[]),...(state.dashboard?.upcoming||[])].find((item)=>item.id===id);
      if(!task) return;
      button.disabled=true;
      try{
        await api("/api/cronograma/task",{method:"PATCH",body:JSON.stringify({taskId:id,completed:!task.concluida,progress:task.concluida?0:100})});
        await loadDashboard();
      }finally{
        button.disabled=false;
      }
    });
  });
}

function groupUpcoming(items){
  const map=new Map();
  for(const item of items||[]){
    const key=new Date(item.data).toISOString().slice(0,10);
    if(!map.has(key)) map.set(key,[]);
    map.get(key).push(item);
  }
  return Array.from(map.entries()).slice(0,12);
}

function renderDashboard(data){
  state.dashboard=data;
  if(!data.schedule){
    $("scheduleDashboard").hidden=true;
    $("scheduleEmpty").hidden=false;
    return;
  }

  $("scheduleEmpty").hidden=true;
  $("scheduleDashboard").hidden=false;

  const schedule=data.schedule;
  const stats=data.stats||{};
  $("activeExam").textContent=schedule.prova;
  const meta=[];
  if(schedule.dataProva) meta.push("Prova: "+new Date(schedule.dataProva).toLocaleDateString("pt-BR"));
  meta.push(schedule.horasPorDia+"h/dia");
  meta.push(schedule.diasPorSemana+" dias/semana");
  if(schedule.tipoProva) meta.unshift(schedule.tipoProva==="MINISTERIO_SAUDE"?"MINISTÉRIO DA SAÚDE":schedule.tipoProva);
  $("activeExamMeta").textContent=meta.join(" · ");

  const strategy=schedule.estrategia||{};
  $("strategyTitle").textContent=strategy.provaBase||"Plano inteligente";
  $("strategyFocus").textContent=strategy.foco||"O plano combina matriz da prova, fontes oficiais, seu desempenho e o tempo restante.";
  $("strategyPhases").innerHTML=(strategy.fases||["BASE","CONSOLIDAÇÃO","RETA FINAL"]).map((phase)=>'<span>'+esc(String(phase).replaceAll("_"," "))+'</span>').join("");
  const weakness=Array.isArray(strategy.fraquezasDetectadas)?strategy.fraquezasDetectadas.slice(0,5):[];
  $("strategyWeakness").innerHTML=weakness.length
    ? '<strong>Prioridade pelo seu histórico:</strong> '+weakness.map((item)=>esc(item.tema)+' ('+Math.round(Number(item.erro||0)*100)+'% de erro)').join(" · ")
    : '<strong>Histórico:</strong> ainda sem volume suficiente de questões para ajustar por taxa de erro.';

  $("mainProgressValue").textContent=(stats.percent||0)+"%";
  $("mainProgressBar").style.width=(stats.percent||0)+"%";
  $("mainProgressText").textContent=(stats.completed||0)+" de "+(stats.total||0)+" tarefas concluídas";
  $("todayScore").textContent=(stats.todayCompleted||0)+"/"+(stats.todayTotal||0);

  if(schedule.dataProva){
    const days=Math.max(0,Math.ceil((new Date(schedule.dataProva).getTime()-Date.now())/86400000));
    $("countdownValue").textContent=String(days);
    $("countdownLabel").textContent=days===1?"dia restante":"dias restantes";
  }else{
    $("countdownValue").textContent="—";
    $("countdownLabel").textContent="sem data definida";
  }

  $("todayDateLabel").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
  const today=data.todayTasks||[];
  $("todayTasks").innerHTML=today.length?today.map(taskCard).join(""):'<div class="research-status">Hoje é um dia livre ou de recuperação. Use o tempo para descansar ou revisar algo leve.</div>';
  bindTaskButtons($("todayTasks"));

  const groups=groupUpcoming(data.upcoming||[]);
  $("upcomingSchedule").innerHTML=groups.length?groups.map(([date,tasks])=>`
    <div class="timeline-day">
      <div class="timeline-date"><strong>${fmtDate(date+"T12:00:00")}</strong><span>${tasks.length} ${tasks.length===1?"tarefa":"tarefas"}</span></div>
      <div class="timeline-tasks">${tasks.map(taskCard).join("")}</div>
    </div>
  `).join(""):'<div class="research-status">Nenhuma tarefa futura.</div>';
  bindTaskButtons($("upcomingSchedule"));

  $("activeSources").innerHTML=(schedule.fontes||[]).length
    ? schedule.fontes.slice(0,10).map(sourceCard).join("")
    : '<div class="research-status">Este plano não possui fontes salvas.</div>';
}

async function loadDashboard(){
  try{
    renderDashboard(await api("/api/cronograma/dashboard"));
  }catch(error){
    console.error(error);
  }
}

async function researchExam(prova){
  const status=$("researchStatus");
  const sources=$("researchSources");
  status.hidden=false;
  status.className="research-status busy";
  status.textContent="Pesquisando editais, provas e fontes institucionais…";
  sources.hidden=true;
  sources.innerHTML="";

  const result=await api("/api/cronograma/research?q="+encodeURIComponent(prova));
  state.sources=result.items||[];

  status.className="research-status";
  status.textContent=state.sources.length
    ? state.sources.length+" fontes e referências encontradas. Editais oficiais definem o conteúdo; referências de estrutura ajudam a organizar ciclos e revisões."
    : "Nenhuma fonte oficial indexada foi encontrada agora. O Córtex usará a matriz base da prova e seu desempenho.";

  if(state.sources.length){
    sources.hidden=false;
    sources.innerHTML=state.sources.slice(0,8).map((item)=>sourceCard({
      ...item,
      titulo:item.title,
      dominio:item.domain
    })).join("");
  }
}

function selectedExam(){
  const type=$("examType").value;
  const exam=EXAMS[type]||EXAMS.ENARE;
  const edition=$("examEdition").value.trim();
  return {type,exam,prova:exam.label+(edition?" · "+edition:"")};
}

function renderExamBlueprint(){
  const {exam}=selectedExam();
  $("examBlueprint").innerHTML=
    '<div><span>MATRIZ DE ESTUDO</span><strong>'+esc(exam.focus)+'</strong></div>'+
    '<div class="exam-topic-list">'+exam.topics.map((topic)=>'<span>'+esc(topic)+'</span>').join("")+'</div>';
}

async function buildSchedule(event){
  event.preventDefault();
  const button=$("buildScheduleButton");
  const selected=selectedExam();
  const prova=selected.prova;
  button.disabled=true;
  const original=button.innerHTML;
  button.innerHTML="<b>Construindo plano…</b><small>pesquisa + pesos + desempenho</small>";

  try{
    await researchExam(selected.exam.search+" "+($("examEdition").value.trim()||""));
    await api("/api/cronograma/generate",{
      method:"POST",
      body:JSON.stringify({
        prova,
        tipoProva:selected.type,
        dataProva:$("examDate").value||null,
        horasPorDia:Number($("hoursPerDay").value||2),
        diasPorSemana:Number($("daysPerWeek").value||6),
        nivel:$("knowledgeLevel").value,
        dificuldades:splitTerms($("difficulties").value),
        prioridades:splitTerms($("priorities").value),
        sources:state.sources
      })
    });
    await loadDashboard();
    $("scheduleDashboard").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    $("researchStatus").hidden=false;
    $("researchStatus").className="research-status";
    $("researchStatus").textContent=error.message;
  }finally{
    button.disabled=false;
    button.innerHTML=original;
  }
}

function setDefaultDate(){
  const input=$("examDate");
  if(!input.value){
    const date=new Date();
    date.setDate(date.getDate()+90);
    input.value=date.toISOString().slice(0,10);
  }
}

$("scheduleForm").addEventListener("submit",buildSchedule);
$("examType").addEventListener("change",renderExamBlueprint);
$("examEdition").addEventListener("input",renderExamBlueprint);
$("newPlanButton").addEventListener("click",()=>{
  $("scheduleDashboard").hidden=true;
  $("scheduleEmpty").hidden=false;
  $("scheduleEmpty").scrollIntoView({behavior:"smooth",block:"start"});
});
setDefaultDate();
renderExamBlueprint();
loadDashboard();

const params=new URLSearchParams(location.search);
if(params.get("prova")){
  const incoming=params.get("prova").toUpperCase();
  if(incoming.includes("EBSERH")) $("examType").value="EBSERH";
  else if(incoming.includes("MINIST")||incoming.includes("CPNU")) $("examType").value="MINISTERIO_SAUDE";
  else $("examType").value="ENARE";
  $("examEdition").value=params.get("prova");
  renderExamBlueprint();
}
