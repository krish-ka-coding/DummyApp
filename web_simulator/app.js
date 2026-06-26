/* ==========================================================================
   iOS WEB SIMULATOR & DUMMY APP SCRIPT
   ========================================================================== */

// Current Active App tracking
let activeAppId = null;

// ==========================================================================
// SYSTEM CLOCK & DATE
// ==========================================================================
function updateClock() {
    const now = new Date();
    
    // Format Time
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeStr = `${hours}:${minutes}`;
    
    // Status bar clock (24h or simple HH:MM)
    const rawHours = now.getHours().toString().padStart(2, '0');
    const rawMinutes = now.getMinutes().toString().padStart(2, '0');
    const statusTimeStr = `${rawHours}:${rawMinutes}`;
    
    document.getElementById('status-time').textContent = statusTimeStr;
    
    // Home Widget Time (with AM/PM optionally, showing 12h format)
    const widgetTimeEl = document.getElementById('widget-time');
    if (widgetTimeEl) {
        widgetTimeEl.textContent = timeStr;
    }
    
    // Format Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();
    
    const dateStr = `${dayName}, ${monthName} ${dateNum}`;
    const widgetDateEl = document.getElementById('widget-date');
    if (widgetDateEl) {
        widgetDateEl.textContent = dateStr;
    }
}

// Start Clock interval
setInterval(updateClock, 1000);
updateClock();

// Battery Simulation
function updateBattery() {
    const batteryLevelEl = document.getElementById('battery-level');
    const batteryPercentageEl = document.getElementById('battery-percentage');
    let pct = 98; // Simulated battery charge
    
    // Periodically fluctuate battery slightly or set static high
    batteryLevelEl.style.width = pct + '%';
    batteryPercentageEl.textContent = pct + '%';
    
    // Toggle battery color based on charge
    if (pct <= 20) {
        batteryLevelEl.style.background = '#ff3b30'; // red
    } else {
        batteryLevelEl.style.background = '#34c759'; // green
    }
}
updateBattery();

// ==========================================================================
// ROUTER & APP WINDOW CONTROLLERS
// ==========================================================================
function launchApp(appId) {
    const homeScreen = document.getElementById('home-screen');
    const targetAppWindow = document.getElementById(`app-${appId}`);
    
    if (!targetAppWindow) return;
    
    // Close active app first if one is open
    if (activeAppId) {
        closeActiveApp(false);
    }
    
    // Trigger Dynamic Island launch animation
    triggerIslandAlert("⚡", `Loading ${appId.toUpperCase()}...`, "✓");
    
    // Set animations
    homeScreen.classList.remove('active');
    targetAppWindow.classList.add('active');
    activeAppId = appId;
    
    // Specific app loaders
    if (appId === 'notes') {
        renderNotes();
    }
}

function closeActiveApp(returnToHome = true) {
    if (!activeAppId) return;
    
    const activeWindow = document.getElementById(`app-${activeAppId}`);
    if (activeWindow) {
        activeWindow.classList.remove('active');
    }
    
    activeAppId = null;
    
    if (returnToHome) {
        const homeScreen = document.getElementById('home-screen');
        homeScreen.classList.add('active');
        
        // Restore Dynamic Island
        triggerIslandAlert("📱", "Home Screen", "");
    }
}

// ==========================================================================
// DYNAMIC ISLAND ALERT SYSTEM
// ==========================================================================
let islandTimeout = null;

function triggerIslandAlert(leftText, centerText, rightText, isMusic = false) {
    const island = document.getElementById('dynamic-island');
    const islandLeft = document.getElementById('island-left');
    const islandCenter = document.getElementById('island-center');
    const islandRight = document.getElementById('island-right');
    
    // Clear any active timeout
    if (islandTimeout) {
        clearTimeout(islandTimeout);
    }
    
    // Reset contents
    islandLeft.innerHTML = leftText;
    islandCenter.innerHTML = centerText;
    islandRight.innerHTML = rightText;
    
    // Expand physical sizes
    island.className = 'dynamic-island'; // clear previous
    if (isMusic) {
        island.classList.add('expanded-music');
    } else {
        island.classList.add('expanded-alert');
    }
    
    // Contract after 3 seconds
    islandTimeout = setTimeout(() => {
        island.className = 'dynamic-island'; // Collapses back to standard pill
        setTimeout(() => {
            islandLeft.innerHTML = '';
            islandCenter.innerHTML = '';
            islandRight.innerHTML = '';
        }, 300); // clear after animation completes
    }, 2800);
}

