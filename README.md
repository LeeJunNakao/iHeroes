# Relatório do Desenvolvimento do iHeroes


Neste documento irei relatar como foi o desenvolvimento do sistema iHeroes, os maiores obstáculos encontrados e quais as soluções pensadas. 

Este relatório será dividido em duas partes: uma para detalhar o desenvolvimento do Backend e outra para o Frontend.

# Backend

As ferramentas escolhidas foram o node.JS para o desenvolvimento do servidor e o MongoDB para o banco de dados.

As instruções do desafio da ZRP pedia que o sistema recebesse as informações das ocorrências por um socket, encaminhasse automaticamente o herói mais adequado de acordo com o ranking e o nível da ameaça informada na ocorrência, tal ação deveria ficar registrada no banco de dados, mas também deve ser registrado quando o herói concluísse a missão. Para atender a essa solicitação, eu dividi as informações nos banco de dados em 3 entes: Herói (Hero), Ocorrência (Occurrence) e o Registro da Atividade do Herói (Herolog).

## Banco de Dados

### Herói

Como o iHeroes se trata de um sistema de gerenciamento de distribuição de heróis para combater ameaças, esse sistema precisa saber quem está disponível para a enviar a ameaça, portanto o Hero, além de precisar portar seus dados de identificação e da classe, precisa da informação do estado em que ele se encontra: ou presente ou ausente. Portanto se trata de uma variável boolena em que será **true** quando disponível e **false** caso contrário. 

Modelo do registro:

> id: * Identificação gerada pelo banco de dados *
>
> name: * Nome do herói *
>
> class: [ S, A, B, C ]
>
> avaible: [ true, false ]

### Ocorrência 

Precisamos identificar quais ocorrências já foram concluídas, quais ainda estão sendo atendidas e quais ainda não tiveram nenhum Hero designado a elas. Portanto, além das informações recebidas da ameaça pela ONU, precisamos de um campo informando a situação atual da ocorrência, que serão três: **pendente**, **em atendimento** e **concluído**.

Modelo do registro:

>id: * Identificação gerada pelo banco de dados *
>
> location: Json{ longitude, latitude } 
>
> dangerLevel: [ God, Dragon, Tiger, Wolf ]
>
> monsterName: * Nome do monstro *
>
> date: * Data que a ameaça surgiu *
>
> state: [ pending, attending, done ]

  
### Registro da Atividade do Herói

Como precisamos saber quem foi encaminhado para atender a ocorrência e quando a ameaça foi neutralizada, precisamos de um campo informando a ocorrência que receberá o ID em que ela foi registrada e também de um campo informando o Hero designado, que conterá o ID e o nome.

Além disso também será necessário saber quando a ocorrência foi concluída, portanto esse documento também receberá um campo informando a data do registro e a situação que será **false** para informar que se trata de um registro da alocação do herói, e **true** para informar que se trata de uma desalocação do herói.

Modelo do registro:

> id: * Identificação gerada pelo banco de dados * 
>
> hero: Json{ id, nome }
>
> avaible: [ true, false ]
>
> date: * Data do registro *
>
> occurrence: *id da ocorrência*

## Fluxo da Alocação

Ao receber a ocorrência ela será encaminhada para uma função *occurrenceHandler*, essa função será responsável para desenvolver o fluxo para o tratamento da ocorrência.  Primeiramente a ocorrência deve ser registrada no banco de dados com o estado 'pendente'.  A seguir será encaminhada para a função *findHero* que irá procurar um herói disponível competente para o caso.

Caso haja herói disponível, deve ser registrado a alocação do herói através da função *registerHeroLog*, depois deve ser marcado que o herói se encontra indisponível pela função *markHeroOut* , depois o deve alterar a situação da ocorrência para "em atendimento" através de uma função *changeOccurenceState*. Por fim uma funçao *startCountdownForHeroBack* que irá iniciar uma contagem regressiva que simulará o tempo em que o Hero leva para concluir a missão. Essa função no final da contagem regressiva, irá mudar o estado do Hero para "disponível", da ocorrência para "concluída" e registrará um registro da atividade do herói informando a data da conclusão.

