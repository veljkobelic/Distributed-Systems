const express = require('express'); // // Lädt das Express-Framework
const app = express(); // Erstellt eine neue Express-Anwendung

app.use(express.json()); // Middleware zum Verarbeiten von JSON-Anfragen

// Array zur Speicherung von Favoriten
var arrayWithFavourites = [];

// Objekt mit verfügbaren Jobangeboten
let jobPostings = {
    posting1: {
        name: "Software Engineer Frontend", description: "Developing the Frontend of Web Applications using Bootstrap, CSS and HTML."
    },
    posting2: {
        name: "Software Engineer Backend", description: "Developing the Backend of of Web Applications using Databases Node.JS and JavaScript."
    },
};

// Objekt mit verfügbaren Standorten
let location = {
    hamburg: {name: "Hamburg"},
    berlin: {name: "Berlin"},
}
// Objekt mit verschiedenen Jobtypen
let jobType = {
    softwareEngineer: {name: "Software Engineer"},
    softwareArchitect: {name: "Software Architect"},
    sapConsulant: {name: "SAP Consulant"}
}
// Objekt mit Bewerbungen
let application = {
    application1: {id: "1"},
    application2: {id: "2"},
    application3: {id: "3"}
}
// Objekt mit Jobsuchenden und ihren Favoriten
let jobSeeker = {
    seeker1: {name: "Peter", favourites: arrayWithFavourites }
}
let employer = {
    employer1: {name: "microsoft"}
}

// Definiert verschiedene Methoden für RPC (Remote Procedure Call)
const rpcMethods = {
    // Gibt alle Jobangebote zurück
    getJobPostings: () => jobPostings,
    // Fügt ein bestimmtes Jobangebot zu den Favoriten hinzu
    addFavourites: () => {
        var posting = Object.values(jobPostings).find(postingObject => postingObject.name === "Software Engineer Frontend");
        arrayWithFavourites.push(posting);
        return { message: "Posting added.", array: arrayWithFavourites };
    },
    // Entfernt eine Bewerbung anhand ihrer ID
    removeApplication: ({id}) => {
        var applicationObjectKey = Object.keys(application).find(key => application[key].id === id);
        delete application[applicationObjectKey];
        return { message: "Application removed.", application };
    },
    // Gibt eine Liste aller Bewerbungs-IDs zurück
    getApplicationIds: () => {
        return Object.values(application).map((object => object.id));
    },
}
// JSON-RPC Endpunkt: Verarbeitet eingehende JSON-RPC-Anfragen
app.post("/", (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    res.json({ jsonrpc: "2.0", result: rpcMethods[method](params), id});
    app.listen(3000, () => console.log("JSON-RPC Server running on port 3000"));

// Example request

/**
 * 
 {
  "jsonrpc": "2.0",
  "method": "removeApplication",
  "params": {"id": "3"},
  "id": 1
}
 */

});
// Startet den Server auf Port 3000
app.listen(3000, () => console.log("JSON-RPC Server running on port 3000"));