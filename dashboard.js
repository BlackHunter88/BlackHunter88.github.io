// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Data management
function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Export data
function exportData(key) {
    const data = loadData(key);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${key}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Render generic list
function renderList(listId, dataKey, searchTerm = '') {
    const list = document.getElementById(listId);
    let data = loadData(dataKey);
    if (searchTerm) {
        data = data.filter(item => Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase())));
    }
    list.innerHTML = data.map((item, index) => `
        <li>
            <div>${Object.entries(item).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join('<br>')}<br><strong>Issued by:</strong> ${item.issuedBy || 'Unknown'}</div>
            <button class="delete-btn" onclick="deleteItem('${dataKey}', ${index}, '${listId}')"><i class="fas fa-trash"></i> Delete</button>
        </li>
    `).join('');
}

// Render roster by rank
function renderRoster(searchTerm = '') {
    const container = document.getElementById('rosterList');
    let data = loadData('roster');
    if (searchTerm) {
        data = data.filter(item => Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase())));
    }
    const ranks = ['Chief', 'Captain', 'Lieutenant', 'Sergeant', 'Officer', 'Recruit'];
    const grouped = ranks.reduce((acc, rank) => ({ ...acc, [rank]: [] }), {});
    data.forEach(item => {
        if (grouped[item.rank]) grouped[item.rank].push(item);
    });
    container.innerHTML = ranks.map(rank => {
        if (grouped[rank].length === 0) return '';
        return `
            <div class="group">
                <h3>${rank}</h3>
                <ul>
                    ${grouped[rank].map((item, index) => `
                        <li>
                            <div>${Object.entries(item).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join('<br>')}<br><strong>Issued by:</strong> ${item.issuedBy || 'Unknown'}</div>
                            <button class="delete-btn" onclick="deleteItem('roster', ${data.indexOf(item)}, 'rosterList')"><i class="fas fa-trash"></i> Delete</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }).join('');
}

// Delete item
function deleteItem(dataKey, index, listId) {
    const data = loadData(dataKey);
    data.splice(index, 1);
    saveData(dataKey, data);
    if (dataKey === 'roster') renderRoster();
    else renderList(listId, dataKey);
}

// Filter functions
function filterList(listId, searchTerm) {
    const dataKey = listId.replace('List', 's');
    renderList(listId, dataKey, searchTerm);
}

function filterRoster(searchTerm) {
    renderRoster(searchTerm);
}

