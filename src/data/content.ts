import bimetalLogo from '@/assets/bimetal_logo.png';
import mafkinLogo from '@/assets/mafkin_logo.png';
import tcsLogo from '@/assets/tcs_logo.png';
import uomBanner from '@/assets/uom-banner.png';
import vitLogo from '@/assets/vit-logo.png';
import schoolLogo from '@/assets/schoollogo.png';

export const profile = {
  name: 'Sarath Kumar S K',
  legalName: 'Sarath Kumar Senthilkumar Kavitha',
  shortName: 'Sarath Kumar',
  initials: 'SKSK',
  role: 'Robotics Engineer',
  university: 'The University of Manchester',
  location: 'Manchester, United Kingdom',
  email: 'sarathkumarsenthilkavitha@gmail.com',
  phone: '+44 7810 821988',
  phoneHref: 'tel:+447810821988',
  github: 'https://github.com/sarathkumar-sk',
  linkedin: 'https://linkedin.com/in/sarath-kumar-sk',
  cv: '/sarath_resume_uk.pdf',
  siteUrl: 'https://sarathkumar-sk.vercel.app',
};

export type MediaItem = { type: 'image' | 'video'; src: string };

export type Project = {
  title: string;
  date: string;
  contribution: string;
  description: string;
  technologies: string[];
  category: string;
  githubLink: string;
  thumbnail: string;
  media: MediaItem[];
};

