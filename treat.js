var key = localStorage.getItem("name");

if (key == "secrate") {
}
else {
  window.location.href = "index.html";
}

// Check if session has timed out
    if(localStorage.getItem('name') === 'logout') {
      // Perform logout actions here, such as redirecting to login page
      window.location.href = 'index.html';
    } else {
      // Set session timeout timer to check for session timeout
      var sessionTimeout = setTimeout(function() {
        // Set local storage item to "logout"
        localStorage.setItem('name', 'logout');
        // Perform logout actions here, such as redirecting to login page
        window.location.href = 'index.html';
      }, 1800000); // Set timeout period to 30 minutes (in milliseconds)
    
      // Reset session timeout on user activity
      window.addEventListener('mousemove', function() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(function() {
          // Set local storage item to "logout"
          localStorage.setItem('name', 'logout');
          // Perform logout actions here, such as redirecting to login page
          window.location.href = 'index.html';
        }, 1800000); // Set timeout period to 30 minutes (in milliseconds)
      });
    }




function run() {


    fetchCaseDataSuggestions();

}



function activateLoader() {
    // Hide the form and apply special styling
    document.getElementById('patientForm').classList.add('hide');
    document.getElementById('myLoader').style.display = 'block';
    // document.body.classList.add('loader-active');
    //document.form.classList.remove('form');

}

// Deactivate loader and revert to normal styling
function deactivateLoader() {
    // Display the form and remove special styling
    document.getElementById('patientForm').style.display = 'block';
    document.getElementById('myLoader').style.display = 'none';
    //document.body.classList.remove('loader-active');


}





function validateForm() {
    // Prevent the default form submission

    document.getElementById('submitButton').classList.add('hide');

    document.getElementById('patientForm').ariaDisabled;

    const form = document.getElementById('patientForm');

    // Check each required input field
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    requiredInputs.forEach(input => {

        if (!input.value.trim()) {
            // Add red border to empty required field
            input.classList.add('required');
            isValid = false;
        } else {
            // Remove red border if field is filled
            input.classList.remove('required');
        }

    });

    // If any required field is empty, stop form submission
    if (!isValid) {
        document.getElementById('submitButton').classList.remove('hide');
        alert('Please fill in all required fields.');
        return false;
    }

    activateLoader();

    submitForm();

    return true;

}





function submitForm() {




    var form = document.getElementById("patientForm");
    var formData = new FormData(form);

    activateLoader();
    fetch("https://script.google.com/macros/s/AKfycbyA0I2JgSeHPGo9csCavHXmxu9YJMWT10o9Yq1t5wQUs8fH7mVBgyknLyHGY-n6VCnKCg/exec", {
        method: "POST",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert("Data added successfully");
                form.reset(); // Reset the form after successful submission
                fetchCaseDataSuggestions();
                fetchSuggestions();
                deactivateLoader();
                document.getElementById('submitButton').classList.remove('hide');
            } else {
                deactivateLoader();
                document.getElementById('submitButton').classList.remove('hide');
                throw new Error("Network response was not ok");

            }
        })

        .catch(error => alert("Error: " + error.message));
    deactivateLoader();
    document.getElementById('submitButton').disabled = false;
}






var suggestions = [];

// Fetch suggestions from the URL and store them in the global variable


// Function to fetch suggestions and populate the global variable
function fetchSuggestions() {
    fetch('https://script.google.com/macros/s/AKfycbxVO-6AzGgMs3klmYRL_LcDzIWkeMnVtCHb7GNE_1UhP9YbvsimGJWXsqOe8CrR00K0/exec')
        .then(response => response.json())
        .then(data2 => {

            // Exclude the first row (header) and extract suggestions from the response
            suggestions = data2.content2.slice(1).map(row => row[0]);
            //  console.log('All suggestions:', suggestions);
            deactivateLoader();
        })
        .catch(error => {
            // console.error('Error fetching suggestions:', error);
            deactivateLoader();
        });
}

