// ============ STATE ============
let currentUser = null;

// ============ BARE ACTS DATABASE ============
let bare_acts_db = [
  {
    id: 'cpa2019',
    title: 'Consumer Protection Act, 2019',
    shortTitle: 'Consumer Protection Act',
    cat: 'Consumer Complaints',
    year: '2019',
    type: 'Central Act',
    summary: 'Protects consumers from unfair trade practices, defective products, and poor services.',
    keyRights: [
      'Right to refund for defective products or poor services',
      'Right to information about product quality & price',
      'Right to file complaint up to ₹1 Crore at District Commission',
      'Right to compensation for mental agony & harassment',
    ],
    objective: 'An Act to provide for protection of the interests of consumers.',
    chapters: [{
      title: 'Chapter IV: Consumer Disputes Redressal Commission',
      sections: [{
        id: 'cpa_s34', num: 'Section 34',
        title: 'Jurisdiction of the District Commission',
        text: 'Section 34 gives the District Commission the jurisdiction to entertain complaints where the value of the goods or services paid as consideration does not exceed one crore rupees.',
        penalty: 'N/A - Jurisdictional Provision.',
        remedy: 'Allows consumers to file complaints at the local District Commission.',
        complaintTemplate: `TO,\nTHE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION,\n\nSUBJECT: Consumer Complaint under Section 34 & 35 of the Consumer Protection Act, 2019.\n\n1. STATEMENT OF JURISDICTION:\n- The value of goods/services is INR [Value], within the pecuniary limit of Rs. 1 Crore under Section 34.\n\n2. FACTS OF THE COMPLAINT:\n- On [Date], I purchased/availed [Product/Service] from the Respondent.\n- [Describe what went wrong]\n\n3. PRAYER / RELIEF:\n- Direction to the Respondent to replace/refund.\n- Compensation for mental distress.`
      }]
    }]
  },
  {
    id: 'ipc1860',
    title: 'Indian Penal Code, 1860',
    shortTitle: 'Indian Penal Code (IPC)',
    cat: 'Criminal Matters',
    year: '1860',
    type: 'Central Act',
    summary: 'India\'s main criminal law covering cheating, fraud, breach of trust, and many other offences.',
    keyRights: [
      'Right to file FIR for cheating and fraud (Section 420)',
      'Right to action for criminal breach of trust (Section 406)',
      'Right to complain to Judicial Magistrate if police refuse FIR',
    ],
    objective: 'The official criminal code of India.',
    chapters: [{
      title: 'Chapter XVII: Of Offences Against Property',
      sections: [{
        id: 'ipc_s415', num: 'Section 415 / 420',
        title: 'Cheating & Dishonestly Inducing Delivery of Property',
        text: 'Section 420: Whoever cheats and thereby dishonestly induces the person deceived to deliver any property... shall be punished with imprisonment up to seven years, and fine.',
        penalty: 'Imprisonment up to 7 years + Fine.',
        remedy: 'Filing an FIR at the local Police Station or private criminal complaint under Section 200 CrPC.',
        complaintTemplate: `TO,\nTHE OFFICER-IN-CHARGE / SHO,\n[Police Station Name],\n\nSUBJECT: Criminal Complaint / FIR Request for Cheating under Section 420 IPC.\n\n1. COMPLAINANT DETAILS:\n[Your Name, Address, Phone]\n\n2. ACCUSED DETAILS:\n[Accused Name / Company]\n\n3. STATEMENT OF FACTS:\n- On [Date], the Accused cheated me of INR [Amount].\n\n4. REQUEST:\n- Register an FIR under Section 420 IPC.`
      }]
    }]
  },
  {
    id: 'it2000',
    title: 'Information Technology Act, 2000',
    shortTitle: 'IT Act (Cyber Law)',
    cat: 'Cyber Crime & Online Fraud',
    year: '2000',
    type: 'Central Act',
    summary: 'India\'s primary cyber law covering online fraud, hacking, identity theft, and cyber harassment.',
    keyRights: [
      'Right to complain for online financial fraud (Section 66D)',
      'Right to action against hacking and data theft (Section 66)',
      'Right to report cyber harassment & stalking (Section 67)',
    ],
    objective: 'An Act to provide legal recognition for electronic transactions and prevent cyber crimes.',
    chapters: [{
      title: 'Chapter XI: Offences',
      sections: [{
        id: 'it_s66d', num: 'Section 66D',
        title: 'Punishment for Cheating by Personation using Computer Resource',
        text: 'Whoever cheats by personation using computer resource, shall be punished with imprisonment up to three years and fine up to one lakh rupees.',
        penalty: 'Imprisonment up to 3 years + Fine up to Rs. 1,00,000.',
        remedy: 'Filing a complaint at the Cyber Police Station or cybercrime.gov.in.',
        complaintTemplate: `TO,\nTHE IN-CHARGE, CYBER CRIME CELL,\n\nSUBJECT: Complaint regarding online fraud under Section 66D IT Act, 2000.\n\n1. COMPLAINANT DETAILS:\n[Your Name, Mobile, Address]\n\n2. DESCRIPTION:\n- On [Date], I was defrauded online of INR [Amount].\n\n3. REQUEST:\n- Register cyber crime complaint and freeze fraudster's account.`
      }]
    }]
  },
  {
    id: 'pw1936',
    title: 'Payment of Wages Act, 1936',
    shortTitle: 'Payment of Wages Act',
    cat: 'Employment & Labour Disputes',
    year: '1936',
    type: 'Central Act',
    summary: 'Ensures timely payment of wages to employees.',
    keyRights: [
      'Right to receive wages within 7–10 days of wage period',
      'Right to claim compensation 10× the unlawful deduction',
    ],
    objective: 'An Act to regulate the payment of wages.',
    chapters: [{
      title: 'Chapter II: Responsibilities for Payment of Wages',
      sections: [{
        id: 'pw_s4', num: 'Section 4 / 15',
        title: 'Time of Payment of Wages',
        text: 'Section 15: Where any deduction has been made from wages illegally, the person may make an application to the Authority.',
        penalty: 'Employer liable to pay compensation of 10 times the unlawful deduction.',
        remedy: 'File before the Payment of Wages Authority within 12 months.',
        complaintTemplate: `TO,\nTHE PAYMENT OF WAGES AUTHORITY,\n\nSUBJECT: Application under Section 15, Payment of Wages Act, 1936.\n\n1. APPLICANT: [Your Name]\n2. RESPONDENT: [Employer Name]\n3. FACTS: Wages of Rs. [Amount] unpaid for [Month(s)].\n4. RELIEF: Recovery of unpaid wages + compensation.`
      }]
    }]
  },
  {
    id: 'hma1955',
    title: 'Hindu Marriage Act, 1955',
    shortTitle: 'Hindu Marriage Act',
    cat: 'Family & Divorce Matters',
    year: '1955',
    type: 'Central Act',
    summary: 'Governs marriage, divorce, child custody, alimony for Hindus, Buddhists, Jains, and Sikhs.',
    keyRights: [
      'Right to file for divorce by mutual consent (Section 13B)',
      'Right to claim monthly maintenance (Section 24)',
      'Right to permanent alimony and child custody (Section 25 & 26)',
    ],
    objective: 'An Act to codify the law relating to marriage among Hindus.',
    chapters: [{
      title: 'Chapter III: Divorce',
      sections: [{
        id: 'hma_s13b', num: 'Section 13B',
        title: 'Divorce by Mutual Consent',
        text: 'A petition for dissolution of marriage may be presented by both parties together on the ground that they have been living separately for one year or more.',
        penalty: 'N/A', remedy: 'Filing a joint petition for mutual consent divorce.',
        complaintTemplate: `TO,\nTHE FAMILY COURT,\n\nSUBJECT: Joint Petition under Section 13B, Hindu Marriage Act, 1955.\n\n1. PETITIONER 1: [Name]\n2. PETITIONER 2: [Name]\n3. FACTS: Living separately since [Date].\n4. RELIEF: Dissolution of marriage by mutual consent.`
      }]
    }]
  },
  {
    id: 'tpa1882',
    title: 'Transfer of Property Act, 1882',
    shortTitle: 'Transfer of Property Act',
    cat: 'Property & Land Disputes',
    year: '1882',
    type: 'Central Act',
    summary: 'Regulates transfer of immovable property — sale, lease, mortgage, gift, exchange.',
    keyRights: ['Right to legal title upon registration (Section 54)', 'Right to notice prior to lease termination (Section 106)'],
    objective: 'An Act relating to the transfer of property by act of parties.',
    chapters: [{
      title: 'Chapter V: Of Leases',
      sections: [{
        id: 'tpa_s106', num: 'Section 106',
        title: 'Duration of leases in absence of written contract',
        text: 'A lease of immovable property for non-agricultural purposes shall be month-to-month, terminable by 15 days\' notice.',
        penalty: 'N/A', remedy: 'Sending a 15-day notice to quit.',
        complaintTemplate: `TO,\n[Tenant Name],\n\nSUBJECT: Legal Notice under Section 106, Transfer of Property Act, 1882.\n\nYour tenancy is terminated. Vacate within 15 days.`
      }]
    }]
  },
  {
    id: 'nia1881',
    title: 'Negotiable Instruments Act, 1881',
    shortTitle: 'Negotiable Instruments Act',
    cat: 'Cheque Bounce Cases',
    year: '1881',
    type: 'Central Act',
    summary: 'Section 138 establishes criminal liability for cheque bounce due to insufficient funds.',
    keyRights: ['Right to file criminal complaint for cheque bounce (Section 138)', 'Right to claim double cheque value'],
    objective: 'An Act relating to Promissory Notes, Bills of Exchange and Cheques.',
    chapters: [{
      title: 'Chapter XVII: Penalties for Dishonour',
      sections: [{
        id: 'nia_s138', num: 'Section 138',
        title: 'Dishonour of cheque for insufficiency of funds',
        text: 'Whoever\'s cheque is returned unpaid shall be punished with imprisonment up to two years, or fine up to double the cheque amount.',
        penalty: 'Imprisonment up to 2 years / Fine up to double.',
        remedy: 'Send statutory notice within 30 days; file case within 30 days after 15-day window.',
        complaintTemplate: `TO,\nTHE METROPOLITAN MAGISTRATE,\n\nSUBJECT: Complaint under Section 138, NI Act, 1881.\n\n1. COMPLAINANT: [Your Name]\n2. ACCUSED: [Drawer Name]\n3. FACTS: Cheque No. [Number] for INR [Amount] bounced.\n4. PRAYER: Punish accused and award double cheque amount.`
      }]
    }]
  },
  {
    id: 'ipa1932',
    title: 'Indian Partnership Act, 1932',
    shortTitle: 'Partnership Act',
    cat: 'Corporate & Business Disputes',
    year: '1932',
    type: 'Central Act',
    summary: 'Defines partnership firms, rights of partners, and dissolution procedures.',
    keyRights: ['Right to dissolve partnership via court (Section 44)', 'Right to share profits equally'],
    objective: 'An Act relating to partnership.',
    chapters: [{
      title: 'Chapter VI: Dissolution',
      sections: [{
        id: 'ipa_s44', num: 'Section 44',
        title: 'Dissolution by the Court',
        text: 'Court may dissolve a firm on grounds including unsound mind, breach of agreement, etc.',
        penalty: 'N/A', remedy: 'Filing a dissolution suit.',
        complaintTemplate: `TO,\nTHE COMMERCIAL COURT,\n\nSUBJECT: Suit for Dissolution under Section 44, Partnership Act, 1932.\n\n1. COMPLAINANT: [Your Name]\n2. RESPONDENTS: [Co-Partners]\n3. RELIEF: Dissolve the firm and distribute assets.`
      }]
    }]
  },
  {
    id: 'ica1872',
    title: 'Indian Contract Act, 1872',
    shortTitle: 'Contract Act',
    cat: 'Contract Drafting & Review',
    year: '1872',
    type: 'Central Act',
    summary: 'Codifies rules of contracts — consent, consideration, enforceability, breach damages.',
    keyRights: ['Right to enforce valid agreements (Section 10)', 'Right to claim damages for breach (Section 73)'],
    objective: 'An Act relating to contracts.',
    chapters: [{
      title: 'Chapter VI: Consequences of Breach',
      sections: [{
        id: 'ica_s73', num: 'Section 73',
        title: 'Compensation for breach of contract',
        text: 'The party suffering breach is entitled to compensation for loss arising in the usual course from such breach.',
        penalty: 'N/A - Civil damages.', remedy: 'Filing a civil suit for breach.',
        complaintTemplate: `TO,\nTHE CIVIL COURT,\n\nSUBJECT: Suit for Damages under Section 73, Indian Contract Act, 1872.\n\n1. COMPLAINANT: [Name]\n2. RESPONDENT: [Name]\n3. FACTS: Contract breached on [Date], causing loss of INR [Amount].\n4. RELIEF: Decree for damages.`
      }]
    }]
  },
  {
    id: 'cpc1908_o37',
    title: 'Code of Civil Procedure, 1908 (Summary Suit)',
    shortTitle: 'CPC Summary Suit',
    cat: 'Money Recovery Cases',
    year: '1908',
    type: 'Central Act',
    summary: 'Order 37 provides summary recovery for written debt claims.',
    keyRights: ['Right to file Summary Suit for rapid debt recovery', 'Right to immediate decree if no defense in 10 days'],
    objective: 'Laws relating to Civil Court procedure.',
    chapters: [{
      title: 'Order XXXVII: Summary Procedure',
      sections: [{
        id: 'cpc_o37_r1', num: 'Order 37 Rule 1 & 2',
        title: 'Summary suits upon bills of exchange',
        text: 'Suits for recovery of debt from written contracts may be filed as summary suits.',
        penalty: 'N/A', remedy: 'File summary suit; defendant must appear in 10 days.',
        complaintTemplate: `TO,\nTHE CIVIL COURT,\n\nSUBJECT: Summary Suit under Order XXXVII CPC for recovery of INR [Amount].\n\n1. PLAINTIFF: [Name]\n2. DEFENDANT: [Name]\n3. PRAYER: Decree for INR [Amount] with interest.`
      }]
    }]
  },
  {
    id: 'cpc1908_s80',
    title: 'Code of Civil Procedure, 1908 (Legal Notice)',
    shortTitle: 'CPC Section 80 Notice',
    cat: 'Legal Notices',
    year: '1908',
    type: 'Central Act',
    summary: 'Section 80 mandates 2-month prior notice before suit against Government.',
    keyRights: ['Right to file suit post 2-month notice period'],
    objective: 'Civil Court procedure.',
    chapters: [{
      title: 'Part IV: Suits in Particular Cases',
      sections: [{
        id: 'cpc_s80', num: 'Section 80',
        title: 'Notice before suit against government',
        text: 'No suit shall be instituted against Government until 2 months after notice in writing.',
        penalty: 'Suit dismissal if no notice.', remedy: 'Dispatch statutory 2-month notice.',
        complaintTemplate: `TO,\nTHE SECRETARY / DISTRICT COLLECTOR,\n\nSUBJECT: Notice under Section 80 CPC regarding [Dispute].\n\nTake notice that my client intends to file suit. If no resolution in 2 months, suit will be filed.`
      }]
    }]
  },
  {
    id: 'ra1908',
    title: 'Registration Act, 1908',
    shortTitle: 'Registration Act',
    cat: 'Documentation & Registration',
    year: '1908',
    type: 'Central Act',
    summary: 'Section 17 mandates registration for property transfers.',
    keyRights: ['Right to register property deeds (Section 17)', 'Unregistered deeds inadmissible in court'],
    objective: 'An Act relating to Registration of Documents.',
    chapters: [{
      title: 'Part III: Registerable Documents',
      sections: [{
        id: 'ra_s17', num: 'Section 17',
        title: 'Documents requiring compulsory registration',
        text: 'Instruments creating rights in immovable property shall be registered.',
        penalty: 'Unregistered deeds inadmissible (Section 49).', remedy: 'Register before Sub-Registrar within 4 months.',
        complaintTemplate: `TO,\nTHE SUB-REGISTRAR,\n\nSUBJECT: Application for Registration of Deed.\n\n1. EXECUTANT: [Name]\n2. CLAIMANT: [Name]\n3. PROPERTY: [Details]\n4. REQUEST: Register the enclosed deed.`
      }]
    }]
  },
  {
    id: 'aca1996',
    title: 'Arbitration and Conciliation Act, 1996',
    shortTitle: 'Arbitration Act',
    cat: 'Arbitration & Mediation',
    year: '1996',
    type: 'Central Act',
    summary: 'Legal framework for domestic arbitration and conciliation proceedings.',
    keyRights: ['Right to refer disputes to arbitration (Section 8)', 'Right to enforce arbitral awards (Section 36)'],
    objective: 'An Act relating to arbitration.',
    chapters: [{
      title: 'Part I: Arbitration',
      sections: [{
        id: 'aca_s8', num: 'Section 8',
        title: 'Power to refer parties to arbitration',
        text: 'A judicial authority shall refer parties to arbitration if an arbitration agreement exists.',
        penalty: 'N/A', remedy: 'Filing application under Section 8.',
        complaintTemplate: `TO,\nTHE CIVIL COURT,\n\nSUBJECT: Application under Section 8, Arbitration Act, 1996.\n\n1. APPLICANT: [Name]\n2. RESPONDENT: [Name]\n3. SUBMISSIONS: Dispute subject to arbitration clause.\n4. PRAYER: Refer to arbitration.`
      }]
    }]
  },
  {
    id: 'sra1963',
    title: 'Specific Relief Act, 1963',
    shortTitle: 'Specific Relief Act',
    cat: 'Civil Litigation',
    year: '1963',
    type: 'Central Act',
    summary: 'Provides specific remedies for enforcing civil rights including recovery of possession and injunctions.',
    keyRights: ['Right to recover possession (Section 6)', 'Right to seek injunctions (Section 38)'],
    objective: 'An Act to define the law relating to specific relief.',
    chapters: [{
      title: 'Chapter I: Recovering Possession',
      sections: [{
        id: 'sra_s6', num: 'Section 6',
        title: 'Suit by person dispossessed',
        text: 'If any person is dispossessed of immovable property without consent, he may recover possession by suit.',
        penalty: 'N/A', remedy: 'Filing a summary suit within 6 months.',
        complaintTemplate: `TO,\nTHE CIVIL COURT,\n\nSUBJECT: Plaint under Section 6, Specific Relief Act, 1963.\n\n1. COMPLAINANT: [Name]\n2. RESPONDENT: [Name]\n3. FACTS: Property at [Address] forcibly taken on [Date].\n4. RELIEF: Recovery of possession.`
      }]
    }]
  },
  {
    id: 'coi1950',
    title: 'Constitution of India (Writ Jurisdiction)',
    shortTitle: 'Constitution of India',
    cat: 'Other Legal Matters',
    year: '1950',
    type: 'Central Act',
    summary: 'Article 226 gives High Courts writ jurisdiction to protect fundamental and legal rights.',
    keyRights: ['Right to petition High Court (Article 226)', 'Right to seek writs like Mandamus, Certiorari, Habeas Corpus'],
    objective: 'The supreme law of India.',
    chapters: [{
      title: 'Part VI: The High Courts',
      sections: [{
        id: 'coi_a226', num: 'Article 226',
        title: 'Power of High Courts to issue writs',
        text: 'Every High Court shall have power to issue writs including habeas corpus, mandamus, prohibition, quo warranto and certiorari.',
        penalty: 'Contempt of Court for non-compliance.', remedy: 'Filing a Writ Petition before the High Court.',
        complaintTemplate: `TO,\nTHE HON'BLE HIGH COURT,\n\nSUBJECT: Writ Petition under Article 226.\n\n1. PETITIONER: [Name]\n2. RESPONDENT: [Authority]\n3. FACTS: Arbitrary government action.\n4. PRAYER: Issue Writ of Mandamus.`
      }]
    }]
  }
];

