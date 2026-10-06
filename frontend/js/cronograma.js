const $=(id)=>document.getElementById(id);
const state={
  dashboard:null,
  calendar:null,
  calendarCursor:null,
  selectedCalendarDay:null
};

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
  if(task.tipo==="QUESTOES") return {label:"Fazer questões",href:"/questoes?tema="+tema};
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

function taskGoal(task){
  if(task.tipo==="QUESTOES") return "Meta: "+Number(task.metaValor||10)+" questões";
  if(task.tipo==="SIMULADO") return "Meta: "+Number(task.metaValor||25)+" questões";
  if(task.tipo==="DESCANSO") return "Recuperação";
  return "Meta: "+Number(task.duracaoMinutos||task.metaValor||0)+" min";
}

function taskCard(task){
  const action=actionForTask(task);
  const topic=task.tema||"Descanso e recuperação";
  return `<article class="task-card ${task.concluida?"done":""}" data-task-id="${task.id}">
    <div class="task-type"><span>${esc(task.tipo)}</span><small>${esc(taskGoal(task))}</small></div>
    <h3>${esc(topic)}</h3>
    <p>${esc(task.titulo||"Atividade programada")}</p>
    <div class="task-actions">
      ${action?`<a href="${action.href}">${action.label}</a>`:""}
      ${task.tipo!=="DESCANSO"?`<button type="button" class="primary" data-complete-task="${task.id}">${task.concluida?"Desmarcar":"Concluir"}</button>`:""}
    </div>
  </article>`;
}