// ==========================================================================
// APP 1: CALCULATOR LOGIC
// ==========================================================================
let calcInput = '0';
let calcPrevInput = null;
let calcOperator = null;
let calcResetOnNext = false;

function pressCalc(val) {
    const display = document.getElementById('calc-display');
    
    if (val === 'AC') {
        calcInput = '0';
        calcPrevInput = null;
        calcOperator = null;
        calcResetOnNext = false;
    } else if (val === '+/-') {
        if (calcInput !== '0') {
            calcInput = calcInput.startsWith('-') ? calcInput.slice(1) : '-' + calcInput;
        }
    } else if (val === '%') {
        calcInput = (parseFloat(calcInput) / 100).toString();
    } else if (['+', '-', '*', '/'].includes(val)) {
        calcPrevInput = calcInput;
        calcOperator = val;
        calcResetOnNext = true;
    } else if (val === '=') {
        if (calcOperator && calcPrevInput !== null) {
            calcInput = calculate(parseFloat(calcPrevInput), parseFloat(calcInput), calcOperator).toString();
            calcOperator = null;
            calcPrevInput = null;
            calcResetOnNext = true;
        }
    } else {
        // Number input
        if (calcInput === '0' || calcResetOnNext) {
            calcInput = val;
            calcResetOnNext = false;
        } else {
            // Avoid double decimals
            if (val === '.' && calcInput.includes('.')) return;
            calcInput += val;
        }
    }
    
    // Format presentation of display (e.g. replace * with ×, etc.)
    display.textContent = calcInput.slice(0, 10); // cap display length
}

function calculate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error';
        default: return b;
    }
}

// ==========================================================================
// APP 2: WEATHER LOGIC
// ==========================================================================
// Static forecasts loaded in HTML. We can add a city toggler or interactive search.

// ==========================================================================
// APP 3: NOTES LOGIC (LOCAL STORAGE SUPPORTED)
// ==========================================================================
let notes = JSON.parse(localStorage.getItem('ios_dummy_notes')) || [
    {
        id: 1,
        title: 'Project Ideas',
        content: '1. Build an iOS Simulator mock app\n2. Research modern CSS glassmorphism\n3. Create custom widget layers',
        date: new Date().toLocaleDateString()
    },
    {
        id: 2,
        title: 'Shopping List',
        content: '- Organic apples\n- Green tea packets\n- Almond milk\n- Multi-grain bread',
        date: new Date().toLocaleDateString()
    }
];

let activeNoteId = null;
let isNotesDeleteMode = false;

function renderNotes() {
    const listContainer = document.getElementById('notes-list');
    const searchInput = document.getElementById('notes-search-input').value.toLowerCase();
    
    // Update total count
    document.getElementById('notes-count').textContent = `${notes.length} Notes`;
    
    listContainer.innerHTML = '';
    
    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchInput) || 
        n.content.toLowerCase().includes(searchInput)
    );
    
    if (filteredNotes.length === 0) {
        listContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--label-tertiary);">No Notes Found</div>';
        return;
    }
    
    filteredNotes.forEach(note => {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'note-item-wrapper';
        if (isNotesDeleteMode) {
            itemWrapper.classList.add('show-delete');
        }
        
        // Truncate details for sub-caption preview
        const firstLine = note.content.split('\n')[0] || 'No additional text';
        
        itemWrapper.innerHTML = `
            <div class="note-delete-trigger" onclick="deleteNote(${note.id}, event)">Delete</div>
            <div class="note-item" onclick="openNote(${note.id})">
                <span class="note-title">${note.title || 'Untitled Note'}</span>
                <div class="note-meta">
                    <span>${note.date}</span>
                    <span class="note-preview-text">${firstLine}</span>
                </div>
            </div>
        `;
        listContainer.appendChild(itemWrapper);
    });
}

function filterNotes() {
    renderNotes();
}

function openNote(id) {
    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    
    if (!note) return;
    
    document.getElementById('note-edit-title').value = note.title;
    document.getElementById('note-edit-content').value = note.content;
    
    document.getElementById('notes-list-view').classList.remove('active');
    document.getElementById('notes-edit-view').classList.add('active');
}

function openNewNote() {
    activeNoteId = Date.now(); // unique ID
    
    document.getElementById('note-edit-title').value = '';
    document.getElementById('note-edit-content').value = '';
    
    document.getElementById('notes-list-view').classList.remove('active');
    document.getElementById('notes-edit-view').classList.add('active');
    
    // Focus title field
    setTimeout(() => {
        document.getElementById('note-edit-title').focus();
    }, 200);
}