// Penal Code Data (dinamis)
const defaultPenalCodes = [
    // SECTION 1 - Traffic Violations
  { id: 9999, code: 'TV', charge: 'SECTION 1 - Traffic Violations', jailtime: 0, fine: 0, bail: 0 },
  { id: 10000, code: 'PV', charge: 'SECTION 2 - Permit Violations', jailtime: 0, fine: 0, bail: 0 },
  { id: 10001, code: 'DO', charge: 'SECTION 3 - Drug Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10002, code: 'WO', charge: 'SECTION 4 - Weapon Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10003, code: 'VC', charge: 'SECTION 5 - Violent Crimes', jailtime: 0, fine: 0, bail: 0 },
  { id: 10004, code: 'SO', charge: 'SECTION 6 - Sexual Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10005, code: 'PO', charge: 'SECTION 7 - Public Order Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10006, code: 'GO', charge: 'SECTION 8 - Government Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10007, code: 'PR', charge: 'SECTION 9 - Property Offenses', jailtime: 0, fine: 0, bail: 0 },
  { id: 10008, code: 'AM', charge: 'SECTION 10 - Acknowledgement & Amendments', jailtime: 0, fine: 0, bail: 0 },
  { id: 10009, code: 'FC', charge: 'SECTION 11 - Fraud, Corruption & Tax Evasion', jailtime: 0, fine: 0, bail: 0 },
  { id: 10010, code: 'OC', charge: 'SECTION 12 - Organized Crime & Gang Activity', jailtime: 0, fine: 0, bail: 0 },
  { id: 10011, code: 'TT', charge: 'SECTION 13 - Terrorism & Treason', jailtime: 0, fine: 0, bail: 0 },
  { id: 10012, code: 'IA', charge: 'SECTION 14 - Internal Affairs', jailtime: 0, fine: 0, bail: 0 },
  { id: 10013, code: 'PS', charge: 'SECTION 15 - Public Safety & Emergency Response', jailtime: 0, fine: 0, bail: 0 },
  { id: 10014, code: 'IB', charge: 'SECTION 16 - Immigration & Border', jailtime: 0, fine: 0, bail: 0 },
  { id: 10015, code: 'TV2', charge: 'SECTION 17 - Traffic & Vehicular Crimes', jailtime: 0, fine: 0, bail: 0 },
  { id: 10016, code: 'FC2', charge: 'SECTION 18 - Financial & Commercial Crimes', jailtime: 0, fine: 0, bail: 0 },
  { id: 10017, code: 'CM', charge: 'SECTION 19 - Crimes Against Minors', jailtime: 0, fine: 0, bail: 0 },
  { id: 10018, code: 'HM', charge: 'SECTION 20 - Health & Medical', jailtime: 0, fine: 0, bail: 0 },
  { id: 10019, code: 'PL', charge: 'SECTION 21 - Property & Land', jailtime: 0, fine: 0, bail: 0 },
  { id: 10020, code: 'CM2', charge: 'SECTION 22 - Communication & Media', jailtime: 0, fine: 0, bail: 0 },
  { id: 10021, code: 'MN', charge: 'SECTION 23 - Military & National Security', jailtime: 0, fine: 0, bail: 0 },
  { id: 10022, code: 'RC', charge: 'SECTION 24 - Religious & Cultural Protection', jailtime: 0, fine: 0, bail: 0 },
  { id: 10023, code: 'DR', charge: 'SECTION 25 - Detective Rules', jailtime: 0, fine: 0, bail: 0 },
    { id: 1, code: 'TV-001', charge: 'Unregistered Vehicles', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 2, code: 'TV-002', charge: 'Illegal Modifications On Vehicles', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 3, code: 'TV-003', charge: 'Speeding', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 4, code: 'TV-004', charge: 'Maneuvering Vehicles with Suspended/Expired License', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 5, code: 'TV-005', charge: 'Failed or Refused to Pay Fine Ticket', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 6, code: 'TV-006A', charge: 'General Traffic Violation - Driving at Wrong Lane', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 7, code: 'TV-006B', charge: 'General Traffic Violation - Illegal U-turn', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 8, code: 'TV-006C', charge: 'General Traffic Violation - Blocking/Cutting Intersection', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 9, code: 'TV-006D', charge: 'General Traffic Violation - Driving on Pedestrian Walk', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 10, code: 'TV-006E', charge: 'General Traffic Violation - Excessive Use of Horn', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 11, code: 'TV-006F', charge: 'General Traffic Violation - Driving Through Safety Zone', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 12, code: 'TV-006G', charge: 'General Traffic Violation - Violating Safety Requirements (Helmet/Belt/Lights)', jailtime: 0, fine: 1000.00, bail: 2000.00 },
    { id: 13, code: 'TV-006H', charge: 'General Traffic Violation - Violating Safety on Heavy Vehicles', jailtime: 0, fine: 1000.00, bail: 2000.00 },

    // SECTION 2 - Permit Violations
    { id: 14, code: 'PV-002A', charge: 'No Firearms Permit', jailtime: 15, fine: 1000.00, bail: 2000.00 },
    { id: 15, code: 'PV-002C', charge: 'No Trucking License', jailtime: 15, fine: 1000.00, bail: 2000.00 },
    { id: 16, code: 'PV-002D', charge: 'No Lumberjack Permit', jailtime: 15, fine: 1000.00, bail: 2000.00 },

    // SECTION 3 - Drug Offenses
    { id: 17, code: 'DO-003A', charge: 'Possessing Marijuana (Small Amount)', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 18, code: 'DO-003B', charge: 'Possessing Marijuana (Large Amount)', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 19, code: 'DO-003C', charge: 'Possessing Cocaine/Crack (Small Amount)', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 20, code: 'DO-003D', charge: 'Possessing Cocaine/Crack (Large Amount)', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 21, code: 'DO-003F', charge: 'Selling or Distributing Illegal Drugs', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 22, code: 'DO-003G', charge: 'Drug Manufacturing', jailtime: 10, fine: 200.00, bail: 400.00 },
    { id: 23, code: 'DO-003H', charge: 'Being Present for Illegal Drug Use', jailtime: 10, fine: 200.00, bail: 400.00 },

    // SECTION 4 - Weapon Offenses
    { id: 24, code: 'WO-004A', charge: 'Possessing Sharp/Blunt Weapons', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 25, code: 'WO-004B', charge: 'Possessing Illegal Firearms', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 26, code: 'WO-004C', charge: 'Possessing Legal Firearms Without License', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 27, code: 'WO-004D', charge: 'Possessing Weapon Materials/Schematics', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 28, code: 'WO-004E', charge: 'Misusing Firearms License', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 29, code: 'WO-004F', charge: 'Brandishing a Firearm/Weapon', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 30, code: 'WO-004G', charge: 'Unlawful Discharge of Firearm/Weapon', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 31, code: 'WO-004I', charge: 'Weapon Trafficking', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 32, code: 'WO-004J', charge: 'Possessing Destructive Devices/Explosives', jailtime: 15, fine: 150.00, bail: 300.00 },

    // SECTION 5 - Violent Crimes
    { id: 33, code: 'VC-005A', charge: 'Intimidation', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 34, code: 'VC-005B', charge: 'Assault', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 35, code: 'VC-005C', charge: 'Assault with Deadly Weapons', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 36, code: 'VC-005F', charge: 'Attempted Murder', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 37, code: 'VC-005G', charge: 'Murdering', jailtime: 70, fine: 12000.00, bail: 24000.00 },
    { id: 38, code: 'VC-005I', charge: 'Drive-By Shooting', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 39, code: 'VC-005H', charge: 'Group Criminal Assault', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 40, code: 'VC-005J', charge: 'Melee Robbery', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 41, code: 'VC-005K', charge: 'Armed Robbery', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 42, code: 'VC-005L', charge: 'Piracy', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 43, code: 'VC-005M', charge: 'Grand Theft', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 44, code: 'VC-005O', charge: 'Grand Theft of Firearms', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 45, code: 'VC-005Q', charge: 'Kidnapping', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 46, code: 'VC-005R', charge: 'Hostage Taking', jailtime: 10, fine: 100.00, bail: 200.00 },
    { id: 47, code: 'VC-005U', charge: 'Human Trafficking', jailtime: 10, fine: 100.00, bail: 200.00 },

    // SECTION 6 - Sexual Offenses
    { id: 48, code: 'SO-006B', charge: 'Rape', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 49, code: 'SO-006D', charge: 'Prostitution', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 50, code: 'SO-006A', charge: 'Sexual Harassment', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 51, code: 'SO-006F', charge: 'Being Naked in Public', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 52, code: 'SO-006G', charge: 'Performing Sexual Action in Public', jailtime: 15, fine: 150.00, bail: 300.00 },

    // SECTION 7 - Public Order Offenses
    { id: 53, code: 'PO-007A', charge: 'Initiating a Riot', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 54, code: 'PO-007C', charge: 'Participating in a Riot', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 55, code: 'PO-007G', charge: 'Vilification', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 56, code: 'PO-007F', charge: 'Drunk in Public Space', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 57, code: 'PO-007J', charge: 'Disturbing Public Peace', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 58, code: 'PO-007K', charge: 'Brawl in Public Space', jailtime: 10, fine: 250.00, bail: 500.00 },
    { id: 59, code: 'PO-007P', charge: 'Stalking', jailtime: 10, fine: 250.00, bail: 500.00 },

    // SECTION 8 - Government Offenses
    { id: 60, code: 'GO-008A', charge: 'Obstruction of Justice', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 61, code: 'GO-008B', charge: 'Abusing Government Hotline', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 62, code: 'GO-008E', charge: 'Attempting to Bribe Public Officials', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 63, code: 'GO-008D', charge: 'Impersonating Government Staff', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 64, code: 'GO-008J', charge: 'Assaulting LEO', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 65, code: 'GO-008K', charge: 'Attempted Murdering a Public Official', jailtime: 30, fine: 5000.00, bail: 10000.00 },
    { id: 66, code: 'GO-008L', charge: 'Murdering a Public Official', jailtime: 75, fine: 20000.00, bail: 40000.00 },

    // SECTION 9 - Property Offenses
    { id: 67, code: 'PR-009C', charge: 'Vandalism', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 68, code: 'PR-009F', charge: 'Using Property for Illegal Distribution', jailtime: 15, fine: 150.00, bail: 300.00 },
    { id: 69, code: 'PR-009B', charge: 'Trespassing Government Property', jailtime: 15, fine: 150.00, bail: 300.00 },

    // SECTION 10 - Acknowledgement & Amendments
    { id: 70, code: 'AM-010A', charge: 'Failure to Comply with New Law Amendments', jailtime: 12, fine: 300.00, bail: 600.00 },
    { id: 71, code: 'AM-010B', charge: 'Misuse of Legal Loopholes', jailtime: 18, fine: 500.00, bail: 1000.00 },
    { id: 72, code: 'AM-010C', charge: 'Tampering with Official Records', jailtime: 30, fine: 10000.00, bail: 20000.00 },
    { id: 73, code: 'AM-010D', charge: 'Falsification of Public Documents', jailtime: 48, fine: 10500.00, bail: 21000.00 },
    { id: 74, code: 'AM-010E', charge: 'Unauthorized Legal Representation', jailtime: 24, fine: 8000.00, bail: 16000.00 },
    { id: 75, code: 'AM-010F', charge: 'Misrepresentation of Law in Public', jailtime: 12, fine: 5000.00, bail: 10000.00 },
    { id: 76, code: 'AM-010G', charge: 'Failure to Report Legal Amendments', jailtime: 18, fine: 6000.00, bail: 12000.00 },
    { id: 77, code: 'AM-010H', charge: 'Distribution of Outdated/Forged Legal Documents', jailtime: 36, fine: 10200.00, bail: 20400.00 },

    // SECTION 11 - Fraud, Corruption & Tax Evasion
    { id: 78, code: 'FC-011A', charge: 'Fraud', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 79, code: 'FC-011B', charge: 'Money Laundering', jailtime: 48, fine: 5000.00, bail: 10000.00 },
    { id: 80, code: 'FC-011C', charge: 'Tax Evasion', jailtime: 36, fine: 2000.00, bail: 4000.00 },
    { id: 81, code: 'FC-011D', charge: 'Corruption (Public Official)', jailtime: 75, fine: 4000.00, bail: 8000.00 },
    { id: 82, code: 'FC-011E', charge: 'Embezzlement', jailtime: 60, fine: 3000.00, bail: 6000.00 },
    { id: 83, code: 'FC-011F', charge: 'Corporate Fraud', jailtime: 48, fine: 15000.00, bail: 30000.00 },
    { id: 84, code: 'FC-011G', charge: 'Securities Fraud / Insider Trading', jailtime: 72, fine: 13500.00, bail: 27000.00 },
    { id: 85, code: 'FC-011H', charge: 'Political Corruption & Power Abuse', jailtime: 90, fine: 15000.00, bail: 30000.00 },

    // SECTION 12 - Organized Crime & Gang Activity
    { id: 86, code: 'OC-012A', charge: 'Racketeering', jailtime: 48, fine: 7000.00, bail: 14000.00 },
    { id: 87, code: 'OC-012B', charge: 'Gang Conspiracy', jailtime: 36, fine: 7500.00, bail: 15000.00 },
    { id: 88, code: 'OC-012C', charge: 'Arms Trafficking', jailtime: 60, fine: 5500.00, bail: 11000.00 },
    { id: 89, code: 'OC-012D', charge: 'Drug Cartel Operations', jailtime: 60, fine: 5000.00, bail: 10000.00 },
    { id: 90, code: 'OC-012E', charge: 'Illegal Gambling House', jailtime: 24, fine: 5200.00, bail: 10400.00 },
    { id: 91, code: 'OC-012F', charge: 'Extortion by Gang', jailtime: 48, fine: 5000.00, bail: 10000.00 },
    { id: 92, code: 'OC-012G', charge: 'Gang Warfare in Public', jailtime: 30, fine: 8000.00, bail: 16000.00 },
    { id: 93, code: 'OC-012H', charge: 'Organized Assassination Contract', jailtime: 60, fine: 5000.00, bail: 10000.00 },

    // SECTION 13 - Terrorism & Treason
    { id: 94, code: 'TT-013A', charge: 'Terrorist Attack', jailtime: 90, fine: 15000.00, bail: 30000.00 },
    { id: 95, code: 'TT-013B', charge: 'Treason Against the State', jailtime: 90, fine: 17500.00, bail: 35000.00 },
    { id: 96, code: 'TT-013C', charge: 'Sabotage of Infrastructure', jailtime: 60, fine: 13000.00, bail: 26000.00 },
    { id: 97, code: 'TT-013D', charge: 'Financing Terrorism', jailtime: 75, fine: 14000.00, bail: 28000.00 },
    { id: 98, code: 'TT-013E', charge: 'Recruitment for Terror Group', jailtime: 48, fine: 12500.00, bail: 25000.00 },
    { id: 99, code: 'TT-013F', charge: 'Harboring Terrorists', jailtime: 60, fine: 13000.00, bail: 26000.00 },
    { id: 100, code: 'TT-013G', charge: 'Propaganda for Terrorism', jailtime: 48, fine: 12000.00, bail: 24000.00 },
    { id: 101, code: 'TT-013H', charge: 'Illegal Possession of Explosives', jailtime: 90, fine: 15000.00, bail: 30000.00 },

    // SECTION 14 - Internal Affairs
    { id: 102, code: 'IA-027A', charge: 'Officer Abuse of Power (Illegal Stop & Search)', jailtime: 24, fine: 2000.00, bail: 4000.00 },
    { id: 103, code: 'IA-027B', charge: 'Accepting Bribes While on Duty', jailtime: 75, fine: 5000.00, bail: 10000.00 },
    { id: 104, code: 'IA-027C', charge: 'Excessive Use of Force Against Civilians', jailtime: 60, fine: 3500.00, bail: 7000.00 },
    { id: 105, code: 'IA-027D', charge: 'Failure to Report Criminal Activity by Officers', jailtime: 36, fine: 2500.00, bail: 5000.00 },
    { id: 106, code: 'IA-027E', charge: 'Collusion with Criminal Organizations', jailtime: 90, fine: 7000.00, bail: 14000.00 },
    { id: 107, code: 'IA-027F', charge: 'Tampering with Bodycam/Dashcam Footage', jailtime: 72, fine: 4500.00, bail: 9000.00 },
    { id: 108, code: 'IA-027G', charge: 'Illegal Use of SAPD Equipment', jailtime: 48, fine: 3000.00, bail: 6000.00 },
    { id: 109, code: 'IA-027H', charge: 'Officer Caught Lying in Investigation', jailtime: 60, fine: 4000.00, bail: 8000.00 },
    { id: 110, code: 'IA-027I', charge: 'SAPD Officer Leaking Classified Data', jailtime: 75, fine: 5500.00, bail: 11000.00 },
    { id: 111, code: 'IA-027J', charge: 'Officer Harassment or Discrimination', jailtime: 24, fine: 2000.00, bail: 4000.00 },
    { id: 112, code: 'IA-027K', charge: 'Officer Involved in Illegal Gambling/Drug Use', jailtime: 60, fine: 3500.00, bail: 7000.00 },
    { id: 113, code: 'IA-027L', charge: 'Failure to Follow Internal Affairs Summons', jailtime: 18, fine: 1500.00, bail: 3000.00 },
    { id: 114, code: 'IA-027M', charge: 'Destruction or Tampering of Evidence', jailtime: 90, fine: 6000.00, bail: 12000.00 },
    { id: 115, code: 'IA-027N', charge: 'Obstructing an Internal Affairs Investigation', jailtime: 48, fine: 3000.00, bail: 6000.00 },
    { id: 116, code: 'IA-027O', charge: 'Use of Unauthorized Deadly Force in Pursuit', jailtime: 72, fine: 5000.00, bail: 10000.00 },
    { id: 117, code: 'IA-027P', charge: 'Officer Involvement in Corruption Rings', jailtime: 90, fine: 7500.00, bail: 15000.00 },
    { id: 118, code: 'IA-027Q', charge: 'Failure to Report Excessive Force by Officers', jailtime: 30, fine: 2500.00, bail: 5000.00 },
    { id: 119, code: 'IA-027R', charge: 'Officer Misuse of Warrant Authority', jailtime: 60, fine: 4500.00, bail: 9000.00 },

    // SECTION 15 - Public Safety & Emergency Response
    { id: 120, code: 'PS-015A', charge: 'False Emergency Call', jailtime: 12, fine: 500.00, bail: 1000.00 },
    { id: 121, code: 'PS-015B', charge: 'Obstructing Emergency Services', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 122, code: 'PS-015C', charge: 'Impersonating Police or Medic', jailtime: 24, fine: 1200.00, bail: 2400.00 },
    { id: 123, code: 'PS-015D', charge: 'Tampering with Safety Equipment', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 124, code: 'PS-015E', charge: 'Sabotaging 911 Network', jailtime: 60, fine: 3000.00, bail: 6000.00 },
    { id: 125, code: 'PS-015F', charge: 'Blocking Fire Truck/Ambulance', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 126, code: 'PS-015G', charge: 'False Report of Bomb/Terror Threat', jailtime: 48, fine: 2500.00, bail: 5000.00 },
    { id: 127, code: 'PS-015H', charge: 'Emergency Response Fraud', jailtime: 36, fine: 2000.00, bail: 4000.00 },

    // SECTION 16 - Immigration & Border
    { id: 128, code: 'IB-016A', charge: 'Illegal Immigration', jailtime: 12, fine: 800.00, bail: 1600.00 },
    { id: 129, code: 'IB-016B', charge: 'Human Smuggling', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 130, code: 'IB-016C', charge: 'Forged Immigration Papers', jailtime: 24, fine: 1200.00, bail: 2400.00 },
    { id: 131, code: 'IB-016D', charge: 'Harboring Illegal Immigrants', jailtime: 18, fine: 1000.00, bail: 2000.00 },
    { id: 132, code: 'IB-016E', charge: 'Border Contraband Smuggling', jailtime: 48, fine: 2000.00, bail: 4000.00 },

    // SECTION 17 - Traffic & Vehicular Crimes
    { id: 133, code: 'TV-017A', charge: 'Reckless Driving', jailtime: 12, fine: 500.00, bail: 1000.00 },
    { id: 134, code: 'TV-017B', charge: 'Street Racing', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 135, code: 'TV-017C', charge: 'Driving Without License', jailtime: 18, fine: 600.00, bail: 1200.00 },
    { id: 136, code: 'TV-017D', charge: 'Driving Under Influence (DUI)', jailtime: 36, fine: 1200.00, bail: 2400.00 },
    { id: 137, code: 'TV-017E', charge: 'Hit and Run', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 138, code: 'TV-017F', charge: 'Illegal Vehicle Modification', jailtime: 24, fine: 800.00, bail: 1600.00 },
    { id: 139, code: 'TV-017G', charge: 'Vehicle Theft', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 140, code: 'TV-017H', charge: 'Using Vehicle for Criminal Act', jailtime: 72, fine: 3000.00, bail: 6000.00 },

    // SECTION 18 - Financial & Commercial Crimes
    { id: 141, code: 'FC-018A', charge: 'Illegal Banking', jailtime: 36, fine: 2000.00, bail: 4000.00 },
    { id: 142, code: 'FC-018B', charge: 'Counterfeit Currency', jailtime: 60, fine: 3000.00, bail: 6000.00 },
    { id: 143, code: 'FC-018C', charge: 'Credit Card Fraud', jailtime: 30, fine: 1200.00, bail: 2400.00 },
    { id: 144, code: 'FC-018D', charge: 'Illegal Loan Sharking', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 145, code: 'FC-018E', charge: 'Insurance Fraud', jailtime: 48, fine: 1800.00, bail: 3600.00 },
    { id: 146, code: 'FC-018F', charge: 'Unregistered Business Operations', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 147, code: 'FC-018G', charge: 'Market Price Fixing / Cartel', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 148, code: 'FC-018H', charge: 'Illegal Foreign Exchange', jailtime: 48, fine: 2000.00, bail: 4000.00 },

    // SECTION 19 - Crimes Against Minors
    { id: 149, code: 'CM-019A', charge: 'Child Abuse', jailtime: 72, fine: 3000.00, bail: 6000.00 },
    { id: 150, code: 'CM-019B', charge: 'Child Trafficking', jailtime: 90, fine: 5000.00, bail: 10000.00 },
    { id: 151, code: 'CM-019C', charge: 'Child Neglect', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 152, code: 'CM-019D', charge: 'Using Minors for Criminal Activity', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 153, code: 'CM-019E', charge: 'Minor Endangerment', jailtime: 30, fine: 1200.00, bail: 2400.00 },
    { id: 154, code: 'CM-019F', charge: 'Child Pornography Possession', jailtime: 90, fine: 4000.00, bail: 8000.00 },
    { id: 155, code: 'CM-019G', charge: 'Online Exploitation of Minors', jailtime: 72, fine: 3500.00, bail: 7000.00 },
    { id: 156, code: 'CM-019H', charge: 'Sale of Alcohol/Drugs to Minors', jailtime: 48, fine: 2000.00, bail: 4000.00 },

    // SECTION 20 - Health & Medical
    { id: 157, code: 'HM-020A', charge: 'Illegal Medical Practice', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 158, code: 'HM-020B', charge: 'Selling Unlicensed Medication', jailtime: 36, fine: 1200.00, bail: 2400.00 },
    { id: 159, code: 'HM-020C', charge: 'Medical Insurance Fraud', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 160, code: 'HM-020D', charge: 'Organ Trafficking', jailtime: 90, fine: 5000.00, bail: 10000.00 },
    { id: 161, code: 'HM-020E', charge: 'Unauthorized Clinic Operation', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 162, code: 'HM-020F', charge: 'Neglect by Medical Staff', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 163, code: 'HM-020G', charge: 'Tampering with Medical Records', jailtime: 30, fine: 1000.00, bail: 2000.00 },
    { id: 164, code: 'HM-020H', charge: 'Selling Expired Drugs', jailtime: 18, fine: 800.00, bail: 1600.00 },

    // SECTION 21 - Property & Land
    { id: 165, code: 'PL-021A', charge: 'Illegal Land Occupation', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 166, code: 'PL-021B', charge: 'Land Fraud (Fake Ownership)', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 167, code: 'PL-021C', charge: 'Illegal Real Estate Transaction', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 168, code: 'PL-021D', charge: 'Trespassing Private Property', jailtime: 12, fine: 600.00, bail: 1200.00 },
    { id: 169, code: 'PL-021E', charge: 'Destruction of Private Property', jailtime: 30, fine: 1200.00, bail: 2400.00 },
    { id: 170, code: 'PL-021F', charge: 'Illegal Construction', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 171, code: 'PL-021G', charge: 'Illegal Land Mining or Extraction', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 172, code: 'PL-021H', charge: 'Property Extortion', jailtime: 72, fine: 3000.00, bail: 6000.00 },

    // SECTION 22 - Communication & Media
    { id: 173, code: 'CM-022A', charge: 'Illegal Radio Broadcasting', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 174, code: 'CM-022B', charge: 'Spreading False Information', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 175, code: 'CM-022C', charge: 'Hate Speech Through Media', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 176, code: 'CM-022D', charge: 'Unauthorized Wiretapping', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 177, code: 'CM-022E', charge: 'Propaganda to Incite Violence', jailtime: 72, fine: 3500.00, bail: 7000.00 },
    { id: 178, code: 'CM-022F', charge: 'Media Blackmail', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 179, code: 'CM-022G', charge: 'Broadcasting Classified Info', jailtime: 90, fine: 4000.00, bail: 8000.00 },
    { id: 180, code: 'CM-022H', charge: 'Defamation Through Media', jailtime: 36, fine: 1500.00, bail: 3000.00 },

    // SECTION 23 - Military & National Security
    { id: 181, code: 'MN-023A', charge: 'Desertion from Military Duty', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 182, code: 'MN-023B', charge: 'Unauthorized Use of Military Equipment', jailtime: 72, fine: 3500.00, bail: 7000.00 },
    { id: 183, code: 'MN-023C', charge: 'Illegal Sale of Military Secrets', jailtime: 90, fine: 5000.00, bail: 10000.00 },
    { id: 184, code: 'MN-023D', charge: 'Unauthorized Paramilitary Group', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 185, code: 'MN-023E', charge: 'Illegal Weapon Testing', jailtime: 60, fine: 3000.00, bail: 6000.00 },
    { id: 186, code: 'MN-023F', charge: 'Civilian Access to Restricted Zones', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 187, code: 'MN-023G', charge: 'Sabotage of Military Facilities', jailtime: 90, fine: 4000.00, bail: 8000.00 },
    { id: 188, code: 'MN-023H', charge: 'Unauthorized Military Uniform Use', jailtime: 24, fine: 1200.00, bail: 2400.00 },

    // SECTION 24 - Religious & Cultural Protection
    { id: 189, code: 'RC-024A', charge: 'Desecration of Religious Site', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 190, code: 'RC-024B', charge: 'Illegal Religious Extortion', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 191, code: 'RC-024C', charge: 'Religious Hate Speech', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 192, code: 'RC-024D', charge: 'Illegal Cult Formation', jailtime: 72, fine: 3000.00, bail: 6000.00 },
    { id: 193, code: 'RC-024E', charge: 'Use of Religion to Justify Crime', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 194, code: 'RC-024F', charge: 'Theft from Religious Institutions', jailtime: 36, fine: 1800.00, bail: 3600.00 },
    { id: 195, code: 'RC-024G', charge: 'Illegal Artifact Trafficking', jailtime: 72, fine: 3000.00, bail: 6000.00 },
    { id: 196, code: 'RC-024H', charge: 'Religious Fraud', jailtime: 24, fine: 1200.00, bail: 2400.00 },

    // SECTION 25 - Detective Rules
    { id: 197, code: 'DR-026A', charge: 'Detective Failure to Maintain Confidentiality', jailtime: 12, fine: 500.00, bail: 1000.00 },
    { id: 198, code: 'DR-026B', charge: 'Detective Accepting Bribes', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 199, code: 'DR-026C', charge: 'Detective Failure to Provide Evidence', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 200, code: 'DR-026D', charge: 'Detective Abuse of Authority', jailtime: 30, fine: 1200.00, bail: 2400.00 },
    { id: 201, code: 'DR-026E', charge: 'Detective Failure to Follow Surveillance Protocol', jailtime: 12, fine: 700.00, bail: 1400.00 },
    { id: 202, code: 'DR-026F', charge: 'Detective Leaking Investigation Data', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 203, code: 'DR-026G', charge: 'Detective Failure to Cooperate with SAPD', jailtime: 12, fine: 600.00, bail: 1200.00 },
    { id: 204, code: 'DR-026H', charge: 'Detective Using Illegal Equipment', jailtime: 24, fine: 1200.00, bail: 2400.00 },
    { id: 205, code: 'DR-026I', charge: 'Detective Tampering with Evidence', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 206, code: 'DR-026J', charge: 'Detective Failure to Respect Suspect Rights', jailtime: 12, fine: 700.00, bail: 1400.00 },
    { id: 207, code: 'DR-026K', charge: 'Detective Misleading Court Testimony', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 208, code: 'DR-026L', charge: 'Detective Failure to Protect Informants', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 209, code: 'DR-026M', charge: 'Detective Sharing Classified Info to Public', jailtime: 36, fine: 1500.00, bail: 3000.00 },
    { id: 210, code: 'DR-026N', charge: 'Detective Failure to Follow Command Structure', jailtime: 12, fine: 600.00, bail: 1200.00 },
    { id: 211, code: 'DR-026O', charge: 'Detective Fabricating Case Files', jailtime: 48, fine: 2000.00, bail: 4000.00 },
    { id: 212, code: 'DR-026P', charge: 'Detective Failure to Maintain Professionalism', jailtime: 12, fine: 500.00, bail: 1000.00 },
    { id: 213, code: 'DR-026Q', charge: 'Detective Interfering with Court Decisions', jailtime: 24, fine: 1200.00, bail: 2400.00 },
    { id: 214, code: 'DR-026R', charge: 'Detective Failure to Report Evidence to HQ', jailtime: 18, fine: 800.00, bail: 1600.00 },
    { id: 215, code: 'DR-026S', charge: 'Detective Cooperating with Criminals', jailtime: 60, fine: 2500.00, bail: 5000.00 },
    { id: 216, code: 'DR-026T', charge: 'Detective Failure to Respect Chain of Custody', jailtime: 24, fine: 1000.00, bail: 2000.00 },
    { id: 217, code: 'DR-026U', charge: 'Detective Destroying Evidence Intentionally', jailtime: 75, fine: 3000.00, bail: 6000.00 }
];

function renderPenalTable(searchTerm = '') {
    const tbody = document.getElementById('penalList');
    let filteredCodes = [...defaultPenalCodes, ...loadData('customPenalCodes')];
    if (searchTerm) {
        filteredCodes = filteredCodes.filter(code => 
            code.charge.toLowerCase().includes(searchTerm.toLowerCase()) || 
            code.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    tbody.innerHTML = filteredCodes.map((code, index) => `
        <tr>
            <td>${code.id}</td>
            <td>${code.charge} (${code.code})</td>
            <td>${code.jailtime} days</td>
            <td>$${code.fine.toFixed(2)}</td>
            <td>$${code.bail.toFixed(2)}</td>
            <td>
                <button class="${selectedCharges.some(c => c.code === code.code) ? 'selected' : ''}" onclick="toggleCharge('${code.code}', ${code.jailtime}, ${code.fine}, ${code.bail})">
                    ${selectedCharges.some(c => c.code === code.code) ? 'Remove' : 'Add'}
                </button>
            </td>
        </tr>
    `).join('');
    updateTotals();
}

let selectedCharges = [];

function toggleCharge(code, jailtime, fine, bail) {
    const index = selectedCharges.findIndex(c => c.code === code);
    if (index === -1) {
        selectedCharges.push({ code, jailtime, fine, bail });
    } else {
        selectedCharges.splice(index, 1);
    }
    updateTotals();
    generateCommand();
    renderPenalTable(document.getElementById('penalSearch').value);
}

function updateTotals() {
    const totalJailtime = selectedCharges.reduce((sum, c) => sum + c.jailtime, 0);
    const totalFine = selectedCharges.reduce((sum, c) => sum + c.fine, 0);
    const totalBail = selectedCharges.reduce((sum, c) => sum + c.bail, 0);
    document.getElementById('totalJailtime').textContent = totalJailtime;
    document.getElementById('totalFine').textContent = `$${totalFine.toFixed(2)}`;
    document.getElementById('totalBail').textContent = `$${totalBail.toFixed(2)}`;
}

function generateCommand() {
    const playerId = document.getElementById('playerId').value || '0';
    const totalJailtime = selectedCharges.reduce((sum, c) => sum + c.jailtime, 0);
    const totalFine = selectedCharges.reduce((sum, c) => sum + c.fine, 0);
    const totalBail = selectedCharges.reduce((sum, c) => sum + c.bail, 0);
    const codes = selectedCharges.map(c => c.code).join(' ');
    document.getElementById('generatedCommand').value = `/arrest ${playerId} ${totalJailtime} ${totalFine} `;
}

function handleCodeInput() {
    const input = document.getElementById('codeInput').value.trim().split(' ').filter(c => c);
    selectedCharges = input.map(code => {
        const allCodes = [...defaultPenalCodes, ...loadData('customPenalCodes')];
        const charge = allCodes.find(c => c.code === code);
        return charge ? { code: charge.code, jailtime: charge.jailtime, fine: charge.fine, bail: charge.bail } : null;
    }).filter(c => c);
    updateTotals();
    generateCommand();
    renderPenalTable(document.getElementById('penalSearch').value);
}

// Toggle accordion
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('active');
}

// Handbook import
function importTenCodes() {
    const fileInput = document.getElementById('tenCodeImport');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            saveData('tenCodes', [...loadData('tenCodes'), ...data]);
            renderList('tenList', 'tenCodes');
        };
        reader.readAsText(file);
    }
    fileInput.value = '';
}

