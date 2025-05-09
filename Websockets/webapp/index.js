import express from "express";
import expressWs from "express-ws";

const app = express();
expressWs(app);
app.use(express.static("public"));

const clients = new Set();

app.listen(3000, () => {
    console.log("Server is listening on http://localhost:3000");
});

app.ws("/socket", (client, req) => {
    clients.add(client);
    console.log(`new client: ${clients.size} clients connected`);

    client.on("error", (error) => {
        console.log(error);
    });

    client.on("close", (error) => {
        clients.delete(client);
        console.log(`disconnected client: ${clients.size} remaining`);
    });

    client.on("message", (data) => {
        console.log(`message: ${data}`);
        for(const client of clients) {
            client.send(data.toString());
        }
    });
});


setInterval(() => {
    fetch("http://localhost:3000/messages.json")
        .then(res => res.json())
        .then(messages => {
            const scoreUpdate = messages.find(msg => msg.type === "score_update");

            if (scoreUpdate) {
                const messageToSend = {
                    ...scoreUpdate,
                    time: Date.now()
                };

                const msgString = JSON.stringify(messageToSend);
                for (const client of clients) {
                    client.send(msgString);
                }

                console.log("Auto-sent score update:", msgString);
            }
        })
        .catch(error => {
            console.error("Error fetching from messages.json", error);
        });
}, 15000);

app.get("/", (req, res) => {
    res.send("Web Socket Server is running on ws://localhost:3000/socket")
})



