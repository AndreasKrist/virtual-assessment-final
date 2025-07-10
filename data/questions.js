/* Define all questions here */

// Biodata questions - UPDATED with Consultant field
export const biodataQuestions = [
  {
    id: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    required: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    required: false,
  },
  {
    id: "ageGroup",
    label: "Age Group",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"],
    required: true,
  },
  // NEW: Consultant field
  {
    id: "consultant",
    label: "Consultant",
    type: "select",
    options: [
      "Melvin Tan", 
      "Irish M", 
      "Ann Loh", 
      "Jovelyn Balili", 
      "Leslie Carsula", 
      "Stanley Lim", 
      "Marvin Costales", 
      "Jennifer Tan", 
      "Ian Morrison", 
      "Carolyn Leong"
    ],
    required: true,
  }
];

// General IT questions (unchanged)
export const generalQuestions = [
  {
    id: "generalQ1",
    text: "Do you know how to turn on/off a laptop or desktop computer?",
    courseRecommendation: "Computer Basics 101",
    category: "basics"
  },
  {
    id: "generalQ2",
    text: "Do you know how to use a web browser (e.g., Chrome, Edge, Firefox)?",
    courseRecommendation: "Web Browsing Fundamentals",
    category: "basics" 
  },
  {
    id: "generalQ3",
    text: "Do you know how to connect to Wi-Fi?",
    courseRecommendation: "Internet Connectivity Basics",
    category: "connectivity"
  },
  {
    id: "generalQ4",
    text: "Do you know how to use email?",
    courseRecommendation: "Email Communication Essentials",
    category: "communication"
  },
  {
    id: "generalQ5",
    text: "Do you know how to use Microsoft Word?",
    courseRecommendation: "Office Productivity Fundamentals",
    category: "productivity"
  },
  {
    id: "generalQ6",
    text: "Do you know how to use copy and paste function?",
    courseRecommendation: "Computer Basics 101",
    category: "basics"
  },
  {
    id: "generalQ7",
    text: "Do you know how to use USB drive or external storage device?",
    courseRecommendation: "File Management Essentials",
    category: "fileManagement"
  },
  {
    id: "generalQ8",
    text: "Do you know how to install a software (e.g., Zoom, Microsoft Office)?",
    courseRecommendation: "Software Installation and Management",
    category: "software"
  },
  {
    id: "generalQ9",
    text: "Do you know how to adjust simple computer settings like screen brightness, volume, or changing a desktop background?",
    courseRecommendation: "Computer Configuration Basics",
    category: "configuration"
  },
  {
    id: "generalQ10",
    text: "Do you know how to restart a frozen application or reboot your computer when it's not responding?",
    courseRecommendation: "Troubleshooting Computer Problems",
    category: "troubleshooting"
  }
];

// Network Admin questions (unchanged)
export const networkAdminQuestions = [
  {
    id: "networkQ1",
    text: "Do you know what the Internet is and what it is used for?",
    courseRecommendation: "Introduction to Internet Technologies",
    category: "networking"
  },
  {
    id: "networkQ2",
    text: "Do you know the difference between wired (Ethernet) and wireless (Wi-Fi) connection?",
    courseRecommendation: "Networking Fundamentals: Connectivity Types",
    category: "connectivity"
  },
  {
    id: "networkQ3",
    text: "Have you ever entered a password to access a Wi-Fi network?",
    courseRecommendation: "Wi-Fi Network Configuration Basics",
    category: "connectivity"
  },
  {
    id: "networkQ4",
    text: "Do you know how to check if a device is connected to the internet?",
    courseRecommendation: "Network Troubleshooting Basics",
    category: "troubleshooting"
  },
  {
    id: "networkQ5",
    text: "Have you ever restarted a modem or router to fix a network issue?",
    courseRecommendation: "Network Hardware Management",
    category: "hardware"
  },
  {
    id: "networkQ6",
    text: "Do you know what an IP address is?",
    courseRecommendation: "IP Addressing and Subnetting",
    category: "networking"
  },
  {
    id: "networkQ7",
    text: "Can you find your IP address on your computer or phone?",
    courseRecommendation: "Network Configuration Essentials",
    category: "configuration"
  },
  {
    id: "networkQ8",
    text: "Do you know what a router does in a network?",
    courseRecommendation: "Network Hardware Fundamentals",
    category: "hardware"
  },
  {
    id: "networkQ9",
    text: "Have you ever used the ping command to test if a website is reachable?",
    courseRecommendation: "Network Diagnostics and Troubleshooting",
    category: "troubleshooting"
  },
  {
    id: "networkQ10",
    text: "Do you understand what subnetting is and why it's used in networking?",
    courseRecommendation: "Advanced IP Addressing and Subnetting",
    category: "networking"
  }
];

