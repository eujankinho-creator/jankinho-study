/**
 * Reprodução de enunciados sob autorização informada pelo responsável do Córtex.
 * Concurso FGV — Prefeitura Municipal de Abreu e Lima, Edital 02/2024.
 * Cargo Enfermeiro, prova Tipo 1 de 01/09/2024.
 * Fonte: https://conhecimento.fgv.br/sites/default/files/concursos/enfermeirocns201-tipo-1_0.pdf
 * Gabarito definitivo: https://conhecimento.fgv.br/sites/default/files/concursos/pref_abreuelima_gabarito_definitivo_da0a4fs131.pdf
 * Seleção: questões de Saúde 21-70, excluída a Q27 anulada.
 * Questões 1-20 (Língua Portuguesa/Raciocínio Lógico) deliberadamente excluídas.
 * Todas as alternativas A-E preservadas conforme caderno primário.
 */
export type QuestaoFGVAbreuLima2024 = {
  numero: number; disciplina:string; assunto:string; enunciado:string;
  alternativas:{letra:string;texto:string}[]; correta:string;
};
export const QUESTOES_FGV_ABREU_LIMA_2024: QuestaoFGVAbreuLima2024[] = [
  {
    "numero": 21,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "Avalie, com base na Lei no 8.080/90, se as afirmativas a seguir são verdadeiras (V) ou falsas (F): ( ) O conjunto de ações e serviços de saúde, prestados por órgãos e instituições públicas federais, estaduais e municipais, da Administração direta e indireta e das fundações mantidas pelo Poder Público, constitui o Sistema Único de Saúde (SUS). ( ) Um objetivo do SUS é a identificação e divulgação dos fatores condicionantes e determinantes da saúde. ( ) Estão incluídas no campo de atuação do Sistema Único de Saúde (SUS) a execuç ão de ações de vigilância sanitária e de vigilância epidemiológica, entre outras. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – V."
      },
      {
        "letra": "B",
        "texto": "V – F – F."
      },
      {
        "letra": "C",
        "texto": "F – V – V."
      },
      {
        "letra": "D",
        "texto": "V – F – V."
      },
      {
        "letra": "E",
        "texto": "F – F – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 22,
    "disciplina": "Legislação do SUS",
    "assunto": "Princípios e Diretrizes do SUS",
    "enunciado": "Avalie, com base na Lei n o 8.080/90, as ações e serviços públicos de saúde e os serviços privados contratados ou conveniados que integram o Sistema Único de Saúde (SUS), obedecem, entre outros, aos seguintes princípios: I. Universalidade de acesso aos serviços de saúde em todos os níveis de assistência. II. Integralidade de assistência, entendida como conjunto articulado e contínuo das ações e serviços preventivos e curativos, individuais e coletivos, exigidos para cada caso em todos os níveis de complexidade do sistema. III. Preservação da auto nomia das pessoas na defesa de sua integridade física e moral. IV. Igualdade da assistência à saúde, sem preconceitos ou privilégios de qualquer espécie. Estão corretos os itens:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I e II, apenas."
      },
      {
        "letra": "B",
        "texto": "III e IV, apenas."
      },
      {
        "letra": "C",
        "texto": "I, III e IV, apenas."
      },
      {
        "letra": "D",
        "texto": "II, III e IV, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II, III e IV."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 23,
    "disciplina": "Enfermagem",
    "assunto": "Política Nacional de Humanização",
    "enunciado": "“A Política Nacional de Humanização (PNH) existe desde 2003 para efetivar os princípios do SUS no cotidiano das práticas de atenção e gestão, qualificando a saúde pública no Brasil e incentiva ndo trocas solidárias entre gestores, trabalhadores e usuários.” (https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e- programas/humanizasus) Em relação à PNH, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "A PNH deve se fazer presente e estar inserida exclusivamente nas políticas e programas do SUS voltados para a classe trabalhadora."
      },
      {
        "letra": "B",
        "texto": "A humanização não significa valorizar usuários, trabalhadores e gestores no processo de produção de saúde."
      },
      {
        "letra": "C",
        "texto": "Valorizar os sujeitos é oportunizar uma maior autonomia, a ampliação da sua capacidade de transformar a realidade em que vivem, através da responsabilidade compartilhada, da criação de vínculos solidários, da participação coletiva nos processos de gestão e de produção de saúde."
      },
      {
        "letra": "D",
        "texto": "A PNH estimula a comunicação entre gestores, trabalhadores e usuários para construir processos coletivos de relações hierarquizadas de poder e trabalho."
      },
      {
        "letra": "E",
        "texto": "As rodas de conversa, o incentivo às redes e movimentos sociais e a gestão dos c onflitos gerados pela inclusão das diferenças são ferramentas que não têm apresentados resultados positivos significativos."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 24,
    "disciplina": "Saúde Coletiva I",
    "assunto": "Promoção da Saúde",
    "enunciado": "Os objetivos específicos da Política Nacional de Promoção da Saúde incluem os seguintes, à exceção de um. Assinale-o.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Incorporar e implementar ações de promoção da saúde, com ênfase na atenção especializada."
      },
      {
        "letra": "B",
        "texto": "Ampliar a autonomia e a corresponsabilidade de sujeitos e coletividades, inclusive o poder público, no cuidado integral à saúde e minimizar e/ou extinguir as desigualdades de toda e qualquer ordem (étnica, racial, social, regional, de gênero, de orientação/opção sexual, entre outras)."
      },
      {
        "letra": "C",
        "texto": "Promover o entendimento da concepção ampliada de saúde, entre os trabalhadores de saúde, tanto das atividades -meio, como os da atividades-fim."
      },
      {
        "letra": "D",
        "texto": "Contribuir para o aumento da resolubilidade do Sistema, garantindo qualidade, eficácia, eficiência e segurança das ações de promoção da saúde."
      },
      {
        "letra": "E",
        "texto": "Valorizar e otimizar o uso dos espaços públicos de convivência e de produção de saúde para o desenvolvimento das ações de promoção da saúde."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 25,
    "disciplina": "Enfermagem",
    "assunto": "Atenção Primária à Saúde",
    "enunciado": "Avalie as afirmativas a seguir, relativas à Atenção Primária à Saúde: I. É o primeiro nível de atenção em saúde e se caracteriza por um conjunto de ações de saúde, no âmbito individual e coletivo, que abrange a promoção e a proteção da saúde, a prevenção de agravos, o diagnóstico, o tratamento, a reabilitação, a redução de danos e a manutenção da saúde com o objetivo de desenvolver uma atenção integral que impacte positivamente na situação de saúde das coletividades. II. Trata-se de uma porta secundária de entrada do Sistema Único de Saúde (SUS) e do centro de comunicação com toda a Rede de Atenção dos SUS. III. Deve se orientar pelos princípios da universalidade, da acessibilidade, da continuidade do cuidado, da integralidade da atenção, da responsabilização, da humanização e da equidade. IV. Há diversas estratégias governamentais relacionadas, sendo uma delas a Estratégia de Saúde da Família (ESF), que leva serviços multidisciplinares às comunidades por meio das Unidades de Saúde da Família (USF), por exemplo. Consultas, exames, vacinas, radiografias e outros procedimentos são disponibilizados aos usuários nas USF. Estão corretas as afirmativas",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I e II, apenas."
      },
      {
        "letra": "B",
        "texto": "I, III e IV, apenas."
      },
      {
        "letra": "C",
        "texto": "II, III e IV, apenas."
      },
      {
        "letra": "D",
        "texto": "I, II e III, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II, III e IV."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 26,
    "disciplina": "Legislação do SUS",
    "assunto": "Direitos dos Usuários do SUS",
    "enunciado": "Avalie se os direitos dos usuários do SUS incluem, entre outros: I. Todo cidadão tem direito ao acesso ordenado e organizado aos sistemas de saúde. II. Todo cidadão tem direito a tratamento adequado e efetivo para seu problema. III. Todo cidadão tem direito ao atendimento humanizado, acolhedor e livre de qualquer discriminação. IV. Todo cidadão tem direito a atendimento que respeite a sua pessoa, seus valores e seus direitos. V. Todo cidadão também tem responsabilidades para que seu tratamento aconteça da forma adequada. VI. Todo cidadão tem direito ao comprometimento dos gestores da saúde para que os princípios anteriores sejam cumpridos. Estão corretos:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, II, III e IV, apenas."
      },
      {
        "letra": "B",
        "texto": "III, IV, V e VI, apenas."
      },
      {
        "letra": "C",
        "texto": "I, III, IV, V e VI, apenas."
      },
      {
        "letra": "D",
        "texto": "II, III, IV, V e VI, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II, III, IV, V e VI."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 28,
    "disciplina": "Enfermagem",
    "assunto": "Política Nacional de Humanização",
    "enunciado": "Avalie se a Política Nacional de Humanização é norteada pelos seguintes princípios: I. Horizontalidade. II. Indissociabilidade entre atenção e gestão. III. Protagonismo, corresponsabilidade e autonomia dos sujeitos e coletivos. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, apenas."
      },
      {
        "letra": "B",
        "texto": "I e II, apenas."
      },
      {
        "letra": "C",
        "texto": "I e III, apenas."
      },
      {
        "letra": "D",
        "texto": "II e III, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II e III."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 29,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "De acordo com o Art. 18 da Lei no 8.080/90, à direção municipal do SUS competem, entre outras, as seguintes ações, à exceção de uma. Assinale-a.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Planejar, organizar, controlar e avaliar as ações e os serviços de saúde e gerir e executar os serviços públicos de saúde."
      },
      {
        "letra": "B",
        "texto": "Participar do planejamento, programação e organização da rede regionalizada e hierarquizada do Sistema Único de Saúde (SUS), em articulação com sua direção estadual."
      },
      {
        "letra": "C",
        "texto": "Executar serviços de vigilância epidemiológica, vigilância sanitária, alimentação e nutrição, saneamento básico, saúde do trabalhador e de saúde bucal."
      },
      {
        "letra": "D",
        "texto": "Acompanhar, controlar e avaliar as redes hierarquizadas do Sistema Único de Saúde (SUS)."
      },
      {
        "letra": "E",
        "texto": "Colaborar com a União e os Estados na e xecução da vigilância sanitária de portos, aeroportos e fronteiras."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 30,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "Em relação ao acompanhamento de mulheres nos serviços de saúde, com base na Lei nº 8.080/90, avalie se as afirmativas a seguir são falsas (F) ou verdadeiras (V): ( ) Em consultas, exames e procedimentos realizados em unidades de saúde públicas ou privadas, toda mulher tem o direito de fazer -se acompanhar por pessoa maior de idade, durante todo o período do atendimento, independentemente de notificação prévia. ( ) No caso de atendimento que envolva qualquer tipo de sedação ou rebaixamento do nível de consciência, caso a paciente não indique acompanhante, a unidade de saúde responsável pelo atendimento indicar á pessoa para acompanh á-la, preferencialmente profiss ional de saúde do sexo feminino, sem custo adicional para a paciente, que poderá recusar o nome indicado e solicitar a indicação de outro, independentemente de justificativa, registrando -se o nome escolhido no documento gerado durante o atendimento. ( ) No caso de atendimento realizado em centro cirúrgico ou unidade de terapia intensiva com restrições relacionadas à segurança ou à saúde dos pacientes, devidamente justificadas pelo corpo clínico, somente será admitido acompanhante que seja profissional de saúde. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – F."
      },
      {
        "letra": "B",
        "texto": "F – V – V."
      },
      {
        "letra": "C",
        "texto": "V – F – V."
      },
      {
        "letra": "D",
        "texto": "F – V – F."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 31,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Com base nas disposições normativas acerca do Regime de Hospital-Dia, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa. ( ) Recomenda -se que o serviço de atendimento em regime de Hospital Dia seja regionalizado, atendendo à população de uma área geográfica definida, facilitando o acesso do paciente à unidade assistencial. ( ) O atendimento em regime de Hospital Dia – Geriatria deve possuir estrutura assistencial para os idosos realizarem ou complementarem tratamentos médicos, terapêuticos, fisioterápicos ou de reabilitação ( ) Um dos critérios para seleção dos pacientes submetidos à procedimento cirúrgico, diagnóstico ou terapêutico em regime de Hospital Dia é que o paciente esteja hígido e com ausência de comprometimento sistêmico. As afirmativas são respectivamente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – F – F."
      },
      {
        "letra": "C",
        "texto": "F – V – F."
      },
      {
        "letra": "D",
        "texto": "V – V – V."
      },
      {
        "letra": "E",
        "texto": "F – V – V."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 32,
    "disciplina": "Enfermagem",
    "assunto": "Teorias de Enfermagem",
    "enunciado": "A teoria de enfermagem que consiste na visão de que o mundo dos indivíduos e as estruturas sociais e culturais influenciam diretamente no seu estado de saúde, doença ou bem estar foi desenvolvida por",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Wanda Horta."
      },
      {
        "letra": "B",
        "texto": "Dorothea Orem."
      },
      {
        "letra": "C",
        "texto": "Imogene M. King."
      },
      {
        "letra": "D",
        "texto": "Virginia Henderson."
      },
      {
        "letra": "E",
        "texto": "Madeleine Leininger."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 33,
    "disciplina": "Enfermagem",
    "assunto": "Processo de Enfermagem e SAE",
    "enunciado": "A Avaliação de Enfermagem é a etapa do Processo de Enfermagem que compreende",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a análise dos resultados alcançados."
      },
      {
        "letra": "B",
        "texto": "a coleta de dados subjetivos e objetivos."
      },
      {
        "letra": "C",
        "texto": "o desenvolvimento de um plano assistencial."
      },
      {
        "letra": "D",
        "texto": "a identificação de problemas existentes e condições de vulnerabilidades."
      },
      {
        "letra": "E",
        "texto": "a realização das intervenções, ações e atividades previstas no planejamento assistencial."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 34,
    "disciplina": "Enfermagem",
    "assunto": "Processo de Enfermagem e SAE",
    "enunciado": "Com base na classificação de intervenções de enfe rmagem NIC, uma intervenção do domínio fisiológico complexo é (são)",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o apoio nutricional."
      },
      {
        "letra": "B",
        "texto": "os primeiros socorros."
      },
      {
        "letra": "C",
        "texto": "o controle da eliminação."
      },
      {
        "letra": "D",
        "texto": "a assistência no autocuidado."
      },
      {
        "letra": "E",
        "texto": "a administração de medicamentos."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 35,
    "disciplina": "Enfermagem",
    "assunto": "Saúde Mental",
    "enunciado": "Na Rede de Atenção Psicossocial, a inclusão social das pessoas com transtornos mentais, usuários de drogas e álcool, por meio da construção de espaços de convívio e sustentação das diferenças na comunidade e em variados espaços da cidade, está relacionada ao seguinte componente:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Consultório na rua."
      },
      {
        "letra": "B",
        "texto": "Centro de convivência."
      },
      {
        "letra": "C",
        "texto": "Unidade de acolhimento."
      },
      {
        "letra": "D",
        "texto": "Programa de volta para casa."
      },
      {
        "letra": "E",
        "texto": "Serviços de residências terapêuticas."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 36,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "A coqueluche é uma das doenças cuja inc idência tem aumentado no país devido à queda nos índices de vacinação. Acerca da vacina que previne essa doença (DTP), analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa. ( ) A vacina DTP é contraindicada para crianças a partir de 7 anos de idade. ( ) O esquema vacinal completo é composto por 2 doses (esquema básico) e 1 dose de reforço, com intervalo mínimo de 3 meses entre as doses. ( ) Na indisponibilidade da vacina DTP, deve -se administrar a vacina penta como reforço. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – F – V."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – V – F."
      },
      {
        "letra": "E",
        "texto": "V – F – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 37,
    "disciplina": "Enfermagem",
    "assunto": "Saúde Mental",
    "enunciado": "O transtorno de Borderline é uma psicopatologia caracterizada por sintomas que incluem",
    "alternativas": [
      {
        "letra": "A",
        "texto": "fadiga, alucinações auditivas, pensamentos suicidas, estupor hipertônico e hipersomnia."
      },
      {
        "letra": "B",
        "texto": "ideação negativa, déficit de atenção e concentração, delírio de culpa, diminuição da libido e insônia."
      },
      {
        "letra": "C",
        "texto": "instabilidade emocional, sensação de inutilidade, insegurança, impulsividade e relações sociais prejudicadas."
      },
      {
        "letra": "D",
        "texto": "tristeza, delírio hipocondríaco, apatia, sentimento de tédio e irritabilidade aumentada a ruídos."
      },
      {
        "letra": "E",
        "texto": "estupor hipertônico, lentificação psicomotora, mutismo, delírio de inexistência e choro fácil."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 38,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "A quimioterapia indicada para a redução de tumores locais e regionalmente avançados, irressecáveis ou não, é denominada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "curativa."
      },
      {
        "letra": "B",
        "texto": "adjuvante."
      },
      {
        "letra": "C",
        "texto": "profilática."
      },
      {
        "letra": "D",
        "texto": "paliativa."
      },
      {
        "letra": "E",
        "texto": "neoadjuvante."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 39,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Durante a assistência a um paciente com lesão cerebral, o enfermeiro identificou afasia caracterizada pela incapacidade de nomear objetos, mesmo sabendo sua utilidade. Essa forma clínica é denominada afasia",
    "alternativas": [
      {
        "letra": "A",
        "texto": "verbal."
      },
      {
        "letra": "B",
        "texto": "global."
      },
      {
        "letra": "C",
        "texto": "motora."
      },
      {
        "letra": "D",
        "texto": "amnésica."
      },
      {
        "letra": "E",
        "texto": "sensorial."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 40,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Acerca da aspiração de secreções das vias aéreas, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa. ( ) Em pacientes intubados e com a pressão expiratória positiva - PEEP mais elevada deve ser utilizado sistema de aspiração fechado. ( ) Recomenda-se instilar solução salina estéril na via respiratória antes da aspiração como forma de diminuir a incid ência de pneumonia hospitalar. ( ) O intervalo entre as aspirações deve ser no máximo de 10 a 15 segundos, para evitar a ocorrência de broncoaspiração. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – F."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – V – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 41,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Considere a seguinte situação hipotética: No mês de junho o município X da região nordeste registou 80 casos novos de uma determinada doença, além dos 50 casos antigos com tratamento em curso. No mesmo período, o município Y apresentou 60 casos novos da mesma doença, além dos 70 antigos com tratamento em curso. Com base nesses dados, pode-se afirmar que no mês de junho",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o município X teve uma incidência maior da doença."
      },
      {
        "letra": "B",
        "texto": "o município Y teve uma prevalência maior da doença."
      },
      {
        "letra": "C",
        "texto": "o município X teve uma incidência menor, porém a prevalência foi maior que a do município Y."
      },
      {
        "letra": "D",
        "texto": "o município Y apresentou incidência e prevalência maiores que a do município X."
      },
      {
        "letra": "E",
        "texto": "o município X apresentou incidência e prevalência maiores que a do município Y."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 42,
    "disciplina": "Enfermagem",
    "assunto": "Centro Cirúrgico",
    "enunciado": "De acordo com o protocolo de cirurgia segura, uma das checagens que devem ser realizadas pelo condutor da Lista de Verificação antes da indução anestésica é a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "revisão de qualquer funcionamento inadequado de equipamentos ou questões que necessitem ser solucionadas."
      },
      {
        "letra": "B",
        "texto": "confirmação da administração de antimicrobianos profiláticos nos últimos 60 minutos da incisão cirúrgica."
      },
      {
        "letra": "C",
        "texto": "confirmação da acessibilidade dos exames de imagens necessários."
      },
      {
        "letra": "D",
        "texto": "revisão do plan o de cuidado e das providencias quanto à abordagem pós operatória."
      },
      {
        "letra": "E",
        "texto": "confirmação que o procedimento e o local da cirurgia estão corretos."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 43,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "De acordo com os protocolos do Ministério da Saúde, recomenda- se fortemente o rastreamento das desordens lipídicas em mulheres com 45 anos ou mais quando se enquadrarem como grupo de alto risco para doença coronariana. Um dos fatores de risco desse grupo é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o diabetes."
      },
      {
        "letra": "B",
        "texto": "o tabagismo."
      },
      {
        "letra": "C",
        "texto": "a obesidade."
      },
      {
        "letra": "D",
        "texto": "a hipertensão."
      },
      {
        "letra": "E",
        "texto": "o sedentarismo."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 44,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Na percussão abdominal de um paciente adulto com abdome protuberante, um achado patológico é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "timpanismo nas vísceras ocas."
      },
      {
        "letra": "B",
        "texto": "submacicez em ambos os flancos."
      },
      {
        "letra": "C",
        "texto": "timpanismo no espaço de Traube."
      },
      {
        "letra": "D",
        "texto": "macicez hepática no hipocôndrio direito."
      },
      {
        "letra": "E",
        "texto": "macicez no quadrante inferior esquerdo."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 45,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "No atendimento a um paciente com sinais e sintomas sugestivos de Síndrome Coronariana Aguda, uma das condutas recomendadas é a realização de ECG de 12 derivações em até",
    "alternativas": [
      {
        "letra": "A",
        "texto": "5 minutos da admissão."
      },
      {
        "letra": "B",
        "texto": "7 minutos da admissão."
      },
      {
        "letra": "C",
        "texto": "10 minutos da admissão."
      },
      {
        "letra": "D",
        "texto": "12 minutos da admissão."
      },
      {
        "letra": "E",
        "texto": "15 minutos da admissão."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 46,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Acerca da Doença Renal Crônica – DRC, avalie as afirmativas a seguir e assinale (V) para a afirmativa verdadeira e (F) para a falsa. ( ) É considerado portador de doença renal crôni ca o indivíduo que, independentemente da causa, apresente, por pelo menos dois meses consecutivos, TFG < 80mL/min/1,73m². ( ) Entre os principais fatores de risco para doença renal crônica estão o diabetes mellitus e a hipertensão arterial. ( ) O tratamento conservador da Doença Renal Crônica consiste em controlar os fatores de risco para a progressão da DRC, bem como para os eventos cardiovasculares e mortalidade. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – V."
      },
      {
        "letra": "B",
        "texto": "F – V – V."
      },
      {
        "letra": "C",
        "texto": "V – F – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – F – F."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 47,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Idoso",
    "enunciado": "Com base na avaliação e manejo do paciente idoso com diabetes, a meta de glicemia em jejum para um paciente frágil ou comprometido que apresente, entre outros sinais clínicos, limitação funcional e alterações cognitivas é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "60 – 100 mg/dL."
      },
      {
        "letra": "B",
        "texto": "70 – 120 mg/dL."
      },
      {
        "letra": "C",
        "texto": "80 – 130 mg/dL."
      },
      {
        "letra": "D",
        "texto": "90 – 150 mg/dL."
      },
      {
        "letra": "E",
        "texto": "100 – 180 mg/dL."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 48,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Recomenda-se interromper a infusão do quimioterápico, caso identificado ou relatado alguma reação adversa não esperada. Nesse sentido, assinale a opção cujos sintomas correspondem a uma reação adversa moderada.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Anafilaxia e hipotensão."
      },
      {
        "letra": "B",
        "texto": "Febre < 38°C e rubor."
      },
      {
        "letra": "C",
        "texto": "Urticária e dispneia."
      },
      {
        "letra": "D",
        "texto": "Angioderma e rash cutâneo."
      },
      {
        "letra": "E",
        "texto": "Broncoespasmo e rubor transitório."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 49,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Acerca do dispositivo Intrauterino de cobre e do hormonal, analise as afirmativas a seguir e marque V para a verdadeira e F para a falsa. ( ) Entre os efeitos colaterais do DIU com Levonorgestrel estão dor de cabeça, ganho de peso e tontura. ( ) Uma das vantagens do DIU de cobre é ter longa duração, podendo ser mantido por até 10 anos. ( ) O DIU hormonal age provocando uma ação i nflamatória e citotóxica com efeito espermicida. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – F."
      },
      {
        "letra": "B",
        "texto": "V – V – F."
      },
      {
        "letra": "C",
        "texto": "F – F – V."
      },
      {
        "letra": "D",
        "texto": "V – V – V."
      },
      {
        "letra": "E",
        "texto": "F – F – F."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 50,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Na assistência ao parto normal, a profilaxia antibiótica para Ruptura Prematura de Membranas - RPM no termo é recomendada em mulheres com período de latência",
    "alternativas": [
      {
        "letra": "A",
        "texto": "inferior a 6 horas."
      },
      {
        "letra": "B",
        "texto": "inferior a 10 horas."
      },
      {
        "letra": "C",
        "texto": "superior a 8 horas."
      },
      {
        "letra": "D",
        "texto": "superior a 10 horas."
      },
      {
        "letra": "E",
        "texto": "superior a 12 horas."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 51,
    "disciplina": "Enfermagem",
    "assunto": "Centro de Material e Esterilização (CME)",
    "enunciado": "De acordo com as disposições da ANVISA, um produto médico enquadrado como de uso único cujo reprocessamento é proibido é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o ambu."
      },
      {
        "letra": "B",
        "texto": "a cânula de Guedel."
      },
      {
        "letra": "C",
        "texto": "o macronebulizador."
      },
      {
        "letra": "D",
        "texto": "a máscara de nebulização."
      },
      {
        "letra": "E",
        "texto": "o cateter de balão intra-aórtico."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 52,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Com base nos protocolos de assistência ao recém-nascido, analise as afirmativas a seguir: I. No RN saudável e com boa vitalidade ao nascer, recomenda-se clampear o cordão umbilical no mínimo 60 segundos após a extração do concepto do útero materno. II. A aspiração de vias aéreas deve ser realizada de rotina tanto em recém-nascidos a termo como nos prematuros. III. Logo após o nascimento, os recém-nascidos de mulheres com HBV devem receber imunoglobulina humana anti-hepatite B. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, II e III."
      },
      {
        "letra": "B",
        "texto": "I, apenas."
      },
      {
        "letra": "C",
        "texto": "I e II, apenas."
      },
      {
        "letra": "D",
        "texto": "I e III, apenas."
      },
      {
        "letra": "E",
        "texto": "II e III, apenas."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 53,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "A síndrome congênita associada à infecção pelo vírus Zika (SCZ) é caracterizada por um conjunto de sinais e sintomas, entre os quais está a microcefalia. Segundo a Organização Mundial da Saúde (OMS), a microcefalia grave é caracterizada pelo perímetro cef álico (PC) com medida inferior a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 desvio-padrão abaixo da média específica para o sexo e a idade gestacional."
      },
      {
        "letra": "B",
        "texto": "2 desvios-padrão abaixo da média específica para o sexo e a idade gestacional."
      },
      {
        "letra": "C",
        "texto": "3 desvios-padrão abaixo da média específica para o sex o e a idade gestacional."
      },
      {
        "letra": "D",
        "texto": "4 desvios-padrão abaixo da média específica para o sexo e a idade gestacional."
      },
      {
        "letra": "E",
        "texto": "5 desvios-padrão abaixo da média específica para o sexo e a idade gestacional."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 54,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Com base nas orientações de manejo do pacien te com diarreia, a quantidade de líquidos que uma criança de 5 anos deve ingerir após cada evacuação diarreica é de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "10 a 20 mL."
      },
      {
        "letra": "B",
        "texto": "30 a 50 mL."
      },
      {
        "letra": "C",
        "texto": "50 a 100 mL."
      },
      {
        "letra": "D",
        "texto": "100 a 200 mL."
      },
      {
        "letra": "E",
        "texto": "200 a 300 mL."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 55,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Com base nas características dos métodos dialíticos, assinale a opção que apresenta uma vantagem e uma desvantagem da Hemodiálise Clássica.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Boa tolerância hemodinâmica e depuração limitada."
      },
      {
        "letra": "B",
        "texto": "Depuração elevada e baixa tolerância hemodinâmica."
      },
      {
        "letra": "C",
        "texto": "Melhor tolerância hemodinâmica e imobilização temporária."
      },
      {
        "letra": "D",
        "texto": "Grandes variações da homeostase e hipotermia frequente."
      },
      {
        "letra": "E",
        "texto": "Eficácia preditível e maior necessidade de anticoagulação."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 56,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "Assinale a opção que corresponde a uma contraindicação absoluta para doação de órgãos.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Hipertensão."
      },
      {
        "letra": "B",
        "texto": "Hipoglicemia."
      },
      {
        "letra": "C",
        "texto": "Infecção tratada."
      },
      {
        "letra": "D",
        "texto": "Diabetes insipidus."
      },
      {
        "letra": "E",
        "texto": "Tuberculose ativa."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 57,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Acerca dos métodos diagnósticos, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) A Ressonância Magnética com meio de contraste é realizada com solução a base de iodo, sendo contraindicada em pacientes com histórico de alergia a frutos do mar e crianças menores de 6 meses. ( ) Para ser considerada adequada a Monitorização Am bulatorial da Pressão Arterial (MAPA) deverá apresentar um número mínimo de medidas válidas: 16 na vigília e 8 durante o período de sono. ( ) No ECG de 12 derivações, o eletrodo correspondente à derivação V 5 deve ser posicionado no 4º espaço intercostal e o da derivação V6 na linha axilar anterior. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – F."
      },
      {
        "letra": "B",
        "texto": "V – V – V."
      },
      {
        "letra": "C",
        "texto": "F – F –V."
      },
      {
        "letra": "D",
        "texto": "V – F – V."
      },
      {
        "letra": "E",
        "texto": "F – F – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 58,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Um paciente politraumatizado apresentou alguns sinais e sintomas sugestivos de fratura de base de crânio, entre os quais equimose na região mastoidea. Essa manifestação clínica é denominada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "otorreia."
      },
      {
        "letra": "B",
        "texto": "rinorreia."
      },
      {
        "letra": "C",
        "texto": "sinal de Battle."
      },
      {
        "letra": "D",
        "texto": "olhos de guaxinim."
      },
      {
        "letra": "E",
        "texto": "sinal do duplo halo."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 59,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Com base na cadeia de sobrevivência intra -hospitalar, a primeira desfibrilação deve ser realizada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "antes das compressões torácicas."
      },
      {
        "letra": "B",
        "texto": "após as ventilações de resgate."
      },
      {
        "letra": "C",
        "texto": "antes da administração de oxigênio."
      },
      {
        "letra": "D",
        "texto": "após a ressuscitação avançada."
      },
      {
        "letra": "E",
        "texto": "após a administração de epinefrina."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 60,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "A diminuição do sódio total do organismo devido a perdas extrarrenais de sódio por vômitos, diarreia, aspiração de secreções gastroduodenais, sudorese profusa ou queimaduras é denominada hiponatremia hipotônica",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dilucional."
      },
      {
        "letra": "B",
        "texto": "isovolêmica."
      },
      {
        "letra": "C",
        "texto": "hipovolêmica."
      },
      {
        "letra": "D",
        "texto": "hipervolêmica."
      },
      {
        "letra": "E",
        "texto": "normovolêmica."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 61,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "O distúrbio acidobásico causado por hiperventilação e que es tá relacionado a um pH > 7,45 e a uma redução da pCO 2 é denominado",
    "alternativas": [
      {
        "letra": "A",
        "texto": "acidose mista."
      },
      {
        "letra": "B",
        "texto": "alcalose metabólica."
      },
      {
        "letra": "C",
        "texto": "acidose metabólica."
      },
      {
        "letra": "D",
        "texto": "acidose respiratória."
      },
      {
        "letra": "E",
        "texto": "alcalose respiratória."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 62,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Acerca da insuficiência respiratória e modalidades de ventilação mecânica, analise as afirmativas a seguir e assinale (V) para a afirmativa verdadeira e (F) para a falsa. ( ) A Ventilação Não -Invasiva com Pressão Positiva (VNPP) possibilita a assistência ventilatória, com FiO 2 e pressão positiva controladas de vias aéreas, sem a necessidade de via aérea artificial invasiva. ( ) Um dos critérios que indicam a intubação traqueal e a ventilação mecânica é a persistência de hipoxemia após a administração de oxigênio. ( ) Na ventilação com Suporte de Pressão (PSV ou PS) a pressão inspiratória é aplicada durante a inspiração espontânea do paciente, incrementando o volume inalado e reduzindo o trabalho respiratório. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – V – F."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 63,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "Um profissional de enfermagem cometeu uma infração e foi punido com multa correspondente a 6 vezes o valor da anuidade da sua categoria profissional, em vigor no ato do pagamento. Nesse caso, é correto afirmar que a punição está",
    "alternativas": [
      {
        "letra": "A",
        "texto": "de acordo com o Código de Ética, que estabelece multa de até 10 vezes o valor da anuidade da categoria profissional, em vigor no ato do pagamento."
      },
      {
        "letra": "B",
        "texto": "em desacordo com o Código de Ética, pois a multa deveria ser de até 5 vezes o valor da anuidade da sua categoria profissional, em vigor no ato da infração."
      },
      {
        "letra": "C",
        "texto": "de acordo com o Código de Ética que estabelece multa de até 6 vezes o valor da anuidade da categoria profissional, em vigor no ato da infração."
      },
      {
        "letra": "D",
        "texto": "em desacordo com o Código de Ética, pois a multa não deveria ultrapassar 4 vezes o valor da anuidade da sua categoria profissional, em vigor no ato do pagamento."
      },
      {
        "letra": "E",
        "texto": "de acordo com o Código de Ética que estabelece multa de até 9 vezes o valor da anuidade da categoria profissional, em vigor no ato do pagamento."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 64,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "A encefalopatia hepática é uma das manifestações clínicas que caracteriza a insuficiência hepática aguda, podendo ter 4 graduações. Assinale a opção que apresenta um sintoma da e ncefalopatia hepática de terceiro grau.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Letargia."
      },
      {
        "letra": "B",
        "texto": "Fala arrastada."
      },
      {
        "letra": "C",
        "texto": "Sem resposta à dor."
      },
      {
        "letra": "D",
        "texto": "Confusão acentuada."
      },
      {
        "letra": "E",
        "texto": "Confusão moderada."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 65,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Na reanimação do recém -nascido ≥ 34 semanas, a ventilação e a massagem cardíaca devem ser realizadas de forma sincrônica, com uma frequência de 120 eventos por minuto, correspondendo a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "40 movimentos de massagem e 80 ventilações."
      },
      {
        "letra": "B",
        "texto": "60 movimentos de massagem e 60 ventilações."
      },
      {
        "letra": "C",
        "texto": "80 movimentos de massagem e 40 ventilações."
      },
      {
        "letra": "D",
        "texto": "90 movimentos de massagem e 30 ventilações."
      },
      {
        "letra": "E",
        "texto": "100 movimentos de massagem e 20 ventilações."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 66,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "De acordo com as diretrizes atualizadas da American Heart Association (2023), em pacientes com qu adro de intoxicação combinada por opioides e benzodiazepínicos, o primeiro antídoto recomendado, por possuir um perfil de segurança melhor, é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Digoxina."
      },
      {
        "letra": "B",
        "texto": "Glucagon."
      },
      {
        "letra": "C",
        "texto": "Naloxona."
      },
      {
        "letra": "D",
        "texto": "Flumazenil."
      },
      {
        "letra": "E",
        "texto": "Nitrito de sódio."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 67,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "Na assistência a um paciente com Herpes Zoster, os profissionais de saúde devem manter as precauções recomendadas",
    "alternativas": [
      {
        "letra": "A",
        "texto": "até secarem as lesões."
      },
      {
        "letra": "B",
        "texto": "durante toda a internação."
      },
      {
        "letra": "C",
        "texto": "até o final do tratamento."
      },
      {
        "letra": "D",
        "texto": "2 dias após o início do tratamento."
      },
      {
        "letra": "E",
        "texto": "4 dias após o início do tratamento."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 68,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "Com base nas orientações da ANVISA acerca das medidas para prevenção de pneumonia associada à ventilação - PAV, analise as afirmativas a seguir: I. A utilização do decúbito elevado diminui a incidência de PAV especialmente em pacientes recebendo nutrição enteral. II. A presença do tubo endotraqueal em pacientes sob ventilação mecânica contribui para o desenvolvimento de pneumonia. III. A utilização da cânula orotraqueal, com um sistema de aspiração de secreção subglótica contínua ou intermitente, é recomendada para pacientes que irão permanecer sob Ventilação Mecânica acima de 48h ou 72h. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, II e III."
      },
      {
        "letra": "B",
        "texto": "I, apenas."
      },
      {
        "letra": "C",
        "texto": "II, apenas."
      },
      {
        "letra": "D",
        "texto": "I e II, apenas."
      },
      {
        "letra": "E",
        "texto": "II e III, apenas."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 69,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "No gerenciamento de uma unidade de saúde, uma enfermeira utilizou o Ciclo PDCA para promover melhorias em alguns processos. Com base na dinâmica desse ciclo, assinale a opção que apresenta uma ação da etapa representada pela letra D.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Definir as metas e objetivos."
      },
      {
        "letra": "B",
        "texto": "Executar o que foi planejado."
      },
      {
        "letra": "C",
        "texto": "Padronizar os resultados."
      },
      {
        "letra": "D",
        "texto": "Validar a eficácia do plano de ação."
      },
      {
        "letra": "E",
        "texto": "Medir os resultados com base nas metas."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 70,
    "disciplina": "Enfermagem",
    "assunto": "Gerenciamento de Resíduos de Serviços de Saúde (GRSS)",
    "enunciado": "Acerca do descarte dos Resíduos de Serviços de Saúde resultantes de atividades de vacinação com microrganismos vivos, atenuados ou inativados, de bolsas de sangue e de amostra biológicas, assinale V para a verdadeira e F para a falsa. ( ) As agulhas e o conjunto seringa-agulha utilizados na aplicação de vac inas, quando não desconectadas, devem atender às regras de manejo dos resíduos perfurocortantes. ( ) As bolsas de sangue e de hemocomponentes rejeitadas por contaminação ou por má conservação devem ser tratadas antes da disposição final ambientalmente adequada. ( ) As sobras de amostras de laboratório contendo sangue ou líquidos corpóreos podem ser descartadas diretamente no sistema de coleta de esgotos, desde que atendam as regras estabelecidas pelos órgãos competentes. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – V – F."
      }
    ],
    "correta": "C"
  }
];
