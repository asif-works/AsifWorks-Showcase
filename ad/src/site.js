// HTML reconstruction of the asifworks.online Home page, built from the live
// Elementor layout (real copy, colours and fonts). Image areas are neutral panels
// because the container could not download the site's images.
// Drop real screenshots into assets/screenshots/ and they replace this automatically.
(function () {
  const services = [
    ['WordPress Website Design', 'Professional, responsive WordPress websites for businesses, portfolios, blogs and online brands.'],
    ['SEO & Digital Marketing', 'SEO-focused site structure, content optimization and digital marketing support to help your website become easier to find.'],
    ['Content Writing', 'Clear, useful and SEO-friendly articles, website copy and blog content.'],
    ['Graphic & Visual Design', 'Clean visual assets and design support for websites, brands and digital content.'],
    ['eCommerce Websites', 'Professional online stores built for easy browsing, responsive design and clear product presentation.'],
    ['AI-Assisted Creative Solutions', 'Thoughtful use of AI tools to support content creation, visual concepts, research and creative workflows.'],
  ];
  const concepts = [
    ['Healthcare · Concept project', 'Healthcare Website Concept', 'A concept homepage for a clinic, with appointment booking and clear service highlights.', 'c1'],
    ['eCommerce · Concept project', 'Sports eCommerce Concept', 'A concept homepage for a sports shoes and clothing store with clear category shortcuts.', 'c2'],
    ['Business Website · Concept project', 'Digital Agency Concept', 'A concept homepage for a digital agency presenting web design, SEO and social media services.', 'c3'],
    ['Travel & Hospitality · Concept project', 'Travel & Hotel Concept', 'A concept homepage for a resort, with a booking search bar and clear calls to action.', 'c4'],
  ];
  const why = ['Clean, professional design', 'Mobile-friendly, responsive layouts', 'SEO-conscious site structure', 'User-friendly navigation and layouts', 'Clear communication throughout the project', 'Attention to detail', 'Modern tools and AI-assisted workflows', 'Solutions tailored to each project'];
  const types = ['Business Websites', 'eCommerce Websites', 'Health & Fitness Websites', 'Personal Brands & Portfolios', 'Blogs & Content Websites', 'Service Businesses'];

  function siteHTML(mobile) {
    return `
<div class="aw ${mobile ? 'aw-m' : ''}">
  <header class="aw-nav">
    <div class="aw-logo">ASIF<span>WORKS</span></div>
    ${mobile ? '<div class="aw-burger"><i></i><i></i><i></i></div>' : `
    <nav><a class="on">Home</a><a>About us</a><a>Portfolio</a><a>Contact</a></nav>
    <a class="aw-btn aw-btn-sm">Let’s Work Together</a>`}
  </header>
  <section class="aw-hero" data-sec="hero">
    <div class="aw-hero-copy">
      <p class="aw-eyebrow" data-load>WORDPRESS • SEO • DIGITAL DESIGN</p>
      <h1 data-load>Websites Designed to Look Better, Work Smarter &amp; Grow.</h1>
      <p class="aw-lead" data-load>As a WordPress web designer, I create responsive websites focused on clean design, user experience, SEO and performance. I’m based in Qatar and work with clients remotely, worldwide.</p>
      <div class="aw-ctas" data-load><a class="aw-btn">View My Work</a><a class="aw-btn aw-btn-ghost">Let’s Work Together</a></div>
      <p class="aw-strip" data-load>WordPress • Responsive Design • SEO • Digital Content</p>
    </div>
    <div class="aw-hero-media" data-load><div class="aw-img aw-img-hero"></div></div>
  </section>
  <section class="aw-sec aw-about" data-sec="about">
    <p class="aw-kicker">About me</p>
    <h2>Building Websites with Purpose, Not Just Pixels</h2>
    <div class="aw-div"></div>
    <div class="aw-about-grid">
      <p>I’m a WordPress web designer focused on creating professional websites that are visually polished, easy to use and built around your business goals. I combine modern design with practical functionality to help businesses create a strong and trustworthy online presence.</p>
      <div class="aw-img aw-img-about"></div>
      <p>From eCommerce stores to health and fitness brands, I build fast, responsive and SEO-friendly websites designed to support real business goals. I focus on clear structure and trustworthy design that helps businesses attract the right visitors and build a strong foundation online.</p>
    </div>
  </section>
  <section class="aw-sec aw-services" data-sec="services">
    <h2>Website Design &amp; Digital Services</h2>
    <p class="aw-sub">Practical support for businesses, personal brands and online stores</p>
    <div class="aw-div"></div>
    <div class="aw-cards">${services.map(([h, p]) => `<div class="aw-card"><div class="aw-ico"></div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
  </section>
  <section class="aw-sec aw-why" data-sec="why">
    <div class="aw-img aw-img-why"></div>
    <div><h2>Why Work With Me</h2><p class="aw-sub">Practical, well-built websites and clear communication from first idea to launch.</p>
    <ul>${why.map((w) => `<li>${w}</li>`).join('')}</ul></div>
  </section>
  <section class="aw-sec aw-concepts" data-sec="concepts">
    <h2>Selected Website Concepts</h2>
    <p class="aw-sub">Website design concepts for healthcare, eCommerce, business and travel brands</p>
    <div class="aw-div"></div>
    <div class="aw-pgrid">${concepts.map(([tag, h, p, c]) => `<div class="aw-proj"><div class="aw-img aw-${c}"></div><p class="aw-tag">${tag}</p><h3>${h}</h3><p>${p}</p><a class="aw-btn aw-btn-sm" data-proj>View Project</a></div>`).join('')}</div>
  </section>
  <section class="aw-sec aw-types" data-sec="types">
    <h2>Types of Websites I Build</h2>
    <p class="aw-sub">From small business sites to online stores, I work across a range of website types.</p>
    <ul>${types.map((t) => `<li>${t}</li>`).join('')}</ul>
  </section>
  <section class="aw-cta" data-sec="cta">
    <h2>Have a project in mind?</h2>
    <p>Let’s build a professional website that fits your goals, brand and audience.</p>
    <a class="aw-btn" data-start>Start a Project</a>
  </section>
</div>`;
  }

  window.AW_SITE = { siteHTML };
})();
