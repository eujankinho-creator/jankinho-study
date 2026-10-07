/* Lote 04: Figuras de linguagem e relações semânticas — questões autorais de concurso. */
(function(){
"use strict";
const figures=[
["O relógio engoliu as últimas horas do plantão.","personificação","Atribui-se ao relógio uma ação própria de seres animados."],
["Ao chegar à sala, o candidato encontrou uma montanha de papéis aguardando conferência.","metáfora","Montanha substitui figuradamente uma grande quantidade de papéis."],
["O estádio inteiro aplaudiu a apresentação da banda.","metonímia","O lugar é empregado em referência ao público presente."],
["Esperei um século pela divulgação do resultado.","hipérbole","A duração é exagerada deliberadamente para intensificar a espera."],
["O servidor partiu desta para melhor, segundo a nota da família.","eufemismo","A expressão suaviza a referência à morte."],
["Na multidão, uns pediam silêncio; outros respondiam com gritos.","antítese","Há contraposição de ideias: silêncio e gritos."],
["Que pontualidade exemplar! — disse o supervisor ao funcionário que chegou duas horas atrasado.","ironia","O elogio aparente comunica uma crítica contrária ao sentido literal."],
["A noite estava fria como o metal das grades.","comparação","A semelhança é explicitada pelo conectivo comparativo 'como'."],
["Vimos a chuva; vimos a enchente; vimos as consequências.","anáfora","A repetição inicial de 'vimos' estrutura os enunciados."],
["A discussão virou murmúrio, fala, clamor e gritaria.","gradação","Os termos são ordenados em intensidade crescente."],
["Era um silêncio ensurdecedor no corredor vazio.","paradoxo","A expressão reúne ideias aparentemente contraditórias."],
["A voz daquele cantor tinha uma cor quente.","sinestesia","Mesclam-se sensações auditivas, visuais e térmicas."],
["O vento sussurrava entre as árvores do pátio.","personificação","O verbo sussurrar atribui comportamento humano ao vento."],
["A comissão leu Machado de Assis durante a preparação do evento.","metonímia","O nome do autor designa sua obra."],
["A notícia caiu como uma bomba sobre a equipe.","comparação","A expressão 'como' estabelece aproximação explícita entre notícia e bomba."],
["Chorei rios quando soube da despedida.","hipérbole","A imagem exagera intencionalmente a quantidade de lágrimas."],
["Em vez de falar sobre a demissão, comunicou que o colega foi desligado do quadro.","eufemismo","A formulação atenua o efeito da notícia sobre a demissão."],
["O menino era a luz da casa em dias difíceis.","metáfora","Luz é empregada em sentido figurado como fonte de alegria ou esperança."],
["A cidade acordou sob uma névoa fina.","personificação","Atribui-se o ato de acordar à cidade."],
["Na mesma manhã, a alegria dos aprovados contrastava com a tristeza dos reprovados.","antítese","A frase opõe alegria e tristeza."],
["Excelente ideia deixar os documentos em casa no dia da inspeção!","ironia","O elogio é aparente e se refere criticamente ao erro cometido."],
["Bebi um copo de água depois da corrida.","metonímia","O recipiente 'copo' designa seu conteúdo."],
["Era preciso estudar, era preciso revisar, era preciso praticar.","anáfora","O segmento 'era preciso' reaparece no início das orações."],
["A inquietação cresceu: primeiro dúvida, depois temor e, por fim, pânico.","gradação","O encadeamento apresenta aumento gradual da intensidade."],
["O grito mudo daquele olhar não passou despercebido.","paradoxo","Há tensão entre grito e mudez, construindo contradição aparente."],
["A sirene rasgou o silêncio da madrugada.","metáfora","Rasgar é usado figuradamente para indicar ruptura do silêncio."],
["O gabinete informou que haverá reunião extraordinária.","metonímia","Gabinete representa, por relação de contiguidade, os agentes responsáveis."],
["A tristeza caminhava ao lado dos moradores após a enchente.","personificação","A tristeza abstrata recebe a ação humana de caminhar."],
["As palavras dele tinham gosto amargo.","sinestesia","Uma sensação gustativa qualifica a percepção de palavras."],
];
const relations=[
["Embora a chuva tivesse parado, o trânsito continuou interditado.","concessão","Embora apresenta um fato que não impede o resultado expresso na oração principal."],
["As equipes chegaram cedo, porque havia alerta de risco.","causa","Porque introduz o motivo da chegada antecipada."],
["A pista foi vistoriada; portanto, foi liberada.","conclusão","Portanto introduz uma conclusão com base na vistoria."],
["O alarme soou, mas ninguém abandonou o edifício.","oposição","Mas exprime contraste entre o alerta e a reação."],
["O servidor verificou os documentos e atualizou o sistema.","adição","E coordena ações cumulativas."],
["O candidato comparecerá hoje ou solicitará reagendamento.","alternância","Ou apresenta possibilidades alternativas."],
["Ainda que o prazo fosse curto, o relatório foi concluído.","concessão","Ainda que indica circunstância concessiva."],
["Como a água subiu rapidamente, a Defesa Civil reforçou o aviso.","causa","Como, anteposto à oração principal, introduz a razão do reforço."],
["O documento foi entregue, logo a pendência foi encerrada.","conclusão","Logo relaciona a entrega a uma conclusão."],
["Havia recursos disponíveis; contudo, a compra foi adiada.","oposição","Contudo é conectivo adversativo."],
["O curso inclui teoria, bem como exercícios práticos.","adição","Bem como acrescenta outro componente ao curso."],
["Os participantes podem optar pela manhã ou pela tarde.","alternância","Ou estabelece opções de horário."],
["Apesar de ter estudado, o candidato sentiu insegurança.","concessão","Apesar de indica fato que não anulou o sentimento."],
["O acesso foi suspenso visto que a senha havia expirado.","causa","Visto que introduz justificativa causal."],
["Os dados estavam inconsistentes; por conseguinte, a análise foi refeita.","conclusão","Por conseguinte exprime consequência lógica."],
["O equipamento era novo, entretanto apresentou falha.","oposição","Entretanto contrapõe novidade e falha."],
["Foram revisados os registros, além disso houve nova conferência.","adição","Além disso acrescenta outra providência."],
["Ou se apresenta o comprovante ou se justifica a ausência.","alternância","A construção ou...ou... organiza alternativas."],
["Mesmo que o tempo melhore, a vistoria continuará necessária.","concessão","Mesmo que introduz condição concessiva, não suficiente para dispensar a vistoria."],
["A reunião foi cancelada em razão da falta de quórum.","causa","Em razão de explicita o motivo."],
["Os resultados foram publicados; assim, a etapa seguinte pôde começar.","conclusão","Assim introduz desdobramento conclusivo."],
["Era possível o envio digital, todavia alguns preferiram o protocolo presencial.","oposição","Todavia contrapõe as possibilidades às escolhas."],
["O treinamento aborda atendimento inicial e também técnicas de comunicação.","adição","E também agrega conteúdos."],
["A central encaminhará a mensagem por rádio ou por sistema eletrônico.","alternância","Ou indica formas alternativas de envio."],
["Conquanto o parecer fosse favorável, a aprovação não ocorreu.","concessão","Conquanto estabelece concessão."],
["O atendimento atrasou, pois parte da equipe estava em outra ocorrência.","causa","Pois fornece explicação causal para o atraso."],
["A vistoria terminou sem irregularidades; por isso, a área foi reaberta.","conclusão","Por isso apresenta conclusão ou consequência da vistoria."],
["As inscrições encerraram-se, não obstante o prazo de recursos permaneceu aberto.","oposição","Não obstante introduz informação contrastante."],
["O agente recolheu as provas e, igualmente, preservou o local.","adição","Igualmente indica acréscimo."],
];
const relationNames=["causa","conclusão","concessão","oposição","adição","alternância"];
const figNames=["personificação","metáfora","metonímia","hipérbole","eufemismo","antítese","ironia","comparação","anáfora","gradação","paradoxo","sinestesia"];
const out=[];
function add(idx,context,prompt,correct,choices,why){
 const options=[correct,...choices];if(options.length!==5||new Set(options).size!==5)throw Error("alternativas duplicadas");
 const shift=(out.length*3+1)%5,rot=options.slice(shift).concat(options.slice(0,shift));
 out.push({id:"portugues:"+idx+":lote04:"+String(out.filter(x=>x.topicIndex===idx).length+1).padStart(2,"0"),subject:"portugues",topicIndex:idx,source:"Autoral Córtex · questões contextualizadas · padrão AOCP",context,prompt,options:rot,answer:rot.indexOf(correct),explanation:why});
}
figures.forEach(([context,kind,why],i)=>{
 let choices=[];for(let j=1;choices.length<4;j++){const c=figNames[(figNames.indexOf(kind)+j*2+i)%figNames.length];if(c!==kind&&!choices.includes(c))choices.push(c);}
 add(2,context,"No enunciado acima, identifica-se predominantemente a seguinte figura de linguagem:",kind,choices,why);
});
relations.forEach(([context,kind,why],i)=>{
 const choices=relationNames.filter(x=>x!==kind).slice(i%2,i%2+4);
 add(3,context,"Considerando o vínculo semântico estabelecido pelo conectivo empregado, assinale a relação predominante.",kind,choices,why);
});
if(out.length!==58||[2,3].some(i=>out.filter(q=>q.topicIndex===i).length!==29))throw Error("Contagem errada");
window.PMPE_EXTRA_QUESTIONS=(window.PMPE_EXTRA_QUESTIONS||[]).concat(out);
})();