export const projects: Project[] = [
  {
    title: 'Leo Rover Autonomous Navigation and Manipulation',
    date: 'May 2026',
    contribution:
      'Implemented ROS2 frontier exploration, the sensor fusion stack and the state machine driving autonomous navigation and pick and place.',
    description:
      'A Leo Rover integrating a robotic arm, Raspberry Pi, depth camera and 2D LiDAR for fully autonomous navigation and manipulation on real hardware. Frontier exploration maps the environment autonomously, holding localisation accuracy within 12 cm with real-time path planning and obstacle avoidance. A depth camera vision pipeline detects coloured blocks, and the manipulator picks and places them. Validated in Gazebo before hardware deployment.',
    technologies: ['ROS2', 'Python', 'Raspberry Pi', '2D LiDAR', 'Depth Camera', 'Sensor Fusion', 'Gazebo'],
    category: 'Robotics',
    githubLink: 'https://github.com/sarathkumar-sk/Team_6_AERO62520_RSD_Project',
    thumbnail: '/thumbs/leo-rover.jpg',
    media: [
      { type: 'video', src: '/project9/Team-6_promo.mp4' },
      { type: 'video', src: '/project9/Untitled design.mp4' },
      { type: 'video', src: '/project9/IMG_5167.MOV' },
      { type: 'video', src: '/project9/VID_20251015_174250.mp4' },
      { type: 'video', src: '/project9/VID_20251020_163402.mp4' },
      { type: 'video', src: '/project9/VID_20251022_164226.mp4' },
    ],
  },
  {
    title: 'Cascade PID Drone Control',
    date: 'Mar 2026',
    contribution:
      'Designed the nested loop architecture, tuned the gains in simulation and flew the controller on real hardware.',
    description:
      'A cascade PID control system for autonomous drone stabilisation, with an inner loop regulating angular rate and an outer loop controlling attitude and altitude. The quadrotor dynamics model was validated in Python simulation, then the controller was transferred to hardware, reaching stable hover, responsive setpoint tracking and robust recovery from external perturbations in live flight.',
    technologies: ['Python', 'PID Control', 'Flight Dynamics', 'Embedded Systems', 'Sim-to-Real'],
    category: 'Control Systems',
    githubLink: 'https://github.com/sarathkumar-sk/Cascade_PID_Drone_Controller',
    thumbnail: '/thumbs/cascade-pid-drone.jpg',
    media: [
      { type: 'video', src: '/project10/real.mp4' },
      { type: 'video', src: '/project10/fake.webm' },
    ],
  },
  {
    title: 'Robotic Automation for Fault Detection in Metal Sheets',
    date: 'Aug 2025',
    contribution:
      'Built the edge inference pipeline and wired the detection output to the physical spray actuator.',
    description:
      'A complete edge AI pipeline: OpenCV preprocessing, YOLO object detection and TensorFlow classification running on an NVIDIA Jetson Xavier, reaching 89% defect identification accuracy and improving throughput by 40%. The inference output drives a physical robotic spray actuator, closing the loop from sensor to actuation on an industrial line.',
    technologies: ['Jetson Xavier', 'YOLO', 'TensorFlow', 'OpenCV', 'Arduino', 'Edge AI'],
    category: 'AI and Robotics',
    githubLink: 'https://github.com/sarathkumar-sk/Fault_Detection_System',
    thumbnail: '/thumbs/fault-detection.jpg',
    media: [
      { type: 'video', src: '/project8/VID_20250305_095119 (1).mp4' },
      { type: 'image', src: '/project8/6338822519002958595.jpg' },
      { type: 'image', src: '/project8/IMG_20250708_154252.jpg' },
      { type: 'video', src: '/project8/video6338822518542965125.mp4' },
      { type: 'video', src: '/project8/VID_20250708_165351.mp4' },
    ],
  },
  {
    title: 'Contactless Measurement System',
    date: '2025',
    contribution:
      'Developed the core image processing algorithms using OpenCV and configured the Jetson Orin Nano for real-time analysis.',
    description:
      'A non-contact measurement system using two cameras and OpenCV to capture and analyse object shapes and dimensions in real time, improving efficiency and safety in industrial and laboratory environments.',
    technologies: ['OpenCV', 'Python', 'Image Processing', 'Jetson Orin Nano'],
    category: 'Computer Vision',
    githubLink: 'https://github.com/sarathkumar-sk/Component_Verification',
    thumbnail: '/thumbs/contactless-measurement.jpg',
    media: [
      { type: 'image', src: '/project7/6338822519002958594.jpg' },
      { type: 'video', src: '/project7/Dark Classic Minimalist Film Look Wedding Slideshow Video.mp4' },
      { type: 'video', src: '/project7/video6338822518542965152.mp4' },
    ],
  },
  {
    title: 'Nuclear Environment Automation System',
    date: 'Feb 2025',
    contribution:
      'Simulated the robot in Gazebo and implemented A* path planning on top of the visual SLAM stack.',
    description:
      'An autonomous robot for hazardous nuclear environments, using visual SLAM for real-time mapping and localization. Navigation accuracy and sensor performance were validated through Gazebo simulation before any hardware work. Depth cameras handle perception and an attached robotic arm executes tasks, combining manipulation and navigation in one system.',
    technologies: ['vSLAM', 'Gazebo', 'ROS', 'Autonomous Navigation', 'RViz'],
    category: 'Robotics',
    githubLink: 'https://github.com/sarathkumar-sk/NUCLEUS',
    thumbnail: '/thumbs/nuclear-automation.jpg',
    media: [
      { type: 'image', src: '/project6/Screenshot 2025-10-26 154557.png' },
      { type: 'image', src: '/project6/Screenshot 2025-10-26 154439.png' },
      { type: 'image', src: '/project6/Screenshot 2025-10-26 154519.png' },
      { type: 'image', src: '/project6/Screenshot 2025-10-26 154643.png' },
      { type: 'image', src: '/project6/Screenshot 2025-10-26 154726.png' },
    ],
  },
  {
    title: 'Motion Control for Underwater Robot',
    date: '2024',
    contribution:
      'Programmed the Jetson Nano for SSH control and integrated IMU and encoder data from the Arduino Mega for precise navigation.',
    description:
      'An underwater robot motion control system using Jetson Nano with SSH control over Ethernet and joystick input. It calculates wheel speeds from joystick commands and fuses IMU and encoder data from an Arduino Mega for responsive underwater navigation.',
    technologies: ['ROS2', 'Python', 'Raspberry Pi', 'Jetson Nano', 'Sensors', 'Arduino'],
    category: 'Robotics',
    githubLink: 'https://github.com/sarathkumar-sk/Mafkin_ws',
    thumbnail: '/thumbs/underwater-robot.jpg',
    media: [
      { type: 'image', src: '/project5/6338822519002958656.jpg' },
      { type: 'video', src: '/project5/video6338822518542965188.mp4' },
      { type: 'video', src: '/project5/video6338822518542965187.mp4' },
    ],
  },
  {
    title: 'Agri-Connect Smart Irrigation System',
    date: '2023',
    contribution:
      'Designed the IoT architecture with Raspberry Pi and built the companion app for soil type prediction.',
    description:
      'An IoT irrigation system built on Raspberry Pi, integrating rain, humidity and soil moisture sensing. It uses automated algorithms for water management and a companion app that predicts soil type.',
    technologies: ['Raspberry Pi', 'IoT', 'Sensors', 'Automation', 'Computer Vision'],
    category: 'Internet of Things',
    githubLink: 'https://github.com/sarathkumar-sk/Automatic_irrigation',
    thumbnail: '/thumbs/agri-connect.jpg',
    media: [
      { type: 'image', src: '/project4/6338822519002958625.jpg' },
      { type: 'image', src: '/project4/6338822519002958622.jpg' },
      { type: 'image', src: '/project4/6338822519002958627.jpg' },
      { type: 'image', src: '/project4/6338822519002958617.jpg' },
      { type: 'image', src: '/project4/6338822519002958618.jpg' },
      { type: 'image', src: '/project4/6338822519002958620.jpg' },
      { type: 'image', src: '/project4/6338822519002958619.jpg' },
    ],
  },
  {
    title: 'E-Learn Education Platform',
    date: '2023',
    contribution: 'Developed the frontend with ReactJS and built the backend API using ExpressJS and MongoDB.',
    description:
      'An educational platform built with React and Node.js offering interactive, personalized and adaptive learning. It supports multiple languages and tailors content per class level.',
    technologies: ['ReactJS', 'ExpressJS', 'MongoDB', 'Node.js'],
    category: 'Web Development',
    githubLink: 'https://github.com/sarathkumar-sk/E-Learn',
    thumbnail: '/thumbs/e-learn.jpg',
    media: [
      { type: 'video', src: '/project3/video6338822518542965178.mp4' },
      { type: 'image', src: '/project3/IMG_5390.JPG' },
      { type: 'image', src: '/project3/IMG_20230305_170025.jpg' },
    ],
  },
  {
    title: 'Gesture-Controlled 3-DOF Robotic Arm',
    date: '2022',
    contribution:
      'Implemented hand gesture recognition using Python and OpenCV, and integrated it with the Raspberry Pi hardware.',
    description:
      'A robotic arm with IoT integration, using Python and Raspberry Pi for precise control. It uses computer vision and hand gesture recognition to manipulate objects intuitively.',
    technologies: ['Python', 'Raspberry Pi', 'IoT', 'Computer Vision'],
    category: 'Computer Vision',
    githubLink: 'https://github.com/sarathkumar-sk/Gesture_Arm_Control',
    thumbnail: '/thumbs/gesture-arm.jpg',
    media: [
      { type: 'image', src: '/project2/6338822519002958624.jpg' },
      { type: 'video', src: '/project2/video6338822518542965130.mp4' },
      { type: 'image', src: '/project2/6338822519002958623.jpg' },
      { type: 'video', src: '/project2/video6336570718729280035.mp4' },
    ],
  },
  {
    title: 'Voice-Controlled Home Automation',
    date: '2021',
    contribution:
      'Configured the NLP pipeline on the Raspberry Pi to interpret voice commands and manage connected appliances.',
    description:
      'A smart home system using Raspberry Pi, IoT and NLP that controls appliances with voice commands, interpreting instructions in real time for hands-free management of lights, fans and other devices.',
    technologies: ['IoT', 'NLP', 'Raspberry Pi', 'Python'],
    category: 'Internet of Things',
    githubLink: '',
    thumbnail: '/thumbs/voice-home.jpg',
    media: [
      { type: 'image', src: '/project1/IMG_20190502_174321.jpg' },
      { type: 'image', src: '/project1/IMG_20190502_163954.jpg' },
      { type: 'video', src: '/project1/video6336570718729280021.mp4' },
      { type: 'image', src: '/project1/6336570719189273809.jpg' },
    ],
  },
];

