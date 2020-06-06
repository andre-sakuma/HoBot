const Discord = require('discord.js');
const Sequelize = require('sequelize');
require('dotenv/config')

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
const PlacarDia = sequelize.define('pontDia', {
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


bot.login(token);

bot.once('ready', () => {
    console.log('pronto');
    Placar.sync();
    PlacarDia.sync();
});

bot.on('message', async msg =>{
    if (msg.content.startsWith(PREFIX)) {
		const input = msg.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
        const commandArgs = input.join(' ');
        const authorId = msg.author.id;
        const chefe = msg.guild.roles.cache.find(role=>role.name === 'Chefe').members.find(user=>user.id === authorId);
        if(command === 'help'){
            msg.author.send('!hastear - Hasteamento');
            msg.author.send('!arriar - Arriamento');
            msg.author.send('!reflexao - Menciona quem se voluntariou para a reflexao');
            msg.author.send('!3apitosgeral - *apenas chefes* manda mensagem em todos os chats das PTs, chamando para o Canal Geral');
            msg.author.send('!3apitosesc - *apenas chefes* manda mensagem em todos os chats das PTs escoteiras, chamando para o Canal da Tropa Escoteira');
            msg.author.send('!3apitossen - *apenas chefes* manda mensagem em todos os chats das PTs senior, chamando para o Canal da Tropa Senior');
            msg.author.send('!2apitosesc - *apenas chefes* manda mensagem em todos os chats das PTs escoteiras, chamando os monitores');
            msg.author.send('!2apitossen - *apenas chefes* manda mensagem em todos os chats das PTs senior, chamando os monitores');
            msg.author.send('!sortearpt - Sorteia uma patrulha');
            msg.author.send('!sortearesc - Sorteia uma patrulha escoteira');
            msg.author.send('!sortearsen - Sorteia uma patrulha senior');
            msg.author.send('-----------------------------------');
            msg.author.send('Pontuação');
            msg.author.send('!addpt *NomeDaPt* - *apenas chefes* Adiciona uma patrulha na pontuação.');
            msg.author.send('!delete *NomeDaPt* - *apenas chefes* Tira uma patrulha na pontuação.');
            msg.author.send('!pont *NomeDaPt* *pontos* - *apenas chefes* Adiciona pontos para a patrulha');
            msg.author.send('!placar - Mostra o placar geral das patrulhas');
        }    
        else if(command === 'perguntar'){
            const author = msg.author.id
            perguntasList.push({id: author, code: counter++})
            msg.reply(`sua senha: ${counter}`)
        }
        else if(command === 'proximo'){
            if(perguntasList.length==0)return msg.channel.send('A fila está vazia')
            const id = perguntasList[0].id
            const code = perguntasList[0].code + 1
            msg.channel.send(`${code} - <@${id}>`)
            perguntasList.shift()
        }
        else if(command === 'addpt' && chefe!=undefined) {
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
        else if(command === 'placar') {
			// equivalent to: SELECT name FROM tags;
            const tagList = await Placar.findAll();
			//const tagString = tagList.map(t => t.name).join(' - ').join(tagList.map(t=>t.pont)).join('\n') || 'Nenhuma patrulha foi adicionanda ainda.';
            //return msg.channel.send(`Lista de Patrulhas: ${tagString}`);
            msg.channel.send('Escoteiros')
            for(var i = 0;i<tagList.length;i++){
                msg.channel.send(`${tagList[i].name} - ${tagList[i].pont}pts \n`);
                if(i==4){
                    msg.channel.send('\n ------------------------ \n');
                    msg.channel.send('Sênior');
                }
            }
        }
        else if(command === 'addptDia' && chefe!=undefined) {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();

			try {
				// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
				const tag = await PlacarDia.create({
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
        else if(command === 'placarDia') {
			// equivalent to: SELECT name FROM tags;
            const tagList = await PlacarDia.findAll();
			//const tagString = tagList.map(t => t.name).join(' - ').join(tagList.map(t=>t.pont)).join('\n') || 'Nenhuma patrulha foi adicionanda ainda.';
            //return msg.channel.send(`Lista de Patrulhas: ${tagString}`);
            msg.channel.send('Placara do dia - Escoteiros')
            for(var i = 0;i<tagList.length;i++){
                msg.channel.send(`${tagList[i].name} - ${tagList[i].pont}pts \n`);
            }
        }
        else if(command === 'resetDia') {
			// equivalent to: SELECT name FROM tags;
            const tagList = await PlacarDia.findAll();
			//const tagString = tagList.map(t => t.name).join(' - ').join(tagList.map(t=>t.pont)).join('\n') || 'Nenhuma patrulha foi adicionanda ainda.';
            //return msg.channel.send(`Lista de Patrulhas: ${tagString}`);
            for(var i = 0;i<tagList.length;i++){
                await PlacarDia.update({ pont: 0 }, { where: { name: tagList[i].name } });
            }
        }
        else if(command === 'pontDia' && chefe!=undefined){
            const splitArgs = commandArgs.split(' ');
            const tagName = splitArgs.shift();
            const tagDescription = splitArgs.join(' ');
            const tagDef = await PlacarDia.findOne({ where: {name: tagName} });
            const affectedRows = await PlacarDia.update({ pont: tagDef.pont + parseInt(tagDescription) }, { where: { name: tagName } });
            const tagPont = await PlacarDia.findOne({ where: {name: tagName} });
            if (affectedRows > 0) {
                return msg.reply(`${tagName} agora tem ${tagPont.pont}pts`);
            }
        }
        
        else if(command === 'delete' && chefe!=undefined){
            const tagName = commandArgs;
            const rowCount = await Placar.destroy({where:{name:tagName}});
            if(!rowCount)return msg.reply('Essa patrulha não existe.');
            else{
                return msg.reply(`A patrulha ${tagName} foi deletada.`);
            }
        }
        else if(command === 'pont' && chefe!=undefined){
            const splitArgs = commandArgs.split(' ');
            const tagName = splitArgs.shift();
            const tagDescription = splitArgs.join(' ');
            const tagDef = await Placar.findOne({ where: {name: tagName} });
            const affectedRows = await Placar.update({ pont: tagDef.pont + parseInt(tagDescription) }, { where: { name: tagName } });
            const tagPont = await Placar.findOne({ where: {name: tagName} });
            if (affectedRows > 0) {
                return msg.reply(`${tagName} agora tem ${tagPont.pont}pts`);
            }
            return msg.reply(`Não tem nenhuma patrulha com esse nome: ${tagName}.`);
        }
        else if(command === 'hastear'){
            msg.delete({timeout:100});
            for(var i =0 ; i<5 ; i++){
                setTimeout(()=>{
                    msg.channel.send('.\n');
                },2222);
            }
        }
        else if(command === 'arriar'){
            async function bandeiras(){
                const sp = msg.guild.emojis.cache.find(emoji => emoji.name === 'flag_sp');
                const hokkaido = msg.guild.emojis.cache.find(emoji => emoji.name === 'flag_hok');
                (await msg.channel.send(':flag_br:')).delete({timeout: 15000});
                (await msg.channel.send(`${sp}`)).delete({timeout: 14000});
                (await msg.channel.send(`${hokkaido}`)).delete({timeout: 13000});
                (await msg.channel.send('.\n')).delete({timeout: 10000});
                (await msg.channel.send('.\n')).delete({timeout: 11000});
                (await msg.channel.send('.\n')).delete({timeout: 1000});
                (await msg.channel.send('.\n')).delete({timeout: 2000});
                (await msg.channel.send('.\n')).delete({timeout: 3000});
                (await msg.channel.send('.\n')).delete({timeout: 4000});
                (await msg.channel.send('.\n')).delete({timeout: 5000});
            }
            bandeiras();
        }
        else if(command === 'reflexao' ){
            msg.reply('está fazendo a reflexão!');
        }
        else if(command === 'dispensar'){
            msg.channel.send('https://imgur.com/XraYXAo');
            setTimeout(()=>{
                msg.channel.send('Sempre Alertaaa!!!');
            }, 8500);
        }
        else if(command === '3apitosgeral' && chefe!=undefined){
            for(let i in channelsList){
                bot.channels.cache.find(channel => channel.name == channelsList[i]).send("Piiii...\nPiiii...\nPiiiiiii...\n 3 apitos!!! Entrem no Canal de Voz Geral!");
            }
        }
        else if(command === '3apitosesc' && chefe!=undefined){
            for(let i=0;i<5;i++){
                bot.channels.cache.find(channel => channel.name == channelsList[i]).send("Piiii...\nPiiii...\nPiiiiiii...\n 3 apitos!!! Entrem no Canal de Voz da Tropa Escoteira!");
            }
        }
        else if(command === '3apitossen' && chefe!=undefined){
            for(let i = 5; i<9;i++){
                bot.channels.cache.find(channel => channel.name === channelsList[i]).send("Piiii...\nPiiii...\nPiiiiiii...\n 3 apitos!!! Entrem no Canal de Voz da Tropa Senior!");        
            }
        }
        else if(command === '2apitosesc' && chefe!=undefined){
            for(let i = 0;i<5;i++){
                bot.channels.cache.find(channel => channel.name === channelsList[i]).send("Piiii...\nPiiiiiii...\n2 apitos!!! Monitores, entrem no Canal de Voz dos Monitores!");
            }
        }
        else if(command === '2apitossen' && chefe!=undefined){
            for(let i = 5; i<9;i++){
                bot.channels.cache.find(channel => channel.name === channelsList[i]).send("Piiii...\nPiiiiiii...\n2 apitos!!! Monitores, entrem no Canal de Voz dos Monitores!");        
            }
        }
        else if(command === 'sortearpt'){
            msg.channel.send('1: Canguru \n 2:Phoenix \n 3:Raposa \n 4:Rinoceronte \n 5:Tigre \n 6:Aoraki \n 7:Grand Canyon \n 8:Kailash \n 9:Monte Fuji\n .');
            randomNumber = Math.floor(Math.random() * (9 - 1) + 1 );
            msg.channel.send(randomNumber);
        }
        else if(command === 'sortearesc'){
            msg.channel.send('1: Canguru \n 2:Phoenix \n 3:Raposa \n 4:Rinoceronte \n 5:Tigre\n .');
            randomNumber = Math.floor(Math.random() * (5 - 1) + 1 );
            msg.channel.send(randomNumber);
        }
        else if(command === 'sortearsen'){
            msg.channel.send('1:Aoraki \n 2:Grand Canyon \n 3:Kailash \n 4:Monte Fuji \n .');
            randomNumber = Math.floor(Math.random() * (4 - 1) + 1 );
            msg.channel.send(randomNumber);
        }
    }
});