// ============ ISSUE KEYWORD MAP ============
const ISSUE_KEYWORD_MAP = [
  { id: 'product-not-delivered', keywords: ['product not delivered','order not received','delivery not arrived','not delivered','item not received'], category: 'Consumer Complaints', categoryIcon: '🛒', acts: ['Consumer Protection Act, 2019 – Section 34'], authority: 'District Consumer Commission', docs: ['Invoice','Payment Receipt','Order Confirmation','Delivery Screenshot'], actId: 'cpa2019', summary: 'Consumer complaint — seller failed to deliver goods.' },
  { id: 'online-scam', keywords: ['scammed online','fraud online','fake website','online cheating','upi fraud','online scam'], category: 'Cyber Crime & Online Fraud', categoryIcon: '💻', acts: ['IT Act, 2000 – Section 66D','IPC Section 420'], authority: 'Cyber Crime Cell / cybercrime.gov.in', docs: ['Screenshots','Bank/UPI proof','Fraudster URL'], actId: 'it2000', summary: 'Cyber crime — file on cybercrime.gov.in to freeze fraudster\'s account.' },
  { id: 'bank-hack', keywords: ['bank account hacked','unauthorized transaction','otp fraud','banking fraud','phishing','money debited'], category: 'Cyber Crime & Online Fraud', categoryIcon: '💻', acts: ['IT Act, 2000 – Section 66C','RBI Banking Ombudsman'], authority: 'Cyber Crime Cell + RBI Ombudsman', docs: ['Bank statement','Fraud SMS screenshot','FIR copy'], actId: 'it2000', summary: 'Banking fraud under IT Act. Report to bank immediately.' },
  { id: 'salary-unpaid', keywords: ['salary not paid','wages unpaid','salary delayed','unpaid wages','salary withheld'], category: 'Employment & Labour Disputes', categoryIcon: '👷', acts: ['Payment of Wages Act, 1936 – Section 15'], authority: 'District Labour Commissioner', docs: ['Appointment letter','Salary slips','Bank statement'], actId: 'pw1936', summary: 'Unpaid wages — claim 10× compensation before Labour Commissioner.' },
  { id: 'defective-product', keywords: ['defective product','broken product','product not working','faulty goods','damaged item'], category: 'Consumer Complaints', categoryIcon: '🛒', acts: ['Consumer Protection Act, 2019 – Section 34'], authority: 'District Consumer Commission', docs: ['Invoice','Photos of defect','Warranty card'], actId: 'cpa2019', summary: 'Defective product — claim refund and compensation at Consumer Commission.' },
  { id: 'property-dispute', keywords: ['property dispute','land dispute','encroachment','boundary dispute','illegal possession'], category: 'Property & Land Disputes', categoryIcon: '🏠', acts: ['Transfer of Property Act, 1882','Specific Relief Act, 1963'], authority: 'Civil Court / Revenue Court', docs: ['Title deed','Survey records','Photos'], actId: 'tpa1882', summary: 'Property dispute — civil matter handled by civil courts.' },
  { id: 'family-matter', keywords: ['divorce','maintenance','child custody','alimony','marriage dispute','separation'], category: 'Family & Divorce Matters', categoryIcon: '👨‍👩‍👧', acts: ['Hindu Marriage Act, 1955','CrPC Section 125'], authority: 'Family Court', docs: ['Marriage certificate','Birth certificates','Income proof'], actId: 'hma1955', summary: 'Family disputes handled by Family Court. Legal aid available.' },
  { id: 'refund-denied', keywords: ['refund not given','refund rejected','money not returned','return rejected'], category: 'Consumer Complaints', categoryIcon: '🛒', acts: ['Consumer Protection Act, 2019 – Section 2(47)'], authority: 'District Consumer Commission', docs: ['Purchase invoice','Refund request screenshots','Payment proof'], actId: 'cpa2019', summary: 'Refusing valid refund is unfair trade practice.' },
  { id: 'service-deficiency', keywords: ['poor service','service not provided','contractor cheated','builder fraud','subscription fraud'], category: 'Consumer Complaints', categoryIcon: '🛒', acts: ['Consumer Protection Act, 2019 – Section 2(11)'], authority: 'District Consumer Commission', docs: ['Service agreement','Payment receipts','Evidence'], actId: 'cpa2019', summary: 'Service deficiency — file for refund and compensation.' }
];