function importFTPItems() {
    const fileInput = document.getElementById('ftpImport');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            saveData('ftpItems', [...loadData('ftpItems'), ...data]);
            renderList('ftpList', 'ftpItems');
        };
        reader.readAsText(file);
    }
    fileInput.value = '';
}

// Landing stats
function updateLandingStats() {
    document.getElementById('totalArrests').textContent = loadData('arrests').length;
    document.getElementById('totalCases').textContent = loadData('cases').length;
    document.getElementById('totalWanted').textContent = loadData('wanteds').length;
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('totalLogsToday').textContent = loadData('logs').filter(log => log.logDate === today).length;
}

// Form submissions with issuedBy
const username = localStorage.getItem('username') || 'Unknown';

document.getElementById('arrestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { suspectName: e.target.suspectName.value, crime: e.target.crime.value, issueDate: e.target.issueDate.value, description: e.target.description.value, issuedBy: username };
    saveData('arrests', [...loadData('arrests'), data]);
    renderList('arrestList', 'arrests');
    e.target.reset();
});

document.getElementById('rosterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!e.target.rank.value) return alert('Select a rank!');
    const data = { officerName: e.target.officerName.value, badgeNumber: e.target.badgeNumber.value, rank: e.target.rank.value, issuedBy: username };
    saveData('roster', [...loadData('roster'), data]);
    renderRoster();
    e.target.reset();
});