function saveAndCloseNote() {
    const titleVal = document.getElementById('note-edit-title').value.trim();
    const contentVal = document.getElementById('note-edit-content').value.trim();
    
    // If empty completely, ignore saving
    if (!titleVal && !contentVal) {
        document.getElementById('notes-edit-view').classList.remove('active');
        document.getElementById('notes-list-view').classList.add('active');
        activeNoteId = null;
        renderNotes();
        return;
    }
    
    const existingIndex = notes.findIndex(n => n.id === activeNoteId);
    const currentDateStr = new Date().toLocaleDateString();
    
    const noteData = {
        id: activeNoteId,
        title: titleVal || 'Untitled Note',
        content: contentVal,
        date: currentDateStr
    };
    
    if (existingIndex > -1) {
        notes[existingIndex] = noteData;
    } else {
        notes.push(noteData);
    }
    
    // Save to local storage
    localStorage.setItem('ios_dummy_notes', JSON.stringify(notes));
    
    // Dynamic island notification on save
    triggerIslandAlert("📝", "Note Saved Successfully", "✓");
    
    // Navigation routing
    document.getElementById('notes-edit-view').classList.remove('active');
    document.getElementById('notes-list-view').classList.add('active');
    activeNoteId = null;
    isNotesDeleteMode = false;
    renderNotes();
}

function toggleNotesDelete() {
    isNotesDeleteMode = !isNotesDeleteMode;
    renderNotes();
}

function deleteNote(id, event) {
    event.stopPropagation();
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('ios_dummy_notes', JSON.stringify(notes));
    triggerIslandAlert("🗑", "Note Deleted", "");
    renderNotes();
}

// ==========================================================================
// APP 4: SAFARI BROWSER LOGIC (SANDBOX WEBSITE SIMULATOR)
// ==========================================================================
let safariHistory = [];
let safariHistoryIndex = -1;

// Curated Mock Site Database to avoid Cross-Origin iframe failures
const mockWebsites = {
    'https://apple.com': {
        title: 'Apple',
        url: 'https://apple.com',
        content: `
            <div style="text-align: center; color: white; background: #000; padding: 40px 10px; border-radius: 12px;">
                <h1 style="font-size: 34px; font-weight: 700; margin-bottom: 5px;">iPhone 16 Pro</h1>
                <p style="font-size: 16px; opacity: 0.8; margin-bottom: 20px;">Built for Apple Intelligence.</p>
                <button style="background: #007aff; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 600;">Learn More</button>
            </div>
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: #f5f5f7; color: black; padding: 20px; border-radius: 12px; text-align: center;">
                    <h3 style="margin-bottom: 4px;">MacBook Air</h3>
                    <p style="font-size: 12px; opacity: 0.7;">Supercharged by M3.</p>
                </div>
                <div style="background: #f5f5f7; color: black; padding: 20px; border-radius: 12px; text-align: center;">
                    <h3 style="margin-bottom: 4px;">iPad Pro</h3>
                    <p style="font-size: 12px; opacity: 0.7;">Thinpossible.</p>
                </div>
            </div>
        `
    },
    'https://google.com': {
        title: 'Google Search',
        url: 'https://google.com',
        content: `
            <div style="text-align: center; color: black; background: white; padding: 40px 10px; border-radius: 12px;">
                <h1 style="font-size: 42px; font-weight: 700; margin-bottom: 25px;"><span style="color: #4285F4">G</span><span style="color: #EA4335">o</span><span style="color: #FBBC05">o</span><span style="color: #4285F4">g</span><span style="color: #34A853">l</span><span style="color: #EA4335">e</span></h1>
                <div style="display: flex; border: 1px solid #dfe1e5; border-radius: 24px; padding: 8px 16px; margin-bottom: 20px; align-items: center; box-shadow: 0 1px 6px rgba(32,33,36,0.1);">
                    <input type="text" placeholder="Search Google or type a URL" style="border: none; outline: none; width: 100%; font-size: 14px;">
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button style="background: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 4px; padding: 8px 14px; font-size: 13px; cursor: pointer;">Google Search</button>
                    <button style="background: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 4px; padding: 8px 14px; font-size: 13px; cursor: pointer;">I'm Feeling Lucky</button>
                </div>
            </div>
        `
    },
    'https://github.com': {
        title: 'GitHub',
        url: 'https://github.com',
        content: `
            <div style="color: white; background: #0d1117; padding: 25px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <span style="font-size: 26px;">GitHub</span>
                </div>
                <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Where the world builds software</h2>
                <p style="font-size: 13px; opacity: 0.8; margin-bottom: 20px; line-height: 1.5;">Millions of developers and companies build, ship, and maintain their software on GitHub.</p>
                <div style="background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px;">
                    <h4 style="margin-bottom: 6px;">Trending Repository</h4>
                    <a href="#" style="color: #58a6ff; font-weight: 600; text-decoration: none; font-size: 14px;">antigravity / ios-simulator</a>
                    <p style="font-size: 12px; opacity: 0.7; margin-top: 4px;">Web simulator mimicking iPhone 16 features on any browser layout.</p>
                </div>
            </div>
        `
    },
    'https://wikipedia.org': {
        title: 'Wikipedia',
        url: 'https://wikipedia.org',
        content: `
            <div style="color: black; background: #f8f9fa; padding: 25px; border-radius: 12px; font-family: serif;">
                <h2 style="text-align: center; font-size: 28px; margin-bottom: 20px;">WIKIPEDIA</h2>
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px;"><strong>Wikipedia</strong> is a free-content online encyclopedia written and maintained by a community of volunteers, known as Wikipedians, through open collaboration.</p>
                <p style="font-size: 14px; line-height: 1.6;">It is the largest and most-read reference work in history. It is consistently ranked as one of the 10 most popular websites in the world.</p>
            </div>
        `
    }
};

