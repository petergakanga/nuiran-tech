// Particle system for background animation
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseMoving = false;
        
        this.config = {
            particleCount: 80,
            particleSize: 2,
            connectionDistance: 150,
            mouseInfluence: 100,
            speed: 0.5,
            colors: {
                particle: 'rgba(0, 212, 255, 0.6)',
                connection: 'rgba(0, 212, 255, 0.2)',
                mouseConnection: 'rgba(255, 0, 110, 0.4)'
            }
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                size: Math.random() * this.config.particleSize + 1
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.isMouseMoving = true;
            
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.isMouseMoving = false;
            }, 100);
        });

        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation = true;
            } else {
                this.pauseAnimation = false;
                this.animate();
            }
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Mouse interaction
            if (this.isMouseMoving) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.mouseInfluence) {
                    const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                    particle.vx += (dx / distance) * force * 0.01;
                    particle.vy += (dy / distance) * force * 0.01;
                }
            }

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Ensure minimum speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed < this.config.speed * 0.5) {
                particle.vx += (Math.random() - 0.5) * 0.01;
                particle.vy += (Math.random() - 0.5) * 0.01;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.colors.particle;
            this.ctx.fill();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.config.colors.connection.replace('0.2', opacity * 0.2);
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    drawMouseConnections() {
        if (!this.isMouseMoving) return;

        this.particles.forEach(particle => {
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.config.mouseInfluence) {
                const opacity = 1 - (distance / this.config.mouseInfluence);
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
                this.ctx.strokeStyle = this.config.colors.mouseConnection.replace('0.4', opacity * 0.4);
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (this.pauseAnimation) return;

        this.clear();
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        this.drawMouseConnections();

        requestAnimationFrame(() => this.animate());
    }

    // Public methods for controlling the system
    pause() {
        this.pauseAnimation = true;
    }

    resume() {
        this.pauseAnimation = false;
        this.animate();
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        window.particleSystem = new ParticleSystem('particles-canvas');
    } else {
        // Create a static version for users who prefer reduced motion
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Draw static particles
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 2 + 1;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
                ctx.fill();
            }
        }
    }
});

// Performance optimization: pause particles when page is not visible
document.addEventListener('visibilitychange', () => {
    if (window.particleSystem) {
        if (document.hidden) {
            window.particleSystem.pause();
        } else {
            window.particleSystem.resume();
        }
    }
});

// Responsive particle count based on screen size
function getOptimalParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 40;
    if (width < 1200) return 60;
    return 80;
}

// Update particle count on resize
window.addEventListener('resize', () => {
    if (window.particleSystem) {
        const newCount = getOptimalParticleCount();
        window.particleSystem.updateConfig({ particleCount: newCount });
    }
});

// Export for external use
window.ParticleSystem = ParticleSystem;