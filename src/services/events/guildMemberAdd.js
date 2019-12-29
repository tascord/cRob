const sm = require('../serverManager');

module.exports = (member) => {
    
    sm.sendWelcomeMessage(member.client, member.guild.id,

        `Welcome to ${member.guild.name}`,
        "%n",
        "You're the %c member!",
    
    member.displayName, member.user.avatarURL, member.guild.memberCount);

}