/* PMPE lote 02: questões autorais calculadas e verificáveis de RLM. */
(function(){
"use strict";
const out=[];
function add(topicIndex,prompt,answer,wrongs,explanation,context=""){
  const correct=String(answer),opts=[correct,...wrongs.map(String)];
  if(opts.length!==5||new Set(opts).size!==5)throw Error("Alternativas duplicadas");
  const shift=(out.length*3+topicIndex)%5;
  const moved=opts.slice(shift).concat(opts.slice(0,shift));
  out.push({id:"rlm:"+topicIndex+":lote02:"+String(out.filter(q=>q.topicIndex===topicIndex).length+1).padStart(2,"0"),subject:"rlm",topicIndex,source:"Autoral Córtex · padrão de concurso · RLM",context,prompt,options:moved,answer:moved.indexOf(correct),explanation});
}
function N(v){return String(v);}
function ch(n,k){let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return Math.round(r);}
const agents=["uma patrulha foi deslocada","o relatório foi protocolado","o acesso ao sistema foi liberado","o posto recebeu reforço","a central registrou a chamada","o treinamento foi concluído","a viatura voltou à base","a escala foi publicada","o equipamento foi vistoriado","a rota foi autorizada"];
const events=["o supervisor foi informado","o registro foi homologado","a equipe recebeu confirmação","a mensagem foi arquivada","a barreira foi retirada","a operação começou","o chamado entrou na fila","a inspeção foi validada","o plantão foi encerrado","o acesso foi registrado"];
for(let i=0;i<10;i++){
 const p=agents[i],q=events[i];
 add(1,'Considere as premissas: “Se '+p+', então '+q+'.” e “Não é verdade que '+q+'.” Qual conclusão decorre necessariamente dessas premissas?', "Não é verdade que "+p+".",["O fato de "+p+" é necessariamente verdadeiro.","Não se pode concluir nada a respeito da primeira condição.","A segunda premissa contradiz necessariamente a primeira.","O fato de "+q+" é necessariamente verdadeiro."],"O argumento é válido por modus tollens: de p → q e ¬q deduz-se ¬p.");
}
for(let i=0;i<10;i++){
 const p=agents[i],q=events[(i+3)%10];
 add(1,'Em um relatório foram registradas duas premissas: “Se '+p+', então '+q+'” e “'+p+'”. Considerando-as verdadeiras, assinale a conclusão logicamente válida.',"É verdadeiro que "+q+".",["É falso que "+q+".","A conclusão depende de uma terceira premissa não informada.","Não se pode afirmar nada sobre a segunda proposição.","As premissas provam somente a negação do antecedente."],"Modus ponens: p → q e p permitem concluir q.");
}
const invalidCases=[
 ["A viatura foi revisada","ela está disponível"],["A equipe recebeu treinamento","ela pode atuar no evento"],["O motorista possui habilitação","pode conduzir o veículo"],["A ocorrência foi encerrada","o boletim foi arquivado"],["A rota foi liberada","o comboio avançou"],["A ordem foi publicada","a unidade iniciou a missão"],["O servidor realizou autenticação","o sistema liberou o painel"],["O alarme soou","o vigilante acionou a central"],["O candidato compareceu à prova","a folha foi entregue"]
];
invalidCases.forEach(([p,q],i)=>{
 add(1,'Analise o argumento: “Se '+p+', então '+q+'. '+q+'. Logo, '+p+'.” Assinale a classificação correta.',"Inválido: afirmação do consequente.",["Válido: modus ponens.","Válido: modus tollens.","Válido: silogismo disjuntivo.","Inválido: negação do antecedente."],"Saber que q é verdadeiro não obriga p a ser verdadeiro. Essa falácia é a afirmação do consequente.");
});
for(let i=0;i<12;i++){
 const a=34+i*3,b=25+i*2,overlap=8+(i%6)*2,total=a+b-overlap;
 add(2,'Em um curso de formação, '+a+' alunos estudaram Informática, '+b+' estudaram Direito Constitucional e '+overlap+' estudaram ambas. Todos estudaram pelo menos uma dessas disciplinas. Quantos alunos participaram da atividade?',N(total),[total+overlap,total-overlap,total+5,total+2],"Pelo princípio da inclusão-exclusão: |A ∪ B| = "+a+" + "+b+" − "+overlap+" = "+total+".");
}
for(let i=0;i<9;i++){
 const all=95+5*i,a=42+2*i,b=37+i,both=9+(i%4),none=all-(a+b-both);
 add(2,'De '+all+' participantes de um simulado, '+a+' resolveram o bloco de Português, '+b+' resolveram o bloco de Informática e '+both+' resolveram os dois. Quantos não resolveram nenhum dos dois blocos?',N(none),[none+both,none+5,a+b-both,all-a],"O total que resolveu ao menos um bloco é "+a+" + "+b+" − "+both+". Subtraindo de "+all+" restam "+none+".");
}
for(let i=0;i<8;i++){
 const a=25+i*3,b=20+i*2,ab=6+(i%4),onlyA=a-ab;
 add(2,'Em uma unidade, '+a+' profissionais possuem certificado A, '+b+' possuem certificado B e '+ab+' possuem ambos. Quantos possuem somente o certificado A?',N(onlyA),[a,b,ab,onlyA+2],"Para obter somente A, descontam-se de A os participantes comuns a A e B: "+a+" − "+ab+" = "+onlyA+".");
}
for(let i=0;i<10;i++){
 const n=6+i,k=2+(i%3),result=ch(n,k);
 add(3,'Uma equipe precisa escolher '+k+' integrantes entre '+n+' voluntários. Todos exercerão a mesma função. De quantas maneiras pode ser feita a escolha?',N(result),[result*k,result+n,result+1,n*k],"Não há distinção de funções nem ordem entre os selecionados: C("+n+","+k+") = "+result+".");
}
for(let i=0;i<9;i++){
 const n=5+i,k=2+(i%3),result=1*Array.from({length:k},(_,j)=>n-j).reduce((a,b)=>a*b,1);
 add(3,'De '+n+' agentes habilitados, serão designados '+k+' para postos diferentes e identificados, sendo cada agente destinado a um único posto. Quantas distribuições distintas existem?',N(result),[ch(n,k),result+n,result*2,result-1],"Como os postos são diferentes, a ordem importa: A("+n+","+k+") = "+result+".");
}
for(let i=0;i<10;i++){
 const red=2+i,blue=4+i,total=red+blue;const num=red*100;
 const pct=(red*100/total),word=pct.toFixed(2).replace(".",",")+"%";
 const wrong=[((blue*100/total).toFixed(2).replace(".",","))+"%","50,00%",((red*100/(total+1)).toFixed(2).replace(".",","))+"%","100,00%"];
 if(new Set([word,...wrong]).size!==5){wrong[1]="25,00%";if(new Set([word,...wrong]).size!==5)wrong[1]="10,00%";}
 add(3,'Uma urna contém '+red+' cartões vermelhos e '+blue+' azuis, indistinguíveis ao tato. Ao retirar um único cartão ao acaso, a probabilidade de obter um vermelho, em porcentagem, é aproximadamente',word,wrong,"A probabilidade é "+red+"/"+total+" ≈ "+word+".");
}
const counts={};out.forEach(q=>counts[q.topicIndex]=(counts[q.topicIndex]||0)+1);
if(counts[1]!==29||counts[2]!==29||counts[3]!==29)throw Error(JSON.stringify(counts));
const keys=new Set(out.map(x=>x.id));if(keys.size!==out.length)throw Error("IDs repetidos");
window.PMPE_EXTRA_QUESTIONS=(window.PMPE_EXTRA_QUESTIONS||[]).concat(out);
})();