// Cybersecurity questions (unchanged)
export const cybersecurityQuestions = [
  {
    id: "cyberQ1",
    text: "Do you understand why we use passwords?",
    courseRecommendation: "Password Security Best Practices",
    category: "security"
  },
  {
    id: "cyberQ2",
    text: "Have you ever been concerned about someone accessing your accounts without permission?",
    courseRecommendation: "Account Security and Protection",
    category: "security"
  },
  {
    id: "cyberQ3",
    text: "Do you understand why using public Wi-Fi can be risky?",
    courseRecommendation: "Network Security Fundamentals",
    category: "security"
  },
  {
    id: "cyberQ4",
    text: "Do you know what cyber security means?",
    courseRecommendation: "Introduction to Cybersecurity",
    category: "security"
  },
  {
    id: "cyberQ5",
    text: "Have you ever heard one of these (Computer Virus, Phishing, Malware)?",
    courseRecommendation: "Common Cyber Threats and Attacks",
    category: "threats"
  },
  {
    id: "cyberQ6",
    text: "Have you heard of encryption?",
    courseRecommendation: "Data Encryption Fundamentals",
    category: "encryption"
  },
  {
    id: "cyberQ7",
    text: "Do you know what multifactor authentication means?",
    courseRecommendation: "Authentication Methods and Security",
    category: "encryption"
  },
  {
    id: "cyberQ8",
    text: "Do you know what a secure website looks like in your browser?",
    courseRecommendation: "Web Security Indicators",
    category: "networking"
  },
  {
    id: "cyberQ9",
    text: "Are you familiar with what DNS is?",
    courseRecommendation: "DNS and Network Security",
    category: "networking"
  },
  {
    id: "cyberQ10",
    text: "Are you familiar with what an \"endpoint\" refers to in cybersecurity?",
    courseRecommendation: "Endpoint Security Fundamentals",
    category: "endpointSecurity"
  }
];

// Map role to questions set (unchanged)
export const roleQuestions = {
  "networkAdmin": networkAdminQuestions,
  "cybersecurity": cybersecurityQuestions
};
  
// Course catalog with detailed information (unchanged)
export const courseCatalog = {
  "Computer Basics 101": {
    title: "Computer Basics 101",
    description: "Learn the fundamentals of operating computers, from power functions to basic navigation.",
    duration: "4 weeks",
    difficulty: "Beginner",
    topics: ["Computer Hardware", "Operating Systems", "File Management", "Basic Troubleshooting"]
  },
  "Introduction to Cybersecurity": {
    title: "Introduction to Cybersecurity",
    description: "Understand the core concepts of cybersecurity and why it's important in today's digital world.",
    duration: "6 weeks",
    difficulty: "Beginner",
    topics: ["Security Principles", "Common Threats", "Basic Protection Methods", "Security Mindset"]
  },
  "Networking Fundamentals": {
    title: "Networking Fundamentals",
    description: "Learn how computer networks work and how data travels between devices.",
    duration: "8 weeks",
    difficulty: "Beginner",
    topics: ["Network Types", "Network Hardware", "IP Addressing", "Network Protocols"]
  },
  "IP Addressing and Subnetting": {
    title: "IP Addressing and Subnetting",
    description: "Master the concepts of IP addressing and how to implement subnetting in networks.",
    duration: "6 weeks",
    difficulty: "Intermediate",
    topics: ["IPv4 Addressing", "Subnet Masks", "CIDR Notation", "Subnet Calculations"]
  },
  "Network Diagnostics and Troubleshooting": {
    title: "Network Diagnostics and Troubleshooting",
    description: "Learn how to diagnose and resolve common network issues using industry-standard tools.",
    duration: "5 weeks",
    difficulty: "Intermediate",
    topics: ["Diagnostic Tools", "Command Line Utilities", "Network Monitoring", "Problem Resolution"]
  },
  "Password Security Best Practices": {
    title: "Password Security Best Practices",
    description: "Learn how to create strong passwords and manage them securely.",
    duration: "3 weeks",
    difficulty: "Beginner",
    topics: ["Password Creation", "Password Management Tools", "Multi-Factor Authentication", "Security Policies"]
  },
  "Common Cyber Threats and Attacks": {
    title: "Common Cyber Threats and Attacks",
    description: "Understand the most common threats in cybersecurity and how they work.",
    duration: "5 weeks",
    difficulty: "Beginner-Intermediate",
    topics: ["Phishing", "Malware", "Social Engineering", "Ransomware", "Data Breaches"]
  },
  "Data Encryption Fundamentals": {
    title: "Data Encryption Fundamentals",
    description: "Learn the basics of encryption and how it protects your data.",
    duration: "4 weeks",
    difficulty: "Intermediate",
    topics: ["Encryption Concepts", "Symmetric vs Asymmetric", "TLS/SSL", "Encryption Applications"]
  },
  "DNS and Network Security": {
    title: "DNS and Network Security",
    description: "Understand DNS and its role in network security.",
    duration: "4 weeks",
    difficulty: "Intermediate",
    topics: ["DNS Fundamentals", "DNS Security Extensions", "DNS Attacks", "Secure DNS Configuration"]
  },
  "Endpoint Security Fundamentals": {
    title: "Endpoint Security Fundamentals",
    description: "Learn how to secure endpoints in your network from cyber threats.",
    duration: "5 weeks",
    difficulty: "Intermediate",
    topics: ["Endpoint Protection", "Antivirus Solutions", "Device Management", "Security Policies"]
  },
  // Add more courses as needed...
};