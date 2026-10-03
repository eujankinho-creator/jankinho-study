import { prisma } from "../../lib/prisma";

type Conceito = {
  id: string;
  assunto: string;
  dificuldade: "facil" | "medio" | "dificil";
  pergunta: string;
  explicacao: string;
  correta: string;
  distratores: [string, string, string];
};

const FONTE = "cortex-enare-ebserh-500-v2";

const CENARIOS = [
  "Em um hospital universitário da rede EBSERH,",
  "Durante uma prova de residência multiprofissional em saúde,",
  "Na assistência de enfermagem em um serviço público de referência,",
  "Em uma situação clínica no padrão de cobrança ENARE/EBSERH,"
];

const conceitos: Conceito[] = [
  {
    "id": "seg-identificacao",
    "assunto": "Segurança do Paciente",
    "dificuldade": "facil",
    "pergunta": "antes de um procedimento, qual conduta confirma corretamente a identidade do paciente?",
    "explicacao": "A identificação segura utiliza pelo menos dois identificadores confiáveis e não deve depender do leito.",
    "correta": "Conferir pelo menos dois identificadores independentes",
    "distratores": [
      "Usar somente o número do leito",
      "Perguntar apenas o primeiro nome",
      "Confirmar com outro paciente do quarto"
    ]
  },
  {
    "id": "seg-medicacao",
    "assunto": "Segurança do Paciente",
    "dificuldade": "medio",
    "pergunta": "qual barreira reduz erros antes da administração de medicamentos?",
    "explicacao": "A checagem sistemática dos direitos de administração e da prescrição reduz erros de medicação.",
    "correta": "Conferir prescrição, paciente, medicamento, dose, via, horário e registros pertinentes",
    "distratores": [
      "Preparar todas as medicações sem identificação",
      "Conferir apenas a cor da embalagem",
      "Registrar somente ao fim do plantão"
    ]
  },
  {
    "id": "seg-quedas",
    "assunto": "Segurança do Paciente",
    "dificuldade": "medio",
    "pergunta": "em paciente com alto risco de queda, qual intervenção é apropriada?",
    "explicacao": "A prevenção de quedas combina avaliação de risco, ambiente seguro e assistência à mobilização.",
    "correta": "Manter ambiente seguro, orientar e auxiliar a mobilização conforme risco",
    "distratores": [
      "Elevar a cama ao máximo",
      "Retirar dispositivos de apoio",
      "Estimular deambulação desacompanhada"
    ]
  },
  {
    "id": "seg-lesao-pressao",
    "assunto": "Segurança do Paciente",
    "dificuldade": "medio",
    "pergunta": "qual cuidado integra a prevenção de lesão por pressão?",
    "explicacao": "A prevenção envolve alívio de pressão, avaliação da pele, manejo de umidade, mobilidade e nutrição.",
    "correta": "Reposicionamento individualizado, inspeção da pele e controle de umidade",
    "distratores": [
      "Massagear hiperemia não branqueável",
      "Usar anel de borracha sob o sacro",
      "Manter lençóis úmidos"
    ]
  },
  {
    "id": "seg-comunicacao",
    "assunto": "Segurança do Paciente",
    "dificuldade": "facil",
    "pergunta": "qual prática torna uma transferência de cuidado mais segura?",
    "explicacao": "Comunicação estruturada e confirmação de informações críticas reduzem omissões e falhas de continuidade.",
    "correta": "Usar comunicação estruturada e confirmar informações críticas",
    "distratores": [
      "Omitir pendências para abreviar a passagem",
      "Transmitir apenas diagnósticos",
      "Substituir o prontuário por mensagens informais"
    ]
  },
  {
    "id": "iras-maos",
    "assunto": "Controle de Infecção",
    "dificuldade": "facil",
    "pergunta": "quando as mãos não estão visivelmente sujas, qual método é geralmente indicado para higiene das mãos no cuidado?",
    "explicacao": "A preparação alcoólica é efetiva quando não há sujidade visível, respeitando as indicações de higiene das mãos.",
    "correta": "Preparação alcoólica nos momentos recomendados",
    "distratores": [
      "Uso de luvas sem higiene das mãos",
      "Lavagem apenas no início do turno",
      "Água sem sabonete como rotina"
    ]
  },
  {
    "id": "iras-cvc",
    "assunto": "IRAS",
    "dificuldade": "medio",
    "pergunta": "qual medida reduz infecção de corrente sanguínea associada a cateter venoso central?",
    "explicacao": "Inserção e manutenção assépticas e remoção quando não mais necessário reduzem infecção associada a CVC.",
    "correta": "Técnica asséptica e revisão diária da necessidade do cateter",
    "distratores": [
      "Troca diária do cateter de rotina",
      "Antibiótico profilático contínuo",
      "Manter o cateter sem indicação"
    ]
  },
  {
    "id": "iras-cauti",
    "assunto": "IRAS",
    "dificuldade": "medio",
    "pergunta": "qual medida previne infecção urinária associada a cateter vesical?",
    "explicacao": "Reduzir tempo de permanência e preservar o sistema fechado são medidas centrais de prevenção.",
    "correta": "Evitar indicação desnecessária, manter sistema fechado e retirar precocemente",
    "distratores": [
      "Desconectar a bolsa a cada turno",
      "Irrigar rotineiramente sem indicação",
      "Manter cateter por conveniência"
    ]
  },
  {
    "id": "iras-pav",
    "assunto": "IRAS",
    "dificuldade": "medio",
    "pergunta": "qual conjunto de cuidados ajuda a prevenir pneumonia associada à ventilação mecânica?",
    "explicacao": "A prevenção de PAV depende de um conjunto de práticas e revisão diária da necessidade de suporte invasivo.",
    "correta": "Medidas combinadas de prevenção, higiene oral e reavaliação diária da ventilação",
    "distratores": [
      "Trocar circuito a cada turno sem indicação",
      "Manter cabeceira sempre plana",
      "Suspender higiene oral"
    ]
  },
  {
    "id": "iras-precaucao",
    "assunto": "Precauções e Isolamento",
    "dificuldade": "medio",
    "pergunta": "em precaução de contato, qual conduta é apropriada?",
    "explicacao": "Precauções de contato exigem higiene das mãos e manejo adequado de barreiras e equipamentos.",
    "correta": "Usar barreiras indicadas, higienizar as mãos e desinfetar equipamentos compartilhados",
    "distratores": [
      "Dispensar higiene das mãos ao usar luvas",
      "Compartilhar equipamentos sem limpeza",
      "Usar apenas máscara cirúrgica em todas as situações"
    ]
  },
  {
    "id": "urg-triagem",
    "assunto": "Urgência e Emergência",
    "dificuldade": "medio",
    "pergunta": "na classificação de risco, qual princípio deve prevalecer?",
    "explicacao": "A classificação de risco organiza o atendimento conforme gravidade, potencial de deterioração e necessidade clínica.",
    "correta": "Priorizar gravidade e risco, não a ordem de chegada",
    "distratores": [
      "Atender sempre por ordem de chegada",
      "Priorizar apenas pacientes encaminhados",
      "Usar idade como único critério"
    ]
  },
  {
    "id": "urg-rcp",
    "assunto": "Ressuscitação Cardiopulmonar",
    "dificuldade": "facil",
    "pergunta": "ao reconhecer parada cardiorrespiratória em adulto, qual ação deve ser iniciada sem demora?",
    "explicacao": "A RCP precoce com compressões de qualidade é essencial para manter perfusão até medidas avançadas.",
    "correta": "Compressões torácicas de alta qualidade e acionamento do suporte",
    "distratores": [
      "Aguardar o médico antes de tocar no paciente",
      "Oferecer água",
      "Transportar antes de iniciar RCP"
    ]
  },
  {
    "id": "urg-anafilaxia",
    "assunto": "Urgência e Emergência",
    "dificuldade": "dificil",
    "pergunta": "paciente apresenta urticária difusa, dispneia e hipotensão após medicamento. Qual situação deve ser reconhecida?",
    "explicacao": "Comprometimento respiratório e circulatório após exposição compatível caracteriza quadro grave de anafilaxia.",
    "correta": "Anafilaxia com necessidade de tratamento imediato",
    "distratores": [
      "Crise de ansiedade isolada",
      "Hipoglicemia sem sinais associados",
      "Reação local simples"
    ]
  },
  {
    "id": "urg-avc",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "pergunta": "diante de déficit neurológico focal súbito, qual prioridade é adequada?",
    "explicacao": "Tempo de início dos sintomas e ativação rápida do protocolo são decisivos na avaliação do AVC.",
    "correta": "Reconhecer possível AVC, registrar horário de início e acionar fluxo de atendimento",
    "distratores": [
      "Oferecer alimentação antes da avaliação",
      "Aguardar resolução espontânea",
      "Sedá-lo rotineiramente"
    ]
  },
  {
    "id": "urg-trauma",
    "assunto": "Trauma",
    "dificuldade": "medio",
    "pergunta": "na abordagem inicial do politraumatizado, o que deve orientar a sequência do atendimento?",
    "explicacao": "A avaliação sistematizada prioriza problemas que ameaçam vida, com reavaliação contínua.",
    "correta": "Identificar e tratar primeiro ameaças imediatas à vida",
    "distratores": [
      "Realizar curativos antes da via aérea",
      "Investigar antecedentes familiares antes da avaliação primária",
      "Priorizar apenas a dor"
    ]
  },
  {
    "id": "uti-perfusao",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "pergunta": "qual achado sugere hipoperfusão periférica em paciente crítico?",
    "explicacao": "Perfusão periférica reduzida pode se manifestar por extremidades frias e enchimento capilar lento.",
    "correta": "Enchimento capilar prolongado associado a extremidades frias",
    "distratores": [
      "Pele aquecida com perfusão preservada",
      "Apetite aumentado",
      "Poliúria isolada"
    ]
  },
  {
    "id": "uti-oliguria",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "pergunta": "qual alteração deve chamar atenção para possível redução da perfusão renal?",
    "explicacao": "Oligúria pode indicar hipoperfusão, disfunção renal ou outras causas que exigem avaliação clínica.",
    "correta": "Queda persistente do débito urinário",
    "distratores": [
      "Aumento da acuidade visual",
      "Polifagia",
      "Hipertricose"
    ]
  },
  {
    "id": "uti-vasoativo",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "pergunta": "durante infusão de droga vasoativa, qual cuidado é prioritário?",
    "explicacao": "Drogas vasoativas exigem controle rigoroso da infusão e vigilância clínica e do acesso.",
    "correta": "Monitorar hemodinâmica, perfusão e integridade do acesso",
    "distratores": [
      "Administrar sem bomba de infusão quando disponível",
      "Ignorar sinais de extravasamento",
      "Suspender monitorização após a primeira melhora"
    ]
  },
  {
    "id": "uti-delirium",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "pergunta": "qual medida não farmacológica ajuda a reduzir delirium em paciente crítico?",
    "explicacao": "Medidas ambientais, mobilidade e preservação do ciclo sono-vigília ajudam na prevenção do delirium.",
    "correta": "Orientação frequente, sono preservado, mobilização e correção de déficits sensoriais",
    "distratores": [
      "Privação de sono",
      "Restrição física rotineira",
      "Ausência de referências de tempo"
    ]
  },
  {
    "id": "uti-desmame",
    "assunto": "Ventilação Mecânica",
    "dificuldade": "dificil",
    "pergunta": "qual princípio é adequado na avaliação diária de paciente em ventilação mecânica?",
    "explicacao": "A reavaliação diária ajuda a identificar condições para redução segura do suporte ventilatório.",
    "correta": "Reavaliar sedação, condição clínica e possibilidade de reduzir suporte quando apropriado",
    "distratores": [
      "Aumentar sedação automaticamente todos os dias",
      "Evitar qualquer tentativa de redução de suporte",
      "Trocar o tubo diariamente"
    ]
  },
  {
    "id": "card-sca",
    "assunto": "Cardiologia",
    "dificuldade": "medio",
    "pergunta": "na suspeita de síndrome coronariana aguda, qual exame deve ser realizado precocemente quando disponível?",
    "explicacao": "O ECG de 12 derivações é fundamental na avaliação inicial de dor torácica potencialmente isquêmica.",
    "correta": "ECG de 12 derivações",
    "distratores": [
      "Espirometria",
      "Teste ergométrico durante dor ativa",
      "Ultrassom abdominal como primeiro exame"
    ]
  },
  {
    "id": "card-ic-peso",
    "assunto": "Cardiologia",
    "dificuldade": "facil",
    "pergunta": "qual medida domiciliar ajuda a acompanhar retenção hídrica em insuficiência cardíaca?",
    "explicacao": "Mudanças rápidas de peso podem refletir variação de volume em pacientes com insuficiência cardíaca.",
    "correta": "Peso diário em condições semelhantes",
    "distratores": [
      "Altura diária",
      "Circunferência cefálica",
      "Temperatura do banho"
    ]
  },
  {
    "id": "card-edema",
    "assunto": "Cardiologia",
    "dificuldade": "medio",
    "pergunta": "em paciente com insuficiência cardíaca, qual conjunto pode sugerir congestão?",
    "explicacao": "Congestão pode causar dispneia, edema e aumento de peso por retenção de líquido.",
    "correta": "Dispneia, edema periférico e ganho de peso",
    "distratores": [
      "Xerostomia e perda de peso isoladas",
      "Miopia e cefaleia",
      "Prurido localizado sem outros achados"
    ]
  },
  {
    "id": "card-arritmia",
    "assunto": "Cardiologia",
    "dificuldade": "dificil",
    "pergunta": "paciente monitorizado apresenta taquiarritmia e sinais de instabilidade hemodinâmica. Qual é a prioridade?",
    "explicacao": "Arritmia associada a instabilidade exige avaliação e intervenção imediatas conforme protocolo.",
    "correta": "Avaliação imediata e acionamento do protocolo de emergência",
    "distratores": [
      "Aguardar o próximo plantão",
      "Retirar monitorização",
      "Estimular caminhada"
    ]
  },
  {
    "id": "card-sincope",
    "assunto": "Cardiologia",
    "dificuldade": "medio",
    "pergunta": "após episódio de síncope, qual avaliação inicial é apropriada?",
    "explicacao": "Síncope requer avaliação clínica para identificar causas potencialmente graves e risco de recorrência.",
    "correta": "Responsividade, sinais vitais, glicemia quando indicada e avaliação cardiovascular",
    "distratores": [
      "Liberar sem avaliação se recuperar",
      "Oferecer refeição antes de examinar",
      "Considerar sempre causa emocional"
    ]
  },
  {
    "id": "resp-hipoxemia",
    "assunto": "Avaliação Respiratória",
    "dificuldade": "medio",
    "pergunta": "qual conjunto sugere deterioração respiratória?",
    "explicacao": "Hipoxemia e aumento do esforço respiratório podem preceder deterioração clínica.",
    "correta": "Queda da saturação, aumento do trabalho respiratório e alteração do estado mental",
    "distratores": [
      "Apetite preservado e fala normal",
      "Diurese normal isolada",
      "Prurido sem dispneia"
    ]
  },
  {
    "id": "resp-oxigenio",
    "assunto": "Oxigenoterapia",
    "dificuldade": "medio",
    "pergunta": "ao administrar oxigênio, qual prática é adequada?",
    "explicacao": "Oxigenoterapia deve ser individualizada, com dispositivo e fluxo adequados e monitorização da resposta.",
    "correta": "Titular conforme indicação e monitorar resposta clínica e saturação",
    "distratores": [
      "Usar sempre o maior fluxo possível",
      "Suspender monitorização após iniciar",
      "Aplicar sem considerar o dispositivo"
    ]
  },
  {
    "id": "resp-asma",
    "assunto": "Respiratório",
    "dificuldade": "medio",
    "pergunta": "qual achado em crise asmática sugere maior gravidade?",
    "explicacao": "Sinais de exaustão e dificuldade ventilatória indicam necessidade de avaliação urgente.",
    "correta": "Fala entrecortada, uso de musculatura acessória e redução importante do fluxo aéreo",
    "distratores": [
      "Coriza leve isolada",
      "Tosse ocasional sem dispneia",
      "Prurido nasal sem alteração respiratória"
    ]
  },
  {
    "id": "resp-dpoc",
    "assunto": "Respiratório",
    "dificuldade": "medio",
    "pergunta": "em exacerbação de DPOC, qual aspecto deve ser monitorado além da saturação?",
    "explicacao": "Avaliação respiratória deve integrar oxigenação, ventilação e sinais clínicos de fadiga.",
    "correta": "Estado mental, frequência respiratória e trabalho ventilatório",
    "distratores": [
      "Somente temperatura axilar",
      "Apenas peso corporal",
      "Somente ingestão hídrica"
    ]
  },
  {
    "id": "resp-aspiracao",
    "assunto": "Respiratório",
    "dificuldade": "facil",
    "pergunta": "em paciente com risco de broncoaspiração durante alimentação, qual cuidado é adequado?",
    "explicacao": "Posição adequada e avaliação da deglutição reduzem risco de aspiração.",
    "correta": "Posicionamento apropriado e avaliação da deglutição",
    "distratores": [
      "Oferecer grandes volumes rapidamente",
      "Manter totalmente deitado",
      "Ignorar tosse durante a alimentação"
    ]
  },
  {
    "id": "neuro-convulsao",
    "assunto": "Neurologia",
    "dificuldade": "facil",
    "pergunta": "durante crise convulsiva, qual conduta é segura?",
    "explicacao": "Na crise convulsiva deve-se proteger o paciente e evitar manobras que causem trauma.",
    "correta": "Proteger contra traumas, observar duração e manter via aérea livre quando possível",
    "distratores": [
      "Conter membros com força",
      "Introduzir objeto na boca",
      "Oferecer líquido durante a crise"
    ]
  },
  {
    "id": "neuro-avc-degluticao",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "pergunta": "em paciente com AVC agudo, o que deve ocorrer antes de oferta por via oral?",
    "explicacao": "Disfagia é frequente após AVC e a avaliação antes da via oral reduz broncoaspiração.",
    "correta": "Avaliação da deglutição",
    "distratores": [
      "Teste de visão de cores",
      "Circunferência abdominal",
      "Avaliação dermatológica"
    ]
  },
  {
    "id": "neuro-pupilas",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "pergunta": "qual alteração neurológica em paciente com trauma craniano exige reavaliação rápida?",
    "explicacao": "Deterioração do nível de consciência ou alteração pupilar pode indicar piora neurológica.",
    "correta": "Piora do nível de consciência ou nova assimetria pupilar",
    "distratores": [
      "Fome após jejum",
      "Prurido no braço",
      "Sono habitual no horário noturno sem outros sinais"
    ]
  },
  {
    "id": "neuro-meningite",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "pergunta": "febre, rigidez de nuca e alteração do estado mental sugerem qual necessidade?",
    "explicacao": "Meningite é condição potencialmente grave e requer avaliação rápida e precauções apropriadas.",
    "correta": "Avaliação imediata para síndrome meníngea e medidas de precaução conforme suspeita",
    "distratores": [
      "Alta sem investigação",
      "Apenas hidratação oral domiciliar",
      "Exercício físico"
    ]
  },
  {
    "id": "neuro-delirium",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "pergunta": "qual característica diferencia delirium de uma demência estável?",
    "explicacao": "Delirium tipicamente apresenta início agudo, flutuação e prejuízo da atenção.",
    "correta": "Início agudo e curso flutuante com alteração da atenção",
    "distratores": [
      "Evolução lenta ao longo de anos",
      "Atenção sempre preservada",
      "Ausência de flutuação"
    ]
  },
  {
    "id": "nefro-hipercalemia",
    "assunto": "Nefrologia",
    "dificuldade": "dificil",
    "pergunta": "qual distúrbio eletrolítico em doença renal pode elevar o risco de arritmias graves?",
    "explicacao": "Potássio elevado pode alterar a condução cardíaca e causar arritmias potencialmente fatais.",
    "correta": "Hipercalemia",
    "distratores": [
      "Hipouricemia",
      "Hipoalbuminemia leve isolada",
      "Hipocolesterolemia"
    ]
  },
  {
    "id": "nefro-balanco",
    "assunto": "Nefrologia",
    "dificuldade": "facil",
    "pergunta": "qual registro é especialmente útil para acompanhar estado volêmico?",
    "explicacao": "Entradas, saídas e peso seriado ajudam a avaliar variações do volume corporal.",
    "correta": "Balanço hídrico e peso corporal seriado",
    "distratores": [
      "Cor do cabelo",
      "Altura diária",
      "Acuidade visual"
    ]
  },
  {
    "id": "nefro-fistula",
    "assunto": "Hemodiálise",
    "dificuldade": "medio",
    "pergunta": "em membro com fístula arteriovenosa para hemodiálise, qual cuidado é apropriado?",
    "explicacao": "A preservação do acesso inclui evitar compressões e punções desnecessárias e avaliar sua permeabilidade.",
    "correta": "Evitar punções e aferição de pressão no membro da fístula",
    "distratores": [
      "Usar o membro preferencialmente para coleta de sangue",
      "Comprimir continuamente a fístula",
      "Ignorar ausência de frêmito"
    ]
  },
  {
    "id": "nefro-ira",
    "assunto": "Nefrologia",
    "dificuldade": "medio",
    "pergunta": "em paciente com risco de lesão renal aguda, qual tendência exige atenção?",
    "explicacao": "Alterações da função renal e diurese devem ser acompanhadas para reconhecer deterioração precoce.",
    "correta": "Elevação de creatinina associada a redução do débito urinário",
    "distratores": [
      "Melhora do apetite",
      "Sono regular",
      "Redução da dor muscular"
    ]
  },
  {
    "id": "nefro-sobrecarga",
    "assunto": "Nefrologia",
    "dificuldade": "medio",
    "pergunta": "qual conjunto pode indicar sobrecarga volêmica em doença renal?",
    "explicacao": "Acúmulo de líquido pode se manifestar por edema, congestão pulmonar e aumento de peso.",
    "correta": "Edema, dispneia e ganho de peso",
    "distratores": [
      "Xerostomia e perda de peso",
      "Bradicardia isolada em atleta",
      "Prurido localizado"
    ]
  },
  {
    "id": "endo-hipoglicemia",
    "assunto": "Diabetes Mellitus",
    "dificuldade": "facil",
    "pergunta": "paciente consciente, capaz de deglutir, apresenta hipoglicemia sintomática. Qual conduta inicial é adequada?",
    "explicacao": "Em hipoglicemia consciente, carboidrato de ação rápida e reavaliação são medidas iniciais usuais.",
    "correta": "Ofertar carboidrato de absorção rápida e reavaliar glicemia",
    "distratores": [
      "Administrar insulina rápida",
      "Manter jejum",
      "Aguardar melhora espontânea"
    ]
  },
  {
    "id": "endo-insulina",
    "assunto": "Diabetes Mellitus",
    "dificuldade": "medio",
    "pergunta": "antes de administrar insulina, qual conferência é especialmente importante?",
    "explicacao": "Insulina é medicamento de alto risco e exige checagem cuidadosa da prescrição e do contexto clínico.",
    "correta": "Tipo de insulina, dose, horário, glicemia e relação com alimentação",
    "distratores": [
      "Somente cor da caneta",
      "Apenas nome comercial",
      "Somente temperatura ambiente"
    ]
  },
  {
    "id": "endo-cetoacidose",
    "assunto": "Diabetes Mellitus",
    "dificuldade": "dificil",
    "pergunta": "hiperglicemia, desidratação, náuseas e respiração profunda sugerem qual emergência?",
    "explicacao": "Cetoacidose diabética cursa com hiperglicemia, cetose, acidose e desidratação, exigindo tratamento imediato.",
    "correta": "Cetoacidose diabética",
    "distratores": [
      "Hipotireoidismo subclínico",
      "Rinite alérgica",
      "Anemia ferropriva isolada"
    ]
  },
  {
    "id": "endo-pe-diabetico",
    "assunto": "Diabetes Mellitus",
    "dificuldade": "medio",
    "pergunta": "qual orientação ajuda a prevenir complicações nos pés em pessoa com diabetes?",
    "explicacao": "Cuidados diários e identificação precoce de lesões reduzem risco de úlceras e infecção.",
    "correta": "Inspeção diária, higiene, calçado adequado e avaliação de lesões",
    "distratores": [
      "Andar descalço para fortalecer a pele",
      "Cortar calos com lâmina em casa",
      "Usar bolsas de água quente nos pés"
    ]
  },
  {
    "id": "endo-tireoide",
    "assunto": "Endocrinologia",
    "dificuldade": "medio",
    "pergunta": "em paciente em uso de levotiroxina, qual orientação geral favorece uso correto?",
    "explicacao": "A adesão e o respeito às orientações de administração e interações são essenciais ao tratamento.",
    "correta": "Seguir horário e forma de administração prescritos e evitar mudanças sem orientação",
    "distratores": [
      "Duplicar dose sempre que esquecer",
      "Suspender ao melhorar sintomas",
      "Associar livremente a suplementos sem considerar interações"
    ]
  },
  {
    "id": "hemo-transfusao",
    "assunto": "Hemoterapia",
    "dificuldade": "medio",
    "pergunta": "durante transfusão surgem febre, calafrios e dispneia. Qual conduta inicial é adequada?",
    "explicacao": "Sinais de reação transfusional exigem interrupção imediata e avaliação conforme protocolo.",
    "correta": "Interromper a transfusão e avaliar o paciente imediatamente",
    "distratores": [
      "Aumentar a velocidade",
      "Trocar apenas o equipo e continuar",
      "Aguardar terminar a bolsa"
    ]
  },
  {
    "id": "hemo-identificacao",
    "assunto": "Hemoterapia",
    "dificuldade": "facil",
    "pergunta": "qual etapa é crítica antes de iniciar hemocomponente?",
    "explicacao": "A checagem à beira leito reduz risco de transfusão incompatível.",
    "correta": "Conferir identificação do paciente e compatibilidade do hemocomponente conforme protocolo",
    "distratores": [
      "Conferir apenas o número do quarto",
      "Abrir a bolsa horas antes",
      "Misturar medicamentos na bolsa"
    ]
  },
  {
    "id": "hemo-sangramento",
    "assunto": "Hematologia",
    "dificuldade": "medio",
    "pergunta": "paciente com plaquetopenia importante deve ser observado especialmente para qual sinal?",
    "explicacao": "Plaquetopenia aumenta risco hemorrágico e requer vigilância de sinais de sangramento.",
    "correta": "Sangramento espontâneo ou novo",
    "distratores": [
      "Aumento da força muscular",
      "Hipertricose",
      "Aumento do apetite"
    ]
  },
  {
    "id": "hemo-neutropenia",
    "assunto": "Hematologia",
    "dificuldade": "medio",
    "pergunta": "em paciente neutropênico com febre, qual postura é adequada?",
    "explicacao": "Febre em neutropenia pode representar infecção grave e exige avaliação rápida.",
    "correta": "Reconhecer possível emergência infecciosa e comunicar imediatamente",
    "distratores": [
      "Aguardar 24 horas para reavaliar",
      "Oferecer antitérmico e liberar",
      "Suspender todas as medidas de prevenção de infecção"
    ]
  },
  {
    "id": "hemo-anemia",
    "assunto": "Hematologia",
    "dificuldade": "facil",
    "pergunta": "qual conjunto pode ser compatível com anemia sintomática?",
    "explicacao": "Redução da capacidade de transporte de oxigênio pode causar fadiga, palidez e sintomas cardiorrespiratórios.",
    "correta": "Fadiga, palidez, dispneia aos esforços e taquicardia",
    "distratores": [
      "Edema localizado após trauma",
      "Prurido nasal isolado",
      "Poliúria com sede intensa"
    ]
  },
  {
    "id": "mulher-rastreamento",
    "assunto": "Saúde da Mulher",
    "dificuldade": "medio",
    "pergunta": "qual princípio orienta ações de rastreamento de câncer do colo do útero?",
    "explicacao": "Rastreamento deve seguir recomendações de faixa etária, método e periodicidade estabelecidas.",
    "correta": "Seguir população-alvo, periodicidade e método definidos nas diretrizes vigentes",
    "distratores": [
      "Realizar exame diário em todas as mulheres",
      "Rastrear apenas quando houver dor",
      "Substituir rastreamento por ultrassom de rotina"
    ]
  },
  {
    "id": "mulher-mastite",
    "assunto": "Saúde da Mulher",
    "dificuldade": "medio",
    "pergunta": "puérpera lactante apresenta dor mamária, área eritematosa e febre. Qual condição deve ser considerada?",
    "explicacao": "Dor localizada, eritema e febre durante lactação podem indicar mastite e requerem avaliação.",
    "correta": "Mastite puerperal",
    "distratores": [
      "Apendicite",
      "Otite",
      "Hipotireoidismo"
    ]
  },
  {
    "id": "mulher-violencia",
    "assunto": "Saúde da Mulher",
    "dificuldade": "dificil",
    "pergunta": "diante de relato de violência, qual postura de enfermagem é adequada?",
    "explicacao": "A abordagem deve ser acolhedora, confidencial e orientada à segurança e aos fluxos legais e assistenciais.",
    "correta": "Acolher sem julgamento, garantir privacidade, avaliar segurança e seguir fluxos de cuidado e notificação",
    "distratores": [
      "Confrontar a pessoa agressora na frente da vítima",
      "Culpar a vítima pelas circunstâncias",
      "Divulgar o relato à equipe sem necessidade"
    ]
  },
  {
    "id": "mulher-contracepcao",
    "assunto": "Saúde da Mulher",
    "dificuldade": "medio",
    "pergunta": "ao orientar contracepção, qual princípio deve ser respeitado?",
    "explicacao": "Decisão compartilhada e informação adequada apoiam escolha contraceptiva segura.",
    "correta": "Escolha informada considerando preferências, condições clínicas e contraindicações",
    "distratores": [
      "Impor o método mais barato",
      "Omitir efeitos adversos",
      "Ignorar planos reprodutivos"
    ]
  },
  {
    "id": "mulher-climaterio",
    "assunto": "Saúde da Mulher",
    "dificuldade": "facil",
    "pergunta": "qual abordagem é adequada no climatério?",
    "explicacao": "O cuidado no climatério deve ser individualizado e incluir promoção da saúde e avaliação de riscos.",
    "correta": "Avaliar sintomas, riscos, estilo de vida e necessidades individuais",
    "distratores": [
      "Considerar toda queixa como inevitável e sem tratamento",
      "Prescrever hormônio para todas",
      "Evitar orientação sobre saúde óssea"
    ]
  },
  {
    "id": "obst-pre-eclampsia",
    "assunto": "Obstetrícia",
    "dificuldade": "dificil",
    "pergunta": "gestante hipertensa apresenta cefaleia intensa e alterações visuais. Qual conduta é adequada?",
    "explicacao": "Sintomas neurológicos em contexto hipertensivo gestacional são sinais de alerta para doença grave.",
    "correta": "Reconhecer sinais de gravidade e realizar avaliação imediata",
    "distratores": [
      "Orientar repouso domiciliar sem avaliação",
      "Oferecer apenas analgésico e liberar",
      "Aguardar a próxima consulta"
    ]
  },
  {
    "id": "obst-hpp",
    "assunto": "Obstetrícia",
    "dificuldade": "dificil",
    "pergunta": "puérpera apresenta sangramento intenso e sinais de instabilidade. Qual prioridade é adequada?",
    "explicacao": "Hemorragia pós-parto é emergência e requer resposta imediata e coordenada.",
    "correta": "Acionar protocolo de hemorragia, avaliar perfusão e iniciar medidas de suporte",
    "distratores": [
      "Aguardar involução uterina espontânea",
      "Estimular deambulação",
      "Oferecer dieta antes de avaliar"
    ]
  },
  {
    "id": "obst-partograma",
    "assunto": "Obstetrícia",
    "dificuldade": "medio",
    "pergunta": "qual é a finalidade do acompanhamento sistemático da evolução do trabalho de parto?",
    "explicacao": "O registro sistemático apoia avaliação da evolução materna e fetal e tomada de decisão.",
    "correta": "Reconhecer progressão e alterações que exijam reavaliação da conduta",
    "distratores": [
      "Determinar sexo fetal",
      "Substituir ausculta fetal",
      "Definir automaticamente via de parto"
    ]
  },
  {
    "id": "obst-bolsa",
    "assunto": "Obstetrícia",
    "dificuldade": "medio",
    "pergunta": "na ruptura de membranas, qual informação deve ser observada e registrada?",
    "explicacao": "Características do líquido e avaliação materno-fetal ajudam a identificar riscos após ruptura das membranas.",
    "correta": "Horário, aspecto do líquido, sinais maternos e condição fetal",
    "distratores": [
      "Somente cor da roupa",
      "Apenas peso materno",
      "Somente idade gestacional sem outros dados"
    ]
  },
  {
    "id": "obst-puerperio",
    "assunto": "Obstetrícia",
    "dificuldade": "facil",
    "pergunta": "no puerpério imediato, qual conjunto deve ser monitorado?",
    "explicacao": "Vigilância do sangramento e da estabilidade materna permite reconhecer complicações precocemente.",
    "correta": "Sangramento, tônus uterino, sinais vitais e estado geral",
    "distratores": [
      "Somente peso corporal",
      "Apenas ingesta alimentar",
      "Apenas dor lombar"
    ]
  },
  {
    "id": "neo-termorreg",
    "assunto": "Neonatologia",
    "dificuldade": "facil",
    "pergunta": "qual medida ajuda a prevenir hipotermia no recém-nascido após o nascimento?",
    "explicacao": "Recém-nascidos perdem calor rapidamente; secagem e contato pele a pele auxiliam termorregulação.",
    "correta": "Secagem, contato pele a pele e ambiente térmico adequado",
    "distratores": [
      "Banho imediato prolongado",
      "Manter roupa molhada",
      "Expor a correntes de ar"
    ]
  },
  {
    "id": "neo-ictericia",
    "assunto": "Neonatologia",
    "dificuldade": "medio",
    "pergunta": "icterícia nas primeiras 24 horas de vida exige qual postura?",
    "explicacao": "Icterícia muito precoce necessita investigação por maior probabilidade de condição patológica.",
    "correta": "Avaliação clínica imediata por ser achado potencialmente patológico",
    "distratores": [
      "Considerar sempre fisiológica",
      "Aguardar uma semana",
      "Expor ao sol como única medida"
    ]
  },
  {
    "id": "neo-amamentacao",
    "assunto": "Neonatologia",
    "dificuldade": "facil",
    "pergunta": "qual sinal sugere pega adequada na amamentação?",
    "explicacao": "Pega profunda e posicionamento adequado favorecem transferência de leite e previnem trauma mamilar.",
    "correta": "Boca bem aberta, maior porção da aréola inferior na boca e sucção efetiva sem dor persistente",
    "distratores": [
      "Mamilos comprimidos e dor intensa",
      "Estalos constantes e bochechas encovadas",
      "Sucção superficial apenas no mamilo"
    ]
  },
  {
    "id": "neo-respiracao",
    "assunto": "Neonatologia",
    "dificuldade": "medio",
    "pergunta": "qual achado respiratório em recém-nascido indica necessidade de avaliação rápida?",
    "explicacao": "Sinais de desconforto respiratório neonatal exigem avaliação imediata.",
    "correta": "Gemência, tiragens e cianose",
    "distratores": [
      "Espirros ocasionais isolados",
      "Soluço após mamada",
      "Bocejo"
    ]
  },
  {
    "id": "neo-infeccao",
    "assunto": "Neonatologia",
    "dificuldade": "dificil",
    "pergunta": "qual conjunto pode sugerir infecção neonatal?",
    "explicacao": "Infecção neonatal pode se manifestar de forma inespecífica com alterações térmicas, alimentares e respiratórias.",
    "correta": "Instabilidade térmica, dificuldade alimentar, letargia e alteração respiratória",
    "distratores": [
      "Apenas soluço",
      "Reflexo de busca presente",
      "Sono tranquilo entre mamadas"
    ]
  },
  {
    "id": "ped-desidratacao",
    "assunto": "Pediatria",
    "dificuldade": "medio",
    "pergunta": "qual achado pode indicar desidratação significativa em criança?",
    "explicacao": "Estado geral, perfusão, mucosas e diurese ajudam a estimar gravidade da desidratação.",
    "correta": "Letargia, mucosas secas e redução da diurese",
    "distratores": [
      "Apetite aumentado",
      "Lacrimejamento normal",
      "Diurese aumentada"
    ]
  },
  {
    "id": "ped-respiratoria",
    "assunto": "Pediatria",
    "dificuldade": "medio",
    "pergunta": "qual achado em criança com infecção respiratória indica maior gravidade?",
    "explicacao": "Cianose, tiragem e dificuldade respiratória importante exigem avaliação urgente.",
    "correta": "Cianose ou esforço respiratório importante",
    "distratores": [
      "Coriza leve isolada",
      "Tosse ocasional sem esforço",
      "Apetite preservado"
    ]
  },
  {
    "id": "ped-febre",
    "assunto": "Pediatria",
    "dificuldade": "medio",
    "pergunta": "em lactente jovem com febre, qual postura é mais segura?",
    "explicacao": "Febre em lactentes jovens pode ser manifestação de infecção grave e merece avaliação apropriada.",
    "correta": "Considerar idade e estado geral e realizar avaliação clínica precoce",
    "distratores": [
      "Presumir quadro viral sem avaliação",
      "Usar antibiótico por conta própria",
      "Esperar vários dias independentemente da idade"
    ]
  },
  {
    "id": "ped-medicacao",
    "assunto": "Pediatria",
    "dificuldade": "medio",
    "pergunta": "antes de administrar medicamento pediátrico, qual dado é essencial para muitas doses?",
    "explicacao": "Muitas doses pediátricas são calculadas por peso e exigem conferência rigorosa de unidades.",
    "correta": "Peso atual da criança e prescrição em unidade correta",
    "distratores": [
      "Tamanho do calçado",
      "Altura dos pais",
      "Cor dos olhos"
    ]
  },
  {
    "id": "ped-seguranca",
    "assunto": "Pediatria",
    "dificuldade": "facil",
    "pergunta": "qual medida reduz risco de acidentes na hospitalização pediátrica?",
    "explicacao": "Prevenção de acidentes deve considerar estágio de desenvolvimento e riscos ambientais.",
    "correta": "Adequar ambiente à idade e manter supervisão conforme desenvolvimento",
    "distratores": [
      "Deixar grades abaixadas em lactentes",
      "Manter objetos pequenos ao alcance",
      "Permitir medicação sem conferência do responsável pela administração"
    ]
  },
  {
    "id": "mental-suicidio",
    "assunto": "Saúde Mental",
    "dificuldade": "dificil",
    "pergunta": "diante de pessoa com ideação suicida, qual abordagem inicial é adequada?",
    "explicacao": "Avaliação direta de ideação, plano, meios e proteção é essencial para manejo do risco.",
    "correta": "Perguntar diretamente sobre risco, garantir segurança e acionar suporte especializado",
    "distratores": [
      "Evitar falar sobre suicídio",
      "Deixar a pessoa sozinha",
      "Minimizar o relato"
    ]
  },
  {
    "id": "mental-agitacao",
    "assunto": "Saúde Mental",
    "dificuldade": "medio",
    "pergunta": "em paciente agitado, qual estratégia inicial favorece segurança?",
    "explicacao": "Desescalada verbal e controle ambiental são medidas iniciais importantes.",
    "correta": "Ambiente calmo, comunicação clara, distância segura e redução de estímulos",
    "distratores": [
      "Aumentar o tom de voz",
      "Cercar o paciente com muitas pessoas",
      "Provocar confronto"
    ]
  },
  {
    "id": "mental-delirium",
    "assunto": "Saúde Mental",
    "dificuldade": "medio",
    "pergunta": "qual achado favorece delirium em vez de transtorno psiquiátrico primário?",
    "explicacao": "Delirium é síndrome orgânica aguda com alteração de atenção e curso flutuante.",
    "correta": "Flutuação rápida da atenção e consciência associada a condição clínica",
    "distratores": [
      "Sintomas estáveis por anos",
      "Atenção plenamente preservada",
      "Ausência de variação ao longo do dia"
    ]
  },
  {
    "id": "mental-ansiedade",
    "assunto": "Saúde Mental",
    "dificuldade": "facil",
    "pergunta": "durante crise de ansiedade sem sinais de emergência orgânica, qual intervenção de enfermagem pode ajudar?",
    "explicacao": "Presença terapêutica e técnicas simples de regulação podem reduzir sintomas após exclusão de causas graves.",
    "correta": "Acolher, orientar respiração lenta e reduzir estímulos",
    "distratores": [
      "Dizer que a pessoa deve simplesmente parar",
      "Deixar sozinha sem avaliação",
      "Oferecer estimulantes"
    ]
  },
  {
    "id": "mental-substancia",
    "assunto": "Saúde Mental",
    "dificuldade": "medio",
    "pergunta": "em suspeita de abstinência de álcool, qual achado aumenta preocupação com gravidade?",
    "explicacao": "Abstinência grave pode evoluir com convulsões, delirium e instabilidade autonômica.",
    "correta": "Confusão, alucinações, convulsões ou instabilidade autonômica",
    "distratores": [
      "Apetite preservado",
      "Sono normal",
      "Ausência de tremor"
    ]
  },
  {
    "id": "idoso-delirium",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "pergunta": "em idoso hospitalizado, qual medida ajuda a prevenir delirium?",
    "explicacao": "Intervenções multicomponentes não farmacológicas reduzem fatores precipitantes de delirium.",
    "correta": "Mobilização, orientação, sono adequado e uso de óculos/aparelhos auditivos quando necessários",
    "distratores": [
      "Restrição física preventiva",
      "Privação de sono",
      "Ambiente sem relógio ou luz natural"
    ]
  },
  {
    "id": "idoso-quedas",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "pergunta": "qual fator deve ser revisado em idoso com quedas recorrentes?",
    "explicacao": "Quedas são multifatoriais e exigem avaliação clínica, funcional e ambiental.",
    "correta": "Medicamentos, visão, marcha, ambiente e hipotensão postural",
    "distratores": [
      "Somente cor do calçado",
      "Apenas idade cronológica",
      "Somente peso"
    ]
  },
  {
    "id": "idoso-polifarmacia",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "pergunta": "qual atitude é adequada diante de polifarmácia?",
    "explicacao": "Reconciliação e revisão sistemática ajudam a reduzir eventos adversos e tratamentos desnecessários.",
    "correta": "Revisar indicação, duplicidades, interações e adesão",
    "distratores": [
      "Adicionar medicamentos para cada sintoma sem revisão",
      "Suspender todos de uma vez",
      "Ignorar medicamentos sem prescrição"
    ]
  },
  {
    "id": "idoso-fragilidade",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "pergunta": "qual achado pode sugerir fragilidade clínica?",
    "explicacao": "Fragilidade envolve redução de reserva fisiológica e maior vulnerabilidade a estressores.",
    "correta": "Perda de peso não intencional, fraqueza e redução de atividade",
    "distratores": [
      "Aumento de massa muscular",
      "Melhora da velocidade de marcha",
      "Aumento de atividade física"
    ]
  },
  {
    "id": "idoso-lesao",
    "assunto": "Saúde do Idoso",
    "dificuldade": "facil",
    "pergunta": "em idoso com pele frágil, qual cuidado é adequado?",
    "explicacao": "Pele envelhecida é mais suscetível a trauma por fricção, cisalhamento e adesivos.",
    "correta": "Evitar fricção excessiva e proteger a pele durante transferências",
    "distratores": [
      "Usar adesivos agressivos sempre que possível",
      "Massagear áreas com lesão ativa",
      "Arrastar o paciente no leito"
    ]
  },
  {
    "id": "onco-neutropenia",
    "assunto": "Oncologia",
    "dificuldade": "dificil",
    "pergunta": "paciente em quimioterapia apresenta febre e neutropenia. Qual postura é adequada?",
    "explicacao": "Neutropenia febril pode evoluir rapidamente e exige avaliação e tratamento precoces.",
    "correta": "Tratar como possível emergência infecciosa e comunicar imediatamente",
    "distratores": [
      "Aguardar consulta agendada",
      "Usar apenas antitérmico",
      "Orientar exercícios intensos"
    ]
  },
  {
    "id": "onco-extravasamento",
    "assunto": "Oncologia",
    "dificuldade": "dificil",
    "pergunta": "durante infusão de antineoplásico vesicante surge dor e edema no acesso. Qual conduta inicial é apropriada?",
    "explicacao": "Extravasamento de vesicante exige interrupção imediata e manejo específico conforme o agente.",
    "correta": "Interromper a infusão e seguir protocolo de extravasamento preservando o acesso para medidas indicadas",
    "distratores": [
      "Aumentar a velocidade",
      "Massagear vigorosamente",
      "Retirar o acesso imediatamente antes de qualquer avaliação"
    ]
  },
  {
    "id": "onco-mucosite",
    "assunto": "Oncologia",
    "dificuldade": "medio",
    "pergunta": "qual cuidado ajuda no manejo de mucosite oral?",
    "explicacao": "Cuidados suaves da mucosa e controle de sintomas ajudam a reduzir complicações.",
    "correta": "Higiene oral suave, avaliação da dor e orientação de alimentação tolerável",
    "distratores": [
      "Enxaguante alcoólico concentrado",
      "Alimentos muito ácidos e picantes",
      "Suspender higiene oral"
    ]
  },
  {
    "id": "paliativos-dor",
    "assunto": "Cuidados Paliativos",
    "dificuldade": "medio",
    "pergunta": "qual princípio orienta o controle de sintomas em cuidados paliativos?",
    "explicacao": "Cuidados paliativos priorizam conforto, comunicação e decisões alinhadas a valores e objetivos.",
    "correta": "Avaliação contínua, alívio proporcional ao sofrimento e respeito às metas de cuidado",
    "distratores": [
      "Tratar apenas sinais vitais",
      "Evitar opioides em qualquer situação",
      "Ignorar preferências do paciente"
    ]
  },
  {
    "id": "paliativos-comunicacao",
    "assunto": "Cuidados Paliativos",
    "dificuldade": "medio",
    "pergunta": "ao discutir metas de cuidado, qual abordagem é adequada?",
    "explicacao": "Comunicação centrada na pessoa permite alinhar tratamentos às metas e valores.",
    "correta": "Explorar valores, compreensão e preferências do paciente e família",
    "distratores": [
      "Usar termos técnicos sem explicação",
      "Tomar decisões sem participação do paciente capaz",
      "Evitar perguntas sobre prioridades"
    ]
  },
  {
    "id": "farm-alto-risco",
    "assunto": "Administração de Medicamentos",
    "dificuldade": "medio",
    "pergunta": "qual prática é indicada para medicamentos de alto risco?",
    "explicacao": "Medicamentos de alto risco requerem controles adicionais para reduzir danos.",
    "correta": "Adotar barreiras adicionais de checagem e monitorização conforme protocolo",
    "distratores": [
      "Dispensar dupla conferência quando apressado",
      "Preparar sem rótulo",
      "Armazenar junto a produtos semelhantes sem diferenciação"
    ]
  },
  {
    "id": "farm-reconciliacao",
    "assunto": "Administração de Medicamentos",
    "dificuldade": "medio",
    "pergunta": "qual é o objetivo da reconciliação medicamentosa na admissão?",
    "explicacao": "Reconciliação busca identificar discrepâncias não intencionais nas transições de cuidado.",
    "correta": "Comparar medicamentos de uso prévio com a prescrição atual e resolver discrepâncias",
    "distratores": [
      "Suspender automaticamente todos os medicamentos",
      "Copiar receitas antigas sem revisar",
      "Registrar apenas vitaminas"
    ]
  },
  {
    "id": "farm-anticoagulante",
    "assunto": "Farmacologia",
    "dificuldade": "dificil",
    "pergunta": "em paciente usando anticoagulante, qual achado deve ser comunicado prontamente?",
    "explicacao": "Anticoagulação aumenta risco hemorrágico e exige vigilância de sinais de sangramento.",
    "correta": "Sangramento novo ou sinais de hemorragia",
    "distratores": [
      "Apetite aumentado",
      "Pele seca isolada",
      "Espirros ocasionais"
    ]
  },
  {
    "id": "farm-opioide",
    "assunto": "Farmacologia",
    "dificuldade": "dificil",
    "pergunta": "após opioide, qual parâmetro é essencial monitorar por risco de depressão respiratória?",
    "explicacao": "Opioides podem reduzir ventilação e consciência; monitorização respiratória é fundamental.",
    "correta": "Frequência respiratória, nível de consciência e oxigenação",
    "distratores": [
      "Somente temperatura",
      "Somente peso",
      "Apenas glicemia"
    ]
  },
  {
    "id": "farm-antibiotico",
    "assunto": "Uso Racional de Antimicrobianos",
    "dificuldade": "medio",
    "pergunta": "qual conduta favorece uso racional de antimicrobianos?",
    "explicacao": "Revisão da terapia conforme dados clínicos e microbiológicos reduz uso desnecessário e resistência.",
    "correta": "Reavaliar indicação, dose, duração e espectro conforme evolução e culturas",
    "distratores": [
      "Manter amplo espectro indefinidamente",
      "Iniciar antibiótico para qualquer febre sem avaliação",
      "Ignorar culturas disponíveis"
    ]
  },
  {
    "id": "iv-infiltracao",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "facil",
    "pergunta": "qual achado sugere infiltração em acesso venoso periférico?",
    "explicacao": "Infiltração ocorre quando solução não vesicante extravasa para o tecido, causando edema e desconforto.",
    "correta": "Edema, resfriamento e desconforto ao redor do acesso",
    "distratores": [
      "Fluxo livre sem sintomas",
      "Local seco e indolor",
      "Ausência de edema"
    ]
  },
  {
    "id": "iv-flebite",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "medio",
    "pergunta": "qual conjunto sugere flebite em acesso periférico?",
    "explicacao": "Flebite é inflamação da veia e pode causar dor, calor, eritema e cordão palpável.",
    "correta": "Dor, eritema, calor e endurecimento ao longo da veia",
    "distratores": [
      "Pele fria sem dor",
      "Ausência de sinais locais",
      "Prurido distante do acesso"
    ]
  },
  {
    "id": "iv-permeabilidade",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "medio",
    "pergunta": "antes de infundir medicamento por acesso venoso, qual avaliação é adequada?",
    "explicacao": "A avaliação do acesso reduz risco de infiltração, extravasamento e outras complicações.",
    "correta": "Verificar permeabilidade e sinais de complicação no sítio",
    "distratores": [
      "Ignorar dor relatada",
      "Forçar infusão diante de resistência",
      "Cobrir o local para não inspecionar"
    ]
  },
  {
    "id": "iv-bomba",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "facil",
    "pergunta": "qual vantagem da bomba de infusão em terapias que exigem precisão?",
    "explicacao": "Bombas aumentam precisão, mas continuam exigindo programação correta e monitorização.",
    "correta": "Controle programado da velocidade e do volume de infusão",
    "distratores": [
      "Elimina necessidade de monitorização",
      "Impede qualquer erro de programação",
      "Substitui conferência da prescrição"
    ]
  },
  {
    "id": "iv-cvc-curativo",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "medio",
    "pergunta": "qual princípio é importante no cuidado do curativo de cateter central?",
    "explicacao": "Manutenção asséptica e inspeção do sítio ajudam a prevenir infecção e detectar complicações.",
    "correta": "Manter técnica asséptica e avaliar sítio e integridade do curativo",
    "distratores": [
      "Manipular conexões sem higiene das mãos",
      "Molhar o curativo rotineiramente",
      "Cobrir sinais de secreção sem avaliar"
    ]
  },
  {
    "id": "ferida-lpp-estagio",
    "assunto": "Feridas",
    "dificuldade": "medio",
    "pergunta": "pele íntegra com eritema não branqueável sobre proeminência óssea corresponde a qual condição?",
    "explicacao": "Eritema não branqueável em pele íntegra é característica de lesão por pressão estágio 1.",
    "correta": "Lesão por pressão estágio 1",
    "distratores": [
      "Lesão por pressão estágio 4",
      "Ferida cirúrgica infectada",
      "Escoriação simples obrigatoriamente"
    ]
  },
  {
    "id": "ferida-infeccao",
    "assunto": "Feridas",
    "dificuldade": "medio",
    "pergunta": "qual conjunto pode sugerir infecção de ferida?",
    "explicacao": "Mudança desfavorável local associada a sinais sistêmicos pode indicar infecção.",
    "correta": "Aumento de dor, eritema progressivo, calor, secreção purulenta ou sinais sistêmicos",
    "distratores": [
      "Redução progressiva de exsudato",
      "Granulação saudável",
      "Diminuição do edema"
    ]
  },
  {
    "id": "ferida-exsudato",
    "assunto": "Feridas",
    "dificuldade": "facil",
    "pergunta": "por que avaliar quantidade e aspecto do exsudato é importante?",
    "explicacao": "Exsudato é parte da avaliação sistemática da ferida e pode sinalizar alterações de cicatrização.",
    "correta": "Ajuda a acompanhar cicatrização e identificar complicações",
    "distratores": [
      "Serve apenas para escolher a cor do curativo",
      "Não tem relação com a evolução",
      "Substitui avaliação da pele ao redor"
    ]
  },
  {
    "id": "estomia-pele",
    "assunto": "Estomias",
    "dificuldade": "medio",
    "pergunta": "qual cuidado ajuda a prevenir dermatite periestomal?",
    "explicacao": "Bom ajuste do sistema coletor reduz contato do efluente com a pele.",
    "correta": "Ajustar adequadamente o dispositivo e proteger a pele contra contato prolongado com efluente",
    "distratores": [
      "Usar abertura muito maior que o estoma",
      "Aplicar produtos irritantes de rotina",
      "Deixar vazamentos persistirem"
    ]
  },
  {
    "id": "ferida-desbridamento",
    "assunto": "Feridas",
    "dificuldade": "dificil",
    "pergunta": "a escolha do método de desbridamento deve considerar principalmente o quê?",
    "explicacao": "Desbridamento deve ser individualizado conforme características da ferida e condição do paciente.",
    "correta": "Tipo de tecido, perfusão, infecção, dor e condição clínica",
    "distratores": [
      "Apenas preferência estética",
      "Somente idade do paciente",
      "Cor do curativo disponível"
    ]
  },
  {
    "id": "nutri-sonda",
    "assunto": "Nutrição Enteral",
    "dificuldade": "medio",
    "pergunta": "antes de administrar dieta por sonda, qual cuidado é adequado?",
    "explicacao": "Administração segura exige confirmação e medidas para reduzir broncoaspiração e obstrução.",
    "correta": "Confirmar posicionamento conforme protocolo e avaliar tolerância e risco de aspiração",
    "distratores": [
      "Infundir com paciente totalmente deitado",
      "Ignorar tosse e desconforto",
      "Adicionar medicamentos diretamente à fórmula sem avaliação"
    ]
  },
  {
    "id": "nutri-aspiracao",
    "assunto": "Nutrição Enteral",
    "dificuldade": "facil",
    "pergunta": "qual posição ajuda a reduzir risco de aspiração durante dieta enteral quando não houver contraindicação?",
    "explicacao": "Elevação da cabeceira ajuda a reduzir refluxo e broncoaspiração durante alimentação enteral.",
    "correta": "Cabeceira elevada conforme protocolo institucional",
    "distratores": [
      "Trendelenburg",
      "Decúbito totalmente horizontal",
      "Prona obrigatória"
    ]
  },
  {
    "id": "digest-sangramento",
    "assunto": "Gastroenterologia",
    "dificuldade": "dificil",
    "pergunta": "melena associada a tontura e hipotensão sugere qual prioridade?",
    "explicacao": "Sangramento digestivo com sinais de instabilidade exige avaliação e suporte imediatos.",
    "correta": "Avaliar possível hemorragia digestiva e estabilidade hemodinâmica imediatamente",
    "distratores": [
      "Oferecer laxante",
      "Estimular caminhada",
      "Aguardar evacuação seguinte"
    ]
  },
  {
    "id": "digest-encefalopatia",
    "assunto": "Hepatologia",
    "dificuldade": "dificil",
    "pergunta": "em paciente com doença hepática, confusão aguda e asterixe sugerem qual complicação?",
    "explicacao": "Alteração neurológica em doença hepática pode indicar encefalopatia e exige avaliação de precipitantes.",
    "correta": "Encefalopatia hepática",
    "distratores": [
      "Otite média",
      "Cistite simples",
      "Hipertireoidismo"
    ]
  },
  {
    "id": "nutri-risco",
    "assunto": "Nutrição",
    "dificuldade": "medio",
    "pergunta": "qual achado aumenta risco nutricional em paciente hospitalizado?",
    "explicacao": "Perda de peso e baixa ingestão são sinais de alerta para desnutrição e piores desfechos.",
    "correta": "Perda de peso não intencional e redução importante da ingestão",
    "distratores": [
      "Peso estável e alimentação adequada",
      "Aumento de atividade física habitual",
      "Sono reparador"
    ]
  },
  {
    "id": "peri-checklist",
    "assunto": "Centro Cirúrgico",
    "dificuldade": "medio",
    "pergunta": "qual é o objetivo do checklist de cirurgia segura?",
    "explicacao": "Checklist cria pausas estruturadas para confirmar paciente, procedimento, riscos e recursos.",
    "correta": "Confirmar etapas críticas e promover comunicação da equipe para reduzir eventos evitáveis",
    "distratores": [
      "Aumentar burocracia sem finalidade clínica",
      "Substituir prontuário",
      "Eliminar necessidade de identificação do paciente"
    ]
  },
  {
    "id": "peri-jejum",
    "assunto": "Centro Cirúrgico",
    "dificuldade": "medio",
    "pergunta": "antes de procedimento, por que confirmar jejum quando indicado?",
    "explicacao": "Jejum apropriado reduz conteúdo gástrico e risco de aspiração em situações anestésicas específicas.",
    "correta": "Reduzir risco de aspiração durante anestesia conforme protocolo",
    "distratores": [
      "Evitar sede por rotina",
      "Melhorar cicatrização da pele",
      "Substituir avaliação anestésica"
    ]
  },
  {
    "id": "peri-pos-op",
    "assunto": "Pós-operatório",
    "dificuldade": "medio",
    "pergunta": "na recuperação anestésica, qual avaliação é prioritária?",
    "explicacao": "O pós-anestésico inicial exige vigilância das funções vitais e recuperação neurológica.",
    "correta": "Via aérea, respiração, circulação, consciência e dor",
    "distratores": [
      "Cor do curativo apenas",
      "Apetite imediatamente",
      "Força de preensão isolada"
    ]
  },
  {
    "id": "peri-trombose",
    "assunto": "Pós-operatório",
    "dificuldade": "medio",
    "pergunta": "qual medida pode integrar prevenção de tromboembolismo conforme risco?",
    "explicacao": "Prevenção de TEV é baseada em estratificação de risco e medidas adequadas.",
    "correta": "Mobilização precoce e medidas farmacológicas ou mecânicas quando prescritas",
    "distratores": [
      "Imobilização prolongada para todos",
      "Massagem vigorosa em perna com suspeita de TVP",
      "Suspender hidratação sem indicação"
    ]
  },
  {
    "id": "peri-dor",
    "assunto": "Pós-operatório",
    "dificuldade": "facil",
    "pergunta": "qual prática melhora manejo da dor após cirurgia?",
    "explicacao": "Avaliação e reavaliação permitem ajustar intervenções e acompanhar eficácia e segurança.",
    "correta": "Avaliar intensidade, administrar analgesia prescrita e reavaliar resposta",
    "distratores": [
      "Esperar a dor ficar insuportável",
      "Evitar escalas de dor",
      "Registrar apenas uma vez"
    ]
  },
  {
    "id": "trab-biologico",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "medio",
    "pergunta": "após acidente perfurocortante com material biológico, qual ação inicial é adequada?",
    "explicacao": "Exposição ocupacional requer cuidado local e avaliação rápida para medidas pós-exposição quando indicadas.",
    "correta": "Realizar cuidados locais, comunicar imediatamente e seguir protocolo de avaliação da exposição",
    "distratores": [
      "Espremer vigorosamente a lesão por vários minutos",
      "Esperar sintomas aparecerem",
      "Ocultar o acidente"
    ]
  },
  {
    "id": "trab-epi",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "facil",
    "pergunta": "qual afirmação sobre EPI é correta?",
    "explicacao": "EPI integra a hierarquia de controle e deve ser selecionado conforme o risco.",
    "correta": "Deve ser adequado ao risco e não substitui medidas coletivas quando estas são aplicáveis",
    "distratores": [
      "Qualquer EPI serve para qualquer risco",
      "EPI elimina necessidade de treinamento",
      "EPI sempre é a primeira e única medida"
    ]
  },
  {
    "id": "trab-ergonomia",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "facil",
    "pergunta": "qual medida ajuda a prevenir distúrbios osteomusculares relacionados ao trabalho?",
    "explicacao": "Ergonomia e organização do trabalho reduzem sobrecarga e risco de adoecimento.",
    "correta": "Adequar posto, reduzir sobrecarga repetitiva e organizar pausas",
    "distratores": [
      "Aumentar repetição para condicionamento",
      "Eliminar todas as pausas",
      "Usar analgésico preventivamente como única medida"
    ]
  },
  {
    "id": "trab-quimico",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "medio",
    "pergunta": "tontura e dispneia súbitas após exposição química ocupacional exigem qual postura?",
    "explicacao": "Sintomas agudos após exposição química podem representar intoxicação e exigem resposta rápida.",
    "correta": "Afastar da exposição com segurança e realizar avaliação imediata",
    "distratores": [
      "Retornar ao posto para testar tolerância",
      "Aguardar o fim do turno",
      "Oferecer apenas água"
    ]
  },
  {
    "id": "trab-fadiga",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "medio",
    "pergunta": "por que fadiga intensa em jornada prolongada é relevante para segurança?",
    "explicacao": "Fadiga compromete atenção e desempenho e deve ser tratada como fator de risco ocupacional.",
    "correta": "Pode aumentar erros e acidentes e exige avaliação da organização do trabalho",
    "distratores": [
      "Não influencia desempenho",
      "É resolvida apenas com cafeína",
      "Deve ser ignorada se a pressão arterial estiver normal"
    ]
  },
  {
    "id": "epi-surto",
    "assunto": "Vigilância Epidemiológica",
    "dificuldade": "medio",
    "pergunta": "ao identificar aumento incomum de casos semelhantes em uma unidade, qual ação é apropriada?",
    "explicacao": "Reconhecimento de agregação incomum permite investigação e medidas de controle oportunas.",
    "correta": "Investigar possível surto e comunicar vigilância conforme fluxo",
    "distratores": [
      "Aguardar meses por confirmação",
      "Evitar registrar casos",
      "Tratar cada caso sem buscar vínculo"
    ]
  },
  {
    "id": "epi-notificacao",
    "assunto": "Vigilância Epidemiológica",
    "dificuldade": "medio",
    "pergunta": "qual é a finalidade da notificação compulsória?",
    "explicacao": "Notificação é instrumento de vigilância para detecção, investigação e controle de eventos.",
    "correta": "Permitir vigilância e resposta oportuna a eventos de interesse em saúde pública",
    "distratores": [
      "Substituir o prontuário",
      "Punir automaticamente o paciente",
      "Divulgar diagnósticos ao público"
    ]
  },
  {
    "id": "epi-incidencia",
    "assunto": "Epidemiologia",
    "dificuldade": "medio",
    "pergunta": "qual medida expressa ocorrência de casos novos em uma população sob risco em determinado período?",
    "explicacao": "Incidência relaciona novos casos à população sob risco em um intervalo de tempo.",
    "correta": "Incidência",
    "distratores": [
      "Prevalência pontual",
      "Letalidade",
      "Média aritmética"
    ]
  },
  {
    "id": "epi-prevalencia",
    "assunto": "Epidemiologia",
    "dificuldade": "facil",
    "pergunta": "qual medida representa a proporção de pessoas com determinada condição em um momento ou período?",
    "explicacao": "Prevalência mede a frequência de casos existentes em uma população.",
    "correta": "Prevalência",
    "distratores": [
      "Incidência acumulada obrigatoriamente",
      "Taxa de natalidade",
      "Risco relativo"
    ]
  },
  {
    "id": "epi-letalidade",
    "assunto": "Epidemiologia",
    "dificuldade": "medio",
    "pergunta": "qual indicador expressa a gravidade de uma doença ao relacionar óbitos entre os doentes?",
    "explicacao": "Letalidade é a proporção de óbitos entre os casos da doença em determinado contexto.",
    "correta": "Letalidade",
    "distratores": [
      "Incidência",
      "Cobertura vacinal",
      "Prevalência"
    ]
  },
  {
    "id": "gest-registro",
    "assunto": "Gestão em Enfermagem",
    "dificuldade": "facil",
    "pergunta": "qual característica define um bom registro de enfermagem?",
    "explicacao": "Registros devem documentar de forma fidedigna, objetiva e oportuna o cuidado e a evolução.",
    "correta": "Claro, objetivo, cronológico e compatível com o cuidado realizado",
    "distratores": [
      "Baseado em opinião pessoal sem relação clínica",
      "Preenchido de memória dias depois",
      "Com espaços em branco para completar"
    ]
  },
  {
    "id": "gest-delegacao",
    "assunto": "Gestão em Enfermagem",
    "dificuldade": "medio",
    "pergunta": "ao delegar atividade, qual princípio é importante?",
    "explicacao": "Delegação segura exige adequação da tarefa ao profissional e supervisão proporcional ao risco.",
    "correta": "Considerar competência, atribuições, condição do paciente e necessidade de supervisão",
    "distratores": [
      "Delegar qualquer atividade sem avaliar habilitação",
      "Não acompanhar resultados",
      "Usar apenas tempo de serviço como critério"
    ]
  },
  {
    "id": "gest-indicador",
    "assunto": "Gestão em Enfermagem",
    "dificuldade": "medio",
    "pergunta": "qual indicador pode apoiar avaliação da qualidade assistencial?",
    "explicacao": "Indicadores assistenciais permitem acompanhar resultados e direcionar melhoria de processos.",
    "correta": "Incidência de quedas, lesão por pressão e eventos relacionados ao cuidado",
    "distratores": [
      "Cor das paredes",
      "Número de cadeiras da recepção",
      "Marca dos uniformes"
    ]
  },
  {
    "id": "etica-sigilo",
    "assunto": "Ética em Enfermagem",
    "dificuldade": "medio",
    "pergunta": "qual conduta protege o sigilo profissional?",
    "explicacao": "Informações de saúde devem ser protegidas e acessadas apenas por finalidade legítima.",
    "correta": "Compartilhar informações apenas quando necessário ao cuidado ou previsto em lei",
    "distratores": [
      "Comentar casos em elevadores",
      "Publicar foto clínica sem consentimento",
      "Enviar prontuário em grupo pessoal sem necessidade"
    ]
  },
  {
    "id": "gest-cultura",
    "assunto": "Segurança do Paciente",
    "dificuldade": "medio",
    "pergunta": "qual atitude de liderança favorece cultura de segurança?",
    "explicacao": "Cultura de segurança busca aprender com incidentes e fortalecer barreiras do sistema.",
    "correta": "Estimular notificação, análise de processos e aprendizado sem foco automático em culpa",
    "distratores": [
      "Ocultar quase-erros",
      "Punir todo erro sem análise",
      "Evitar discussão de falhas"
    ]
  }
] as Conceito[];