export const experiences = [
  {
    company: 'Vellore Institute of Technology - Bimetal Pvt. Ltd.',
    role: 'Robotics Engineer Intern',
    period: 'Jan 2025 - Aug 2025',
    location: 'Chennai, India',
    logo: bimetalLogo,
    companyUrl: 'https://www.bimite.co.in/',
    headline: '89% accuracy detecting and localizing defects in real time.',
    achievements: [
      'Utilized a Hikrobot (MV-CS050-10UC) industrial machine vision camera to capture high-framerate images of the metal sheets as they moved down the production line.',
      'Developed and trained a custom YOLO-based object detection model to identify and classify various types of defects (scratches, dents, etc.).',
      'Deployed this model onto an NVIDIA Jetson Xavier Industrial platform for real-time edge inference without a cloud server.',
      'When the AI model detected a fault, the Jetson signaled the Arduino, which controlled relays to activate a spray marker, marking the defected area of the metal sheet.',
      'The final system achieved an 89% accuracy rate in detecting and localizing defects in real-time.',
    ],
  },
  {
    company: 'Mafkin Robotics',
    role: 'ROS2 Programming Intern',
    period: 'Jun 2024 - Aug 2024',
    location: 'Chennai, India',
    logo: mafkinLogo,
    companyUrl: 'https://www.mafkinrobotics.com/',
    headline: 'Accurate real-time localization on a complex surface using sensor fusion.',
    achievements: [
      'Integrated a multi-sensor array, including an IMU (Inertial Measurement Unit), ArduCam, and Wheel Encoders.',
      'Implemented sensor fusion techniques for precise localization and real-time mapping (SLAM) of the hull surface.',
      'Developed a Python script to enable joystick-based remote teleoperation via secure Ethernet (SSH).',
      'Utilized RViz to visualize live sensor data, robot state, and mapping for debugging navigation and control algorithms.',
      'Demonstrated accurate real-time localization on a complex surface using sensor fusion.',
    ],
  },
  {
    company: 'Tata Consultancy Services (TCS)',
    role: 'RPA Developer Intern',
    period: 'Aug 2023 - Nov 2023',
    location: 'Chennai, India',
    logo: tcsLogo,
    companyUrl: 'https://www.tcs.com/',
    headline: 'Fifteen end-to-end RPA workflows, designed, deployed and supported.',
    achievements: [
      'Designed, developed, tested, and deployed 15 end-to-end RPA workflows using UiPath Studio for data entry, report generation, and system integration.',
      'Collaborated with cross-functional teams to analyze business processes, map automation flows, and gather detailed requirements.',
      'Authored Solution Design Documents (SDD) and provided production support for deployed bots, ensuring long-term reliability.',
      'Achieved UiPath Certified RPA Associate (UiRPA) status, demonstrating solid RPA development and deployment expertise.',
    ],
  },
];

