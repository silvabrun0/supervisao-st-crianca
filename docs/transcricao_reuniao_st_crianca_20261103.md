# TRANSCRIÇÃO OFICIAL DA REUNIÃO ST CRIANÇA
## Planejamento Escolar, Alinhamento Pedagógico e Engenharia da Plataforma

> **Data da Reunião:** 03 de Novembro de 2026 (03/11/2026)  
> **Participantes Convocados:**
> - **Diogo Dias Furtado** (Equipe Técnica / Arquitetura de Dados)
> - **Julia Elena Cordoba Vieira** (Núcleo de Educação Infantil / Gestão Pedagógica Central)
> - **Carolina Machado Furtado** (Coordenação de Campo / Articulação Territorial)
> - **Bruno Pereira da Silva** (Arquiteto de Software / Desenvolvimento da Plataforma)  
> **Duração Total da Gravação:** 01h 36min 49s  
> **Origem dos Registros:** ST Criança - Transcrição Automática e Síntese de Governança

---

## 1. Resumo Executivo e Síntese de Alinhamentos

Reunião estratégica de planejamento escolar, diagnóstico pedagógico da rede municipal de Patos/PB e alinhamento tecnológico da plataforma de supervisão do programa **SerTão Criança**.

### Eixos Principais Abordados:
1. **Organização Escolar e Pedagógica:** Visitas às unidades escolares (Antônio de Palmeira e demais creches), organização do calendário de fim de ano, preparativos para a festa da Educação Infantil e transição da coordenação pedagógica da rede.
2. **Diagnóstico Crítico da Rede:** Confrontação com os dados da Avaliação da Educação Infantil (EAP), identificação de práticas pedagógicas mecânicas disseminadas a partir de fichas inadequadas de alfabetização e reforço da necessidade de acompanhamento sistemático da coordenação.
3. **Demonstração do Aplicativo e Ajustes Técnicos:** Apresentação da versão mobile e desktop por Bruno Pereira da Silva, abrangendo turmas, duplas regências, caracterização de alunos com deficiência (AEE/inclusão) e repositório centralizado.
4. **Governança de Dados e Planilhas:** Alinhamento sobre o fluxo de cadastro: importação centralizada da base inicial pelo Núcleo de Educação Infantil e edições pontuais subsequentes pelas unidades escolares.

---

## 2. Decisões Oficiais Alinhadas

* **Restrição de liberação de relatórios escolares:** Ficou terminantemente alinhado que os relatórios diagnósticos por escola e o consolidado da rede municipal NÃO serão liberados às unidades escolares previamente. A entrega e devolutiva dos dados ocorrerão exclusivamente durante a presença física de Júlia e equipe em Patos, evitando interpretações isoladas ou descontextualizadas.
* **Fixação integral do instrumento de supervisão:** Acordou-se manter o instrumento de supervisão pedagógica na íntegra, com todos os itens concebidos pelo LEPS, sem supressão de critérios. O acompanhamento resultante servirá de base estruturante para as formações docentes e de gestores em 2027.
* **Implantação dos três instrumentos em janeiro:** Definiu-se colocar em operação em janeiro de 2027 os três instrumentos do ecossistema:
  1. Supervisão Pedagógica (prática em sala);
  2. Supervisão de Ensino / Acompanhamento da Coordenação (formadoras);
  3. Instrumento do Gestor Escolar (insumos e infraestrutura integrada à Secretaria).
  Mesmo que não estejam com 100% de refinamento, a implementação avançará e os ajustes serão realizados no percurso formativo.
* **Cancelamento da formação étnico-racial e de inclusão:** Cancelamento oficial das formações de inclusão e temática étnico-racial que estavam previstas para novembro, em decorrência de sobreposição de agenda (evento de Márcio no dia 19) e reconhecimento da falta de repertório técnico interno do núcleo para conduzir a temática com a profundidade necessária.
* **Periodicidade bienal das avaliações no PME:** Formalização junto ao Plano Municipal de Educação (PME) de que a Avaliação da Educação Infantil (EAP) e o Indicador Nacional (INAP) sejam instrumentos obrigatórios da rede, com aplicação garantida no máximo a cada dois anos.
* **Centralização inicial da base cadastral:** A carga inicial completa de dados (escolas, polos, formadoras, coordenadoras, turmas e professores) será realizada de forma centralizada pelo Núcleo de EI via planilha modelo única. As coordenadoras de unidade assumem apenas manutenções e edições pontuais subsequentes em suas respectivas escolas.
* **Validação em ambiente de testes:** O desenvolvedor fornecerá o link da plataforma com credenciais e perfis de teste (coordenação, formação e núcleo) para navegação livre e homologação crítica por Carolina e Julia antes das reuniões presenciais.

---

## 3. Próximas Etapas e Atribuições Nominais

