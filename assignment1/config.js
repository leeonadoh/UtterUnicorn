
module.exports = { 
	port: 41191,
    sessionKey: 'sess.eatz',
    sessionSecret: 'ServerSuperSekrets',
    sessionTimeout: 1000*60*2,  // 2 minute session timeout
    env: 'dev',   // alternative modes: test, production
    dbhost: 'mathlab.utsc.utoronto.ca',
    dbname: 'lisun',
    dbuser: 'lisun',
    dbpass: 'lisun'
};