Caso não haja herói disponível, deve ser enviado para a fila (queue) que é um atributo da classe. Os elementos da fila são reenviados para a função *occurrenceHandler* novamente depois de cada intervalo definido.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbk9bT2NvcnLDqm5jaWFdIC0tPiBPSFtvY2N1cnJlbmNlSGFuZGxlcl1cbk9IICAtLT4gIE9SW09jb3JyZW5jaWEgcmVnaXN0cmFkYV1cbk9SIC0tIEVzdGFkbzogUGVuZGVudGUgLS0-IEZIW2ZpbmRIZXJvXVxuRkggLS0gSGVyw7NpIGFsb2NhZG8gLS0-IFJITFtyZWdpc3Rlckhlcm9lc0xvZ11cblJITCAtLT4gTUhPW21hcmtIZXJvT3V0XVxuTUhPIC0tPiBDT1NbY2hhbmdlT2NjdXJyZW5jZVN0YXRlXVxuQ09TIC0tPiBTQ0hCW3N0YXJ0Q291bnRkb3duRm9ySGVyb0JhY2tdXG5cbkZIIC0tIEhlcsOzaSBuw6NvIGVuY29udHJhZG8gLS0-IFF1ZXVlW0ZpbGFdXG5RdWV1ZSAtLT4gT0giLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbk9bT2NvcnLDqm5jaWFdIC0tPiBPSFtvY2N1cnJlbmNlSGFuZGxlcl1cbk9IICAtLT4gIE9SW09jb3JyZW5jaWEgcmVnaXN0cmFkYV1cbk9SIC0tIEVzdGFkbzogUGVuZGVudGUgLS0-IEZIW2ZpbmRIZXJvXVxuRkggLS0gSGVyw7NpIGFsb2NhZG8gLS0-IFJITFtyZWdpc3Rlckhlcm9lc0xvZ11cblJITCAtLT4gTUhPW21hcmtIZXJvT3V0XVxuTUhPIC0tPiBDT1NbY2hhbmdlT2NjdXJyZW5jZVN0YXRlXVxuQ09TIC0tPiBTQ0hCW3N0YXJ0Q291bnRkb3duRm9ySGVyb0JhY2tdXG5cbkZIIC0tIEhlcsOzaSBuw6NvIGVuY29udHJhZG8gLS0-IFF1ZXVlW0ZpbGFdXG5RdWV1ZSAtLT4gT0giLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

O primeiro problema que surge com esse fluxo é de que, caso a ocorrência da fila seja encaminhada para *occurrenceHandler* e não houver herói competente disponível para ela novamente, ela será reenviada na fila, o que gerará duplicidade na fila para o mesmo evento. Para resolver tal problema, eu inseri uma função para verificar se a ocorrência em questão consta na fila, caso conste e não haja Hero disponível, apenas finalize o fluxo. 

Caso não seja encontrado Hero:

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggTFJcblF1ZXVlW0ZpbGFdIC0tPiBPSFtPY2N1cnJlbmNlSGFuZGxlcl1cbk9IIC0tIEhlcsOzaSBuw6NvIGVuY29udHJhZG8gLS0-IENORntDb25zdGEgbmEgZmlsYT99XG5DTkYgLS0gTsOjbyAtLT4gUXVldWVcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggTFJcblF1ZXVlW0ZpbGFdIC0tPiBPSFtPY2N1cnJlbmNlSGFuZGxlcl1cbk9IIC0tIEhlcsOzaSBuw6NvIGVuY29udHJhZG8gLS0-IENORntDb25zdGEgbmEgZmlsYT99XG5DTkYgLS0gTsOjbyAtLT4gUXVldWVcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

