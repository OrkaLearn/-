const invbut = document.getElementById('invbut');
const container = document.getElementById('invitations-container');

// Mock data
const names = ["Kevin", "Alice", "Bob", "Charlie", "Diana"];
const activities = ["Basketball", "Study Session", "Lunch", "Gaming", "Discussion"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 1. Invite Button Logic
invbut.addEventListener('click', function () {
    const card = document.createElement('div');
    card.classList.add('invite-card'); // Uses new compact style

    const name = getRandomItem(names);
    const activity = getRandomItem(activities);

    // Create random future time
    const now = new Date();
    const future = new Date(now.getTime() + Math.random() * 3 * 60 * 60 * 1000);
    const timeString = future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate unique ID for the activity
    const activityId = Date.now().toString() + Math.random().toString().slice(2);

    card.innerHTML = `
        <img src="imgs/propicph.png" class="propic" alt="Profile">
        <h3>${name}</h3>
        <p class="activity">${activity}</p>
        <p class="time">${timeString}</p>
        <button class="join-btn" data-id="${activityId}">Join</button>
    `;

    // Add Join Event Listener
    const joinBtn = card.querySelector('.join-btn');
    joinBtn.addEventListener('click', () => {
        handleJoin(activityId, name, activity, timeString);
    });

    container.appendChild(card);
});

function handleJoin(id, name, activity, time) {
    // 1. Get existing joined activities or init empty array
    let joined = JSON.parse(localStorage.getItem('joinedActivities')) || [];

    // 2. Add new activity
    joined.push({
        id: id,
        host: name,
        activity: activity,
        time: time,
        joinedAt: new Date().toISOString()
    });

    // 3. Save back to localStorage
    localStorage.setItem('joinedActivities', JSON.stringify(joined));

    // 4. Feedback & Redirect
    alert(`You joined ${activity} with ${name}! Redirecting to Ongoing...`);
    window.location.href = 'ongoing.html';
}