const GlobalStyles = () => {
  return (
    <style>{`
      body {
        font-family: 'Cairo', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      canvas {
        cursor: default;
      }
      
      #doctorCardCanvas {
        cursor: text !important;
      }
      html {
        scroll-behavior: smooth;
      }
      .teal-grid-background {
        background-color: #115e59;
        background-image:
          linear-gradient(rgba(20, 210, 197, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20, 210, 197, 0.07) 1px, transparent 1px);
        background-size: 30px 30px;
      }
      .hero-bg {
        background-color: #f8fafc;
        position: relative;
        overflow: hidden;
        min-height: 100vh;
      }
      .waves {
        position: relative;
        width: 100%;
        height: 15vh;
        min-height: 100px;
        max-height: 150px;
      }
      .parallax > use {
        animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
      }
      .parallax > use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
      }
      .parallax > use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
      }
      .parallax > use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
      }
      .parallax > use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
      }
      @keyframes move-forever {
        0% {
          transform: translate3d(-90px,0,0);
        }
        100% { 
          transform: translate3d(85px,0,0);
        }
      }
      
      /* Additional Professional Enhancements */
      .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Smooth scrolling for all elements */
      * {
        scroll-behavior: smooth;
      }
      
      /* Enhanced focus states for accessibility */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible {
        outline: 2px solid #14b8a6;
        outline-offset: 2px;
        border-radius: 8px;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #14b8a6, #0d9488);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #0d9488, #0f766e);
      }
    `}</style>
  );
};

export default GlobalStyles;