* `[Bruno Pereira da Silva]` **Compartilhar mudanças:** Compartilhar as alterações realizadas na interface para balizar os próximos passos da supervisão pedagógica.
* `[Carolina Machado]` **Agendar comitê:** Agendar a reunião do comitê gestor com Adriana (Secretária) e Jacob para uma terça ou quarta-feira, nos dias 8 ou 9.
* `[Julia Elena Cordoba Vieira]` **Revisar documento:** Refinar o documento de devolutiva e supervisão pedagógica adicionando blocos de perguntas estruturadas com critérios objetivos de observação.
* `[Julia Elena Cordoba Vieira]` **Conversar com Juliana:** Orientar Juliana sobre a postura adequada e o alinhamento esperado durante a reunião do comitê gestor com Adriana.
* `[Carolina Machado, Julia Elena Cordoba Vieira]` **Realizar reuniões:** Conduzir um encontro de um dia inteiro com a equipe do núcleo sobre dados da EAP e meio período com as coordenadoras pedagógicas das unidades.
* `[O grupo]` **Justificar cancelamento:** Reportar a Adriana com clareza técnica e transparência que as formações de inclusão e étnico-raciais não ocorreram por conflito de agendas e planejamento do núcleo.
* `[Bruno Pereira da Silva]` **Criar Modelo Planilha:** Disponibilizar arquivo modelo padronizado para download que permita o preenchimento unificado e importação da base pelas instâncias gestoras.
* `[Bruno Pereira da Silva]` **Atualizar Faixas Etárias:** Alterar as etiquetas de idade na interface para a nomenclatura oficial: `0 a 1 ano e 11 meses`, `1 ano a 1 ano e 11 meses`, `2 anos a 2 anos e 11 meses`, `3 anos a 3 anos e 11 meses`, `4 anos a 4 anos e 11 meses` e `5 anos a 5 anos e 11 meses`.
* `[Bruno Pereira da Silva]` **Ajustar Regência Dupla:** Habilitar o sistema para permitir que um mesmo docente possa ser vinculado a duas turmas distintas (dobras de turno, dupla matrícula ou contratos duplos).
* `[Bruno Pereira da Silva]` **Adicionar observação docente no status consistente:** Implementar campo de observação descritiva individualizada por docente mesmo quando a prática na turma for avaliada como *Consistente*, permitindo registrar se uma das professoras da dupla não apoiou ou teve atuação discrepante.
* `[Bruno Pereira da Silva]` **Compartilhar plataforma:** Enviar o link de acesso da plataforma web com perfis de teste e instruções de navegação para homologação por Julia e Carolina.
* `[Julia Elena Cordoba Vieira, Carolina Machado]` **Testar plataforma:** Realizar testes de navegação e preenchimento para consolidar dúvidas e pontos de melhoria antes da missão a Patos.

---

## 4. Transcrição Cronológica Integral (Verbatim)

### [00:09:01]
**Carolina Machado:** Hello. Demorei, hein? Que horas são? Ixe, Maria, muito atrasada.  
**Julia Elena Cordoba Vieira:** Fica tranquilo.  
**Diogo Dias Furtado:** Boa tarde.  
**Carolina Machado:** Tarde. Tá vendo a secretaria, menina?  
**Julia Elena Cordoba Vieira:** E aí, como que foram?  
**Bruno Pereira da Silva:** E aí, Carol?  
**Carolina Machado:** Tudo bem? Eh, deixa eu ver o que era que eu tinha de dizer. E aí, tá tudo bem?  
**Julia Elena Cordoba Vieira:** Ah, Carol, bem forte, bem cheio de trabalho.  
**Carolina Machado:** Maria, é o mal do século.  
**Julia Elena Cordoba Vieira:** É.  
**Carolina Machado:** Jú, eh, sabe aquelas duas unidades que você tinha falado para eu visitar?  
**Julia Elena Cordoba Vieira:** Uhum.  
**Carolina Machado:** Marquei para segunda e terça, tá?  
**Julia Elena Cordoba Vieira:** Tá.  
**Carolina Machado:** Vou para segunda, vou para uma e terça vou pra outra.  
**Julia Elena Cordoba Vieira:** Tá.  
**Carolina Machado:** Mas aí eu tava vendo quem aplicou lá na Antônio de Palmeira foi Juliana e Larissa e na outra foi Socorro e Amanda. Aí perguntei um pouco pra Juliana como foi a experiência lá. E eu acho que é isso mesmo, hein?

### [00:10:04]
**Carolina Machado:** Mas aí eu vou lá, já marquei por segunda e terça. Tô tentando achar algum negócio para dizer.  
**Julia Elena Cordoba Vieira:** Uhum.  
**Carolina Machado:** Apresentei a elas como é que tá, como é que vai ficar, eu falei, né? Já tá tudo certo, já fizeram hoje o encaminhamento para treinamento, lanche, para tudo, sabe? Aí no dia você vai tá aqui do dia 7, na semana de 7 a 11, né? Elas estão querendo fazer aquela festa que ia ser o ano passado, só com a educação infantil no dia 9.  
**Julia Elena Cordoba Vieira:** Olha só. Dessa vez, Carol, vou fazer reunião com a Adriana, com o Jacó, óbvio, mas eu quero fazer uma reunião de dados só com elas.  
**Carolina Machado:** Boa. Chegou no canto. Juliana mandou para mim. Deixa eu abrir aqui para lhe mostrar, tá? Deixa eu abrir que aí eu vou... Eu posso falando?  
**Julia Elena Cordoba Vieira:** Pode.  
**Carolina Machado:** Eu não sei nem se eu posso.

### [00:11:03]
**Carolina Machado:** Eu tô esbaforida, minha filha.  
**Julia Elena Cordoba Vieira:** Não, pode falar. O Bruno depois vai compartilhar com a gente aqui as mudanças que ele fez na interface pra gente ver qual que é o próximo passo de supervisão pedagógica.  
**Carolina Machado:** Aqui de abrir compartilhar calor, Júlia. Um calor, um calor. Eu não tenho noção. Ah, pera aí, Júlia. Quantas pessoas são convidadas para a festa do LEPS, menina?  
**Julia Elena Cordoba Vieira:** 200.  
**Carolina Machado:** Ó, vamos lá. Lembra que Juliana, eu tinha falado de uma devolutiva? Eu tinha pedido para ela escrever um documento. O documento que ela traz é esse aqui, ó, que a nossa já é...  
**Julia Elena Cordoba Vieira:** Ah, vai c****. Não é possível, velho.  
**Carolina Machado:** Não, eu falei... Eu falei assim: "Juliana, pera aí, eu não tô entendendo o que você tá dizendo aí. Isso aqui, essa parte aqui quero, deixa eu te mostrar a parte."