// ============ LEGAL GUIDES DATABASE ============
const LEGAL_GUIDES_DB = [
  { id: 'online-shopping', title: 'Online Shopping Fraud', icon: '🛒', color: '#E67E22', tag: 'Consumer Protection', what: 'Product not delivered or defective from online purchase.', law: 'Consumer Protection Act, 2019 — Section 34.', rights: ['Right to refund','Right to compensation','Right to file at District Commission'], where: 'District Consumer Commission', docs: ['Invoice','Payment proof','Order status screenshot'], resolution: '3–5 months', actId: 'cpa2019' },
  { id: 'salary-unpaid', title: 'Salary Not Paid', icon: '💰', color: '#27AE60', tag: 'Employment Rights', what: 'Employer not paying salary.', law: 'Payment of Wages Act, 1936 — Section 15.', rights: ['Right to wages within 7–10 days','Right to 10× compensation'], where: 'District Labour Commissioner', docs: ['Appointment letter','Salary slips','Bank statement'], resolution: '2–4 months', actId: 'pw1936' },
  { id: 'bank-fraud', title: 'Bank / UPI Fraud', icon: '🏦', color: '#2980B9', tag: 'Cyber Law', what: 'Unauthorized bank transaction.', law: 'IT Act, 2000 — Section 66C/66D.', rights: ['Zero liability if reported in 3 days','Right to FIR','Right to RBI Ombudsman'], where: 'Bank → cybercrime.gov.in → Cyber Cell → RBI Ombudsman', docs: ['Bank statement','Fraud SMS','Complaint to bank'], resolution: '7–30 days bank reversal', actId: 'it2000' }
];

