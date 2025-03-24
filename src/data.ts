import type { Course, TeamMember } from './types';
import courseraImg from './images/coursera.jpg';
import stanfordImg from './images/stanford.jpg';


export const courses: Course[] = [
  // EDx Courses
  {
    id: 1,
    title: "Advanced Machine Learning",
    description: "Master the fundamentals of ML algorithms and practical applications",
    rating: 4.8,
    price: 99.99,
    image: "https://images.cdn.edx.org/post71-edx-logo-registered-elm.png?_gl=1*6zzr86*_ga*MjEwNTQzMDE4MC4xNzQyNzg0OTg2*_ga_D3KS4KMDT0*MTc0Mjc4NDk4Ni4xLjAuMTc0Mjc4NDk4Ni42MC4wLjA.",
    platform: "edx"
  },
  {
    id: 2,
    title: "Data Science Essentials",
    description: "Learn statistical analysis and data visualization techniques",
    rating: 4.6,
    price: 79.99,
    image: "https://images.cdn.edx.org/post71-edx-logo-registered-elm.png?_gl=1*6zzr86*_ga*MjEwNTQzMDE4MC4xNzQyNzg0OTg2*_ga_D3KS4KMDT0*MTc0Mjc4NDk4Ni4xLjAuMTc0Mjc4NDk4Ni42MC4wLjA.",
    platform: "edx"
  },
  {
    id: 3,
    title: "Cybersecurity Fundamentals",
    description: "Build a strong foundation in network security and threat prevention",
    rating: 4.9,
    price: 129.99,
    image: "https://images.cdn.edx.org/post71-edx-logo-registered-elm.png?_gl=1*6zzr86*_ga*MjEwNTQzMDE4MC4xNzQyNzg0OTg2*_ga_D3KS4KMDT0*MTc0Mjc4NDk4Ni4xLjAuMTc0Mjc4NDk4Ni42MC4wLjA.",
    platform: "edx"
  },
  {
    id: 4,
    title: "Full Stack Web Development",
    description: "Learn to build modern web applications from front to back",
    rating: 4.7,
    price: 89.99,
    image: "https://images.cdn.edx.org/post71-edx-logo-registered-elm.png?_gl=1*6zzr86*_ga*MjEwNTQzMDE4MC4xNzQyNzg0OTg2*_ga_D3KS4KMDT0*MTc0Mjc4NDk4Ni4xLjAuMTc0Mjc4NDk4Ni42MC4wLjA.",
    platform: "edx"
  },
  {
    id: 5,
    title: "Business Analytics",
    description: "Master data-driven decision making for business strategies",
    rating: 4.5,
    price: 84.99,
    image: "https://images.cdn.edx.org/post71-edx-logo-registered-elm.png?_gl=1*6zzr86*_ga*MjEwNTQzMDE4MC4xNzQyNzg0OTg2*_ga_D3KS4KMDT0*MTc0Mjc4NDk4Ni4xLjAuMTc0Mjc4NDk4Ni42MC4wLjA.",
    platform: "edx"
  },
  
  // Coursera Courses
  {
    id: 6,
    title: "Deep Learning Specialization",
    description: "Master deep neural networks and AI fundamentals with PyTorch",
    rating: 4.9,
    price: 49.99,
    image: courseraImg,
    platform: "coursera"
  },
  {
    id: 7,
    title: "Product Management Essentials",
    description: "Learn the core skills required for successful product development",
    rating: 4.7,
    price: 39.99,
    image: courseraImg,
    platform: "coursera"
  },
  {
    id: 8,
    title: "UX Research and Design",
    description: "Create effective user experiences through research-driven design",
    rating: 4.8,
    price: 44.99,
    image: courseraImg,
    platform: "coursera"
  },
  {
    id: 9,
    title: "Financial Markets",
    description: "Understand global financial markets and investment strategies",
    rating: 4.6,
    price: 54.99,
    image: courseraImg,
    platform: "coursera"
  },
  {
    id: 10,
    title: "Python for Data Science",
    description: "Apply Python programming to data analysis and visualization",
    rating: 4.9,
    price: 59.99,
    image: courseraImg,
    platform: "coursera"
  },
  
  // Khan Academy Courses
  {
    id: 11,
    title: "Calculus Fundamentals",
    description: "Master limits, derivatives, and integrals with practical applications",
    rating: 4.8,
    price: 0,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    platform: "khan-academy"
  },
  {
    id: 12,
    title: "Computer Programming Basics",
    description: "Learn JavaScript from scratch with interactive coding exercises",
    rating: 4.7,
    price: 0,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
    platform: "khan-academy"
  },
  {
    id: 13,
    title: "Biology Essentials",
    description: "Explore cellular biology, genetics, and evolutionary principles",
    rating: 4.9,
    price: 0,
    image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800",
    platform: "khan-academy"
  },
  {
    id: 14,
    title: "World History",
    description: "Comprehensive overview of major historical events and civilizations",
    rating: 4.6,
    price: 0,
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800",
    platform: "khan-academy"
  },
  {
    id: 15,
    title: "Microeconomics",
    description: "Understand economic principles and decision-making processes",
    rating: 4.8,
    price: 0,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    platform: "khan-academy"
  },
  
  // Stanford Education Courses
  {
    id: 16,
    title: "Machine Learning",
    description: "Stanford's renowned course on machine learning algorithms",
    rating: 4.9,
    price: 199.99,
    image: stanfordImg,
    platform: "stanford"
  },
  {
    id: 17,
    title: "Artificial Intelligence",
    description: "Advanced AI concepts and applications in modern computing",
    rating: 4.8,
    price: 219.99,
    image: stanfordImg,
    platform: "stanford"
  },
  {
    id: 18,
    title: "Cryptography",
    description: "Secure communication techniques and modern cryptographic systems",
    rating: 4.7,
    price: 189.99,
    image: stanfordImg,
    platform: "stanford"
  },
  {
    id: 19,
    title: "Computer Vision",
    description: "Image processing and computational understanding of visual data",
    rating: 4.9,
    price: 209.99,
    image: stanfordImg,
    platform: "stanford"
  },
  {
    id: 20,
    title: "Human-Computer Interaction",
    description: "Design and evaluation of interactive computing systems",
    rating: 4.6,
    price: 179.99,
    image: stanfordImg,
    platform: "stanford"
  },
  
  // Roadmap.sh Courses
  {
    id: 21,
    title: "Frontend Developer Path",
    description: "Complete guide to becoming a professional frontend developer",
    rating: 4.8,
    price: 29.99,
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&q=80&w=800",
    platform: "roadmap-sh"
  },
  {
    id: 22,
    title: "Backend Developer Path",
    description: "Step-by-step guide to backend development with Node.js",
    rating: 4.7,
    price: 29.99,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    platform: "roadmap-sh"
  },
  {
    id: 23,
    title: "DevOps Engineer Path",
    description: "Comprehensive guide to becoming a DevOps professional",
    rating: 4.9,
    price: 39.99,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=800",
    platform: "roadmap-sh"
  },
  {
    id: 24,
    title: "Data Scientist Path",
    description: "Complete roadmap to becoming a data science professional",
    rating: 4.8,
    price: 34.99,
    image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800",
    platform: "roadmap-sh"
  },
  {
    id: 25,
    title: "Blockchain Developer Path",
    description: "Comprehensive guide to developing blockchain applications",
    rating: 4.6,
    price: 39.99,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
    platform: "roadmap-sh"
  }
];