### [00:12:21]
**Carolina Machado:** Ai...  
**Julia Elena Cordoba Vieira:** Não, eu devo ter cara de palhaça mesmo, né? Não é possível.  
**Carolina Machado:** Júlia, essa parte aqui eu quero igualzinho. Digo: "Juliana, tá certo. Não foi isso que Júlia entregou, não. Não, não foi não. Tá certo. Tá bom, tá bom, tá bom. Então você... então eu apresento isso aqui a ela ou você vai escrever ainda?" Aí eu abri aquela de Florianópolis que você mandou, de Grand Florianópolis...  
**Julia Elena Cordoba Vieira:** Não, de Porto Alegre.  
**Carolina Machado:** De Porto Alegre, desculpa. Vamos tirar aquela parte que tem a parte que é igual a essa e ainda tem aquela parte que tem o item.  
**Julia Elena Cordoba Vieira:** Uhum.  
**Carolina Machado:** Pronto. Então é isso, viu, querida? Tá bom.  
**Julia Elena Cordoba Vieira:** Tá bom.  
**Carolina Machado:** Aí ela dizendo, porque a primeira ela mostrou aquela primeira de André, aí eu falei: "Ju, mas me diga o que é que você quer".

### [00:13:10]
**Carolina Machado:** Porque ela não tava conseguindo sequer escrever. Deixa eu sair daqui. Ela não tava conseguindo sequer escrever o que ela queria, entendeu?  
**Julia Elena Cordoba Vieira:** Mhm.  
**Carolina Machado:** Aí fui abrir todas as outras coisas com ela, fui abrir tudo. Aí no fim ela chegou nessa daqui. Aí foi quando eu fui mostrar aquela e disse assim, só que não vem assim por unidade. Por unidade vai vir parecido com essa parte aqui. Tem uma parte lá que tem, né, na de Porto Alegre. Vai vir parecido com isso, por isso, por isso, por isso. Não. Perfeito, perfeito. Carol, para devolutiva. Ela mostrou aquela que você faz sempre, que você traz o gráfico da EAP cruzando com o do INAP.  
**Julia Elena Cordoba Vieira:** Vou matar ela.  
**Carolina Machado:** Não, eu vou matar ela porque faz três semanas, eu acho que eu tô com isso na minha cabeça, cobrando ela toda semana, essa escrita. E aí, eh, falei com ela mais uma vez sobre a data que ela precisa nos dar dessa transição, que ela precisa fazer uma transição com essa pessoa, que você quer conhecer a pessoa enquanto coordenadora do núcleo já na sua vinda a Patos.

### [00:14:13]
**Carolina Machado:** E ela disse aquela mesma coisa que ia tratar disso agora na reunião com a Adriana. Reunião não, nessa viagem que ela vai para esse evento que vai ter em São Paulo dia 10.  
**Julia Elena Cordoba Vieira:** A gente vai tá lá.  
**Carolina Machado:** Pronto. Ela disse que a Adriana pediu para elas conversarem durante essa viagem. Outra coisa.  
**Julia Elena Cordoba Vieira:** Tá? Eu, o que que eu pensei dos relatórios por escola? Só liberar para elas quando eu tiver aí.  
**Carolina Machado:** Ah, não. Tudo é quando você tiver aqui.  
**Julia Elena Cordoba Vieira:** Só liberar, tipo, tanto de rede, tipo, não vou entregar nada antes. E aí, o que que eu pensei no momento com elas? Falar muito, tipo, vou falar dos dados, óbvio, óbvio que eu vou falar dos dados, mas falar muito mais do quanto a ausência de supervisão pedagógica e de orientação qualificada estão mantendo práticas muito ruins na rede. Esse é o ponto no final do dia. É esse e como o trabalho longe do gestor de maneira prática tem mantido as unidades ainda inseguras para a criança.

### [00:15:19]
**Julia Elena Cordoba Vieira:** Elas foram, elas coletaram, elas viram.  
**Carolina Machado:** Isso. Boa. Que que eu falei hoje? Hoje não falei sobre "gente, vamos fazer uma reflexão". Eu não quero que vocês me digam, me respondam nada, Ju. Eu cheguei aqui, a gente chegou a uma conclusão que não vale mais a pena eu encaminhar algumas coisas com você, mas vale a pena encaminhar outras. Então, o que é que a gente pode deixar encaminhado já no comitê gestor, com a Valda Adriana, por exemplo, é um instrumento de gestores, um instrumento de supervisão. E aí ela concordou, sabe? Júlia disse inclusive: "Ah, Carol, a gente... isso também é atendendo uma demanda de Adriana". Eu falei: mas olha, é importante que fique claro para a Adriana, mas isso é o que Júlia vai saber fazer muito bem, que atende a uma demanda da rede, mas é um instrumento que partiu do LEPS. Então isso aqui não é uma coisa que a Adriana vai dizer que o LEPS fez por causa de Patos, entende?