document.getElementById('caseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { caseTitle: e.target.caseTitle.value, suspects: e.target.suspects.value, caseDate: e.target.caseDate.value, caseDetails: e.target.caseDetails.value, charges: e.target.charges.value, issuedBy: username };
    saveData('cases', [...loadData('cases'), data]);
    renderList('caseList', 'cases');
    e.target.reset();
});

document.getElementById('wantedForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { wantedName: e.target.wantedName.value, wantedLevel: e.target.wantedLevel.value, wantedReason: e.target.wantedReason.value, lastSeen: e.target.lastSeen.value, issuedBy: username };
    saveData('wanteds', [...loadData('wanteds'), data]);
    renderList('wantedList', 'wanteds');
    e.target.reset();
});

document.getElementById('logForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { logDate: e.target.logDate.value, logOfficer: e.target.logOfficer.value, logLocation: e.target.logLocation.value, logDescription: e.target.logDescription.value, issuedBy: username };
    saveData('logs', [...loadData('logs'), data]);
    renderList('logList', 'logs');
    e.target.reset();
});

document.getElementById('chargeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { chargeName: e.target.chargeName.value, chargeCode: e.target.chargeCode.value, chargeDescription: e.target.chargeDescription.value, penalty: e.target.penalty.value, issuedBy: username };
    saveData('charges', [...loadData('charges'), data]);
    renderList('chargeList', 'charges');
    e.target.reset();
});

