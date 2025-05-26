import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the styles
import './styles.css';

// Import assets
import logo from './logo.svg';
import poweredByLogo from './poweredbymegaetharg.jpg';
import litepaper from './Litepaper MegaLucky.pdf';

// LaunchAppButton component
const LaunchAppButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/app')}
      className="launch-app-btn neon-btn"
    >
      Launch App
    </button>
  );
};

const Project: React.FC = () => {


  useEffect(() => {
    // Add the typing animation effect
    const typingText = document.querySelector('.typing');
    const text = "A new way to grow together.";
    let currentText = "";
    let isDeleting = false;
    let typingSpeed = 100;
    let pauseTime = 2000;

    function type() {
      if (isDeleting) {
        currentText = text.substring(0, currentText.length - 1);
      } else {
        currentText = text.substring(0, currentText.length + 1);
      }

      if (typingText) {
        typingText.textContent = currentText;
      }

      if (!isDeleting && currentText === text) {
        isDeleting = true;
        typingSpeed = pauseTime;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        typingSpeed = 100;
      } else if (isDeleting) {
        typingSpeed = 50;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 500);

    // Handle floating circles animation
    const circles = document.querySelectorAll('.floating-circle');
    const hero = document.querySelector('.hero');

    if (hero) {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (hero as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;

        circles.forEach((circle, index) => {
          const htmlCircle = circle as HTMLElement;
          const speed = (index + 1) * 0.1;
          const offsetX = (x - rect.width / 2) * speed;
          const offsetY = (y - rect.height / 2) * speed;
          
          htmlCircle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
      };

      const handleMouseLeave = () => {
        circles.forEach((circle) => {
          const htmlCircle = circle as HTMLElement;
          htmlCircle.style.transform = 'translate(0, 0)';
        });
      };

      hero.addEventListener('mousemove', handleMouseMove);
      hero.addEventListener('mouseleave', handleMouseLeave);

      // Handle dropdown interactions
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
          dropdown.classList.add('active');
        });
        
        const content = dropdown.querySelector('.dropdown-content');
        if (content) {
          content.addEventListener('mouseenter', () => {
            dropdown.classList.add('active');
          });
          
          content.addEventListener('mouseleave', () => {
            setTimeout(() => {
              if (!(dropdown as HTMLElement).matches(':hover')) {
                dropdown.classList.remove('active');
              }
            }, 100);
          });
        }
        
        dropdown.addEventListener('mouseleave', () => {
          const content = dropdown.querySelector('.dropdown-content');
          if (content) {
            setTimeout(() => {
              if (!(content as HTMLElement).matches(':hover')) {
                dropdown.classList.remove('active');
              }
            }, 100);
          }
        });
      });

      return () => {
        hero.removeEventListener('mousemove', handleMouseMove);
        hero.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div className="futuristic-theme">
      <div className="background futuristic-bg"></div>
      <header className="glass-effect">
        <nav className="nav-container">
          <div className="logo-container glass-card">
            <img src={logo} alt="MegaLucky Logo" className="logo-img glow-effect" />
            <span className="project-name neon-text">MegaLucky</span>
          </div>
          <ul className="nav-links glass-effect">
            <li className="dropdown">
              <a href="#documentation">Documentation</a>
              <ul className="dropdown-content">
                <li><a href={litepaper} target="_blank" rel="noopener noreferrer">Litepaper</a></li>
                <li><a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#community">Community</a>
              <ul className="dropdown-content">
                <li><a href="https://x.com/MegaLucky_" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://discord.gg/m3WPhrfGHT" target="_blank" rel="noopener noreferrer">Discord</a></li>
                <li><a href="https://www.linkedin.com/in/megalucky-lucky-364a75362/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#partnership">Partnership</a>
              <ul className="dropdown-content">
                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSduWcpNYTNleVBE72qPGVGUtLry0F69iXXTMq1od4rVDJvmdg/viewform?usp=sharing&ouid=117445146190496305076" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              </ul>
            </li>
            <li>
              <LaunchAppButton />
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section id="home" className="hero card glass-card">
          <div className="interactive-decoration">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="floating-circle"></div>
            ))}
          </div>
          <h1 className="hero-title gradient-text">The next generation of online interactions</h1>
          <p className="typing-text glass-effect"><span className="typing"></span></p>
          <LaunchAppButton />
        </section>

        <section id="projects" className="projects card glass-card">
          <h2 className="section-title gradient-text">Testnet</h2>
          <p className="section-subtitle">Coming soon</p>
          <div className="project-grid">
            {/* Add your projects here */}
          </div>
        </section>

        <section id="about" className="about card glass-card">
          <h2 className="section-title gradient-text">About Us</h2>
          <p className="section-text">
            MegaLucky is much more than a simple platform for raffles, sweepstakes or contests. 
            It is a movement which wants to decentralize the possibilities, providing options, 
            to all people, to grow and develop in a fair environment because without opportunities 
            there is no meritocracy...
          </p>
          <br />
          <p className="section-text">Sometimes you have to have a little bit of luck ;)</p>
          <p className="signature">- MegaLucky Team</p>
        </section>

        <section id="contact" className="contact card glass-card">
          <h2 className="section-title gradient-text">Contact Us</h2>
          <p className="section-subtitle">Interested in working together? Contact us!</p>
          <p className="contact-email">megaluckyteam@gmail.com</p>
        </section>
      </main>

      <footer className="glass-effect">
        <div className="footer-content">
          <div className="footer-left glass-card">
            <img src={poweredByLogo} alt="Powered by MegaEthArg" className="footer-logo glow-effect" />
          </div>
          <div className="footer-right">
            <p className="copyright">&copy; 2025 MegaLucky. All rights reserved.</p>
            <div className="social-links">
              {/* Add your social media links here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Project;