Outra questão é que quando a ocorrência é enviada da fila para a *occurrenceHandler*, ela não é removida imediatamente da fila, isso porque deve ser verificado antes se algum Hero será alocado naquele momento, isso porque caso fosse removida da fila para depois ser adicionada novamente, ela iria para o fim da fila, e casos mais antigos devem ter prioridade, pois o intuito é minimizar os danos que as ameaças possam causar pelo mundo. Porém, exatamente por ela não ser removida, dependendo do tempo levado para o processamento dos dados, existe a possibilidade dela ser enviada em duplicidade para a *occurrenceHandler* e ainda pior, a possibilidade dessas duas solicitações alocarem Heroes diferentes para a mesma ocorrência, gerando ineficiência de alocação de recursos, o que poderia causar danos muito sérios. Para isso, durante o processamento, o estado da ocorrência deve ser alterada para "em atendimento". E no fluxo deve ser incluído uma verificação da situação da ocorrência antes de encaminhar Hero.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbk9IW09jY3VycmVuY2VIYW5kbGVyXSAtLT4gIE9Qe09jb3Jyw6puY2lhIGVzdMOhIHBlbmRlbnRlP31cbk9QIC0tIE7Do28gLS0-IFJGKEZpbmFsaXplIG8gZmx1eG8pXG5PUCAtLSBTaW0gLS0-IE1BKE11ZGEgZXN0YWRvIHBhcmEgYXRlbmRlbmRvKVxuTUEgLS0-IEhEe0hlcsOzaXMgZGlzcG9uaXZlaXM_fVxuSEQgLS0gTsOjbyAtLT4gQ05Ge0NvbnN0YSBuYSBmaWxhP31cbkNORiAtLSBTaW0gLS0-IE1TUChNdWRhIHNpdHVhw6fDo28gcGFyYSBwZW5kZW50ZSlcbkNORiAtLSBOw6NvIC0tPiBRdWV1ZShNYW5kYSBwYXJhIEZpbGEpXG5RdWV1ZSAtLT4gTVNQXG5IRCAtLVNpbSAtLT4gQ05GMntDb25zdGEgbmEgZmlsYT99XG5DTkYyIC0tIFNpbSAtLT4gUkRGKFJlbW92ZSBkYSBmaWxhKVxuQ05GMiAtLSBOw6NvIC0tPiBGTlxuUkRGIC0tPiBGTltGbHV4byBOb3JtYWxdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbk9IW09jY3VycmVuY2VIYW5kbGVyXSAtLT4gIE9Qe09jb3Jyw6puY2lhIGVzdMOhIHBlbmRlbnRlP31cbk9QIC0tIE7Do28gLS0-IFJGKEZpbmFsaXplIG8gZmx1eG8pXG5PUCAtLSBTaW0gLS0-IE1BKE11ZGEgZXN0YWRvIHBhcmEgYXRlbmRlbmRvKVxuTUEgLS0-IEhEe0hlcsOzaXMgZGlzcG9uaXZlaXM_fVxuSEQgLS0gTsOjbyAtLT4gQ05Ge0NvbnN0YSBuYSBmaWxhP31cbkNORiAtLSBTaW0gLS0-IE1TUChNdWRhIHNpdHVhw6fDo28gcGFyYSBwZW5kZW50ZSlcbkNORiAtLSBOw6NvIC0tPiBRdWV1ZShNYW5kYSBwYXJhIEZpbGEpXG5RdWV1ZSAtLT4gTVNQXG5IRCAtLVNpbSAtLT4gQ05GMntDb25zdGEgbmEgZmlsYT99XG5DTkYyIC0tIFNpbSAtLT4gUkRGKFJlbW92ZSBkYSBmaWxhKVxuQ05GMiAtLSBOw6NvIC0tPiBGTlxuUkRGIC0tPiBGTltGbHV4byBOb3JtYWxdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

## Preferência do Herói

Conforme definido pelo desafio, cada herói é escolhido preferencialmente conforme sua classe e o nível de risco. Inicialmente, defini que cada herói iria atender apenas as ocorrências em que tinha preferência, e que seria 1 Hero para atender 1 ocorrência em que ele tem preferência portanto ficaria da seguinte forma:

> 1x Classe S ->1x nível God
>
> 1x Classe A -> 1x  nível Dragon
>
> 1x  Classe B -> 1x nível Tiger
>
> 1x Classe C -> 1x nível Wolf

Porém isso geraria ociosidade de heróis de níveis superiores e portanto ineficiência em alocação de pessoal. Para, então, que um Hero pudesse atender os ocorrências de nível de risco inferiores, eu defini um sistema de pontos de perigo (*dangerPoints*).

### DangerPoints

Cada nível de perigo receberá uma quantidade de pontos (*dangerPoints*). Cada Hero também terá definido pela sua classe a quantidade de pontos que ele descontará do *dangerPoints*, caso o resultado final seja igual ou menor que 0, ele poderá ser designado para a missão. Do mesmo jeito, caso haja pessoal disponível, poderá ser usado mais de um herói para a realização dessa validação e serem escalados para atender a ocorrência. 

Fica portanto da seguinte forma os *dangerPoints* de acordo com a o nível de perigo:

> God: 8
>
> Dragon: 4
>
> Tiger: 2
>
> Wolf: 1

E os pontos que cada *Hero* desconta de acordo com sua classe fica da seguinte forma: 

> S: 8
>
> A: 4
>
> B: 2
>
> C: 1

