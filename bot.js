const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');

const toapng = require('gif-to-apng');
const download = require('download-file');
const dotenv = require('dotenv');

dotenv.config();

client.on('ready', () => {
    console.log(`Bot inicia, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores`);
    client.user.setGame(`Eu estou em ${client.guilds.size} servidores`);
});

client.on('guildCreate', guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});

client.on('guildDelete', guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id}).`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if(comando === "ping"){
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A latência e ${m.createdTimestamp - message.createdTimestamp}ms. A latência da API é ${Math.round(client.ping)}ms`);
    }

    if(comando === "gifapng"){
        let [nome, emojilink] = args;
        let info = { filename: "emoji.gif" };

        if(!args[0] || !args[1]) return message.channel.send('Algum argumento está faltando');

        download(emojilink, info, function(err){
            if(!err){
                toapng('emoji.gif')
                .then(() => {
                    message.guild.createEmoji('emoji.png', nome);
                    message.channel.send('Imagem convertida com sucesso');

                })
                .catch(error => console.log('Erro: ', error))
            }
            else{
                message.channel.send('link inválido');
            }
        });
    }
});
console.log(process.env.SECRET_KEY);
client.login(config.token);