// ============ DAILY QUOTE ============
let dailyQuote = {
  text: "Justice delayed is justice denied. Every citizen has the right to be heard.",
  author: "Adv. Rajesh Kumar Sharma",
  date: "Today's Legal Insight"
};

// ============ PAGE ROUTING ============
function showPage(page) {
  if (page === 'home') page = 'index';
  window.location.href = page + '.html';
}

function updateNavHighlight() {
  const path = window.location.pathname;
  let page = 'home';
  if (path.includes('find-your-law.html')) page = 'find-your-law';
  if (path.includes('about.html')) page = 'about';
  if (path.includes('complaint.html')) page = 'complaint';
  if (path.includes('signup.html') || path.includes('login.html')) page = '';
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
  const map = { 'home': 'nav-home', 'find-your-law': 'nav-findlaw', 'about': 'nav-about', 'complaint': 'nav-complaint' };
  if (map[page]) document.getElementById(map[page])?.classList.add('active-link');
}

function requireAuth(targetPage) {
  if (currentUser || getToken()) { showPage(targetPage); }
  else { sessionStorage.setItem('authRedirect', targetPage); showPage('login'); }
}

// ============ AUTH ============
(function initAuth() {
  currentUser = typeof getStoredUser === 'function' ? getStoredUser() : null;
})();

