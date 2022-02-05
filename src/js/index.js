import '../sass/index.sass';
import db from './db/connectDB';

db.onsuccess = function(e) {
    console.log('Success DB');
}