### [00:16:24]
**Carolina Machado:** É o contrário. A gente já trouxe isso para cá antes. A gente vai atender uma demanda dela no sentido de, ah, eu quero saber onde é que tá faltando pia. Ela vai conseguir ter acesso a isso a partir desse instrumento, a partir dessa aplicação, que é o que a gente vai fazer ali entre uma EAP e outra, entre um INAP e outro. Mas não quer dizer que foi ideia de Adriana, que eu acho que isso é uma coisa que a gente tem que desmistificar nesse instrumento, né? Ela tem muito isso de dizer. Mas que a gente vai deixar amarrado sim. Júlia vai apresentar sim. E outra coisa, Júlia, a gente vai deixar amarrado o instrumento na íntegra, do jeito que os meninos desenharam. Então ele vem na íntegra, ele vem com todos os itens. Eu já tenho um desenho de implementação dele, Júlia me pediu para fazer, já tá bem estruturado. Vamos fazer isso a partir de formação.

### [00:17:11]
**Carolina Machado:** E a gente vai fazer as formações de 2027 basicamente baseado nesse acompanhamento. Então, já quis dizer assim: isso é uma coisa que você não vai mais interferir.  
**Julia Elena Cordoba Vieira:** É isso.  
**Carolina Machado:** Eu quero a sua opinião no sentido de: você acha que a gente já deixa amarrado com a Adriana, ou a gente espera a outra supervisora, a outra coordenadora? Não, deixa tudo amarrado agora.  
**Julia Elena Cordoba Vieira:** Eu vi parte que fala assim: "Ah, quantas turmas você conseguiu acompanhar?". Eu acho que tem uma parte ali que se usa e tem uma parte que precisa detalhar um pouco mais os mecanismos de checagem e os critérios de checagem para a coordenação. Por exemplo, hoje esse time de coordenação pactuou várias coisas sobre o que elas têm que prestar atenção ou não, mas mesmo entre elas existe uma heterogeneidade bem grande entre as coordenadoras das unidades.

### [00:18:18]
**Julia Elena Cordoba Vieira:** Beleza? Aí como as formadoras estão num nível de qualidade que eu julgo um pouco acima das coordenadoras das unidades, por isso que elas estão ali também. Quais são os critérios que elas têm que observar? Por exemplo: "você tem conseguido notar avanço na prática?". Eu achei essa pergunta muito boa de fato, mas qual o critério? É uma pergunta aberta, pergunta fechada? Sim ou não? E elas vão explorar. E aí que critério? Como que elas exploram para saber se realmente tem tido o avanço?  
**Carolina Machado:** Como é que a supervisora avalia se realmente houve mudança ou como que a coordenadora vai trazer itens de mudança?  
**Julia Elena Cordoba Vieira:** Eu acho que tem duas partes. A primeira parte é a coordenadora estar dotada de um instrumento que usou dos critérios como forma de pergunta.

### [00:19:17]
**Julia Elena Cordoba Vieira:** Então, pergunta aberta, por exemplo, não é um critério. Agora, é uma pergunta: ela faz pergunta aberta? Então ela faz isso, ela faz aquilo, isso foi bom. E aí, como que a gente conecta esses dois instrumentos? A interface é uma das formas de conectar, porque ela vai trazer dados, se aumentou o número de professores fazendo pergunta aberta e por aí vai. Mas o reportar, eu acho que "avanço de práticas" é muito aberto.  
**Carolina Machado:** Sim.  
**Julia Elena Cordoba Vieira:** Eu acho que esse avanço de práticas tem que virar outras perguntas, que é: a sua professora tem conseguido colocar práticas X, Y, Z de maneira consistente? Tipo pegar exemplos de práticas, de comportamentos que dizem sobre uma prática de qualidade, colocar isso em formato de pergunta para conseguir captar exatamente aquilo que se deseja. Então, ó: você tem 11 professoras. As suas professoras, primeiro, quantas turmas você tá conseguindo acompanhar dentro desse mês? As professoras estão conseguindo imprimir esse comportamento? E em qual estratégia elas têm mais dificuldade?

### [00:20:41]
**Julia Elena Cordoba Vieira:** E aí, opções fechadas: é em pergunta aberta? É em conectar com a realidade da criança? É em organizar cantos diferentes para evitar tempo de espera? Então tem que ter uma parte de tentar entender qual que é a principal dificuldade das professoras, e o que a formadora tem que manter em mente é entender qual é a qualidade do acompanhamento da coordenação.  
**Carolina Machado:** Ah.  
**Julia Elena Cordoba Vieira:** Por que que eu tô falando isso? Por causa dos dados da EAP. Eu sei que hoje não tem supervisão pedagógica sistemática, mas ao mesmo tempo eu sei que as coordenadoras estão dentro da unidade. Quando eu vejo uma unidade em que a prática pedagógica deu como inaceitável, eu fico bem preocupada com a presença dessa coordenadora lá dentro. Como é o dia a dia dela? O que ela tem feito? Ela não tem checado nunca se essas formações que estão sendo feitas estão indo para dentro da sala?

### [00:21:46]
**Julia Elena Cordoba Vieira:** É isso que me pegou um pouco. Então acho que tem que criar ali uma parte do roteiro que é: você tá acompanhando? Acompanhando com qualidade? Eu quero ver o material, quero ver o preenchimento, quero ver com você. E aí, num dia de visita, talvez combinar uma visita conjunta: vamos fazer a observação da professora junto. Por que isso? Para calibrar o olhar. Porque às vezes chega: "não, essa professora aqui é maravilhosa, fui lá, preenchi tudo no meu roteirinho", e aí a formadora vai lá para a visita e não é bem assim. Claro que pode ser um dia que a professora não tava bem, mas tem um desafio que é de manter a qualificação da coordenação.