async function handleSignup() {
  const fname = document.getElementById('signup-fname').value.trim();
  const lname = document.getElementById('signup-lname').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const phone = document.getElementById('signup-phone').value.trim();
  const city = document.getElementById('signup-city').value.trim();
  const pass = document.getElementById('signup-pass').value;
  const pass2 = document.getElementById('signup-pass2').value;
  const btn = document.getElementById('signup-btn');
  document.getElementById('signup-error').style.display = 'none';
  document.getElementById('signup-success').style.display = 'none';

  if (!fname || !lname || !email || !phone || !city || !pass) { showAlert('signup-error', 'All fields are required.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showAlert('signup-error', 'Invalid email.'); return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { showAlert('signup-error', 'Invalid 10-digit mobile.'); return; }
  if (pass.length < 8) { showAlert('signup-error', 'Password must be 8+ characters.'); return; }
  if (pass !== pass2) { showAlert('signup-error', 'Passwords do not match.'); return; }

  if (btn) { btn.disabled = true; btn.textContent = 'Creating account...'; }

  try {
    const data = await api.register({ fname, lname, email, phone, city, password: pass });
    showAlert('signup-success', 'Account created! Signing you in...');
    setTimeout(() => { loginUser(data.user, data.token); }, 800);
  } catch (error) {
    showAlert('signup-error', error.message || 'Registration failed.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Create My Account →'; }
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass = document.getElementById('login-pass').value;
  const btn = document.getElementById('login-btn');
  document.getElementById('login-error').style.display = 'none';
  if (!email || !pass) { showAlert('login-error', 'Enter email and password.'); return; }

  if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

  try {
    const data = await api.login({ email, password: pass });
    loginUser(data.user, data.token);
  } catch (error) {
    showAlert('login-error', error.message || 'Invalid email or password.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In →'; }
  }
}

function loginUser(user, token) {
  currentUser = user;
  if (token) setAuth(token, user);
  const redirect = sessionStorage.getItem('authRedirect') || 'home';
  sessionStorage.removeItem('authRedirect');
  showPage(redirect);
}

function signOut() {
  currentUser = null;
  if (typeof clearAuth === 'function') clearAuth();
  showPage('home');
}

function updateNavForUser() {
  if (currentUser) {
    const userSection = document.getElementById('nav-user-section');
    if (userSection) userSection.style.display = 'flex';
    const userName = document.getElementById('nav-user-name');
    if (userName) userName.textContent = currentUser.fname + ' ' + currentUser.lname;
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.style.display = 'flex';
      if (currentUser.role !== 'admin' && !document.getElementById('nav-my-complaints')) {
        const a = document.createElement('a');
        a.href = 'my-complaints.html'; a.id = 'nav-my-complaints'; a.textContent = 'My Complaints';
        const cta = navLinks.querySelector('.nav-cta');
        if (cta) navLinks.insertBefore(a, cta); else navLinks.appendChild(a);
      }
      if (currentUser.role === 'admin' && !document.getElementById('nav-admin-panel')) {
        const a = document.createElement('a');
        a.href = 'admin.html'; a.id = 'nav-admin-panel'; a.textContent = 'Admin Panel';
        a.className = 'nav-cta'; a.style.background = 'var(--gold)'; a.style.marginRight = '10px';
        const cta = navLinks.querySelector('.nav-cta');
        if (cta) navLinks.insertBefore(a, cta); else navLinks.appendChild(a);
      }
    }
  }
}

function showAlert(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

// ============ ISSUE FINDER ============
function analyzeIssue(query) {
  if (!query || query.trim().length < 3) return null;
  const lq = query.toLowerCase().trim();
  let best = null, bestScore = 0;
  ISSUE_KEYWORD_MAP.forEach(entry => {
    let score = 0;
    entry.keywords.forEach(kw => { if (lq.includes(kw)) score += kw.length; });
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  if (!best) {
    ISSUE_KEYWORD_MAP.forEach(entry => {
      entry.keywords.forEach(kw => {
        kw.split(' ').forEach(word => { if (word.length > 3 && lq.includes(word) && !best) best = entry; });
      });
    });
  }
  return best;
}

// ============ COMPLAINT WIZARD (4-STEP) ============
let wizardData = {
  category: '', issueDescription: '', against: '', files: [],
  name: '', phone: '', email: '', city: '', state: '', date: '',
  applicableLaws: null, draftText: ''
};

const WIZARD_CATEGORIES = [
  { id: 'Civil Litigation', icon: '⚖️', label: 'Civil Litigation', desc: 'Civil suits, injunctions, and disputes' },
  { id: 'Criminal Matters', icon: '🔒', label: 'Criminal Matters', desc: 'FIR, bail, cheating, fraud, criminal proceedings' },
  { id: 'Cyber Crime & Online Fraud', icon: '💻', label: 'Cyber Crime & Online Fraud', desc: 'Online scams, UPI fraud, identity theft' },
  { id: 'Consumer Complaints', icon: '🛒', label: 'Consumer Complaints', desc: 'Defective products, service deficiency' },
  { id: 'Family & Divorce Matters', icon: '👨‍👩‍👧', label: 'Family & Divorce', desc: 'Divorce, maintenance, child custody' },
  { id: 'Property & Land Disputes', icon: '🏠', label: 'Property & Land', desc: 'Encroachment, boundary, tenancy disputes' },
  { id: 'Cheque Bounce Cases', icon: '📝', label: 'Cheque Bounce', desc: 'Dishonoured cheques under Section 138' },
  { id: 'Employment & Labour Disputes', icon: '👷', label: 'Employment & Labour', desc: 'Wrongful termination, unpaid wages' },
  { id: 'Corporate & Business Disputes', icon: '🏢', label: 'Corporate & Business', desc: 'Partnership, shareholder conflicts' },
  { id: 'Contract Drafting & Review', icon: '📄', label: 'Contract Drafting', desc: 'Agreements, MOUs, business contracts' },
  { id: 'Money Recovery Cases', icon: '💰', label: 'Money Recovery', desc: 'Recovery of loans, dues, deposits' },
  { id: 'Legal Notices', icon: '📬', label: 'Legal Notices', desc: 'Drafting legal notices to parties' },
  { id: 'Documentation & Registration', icon: '🗂️', label: 'Documentation', desc: 'Affidavits, deeds, registration' },
  { id: 'Arbitration & Mediation', icon: '🤝', label: 'Arbitration', desc: 'Alternative dispute resolution' },
  { id: 'Other Legal Matters', icon: '🔍', label: 'Other Matters', desc: 'Any other legal concerns' }
];

function initComplaintWizard() {
  const preCategory = sessionStorage.getItem('wizard_category');
  if (preCategory) wizardData.category = preCategory;
  renderWizardStep1();
  if (currentUser) {
    wizardData.name = currentUser.fname + ' ' + currentUser.lname;
    wizardData.phone = currentUser.phone || '';
    wizardData.email = currentUser.email || '';
    wizardData.city = currentUser.city || '';
    const nameEl = document.getElementById('w-name'); if (nameEl) nameEl.value = wizardData.name;
    const phoneEl = document.getElementById('w-phone'); if (phoneEl) phoneEl.value = wizardData.phone;
    const emailEl = document.getElementById('w-email'); if (emailEl) emailEl.value = wizardData.email;
    const cityEl = document.getElementById('w-city'); if (cityEl) cityEl.value = wizardData.city;
  }
  goToStep(1);
}

function renderWizardStep1() {
  const grid = document.getElementById('wizard-category-grid');
  if (!grid) return;
  grid.innerHTML = WIZARD_CATEGORIES.map(cat => `
    <div class="wizard-cat-card ${wizardData.category === cat.id ? 'selected' : ''}"
         id="wcat-${cat.id.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '')}"
         onclick="selectWizardCategory('${cat.id}')">
      <div class="wcat-icon">${cat.icon}</div>
      <div class="wcat-label">${cat.label}</div>
      <div class="wcat-desc">${cat.desc}</div>
    </div>
  `).join('');
}

function selectWizardCategory(categoryId) {
  wizardData.category = categoryId;
  document.querySelectorAll('.wizard-cat-card').forEach(c => c.classList.remove('selected'));
  const id = 'wcat-' + categoryId.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '');
  const el = document.getElementById(id);
  if (el) el.classList.add('selected');
}

// ── Updated 4-Step Wizard Navigation ──
function wizardNext(fromStep) {
  if (fromStep === 1) {
    if (!wizardData.category) { showToast('Please select a service category.', 'error'); return; }
    updateStep2Prompts();
    goToStep(2);
  } else if (fromStep === 2) {
    const desc = (document.getElementById('w-issue-desc')?.value || '').trim();
    const against = (document.getElementById('w-against')?.value || '').trim();
    const date = document.getElementById('w-date')?.value || '';
    if (desc.length < 30) { showToast('Please describe your issue in at least 30 characters.', 'error'); return; }
    if (!against) { showToast('Please fill in who you are filing against.', 'error'); return; }
    if (!date) { showToast('Please provide the date of incident.', 'error'); return; }
    wizardData.issueDescription = desc;
    wizardData.against = against;
    wizardData.date = date;
    goToStep(3);
  } else if (fromStep === 3) {
    const name = (document.getElementById('w-name')?.value || '').trim();
    const phone = (document.getElementById('w-phone')?.value || '').trim();
    const email = (document.getElementById('w-email')?.value || '').trim();
    const city = (document.getElementById('w-city')?.value || '').trim();
    const state = document.getElementById('w-state')?.value || '';
    if (!name || !phone || !email || !city || !state) { showToast('Please fill in all personal details.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email.', 'error'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { showToast('Please enter a valid 10-digit mobile.', 'error'); return; }
    wizardData.name = name; wizardData.phone = phone;
    wizardData.email = email; wizardData.city = city; wizardData.state = state;
    // Skip straight to review (step 4) — no laws/draft step for user
    renderFinalReview();
    goToStep(4);
  }
}

function updateStep2Prompts() {
  const promptEl = document.getElementById('w-desc-prompt');
  const prompts = {
    'Civil Litigation': 'Describe the civil dispute — nature, when it arose, and relief sought.',
    'Criminal Matters': 'Detail the offence (cheating, assault, fraud), accused names, and dates.',
    'Cyber Crime & Online Fraud': 'Describe the online scam, UPI fraud, or hacking. When? How much lost?',
    'Consumer Complaints': 'What did you buy? Where? What went wrong? What did the seller do?',
    'Family & Divorce Matters': 'Nature of marriage, duration of dispute, child details, maintenance.',
    'Property & Land Disputes': 'Property details, boundary issues, tenancy problems, builder delays.',
    'Cheque Bounce Cases': 'Cheque number, amount, date of dishonour, bank memo reason.',
    'Employment & Labour Disputes': 'Your designation, salary details, wrongful firing, unpaid wages.',
    'Corporate & Business Disputes': 'Partnership / company details, shareholder issues, contract defaults.',
    'Contract Drafting & Review': 'Type of agreement needed and key commercial terms.',
    'Money Recovery Cases': 'Loan/outstanding amount details, due date, and debtor info.',
    'Legal Notices': 'Who should receive notice, main grievance, and demands.',
    'Documentation & Registration': 'What deed/affidavit needed, property details, names.',
    'Arbitration & Mediation': 'Dispute details, arbitration clause, arbitrator proposals.',
    'Other Legal Matters': 'Describe your unique issue — key facts, dates, parties, remedy sought.'
  };
  if (promptEl) promptEl.textContent = prompts[wizardData.category] || 'Describe your issue in detail.';
  const titleEl = document.getElementById('w-step2-title');
  if (titleEl) titleEl.textContent = `Describe your ${wizardData.category}`;
}

function renderFinalReview() {
  const container = document.getElementById('final-review-content');
  if (!container) return;
  const rows = {
    'Full Name': wizardData.name,
    'Mobile': wizardData.phone,
    'Email': wizardData.email,
    'City / State': wizardData.city + ', ' + wizardData.state,
    'Service Category': wizardData.category,
    'Filed Against': wizardData.against,
    'Date of Incident': wizardData.date,
    'Issue Description': wizardData.issueDescription.substring(0, 150) + (wizardData.issueDescription.length > 150 ? '...' : ''),
    'Documents': wizardData.files.length > 0 ? wizardData.files.map(f => f.name).join(', ') : 'No files attached'
  };
  container.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
      ${Object.entries(rows).map(([k, v]) => `
        <tr style="border-bottom:1px solid var(--border);">
          <td style="padding:0.65rem 0;color:var(--text-muted);font-weight:600;width:38%;vertical-align:top;">${k}</td>
          <td style="padding:0.65rem 0;color:var(--text);">${v || '—'}</td>
        </tr>
      `).join('')}
    </table>
    <div style="margin-top:1rem;padding:0.875rem;background:rgba(27,122,78,0.06);border-radius:8px;border:1px solid rgba(27,122,78,0.2);">
      <span style="font-weight:600;color:var(--success);">✓ Ready to submit</span>
      <span style="color:var(--text-muted);font-size:0.825rem;margin-left:0.5rem;">Our legal team will review and assign applicable laws & generate the legal draft.</span>
    </div>
  `;
}

// ── Updated goToStep for 4 steps + step 5 (processing) ──
function goToStep(n) {
  [1, 2, 3, 4, 5].forEach(i => {
    const stepEl = document.getElementById('complaint-step' + i);
    if (stepEl) stepEl.style.display = i === n ? 'block' : 'none';
    const s = document.getElementById('cstep-' + i);
    if (s) {
      s.classList.remove('active', 'done');
      if (i === n) s.classList.add('active');
      if (i < n) s.classList.add('done');
    }
  });
  window.scrollTo(0, 80);
}

function updateFileList() {
  const input = document.getElementById('w-docs');
  const display = document.getElementById('w-file-list');
  if (input && display && input.files.length > 0) {
    const names = Array.from(input.files).map(f => '📎 ' + f.name).join(' · ');
    display.textContent = names;
    wizardData.files = [];
    Array.from(input.files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) { showToast('File ' + file.name + ' is too large (max 2MB).', 'error'); return; }
      const reader = new FileReader();
      reader.onload = function (e) {
        wizardData.files.push({ name: file.name, type: file.type, size: file.size, data: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  }
}

// ── Updated initiatePayment — goes to step 5 (processing) ──
async function initiatePayment() {
  goToStep(5);
  try {
    const payload = {
      name: wizardData.name,
      phone: wizardData.phone,
      email: wizardData.email,
      category: wizardData.category,
      against: wizardData.against,
      issueDescription: wizardData.issueDescription,
      city: wizardData.city,
      state: wizardData.state,
      date: wizardData.date,
      files: wizardData.files,
      paymentId: 'FREE_' + Date.now(),
    };
    const data = await api.submitComplaint(payload);
    const caseId = data.complaint.caseId;
    showSuccessStep(caseId);
    showToast('Complaint filed successfully!', 'success');
  } catch (error) {
    goToStep(4);
    showToast(error.message || 'Failed to submit complaint.', 'error');
  }
}

// ── Updated showSuccessStep — hides steps 1-5 ──
function showSuccessStep(caseId) {
  const caseDisplay = document.getElementById('case-id-display');
  if (caseDisplay) caseDisplay.textContent = caseId;
  [1, 2, 3, 4, 5].forEach(i => {
    const el = document.getElementById('complaint-step' + i);
    if (el) el.style.display = 'none';
  });
  const successEl = document.getElementById('complaint-success');
  if (successEl) successEl.style.display = 'block';
  sessionStorage.removeItem('applied_act_ref');
  sessionStorage.removeItem('wizard_category');
  sessionStorage.removeItem('wizard_issue_query');
  sessionStorage.removeItem('wizard_rec_id');
}

function notifyAdmin() {}

// ============ FIND YOUR LAW ============
function renderFindYourLaw() {
  const container = document.getElementById('recommendation-zone');
  const actsContainer = document.getElementById('acts-grid');
  const searchInput = document.getElementById('fyl-search-input');
  const query = sessionStorage.getItem('issueQuery');
  const resultStr = sessionStorage.getItem('issueResult');
  const selectedCategory = sessionStorage.getItem('selectedCategory');
  sessionStorage.removeItem('issueQuery');
  sessionStorage.removeItem('issueResult');
  sessionStorage.removeItem('selectedCategory');
  if (searchInput && query) searchInput.value = query;
  if (container && resultStr) {
    const result = JSON.parse(resultStr);
    renderRecommendationCard(result, container);
  } else if (container) { container.innerHTML = ''; }
  renderActsGrid(selectedCategory || '', actsContainer);
}

function renderRecommendationCard(result, container) {
  if (!container) return;
  container.innerHTML = `<div class="recommendation-card animate-fade-in">
    <div class="rec-header"><div class="rec-category-badge"><span class="rec-icon">${result.categoryIcon}</span><span>${result.category}</span></div><p class="rec-summary">${result.summary}</p></div>
    <div class="rec-body">
      <div class="rec-section"><div class="rec-section-label">⚖️ Applicable Laws</div><ul class="rec-list">${result.acts.map(a => `<li>${a}</li>`).join('')}</ul></div>
      <div class="rec-section"><div class="rec-section-label">🏛️ File At</div><p class="rec-authority">${result.authority}</p></div>
      <div class="rec-section"><div class="rec-section-label">📁 Documents Needed</div><div class="rec-docs">${result.docs.map(d => `<span class="rec-doc-chip">${d}</span>`).join('')}</div></div>
    </div>
    <div class="rec-actions">
      <button class="btn-rec-primary" onclick="openActDetail('${result.actId}')">📖 Read Full Law</button>
      <button class="btn-rec-secondary" onclick="applyRecommendationAndFile('${result.id}')">📝 File Complaint</button>
    </div>
  </div>`;
}

function renderActsGrid(categoryFilter, container) {
  if (!container) return;
  const filtered = categoryFilter ? bare_acts_db.filter(a => a.cat === categoryFilter) : bare_acts_db;
  container.innerHTML = filtered.map(act => `
    <div class="act-card-simplified animate-fade-in" id="act-${act.id}">
      <div class="act-card-header"><div class="act-card-meta">${act.type} · ${act.year}</div><h3 class="act-card-title">${act.title}</h3><p class="act-card-summary">${act.summary}</p></div>
      <div class="act-card-rights"><div class="act-rights-label">Key Rights</div><ul class="act-rights-list">${act.keyRights.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <div class="act-card-actions"><button class="btn-act-detail" onclick="openActDetail('${act.id}')">Read Full Act →</button><button class="btn-act-file" onclick="applyActDirectly('${act.id}')">File Complaint</button></div>
    </div>
  `).join('');
  if (filtered.length === 0) container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No laws found for this category.</p></div>`;
}

function filterFYL() {
  const search = document.getElementById('fyl-search-input')?.value || '';
  const category = document.getElementById('fyl-category-select')?.value || '';
  const zone = document.getElementById('recommendation-zone');
  if (search.length > 2) {
    const result = analyzeIssue(search);
    if (result && zone) renderRecommendationCard(result, zone);
    else if (zone) zone.innerHTML = '';
  } else if (zone) zone.innerHTML = '';
  renderActsGrid(category, document.getElementById('acts-grid'));
}

function handleIssueSearch() {
  const input = document.getElementById('issue-search-input');
  if (!input) return;
  const query = input.value.trim();
  if (query.length < 3) { showToast('Please describe your issue.', 'error'); return; }
  sessionStorage.setItem('issueQuery', query);
  const result = analyzeIssue(query);
  if (result) sessionStorage.setItem('issueResult', JSON.stringify(result));
  else sessionStorage.removeItem('issueResult');
  showPage('find-your-law');
}

function useExampleChip(text) {
  const input = document.getElementById('issue-search-input');
  if (input) { input.value = text; input.focus(); }
}

function selectCategory(categoryId) {
  sessionStorage.setItem('selectedCategory', categoryId);
  sessionStorage.removeItem('issueQuery');
  sessionStorage.removeItem('issueResult');
  showPage('find-your-law');
}

function openActDetail(actId) {
  sessionStorage.setItem('openActId', actId);
  renderBareActsExplorer('', '');
  setTimeout(() => selectBareAct(actId), 100);
  const detailPanel = document.getElementById('act-detail-panel');
  const actsGrid = document.getElementById('acts-grid-section');
  if (detailPanel) detailPanel.style.display = 'block';
  if (actsGrid) actsGrid.style.display = 'none';
  const actEl = document.getElementById('bare-acts-section');
  if (actEl) actEl.style.display = 'block';
}

function closeActDetail() {
  const detailPanel = document.getElementById('act-detail-panel');
  const actsGrid = document.getElementById('acts-grid-section');
  if (detailPanel) detailPanel.style.display = 'none';
  if (actsGrid) actsGrid.style.display = 'block';
}

function applyActDirectly(actId) {
  const act = bare_acts_db.find(a => a.id === actId);
  if (!act || !act.chapters || !act.chapters[0].sections[0]) return;
  const section = act.chapters[0].sections[0];
  const ref = { actId: act.id, actTitle: act.title, secId: section.id, secNum: section.num, secTitle: section.title, cat: act.cat, template: section.complaintTemplate };
  sessionStorage.setItem('applied_act_ref', JSON.stringify(ref));
  sessionStorage.setItem('wizard_category', act.cat);
  requireAuth('complaint');
}

function applyRecommendationAndFile(recId) {
  const rec = ISSUE_KEYWORD_MAP.find(r => r.id === recId);
  if (!rec) { requireAuth('complaint'); return; }
  sessionStorage.setItem('wizard_category', rec.category);
  requireAuth('complaint');
}

// ============ KNOW YOUR RIGHTS ============
function renderKnowYourRights() {
  const container = document.getElementById('guides-grid');
  if (!container) return;
  container.innerHTML = LEGAL_GUIDES_DB.map(guide => `
    <div class="guide-card animate-fade-in" onclick="openGuide('${guide.id}')" style="--guide-color: ${guide.color}">
      <div class="guide-icon">${guide.icon}</div><div class="guide-tag">${guide.tag}</div>
      <h3 class="guide-title">${guide.title}</h3><p class="guide-preview">Your rights, where to file, documents needed →</p>
      <div class="guide-arrow">→</div>
    </div>
  `).join('');
}

function openGuide(guideId) {
  const guide = LEGAL_GUIDES_DB.find(g => g.id === guideId);
  if (!guide) return;
  const panel = document.getElementById('guide-detail-panel');
  const grid = document.getElementById('guides-grid-section');
  if (panel && grid) {
    grid.style.display = 'none'; panel.style.display = 'block';
    panel.innerHTML = `<button class="btn-back-guide" onclick="closeGuide()">← Back</button>
    <div class="guide-detail-card" style="--guide-color:${guide.color}">
      <div class="guide-detail-header"><span class="guide-detail-icon">${guide.icon}</span><div><div class="guide-detail-tag">${guide.tag}</div><h1 class="guide-detail-title">${guide.title}</h1></div></div>
      <div class="guide-detail-section"><h3 class="gd-section-title">📌 What Happened?</h3><p class="gd-text">${guide.what}</p></div>
      <div class="guide-detail-section gd-law-box"><h3 class="gd-section-title">⚖️ Applicable Law</h3><p class="gd-text">${guide.law}</p></div>
      <div class="guide-detail-section"><h3 class="gd-section-title">✅ Your Rights</h3><ul class="gd-rights-list">${guide.rights.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <div class="guide-detail-section"><h3 class="gd-section-title">🏛️ Where to Complain</h3><p class="gd-text">${guide.where}</p></div>
      <div class="guide-detail-section"><h3 class="gd-section-title">📁 Documents Needed</h3><div class="gd-docs-grid">${guide.docs.map((d,i) => `<div class="gd-doc-item"><span class="gd-doc-num">${i+1}</span><span>${d}</span></div>`).join('')}</div></div>
      <div class="guide-detail-section gd-resolution-box"><h3 class="gd-section-title">⏱️ Expected Resolution</h3><p class="gd-text">${guide.resolution}</p></div>
      <div class="guide-cta"><button class="btn-primary" onclick="applyActDirectly('${guide.actId}')">📝 File Your Complaint Now</button></div>
    </div>`;
    window.scrollTo(0, 0);
  } else {
    sessionStorage.setItem('openGuideId', guideId);
    showPage('know-your-rights');
  }
}

function closeGuide() {
  const panel = document.getElementById('guide-detail-panel');
  const grid = document.getElementById('guides-grid-section');
  if (panel) panel.style.display = 'none';
  if (grid) grid.style.display = 'block';
  window.scrollTo(0, 0);
}

// ============ BARE ACT EXPLORER ============
let activeActId = null;
let activeSecId = null;

function renderBareActsExplorer(search, category) {
  const sidebarContainer = document.getElementById('sidebar-acts-list');
  if (!sidebarContainer) return;
  search = search || ''; category = category || '';
  const filtered = bare_acts_db.filter(act => {
    const matchesSearch = !search || act.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !category || act.cat === category;
    return matchesSearch && matchesCat;
  });
  if (filtered.length === 0) { sidebarContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.875rem;">No acts found.</div>'; return; }
  sidebarContainer.innerHTML = filtered.map(act => `
    <div class="sidebar-act-item ${act.id === activeActId ? 'active' : ''}" onclick="selectBareAct('${act.id}')">
      <div class="sidebar-act-cat">${act.cat}</div><div class="sidebar-act-title">${act.title}</div>
      <div class="sidebar-act-meta"><span>⚖️ ${act.type}</span><span>📅 ${act.year}</span></div>
    </div>
  `).join('');
}

function filterExplorer(search, category) { renderBareActsExplorer(search, category); }

function selectBareAct(actId) {
  activeActId = actId;
  const act = bare_acts_db.find(a => a.id === actId);
  if (!act) return;
  document.querySelectorAll('.sidebar-act-item').forEach(item => item.classList.remove('active'));
  renderBareActsExplorer(
    document.getElementById('explorer-search-input')?.value || '',
    document.getElementById('explorer-category-select')?.value || ''
  );
  const mainPane = document.getElementById('explorer-main-pane');
  if (!mainPane) return;
  mainPane.innerHTML = `<div class="act-detail-content">
    <div class="act-detail-header"><span class="act-detail-tag">${act.type} · ${act.year}</span><h2 class="act-detail-title">${act.title}</h2><p class="act-detail-objective">${act.objective}</p></div>
    <div class="act-detail-body"><div class="act-index-pane"><div class="act-index-heading">Chapters & Sections</div>
    ${act.chapters.map(ch => `<div class="chapter-heading">${ch.title}</div><div style="display:flex;flex-direction:column;gap:2px;">${ch.sections.map(sec => `<div class="section-index-item" id="idx-sec-${sec.id}" onclick="selectSection('${act.id}','${sec.id}')">${sec.num}: ${sec.title}</div>`).join('')}</div>`).join('')}
    </div><div class="act-view-pane" id="act-view-pane"><div class="act-detail-placeholder"><div class="act-detail-placeholder-icon">📖</div><h4>Select a section</h4><p>Click a section to view its full text.</p></div></div></div>
  </div>`;
  if (act.chapters.length > 0 && act.chapters[0].sections.length > 0) selectSection(act.id, act.chapters[0].sections[0].id);
}

function selectSection(actId, secId) {
  activeSecId = secId;
  const act = bare_acts_db.find(a => a.id === actId);
  if (!act) return;
  let section = null;
  for (const ch of act.chapters) { const s = ch.sections.find(sec => sec.id === secId); if (s) { section = s; break; } }
  if (!section) return;
  document.querySelectorAll('.section-index-item').forEach(item => item.classList.remove('active'));
  const indexItem = document.getElementById(`idx-sec-${secId}`);
  if (indexItem) indexItem.classList.add('active');
  const viewPane = document.getElementById('act-view-pane');
  if (!viewPane) return;
  viewPane.innerHTML = `<div class="section-content-card">
    <div class="section-content-num">${act.shortTitle} — ${section.num}</div>
    <h3 class="section-content-title">${section.title}</h3>
    <div class="section-content-text">${section.text}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1.5rem;background:var(--white);padding:1rem;border-radius:8px;border:1px solid var(--border);">
      <div><h4 style="font-size:0.8rem;text-transform:uppercase;color:var(--danger);font-weight:700;margin-bottom:0.25rem;">Penalties</h4><p style="font-size:0.825rem;color:var(--text-muted);line-height:1.4;">${section.penalty}</p></div>
      <div><h4 style="font-size:0.8rem;text-transform:uppercase;color:var(--success);font-weight:700;margin-bottom:0.25rem;">Remedy</h4><p style="font-size:0.825rem;color:var(--text-muted);line-height:1.4;">${section.remedy}</p></div>
    </div>
    <div style="margin-top:1.5rem;background:rgba(27,122,78,0.04);border:1px dashed var(--success);border-radius:8px;padding:1rem;">
      <h4 style="font-size:0.85rem;color:var(--success);font-weight:700;margin-bottom:0.5rem;">📋 Complaint Draft Available</h4>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">Click below to apply this act to your complaint.</p>
      <button class="btn-apply-act" onclick="applyActToForm('${act.id}','${section.id}')">⚖️ Apply & File Complaint Now</button>
    </div>
  </div>`;
}

function applyActToForm(actId, secId) {
  const act = bare_acts_db.find(a => a.id === actId);
  if (!act) return;
  let section = null;
  for (const ch of act.chapters) { const s = ch.sections.find(sec => sec.id === secId); if (s) { section = s; break; } }
  if (!section) return;
  const ref = { actId: act.id, actTitle: act.title, secId: section.id, secNum: section.num, secTitle: section.title, cat: act.cat, template: section.complaintTemplate };
  sessionStorage.setItem('applied_act_ref', JSON.stringify(ref));
  sessionStorage.setItem('wizard_category', act.cat);
  showToast('Applied! Redirecting to complaint form...', 'success');
  setTimeout(() => { requireAuth('complaint'); }, 1000);
}

// ============ DYNAMIC STATS ============
async function updateDynamicStats() {
  try {
    const data = await api.getPublicStats();
    const total = data.stats.totalComplaints || 0;
    const successRate = data.stats.successRate || 0;
    const el1 = document.getElementById('hero-cases-filed'); if (el1) el1.textContent = total;
    const el2 = document.getElementById('hero-success-rate'); if (el2) el2.textContent = successRate + '%';
    const el3 = document.getElementById('adv-cases-handled'); if (el3) el3.textContent = total;
    const el4 = document.getElementById('adv-success-rate'); if (el4) el4.textContent = successRate + '%';
  } catch {
    const el1 = document.getElementById('hero-cases-filed'); if (el1) el1.textContent = '0';
    const el2 = document.getElementById('hero-success-rate'); if (el2) el2.textContent = '0%';
  }
}

// ============ QUOTE ============
function checkAdminAndAddQuote() {
  if (currentUser && currentUser.role === 'admin') {
    document.getElementById('new-quote-text').value = dailyQuote.text;
    document.getElementById('new-quote-author').value = dailyQuote.author;
    document.getElementById('quote-modal').classList.add('open');
  }
}
function closeQuoteModal() { const modal = document.getElementById('quote-modal'); if (modal) modal.classList.remove('open'); }
function saveQuote() {
  const text = document.getElementById('new-quote-text').value.trim();
  const author = document.getElementById('new-quote-author').value.trim();
  if (!text) { showToast('Enter a quote.', 'error'); return; }
  dailyQuote = { text, author, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) };
  const qt = document.getElementById('quote-text'); if (qt) qt.textContent = '"' + text + '"';
  const qa = document.getElementById('quote-author'); if (qa) qa.textContent = '— ' + author;
  const qd = document.getElementById('quote-date'); if (qd) qd.textContent = dailyQuote.date;
  closeQuoteModal();
  showToast('Quote updated!', 'success');
}

// ============ TOAST ============
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  void t.offsetWidth;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ============ MODAL ============
function closeModal() { const modal = document.getElementById('pdf-modal'); if (modal) modal.classList.remove('open'); }

// ============ INIT ============
function toggleUserDarkMode() {}
function initUserDarkMode() {}

document.addEventListener('DOMContentLoaded', () => {
  initUserDarkMode();
  updateNavHighlight();
  updateNavForUser();
  updateDynamicStats();

  const path = window.location.pathname;

  if (path.includes('find-your-law.html')) {
    renderFindYourLaw();
    const openActId = sessionStorage.getItem('openActId');
    if (openActId) { sessionStorage.removeItem('openActId'); openActDetail(openActId); }
  }

  if (path.includes('complaint.html')) { initComplaintWizard(); }

  if (path.includes('developer.html') || path.includes('baraat.html')) {
    renderBareActsExplorer();
    if (bare_acts_db.length > 0) selectBareAct(bare_acts_db[0].id);
  }

  const quoteModal = document.getElementById('quote-modal');
  if (quoteModal) quoteModal.addEventListener('click', function (e) { if (e.target === this) closeQuoteModal(); });
  const pdfModal = document.getElementById('pdf-modal');
  if (pdfModal) pdfModal.addEventListener('click', function (e) { if (e.target === this) closeModal(); });

  const issueSearch = document.getElementById('issue-search-input');
  if (issueSearch) issueSearch.addEventListener('keydown', e => { if (e.key === 'Enter') handleIssueSearch(); });
  const fylSearch = document.getElementById('fyl-search-input');
  if (fylSearch) fylSearch.addEventListener('keydown', e => { if (e.key === 'Enter') filterFYL(); });
});

// Offline Indicator Logic
document.addEventListener('DOMContentLoaded', () => {
  const offlineBanner = document.createElement('div');
  offlineBanner.className = 'offline-banner';
  offlineBanner.textContent = 'You are currently offline. Please check your internet connection.';
  document.body.appendChild(offlineBanner);

  function updateOnlineStatus() {
    if (navigator.onLine) {
      offlineBanner.classList.remove('show');
    } else {
      offlineBanner.classList.add('show');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus(); // Check on load
});

