const help = {
  presente: {
    name: 'presente',
    description: 'Marca sua presença no dia no banco de dados',
    usage: '!presente',
  },
  listar: {
    name: 'listar presença',
    description: 'lista quem estava presente na atividade no dia ',
    usage: '!listar day <dia>/<mês>',
  },
  chamada: {
    name: 'chamada',
    description: 'Manda uma mensagem no canal tropa-escoteira pedindo que os escoteiros marquem sua presença',
    usage: '!chamada',
  },
  perguntar: {
    name: 'perguntar',
    description: 'Adiciona o usuário na fila para perguntar',
    usage: '!perguntar',
  },
  proximo: {
    name: 'proximo da fila',
    description: 'Chama o primeiro da fila para perguntar',
    usage: '!proximo',
  },
  addpt: {
    name: 'adicionar patrulha no placar',
    description: '*apenas para chefes* Adiciona uma nova patrulha no Sistema de Pontuação',
    usage: '!addpt <nome da patrulha>',
  },
  reset: {
    name: 'resetar',
    description: '*apenas para chefes* Reseta o placar',
    usage: '!reset',
  },
  placar: {
    name: 'placar',
    description: 'Mostra o placar geral',
    usage: '!placar',
  },
  delete: {
    name: 'deletar patrulha',
    description: '#apenas para chefes*Tira a patrulha do sistema de pontuação',
    usage: '!delete <nome da patrulha>',
  },
  pont: {
    name: 'marcar pontos',
    description: '*apenas para chefes*Adiciona pontos para a patrulha',
    usage: '!pont <nome da patrulha> <quantidade de pontos>',
  },
  hastear: {
    name: 'hastear',
    description: 'Me chama para fazer o Hasteamento(tem que colocar as bandeiras antes)',
    usage: '!hastear',
  },
  arriar: {
    name: 'arriar',
    description: 'Me chama para fazer o Arriamento',
    usage: '!arriar',
  },
  reflexao: {
    name: 'reflexao',
    description: 'Escolhe alguém aleatório no canal de voz para fazer a reflexão',
    usage: '!reflexao',
  },
  dispensar: {
    name: 'dispensar',
    description: 'Dispensa as tropas',
    usage: '!dispensar',
  },
  apitar: {
    name: 'apitar',
    description: '*apenas chefes* Apita nos canais de texto para chamar os jovens',
    usage: '!apitar <2, 3> <geral, escoteiros, senior>',
  },
  sortear: {
    name: 'sortear',
    description: 'Sorteia patrulhas ou jovens',
    usage: '!sortear <geral,escoteiros,senior> \n !sortear range <número inicial>/<número final>',
  },
}

module.exports = help