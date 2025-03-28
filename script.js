    let students = [];

    function generateInputTable() {
      const count = parseInt(document.getElementById("seatCount").value);
      const table = document.getElementById("studentTable");
      table.innerHTML = "";

      for (let i = 0; i < count; i++) {
        table.innerHTML += `
          <tr>
            <td><input type="text" placeholder="Name"></td>
            <td><input type="number" min="0" max="10" placeholder="Rowdiness"></td>
            <td><input type="number" min="0" max="10" placeholder="Participation"></td>
            <td>
              <select>
                <option value="any">Any</option>
                <option value="near">Near</option>
                <option value="away">Away</option>
              </select>
            </td>
            <td>
              <select>
                <option value="any">Any</option>
                <option value="near">Near</option>
                <option value="away">Away</option>
              </select>
            </td>
          </tr>`;
      }
    }

    function saveData() {
      const rows = document.querySelectorAll("#studentTable tr");
      students = [];
      rows.forEach(row => {
        const inputs = row.querySelectorAll("input, select");
        students.push({
          name: inputs[0].value,
          rowdiness: parseInt(inputs[1].value),
          participation: parseInt(inputs[2].value),
          teacher: inputs[3].value,
          door: inputs[4].value
        });
      });
      localStorage.setItem("students", JSON.stringify(students));
    }

    function loadData() {
      const saved = localStorage.getItem("students");
      if (!saved) return;
      students = JSON.parse(saved);
      document.getElementById("seatCount").value = students.length;
      generateInputTable();
      const rows = document.querySelectorAll("#studentTable tr");
      students.forEach((s, i) => {
        const inputs = rows[i].querySelectorAll("input, select");
        inputs[0].value = s.name;
        inputs[1].value = s.rowdiness;
        inputs[2].value = s.participation;
        inputs[3].value = s.teacher;
        inputs[4].value = s.door;
      });
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function isRowdyConflict(index, studentList, gapValues) {
      const current = studentList[index];
      if (current.rowdiness < 6) return false;
      return gapValues.some(gap => {
        const pairIndex = index + gap;
        return pairIndex < studentList.length && studentList[pairIndex].rowdiness >= 6;
      });
    }

    function generateSeating() {
      saveData();
      const isU = document.getElementById("isUShaped").value === "yes";
      const useRowdiness = document.getElementById("useRowdiness").checked;
      const useTeacher = document.getElementById("useTeacher").checked;
      let studentList = [...students];

      if (!isU) {
        shuffle(studentList);
      } else {
        if (useRowdiness) {
          shuffle(studentList);
          studentList.sort((a, b) => a.rowdiness - b.rowdiness);
          // Rowdiness adjacency filtering
          const n = studentList.length;
          const gapLeft = n / 2 + 2;
          const gapBack = n / 2;
          const gapRight = n / 2 - 2;
          const gaps = [gapLeft, gapBack, gapRight];

          for (let i = 0; i < studentList.length; i++) {
            if (isRowdyConflict(i, studentList, gaps)) {
              // Swap with a non-rowdy student further down the list
              for (let j = i + 1; j < studentList.length; j++) {
                if (studentList[j].rowdiness < 6) {
                  [studentList[i], studentList[j]] = [studentList[j], studentList[i]];
                  break;
                }
              }
            }
          }
        }
      }

      const chart = document.getElementById("seating-chart");
      chart.innerHTML = "";
      let row = "<tr>";
      studentList.forEach((s, i) => {
        let style = "";
        if (s.rowdiness >= 6 && useRowdiness) {
          style = " style='background-color: lightcoral;'";
        }
        row += `<td${style}>${s.name}</td>`;
        if ((i + 1) % 6 === 0) row += "</tr><tr>";
      });
      row += "</tr>";
      chart.innerHTML = row;
    }

    window.onload = loadData;