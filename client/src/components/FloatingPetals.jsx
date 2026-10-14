import React, { useEffect, useRef } from 'react';

export default function FloatingPetals() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rose petals and glowing heart particles
    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 0.8 + 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.15,
        isHeart: Math.random() > 0.5
      });
    }

    const drawHeart = (x, y, size, opacity, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(
        -size / 2,
        -size / 2,
        -size,
        topCurveHeight / 3,
        0,
        size
      );
      // top right curve
      ctx.bezierCurveTo(
        size,
        topCurveHeight / 3,
        size / 2,
        -size / 2,
        0,
        topCurveHeight
      );
      ctx.fillStyle = `rgba(244, 63, 94, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (x, y, size, opacity, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.6, size * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 113, 133, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.6 + p.speedX;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size, p.opacity, p.angle);
        } else {
          drawPetal(p.x, p.y, p.size, p.opacity, p.angle);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
