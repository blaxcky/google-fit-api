const CLIENT_ID = '714587896197-3ujdr97ovf4teeq93nh5fak9vfmqh2q9.apps.googleusercontent.com';
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual API key
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/fitness.nutrition.write';

let gapi;
let isSignedIn = false;

// Initialize Google API
function initializeGapi() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: CLIENT_ID,
        }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            isSignedIn = authInstance.isSignedIn.get();
            updateUI();
            
            // Listen for sign-in state changes
            authInstance.isSignedIn.listen(updateUI);
        });
    });
}

// Update UI based on authentication state
function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const mainContent = document.getElementById('main-content');
    
    if (isSignedIn) {
        authBtn.textContent = 'Abmelden';
        authBtn.onclick = signOut;
        mainContent.style.display = 'block';
    } else {
        authBtn.textContent = 'Mit Google Fit verbinden';
        authBtn.onclick = signIn;
        mainContent.style.display = 'none';
    }
}

// Sign in to Google
function signIn() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn({
        scope: SCOPES
    }).then(() => {
        isSignedIn = true;
        updateUI();
        showStatus('Erfolgreich mit Google Fit verbunden!', 'success');
    }).catch((error) => {
        showStatus('Fehler bei der Anmeldung: ' + error.error, 'error');
    });
}

// Sign out
function signOut() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
        isSignedIn = false;
        updateUI();
        showStatus('Abgemeldet', 'info');
    });
}

// Add calories to Google Fit
async function addCaloriesToGoogleFit(calories, description) {
    try {
        const authInstance = gapi.auth2.getAuthInstance();
        const user = authInstance.currentUser.get();
        const accessToken = user.getAuthResponse().access_token;

        const now = Date.now();
        const dataSourceId = `raw:com.google.nutrition:${CLIENT_ID}:calories`;
        
        const dataSet = {
            dataSourceId: dataSourceId,
            maxEndTimeNs: now * 1000000,
            minStartTimeNs: now * 1000000,
            point: [{
                startTimeNanos: now * 1000000,
                endTimeNanos: now * 1000000,
                dataTypeName: 'com.google.nutrition',
                value: [{
                    fpVal: parseFloat(calories)
                }]
            }]
        };

        const response = await fetch(
            `https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${now * 1000000}-${now * 1000000}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataSet)
            }
        );

        if (response.ok) {
            showStatus(`${calories} kcal erfolgreich hinzugefügt!`, 'success');
            document.getElementById('calorie-form').reset();
        } else {
            throw new Error('Failed to add calories');
        }
    } catch (error) {
        showStatus('Fehler beim Hinzufügen der Kalorien: ' + error.message, 'error');
    }
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
    }, 3000);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calorie-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const calories = document.getElementById('calories').value;
        const description = document.getElementById('description').value;
        
        if (calories && isSignedIn) {
            addCaloriesToGoogleFit(calories, description);
        }
    });
    
    // Initialize Google API when page loads (moved to HTML onload)
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}