### [00:23:07]
**Julia Elena Cordoba Vieira:** Porque a coordenação passa por formação, mas a gente não tem certeza se as coordenações realmente conseguiram transpor aquilo. O relatório da EAP ter um sarrafo lá em cima e elas terem descido a lenha nas práticas me diz que sim, mas no olhar, na prática e em criar modelos práticos para os professores entenderem como se faz uma prática daquela. Eu vou palpitar mais forte naquele documento, comecei a olhar para ele, como é que viram perguntas, um bloco de perguntas para isso.  
**Carolina Machado:** Quando você fala: "a professora poderia não estar bem nesse dia", a coordenadora sabe disso melhor que nós e as formadoras. Ela tá lá todos os dias. O que me pegou com esses resultados da EAP foram duas coisas: uma, as coordenadoras estarem dentro da unidade; duas, quando a gente olha esse tanto de prática mecânica.

### [00:23:58]
**Carolina Machado:** Quando eu pergunto para a professora lá que eu fiz a observação: "Qual é o instrumento que você usa para acompanhar a aprendizagem das crianças?". Ela responde: "Aquela ficha que a Denise deu". Aquela ficha terrível que eu fiz um feedback com ela e disse: "Essa ficha vai pautar o acompanhamento do professor". Aquela ficha com cinco itens, acho que é escrita do nome, leitura... Olha que coisa horrível! Eu fiz uma reunião só sobre aquilo, elas trouxeram argumentos, não me convenceram. Eu disse que tudo bem, partam por ela. E quando chego na turma para observar, a professora me diz que usa aquela ficha!

### [00:24:57]
**Carolina Machado:** E aí, como é que eu acompanho todas as aprendizagens da criança se você me traz cinco questões dentro de uma ficha que foi apresentada numa formação de Pré-2? As professoras acham que estão respaldadas. Eu lembro muito bem que avisei: "Vocês não vão dizer na frente dos professores que é só isso e acabou, mas o professor vai entender assim". Dito e feito! Quando a gente começar a ouvir as coordenadoras, elas vão dizer que as professoras de Pré-2 estavam trazendo essa devolutiva porque acompanhavam a partir dessa ficha.

### [00:26:00]
**Carolina Machado:** Então a gente tem que repensar isso para o ano que vem, porque isso pode ter colocado as práticas ofertadas às crianças num lugar mecânico. Porque se eu estou avaliando se a criança escreve 'pato' e lê 'pato', eu vou ter que fazer um treino mecânico.  
**Julia Elena Cordoba Vieira:** E aí você também me diz sobre como a Denise tá fazendo o planejamento.  
**Carolina Machado:** Juliana falou assim: "Carol, é interessante porque quando a gente chega para observar uma turma de Creche 3, a gente vê que aquilo que tá passando no Pré-2 desce e chega até a Creche 3". Eu disse: "Claro, Ju, as professoras conversam!". Se a meta é a criança escrever o nome e ler 'pato', a professora do Pré-2 fala com a do Pré-1, que fala com a da Creche 3 daqui a pouco.

### [00:26:59]
**Carolina Machado:** A gente vê esse monte de prática mecânica e não tem condições! Estamos priorizando isso e esquecendo tudo o resto.  
**Julia Elena Cordoba Vieira:** E tem a qualidade dos professores também: como conseguir englobar tudo isso numa prática diversa que oportunize outras aprendizagens? Eles ficam focados em "nome, letra, nome, treino". O planejamento da Denise não tá sendo efetivo, ou os professores acham muito difícil e vão para a folhinha. A coordenação tá dentro da unidade e tá alheia.

### [00:27:50]
**Julia Elena Cordoba Vieira:** A coordenação dentro da unidade está alheia.  
**Carolina Machado:** Quando se trata de pré-escola, as coordenadoras acham que a responsabilidade é da Denise e da Zoriane. Elas estão abrindo mão dessas turmas. Lembra de uma professora que chamou Juliana na sala e disse: "Juliana, vem ver essa atividade, estou fazendo escrita espontânea". Aí botava uma palavra no quadro e mandava o menino copiar! Isso não é escrita espontânea. O professor não entendeu o conceito. Se até na frente da coordenadora da Educação Infantil a professora mostra cópia achando que é escrita espontânea, o que está sendo passado nas reuniões não está chegando ao professor.

### [00:28:58]
**Carolina Machado:** Se a escrita espontânea virou cópia, o que está acontecendo? Quando a gente cobra, Alexandra vem falar que não tem tempo, que tem demanda. Eu falei: "Ei, vocês são desorganizadas!". Vocês recebem uma bolsa do Prolei para usar um período do trabalho, mas usam o tempo todo com o Prolei e trabalham a toque de caixa, sem organizar o que é preciso. O núcleo não tem condições de assumir Prolei, então que passem para os coordenadores de unidade. Este ano não fizemos formação com gestor, não botamos os GTs para frente.

### [00:29:50]
**Carolina Machado:** Júlia fez uma reunião há um ano e disse: "Quem vai chamar o GT não é o LEPS, é Patos!". Se eu não ficasse em cima, formação teria saído? Se o LEPS tivesse saído do território em julho, as formações teriam ido para a frente? Vocês têm que pensar nisso: o que vocês fizeram este ano?

### [00:30:43]
**Carolina Machado:** Isa disse que vê muita mudança na rede, mas onde está o nosso dedo nisso? A Lê (Alexandra), por mim, não voltava no ano que vem. Ela passa só as manhãs lá. Adriana vai mandar mais duas pessoas para a equipe.  
**Julia Elena Cordoba Vieira:** A reunião de final de ano com elas não vai ser gentil. Depois de três anos, é isso aqui que estamos vendo nas práticas? Vocês estão com uma coordenadora em cada unidade e as práticas continuam as mesmas? Onde está o elo que não conectou?

