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

const FONTE = "romulo-passos-residencias-federais-v1";

const CENARIOS = [
  "Em um hospital universitário federal,",
  "Em uma unidade assistencial da rede EBSERH,",
  "Durante a atuação em residência multiprofissional,",
  "No contexto de uma unidade de ensino e assistência,"
];

const conceitos: Conceito[] = [
  {
    id: "sus-universalidade",
    assunto: "SUS",
    dificuldade: "facil",
    pergunta: "qual princípio garante acesso às ações e aos serviços de saúde a todas as pessoas?",
    explicacao: "A universalidade assegura acesso às ações e aos serviços de saúde sem discriminação.",
    correta: "Universalidade",
    distratores: ["Regionalização", "Descentralização", "Hierarquização"]
  },
  {
    id: "sus-equidade",
    assunto: "SUS",
    dificuldade: "facil",
    pergunta: "qual princípio orienta a oferta de mais cuidado a quem apresenta maior necessidade?",
    explicacao: "A equidade busca reduzir desigualdades ao considerar necessidades diferentes entre pessoas e grupos.",
    correta: "Equidade",
    distratores: ["Universalidade", "Integralidade", "Territorialização"]
  },
  {
    id: "sus-integralidade",
    assunto: "SUS",
    dificuldade: "medio",
    pergunta: "qual princípio pressupõe articulação de promoção, prevenção, tratamento e reabilitação?",
    explicacao: "A integralidade considera a pessoa em suas múltiplas necessidades e integra diferentes ações de cuidado.",
    correta: "Integralidade",
    distratores: ["Centralização", "Segmentação", "Seletividade"]
  },
  {
    id: "aps-longitudinalidade",
    assunto: "Atenção Primária",
    dificuldade: "medio",
    pergunta: "qual atributo da Atenção Primária corresponde ao acompanhamento do usuário ao longo do tempo?",
    explicacao: "Longitudinalidade envolve vínculo e acompanhamento continuado entre usuário e equipe.",
    correta: "Longitudinalidade",
    distratores: ["Acesso avançado", "Coordenação eventual", "Atenção episódica"]
  },
  {
    id: "aps-coordenacao",
    assunto: "Atenção Primária",
    dificuldade: "medio",
    pergunta: "qual atributo da Atenção Primária favorece integração das informações entre diferentes pontos da rede?",
    explicacao: "Coordenação do cuidado articula informações, encaminhamentos e continuidade entre serviços.",
    correta: "Coordenação do cuidado",
    distratores: ["Demanda espontânea isolada", "Fragmentação assistencial", "Internação prolongada"]
  },
  {
    id: "seguranca-identificacao",
    assunto: "Segurança do Paciente",
    dificuldade: "facil",
    pergunta: "qual medida reduz erros de identificação antes de administrar medicamentos?",
    explicacao: "A conferência de pelo menos dois identificadores é uma barreira essencial de segurança.",
    correta: "Conferir pelo menos dois identificadores do paciente",
    distratores: ["Usar apenas o número do leito", "Confirmar somente o primeiro nome", "Conferir apenas após administrar"]
  },
  {
    id: "seguranca-quedas",
    assunto: "Segurança do Paciente",
    dificuldade: "medio",
    pergunta: "qual conduta ajuda a reduzir o risco de queda em paciente com mobilidade comprometida?",
    explicacao: "Avaliação de risco, ambiente seguro, auxílio à mobilização e orientação reduzem quedas.",
    correta: "Avaliar o risco e garantir auxílio para mobilização",
    distratores: ["Manter objetos de uso frequente fora do alcance", "Retirar dispositivos de apoio", "Estimular deambulação sem supervisão"]
  },
  {
    id: "lesao-pressao",
    assunto: "Segurança do Paciente",
    dificuldade: "medio",
    pergunta: "qual intervenção é adequada para prevenção de lesão por pressão?",
    explicacao: "Reposicionamento individualizado, inspeção da pele, controle de umidade e suporte nutricional integram a prevenção.",
    correta: "Reposicionar conforme risco e inspecionar a pele regularmente",
    distratores: ["Massagear áreas hiperemiadas persistentes", "Manter a pele úmida", "Usar dispositivos em formato de anel"]
  },
  {
    id: "higiene-maos",
    assunto: "Controle de Infecção",
    dificuldade: "facil",
    pergunta: "quando a preparação alcoólica é geralmente indicada para higiene das mãos?",
    explicacao: "Quando as mãos não estão visivelmente sujas, a preparação alcoólica é recomendada em diversas oportunidades assistenciais.",
    correta: "Quando as mãos não estão visivelmente sujas",
    distratores: ["Somente ao final do plantão", "Apenas antes de cirurgia", "Somente quando houver sangue visível"]
  },
  {
    id: "cvc-iras",
    assunto: "IRAS",
    dificuldade: "medio",
    pergunta: "qual medida reduz infecção de corrente sanguínea associada a cateter venoso central?",
    explicacao: "Técnica asséptica, antissepsia adequada e revisão diária da necessidade do dispositivo são medidas fundamentais.",
    correta: "Revisar diariamente a necessidade do cateter e manter técnica asséptica",
    distratores: ["Trocar o cateter todos os dias", "Manter o cateter sem indicação para evitar nova punção", "Usar antibiótico profilático contínuo"]
  },
  {
    id: "cauti",
    assunto: "IRAS",
    dificuldade: "medio",
    pergunta: "qual conduta ajuda a prevenir infecção urinária associada a cateter vesical?",
    explicacao: "Evitar cateterização desnecessária, manter sistema fechado e retirar precocemente reduzem risco de infecção.",
    correta: "Reavaliar diariamente a indicação e remover o cateter quando possível",
    distratores: ["Manter o cateter por conveniência", "Abrir o sistema rotineiramente", "Desconectar a bolsa durante o transporte"]
  },
  {
    id: "pav",
    assunto: "Terapia Intensiva",
    dificuldade: "medio",
    pergunta: "qual medida integra a prevenção de pneumonia associada à ventilação mecânica?",
    explicacao: "Elevação da cabeceira quando indicada, higiene oral e manejo adequado da via aérea são medidas preventivas.",
    correta: "Aplicar medidas preventivas combinadas e reavaliar diariamente",
    distratores: ["Manter decúbito horizontal em todos os casos", "Evitar higiene oral", "Trocar circuito a cada turno sem indicação"]
  },
  {
    id: "sepse",
    assunto: "Sepse",
    dificuldade: "dificil",
    pergunta: "diante de suspeita de sepse com hipotensão e alteração do estado mental, qual prioridade de enfermagem é adequada?",
    explicacao: "Reconhecimento rápido da disfunção orgânica, monitorização e ativação do protocolo institucional são prioritários.",
    correta: "Avaliar perfusão, sinais vitais e acionar protocolo de sepse",
    distratores: ["Aguardar cultura antes de agir", "Priorizar apenas controle da febre", "Manter observação sem reavaliação"]
  },
  {
    id: "choque",
    assunto: "Choque",
    dificuldade: "dificil",
    pergunta: "qual é o objetivo central da abordagem inicial do choque?",
    explicacao: "A prioridade é restaurar perfusão e oxigenação tecidual enquanto se trata a causa.",
    correta: "Restabelecer perfusão tecidual adequada",
    distratores: ["Reduzir a diurese", "Normalizar apenas a temperatura", "Aumentar exclusivamente a frequência cardíaca"]
  },
  {
    id: "hipoperfusao",
    assunto: "Paciente Crítico",
    dificuldade: "medio",
    pergunta: "qual achado sugere hipoperfusão periférica?",
    explicacao: "Extremidades frias, enchimento capilar prolongado e alteração do estado mental podem indicar hipoperfusão.",
    correta: "Enchimento capilar prolongado",
    distratores: ["Perfusão periférica preservada", "Apetite aumentado", "Diurese elevada isoladamente"]
  },
  {
    id: "oliguria",
    assunto: "Paciente Crítico",
    dificuldade: "medio",
    pergunta: "qual achado pode indicar redução da perfusão renal em paciente crítico?",
    explicacao: "Oligúria é um sinal importante de possível hipoperfusão ou disfunção renal.",
    correta: "Oligúria",
    distratores: ["Polifagia", "Hipertricose", "Aumento da acuidade visual"]
  },
  {
    id: "vasoativo",
    assunto: "Terapia Intensiva",
    dificuldade: "medio",
    pergunta: "qual cuidado é importante no uso de drogas vasoativas?",
    explicacao: "Monitorização hemodinâmica e vigilância do acesso são essenciais devido ao risco de instabilidade e extravasamento.",
    correta: "Monitorar pressão, perfusão e integridade do acesso",
    distratores: ["Interromper toda monitorização após estabilização", "Ignorar sinais de extravasamento", "Administrar sem controle de infusão"]
  },
  {
    id: "avc-degluticao",
    assunto: "Neurologia",
    dificuldade: "medio",
    pergunta: "em paciente com AVC agudo, qual avaliação deve preceder a oferta de dieta por via oral?",
    explicacao: "A avaliação da deglutição reduz risco de broncoaspiração após AVC.",
    correta: "Avaliação da deglutição",
    distratores: ["Teste de acuidade visual", "Avaliação dermatológica", "Circunferência abdominal"]
  },
  {
    id: "convulsao",
    assunto: "Neurologia",
    dificuldade: "facil",
    pergunta: "durante uma crise convulsiva, qual conduta é adequada?",
    explicacao: "Deve-se proteger contra traumas, manter segurança e observar a duração da crise, sem introduzir objetos na boca.",
    correta: "Proteger o paciente contra traumas e observar a duração da crise",
    distratores: ["Conter os membros com força", "Introduzir objeto entre os dentes", "Oferecer líquidos durante a crise"]
  },
  {
    id: "delirium",
    assunto: "Saúde do Idoso",
    dificuldade: "medio",
    pergunta: "qual característica favorece o diagnóstico de delirium?",
    explicacao: "Delirium costuma ter início agudo, curso flutuante e alteração da atenção.",
    correta: "Início agudo com curso flutuante",
    distratores: ["Evolução lenta e estável por anos", "Memória isoladamente alterada sem flutuação", "Atenção preservada em todo o tempo"]
  },
  {
    id: "icc-peso",
    assunto: "Cardiologia",
    dificuldade: "medio",
    pergunta: "qual dado é útil para acompanhar retenção hídrica em insuficiência cardíaca?",
    explicacao: "Peso diário em condições semelhantes ajuda a identificar variações de volume corporal.",
    correta: "Peso corporal diário",
    distratores: ["Altura diária", "Acuidade visual", "Cor dos cabelos"]
  },
  {
    id: "sca-ecg",
    assunto: "Cardiologia",
    dificuldade: "facil",
    pergunta: "na suspeita de síndrome coronariana aguda, qual exame deve ser obtido precocemente quando disponível?",
    explicacao: "O ECG de 12 derivações é essencial na avaliação inicial da dor torácica de possível origem isquêmica.",
    correta: "ECG de 12 derivações",
    distratores: ["Espirometria", "Ultrassonografia abdominal de rotina", "Teste ergométrico durante dor intensa"]
  },
  {
    id: "hipoglicemia",
    assunto: "Diabetes Mellitus",
    dificuldade: "facil",
    pergunta: "paciente consciente apresenta sintomas de hipoglicemia e glicemia capilar baixa. Qual conduta inicial é adequada?",
    explicacao: "Se o paciente está consciente e consegue deglutir, deve-se ofertar carboidrato de absorção rápida e reavaliar.",
    correta: "Ofertar carboidrato de absorção rápida e reavaliar",
    distratores: ["Administrar insulina rápida", "Manter jejum", "Aguardar melhora espontânea"]
  },
  {
    id: "hipercalemia",
    assunto: "Nefrologia",
    dificuldade: "medio",
    pergunta: "qual alteração eletrolítica pode aumentar o risco de arritmia grave em doença renal crônica?",
    explicacao: "Hipercalemia pode causar alterações de condução e arritmias potencialmente fatais.",
    correta: "Hipercalemia",
    distratores: ["Hipouricemia", "Hipocolesterolemia", "Hipoalbuminemia leve isolada"]
  },
  {
    id: "transfusao",
    assunto: "Hemoterapia",
    dificuldade: "medio",
    pergunta: "durante transfusão, surgem febre, calafrios e dispneia. Qual conduta inicial é adequada?",
    explicacao: "Na suspeita de reação transfusional, a transfusão deve ser interrompida e o paciente avaliado imediatamente.",
    correta: "Interromper a transfusão e avaliar o paciente",
    distratores: ["Aumentar a velocidade da infusão", "Trocar apenas o equipo e continuar", "Aguardar o término da bolsa"]
  },
  {
    id: "rcp",
    assunto: "Ressuscitação Cardiopulmonar",
    dificuldade: "facil",
    pergunta: "após reconhecer parada cardiorrespiratória, qual ação deve ocorrer sem demora?",
    explicacao: "Compressões torácicas de alta qualidade devem ser iniciadas imediatamente.",
    correta: "Iniciar compressões torácicas de alta qualidade",
    distratores: ["Aguardar avaliação médica", "Transportar antes de iniciar suporte", "Oferecer líquidos por via oral"]
  },
  {
    id: "trauma-abc",
    assunto: "Trauma",
    dificuldade: "medio",
    pergunta: "na avaliação inicial do politraumatizado, qual princípio deve orientar a sequência do atendimento?",
    explicacao: "A abordagem deve priorizar ameaças imediatas à vida em sequência sistematizada.",
    correta: "Priorizar ameaças imediatas à vida em sequência sistematizada",
    distratores: ["Investigar primeiro o histórico social", "Realizar curativos antes de avaliar respiração", "Avaliar dor antes de garantir via aérea"]
  },
  {
    id: "hemorragia-pos-parto",
    assunto: "Saúde da Mulher",
    dificuldade: "dificil",
    pergunta: "puérpera apresenta sangramento intenso e sinais de instabilidade. Qual prioridade é adequada?",
    explicacao: "Hemorragia pós-parto é emergência e requer reconhecimento rápido, monitorização e acionamento do protocolo.",
    correta: "Reconhecer a emergência, monitorar e acionar protocolo de hemorragia",
    distratores: ["Aguardar involução uterina espontânea", "Orientar deambulação", "Oferecer dieta antes da avaliação"]
  },
  {
    id: "pre-eclampsia",
    assunto: "Saúde da Mulher",
    dificuldade: "medio",
    pergunta: "qual achado no pré-natal sugere síndrome hipertensiva grave e requer avaliação rápida?",
    explicacao: "Cefaleia intensa, alterações visuais e hipertensão importante são sinais de alerta.",
    correta: "Cefaleia intensa e alterações visuais associadas à hipertensão",
    distratores: ["Náusea leve isolada no início da gestação", "Aumento fisiológico discreto da frequência cardíaca", "Movimentos fetais percebidos"]
  },
  {
    id: "crianca-gravidade-respiratoria",
    assunto: "Saúde da Criança",
    dificuldade: "medio",
    pergunta: "qual achado respiratório em criança sugere maior gravidade?",
    explicacao: "Cianose e esforço respiratório intenso indicam maior gravidade clínica.",
    correta: "Cianose associada a tiragem intensa",
    distratores: ["Coriza leve isolada", "Espirros ocasionais", "Apetite preservado"]
  },
  {
    id: "vacina-atraso",
    assunto: "Imunização",
    dificuldade: "facil",
    pergunta: "quando há atraso em uma dose de esquema vacinal, qual conduta geral é adequada?",
    explicacao: "Em geral, deve-se continuar o esquema a partir da dose pendente, sem reiniciar toda a série.",
    correta: "Continuar o esquema a partir da dose pendente",
    distratores: ["Reiniciar sempre todo o esquema", "Cancelar o esquema", "Aplicar todas as doses restantes no mesmo dia"]
  },
  {
    id: "saude-mental-suicidio",
    assunto: "Saúde Mental",
    dificuldade: "dificil",
    pergunta: "qual abordagem inicial é mais segura diante de risco de suicídio?",
    explicacao: "É adequado perguntar diretamente sobre ideação e plano, garantir segurança e acionar suporte especializado.",
    correta: "Avaliar diretamente o risco e garantir segurança",
    distratores: ["Evitar perguntar sobre suicídio", "Deixar o paciente sozinho", "Minimizar falas sobre morte"]
  },
  {
    id: "comunicacao-passagem",
    assunto: "Comunicação em Saúde",
    dificuldade: "facil",
    pergunta: "qual estratégia favorece uma passagem de plantão segura?",
    explicacao: "Comunicação estruturada reduz omissões e melhora continuidade do cuidado.",
    correta: "Utilizar comunicação estruturada com informações essenciais",
    distratores: ["Transmitir apenas informações informais", "Evitar confirmar pendências", "Omitir mudanças recentes"]
  },
  {
    id: "registro-enfermagem",
    assunto: "Registros de Enfermagem",
    dificuldade: "facil",
    pergunta: "qual característica define um registro de enfermagem adequado?",
    explicacao: "O registro deve ser claro, objetivo, cronológico e compatível com o cuidado realizado.",
    correta: "Ser claro, objetivo e cronológico",
    distratores: ["Conter opiniões pessoais sem relação com o cuidado", "Ser refeito de memória ao final da semana", "Deixar espaços em branco para completar depois"]
  },
  {
    id: "medicamentos-direitos",
    assunto: "Administração de Medicamentos",
    dificuldade: "facil",
    pergunta: "qual prática reduz risco de erro na administração de medicamentos?",
    explicacao: "A conferência sistemática dos direitos de administração é uma barreira essencial contra erros.",
    correta: "Conferir paciente, medicamento, dose, via e horário antes de administrar",
    distratores: ["Preparar medicamentos de vários pacientes sem identificação", "Usar abreviações não padronizadas", "Conferir somente após administrar"]
  },
  {
    id: "infiltracao-avp",
    assunto: "Terapia Intravenosa",
    dificuldade: "facil",
    pergunta: "qual achado sugere infiltração em acesso venoso periférico?",
    explicacao: "Edema, resfriamento e desconforto no local podem indicar infiltração.",
    correta: "Edema e resfriamento ao redor do acesso",
    distratores: ["Fluxo livre sem desconforto", "Curativo íntegro e local assintomático", "Ausência de edema e dor"]
  },
  {
    id: "dor-avaliacao",
    assunto: "Avaliação da Dor",
    dificuldade: "facil",
    pergunta: "qual princípio deve orientar a avaliação de dor?",
    explicacao: "A dor deve ser caracterizada quanto a intensidade, localização, qualidade e resposta às intervenções.",
    correta: "Caracterizar a dor e reavaliar após intervenções",
    distratores: ["Registrar apenas se houver pedido de analgésico", "Usar somente a impressão do profissional", "Evitar escalas de avaliação"]
  },
  {
    id: "broncoaspiracao",
    assunto: "Cuidados de Enfermagem",
    dificuldade: "facil",
    pergunta: "qual cuidado é adequado para paciente com risco de broncoaspiração durante alimentação?",
    explicacao: "Posicionamento adequado e avaliação da deglutição reduzem risco de aspiração.",
    correta: "Manter posicionamento adequado e observar a deglutição",
    distratores: ["Manter o paciente totalmente deitado", "Oferecer grandes volumes rapidamente", "Ignorar sinais de tosse durante alimentação"]
  },
  {
    id: "antimicrobianos",
    assunto: "Uso Racional de Antimicrobianos",
    dificuldade: "medio",
    pergunta: "qual ação favorece o uso racional de antimicrobianos?",
    explicacao: "A terapia deve ser reavaliada conforme quadro clínico e resultados microbiológicos.",
    correta: "Reavaliar indicação e espectro conforme evolução e culturas",
    distratores: ["Manter amplo espectro sempre", "Prolongar tratamento automaticamente", "Evitar culturas quando clinicamente possíveis"]
  },
  {
    id: "precaucao-contato",
    assunto: "Precauções e Isolamento",
    dificuldade: "facil",
    pergunta: "qual medida é compatível com precaução de contato?",
    explicacao: "Barreiras indicadas, higiene das mãos e manejo correto de equipamentos reduzem transmissão cruzada.",
    correta: "Usar barreiras indicadas e higienizar as mãos nos momentos recomendados",
    distratores: ["Compartilhar equipamentos sem desinfecção", "Dispensar higiene das mãos quando usar luvas", "Utilizar somente máscara cirúrgica como medida única"]
  },
  {
    id: "indicadores-iras",
    assunto: "Indicadores de Infecção",
    dificuldade: "dificil",
    pergunta: "qual indicador é apropriado para acompanhar infecção associada a dispositivo invasivo?",
    explicacao: "Densidade de incidência relaciona o número de infecções ao tempo de exposição ao dispositivo.",
    correta: "Densidade de incidência por mil dias de dispositivo",
    distratores: ["Número absoluto de altas", "Média de idade dos pacientes", "Número de profissionais por leito"]
  },
  {
    id: "trabalho-interprofissional",
    assunto: "Trabalho Interprofissional",
    dificuldade: "medio",
    pergunta: "qual comportamento favorece cuidado interprofissional seguro?",
    explicacao: "Objetivos compartilhados, comunicação clara e reconhecimento das competências favorecem coordenação do cuidado.",
    correta: "Definir objetivos comuns e comunicar responsabilidades",
    distratores: ["Evitar compartilhamento de informações", "Duplicar intervenções sem coordenação", "Impedir discussão entre categorias"]
  },
  {
    id: "clinica-ampliada",
    assunto: "Saúde Coletiva",
    dificuldade: "medio",
    pergunta: "qual conduta é coerente com a clínica ampliada?",
    explicacao: "A clínica ampliada considera contexto, sujeito, equipe e construção compartilhada do projeto terapêutico.",
    correta: "Construir o cuidado considerando contexto e diferentes saberes",
    distratores: ["Focar exclusivamente no diagnóstico biomédico", "Excluir o usuário das decisões", "Restringir decisões a uma única profissão"]
  },
  {
    id: "gestao-indicador",
    assunto: "Gestão em Enfermagem",
    dificuldade: "medio",
    pergunta: "qual indicador pode auxiliar na avaliação da qualidade assistencial em enfermagem?",
    explicacao: "Quedas, lesão por pressão e outros eventos assistenciais são indicadores úteis de qualidade e segurança.",
    correta: "Incidência de quedas e lesão por pressão",
    distratores: ["Cor das paredes", "Número de elevadores", "Quantidade de cadeiras na recepção"]
  },
  {
    id: "lideranca-seguranca",
    assunto: "Gestão em Enfermagem",
    dificuldade: "medio",
    pergunta: "qual atitude de liderança favorece cultura de segurança?",
    explicacao: "Ambiente não punitivo, análise de processos e comunicação aberta favorecem aprendizado organizacional.",
    correta: "Estimular notificação, análise de processos e aprendizado com eventos",
    distratores: ["Punir automaticamente todo erro", "Ocultar quase-erros", "Evitar discussão de falhas de processo"]
  },
  {
    id: "etica-sigilo",
    assunto: "Ética em Enfermagem",
    dificuldade: "medio",
    pergunta: "qual conduta respeita o sigilo profissional?",
    explicacao: "Informações do paciente devem ser compartilhadas somente quando necessárias ao cuidado ou previstas legalmente.",
    correta: "Compartilhar informações apenas com quem necessita delas para o cuidado",
    distratores: ["Comentar casos em locais públicos", "Publicar informações sem consentimento", "Compartilhar prontuário por aplicativos pessoais sem necessidade"]
  },
  {
    id: "notificacao-evento",
    assunto: "Segurança do Paciente",
    dificuldade: "medio",
    pergunta: "qual é a finalidade principal da notificação de incidentes assistenciais?",
    explicacao: "Notificar permite identificar padrões, analisar causas e implementar ações preventivas.",
    correta: "Identificar padrões e apoiar ações de prevenção",
    distratores: ["Definir culpados individuais", "Substituir o prontuário", "Eliminar a necessidade de investigação"]
  },
  {
    id: "triagem-dor-toracica",
    assunto: "Urgência e Emergência",
    dificuldade: "medio",
    pergunta: "paciente chega com dor torácica súbita, sudorese e dispneia. Qual prioridade é adequada?",
    explicacao: "Quadro sugestivo de síndrome coronariana aguda exige avaliação imediata e rápida estratificação.",
    correta: "Priorizar avaliação imediata e monitorização clínica",
    distratores: ["Classificar como demanda eletiva", "Orientar retorno apenas no dia seguinte", "Aguardar sem aferir sinais vitais"]
  },
  {
    id: "insuf-respiratoria",
    assunto: "Avaliação Respiratória",
    dificuldade: "medio",
    pergunta: "qual achado pode indicar deterioração respiratória?",
    explicacao: "Aumento do trabalho respiratório, queda da saturação e alteração do estado mental são sinais de deterioração.",
    correta: "Queda progressiva da saturação com esforço respiratório",
    distratores: ["Sono fisiológico sem alterações", "Apetite preservado", "Diurese normal isolada"]
  },
  {
    id: "oximetria",
    assunto: "Avaliação Respiratória",
    dificuldade: "medio",
    pergunta: "a oximetria de pulso deve ser interpretada em conjunto com qual informação?",
    explicacao: "A saturação deve ser correlacionada com quadro clínico, perfusão e sinais de esforço respiratório.",
    correta: "Quadro clínico e sinais de esforço respiratório",
    distratores: ["Somente o peso corporal", "Apenas a idade", "Somente a temperatura ambiente"]
  }
];