function loadSafariUrl(url) {
    const addressInput = document.getElementById('safari-address');
    const homeScreen = document.getElementById('safari-home-screen');
    const iframeContainer = document.getElementById('safari-iframe-container');
    const websiteContent = document.getElementById('mock-website-content');
    const browserTitle = document.getElementById('mock-browser-text');
    
    // Clean URL input
    let cleanUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        cleanUrl = 'https://' + url;
    }
    
    // Add to history
    if (safariHistoryIndex === -1 || safariHistory[safariHistoryIndex] !== cleanUrl) {
        // truncate forward history if we were in the middle of a stack
        safariHistory = safariHistory.slice(0, safariHistoryIndex + 1);
        safariHistory.push(cleanUrl);
        safariHistoryIndex++;
    }
    
    // Update input display
    addressInput.value = cleanUrl.replace('https://', '').replace('http://', '');
    
    // Toggle screens
    homeScreen.classList.remove('active');
    iframeContainer.classList.add('active');
    
    // Lookup site in database, else render generic mock site
    const siteData = mockWebsites[cleanUrl] || {
        title: 'Web Page Preview',
        url: cleanUrl,
        content: `
            <div style="text-align: center; padding: 40px 10px;">
                <div style="font-size: 40px; margin-bottom: 10px;">🌐</div>
                <h3>Simulated Web Preview</h3>
                <p style="font-size: 13px; color: var(--label-tertiary); margin-top: 5px;">Navigating to ${cleanUrl}</p>
                <div style="margin-top: 30px; background: var(--bg-grouped-primary); padding: 20px; border-radius: 12px; text-align: left; border: 1px solid var(--separator);">
                    <h4 style="margin-bottom: 10px;">Connection Success</h4>
                    <p style="font-size: 12px; opacity: 0.8; line-height: 1.4;">External iframe embedding is blocked due to CORS header security requirements. This sandboxed browser container displays mock rendering logs for demonstration.</p>
                </div>
            </div>
        `
    };
    
    browserTitle.innerHTML = `Loaded Secure Connection: <strong>${siteData.title}</strong>`;
    websiteContent.innerHTML = siteData.content;
    
    updateSafariNavButtons();
}

function handleSafariGo() {
    const query = document.getElementById('safari-address').value.trim();
    if (!query) return;
    
    // Check if it's a domain/URL
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (domainRegex.test(query) || query.startsWith('http://') || query.startsWith('https://')) {
        loadSafariUrl(query);
    } else {
        // Search google mock instead
        loadSafariUrl('https://google.com');
    }
}

function safariHome() {
    document.getElementById('safari-iframe-container').classList.remove('active');
    document.getElementById('safari-home-screen').classList.add('active');
    document.getElementById('safari-address').value = 'Search or enter website';
    
    // Add to history
    safariHistory.push('home');
    safariHistoryIndex++;
    updateSafariNavButtons();
}

function safariBack() {
    if (safariHistoryIndex > 0) {
        safariHistoryIndex--;
        const previousTarget = safariHistory[safariHistoryIndex];
        
        if (previousTarget === 'home') {
            document.getElementById('safari-iframe-container').classList.remove('active');
            document.getElementById('safari-home-screen').classList.add('active');
            document.getElementById('safari-address').value = 'Search or enter website';
        } else {
            loadSafariUrl(previousTarget);
        }
        updateSafariNavButtons();
    }
}

