const Discord = require('discord.js');
const Web3 = require('web3');

const client = new Discord.Client();
const web3 = new Web3('YOUR_ETHEREUM_NODE_URL');

// Replace with your smart contract address and ABI
const contractAddress = 'YOUR_SMART_CONTRACT_ADDRESS';
const contractAbi = [
  // Add your smart contract ABI here
  // Example: { "constant": true, "inputs": [{ "name": "userAddress", "type": "address" }], "name": "sharesBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }
];

// Replace with your Discord bot token
client.login('YOUR_DISCORD_TOKEN');

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', async (message) => {
  if (message.content.toLowerCase() === '!checkbalance') {
    // Check the user's balance and assign roles based on the result
    await checkBalanceAndAssignRoles(message.author.id, message.guild.id);
  }
});

async function checkBalanceAndAssignRoles(discordUserId, guildId) {
  try {
    // Connect to MetaMask and get the user's Ethereum address
    const userAddress = await getUserEthAddressFromMetaMask(discordUserId);

    // Call the sharesBalance function
    const sharesBalance = await callSharesBalance(userAddress);

    // Assign roles based on sharesBalance
    assignRolesBasedOnBalance(discordUserId, guildId, sharesBalance);
  } catch (error) {
    console.error('Error checking balance and assigning roles:', error);
  }
}

async function getUserEthAddressFromMetaMask(discordUserId) {
  try {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Request the user's Ethereum address
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Assuming the first account is the user's Ethereum address
      return accounts[0];
    } else {
      throw new Error('MetaMask not detected.');
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
}

async function callSharesBalance(userAddress) {
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  try {
    // Call the sharesBalance function on the smart contract
    const result = await contract.methods.sharesBalance(userAddress).call();

    return result;
  } catch (error) {
    console.error('Error calling sharesBalance:', error);
    throw error;
  }
}

function assignRolesBasedOnBalance(discordUserId, guildId, sharesBalance) {
  // Example: Assign roles based on sharesBalance
  const guild = client.guilds.cache.get(guildId);
  const member = guild.members.cache.get(discordUserId);

  if (sharesBalance >= 100) {
    // Assign a role for users with a balance of 100 or more
    const role100Plus = guild.roles.cache.find(role => role.name === 'Role 100+');
    if (role100Plus) {
      member.roles.add(role100Plus);
    }
  }

  // Add more conditions and role assignments based on your requirements
  // ...

  // Notify the user about their role assignments
  member.send(`Your roles have been updated based on your shares balance.`);
}