### [00:32:37]
**Carolina Machado:** A equipe precisa de alguém que lidere e cobre: "Cadê a formação? Cadê o GT?". E essa pessoa deveria ser a Juliana. Temos que voltar àquele documento de definição de papéis.

### [00:33:37]
**Carolina Machado:** Se a gente for começar o ano que vem já com o instrumento de supervisão que os meninos estão fazendo, eles têm que entregar o aplicativo até dezembro, né? Seu microfone tá desligado.

### [00:34:50]
**Julia Elena Cordoba Vieira:** Carol, é para entrar em janeiro com os três: a pedagógica, a de coordenação e a do gestor escolar. Pode construir o plano de implementação de todos eles conjuntamente, porque vai sair querendo ou não. Se não finalizou, vai do jeito que tá e a gente vai mudando no meio do caminho.  
**Carolina Machado:** E o que a gente tem que fazer com o gestor especificamente? A coluna de encaminhamentos, lembra?

### [00:35:38]
**Carolina Machado:** Apresentar já no aplicativo. Encaminhamentos e uma forma de acompanhar as solicitações. Por exemplo: a diretora solicitou a troca de tomadas, como é que o núcleo acompanha?  
**Julia Elena Cordoba Vieira:** Entendi! O gestor foi lá, fez a coleta e viu que precisa de tampa de tomada. Ele não consegue comprar com o PDDE, então solicita para a Secretaria 200 tampas.

### [00:36:42]
**Julia Elena Cordoba Vieira:** Aí a demanda chega para a Secretaria. A gente pode dar acesso para o Rafael. O Rafael vê a solicitação da escola, coloca em andamento, faz a compra e, quando chegar, dá como concluído e manda entregar na unidade.  
**Carolina Machado:** Isso! Chegar direto para o Rafael ou para a equipe do setor dele que faz esse trâmite.

### [00:37:31]
**Julia Elena Cordoba Vieira:** E se for algo que o gestor pode resolver internamente, como comprar areia com a verba que tem na escola, ele mesmo assume a responsabilidade e marca como resolvido. O que a gente precisa ver é a situação de conformidade da rede: a secretária ou a coordenadora do núcleo entra no computador e vê tudo o que está fora de conformidade em cada escola.

### [00:38:20]
**Carolina Machado:** E ela acompanha se no mês seguinte o problema ainda persiste. Isso dá visibilidade real para a gestão. Você acha que vale fazer uma reunião com as coordenações no final do ano?  
**Julia Elena Cordoba Vieira:** Sim! Colocar uma pulga atrás da orelha delas: "Vocês estão todas as semanas na unidade; como vocês se sentem olhando para esses dados das práticas das unidades de vocês?".

### [00:39:20]
**Carolina Machado:** Fazer uma devolutiva grande. Elas gostam desse momento de escuta e pactuação para o próximo ano.  
**Julia Elena Cordoba Vieira:** Eu precisaria de um dia inteiro com as meninas do núcleo sobre os dados da EAP, e falar também das três plataformas: insumos do gestor, supervisão pedagógica e supervisão de ensino. E meio período com as coordenadoras.

### [00:40:10]
**Julia Elena Cordoba Vieira:** Como tenho compromisso no sábado, vou embora na quinta. Tenho plenamente dois dias em Patos.  
**Carolina Machado:** Temos que agendar com a Adriana o comitê gestor na terça ou quarta (dias 8 ou 9), manhã ou tarde.

### [00:42:19]
**Julia Elena Cordoba Vieira:** No comitê gestor: só eu, você, Jacob e Adriana. A Juliana e a coordenadora nova participam, mas eu vou apresentar todos os dados do início ao fim primeiro para ganhar tempo e evitar atritos desnecessários. Minha intenção é mostrar as novidades: EAP, plataforma de insumos, supervisão pedagógica e de ensino.

### [00:45:48]
**Julia Elena Cordoba Vieira:** Então a agenda fica: 1 dia inteiro com as meninas do núcleo, meio período com as coordenações de unidade, e cerca de 1 hora de comitê gestor com Adriana.  
**Julia Elena Cordoba Vieira:** Escolhi minhas batalhas: deixar de pé a supervisão pedagógica, supervisão de ensino, a plataforma de gestores e o uso de dados para tomada de decisão até julho.

### [00:47:38]
**Carolina Machado:** Sobre a formação de inclusão e étnico-racial: não vai ter mais. Márcio marcou um evento para o dia 19 e desestruturou tudo. Elas queriam fazer de qualquer jeito, mas eu disse que não: não têm repertório para fazer formação de inclusão ou étnico-racial às pressas. Cancela. Alexandra vai ter que assumir perante Adriana que o núcleo não conseguiu executar por desorganização e conflito de datas com Prolei.

### [00:49:36]
**Julia Elena Cordoba Vieira:** Márcio não sabe liderar a elaboração do Plano Municipal de Educação. Uma equipe técnica interna da secretaria não conseguir sentar para estruturar o plano é bizarro.  
**Carolina Machado:** Mas o que eu garanti para a rede é que a Avaliação da Educação Infantil (EAP) e o INAP fiquem previstos no PME como instrumentos obrigatórios de verificação de qualidade, com aplicação no máximo a cada dois anos.

---

### [00:52:10] — Início da Demonstração da Plataforma por Bruno Pereira da Silva

