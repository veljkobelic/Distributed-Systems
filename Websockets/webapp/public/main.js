
const socket = new WebSocket("ws://localhost:3000/socket");
const labelContainer = document.getElementById("labelContainer");
const titleInput = document.getElementById("eventTitle");
const nameInput = document.getElementById("nameInput");
var textInputValue;
var nameInputValue;

socket.onopen = () => {
    console.log("Connected to server\n");
};

socket.onmessage = (event) => {
    console.log(`Server: ${event.data}\n`);
    const data = JSON.parse(event.data);

    if (data.type === "score_update") {
        const teamlabel = document.createElement("label");
        const statusLabel = document.createElement("label");
        const timeLabel = document.createElement("label");
        const labelsContainer = document.createElement("div");

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        teamlabel.textContent = `${data.home_team} - ${data.away_team}        `;
        statusLabel.textContent = `${data.home_score} - ${data.away_score}       `;
        timeLabel.textContent = `${hours}:${minutes}`;

        teamlabel.className = "teamLabel";
        statusLabel.className = "statusLabel";
        timeLabel.className = "timeLabel";
        labelsContainer.className = "labelsContainer";


        labelsContainer.appendChild(teamlabel);
        labelsContainer.appendChild(statusLabel);
        labelsContainer.appendChild(timeLabel);

        labelContainer.appendChild(labelsContainer);
    }
};

function sendEvent() {
    textInputValue = titleInput.value;
    nameInputValue = nameInput.value;

    if (!textInputValue && !nameInputValue) {
        console.log("Please enter a title before sending.\n");
        return;
    }

    fetch("messages.json")
        .then(response => response.json())
        .then(messages => {
            const event = messages.find(msg => msg.type === "event");
            
            const messageToSend = {
                ...event,
                from: nameInputValue,
                time: Date.now(),
                title: textInputValue
            };

            socket.send(JSON.stringify(messageToSend));
            console.log(`Sent: ${JSON.stringify(messageToSend)}\n`);
            createLabel();
        });  
}

function createLabel() {
    if (textInputValue !== "" && nameInputValue !== "") {
        const labelsContainer = document.createElement("div");
        const eventTitleLabel = document.createElement("label");
        const nameLabel = document.createElement("label");
        const timeLabel = document.createElement("label");

        nameLabel.className = "nameLabel";
        labelsContainer.className = "labelsContainer";
        eventTitleLabel.className = "eventTitleLabel";
        timeLabel.className = "timeLabel";

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        
        eventTitleLabel.textContent = textInputValue;
        timeLabel.textContent = `${hours}:${minutes}`;
        nameLabel.textContent = nameInputValue;
        

        labelContainer.appendChild(labelsContainer);

        labelsContainer.appendChild(nameLabel);
        labelsContainer.appendChild(eventTitleLabel);
        labelsContainer.appendChild(timeLabel);

        labelsContainer.scrollIntoView({ behavior: "smooth" });
        titleInput.value = "";
        nameInput.value = "";
    }
}