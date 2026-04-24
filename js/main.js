/* ===================================================================
 * Monica 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

    const cfg = {

        // MailChimp URL
        mailChimpURL : 'https://facebook.us1.list-manage.com/subscribe/post?u=1abf75f6981256963a47d197a&amp;id=37c6d8f4d6' 

    };


   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const siteBody = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');
        
        window.addEventListener('load', function() {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            
            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    siteBody.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });
        });

    }; // end ssPreloader


   /* mobile menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const mainNavWrap = document.querySelector('.s-header__nav');
        const siteBody = document.querySelector('body');

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {

            link.addEventListener("click", function(event) {

                // at 900px and below
                if (window.matchMedia('(max-width: 900px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 900px
            if (window.matchMedia('(min-width: 901px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains('is-clicked')) toggleButton.classList.remove('is-clicked');
            }
        });

    }; // end ssMobileMenu


   /* swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const homeSliderSwiper = new Swiper('.home-slider', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 40
                },
                // when window width is > 1330px
                1331: {
                    slidesPerView: 3,
                    spaceBetween: 48
                },
                // when window width is > 1773px
                1774: {
                    slidesPerView: 4,
                    spaceBetween: 48
                }
            }
        });

        const pageSliderSwiper = new Swiper('.page-slider', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 40
                },
                // when window width is > 1240px
                1241: {
                    slidesPerView: 3,
                    spaceBetween: 48
                }
            }
        });

    }; // end ssSwiper


   /* mailchimp form
    * ---------------------------------------------------- */ 
    const ssMailChimpForm = function() {

        const mcForm = document.querySelector('#mc-form');

        if (!mcForm) return;

        // Add novalidate attribute
        mcForm.setAttribute('novalidate', true);

        // Field validation
        function hasError(field) {

            // Don't validate submits, buttons, file and reset inputs, and disabled fields
            if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

            // Get validity
            let validity = field.validity;

            // If valid, return null
            if (validity.valid) return;

            // If field is required and empty
            if (validity.valueMissing) return 'Please enter an email address.';

            // If not the right type
            if (validity.typeMismatch) {
                if (field.type === 'email') return 'Please enter a valid email address.';
            }

            // If pattern doesn't match
            if (validity.patternMismatch) {

                // If pattern info is included, return custom error
                if (field.hasAttribute('title')) return field.getAttribute('title');

                // Otherwise, generic error
                return 'Please match the requested format.';
            }

            // If all else fails, return a generic catchall error
            return 'The value you entered for this field is invalid.';

        };

        // Show error message
        function showError(field, error) {

            // Get field id or name
            let id = field.id || field.name;
            if (!id) return;

            let errorMessage = field.form.querySelector('.mc-status');

            // Update error message
            errorMessage.classList.remove('success-message');
            errorMessage.classList.add('error-message');
            errorMessage.innerHTML = error;

        };

        // Display form status (callback function for JSONP)
        window.displayMailChimpStatus = function (data) {

            // Make sure the data is in the right format and that there's a status container
            if (!data.result || !data.msg || !mcStatus ) return;

            // Update our status message
            mcStatus.innerHTML = data.msg;

            // If error, add error class
            if (data.result === 'error') {
                mcStatus.classList.remove('success-message');
                mcStatus.classList.add('error-message');
                return;
            }

            // Otherwise, add success class
            mcStatus.classList.remove('error-message');
            mcStatus.classList.add('success-message');
        };

        // Submit the form 
        function submitMailChimpForm(form) {

            let url = cfg.mailChimpURL;
            let emailField = form.querySelector('#mce-EMAIL');
            let serialize = '&' + encodeURIComponent(emailField.name) + '=' + encodeURIComponent(emailField.value);

            if (url == '') return;

            url = url.replace('/post?u=', '/post-json?u=');
            url += serialize + '&c=displayMailChimpStatus';

            // Create script with url and callback (if specified)
            var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
            var script = window.document.createElement( 'script' );
            script.src = url;

            // Create global variable for the status container
            window.mcStatus = form.querySelector('.mc-status');
            window.mcStatus.classList.remove('error-message', 'success-message')
            window.mcStatus.innerText = 'Submitting...';

            // Insert script tag into the DOM
            ref.parentNode.insertBefore( script, ref );

            // After the script is loaded (and executed), remove it
            script.onload = function () {
                this.remove();
            };

        };

        // Check email field on submit
        mcForm.addEventListener('submit', function (event) {

            event.preventDefault();

            let emailField = event.target.querySelector('#mce-EMAIL');
            let error = hasError(emailField);

            if (error) {
                showError(emailField, error);
                emailField.focus();
                return;
            }

            submitMailChimpForm(this);

        }, false);

    }; // end ssMailChimpForm


   /* alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(e) {
                if (e.target.matches('.alert-box__close')) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add('hideit');

                    setTimeout(function() {
                        box.style.display = 'none';
                    }, 500)
                }
            });
        })

    }; // end ssAlertBoxes


    /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop


   /* smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function() {

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssSwiper();
        ssMailChimpForm();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);

const langData = {
    "en": {
        "hero_title": "Hello, I'm Houcine Ait Ali",
        "hero_desc": "I build AI-driven solutions & modern web applications.",
        "about_btn": "More About Me",
        "service_ai": "AI & Automation",
        "project_startup": "Startup Vision 3D",
		 // Navigation & Hero
        "nav_home": "Home",
        "nav_about": "About",
        "nav_services": "certificates",
        "nav_projects": "Projects",
        "nav_contact": "Contact",
        "hero_title": "Hello, I'm Houcine Ait Ali",
        "hero_desc": "I build AI-driven solutions & modern web applications that scale.",
        "hero_btn": "Let's Work Together",

        // About Section
        "about_sub": "Bridging the gap between AI and Web Experience",
        "about_desc": "I am a tech-driven developer specializing in Web Development and AI. I focus on creating innovative solutions like automated workflows and AI-powered platforms.",
        "about_edu": "Currently pursuing Computer Science at FPT Taroudant with certifications from IBM and freeCodeCamp.",
         
    "nav_services": "Certifications", // هادي اللي غاتجي بلاصة Services
    "service_title": "Professional Certifications",
    "cert_ibm": "AI Fundamentals (IBM)",
    "cert_fcc": "Responsive Web Design (freeCodeCamp)",
    "cert_huawei": "AI Innovation Award (Huawei)",
    "view_all": "View All Certificates",

   
        // Services
        "service_title": "High-Impact Services",
        "service_ai_title": "AI & Automation",
        "service_ai_desc": "Integrating LLMs (GPT, RunwayML) and building complex automation workflows using n8n.",
        "service_web_title": "Web Development",
        "service_web_desc": "Developing responsive, high-performance websites using HTML5, CSS3, and JavaScript.",
		"cert_unf_title": "AI for Work and Life",
"cert_unf_desc": "An academic-grade certification from the University of North Florida  validating professional competency in AI applications.",
"cert_unf_stat1": "1 Continuing Education Unit (CEU) ",
"cert_unf_stat2": "University President Endorsed ",
"cert_unf_stat3": "Professional & Lifelong Learning ",
"cert_date_label": "Issued:",
		// Navigation
    "nav_services": "Certifications", 
    
    // Header & Intro
    "service_title": "Professional Certifications",
    "cert_intro_title": "Validating expertise through global standards.",
    "cert_intro_desc": "My learning journey is backed by industry-recognized certifications from world leaders in technology. These credentials verify my skills in AI, Web Development, and innovative problem-solving.",

    // Card 1: IBM
    "cert_ibm": "AI Fundamentals (IBM)",
    "cert_ibm_desc": "Comprehensive certification covering Artificial Intelligence concepts, Machine Learning basics, and IBM Watson tools.",
    
    // Card 2: freeCodeCamp
    "cert_fcc": "Responsive Web Design",
    "cert_fcc_desc": "300+ hours of project-based learning focusing on modern HTML5, CSS3, and mobile-first design principles.",
    
    // Card 3: Huawei
    "cert_huawei": "AI Innovation Award (Huawei)",
    "cert_huawei_desc": "Recognition for innovative AI implementation and technical excellence in the 2025 Northern Africa competition.",
    
    // Card 4: University of North Florida (UNF)
    "cert_unf_title": "AI for Work and Life",
    "cert_unf_desc": "An academic-grade certification from the University of North Florida validating professional competency in AI applications[cite: 3, 4, 6, 7].",
    "cert_unf_stat1": "1 Continuing Education Unit (CEU) ",
    "cert_unf_stat2": "University President Endorsed ",
    "cert_unf_stat3": "Professional & Lifelong Learning ",
    
    // Common Labels
    "cert_date_label": "Issued on:",
    "view_all": "View All Certificates",
		

        // Projects
        "project_title": "Featured Projects",
        "project_startup_desc": "Autonomous AI pipeline for 3D investor pitches (Huawei Competition 2025).",
        "project_eventsal_desc": "Financial market news aggregator and real-time data analysis tool.",

        // Footer & CTA
        "cta_title": "Get started with a consultation today.",
        "footer_bio": "Computer Science student at FPT Taroudant, pushing the boundaries of AI technology.",
		"view_pdf": "View Full PDF",
		"cert_unf_desc": "Professional AI certification from UNF, validating expertise in digital transformation and AI applications[2, 4, 6, 7].",
		"footer_about_title": "About Houcine Ait Ali",
    "footer_about_text": "I am a Computer Science student at FPT Taroudant, deeply invested in the future of Artificial Intelligence. Beyond just coding, I focus on building autonomous systems and AI-powered media platforms. Whether it's competing in the Huawei Developer Competition or developing automated financial tools like Eventsal, I am always pushing the boundaries of what's possible with modern technology.",
		"about_title": "Bridging the gap between AI and Web Experience.",
        "about_desc_1": "I am a tech-driven developer specializing in Web Development and Artificial Intelligence. I focus on creating innovative solutions like automated workflows and AI-powered platforms.",
        "about_desc_2": "With experience in international competitions like the Huawei Developer Competition, I have developed a strong problem-solving mindset. I am passionate about using Large Language Models (LLMs) and tools like n8n to build the next generation of software.",
        "about_desc_3": "Currently, I am pursuing my studies in Computer Science at FPT Taroudant while earning certifications from industry leaders like IBM, freeCodeCamp, and the University of North Florida." ,
		// ... (keep previous translations)
    "exp_title_ai": "AI & Automation",
    "exp_desc_ai": "Integrating LLMs (GPT, RunwayML) and building complex automation workflows using n8n and API integrations to optimize business processes.",
    "exp_title_web": "Web Development",
    "exp_desc_web": "Developing responsive, high-performance websites using HTML5, CSS3, and JavaScript, with a focus on clean code and user experience.",
    "exp_title_data": "Data Analysis",
    "exp_desc_data": "Building platforms like 'Eventsal' to aggregate and analyze real-time financial market news and trading data.",
    "exp_btn": "View All Certificates" ,
		"proj_eventsal_title": "Eventsal - Intelligent Finance",
    "proj_eventsal_short": "AI-driven data aggregator that optimizes information flow for traders.",
    "proj_eventsal_full": "Eventsal uses n8n workflows to aggregate real-time financial market news. It analyzes sentiment and provides automated market notifications to users.Eventsal uses n8n workflows to aggregate real-time financial market news. It analyzes sentiment and provides automated market notificatiEventsal uses n8n workflows to aggregate real-time financial market news. It analyzes sentiment and provides automated market notificationsEventsal uses n8n workflows to aggregate real-time financial market news.  It analyzes sentiment and provides automated market notifications.Eventsal uses n8n workflows to aggregate real-time Eventsal uses n8n workflows to aggregate real-time financial market news.  It analyzes sentiment and provides automated market notifications.financial market news. It analyzes sentiment and provides automated market notifications.",
    "proj_vision_title": "Startup Vision 3D",
    "proj_vision_desc": "Awarded recognition in the Huawei Developer Competition 2025. It automates 3D cinematic pitches using GPT, RunwayML, and ElevenLabs.",
    "learn_more": "Learn More",
		"visit": "visit",
    "tech_stack": "Technology Stack",
		"Getkontakt":"",
		"Getin":" Get In Touch",
		"AI":"AI",
		"error":"Error: connecting with assistanse.",
		"cert_aws": "AWS Cloud Security Essentials",
"cert_aws_desc": "Foundational AWS security concepts, covering identity management, data protection, and compliance frameworks."
    
    },
    "de": {
        "hero_title": "Hallo, ich bin Houcine Ait Ali",
        "hero_desc": "Ich entwickle KI-gestützte Lösungen und moderne Webanwendungen.",
        "about_btn": "Mehr über mich",
        "service_ai": "KI & Automatisierung",
        "project_startup": "Startup Vision 3D (DE)",
		// Navigation & Hero
        "nav_home": "Startseite",
        "nav_about": "Über mich",
        "nav_services": "Zertikate",
        "nav_projects": "Projekte",
        "nav_contact": "Kontakt",
        "hero_title": "Hallo, ich bin Houcine Ait Ali",
        "hero_desc": "Ich entwickle KI-gestützte Lösungen und moderne, skalierbare Webanwendungen.",
        "hero_btn": "Zusammenarbeiten",

        // About Section
        "about_sub": "Die Brücke zwischen KI und Web-Erfahrung",
        "about_desc": "Ich bin ein technikorientierter Entwickler, spezialisiert auf Webentwicklung und KI. Mein Fokus liegt auf automatisierten Workflows und KI-Plattformen.",
        "about_edu": "Informatikstudent an der FPT Taroudant mit Zertifizierungen von IBM und freeCodeCamp.",

        // Services
        "service_title": "Herausragende Leistungen",
        "service_ai_title": "KI & Automatisierung",
        "service_ai_desc": "Integration von LLMs (GPT, RunwayML) und Erstellung komplexer n8n-Automatisierungsworkflows.",
        "service_web_title": "Webentwicklung",
        "service_web_desc": "Erstellung responsiver Hochleistungs-Websites mit HTML5, CSS3 und JavaScript.",
          "nav_services": "Zertifikate", // هادي اللي غاتجي بلاصة Leistungen
    "service_title": "Professionelle Zertifizierungen",
    "cert_ibm": "KI-Grundlagen (IBM)",
    "cert_fcc": "Responsive Webdesign",
    "cert_huawei": "KI-Innovationspreis (Huawei)",
    "view_all": "Alle Zertifikate ansehen",
		"cert_unf_title": "KI für Beruf und Alltag",
"cert_unf_desc": "Eine akademische Zertifizierung der University of North Florida , die professionelle Kompetenz in KI-Anwendungen bestätigt.",
"cert_unf_stat1": "1 Fortbildungseinheit (CEU) ",
"cert_unf_stat2": "Vom Universitätspräsidenten bestätigt ",
"cert_unf_stat3": "Berufliches & Lebenslanges Lernen ",
"cert_date_label": "Ausgestellt am:",
        // Projects
        "project_title": "Ausgewählte Projekte",
        "project_startup_desc": "Autonome KI-Pipeline für 3D-Investor-Pitches (Huawei Wettbewerb 2025).",
        "project_eventsal_desc": "Aggregator für Finanzmarktnachrichten und Echtzeit-Datenanalysetool.",

        // Footer & CTA
        "cta_title": "Starten Sie heute mit einer Beratung.",
        "footer_bio": "Informatikstudent an der FPT Taroudant, der die Grenzen der KI-Technologie erweitert.",
		"nav_services": "Zertifikate",
    "service_title": "Professionelle Zertifizierungen",
    "cert_intro_title": "Validierung von Fachwissen durch globale Standards.",
    "cert_intro_desc": "Mein Lernweg wird durch branchenweit anerkannte Zertifizierungen unterstützt. Diese belegen meine Fähigkeiten in KI und Webentwicklung.",
    "cert_ibm": "KI-Grundlagen",
    "cert_ibm_desc": "Umfassende Zertifizierung zu KI-Konzepten, maschinellem Lernen und IBM Watson-Tools.",
    "cert_fcc": "Responsives Webdesign",
    "cert_fcc_desc": "Über 300 Stunden projektbasiertes Lernen mit Fokus auf modernes HTML5, CSS3 und Mobile-First-Design.",
    "cert_huawei": "KI-Entwickler-Wettbewerb",
    "cert_huawei_desc": "Anerkennung für innovative KI-Implementierung und technische Exzellenz beim Wettbewerb 2025.",
		"cert_unf": "KI für Beruf und Alltag (UNF)",
"cert_unf_desc": "Professionelle Zertifizierung der University of North Florida  mit Fokus auf praktische KI-Anwendungen im beruflichen Umfeld.",
		"view_pdf": "Vollständiges PDF ansehen",
		"cert_unf_desc": "Professionelles KI-Zertifikat der UNF, das Kompetenzen in digitaler Transformation und KI-Anwendungen bestätigt[2, 4, 6, 7].",
		"footer_about_title": "Über Houcine Ait Ali",
    "footer_about_text": "Ich bin Informatikstudent an der FPT Taroudant und beschäftige mich intensiv mit der Zukunft der Künstlichen Intelligenz. Über das reine Coding hinaus konzentriere ich mich auf den Bau autonomer Systeme und KI-gestützter Medienplattformen. Ob bei der Huawei Developer Competition oder der Entwicklung automatisierter Finanztools wie Eventsal – ich gehe stets an die Grenzen dessen, was mit moderner Technologie möglich ist.",
// Über mich Section
        "about_title": "Die Brücke zwischen KI und Web-Erfahrung schlagen.",
        "about_desc_1": "Ich bin ein technikorientierter Entwickler, spezialisiert auf Webentwicklung und Künstliche Intelligenz. Mein Fokus liegt auf der Entwicklung innovativer Lösungen wie automatisierte Workflows und KI-gestützte Plattformen.",
        "about_desc_2": "Durch meine Erfahrung in internationalen Wettbewerben wie der Huawei Developer Competition habe ich eine ausgeprägte Problemlösungskompetenz entwickelt. Ich brenne darauf, Large Language Models (LLMs) und Tools wie n8n einzusetzen, um die nächste Generation von Software zu bauen.",
        "about_desc_3": "Derzeit studiere ich Informatik an der FPT Taroudant und erwerbe gleichzeitig Zertifizierungen von Branchenführern wie IBM, freeCodeCamp und der University of North Florida.",
		"exp_title_ai": "KI & Automatisierung",
    "exp_desc_ai": "Integration von LLMs (GPT, RunwayML) und Erstellung komplexer n8n-Automatisierungsworkflows zur Optimierung von Geschäftsprozessen.",
    "exp_title_web": "Webentwicklung",
    "exp_desc_web": "Entwicklung responsiver Hochleistungs-Websites mit HTML5, CSS3 und JavaScript, mit Fokus auf sauberen Code und Nutzererfahrung.",
    "exp_title_data": "Datenanalyse",
    "exp_desc_data": "Entwicklung von Plattformen wie 'Eventsal' zur Aggregation und Analyse von Echtzeit-Finanzmarktnachrichten und Handelsdaten.",
    "exp_btn": "Alle Zertifikate ansehen", // Changed from 'Leistungen'   
		"proj_eventsal_title": "Eventsal - Intelligent Finance",
    "proj_eventsal_short": "KI-gestützter Datenaggregator, der den Informationsfluss für Händler optimiert.",
    "proj_eventsal_full": "Eventsal nutzt n8n-Workflows, um Finanzmarktnachrichten in Echtzeit zu sammeln. Es analysiert die Stimmung und bietet automatisierte Marktbenachrichtigungen.",
    "proj_vision_title": "Startup Vision 3D",
    "proj_vision_desc": "Ausgezeichnet beim Huawei Developer Competition 2025. Automatisiert 3D-Cinematic-Pitches mit GPT, RunwayML und ElevenLabs.",
    "learn_more": "Mehr erfahren",
		"visit": "besuchen",
    "tech_stack": "Technologie-Stack",
		"Getkontakt":"",
		"Getin":"Nehmen Sie Kontakt auf",
		"AI":"KI",
		"error":"Error: Verbindung fehlgeschlagen.",
		"cert_aws": "AWS Cloud Security Essentials",
"cert_aws_desc": "Grundlagen der Cloud-Sicherheit bei AWS, einschließlich Identitätsmanagement, Verschlüsselung und Compliance-Standards.",
		"cert_google_cloud": "Google Cloud: Daten, ML und KI",
"cert_google_cloud_desc": "Grundlagenwissen über Big-Data-Dienste, Machine-Learning-Modelle und KI-Anwendungen im Google Cloud-Ökosystem.",
"view_badge": "Skill Badge anzeigen"
    }
    
};
// دالة فتح المودال
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // منع التمرير في الخلفية
    } else {
        console.error("Modal with ID " + modalId + " not found!");
    }
}

// دالة إغلاق المودال
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // إعادة التمرير
    }
}

// إغلاق المودال عند الضغط خارج المحتوى
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function setLanguage(lang) {
    // 1. حفظ الاختيار فالمتصفح
    localStorage.setItem('selectedLang', lang);

    // 2. تغيير النصوص اللي عندها data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[lang][key]) {
            element.innerText = langData[lang][key];
        }
    });

    // 3. تحديث شكل الأزرار (باش نعرفو شكون اللي مفعل)
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if(lang === 'en') document.getElementById('btn-en').classList.add('active');
    if(lang === 'de') document.getElementById('id-de').classList.add('active');
}

// تشغيل اللغة تلقائيا عند فتح الصفحة
window.onload = () => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang);
};
