
module.exports = { 
	port: 41051,
    sessionKey: 'sess.eatz',
    sessionSecret: 'ServerSuperSekrets',
    sessionTimeout: 1000*60*2,  // 2 minute session timeout
    env: 'dev',   // alternative modes: test, production
    dbhost: 'mathlab.utsc.utoronto.ca',
    dbname: 'gouedwar/db',
    dbuser: 'gouedwar',
    dbpass: 'gouedwar'
};
