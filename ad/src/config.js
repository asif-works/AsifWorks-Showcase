// Single source of truth for timing, script and brand values.
// Edit timings here; the visuals, captions, music ducking and export all read from it.
window.AD_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  duration: 30,

  // Palette taken from the live asifworks.online Elementor layout (Home page).
  brand: {
    espresso: '#14110E',
    charcoal: '#252424',
    bronze: '#975806',
    gold: '#A7842B',
    goldMuted: '#927231',
    goldLight: '#D9B76A',
    sand: '#F2E1C4',
    cream: '#FFF6E1',
    paper: '#FFFBF6',
    url: 'asifworks.online',
  },

  scenes: [
    { id: 1, name: 'Hook', start: 0, end: 4 },
    { id: 2, name: 'First impression', start: 4, end: 9 },
    { id: 3, name: 'ASIFWORKS', start: 9, end: 16 },
    { id: 4, name: 'Services', start: 16, end: 23 },
    { id: 5, name: 'Call to action', start: 23, end: 30 },
  ],

  // Voiceover script with target in/out points (seconds).
  // `caption: false` = the line is already on screen as designed typography.
  vo: [
    { id: 1, start: 0.35, end: 3.2, caption: false, text: 'Your business deserves more than just a website.' },
    { id: 2, start: 4.3, end: 8.2, caption: false, text: 'It deserves a digital presence that makes an impression.' },
    { id: 3, start: 9.3, end: 15.3, caption: true, text: 'At ASIFWORKS, I create modern, responsive websites built around your business.' },
    { id: 4, start: 16.4, end: 22.4, caption: true, text: 'From WordPress development to SEO-friendly design and website optimization.' },
    { id: 5, start: 23.1, end: 25.8, caption: false, text: 'Explore my portfolio and send your inquiry today.' },
    { id: 6, start: 26.0, end: 27.5, caption: false, text: 'ASIFWORKS dot online.' },
    { id: 7, start: 28.0, end: 29.5, caption: false, text: 'Let’s build something exceptional.' },
  ],

  services: [
    'Professional Website Design',
    'WordPress Website Development',
    'Responsive & Mobile-Friendly Websites',
    'SEO-Friendly Website Setup',
    'Website Redesign',
    'Speed & Performance Optimization',
  ],
  serviceStart: 16.25,
  serviceStep: 1.1,

  // Optional real assets. Missing files are skipped, so the preview works without them.
  assets: {
    screenshotDesktop: 'assets/screenshots/home-desktop.png', // full-page, 1440px wide
    screenshotMobile: 'assets/screenshots/home-mobile.png', // full-page, 390px wide
    voiceFull: 'assets/audio/voiceover.wav', // one 30s file aligned to 0:00
    voiceLines: 'assets/audio/vo/line{n}.mp3', // or one file per line, placed at vo[n].start
    music: 'assets/audio/music.mp3', // licensed track; replaces the built-in score if present
  },

  mix: {
    musicLevel: 0.9,
    duckedLevel: 0.38, // music level under narration
    voiceLevel: 1.0,
  },
};
