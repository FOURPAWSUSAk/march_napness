document.addEventListener("DOMContentLoaded", function () {
    // Players per sanctuary
    const sanctuaries = {
        arbs: ["Brumca", "Erich", "Mark"],
        mur: ["Mascha", "Michal", "Rocco", "Ida"],
        arosa: ["Amelia", "Meimo", "Sam", "Jamila"],
        pri: ["Mira", "Tomi", "Hana", "Mali"],
        dom: ["Tyson", "Frankie", "Masha", "Julia"],
        bel: ["Iva", "Suzana", "Jeta", "Svetla"]
    };

    function populateMatchOptions(selectId, options) {
        let select = document.getElementById(selectId);
        select.innerHTML = `<option value="">Select</option>` + 
            options.map(name => `<option value="${name}">${name}</option>`).join("");
    }

    function clearDropdown(selectId) {
        let select = document.getElementById(selectId);
        select.innerHTML = `<option value="">Select</option>`;
    }

    function updateNextRound(previousMatches, nextRoundId) {
        let selectedOptions = previousMatches.map(match => match.value).filter(v => v);
        let nextRound = document.getElementById(nextRoundId);

        if (selectedOptions.length > 0) {
            nextRound.innerHTML = `<option value="">Select</option>` + 
                selectedOptions.map(name => `<option value="${name}">${name}</option>`).join("");
        } else {
            clearDropdown(nextRoundId);
        }
    }

    // Populate Round 1 Matches
    Object.keys(sanctuaries).forEach(sanctuary => {
        populateMatchOptions(`${sanctuary}_match1`, sanctuaries[sanctuary]);
        populateMatchOptions(`${sanctuary}_match2`, sanctuaries[sanctuary]);
    });

    // Round 1 elements
    const round1Matches = ["arbs", "mur", "arosa", "pri", "dom", "bel"].map(sanctuary => [
        document.getElementById(`${sanctuary}_match1`),
        document.getElementById(`${sanctuary}_match2`)
    ]);

    // Round 2 elements
    const round2Matches = ["arbs", "mur", "arosa", "pri", "dom", "bel"].map(sanctuary => 
        document.getElementById(`round2_${sanctuary}`)
    );

    // Semi-Finals & Championship
    const semiLeft = document.getElementById("semi_left");
    const semiRight = document.getElementById("semi_right");
    const championship = document.getElementById("championship");

    // Clear all dropdowns after Round 1
    round2Matches.forEach(round2 => clearDropdown(round2.id));
    clearDropdown(semiLeft.id);
    clearDropdown(semiRight.id);
    clearDropdown(championship.id);

    // Attach event listeners for Round 1 to Round 2
    round1Matches.forEach(([match1, match2], index) => {
        match1.addEventListener("change", () => updateNextRound([match1, match2], round2Matches[index].id));
        match2.addEventListener("change", () => updateNextRound([match1, match2], round2Matches[index].id));
    });

    // Split Semi-Finals into Left & Right
    function updateSemiFinals() {
        let leftWinners = ["arbs", "mur", "arosa"].map(sanctuary => document.getElementById(`round2_${sanctuary}`).value).filter(v => v);
        let rightWinners = ["pri", "dom", "bel"].map(sanctuary => document.getElementById(`round2_${sanctuary}`).value).filter(v => v);

        semiLeft.innerHTML = leftWinners.length
            ? `<option value="">Select</option>` + leftWinners.map(name => `<option value="${name}">${name}</option>`).join("")
            : `<option value="">Select</option>`;

        semiRight.innerHTML = rightWinners.length
            ? `<option value="">Select</option>` + rightWinners.map(name => `<option value="${name}">${name}</option>`).join("")
            : `<option value="">Select</option>`;
    }

    round2Matches.forEach(round2 => round2.addEventListener("change", updateSemiFinals));

    // Update Championship
    function updateChampionship() {
        let finalists = [semiLeft.value, semiRight.value].filter(v => v);
        championship.innerHTML = finalists.length
            ? `<option value="">Select</option>` + finalists.map(name => `<option value="${name}">${name}</option>`).join("")
            : `<option value="">Select</option>`;
    }

    semiLeft.addEventListener("change", updateChampionship);
    semiRight.addEventListener("change", updateChampionship);

    // ✅ Reset Button Functionality
    function resetAllSelections() {
        document.querySelectorAll("select").forEach(select => {
            select.value = ""; // Reset selection to default
        });

        // Reset dropdown options
        Object.keys(sanctuaries).forEach(sanctuary => {
            populateMatchOptions(`${sanctuary}_match1`, sanctuaries[sanctuary]);
            populateMatchOptions(`${sanctuary}_match2`, sanctuaries[sanctuary]);
        });

        // Clear later rounds
        round2Matches.forEach(round2 => clearDropdown(round2.id));
        clearDropdown(semiLeft.id);
        clearDropdown(semiRight.id);
        clearDropdown(championship.id);

        console.log("Reset button clicked! All selections cleared."); // Debugging message
    }

    // Select the Reset button and attach event listener
    const resetButton = document.querySelector(".bracket-buttons button:nth-child(2)");
    resetButton.addEventListener("click", resetAllSelections);
});