function montarQuestoes() {
  return conceitos.flatMap((conceito, conceitoIndex) =>
    CENARIOS.map((cenario, varianteIndex) => {
      const opcoes = [conceito.correta, ...conceito.distratores];
      const deslocamento = (conceitoIndex + varianteIndex) % opcoes.length;
      const alternativas = opcoes
        .map((texto, indice) => ({ texto, correta: indice === 0 }))
        .sort((a, b) => {
          const ia = (opcoes.indexOf(a.texto) + deslocamento) % opcoes.length;
          const ib = (opcoes.indexOf(b.texto) + deslocamento) % opcoes.length;
          return ia - ib;
        });

      return {
        origemId: "enare-ebserh-v2-" + conceito.id + "-" + String(varianteIndex + 1).padStart(2, "0"),
        enunciado: cenario + " " + conceito.pergunta,
        explicacao: conceito.explicacao,
        assunto: conceito.assunto,
        dificuldade: conceito.dificuldade,
        banca: "ENARE / EBSERH (estilo)",
        ano: 2026,
        cargo: "Residência Multiprofissional - Enfermagem",
        orgao: "ENARE / EBSERH",
        fonteUrl: "https://www.gov.br/ebserh/pt-br/ensino-e-pesquisa/residencias",
        alternativas
      };
    })
  );
}