Dessa forma, um nível S poderia atender quaisquer das ocorrências, um nível A poderia atender de *Dragon* para baixo e assim por diante.  Já um grupo de classe C de 8 pessoas poderiam atender uma ocorrência *God*, 4 para *Dragon*, 2 para *Tiger* e 1 para *Wolf*.

### Registro de Atividade de Grupo de Heróis

Para registrar essa situação em que um grupo de heróis é formado para atender uma ocorrência, não houve nenhuma alteração, já que o registro de cada atividade no *HeroLog* consta informação de herói individualmente e a ID da ocorrência também, dessa forma, basta que deixe registrado individualmente, pois para verificar quais heróis foram designados para essa tarefa basta apenas realizar uma busca no banco de dados *HeroLog* filtrando os resultados que contêm a Id da ocorrência desejada.


# Frontend

Pare o desenvolvimento, foi escolhido o React junto do Bootstrap para o desenvolvimento dos componentes. Para a o controle dos estados foi utilizado o Redux, e para realizar as solicitações ao backend foi utilizado o Axios.

## Montagem dos Componentes

Há 3 componentes principais, o **Manager** que carrega e atualiza todos os estados ao carregar a página, o **Login**, e o **Base** . O **Manager** verifica se o usuário está logado, caso não esteja, ele carrega o componente **Login**, caso contrário ele carrega o **Base**. O **Base** carrega a barra de navegação e a tela em que carregará todos os conteúdos. Como essa aplicação tem poucas telas, a navegação será realizada apenas de acordo com o estado presente. Do componente **Base** poderá ser carregado outros dois componentes que carregará de fato o conteúdo de interesse do usuário, o componente **Heroes** e **Occurrences**.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbk1bTUFOQUdFUl0gLS0-IExbTE9HSU5dXG5NIC0tPiBCW0JBU0VdXG5CIC0tPiBIW0hFUk9FU11cbkIgLS0-IFBbT0NDVVJSRU5DRVNdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbk1bTUFOQUdFUl0gLS0-IExbTE9HSU5dXG5NIC0tPiBCW0JBU0VdXG5CIC0tPiBIW0hFUk9FU11cbkIgLS0-IFBbT0NDVVJSRU5DRVNdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

No componente **Heroes** constarão os dados cadastrais do heróis e o registro de atividade deles. No componente **Occurrences** constarão todas as ocorrências recebidas.

## Atualização dos Estados e Bancos de Dados

Ao montar o componente **Manager** ele irá solicitar para o servidor backend os dados de seu banco de dados, esse resultado será armazenado como um estado do Redux. Assim o componente **Heroes** e o **Occurrences** ao renderizar as tabelas, eles não precisarão fazer uma nova solicitação Ajax. Porém os estados podem ficar desatualizados. Como as novas ocorrências chegam a cada 30 segundos, foi criado uma função que faz uma nova solicitação pro banco de dados a cada 30 segundos.

## Paginação

A paginação foi onde encontrei maior dificuldade. Criei um componente, para que pudesse reutilizar tanto para a tabela referente aos cadastros dos heróis, quanto no registro das atividades, como também no cadastro das ocorrências. Primeiro, criei um estado que contêm o número da página em que o usuário se encontra referente a uma tabela, portanto há um estado que informa a página atual para os dados dos heróis, um para as ocorrências e um para registro de atividades. 
Esse componente recebe como parâmetros o estado que contêm os dados que ele irá paginar, o estado que armazena a página atual e a função que altera esse estado. Quando esse componente é montado, ele fica responsável por controlar o estado que marca o número da página atual de um certo conjunto de dados.

# Conclusão

Neste desafio, não só encontrei as dificuldades nas questões descritas neste documento como também encontrei muito aprendizado. Tanto na parte de desenvolvimento da lógica de negócio que me ajudou muito a entender mais sobre como planejar um aplicativo, quanto também em relação a contato de certas tecnologias que não tinha tanta familiaridade. Também pude perceber minha evolução no quesito de legibilidade de código, nas diversas vezes que refatorei o código, pude verificar como que ele foi se tornando mais legível, apesar de ainda eu ser iniciante e não ter tido ainda muito conhecimento e nem tanta experiência com clean code. 

Esse desafio para mim foi bastante empolgante e também pude encontrar certa realização em ver o resultado final. Na verdade, essa experiência me ajudou a perceber muitas de minhas deficiências e a definir os próximos passos que devo tomar para continuar a me desenvolver. Estou muito grato com essa oportunidade e estarei aguardando ansiosamente o feedback da ZRP.