function safariForward() {
    if (safariHistoryIndex < safariHistory.length - 1) {
        safariHistoryIndex++;
        const nextTarget = safariHistory[safariHistoryIndex];
        
        if (nextTarget === 'home') {
            document.getElementById('safari-iframe-container').classList.remove('active');
            document.getElementById('safari-home-screen').classList.add('active');
            document.getElementById('safari-address').value = 'Search or enter website';
        } else {
            loadSafariUrl(nextTarget);
        }
        updateSafariNavButtons();
    }
}

function refreshSafari() {
    if (safariHistoryIndex >= 0 && safariHistory[safariHistoryIndex] !== 'home') {
        loadSafariUrl(safariHistory[safariHistoryIndex]);
        triggerIslandAlert("🔄", "Refreshing Site...", "");
    }
}

function updateSafariNavButtons() {
    document.getElementById('safari-back').disabled = safariHistoryIndex <= 0;
    document.getElementById('safari-forward').disabled = safariHistoryIndex >= safariHistory.length - 1;
}

// ==========================================================================
// APP 5: SETTINGS LOGIC (THEMING & WALLPAPERS)
// ==========================================================================
function toggleDarkMode() {
    const isDark = document.getElementById('dark-mode-toggle').checked;
    
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        triggerIslandAlert("🌙", "Dark Mode Enabled", "");
    } else {
        document.documentElement.removeAttribute('data-theme');
        triggerIslandAlert("☀️", "Light Mode Enabled", "");
    }
}

const wallpapers = [
    { name: 'Default Blue Mesh', style: 'var(--wallpaper-default)' },
    { name: 'Midnight Slate', style: 'var(--wallpaper-dark)' },
    { name: 'Faded Pastel Neon', style: 'var(--wallpaper-neon)' },
    { name: 'Sunset Glow', style: 'var(--wallpaper-sunset)' }
];
let currentWallpaperIndex = 0;

function changeWallpaper() {
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapers.length;
    const selected = wallpapers[currentWallpaperIndex];
    
    document.querySelector('.iphone-screen').style.background = selected.style;
    document.querySelector('.iphone-screen').style.backgroundSize = 'cover';
    document.getElementById('current-wallpaper-name').textContent = selected.name;
    
    triggerIslandAlert("🖼", `Wallpaper changed to ${selected.name}`, "");
}

// ==========================================================================
// MUSIC WIDGET CONTROLLER (MUSIC APP SIMULATOR)
// ==========================================================================
const playlist = [
    { title: 'Get Lucky', artist: 'Daft Punk', art: '🎵' },
    { title: 'Blinding Lights', artist: 'The Weeknd', art: '🎧' },
    { title: 'Starboy', artist: 'The Weeknd', art: '✨' },
    { title: 'Instant Crush', artist: 'Daft Punk', art: '❤️' }
];
let currentTrackIndex = 0;
let isPlaying = false;

function toggleMusicWidget() {
    const widget = document.getElementById('music-widget');
    widget.classList.toggle('active');
    
    if (widget.classList.contains('active')) {
        // Notify island about active music player
        updateMusicWidgetDisplay();
    }
}

function updateMusicWidgetDisplay() {
    const track = playlist[currentTrackIndex];
    document.getElementById('music-title').textContent = track.title;
    document.getElementById('music-artist').textContent = track.artist;
    document.querySelector('.music-album-art').textContent = track.art;
}

function togglePlayMusic() {
    isPlaying = !isPlaying;
    const widget = document.getElementById('music-widget');
    const playBtn = document.getElementById('play-btn');
    
    if (isPlaying) {
        widget.classList.add('playing');
        playBtn.textContent = '⏸';
        const track = playlist[currentTrackIndex];
        triggerIslandAlert("🎶", `Playing: ${track.title}`, "Now", true);
    } else {
        widget.classList.remove('playing');
        playBtn.textContent = '▶';
        triggerIslandAlert("⏸", "Music Paused", "");
    }
}

function nextSong() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    updateMusicWidgetDisplay();
    if (isPlaying) {
        const track = playlist[currentTrackIndex];
        triggerIslandAlert("⏭", `Next: ${track.title}`, "", true);
    }
}

function prevSong() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    updateMusicWidgetDisplay();
    if (isPlaying) {
        const track = playlist[currentTrackIndex];
        triggerIslandAlert("⏮", `Prev: ${track.title}`, "", true);
    }
}