// Function to show suggestions
// Function to show suggestions
function showSuggestions() {
    var leftInput = document.getElementById("leftInput");
    var suggestionList = document.getElementById("suggestionList");

    // Hide suggestion list initially
    suggestionList.style.display = "none";

    // Get the input value
    var input = leftInput.value.toLowerCase();
    // console.log('Input:', input);

    // Filter suggestions based on the input
    var matchingSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(input));
    //console.log('Matching suggestions:', matchingSuggestions); // Log matching suggestions for debugging

    if (matchingSuggestions.length > 0) {
        // Clear previous suggestions
        suggestionList.innerHTML = "";

        // Populate suggestion list
        matchingSuggestions.forEach(function (suggestion) {
            var suggestionItem = document.createElement("div");
            suggestionItem.textContent = suggestion;
            suggestionItem.classList.add("suggestionItem");
            suggestionItem.onclick = function () {
                leftInput.value = suggestion;
                suggestionList.style.display = "none";
            };
            suggestionList.appendChild(suggestionItem);
        });

        // Show suggestion list
        suggestionList.style.display = "block";
    }
}

function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}

document.body.addEventListener("click", function (event) {
    var leftInput = document.getElementById("leftInput");
    var suggestionList = document.getElementById("suggestionList");
    if (event.target !== leftInput && event.target !== suggestionList) {
        suggestionList.style.display = "none";
    }
});