**Julia Elena Cordoba Vieira:** Vamos pegar essa meia hora final aí então, Bruno. Bora!  
**Bruno Pereira da Silva:** Carol, tudo certo? Vou compartilhar a tela do celular e depois do computador. Fiz um resumo comparando o que tínhamos proposto na última reunião com o que foi construído até agora. Conseguem ver minha tela?  
**Carolina Machado:** Agora sim.

### [00:53:38]
**Bruno Pereira da Silva:** A lógica é a seguinte: a parte de avaliação em sala de aula é feita pelo celular. Já a parte de análise, gestão da rede, polos e unidades é feita pelo computador, onde a pessoa senta para planejar e trabalhar com calma. Na interface do coordenador, temos a escola, os professores, a opção de adicionar professor, exportar e importar dados.

### [00:54:33]
**Bruno Pereira da Silva:** O coordenador pode fazer a inserção manual da escola e polo, ou exportar em planilha/JSON. No futuro, a base estará sincronizada na nuvem.  
**Julia Elena Cordoba Vieira:** Bruno, já anota aí para você colocar um modelo de planilha para elas baixarem! Em CSV ou formato de planilha.  
**Bruno Pereira da Silva:** Perfeito, anotado.

### [00:55:22]
**Bruno Pereira da Silva:** Na visão do coordenador, ao acessar as turmas, já é possível configurar a dupla regência. O coordenador tem autonomia sobre sua unidade, mas a base é centralizada e compartilhada. Compartilhei a tela do computador para visualizarmos melhor.

### [00:57:23]
**Bruno Pereira da Silva:** Na aba "Minha Escola", em "Turmas e Regência", temos a caracterização da unidade: total de alunos matriculados, alunos da educação inclusiva (AEE/necessidades especiais) e alunos regulares. O sistema calcula a soma automaticamente vinculada às turmas cadastradas.  
**Diogo Dias Furtado:** Dá para adicionar essas informações por planilha, né?  
**Bruno Pereira da Silva:** Dá sim.

### [00:59:04]
**Carolina Machado:** Esse campo de alunos com necessidades especiais é o Atendimento Educacional Especializado (AEE), né?  
**Julia Elena Cordoba Vieira:** Isso, demarcação do público de inclusão atendido na unidade.  
**Bruno Pereira da Silva:** Exato. Na criação da turma, definimos o nome, a etapa, a jornada (Tempo Parcial ou Integral). Quando é parcial, define-se o turno (Matutino ou Vespertino), número total de alunos e alunos da inclusão, e atribuímos os docentes regentes.

### [00:59:59]
**Bruno Pereira da Silva:** Uma dúvida sobre a regra de negócio de Patos: eu havia travado para um professor não dar aula de manhã e de tarde na mesma unidade. Isso acontece na rede?  
**Carolina Machado:** Ocorre sim! Temos professores que dão aula de manhã e de tarde. Concursados com duas matrículas, concursados que fazem "dobra" de turno, e professores contratados com contrato duplo.  
**Bruno Pereira da Silva:** Entendido! Então vou destravar o sistema para permitir que o mesmo professor possa ser vinculado a duas turmas em turnos distintos.  
**Bruno Pereira da Silva:** Outra coisa: as etiquetas de faixa etária das turmas regulares. Vamos padronizar:
- `0 a 1 ano e 11 meses`
- `1 ano a 1 ano e 11 meses`
- `2 anos a 2 anos e 11 meses`
- `3 anos a 3 anos e 11 meses`
- `4 anos a 4 anos e 11 meses`
- `5 anos a 5 anos e 11 meses`  
E as turmas multiada seguem lógica própria.

### [01:01:12]
**Bruno Pereira da Silva:** Na observação pelo celular: o coordenador pode agendar a observação ou iniciar uma observação na hora. Ao selecionar a turma, se a turma tiver dois docentes (dupla regência), o sistema carrega os dois professores responsáveis.

### [01:02:04]
**Bruno Pereira da Silva:** Mostrei como cadastrar o docente em "Minha Escola" e atribuí-lo à turma. Adicionei a professora Patrícia Alves e vinculei à sala. Com o sistema destravado, ela poderá assumir duas turmas em turnos diferentes.

### [01:03:43]
**Diogo Dias Furtado:** Bruno, uma sugestão crucial sobre a estrutura dos dados: como esses dados virão por planilha, crie uma **planilha modelo geral unificada**. Mesmo que dividida logicamente entre professores e turmas, coloque tudo em uma única planilha. Se a gente importar só a lista de professores ou só a lista de turmas sem o vínculo relacional, vai gerar conflito e quebrar o sistema.

### [01:05:01]
**Diogo Dias Furtado:** Com uma base única em planilha, temos uma Single Source of Truth limpa. O JSON guarda tudo em bloco, mas na planilha a equipe consegue filtrar linha a linha cada informação.  
**Julia Elena Cordoba Vieira:** Volta na tela do perfil de coordenação da escola para revisarmos botão por botão.

### [01:06:42]
**Julia Elena Cordoba Vieira:** O cadastro inicial da escola não é feito pela coordenação, certo? Será feito pela gerência do Núcleo de Educação Infantil. E a caracterização detalhada das turmas e alunos é feita pela coordenação da unidade?  
**Bruno Pereira da Silva:** Exatamente. A escola e o polo vêm cadastrados pelo Núcleo, e a coordenadora pedagógica faz a caracterização das suas turmas e vinculação dos docentes.

