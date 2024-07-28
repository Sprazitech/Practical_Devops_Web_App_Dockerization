module.exports = Object.freeze({
    DB_HOST : process.env.DB_HOST,
    DB_USER : process.env.DB_USER,
    DB_PWD : process.env.DB_PWD,
    DB_DATABASE : process.env.DB_DATABASE
});

// sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v16.20.2/bin /home/ec2-user/.nvm/versions/node/v16.20.2/lib/node_modules/pm2/bin/pm2 startup systemd-u ec2-user --hp /home/ec2-user