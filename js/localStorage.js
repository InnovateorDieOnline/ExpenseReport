//database creation
   	var storage = {},
    myData = null,
    dbName = 'mydatabase',
    dbVersion = '1.0',
    dbDescription = 'app data store',
    dbSize = 20 * 1024 * 1024;
 
  
   	function initDatabase () {
   	    
   	    try {
   	        var data = '';
   	                        
   	        storage.db = openDatabase(dbName, dbVersion, dbDescription, dbSize);
   	        storage.db.transaction(function (tx) {
   	                    
   	            tx.executeSql("CREATE TABLE IF NOT EXISTS appdata (id unique, text)");
   	                        
   	        }, handleDbError);
   	                    
   	        storage.db.transaction(function (tx) {
   	                    
   	            tx.executeSql("INSERT OR IGNORE INTO appdata (id, text) VALUES(?,?)", [dbName, data]);
   	                    
   	        }, handleDbError);
   	                                    
   	        } catch(e) {
   	            handleDbError(e);
   	    }
   	}

   	initDatabase();
   	
   	function getData () {
        
   	    var myRequest = new XMLHttpRequest();

   	    myRequest.onreadystatechange = function () {    

   	        if (myRequest.readyState === 4 && myRequest.status === 200) {
   	            myData = JSON.parse(myRequest.responseText);
   	            updateDatabase();
   	            startApp();          
   	        }
   	    };

   	    myRequest.open('GET', 'http://www.imfit.com/db', true);
   	    myRequest.send();
   	}

   	function updateDatabase () {
   	    
   	    try { 
   	        var data = JSON.stringify(myData);
   	                        
   	        storage.db = openDatabase(dbName, dbVersion, dbDescription, dbSize);       
   	        storage.db.transaction(function (tx) {
   	                    
   	            tx.executeSql("UPDATE appdata SET text=? WHERE id=?", [data, dbName]);
   	                    
   	        }, handleDbError);
   	                                    
   	        } catch(e) {             
   	            handleDbError(e);
   	    }
   	}
   	
   	function throwReadError (e) {
   	    
   	    console.log(e.message);
   	    console.log(e.code);
   	            
   	    if(!myData) {
   	        showAlert("This app requires an internet connection for first launch");
   	    }
   	}
   	        
   	function readFromDatabase () {
   	                
   	    storage.db = openDatabase(dbName, dbVersion, dbDescription, dbSize);
   	    storage.db.transaction(function (tx) {
   	                
   	        tx.executeSql('SELECT * FROM appdata', [], function (tx, results) {
   	                
   	            myData = JSON.parse(results.rows.item(0).text);
   	            startApp();
   	        });

   	    }, throwReadError);  