### [01:08:34]
**Carolina Machado:** Sobre a planilha: ela será preenchida e importada pelo Núcleo ou por cada coordenadora de escola? Se for para cada coordenadora preencher uma planilha e subir, é mais fácil ela digitar direto nos botões do sistema.  
**Diogo Dias Furtado:** Concordo. O fluxo mais produtivo e seguro é: a equipe do Núcleo (Juliana/técnicas) pega a relação geral da rede (escolas, coordenadores, formadores, turmas e professores) e importa a base inteira de uma vez via planilha unificada.

### [01:14:20]
**Diogo Dias Furtado:** Se múltiplos usuários tentarem subir bases inteiras ao mesmo tempo, geraria duplicações e divergências. O Núcleo sobe o cadastro inicial unificado uma única vez. Depois disso, as coordenadoras nas unidades apenas fazem alterações e edições pontuais (ex: adicionar um professor substituto, ajustar um horário).  
**Carolina Machado:** Perfeito! É exatamente essa lógica. O Núcleo cria a estrutura e vincula a coordenadora à sua escola. A partir daí, cada coordenadora só acessa e edita a sua unidade.

### [01:21:37]
**Bruno Pereira da Silva:** Esse alinhamento é excelente. Então o sistema terá:
1. Para o Núcleo: importação da planilha unificada completa de abertura do ciclo.
2. Para a Coordenadora da UE: botões de edição e adição pontual na própria interface, sem necessidade de manipular planilhas complexas.

### [01:22:29]
**Bruno Pereira da Silva:** Mostrei também a parametrização do ciclo letivo e calendários. As coordenadoras poderão visualizar os períodos pactuados de avaliação. No cadastro de usuários, temos controle por identificadores únicos (`IDs`).

### [01:24:43]
**Julia Elena Cordoba Vieira:** Bruno, na página de resultados e indicadores: eu consigo ver a Rede vs. a minha Unidade. Tem como colocar uma comparação **Turma contra Turma** dentro da mesma unidade ou da rede?  
**Bruno Pereira da Silva:** Turma contra turma ainda não estava direto, mas é uma excelente adição. Vamos implementar essa comparação.  
**Julia Elena Cordoba Vieira:** E se uma coordenadora mudar de e-mail ou for substituída, a unidade perde os dados históricos?  
**Diogo Dias Furtado:** Não perde, porque todos os registros de observações, turmas e escolas estão atrelados a IDs relacionais únicos, e não ao endereço de e-mail do usuário.

### [01:27:01] — O Paradoxo da Avaliação da Turma com 2 Docentes

**Bruno Pereira da Silva:** Vou mostrar como funciona a avaliação de uma turma na interface móvel:
- Registro de data e horário real de início.
- Critérios avaliados como `Consistente`, `Parcial`, `Não Realizado` ou `Não se Aplica`.
- Quando o avaliador marca **`Parcial`**, o sistema abre obrigatoriamente a caixa de justificativa formativa e exige apontar qual docente da turma é responsável por aquela fragilidade observada.

### [01:29:30]
**Julia Elena Cordoba Vieira:** Vou te apontar um problema importante aqui, Bruno. A unidade de avaliação é a **TURMA**, certo? Imagine a seguinte situação real:
- A turma tem duas professoras regentes no mesmo momento.
- Uma das professoras realizou uma leitura de história maravilhosa, com excelente mediação pedagógica ("nadando de braçada").
- A outra professora da dupla ficou alheia, não interagiu bem ou não contribuiu com o momento.
- Sob o ponto de vista da **criança**, a experiência pedagógica foi **`Consistente`** (as crianças vivenciaram uma leitura de história de alta qualidade).

### [01:30:22]
**Julia Elena Cordoba Vieira:** Se o sistema só permite apontar professor e redigir justificativa no status `Parcial`, a coordenadora não tem onde registrar que a segunda professora precisa de alinhamento formativo urgente! A prática da turma foi consistente, mas uma das docentes teve desempenho insatisfatório. Precisamos de um campo de **observação docente individual também no status Consistente**!  
**Carolina Machado:** Exatamente! No status da turma nós marcamos o que a criança recebeu (que foi Consistente). Mas a coordenadora precisa ter um campo para registrar: "A professora X conduziu a leitura com excelência; a professora Y não participou/não apoiou este momento". Isso serve para o feedback individual posterior.

### [01:31:31]
**Julia Elena Cordoba Vieira:** Perfeito. O status `Consistente` reflete a turma, mas abre a possibilidade de apontar observações específicas por professor da regência dupla, incitando a coordenação a enxergar as particularidades de cada docente. No `Não Realizado`, a prática não aconteceu para a turma inteira, então não cabe essa distinção.

### [01:32:37] — Ambiente de Homologação e Fechamento

**Julia Elena Cordoba Vieira:** Bruno, disponibilize o link da plataforma com usuários de teste para que eu e a Carol possamos navegar por todos os botões no celular e no computador e trazer dúvidas estruturadas.  
**Bruno Pereira da Silva:** Vou enviar o link com perfis de teste:
- Perfil de Coordenadora de Unidade Escolar;
- Perfil de Formadora de Polo Regional;
- Perfil de Coordenadora do Núcleo de Educação Infantil.  
Vocês poderão testar tanto com a base mock carregada quanto explorando o fluxo de ponta a ponta.

### [01:36:49]
**Carolina Machado:** Combinado! Vamos testar tudo.  
**Julia Elena Cordoba Vieira:** Maravilha. Boa noite a todos!  
**Bruno Pereira da Silva:** Boa noite, Carol! Tchau, tchau!  
**Diogo Dias Furtado:** Boa noite a todos!  
*(A gravação e a transcrição foram encerradas aos 01:36:49).*