function bindTaskLinks(root){
  root?.querySelectorAll(".task-actions a").forEach((link)=>{
    link.addEventListener("click",(event)=>{
      if(
        event.defaultPrevented ||
        event.button > 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const href=link.getAttribute("href");
      if(!href || window.parent===window) return;

      try{
        if(typeof window.parent.CortexShellNavigate==="function"){
          event.preventDefault();
          window.parent.CortexShellNavigate(href);
        }
      }catch{}
    });
  });
}

function findTaskById(id){
  const dashboardTasks=[
    ...(state.dashboard?.todayTasks||[]),
    ...(state.dashboard?.week?.tasks||[])
  ];
  const calendarTasks=state.calendar?.tasks||[];
  return [...dashboardTasks,...calendarTasks].find((item)=>Number(item.id)===Number(id));
}

function bindTaskButtons(root){
  root?.querySelectorAll("[data-complete-task]").forEach((button)=>{
    button.addEventListener("click",async ()=>{
      const id=Number(button.dataset.completeTask);
      const task=findTaskById(id);
      if(!task) return;
      button.disabled=true;
      try{
        const completed=!task.concluida;
        await api("/api/cronograma/task",{method:"PATCH",body:JSON.stringify({taskId:id,completed,progress:completed?100:0})});
        if(state.calendar?.tasks){
          const calendarTask=state.calendar.tasks.find((item)=>Number(item.id)===id);
          if(calendarTask){
            calendarTask.concluida=completed;
            calendarTask.progresso=completed?100:0;
          }
        }
        await loadDashboard();
        if(state.calendar&&!$("fullPlanModal")?.hidden){
          renderFullPlanCalendar();
          if(state.selectedCalendarDay){
            renderCalendarDayDetails(state.selectedCalendarDay);
          }
        }
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
  return Array.from(map.entries());
}

function formatWeekRange(week){
  if(!week?.start||!week?.end) return "segunda a domingo";
  const start=new Date(week.start+"T12:00:00");
  const end=new Date(week.end+"T12:00:00");
  const sameMonth=start.getMonth()===end.getMonth();
  if(sameMonth){
    return start.getDate()+" a "+end.toLocaleDateString("pt-BR",{day:"2-digit",month:"long"});
  }
  return start.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})+
    " a "+
    end.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"});
}

function renderDashboard(data){
  state.dashboard=data;
  if(!data.schedule){
    $("scheduleDashboard").hidden=true;
    $("scheduleEmpty").hidden=false;
    if($("scheduleIntro")) $("scheduleIntro").hidden=false;
    return;
  }

  $("scheduleEmpty").hidden=true;
  $("scheduleDashboard").hidden=false;
  if($("scheduleIntro")) $("scheduleIntro").hidden=true;

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
  $("strategyReference").innerHTML=strategy.referenciaEstrutural
    ? '<strong>Referência estrutural:</strong> '+esc(strategy.referenciaEstrutural)
    : "";
  $("strategyPhases").innerHTML=(strategy.fases||["BASE","CONSOLIDAÇÃO","RETA FINAL"]).map((phase)=>'<span>'+esc(String(phase).replaceAll("_"," "))+'</span>').join("");
  const banks=Array.isArray(strategy.bancos)?strategy.bancos:[];
  $("strategyBanks").innerHTML=banks.length
    ? '<strong>Bancos e revisões recomendados:</strong><div>'+banks.map((item)=>'<span>'+esc(item)+'</span>').join("")+'</div>'
    : "";
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
  bindTaskLinks($("todayTasks"));

  const week=data.week||{tasks:[]};
  $("weekRangeLabel").textContent=formatWeekRange(week);
  const groups=groupUpcoming(week.tasks||[]);
  $("upcomingSchedule").innerHTML=groups.length?groups.map(([date,tasks])=>`
    <div class="timeline-day">
      <div class="timeline-date"><strong>${fmtDate(date+"T12:00:00")}</strong><span>${tasks.length} ${tasks.length===1?"tarefa":"tarefas"}</span></div>
      <div class="timeline-tasks">${tasks.map(taskCard).join("")}</div>
    </div>
  `).join(""):'<div class="research-status">Nenhuma tarefa futura.</div>';
  bindTaskButtons($("upcomingSchedule"));
  bindTaskLinks($("upcomingSchedule"));

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

function selectedExam(){
  const checked=document.querySelector('input[name="examType"]:checked');
  if(!checked) return null;
  const type=checked.value;
  const exam=EXAMS[type];
  const edition=$("examEdition").value.trim();
  return {type,exam,prova:exam.label+(edition?" · "+edition:"")};
}

function renderExamBlueprint(){
  const selected=selectedExam();
  const setup=$("planSetup");
  if(!selected){
    if(setup) setup.hidden=true;
    return;
  }
  if(setup) setup.hidden=false;
  if($("selectedPlanTitle")) $("selectedPlanTitle").textContent=selected.exam.label;
  const {exam}=selected;
  $("examBlueprint").innerHTML=
    '<div><span>MATRIZ DE ESTUDO</span><strong>'+esc(exam.focus)+'</strong></div>'+
    '<div class="exam-topic-list">'+exam.topics.map((topic)=>'<span>'+esc(topic)+'</span>').join("")+'</div>';
}

async function buildSchedule(event){
  event.preventDefault();
  const button=$("buildScheduleButton");
  const selected=selectedExam();
  const message=$("scheduleFormMessage");
  if(message) message.hidden=true;
  if(!selected){
    if(message){
      message.hidden=false;
      message.textContent="Escolha ENARE, EBSERH ou Ministério da Saúde antes de montar o cronograma.";
    }
    return;
  }
  const prova=selected.prova;
  button.disabled=true;
  const original=button.innerHTML;
  button.innerHTML="<b>Construindo plano…</b><small>matriz + pesos + desempenho</small>";

  try{
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
        prioridades:splitTerms($("priorities").value)
      })
    });
    state.calendar=null;
    await loadDashboard();
    $("scheduleDashboard").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    if(message){
      message.hidden=false;
      message.textContent=error.message;
    }
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
document.querySelectorAll('input[name="examType"]').forEach((input)=>{
  input.addEventListener("change",()=>{
    renderExamBlueprint();
    window.requestAnimationFrame(()=>{
      $("planSetup")?.scrollIntoView({behavior:"smooth",block:"nearest"});
    });
  });
});
$("examEdition").addEventListener("input",renderExamBlueprint);
function resetPlanChoice(){
  state.calendar=null;
  document.querySelectorAll('input[name="examType"]').forEach((input)=>{input.checked=false;});
  $("examEdition").value="";
  $("difficulties").value="";
  $("priorities").value="";
  renderExamBlueprint();
  $("scheduleDashboard").hidden=true;
  $("scheduleEmpty").hidden=false;
  if($("scheduleIntro")) $("scheduleIntro").hidden=false;
  $("scheduleEmpty").scrollIntoView({behavior:"smooth",block:"start"});
}

$("newPlanButton").addEventListener("click",resetPlanChoice);
$("changePlanButton")?.addEventListener("click",resetPlanChoice);
setDefaultDate();
renderExamBlueprint();
loadDashboard();



function isoDateLocal(date){
  const year=date.getFullYear();
  const month=String(date.getMonth()+1).padStart(2,"0");
  const day=String(date.getDate()).padStart(2,"0");
  return year+"-"+month+"-"+day;
}

function mondayIndex(jsDay){
  return jsDay===0?6:jsDay-1;
}

function calendarTaskMini(task){
  const topic=task.tema||task.titulo||"Atividade";
  const type=String(task.tipo||"").replaceAll("_"," ");
  return '<div class="calendar-task-mini '+(task.concluida?"done":"")+'">'+
    '<span>'+esc(type)+'</span>'+
    '<strong>'+esc(topic)+'</strong>'+
  '</div>';
}

function renderCalendarDayDetails(dateKey){
  const tasks=(state.calendar?.tasks||[]).filter((task)=>{
    return new Date(task.data).toISOString().slice(0,10)===dateKey;
  });
  state.selectedCalendarDay=dateKey;
  const panel=$("calendarDayDetails");
  if(!panel) return;

  const date=new Date(dateKey+"T12:00:00");
  $("calendarDayTitle").textContent=date.toLocaleDateString("pt-BR",{
    weekday:"long",day:"2-digit",month:"long",year:"numeric"
  });

  $("calendarDayTasks").innerHTML=tasks.length
    ? tasks.map(taskCard).join("")
    : '<div class="research-status">Nenhuma atividade programada para este dia.</div>';

  panel.hidden=false;
  bindTaskButtons($("calendarDayTasks"));
  bindTaskLinks($("calendarDayTasks"));
}

function renderFullPlanCalendar(){
  if(!state.calendarCursor||!state.calendar) return;

  const cursor=new Date(
    state.calendarCursor.getFullYear(),
    state.calendarCursor.getMonth(),
    1,
    12
  );
  const year=cursor.getFullYear();
  const month=cursor.getMonth();

  $("calendarMonthLabel").textContent=cursor.toLocaleDateString("pt-BR",{
    month:"long",year:"numeric"
  });

  const first=new Date(year,month,1,12);
  const last=new Date(year,month+1,0,12);
  const offset=mondayIndex(first.getDay());
  const totalCells=Math.ceil((offset+last.getDate())/7)*7;
  const tasksByDay=new Map();

  for(const task of state.calendar.tasks||[]){
    const key=new Date(task.data).toISOString().slice(0,10);
    if(!tasksByDay.has(key)) tasksByDay.set(key,[]);
    tasksByDay.get(key).push(task);
  }

  const todayKey=isoDateLocal(new Date());
  const cells=[];

  for(let cell=0;cell<totalCells;cell+=1){
    const dayNumber=cell-offset+1;
    const date=new Date(year,month,dayNumber,12);
    const inMonth=date.getMonth()===month;
    const key=isoDateLocal(date);
    const tasks=tasksByDay.get(key)||[];
    const done=tasks.filter((task)=>task.concluida).length;

    const classes=[
      "schedule-calendar-day",
      !inMonth?"outside":"",
      key===todayKey?"today":"",
      tasks.length?"has-tasks":""
    ].filter(Boolean).join(" ");

    const preview=tasks.slice(0,3).map(calendarTaskMini).join("");
    const extra=tasks.length>3
      ? '<em>+'+(tasks.length-3)+' atividade'+(tasks.length-3===1?"":"s")+'</em>'
      : "";

    cells.push(
      '<button type="button" class="'+classes+'" data-calendar-day="'+key+'">'+
        '<div class="calendar-day-number">'+
          '<span>'+date.getDate()+'</span>'+
          (tasks.length?'<small>'+done+'/'+tasks.length+'</small>':"")+
        '</div>'+
        '<div class="calendar-day-preview">'+preview+extra+'</div>'+
      '</button>'
    );
  }

  $("fullPlanCalendar").innerHTML=cells.join("");
  $("fullPlanCalendar").querySelectorAll("[data-calendar-day]").forEach((button)=>{
    button.addEventListener("click",()=>{
      renderCalendarDayDetails(button.dataset.calendarDay);
    });
  });
}

async function openFullPlanCalendar(){
  const modal=$("fullPlanModal");
  if(!modal) return;

  modal.hidden=false;
  document.body.classList.add("calendar-modal-open");
  $("calendarDayDetails").hidden=true;

  if(!state.calendar){
    $("fullPlanCalendar").innerHTML='<div class="calendar-loading">Carregando plano completo…</div>';
    try{
      state.calendar=await api("/api/cronograma/calendar");
    }catch(error){
      $("fullPlanCalendar").innerHTML='<div class="research-status">'+esc(error.message)+'</div>';
      return;
    }
  }

  if(!state.calendar?.schedule){
    $("fullPlanCalendar").innerHTML='<div class="research-status">Nenhum plano ativo.</div>';
    return;
  }

  $("calendarExamLabel").textContent=state.calendar.schedule.prova||"";
  const firstTask=state.calendar.tasks?.[0];
  const baseDate=firstTask?new Date(firstTask.data):new Date();
  const today=new Date();
  const useToday=(state.calendar.tasks||[]).some((task)=>{
    const date=new Date(task.data);
    return date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth();
  });
  state.calendarCursor=useToday?today:baseDate;
  renderFullPlanCalendar();
}

function closeFullPlanCalendar(){
  const modal=$("fullPlanModal");
  if(!modal) return;
  modal.hidden=true;
  document.body.classList.remove("calendar-modal-open");
  state.selectedCalendarDay=null;
}

$("openFullPlanButton")?.addEventListener("click",openFullPlanCalendar);
$("closeFullPlanButton")?.addEventListener("click",closeFullPlanCalendar);
document.querySelector("[data-close-calendar]")?.addEventListener("click",closeFullPlanCalendar);
$("closeCalendarDayButton")?.addEventListener("click",()=>{
  $("calendarDayDetails").hidden=true;
  state.selectedCalendarDay=null;
});
$("calendarPrevButton")?.addEventListener("click",()=>{
  const base=state.calendarCursor||new Date();
  state.calendarCursor=new Date(base.getFullYear(),base.getMonth()-1,1,12);
  $("calendarDayDetails").hidden=true;
  renderFullPlanCalendar();
});
$("calendarNextButton")?.addEventListener("click",()=>{
  const base=state.calendarCursor||new Date();
  state.calendarCursor=new Date(base.getFullYear(),base.getMonth()+1,1,12);
  $("calendarDayDetails").hidden=true;
  renderFullPlanCalendar();
});
$("calendarTodayButton")?.addEventListener("click",()=>{
  state.calendarCursor=new Date();
  $("calendarDayDetails").hidden=true;
  renderFullPlanCalendar();
});
document.addEventListener("keydown",(event)=>{
  if(event.key==="Escape"&&!$("fullPlanModal")?.hidden){
    closeFullPlanCalendar();
  }
});