export const education = [
  {
    degree: 'MSc Robotics',
    institution: 'The University of Manchester',
    period: 'Sep 2025 - Present',
    location: 'Manchester, United Kingdom',
    focus: [
      'Robotic Systems',
      'Computer Vision',
      'Reinforcement Learning',
      'Autonomous Mobile Robots',
      'Robotic Manipulators',
      'Cognitive Robotics',
      'Software for Robotics',
    ],
    image: uomBanner,
    grade: '',
  },
  {
    degree: 'BTech Computer Science Engineering with AI and Robotics',
    institution: 'Vellore Institute of Technology',
    period: 'Sep 2021 - Jul 2025',
    location: 'Chennai, India',
    focus: [
      'Robot Operating System',
      'Robotics Kinematics',
      'Robotics Perception',
      'Cognitive Robotics',
      'Machine Learning',
      'Sensors and Actuators',
      'Data Structures and Algorithms',
      'Operating Systems',
      'Computer Networks',
      'Natural Language Processing',
    ],
    image: vitLogo,
    grade: '9.07 / 10, First-Class Honours',
  },
  {
    degree: 'High School',
    institution: 'SKNS PMC Vivekananda Vidyalaya',
    period: 'Jun 2019 - Mar 2021',
    location: 'Chennai, India',
    focus: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'English'],
    image: schoolLogo,
    grade: '96%',
  },
];

