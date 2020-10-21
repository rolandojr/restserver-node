process.env.PORT = process.env.PORT || 3000;

// ========================================
//    Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ========================================
//    Vencimiento del Token
// ========================================
process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// ========================================
//    Seed
// ========================================
process.env.SEED= process.env.SEED || 'este-es-el-seed-desarrollo';
// ========================================
//    Base de datos
// ========================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ========================================
//    Client_ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1039273321225-td94msa479a78nmpbnsp3lkrs3kjdp88.apps.googleusercontent.com';