/* Lote 01 — Raciocínio Lógico / Estruturas lógicas. Questões inéditas e independentes. */
window.PMPE_EXTRA_QUESTIONS = [
  {
    "id": "rlm:0:lote01:01",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Considere p verdadeira e q falsa. Qual é o valor lógico de (p ∧ q) ∨ ¬q?",
    "options": [
      "Verdadeiro.",
      "Falso.",
      "Indeterminado, mesmo conhecendo p e q.",
      "Igual ao valor de q.",
      "Depende de uma terceira proposição."
    ],
    "answer": 0,
    "explanation": "p ∧ q é falso, enquanto ¬q é verdadeiro. Logo, a disjunção é verdadeira."
  },
  {
    "id": "rlm:0:lote01:02",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Se p é falsa e q é verdadeira, a proposição p → q é",
    "options": [
      "falsa, pois o antecedente é falso.",
      "verdadeira, pois a condicional somente é falsa quando o antecedente é verdadeiro e o consequente é falso.",
      "equivalente a p ∧ q.",
      "uma contradição independentemente dos valores de p e q.",
      "sem valor lógico definido."
    ],
    "answer": 1,
    "explanation": "Uma condicional com antecedente falso é verdadeira na lógica clássica."
  },
  {
    "id": "rlm:0:lote01:03",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação lógica de 'A viatura está disponível e a equipe está completa' corresponde a",
    "options": [
      "A viatura não está disponível e a equipe não está completa.",
      "Se a viatura está disponível, a equipe está completa.",
      "A viatura não está disponível ou a equipe não está completa.",
      "A viatura está disponível ou a equipe está completa.",
      "A equipe está completa e a viatura não está disponível."
    ],
    "answer": 2,
    "explanation": "Pela lei de De Morgan, ¬(p ∧ q) equivale a ¬p ∨ ¬q."
  },
  {
    "id": "rlm:0:lote01:04",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação de 'O relatório foi entregue ou o registro foi atualizado' é",
    "options": [
      "O relatório não foi entregue ou o registro não foi atualizado.",
      "O relatório foi entregue e o registro foi atualizado.",
      "Se o relatório foi entregue, o registro foi atualizado.",
      "O relatório não foi entregue e o registro não foi atualizado.",
      "O registro foi atualizado, mas o relatório não foi entregue."
    ],
    "answer": 3,
    "explanation": "Pela lei de De Morgan, ¬(p ∨ q) equivale a ¬p ∧ ¬q."
  },
  {
    "id": "rlm:0:lote01:05",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A proposição 'Se há chamado urgente, então há prioridade no atendimento' é logicamente equivalente a",
    "options": [
      "Se não há chamado urgente, então não há prioridade.",
      "Se há prioridade, então há chamado urgente.",
      "Há chamado urgente e não há prioridade.",
      "Não há chamado urgente ou há prioridade no atendimento.",
      "Há prioridade se, e somente se, há chamado urgente."
    ],
    "answer": 3,
    "explanation": "p → q equivale a ¬p ∨ q."
  },
  {
    "id": "rlm:0:lote01:06",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A contrapositiva de 'Se o alarme dispara, então a central recebe um aviso' é",
    "options": [
      "Se a central recebe um aviso, então o alarme dispara.",
      "Se o alarme não dispara, então a central não recebe um aviso.",
      "Se a central não recebe um aviso, então o alarme não dispara.",
      "O alarme dispara se, e somente se, a central recebe aviso.",
      "Se o alarme dispara, a central não recebe aviso."
    ],
    "answer": 2,
    "explanation": "A contrapositiva de p → q é ¬q → ¬p."
  },
  {
    "id": "rlm:0:lote01:07",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Analise a proposição 'Se o agente é escalado, então comparece à unidade'. Qual alternativa exprime sua inversa, não necessariamente equivalente?",
    "options": [
      "Se o agente não é escalado, então não comparece à unidade.",
      "Se o agente não comparece à unidade, então não é escalado.",
      "Se o agente comparece à unidade, então é escalado.",
      "O agente é escalado e comparece à unidade.",
      "O agente não é escalado ou comparece à unidade."
    ],
    "answer": 0,
    "explanation": "A inversa troca p por ¬p e q por ¬q: ¬p → ¬q; não se confunde com contrapositiva."
  },
  {
    "id": "rlm:0:lote01:08",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Uma proposição bicondicional p ↔ q será verdadeira quando",
    "options": [
      "p for verdadeira e q falsa.",
      "p e q apresentarem valores lógicos iguais.",
      "exatamente uma das proposições for verdadeira.",
      "ambas forem necessariamente verdadeiras, nunca ambas falsas.",
      "p for falsa, independentemente de q."
    ],
    "answer": 1,
    "explanation": "O bicondicional é verdadeiro quando p e q são ambas verdadeiras ou ambas falsas."
  },
  {
    "id": "rlm:0:lote01:09",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A expressão lógica p ∨ ¬p constitui uma",
    "options": [
      "contradição.",
      "contingência.",
      "tautologia.",
      "equivalência impossível.",
      "conjunção falsa."
    ],
    "answer": 2,
    "explanation": "Pelo princípio do terceiro excluído, p ∨ ¬p é verdadeira para qualquer valor de p."
  },
  {
    "id": "rlm:0:lote01:10",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A expressão p ∧ ¬p classifica-se como",
    "options": [
      "tautologia.",
      "contradição.",
      "contingência.",
      "bicondicional.",
      "proposição simples."
    ],
    "answer": 1,
    "explanation": "Uma proposição e sua negação não podem ser simultaneamente verdadeiras."
  },
  {
    "id": "rlm:0:lote01:11",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Considere p = V e q = F. O valor de ¬(p → q) é",
    "options": [
      "verdadeiro.",
      "falso.",
      "igual a q.",
      "indeterminável.",
      "verdadeiro apenas se p for falso."
    ],
    "answer": 0,
    "explanation": "p → q é falsa em V → F; logo sua negação é verdadeira."
  },
  {
    "id": "rlm:0:lote01:12",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Quantas linhas tem a tabela-verdade de uma proposição composta formada por quatro proposições simples distintas?",
    "options": [
      "4.",
      "8.",
      "12.",
      "16.",
      "32."
    ],
    "answer": 3,
    "explanation": "A tabela-verdade possui 2^n linhas; com n=4, são 16."
  },
  {
    "id": "rlm:0:lote01:13",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação de 'Todos os policiais participaram da instrução' é",
    "options": [
      "Nenhum policial participou da instrução.",
      "Todos os policiais faltaram à instrução.",
      "Existe pelo menos um policial que não participou da instrução.",
      "Existe pelo menos um policial que participou da instrução.",
      "Todos os policiais participaram apenas parcialmente."
    ],
    "answer": 2,
    "explanation": "A negação de ∀x P(x) é ∃x ¬P(x)."
  },
  {
    "id": "rlm:0:lote01:14",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação de 'Existe um servidor que domina informática e legislação' é",
    "options": [
      "Todos os servidores dominam informática e legislação.",
      "Nenhum servidor domina informática nem legislação.",
      "Existe servidor que não domina informática.",
      "Todo servidor não domina informática ou não domina legislação.",
      "Todo servidor domina informática ou legislação."
    ],
    "answer": 3,
    "explanation": "Negar ∃x (I ∧ L) resulta em ∀x (¬I ∨ ¬L)."
  },
  {
    "id": "rlm:0:lote01:15",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação de 'Nenhum candidato apresentou recurso' é",
    "options": [
      "Todos os candidatos apresentaram recurso.",
      "Pelo menos um candidato apresentou recurso.",
      "Pelo menos um candidato não apresentou recurso.",
      "Nenhum recurso foi deferido.",
      "Todos os recursos foram deferidos."
    ],
    "answer": 1,
    "explanation": "A negação de 'nenhum' é 'pelo menos um'."
  },
  {
    "id": "rlm:0:lote01:16",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Considere 'Alguns agentes não realizaram o curso'. A negação lógica dessa afirmação é",
    "options": [
      "Nenhum agente realizou o curso.",
      "Alguns agentes realizaram o curso.",
      "Todos os agentes realizaram o curso.",
      "Todos os agentes deixaram de realizar o curso.",
      "Pelo menos dois agentes realizaram o curso."
    ],
    "answer": 2,
    "explanation": "Negar a existência de agentes que não fizeram o curso equivale a afirmar que todos fizeram."
  },
  {
    "id": "rlm:0:lote01:17",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A expressão 'Ou a equipe A atende à ocorrência ou a equipe B atende à ocorrência, mas não ambas' representa",
    "options": [
      "conjunção.",
      "disjunção inclusiva.",
      "disjunção exclusiva.",
      "condicional.",
      "negação."
    ],
    "answer": 2,
    "explanation": "O 'ou...ou..., mas não ambos' é o operador ou exclusivo (XOR)."
  },
  {
    "id": "rlm:0:lote01:18",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Considere p = V e q = V. O valor de ¬p ∨ (p ∧ q) é",
    "options": [
      "verdadeiro.",
      "falso.",
      "igual a ¬q.",
      "indefinido.",
      "falso apenas porque p é verdadeiro."
    ],
    "answer": 0,
    "explanation": "¬p é F; p ∧ q é V; então F ∨ V = V."
  },
  {
    "id": "rlm:0:lote01:19",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Uma conjunção p ∧ q é verdadeira",
    "options": [
      "sempre que p for verdadeira.",
      "se e somente se p e q forem verdadeiras.",
      "sempre que q for falsa.",
      "apenas quando p e q forem falsas.",
      "quando exatamente uma proposição for verdadeira."
    ],
    "answer": 1,
    "explanation": "A conjunção exige ambos os componentes verdadeiros."
  },
  {
    "id": "rlm:0:lote01:20",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Uma disjunção inclusiva p ∨ q é falsa",
    "options": [
      "quando ambas são verdadeiras.",
      "quando p é falsa e q verdadeira.",
      "quando p é verdadeira e q falsa.",
      "somente quando p e q são falsas.",
      "sempre que p é falsa."
    ],
    "answer": 3,
    "explanation": "A disjunção inclusiva é falsa apenas em F ∨ F."
  },
  {
    "id": "rlm:0:lote01:21",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "O conectivo principal da proposição ¬p ∧ (q → r) é",
    "options": [
      "negação.",
      "condicional.",
      "conjunção.",
      "bicondicional.",
      "disjunção."
    ],
    "answer": 2,
    "explanation": "O operador que une as duas partes maiores da expressão é ∧."
  },
  {
    "id": "rlm:0:lote01:22",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A expressão ¬(p ∧ q) é equivalente a",
    "options": [
      "¬p ∧ ¬q.",
      "p ∨ q.",
      "¬p ∨ ¬q.",
      "p → q.",
      "p ↔ q."
    ],
    "answer": 2,
    "explanation": "Trata-se da lei de De Morgan aplicada à conjunção."
  },
  {
    "id": "rlm:0:lote01:23",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A negação formal de 'Se o suspeito fugiu, então houve perseguição' é",
    "options": [
      "Se não fugiu, não houve perseguição.",
      "O suspeito fugiu e não houve perseguição.",
      "O suspeito não fugiu ou houve perseguição.",
      "Houve perseguição e o suspeito fugiu.",
      "Se não houve perseguição, então não fugiu."
    ],
    "answer": 1,
    "explanation": "A negação de p → q é p ∧ ¬q."
  },
  {
    "id": "rlm:0:lote01:24",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Analise as proposições p e q. Qual forma é equivalente a 'p somente se q'?",
    "options": [
      "q → p.",
      "p ↔ q.",
      "p → q.",
      "p ∧ q.",
      "¬p → q."
    ],
    "answer": 2,
    "explanation": "A construção 'p somente se q' indica que q é condição necessária para p: p → q."
  },
  {
    "id": "rlm:0:lote01:25",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A afirmação 'Basta haver autorização para que a equipe acesse o sistema' pode ser simbolizada, com p = há autorização e q = a equipe acessa o sistema, como",
    "options": [
      "q → p.",
      "p → q.",
      "p ∧ q.",
      "¬p → ¬q.",
      "p ↔ q."
    ],
    "answer": 1,
    "explanation": "'Basta p para q' indica p como condição suficiente: p → q."
  },
  {
    "id": "rlm:0:lote01:26",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Se o antecedente de uma condicional é verdadeiro e toda a condicional também é verdadeira, o consequente é",
    "options": [
      "necessariamente verdadeiro.",
      "necessariamente falso.",
      "independente do antecedente.",
      "uma contradição.",
      "impossível de determinar."
    ],
    "answer": 0,
    "explanation": "Com p=V, a condicional p→q só é V quando q=V."
  },
  {
    "id": "rlm:0:lote01:27",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Se uma proposição composta admite tanto valores verdadeiros quanto falsos, dependendo da atribuição às proposições simples, ela é uma",
    "options": [
      "tautologia.",
      "contradição.",
      "contingência.",
      "proposição sem sentido.",
      "equivalência lógica."
    ],
    "answer": 2,
    "explanation": "Contingência tem ao menos uma linha verdadeira e outra falsa."
  },
  {
    "id": "rlm:0:lote01:28",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "Considere três proposições simples independentes. Quantas atribuições de valores lógicos tornam p ∧ q ∧ r verdadeira?",
    "options": [
      "Uma.",
      "Duas.",
      "Três.",
      "Quatro.",
      "Oito."
    ],
    "answer": 0,
    "explanation": "A conjunção tripla é V somente na atribuição V,V,V."
  },
  {
    "id": "rlm:0:lote01:29",
    "subject": "rlm",
    "topicIndex": 0,
    "source": "Autoral Córtex · lógica proposicional · padrão de concurso",
    "prompt": "A equivalência lógica entre p → q e ¬q → ¬p recebe o nome de",
    "options": [
      "negação do consequente.",
      "recíproca.",
      "conversão simples.",
      "contraposição.",
      "afirmação do consequente."
    ],
    "answer": 3,
    "explanation": "Contraposição troca as proposições e nega ambas, preservando a equivalência."
  }
];