document.getElementById('evidenceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { evidenceId: e.target.evidenceId.value, caseRef: e.target.caseRef.value, evidenceDetails: e.target.evidenceDetails.value, storageLocation: e.target.storageLocation.value, issuedBy: username };
    saveData('evidence', [...loadData('evidence'), data]);
    renderList('evidenceList', 'evidence');
    e.target.reset();
});

document.getElementById('incidentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { incidentDate: e.target.incidentDate.value, incidentLocation: e.target.incidentLocation.value, incidentOfficer: e.target.incidentOfficer.value, incidentDetails: e.target.incidentDetails.value, issuedBy: username };
    saveData('incidents', [...loadData('incidents'), data]);
    renderList('incidentList', 'incidents');
    e.target.reset();
});

document.getElementById('detectiveForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { openCase: e.target.openCase.value, primeSuspect: e.target.primeSuspect.value, confidentialNotes: e.target.confidentialNotes.value, leadOfficer: e.target.leadOfficer.value, issuedBy: username };
    saveData('detectives', [...loadData('detectives'), data]);
    renderList('detectiveList', 'detectives');
    e.target.reset();
});

document.getElementById('tenCodeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { tenCode: e.target.tenCode.value, tenDescription: e.target.tenDescription.value, issuedBy: username };
    saveData('tenCodes', [...loadData('tenCodes'), data]);
    renderList('tenList', 'tenCodes');
    e.target.reset();
});