export async function sincronizarQuestoesEnareEbserh500() {
  const questoes = montarQuestoes();

  const usuario = await prisma.usuario.findFirst({ orderBy: { id: "asc" } });
  if (!usuario) {
    console.warn("[questoes] Nenhum usuário disponível para inserir o lote ENARE/EBSERH 500.");
    return;
  }

  let disciplina = await prisma.disciplina.findFirst({
    where: {
      usuarioId: usuario.id,
      nome: { equals: "Enfermagem - Residências Federais", mode: "insensitive" }
    }
  });

  if (!disciplina) {
    disciplina = await prisma.disciplina.create({
      data: { nome: "Enfermagem - Residências Federais", usuarioId: usuario.id }
    });
  }

  const existentes = await prisma.questao.findMany({
    where: { usuarioId: usuario.id, fonte: FONTE },
    select: { origemId: true }
  });
  const idsExistentes = new Set(existentes.map((item) => item.origemId).filter(Boolean));

  let inseridas = 0;
  let jaExistentes = 0;

  for (const questao of questoes) {
    if (idsExistentes.has(questao.origemId)) {
      jaExistentes += 1;
      continue;
    }

    await prisma.questao.create({
      data: {
        enunciado: questao.enunciado,
        explicacao: questao.explicacao,
        dificuldade: questao.dificuldade,
        tema: questao.assunto,
        fonte: FONTE,
        origemId: questao.origemId,
        banca: questao.banca,
        ano: questao.ano,
        cargo: questao.cargo,
        orgao: questao.orgao,
        fonteUrl: questao.fonteUrl,
        usuarioId: usuario.id,
        disciplinaId: disciplina.id,
        alternativas: { create: questao.alternativas }
      }
    });

    idsExistentes.add(questao.origemId);
    inseridas += 1;
  }

  console.log(
    "[questoes] ENARE/EBSERH 500:",
    inseridas,
    "inseridas;",
    jaExistentes,
    "já existentes;",
    questoes.length,
    "no lote."
  );
}