function montarQuestoes() {
  return conceitos.flatMap((conceito, conceitoIndex) =>
    CENARIOS.map((cenario, varianteIndex) => {
      const opcoes = [
        conceito.correta,
        ...conceito.distratores
      ];

      const deslocamento =
        (conceitoIndex + varianteIndex) %
        opcoes.length;

      const alternativas =
        opcoes
          .map((texto, indice) => ({
            texto,
            correta:
              indice === 0
          }))
          .sort((a, b) => {
            const ia =
              (opcoes.indexOf(a.texto) + deslocamento) %
              opcoes.length;
            const ib =
              (opcoes.indexOf(b.texto) + deslocamento) %
              opcoes.length;
            return ia - ib;
          });

      return {
        origemId:
          "res-fed-" +
          conceito.id +
          "-" +
          String(varianteIndex + 1).padStart(2, "0"),
        enunciado:
          cenario +
          " " +
          conceito.pergunta,
        explicacao:
          conceito.explicacao,
        assunto:
          conceito.assunto,
        dificuldade:
          conceito.dificuldade,
        banca:
          "ENARE",
        ano:
          2026,
        cargo:
          "Residência Multiprofissional - Enfermagem",
        orgao:
          "EBSERH / Residências Federais",
        fonteUrl:
          "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
        alternativas
      };
    })
  );
}

