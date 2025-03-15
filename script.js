function parseStudentInput(input) {
    let lines = input.trim().split("\n");
    let students = [];
    lines.forEach(line => {
        let parts = line.split(",");
        if (parts.length === 5) {
            students.push({
                name: parts[0].trim(),
                rowdiness: parseInt(parts[1].trim()),
                participation: parseInt(parts[2].trim()),
                teacher: parts[3].trim(),
                door: parts[4].trim()
            });
        }
    });
    return students;
}

function parseSeatInput(input) {
    return input.split(",").map(num => parseInt(num.trim()));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateSeating() {
    var seatingChart = document.getElementById("seating-chart");
    seatingChart.innerHTML = ""; // Clear previous layout

    let studentInput = document.getElementById("studentInput").value;
    let seatInput = document.getElementById("seatInput").value;

    let students = parseStudentInput(studentInput);
    let seats = parseSeatInput(seatInput);

    if (students.length !== seats.length) {
        alert("Number of students and number of seats must be equal!");
        return;
    }

    shuffle(students); // Shuffle students for randomness

    var frontRow = [];
    var sideRow = [];
    var remainingSeats = [];

    // Assign students based on preference
    students.forEach(student => {
        if (student.teacher === "near") {
            frontRow.push(student);
        } else if (student.door === "near") {
            sideRow.push(student);
        } else {
            remainingSeats.push(student);
        }
    });

    // Fill up remaining spots in front/side rows
    while (frontRow.length < seats.length / 2 && remainingSeats.length > 0) {
        frontRow.push(remainingSeats.pop());
    }
    while (sideRow.length < seats.length && remainingSeats.length > 0) {
        sideRow.push(remainingSeats.pop());
    }

    // Final sorted list of students
    var finalSeating = [...frontRow, ...sideRow];

    var tableContent = "<tr>";
    for (var i = 0; i < finalSeating.length; i++) {
        let seatStyle = finalSeating[i].rowdiness >= 6 ? " style='background-color: lightcoral;'" : ""; // Highlight rowdy students
        tableContent += `<td${seatStyle}>Seat ${seats[i]}: ${finalSeating[i].name}</td>`;

        if ((i + 1) % 6 == 0 && i !== finalSeating.length - 1) tableContent += "</tr><tr>"; // Start new row every 6 seats
    }
    tableContent += "</tr>";

    $("#seating-chart").html(tableContent); // Update table using jQuery
}