export const skillGroups = [
  {
    title: 'Control systems',
    skills: [
      'Cascade PID control',
      'Inner and outer loop design',
      'Closed-loop feedback',
      'Gain tuning and validation',
      'Sim-to-real transfer',
    ],
  },
  {
    title: 'Sensing and data fusion',
    skills: ['LiDAR', 'Depth camera', 'IMU', 'Wheel encoders', 'Multi-sensor fusion', 'SLAM'],
  },
  {
    title: 'Robotics frameworks',
    skills: ['ROS1', 'ROS2', 'Gazebo', 'RViz', 'Nav2', 'MoveIt2', 'Path planning'],
  },
  {
    title: 'Computer vision and AI',
    skills: ['OpenCV', 'YOLO', 'TensorFlow', 'PyTorch', 'CNN', 'Deep Learning', 'Reinforcement Learning'],
  },
  {
    title: 'Real-time and embedded',
    skills: [
      'Linux real-time systems',
      'NVIDIA Jetson Xavier',
      'Raspberry Pi',
      'Arduino',
      'IoT',
      'UART',
      'I2C',
      'SPI',
      'MQTT',
      'HTTP',
    ],
  },
  {
    title: 'Languages and tooling',
    skills: [
      'C',
      'C++',
      'Python',
      'MATLAB',
      'JavaScript',
      'Java',
      'SQL',
      'Git',
      'Docker',
      'Unit and integration testing',
    ],
  },
];

export const awards = [
  {
    title: 'CSI Product Development Hackathon',
    year: '2023',
    award: 'First place',
    description:
      'First place at the Computer Society of India one-day product development hackathon, for an adaptive multi-language e-learning platform.',
    certificateLink: '/certificate/awardcsi.png',
  },
  {
    title: 'e-Yantra Robotics Competition',
    year: '2024',
    award: 'Stage 3 finalist',
    description:
      'Top 100 teams globally in the IIT Bombay competition, designing and simulating a robot against a complex real-world theme.',
    certificateLink: '/certificate/eyantra.jpg',
  },
];

export const certifications = [
  { title: 'Wildlife Ecology', issuer: 'NPTEL', date: 'October 2024', certificateLink: '/certificate/wildlife.jpg' },
  { title: 'ROS2 Programming Intern', issuer: 'Mafkin Robotics', date: 'September 2024', certificateLink: '/certificate/mafkin.jpg' },
  { title: 'RPA Developer Intern', issuer: 'Tata Consultancy Services', date: 'November 2023', certificateLink: '/certificate/tcs.jpg' },
  { title: 'Google Cloud Computing Foundation', issuer: 'NPTEL', date: 'November 2023', certificateLink: '/certificate/cloud.jpg' },
  { title: 'Enterprise Automation', issuer: 'Workato', date: 'June 2023', certificateLink: '/certificate/work.png' },
  {
    title: 'Skill Development Workshop on UAV',
    issuer: 'American Society of Mechanical Engineers',
    date: 'June 2023',
    certificateLink: '/certificate/asme.png',
  },
  { title: 'Certified RPA Developer Foundation', issuer: 'UiPath', date: 'October 2023', certificateLink: '/certificate/rpa.png' },
  { title: 'Diploma in Computer Application', issuer: 'Apollo Computer Education', date: 'July 2021', certificateLink: '/certificate/cs.jpg' },
  { title: 'Face Recognition Application', issuer: 'GUVI', date: 'April 2021', certificateLink: '/certificate/guvi.png' },
  { title: 'IoT Foundations', issuer: 'SP Robotics Maker Lab', date: 'May 2019', certificateLink: '/certificate/sp.png' },
];

export const navItems = [
  { name: 'Work', href: '#work' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Recognition', href: '#recognition' },
  { name: 'Contact', href: '#contact' },
];