document.getElementById('ftpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { ftpStep: e.target.ftpStep.value, ftpDescription: e.target.ftpDescription.value, issuedBy: username };
    saveData('ftpItems', [...loadData('ftpItems'), data]);
    renderList('ftpList', 'ftpItems');
    e.target.reset();
});

document.getElementById('impoundForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = { vehicleModel: e.target.vehicleModel.value, plateNumber: e.target.plateNumber.value, impoundReason: e.target.impoundReason.value, impoundDate: e.target.impoundDate.value, impoundOfficer: e.target.impoundOfficer.value, issuedBy: username };
    saveData('impounds', [...loadData('impounds'), data]);
    renderList('impoundList', 'impounds');
    e.target.reset();
});

// Penal event listeners
document.getElementById('penalSearch').addEventListener('input', (e) => renderPenalTable(e.target.value));
document.getElementById('codeInput').addEventListener('input', handleCodeInput);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') document.getElementById('penalSearch').focus();
    if (e.ctrlKey && e.key === 's') document.getElementById('playerId').focus();
});

// Initial renders
updateLandingStats();
renderList('arrestList', 'arrests');
renderRoster();
renderList('caseList', 'cases');
renderList('wantedList', 'wanteds');
renderList('logList', 'logs');
renderList('chargeList', 'charges');
renderList('evidenceList', 'evidence');
renderList('incidentList', 'incidents');
renderList('detectiveList', 'detectives');
renderPenalTable();
renderList('tenList', 'tenCodes');
renderList('ftpList', 'ftpItems');
renderList('impoundList', 'impounds');

// Username display
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username') || 'Guest';
    document.getElementById('usernameDisplay').textContent = `Logged in as: ${username}`;
});

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}