function addToTextarea() {
    var leftInput = document.getElementById("leftInput").value;
    var rightInput = document.getElementById("rightInput").value;
    var textarea = document.getElementById("treatment");

    // Check if the right input is empty
    if (!rightInput.trim()) {
        alert("Please fill in the value for the right input.");
        return; // Exit the function if right input is empty
    }

    var currentText = textarea.value.trim();
    if (currentText !== "") {
        currentText += ", ";
    }
    currentText += leftInput + " :- " + rightInput;
    textarea.value = currentText;

    // Clear input values
    document.getElementById("leftInput").value = "";
    document.getElementById("rightInput").value = "";

    var popup = document.getElementById("popup");
    popup.style.display = "none";
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var caseDataSuggestions = []; // Global variable to store case data suggestions
var suggestionList = document.getElementById("casesuggestionList");

// Function to fetch case data suggestions and populate the global variable
function fetchCaseDataSuggestions() {

    activateLoader();
    fetch('https://script.google.com/macros/s/AKfycbwjSTcCfwTNFu19Y_gcmfoiw_Jh5fX_wkiKk3CD5SQ3-mru-mh_F5eNBr9vd7OP25qQWA/exec')
        .then(response => response.json())
        .then(data => {

            // Extracting case numbers, names, and addresses from fetched data and storing them in the global variable
            caseDataSuggestions = data.content.slice(1).map(row => ({
                number: row[1], // Assuming case number is in the second column
                name: row[2],   // Assuming name is in the third column
                address: row[3] // Assuming address is in the fifth column

            }));

            // console.log('Fetched case data:', caseDataSuggestions);
            fetchSuggestions();
        })
        .catch(error => {
            // console.error('Error fetching case data suggestions:', error);
            deactivateLoader();
        });
}

// Function to show case number suggestions
// Function to show case number suggestions
function showCaseSuggestions() {
    var caseInput = document.getElementById("casenumb");
    // var suggestionList = document.getElementById("casesuggestionList");

    // Get the input value
    var input = caseInput.value;

    // Filter suggestions based on the input
    var matchingSuggestions = caseDataSuggestions.filter(suggestion => suggestion.number.toString().startsWith(input));

    // Clear previous suggestions
    suggestionList.innerHTML = "";

    if (matchingSuggestions.length > 0) {
        // Populate suggestion list
        matchingSuggestions.forEach(function (suggestion) {
            var suggestionItem = document.createElement("div");
            suggestionItem.textContent = suggestion.number + ' - ' + suggestion.name; // Displaying both case number and name
            suggestionItem.classList.add("suggestionItem");
            suggestionItem.onclick = function () {
                caseInput.value = suggestion.number;
                // Fill the corresponding name and address in the input boxes
                document.getElementById("name").value = suggestion.name;
                document.getElementById("address").value = suggestion.address;
                suggestionList.style.display = "none";
            };
            suggestionList.appendChild(suggestionItem);
        });

        // Show suggestion list
        suggestionList.style.display = "block";
    } else {
        // Hide suggestion list if no matching suggestions found
        suggestionList.style.display = "none";
    }
}

function showNameSuggestions() {
    var nameInput = document.getElementById("name");
    //var suggestionList = document.getElementById("namesuggestionList");

    // Get the input value
    var input = nameInput.value.toLowerCase();

    // Filter suggestions based on the input
    var matchingSuggestions = caseDataSuggestions.filter(suggestion => suggestion.name.toLowerCase().startsWith(input));

    // Clear previous suggestions
    suggestionList.innerHTML = "";

    if (matchingSuggestions.length > 0) {
        // Populate suggestion list
        matchingSuggestions.forEach(function (suggestion) {
            var suggestionItem = document.createElement("div");
            suggestionItem.textContent = suggestion.name + ' - ' + suggestion.number; // Displaying both name and case number
            suggestionItem.classList.add("suggestionItem");
            suggestionItem.onclick = function () {
                nameInput.value = suggestion.name;
                // Fill the corresponding case number and address in the input boxes
                document.getElementById("casenumb").value = suggestion.number;
                document.getElementById("address").value = suggestion.address;
                suggestionList.style.display = "none";
            };
            suggestionList.appendChild(suggestionItem);
        });

        // Show suggestion list
        suggestionList.style.display = "block";
    } else {
        // Hide suggestion list if no matching suggestions found
        suggestionList.style.display = "none";
    }
}

// Function to close suggestion list when clicked outside
document.addEventListener('click', function (event) {
    var suggestionLists = document.getElementsByClassName("casesuggestionList");
    for (var i = 0; i < suggestionLists.length; i++) {
        var suggestionList = suggestionLists[i];
        if (event.target !== suggestionList && !suggestionList.contains(event.target)) {
            suggestionList.style.display = "none";
        }
    }
});


let caseData = [];


function fetchInfo() {
  
    showLoader();

  fetch('https://script.google.com/macros/s/AKfycbwjSTcCfwTNFu19Y_gcmfoiw_Jh5fX_wkiKk3CD5SQ3-mru-mh_F5eNBr9vd7OP25qQWA/exec')
    .then(res => res.json())
    .then(data => {

      
      const infodata = data?.content;
     
     
      if (infodata && infodata.length > 0) {
          
        caseData = infodata;
        getSitedetails();
        hideLoader();
        //console.log(caseData);
      }


    });

}


function getSitedetails() {
    var casenumb = document.getElementById("casenumb").value;
    if (!casenumb) {
        alert("Please enter a case number.");
        return;
    }

    const dataIndex = caseData.findIndex(el => el[1] == casenumb);
    if (dataIndex === -1) {
        alert("Case number not found.");
        return;
    }

    const selectedsite = caseData[dataIndex];
    console.log(dataIndex);
    if (selectedsite && selectedsite.length > 0) {
        const popupHTML = `
            <div id="popupContainer2" class="popup">
                <h2>Case Details</h2>
                <p>Case Number: ${selectedsite[1]}</p>
                <p>Name: ${selectedsite[2]}</p>
                <p>Address: ${selectedsite[3]}</p>
                <p>Contact: ${selectedsite[4]}</p>
                <p>Age: ${selectedsite[5]}</p>
                <p>Gender: ${selectedsite[6]}</p>
                <p>प्र.वेदना/काल: ${selectedsite[7]}</p>
                <p>आहार: ${selectedsite[8]}</p>
                <p>Patient Data: ${selectedsite[9]}</p>
                <button onclick="closedPopup()">Close</button>
            </div>
        `;
        document.getElementById('popupContainer2').innerHTML = popupHTML;
        document.getElementById('popupContainer2').style.display = 'block';
    }
}


function showInfoPopup() {
    fetchInfo();
}

function closedPopup() {
    document.getElementById('popupContainer2').style.display = 'none';
}



function showLoader() {
    document.getElementById('speener').style.display = 'block';
}

function hideLoader() {
    document.getElementById('speener').style.display = 'none';
}