const Discord = require('discord.js');
const Sequelize = require('sequelize');
require('dotenv/config')

const help = require('./help')

const bot = new Discord.Client();

const PREFIX = '!';

const token = process.env.TOKEN;

const perguntasList = [];
let counter = 0;

const channelsList = ['pt-canguru', 'pt-phoenix', 'pt-raposa', 'pt-rinoceronte', 'pt-tigre', 'pt-aoraki', 'pt-kailash', 'pt-monte-fuji', 'pt-grand-canyon', 'hokklan']

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'database.sqlite',
});

const pdb = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'presencedb.sqlite',
});

const Placar = sequelize.define('pont', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  pont: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});
const presence = pdb.define('chamada', {
  userid: {
    type: Sequelize.STRING,
    unique: true,
  },
  month: {
    type: Sequelize.INTEGER,
  },
  day: {
    type: Sequelize.INTEGER,
  }
})

bot.login(token);



bot.once('ready', () => {
  console.log('pronto');
  Placar.sync();
  presence.sync();
});

bot.on('message', async msg => {
  if (msg.content.startsWith(PREFIX)) {
    const serverObj = bot.guilds.cache.first()

    const input = msg.content.slice(PREFIX.length).split(' ');
    const command = input.shift();
    const commandArgs = input.join(' ');
    const authorId = msg.author.id;
    const chefe = msg.guild.roles.cache.find(role => role.name === 'Chefe').members.find(user => user.id === authorId);
    if (command === 'help') {
      const splitArgs = commandArgs.split(' ')
      const method = splitArgs[0]
      if (method != '') {
        try {
          msg.reply(`${help[method].name} \n ${help[method].description} \n ${help[method].usage}`)
        } catch (error) {
          msg.reply('Esse comando não existe D:')
        }
      }
      else {
        const list = Object.entries(help)
        const commandList = list.map(c => c[0]).join(', ')
        msg.channel.reply(`digite !help e o nome do comando para saber mais sobre ele. \n lista de comandos: ${commandList}`)
      }
    }
    else if (command === 'presente') {
      //salvar no db 
      const date = new Date()
      const userId = msg.author.id

      try {
        const tag = await presence.create({
          userid: userId,
          day: date.getDate(),
          month: date.getMonth() + 1,
        });
        return msg.reply('Sua presença foi confirmada :)');
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return msg.reply('Você já confirmou sua presença!');
        }
        return msg.reply('Alguma coisa deu errado ao confimar sua presença');
      }
    }
    else if (command === 'listar') {
      const splitArgs = commandArgs.split(' ')
      const method = splitArgs.shift()
      const parameter = splitArgs[0]

      if (method === 'day') {
        const date = parameter.split('/')
        const day = parseInt(date[0])
        const month = parseInt(date[1])
        const list = await presence.findAll({ where: { day, month } });
        const string = list.map(t => `<@${t.userid}>`).join('\n')
        msg.channel.send(`Presença no dia ${day}/${month} \n ${string}`)
      }
    }
    else if (command === 'chamada') {
      bot.channels.cache.find(channel => channel.name == 'tropa-escoteira').send("Digite '!presente' para confirmar sua presença na atividade de hoje!");
    }
    else if (command === 'perguntar') {
      const author = msg.author.id
      perguntasList.push({ id: author, code: counter++ })
      msg.reply(`sua senha: ${counter}`)
    }
    else if (command === 'proximo') {
      if (perguntasList.length == 0) return msg.channel.send('A fila está vazia')
      const id = perguntasList[0].id
      const code = perguntasList[0].code + 1
      msg.channel.send(`${code} - <@${id}>`)
      perguntasList.shift()
    }
    else if (command === 'reset' && chefe != undefined) {
      const tagList = await Placar.findAll();
      for (var i = 0; i < tagList.length; i++) {
        await PlacarDia.update({ pont: 0 }, { where: { name: tagList[i].name } });
      }
    }
    else if (command === 'addpt' && chefe != undefined) {
      const splitArgs = commandArgs.split(' ');
      const tagName = splitArgs.shift();

      try {
        // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
        const tag = await Placar.create({
          name: tagName,
          pont: 0,
        });
        return msg.reply(`Patrulha ${tag.name} adicionada.`);
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return msg.reply('Essa patrulha ja existe.');
        }
        return msg.reply('Alguma coisa deu errado ao adicionar a patrulha.');
      }
    }
    else if (command === 'placar') {
      // equivalent to: SELECT name FROM tags;
      const tagList = await Placar.findAll();
      //const tagString = tagList.map(t => t.name).join(' - ').join(tagList.map(t=>t.pont)).join('\n') || 'Nenhuma patrulha foi adicionanda ainda.';
      //return msg.channel.send(`Lista de Patrulhas: ${tagString}`);
      msg.channel.send('Escoteiros')
      for (var i = 0; i < tagList.length; i++) {
        msg.channel.send(`${tagList[i].name} - ${tagList[i].pont}pts \n`);
        if (i == 4) {
          msg.channel.send('\n ------------------------ \n');
          msg.channel.send('Sênior');
        }
      }
    }
    else if (command === 'delete' && chefe != undefined) {
      const tagName = commandArgs;
      const rowCount = await Placar.destroy({ where: { name: tagName } });
      if (!rowCount) return msg.reply('Essa patrulha não existe.');
      else {
        return msg.reply(`A patrulha ${tagName} foi deletada.`);
      }
    }
    else if (command === 'pont' && chefe != undefined) {
      const splitArgs = commandArgs.split(' ');
      const tagName = splitArgs.shift();
      const tagDescription = splitArgs.join(' ');
      const tagDef = await Placar.findOne({ where: { name: tagName } });
      const affectedRows = await Placar.update({ pont: tagDef.pont + parseInt(tagDescription) }, { where: { name: tagName } });
      const tagPont = await Placar.findOne({ where: { name: tagName } });
      if (affectedRows > 0) {
        return msg.reply(`${tagName} agora tem ${tagPont.pont}pts`);
      }
      return msg.reply(`Não tem nenhuma patrulha com esse nome: ${tagName}.`);
    }
    else if (command === 'hastear') {
      msg.delete({ timeout: 100 });
      for (var i = 0; i < 5; i++) {
        setTimeout(() => {
          msg.channel.send('.\n');
        }, 2222);
      }
    }
    else if (command === 'arriar') {
      async function bandeiras() {
        const sp = msg.guild.emojis.cache.find(emoji => emoji.name === 'flag_sp');
        const hokkaido = msg.guild.emojis.cache.find(emoji => emoji.name === 'flag_hok');
        (await msg.channel.send(':flag_br:')).delete({ timeout: 15000 });
        (await msg.channel.send(`${sp}`)).delete({ timeout: 14000 });
        (await msg.channel.send(`${hokkaido}`)).delete({ timeout: 13000 });
        (await msg.channel.send('.\n')).delete({ timeout: 10000 });
        (await msg.channel.send('.\n')).delete({ timeout: 11000 });
        (await msg.channel.send('.\n')).delete({ timeout: 1000 });
        (await msg.channel.send('.\n')).delete({ timeout: 2000 });
        (await msg.channel.send('.\n')).delete({ timeout: 3000 });
        (await msg.channel.send('.\n')).delete({ timeout: 4000 });
        (await msg.channel.send('.\n')).delete({ timeout: 5000 });
      }
      bandeiras();
    }
    else if (command === 'reflexao') {
      const userId = msg.author.id
      const voiceChannel = serverObj.voiceStates.cache.find(user => user.id === userId).channelID
      const userSelected = serverObj.voiceStates.cache.filter(channel => channel.channelID === voiceChannel).random().id
      msg.channel.send(`<@${userSelected}> foi escolhido para fazer a reflexão!`);
    }
    else if (command === 'dispensar') {
      msg.channel.send('https://imgur.com/XraYXAo');
      setTimeout(() => {
        msg.channel.send('Sempre Alertaaa!!!');
      }, 8500);
    }
    else if (command === 'apitar' && chefe != undefined) {
      const splitArgs = commandArgs.split(' ');
      const qnt = parseInt(splitArgs[0])
      const method = splitArgs[1]
      let range
      let channel
      if (method === 'geral') {
        channel = 'Geral'
        range = { start: 0, end: 10 }
      }
      else if (method === 'escoteiros') {
        channel = 'Tropa Escoteira'
        range = { start: 0, end: 5 }
      }
      else if (method === 'senior') {
        channel = 'Tropa Senior'
        range = { start: 5, end: 9 }
      }
      if (qnt === 3) {
        for (let i = range.start; i < range.end; i++) {
          bot.channels.cache.find(channel => channel.name == channelsList[i]).send(`Piiii...\nPiiii...\nPiiiiiii...\n 3 apitos!!! Entrem no Canal de Voz da ${channel}!`);
        }
      }
      else if (qnt === 2) {
        for (let i = range.start; i < range.end; i++) {
          bot.channels.cache.find(channel => channel.name === channelsList[i]).send("Piiii...\nPiiiiiii...\n2 apitos!!! Monitores, entrem no Canal de Voz dos Monitores!");
        }
      }
    }
    else if (command === 'sortear') {
      const splitArgs = commandArgs.split(' ');
      const method = splitArgs[0]
      const arg = splitArgs[1]
      let range = {
        start: 0,
        end: 0,
      }
      if (method === 'todos') {
        const userId = msg.author.id
        const voiceChannel = serverObj.voiceStates.cache.find(user => user.id === userId).channelID
        const userSelected = serverObj.voiceStates.cache.filter(channel => channel.channelID === voiceChannel).random().id
        msg.channel.send(`<@${userSelected}> foi escolhido.`);
      }
      else if (method === 'range') {
        const args = arg.split('/')
        const start = parseInt(args[0])
        const final = parseInt(args[1])
        randomNumber = Math.floor((Math.random() * final) + start);
        msg.channel.send(`O número ${randomNumber} foi sorteado.`);
      }
      else if (method === 'geral') range = { start: 0, end: 10 }
      else if (method === 'escoteiros') range = { start: 0, end: 5 }
      else if (method === 'senior') range = { start: 5, end: 9 }
      randomNumber = Math.floor((Math.random() * range.end) + range.start);
      msg.channel.send(`${channelsList[randomNumber]} foi sorteada!`);
    }
  }
});