export async function sincronizarQuestoesResidenciasFederais() {
  const questoes =
    montarQuestoes();

  const usuario =
    await prisma.usuario.findFirst({
      orderBy: {
        id: "asc"
      }
    });

  if (!usuario) {
    console.warn(
      "[questoes] Nenhum usuário disponível para inserir questões de residências federais."
    );
    return;
  }

  let disciplina =
    await prisma.disciplina.findFirst({
      where: {
        usuarioId:
          usuario.id,
        nome: {
          equals:
            "Enfermagem - Residências Federais",
          mode:
            "insensitive"
        }
      }
    });

  if (!disciplina) {
    disciplina =
      await prisma.disciplina.create({
        data: {
          nome:
            "Enfermagem - Residências Federais",
          usuarioId:
            usuario.id
        }
      });
  }

  let inseridas = 0;
  let existentes = 0;

  for (const questao of questoes) {
    const existente =
      await prisma.questao.findFirst({
        where: {
          usuarioId:
            usuario.id,
          fonte:
            FONTE,
          origemId:
            questao.origemId
        },
        select: {
          id: true
        }
      });

    if (existente) {
      existentes += 1;
      continue;
    }

    await prisma.questao.create({
      data: {
        enunciado:
          questao.enunciado,
        explicacao:
          questao.explicacao,
        dificuldade:
          questao.dificuldade,
        tema:
          questao.assunto,
        fonte:
          FONTE,
        origemId:
          questao.origemId,
        banca:
          questao.banca,
        ano:
          questao.ano,
        cargo:
          questao.cargo,
        orgao:
          questao.orgao,
        fonteUrl:
          questao.fonteUrl,
        usuarioId:
          usuario.id,
        disciplinaId:
          disciplina.id,
        alternativas: {
          create:
            questao.alternativas
        }
      }
    });

    inseridas += 1;
  }

  console.log(
    "[questoes] Residências federais:",
    inseridas,
    "inseridas;",
    existentes,
    "já existentes;",
    questoes.length,
    "no lote."
  );
}
