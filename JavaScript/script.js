const trackingInput = document.getElementById("tracking-number");
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const recipientInput = document.getElementById("recipient");
const creationDateInput = document.getElementById("creation-date");
const statusSelect = document.querySelector(".form__select");
const submitBtn = document.querySelector(".form__btn--submit");
const tableBody = document.querySelector(".tracking__body");
const updateAllBtn = document.querySelector(".tracking__button--update");

let guides = [];

function renderGuides() {
    tableBody.innerHTML = "";

    guides.forEach((guide, index) => {
        const row = document.createElement("tr");
        row.classList.add("tracking__row");

        row.innerHTML = `
            <td class="tracking__cell">${guide.trackingNumber}</td>
            <td class="tracking__cell">${guide.status}</td>
            <td class="tracking__cell">${guide.origin}</td>
            <td class="tracking__cell">${guide.destination}</td>
            <td class="tracking__cell">${guide.creationDate}</td>
            <td class="tracking__cell">
                <select class="status-select" data-index="${index}">
                    ${getStatusOptions(guide.status)}
                </select>
            </td>
            <td class="tracking__cell">
                <button class="tracking__button--history" data-index="${index}">    Historial</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function getStatusOptions(currentStatus) {
    const flow = {
        "pending": ["pending", "in-transit"],
        "in-transit": ["in-transit", "delivered"],
        "delivered": ["delivered"]
    };

    return flow[currentStatus].map(status => {
        const label = {
            "pending": "Pendiente",
            "in-transit": "En tránsito",
            "delivered": "Entregado"
        }[status];
        return `<option value="${status}" ${status === currentStatus ? "selected" : ""}>${label}</option>`;
    }).join("");
}

function updateStatusPanel() {
    const totalActive = guides.filter(g => g.status !== "delivered").length;
    const inTransit = guides.filter(g => g.status === "in-transit").length;
    const delivered = guides.filter(g => g.status === "delivered").length;

    document.getElementById("total-active").textContent = totalActive;
    document.getElementById("in-transit-count").textContent = inTransit;
    document.getElementById("delivered-count").textContent = delivered;
}

function clearForm() {
    trackingInput.value = "";
    originInput.value = "";
    destinationInput.value = "";
    recipientInput.value = "";
    creationDateInput.value = "";
    statusSelect.selectedIndex = 0;
}

submitBtn.addEventListener("click", () => {
    const trackingNumber = trackingInput.value.trim();
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const recipient = recipientInput.value.trim();
    const creationDate = creationDateInput.value;
    const status = statusSelect.value;

    if (!trackingNumber || !origin || !destination || !recipient || !creationDate || !status) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const exists = guides.some(guide => guide.trackingNumber === trackingNumber);
    if (exists) {
        alert("El número de guía ya existe.");
        return;
    }

    const newGuide = {
        trackingNumber,
        origin,
        destination,
        recipient,
        creationDate,
        status,
        history: [{
            status,
            timestamp: new Date().toLocaleString()
        }]
    };

    guides.push(newGuide);
    renderGuides();
    updateStatusPanel();
    clearForm();
});

updateAllBtn.addEventListener("click", () => {
    const allSelects = document.querySelectorAll(".status-select");

    allSelects.forEach(select => {
        const index = select.dataset.index;
        const newStatus = select.value;

        if (guides[index].status !== newStatus) {
            guides[index].status = newStatus;
            guides[index].history.push({
                status: newStatus,
                timestamp: new Date().toLocaleString()
            });
        }
    });

    renderGuides();
    updateStatusPanel();
});

document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("tracking__button--history")) {
        const index = e.target.dataset.index;
        const guide = guides[index];
        const historyList = document.getElementById("history-list");
        const modal = document.getElementById("history-modal");

        historyList.innerHTML = "";

        guide.history.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `Estado: ${entry.status} | Fecha: ${entry.timestamp}`;
            historyList.appendChild(li);
        });

        modal.classList.remove("hidden");
    }
});

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("history-modal").classList.add("hidden");
});