export const teamMembers: TeamMember[] = [
  {
    name: "Keshav Arri",
    role: "Full Stack Engineer",
    github: "https://github.com/keshav0375",
    linkedin: "https://www.linkedin.com/in/keshav-kumar-arri/"
  },
  {
    name: "Prabh Pardhaan",
    role: "UI/UX Designer",
    github: "https://github.com/sarahj",
    linkedin: "https://linkedin.com/in/sarahj"
  },
  {
    name: "Akshat Sehgal",
    role: "Backend Engineer",
    github: "https://github.com/mrodriguez",
    linkedin: "https://linkedin.com/in/mrodriguez"
  },
  {
    name: "Naman Goyal",
    role: "Backend Developer",
    github: "https://github.com/emilyzhang",
    linkedin: "https://linkedin.com/in/emilyzhang"
  },
  {
    name: "Dhruv Patel",
    role: "Product Manager",
    github: "https://github.com/davidkim",
    linkedin: "https://linkedin.com/in/davidkim"
  }
];

export const features = [
  {
    title: "Smart Course Recommendations",
    description: "AI-powered suggestions based on your interests and goals"
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics"
  },
  {
    title: "Expert Reviews",
    description: "In-depth analysis from industry professionals"
  },
  {
    title: "Interactive Learning Paths",
    description: "Customized roadmaps for your career goals"
  },
  {
    title: "Community Support",
    description: "Connect with peers and mentors in your field"
  }
];