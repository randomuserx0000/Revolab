"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ChatWidget from "./components/ChatWidget";

export default function Home() {
  const [primerImageSize, setPrimerImageSize] = useState({ width: 700, height: 500 });
  const [benefitsBgSize, setBenefitsBgSize] = useState('50% auto');
  const [maletaSize, setMaletaSize] = useState({ width: 400, height: 300 });
  
  // Cuenta regresiva - Configura aquí los días iniciales
  const INITIAL_DAYS = 56;
  const LAUNCH_DATE = new Date(2026, 8, 8); // Fecha de lanzamiento (mes 0-indexado: 8 = septiembre)
  
  const [daysRemaining, setDaysRemaining] = useState(INITIAL_DAYS);
  
  // Estado para controlar la imagen de beneficios
  const [benefitImage, setBenefitImage] = useState('/gentamivina.svg');
  
  // Estado para controlar qué acordeón está abierto
  const [openAccordion, setOpenAccordion] = useState(0);

  // Estado para controlar el width de la imagen de certificaciones
  const [certImageWidth, setCertImageWidth] = useState(400);

  // Función para cambiar acordeón de forma suave
  const handleAccordionChange = (newIndex: number, newImage: string) => {
    if (openAccordion === newIndex) {
      // Si el mismo acordeón está abierto, cerrarlo
      setOpenAccordion(-1);
    } else {
      // Si hay otro abierto, cerrarlo primero
      if (openAccordion !== -1) {
        setOpenAccordion(-1);
        // Esperar a que se cierre antes de abrir el nuevo
        setTimeout(() => {
          setOpenAccordion(newIndex);
          setBenefitImage(newImage);
        }, 350);
      } else {
        // Si no hay ninguno abierto, abrir directamente
        setOpenAccordion(newIndex);
        setBenefitImage(newImage);
      }
    }
  };

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const updateImageSize = () => {
      const width = window.innerWidth;
      
      if (width >= 1200) {
        // Desktop grande
        setPrimerImageSize({ width: 700, height: 500 });
        setBenefitsBgSize('auto 100%');
        setMaletaSize({ width: 700, height: 480 });
      } else if (width >= 1024) {
        // Desktop pequeño
        setPrimerImageSize({ width: 600, height: 430 });
        setBenefitsBgSize('auto 100%');
        setMaletaSize({ width: 700, height: 480 });
      } else if (width >= 768) {
        // Tablet
        setPrimerImageSize({ width: 450, height: 320 });
        setBenefitsBgSize('auto 100%');
        setMaletaSize({ width: 400, height: 300 });
      } else {
        // Mobile (no se muestra pero por si acaso)
        setPrimerImageSize({ width: 300, height: 215 });
        setBenefitsBgSize('0 0');
        setMaletaSize({ width: 400, height: 300 });
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  // Lógica de cuenta regresiva
  useEffect(() => {
    const calculateDaysRemaining = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const launch = new Date(LAUNCH_DATE);
      launch.setHours(0, 0, 0, 0);
      
      const diffTime = launch.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    };

    // Calcular días restantes al cargar
    setDaysRemaining(calculateDaysRemaining());

    // Actualizar cada día a medianoche
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      setDaysRemaining(calculateDaysRemaining());
      
      // Configurar intervalo diario después de la primera medianoche
      const dailyInterval = setInterval(() => {
        setDaysRemaining(calculateDaysRemaining());
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

  // Control de visibilidad de imágenes según viewport
  useEffect(() => {
    const handleRepresentationImages = () => {
      const primaryImage = document.querySelector('.primary-image') as HTMLElement | null;
      const secondaryImage = document.querySelector('.secondary-image') as HTMLElement | null;
      
      if (primaryImage && secondaryImage) {
        if (window.innerWidth >= 1600) {
          primaryImage.style.display = 'block';
          secondaryImage.style.display = 'none';
        } else {
          primaryImage.style.display = 'none';
          secondaryImage.style.display = 'block';
        }
      }
    };

    handleRepresentationImages();
    window.addEventListener('resize', handleRepresentationImages);
    
    return () => window.removeEventListener('resize', handleRepresentationImages);
  }, []);

  // Control de width de imagen de certificaciones según viewport
  useEffect(() => {
    const handleCertificationsImageWidth = () => {
      if (window.innerWidth < 400) {
        setCertImageWidth(280);
      } else {
        setCertImageWidth(400);
      }
    };

    handleCertificationsImageWidth();
    window.addEventListener('resize', handleCertificationsImageWidth);
    
    return () => window.removeEventListener('resize', handleCertificationsImageWidth);
  }, []);

  // Script para detectar y corregir problemas de scroll
  useEffect(() => {
    const fixScrollIssues = () => {
      const container = document.querySelector('.container') as HTMLElement;
      if (container) {
        container.style.overflowY = 'hidden';
      }
      
      // Ocultar scripts posicionados
      const scripts = document.querySelectorAll('script[style*="position: absolute"]');
      scripts.forEach((script, index) => {
        const htmlScript = script as HTMLElement;
        htmlScript.style.display = 'none';
      });
    };

    // Ejecutar después de que la página cargue completamente
    setTimeout(fixScrollIssues, 1000);
    
    return () => {};
  }, []);

  return (
    <>
      <div className="container">
        <header className="header">
          <Image
            src="/Frame 10.png"
            alt="Revolab"
            width={220}
            height={40}
            priority
            unoptimized
            className="logo"
          />
          <nav className="header-nav">
            <a onClick={(e) => { e.preventDefault(); scrollToSection('sobre-nosotros'); }} className="nav-link">Sobre nosotros</a>
            <a onClick={(e) => { e.preventDefault(); scrollToSection('beneficios'); }} className="nav-link">Beneficios</a>
            <a onClick={(e) => { e.preventDefault(); scrollToSection('diferenciales'); }} className="nav-link">Diferenciales</a>
            <a onClick={(e) => { e.preventDefault(); scrollToSection('aliados'); }} className="nav-link">Aliados</a>
          </nav>
          <button className="header-button" onClick={() => window.open('https://wa.me/584142772050', '_blank')}>Quiero contactarlos</button>
        </header>

        {daysRemaining > 0 ? (
          <section className="countdown-banner">
            <div className="countdown-overlay"></div>
            <div className="countdown-content">
              <p className="countdown-label">Faltan</p>
              <h1 className="countdown-days">{daysRemaining} DÍAS</h1>
              <p className="countdown-subtitle">Para que cada centro de salud a nivel nacional cuente con medicinas de nueva generación y calidad certificada en un solo proveedor.</p>
            </div>
          </section>
        ) : (
          <section className="banner">
            <div className="banner-content">
              <Image
                src="/Vector.webp"
                alt="Revolab"
                width={144}
                height={25}
                unoptimized
                className="banner-logo"
              />
              <h1 className="banner-title">Kit de cirugía</h1>
              <p className="banner-subtitle">
                Insumos de medicina para procedimientos<br />en quirófano
              </p>
              <button className="banner-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
            </div>
            <div className="banner-image">
              <Image
                src="/maletabanner.webp"
                alt="Kit de cirugía"
                width={maletaSize.width}
                height={maletaSize.height}
                unoptimized
                className="maleta"
              />
            </div>
          </section>
        )}

        <section id="sobre-nosotros" className="representation">
          <div className="representation-left">
            <div className="representation-logo-box">
              <Image
                src="/Frame 10.png"
                alt="Revolab"
                width={120}
                height={22}
                unoptimized
                className="representation-logo"
              />
              <h2 className="representation-title">Casa de Representación</h2>
            </div>

            <div className="representation-boxes">
              <div className="info-box">
                <h3 className="info-box-title">Visión</h3>
                <p className="info-box-text">
                  Convertirnos en la empresa farmaceutica lider en la reduccion de la progresión de enfermedades crónicas.

                </p>
              </div>

              <div className="info-box">
                <h3 className="info-box-title">Misión</h3>
                <p className="info-box-text">
                 Acelerar la adopcion y el acceso a moleculas mas eficaces para pacientes, proveedores y sistemas de salud.
                </p>
              </div>
            </div>

            <div className="certifications-box">
              <h3 className="certifications-box-title">Certificaciones</h3>
              <p className="certifications-box-text">
               Nuestros Productos y Dispositivos Médicos están registrados y autorizados en Venezuela por el Instituto Nacional de Higiene Rafael Rangel. Adicionalmente, han sido fabricados en laboratorios con certificados en buenas prácticas de manufactura, por Europa y USA. Nuestros fabricantes han registrado productos ante EMA y USFDA.
              </p>
              <div className="certifications-logos">
                <Image src="/Group 23.svg" alt="Seguros" width={400} height={80} unoptimized />
              </div>
            </div>

            
          </div>

          <div className="representation-right">
            <Image
              src="/secondarysection.png"
              alt="Secondary Section"
              width={600}
              height={600}
              unoptimized
              className="representation-image secondary-image"
            />
            <Image
              src="/Group 47.png"
              alt="Group 47"
              width={600}
              height={600}
              unoptimized
              className="representation-image primary-image"
            />
          </div>
        </section>

           <section id="beneficios" className="benefits-section" style={{ backgroundSize: benefitsBgSize } as React.CSSProperties}>
          <h2 className="benefits-title">Beneficios</h2>
          <p className="benefits-subtitle">Nuestra propuesta de valor se basa en cuatro pilares estratégicos</p>

          <div className="benefits-wrapper">
            <div className="benefits-accordion">
            <div className={`accordion-item ${openAccordion === 0 ? 'open' : ''}`}>
              <div 
                className="accordion-summary" 
                onClick={() => handleAccordionChange(0, '/gentamivina.svg')}
              >
                <span>Medicamentos de nueva generación</span>
                <img src="/arrow_forward_ios.svg" alt="Flecha" className="accordion-icon" />
              </div>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  <p>El concepto de medicamentos de nueva generación se refiere a fármacos desarrollados mediante biotecnología avanzada, ingeniería genética o procesos químicos de alta precisión que ofrecen mecanismos de acción más específicos y eficaces que los tratamientos convencionales.</p>
                  <img
                    src="/b37a6abf4db67bce8ce93a284211339861cb72c4.jpg"
                    alt="Medicamentos de nueva generación"
                    className="accordion-mobile-image accordion-mobile-image--zoom"
                  />
                  <button className="accordion-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
                </div>
              </div>
            </div>

            <div className={`accordion-item ${openAccordion === 1 ? 'open' : ''}`}>
              <div 
                className="accordion-summary" 
                onClick={() => handleAccordionChange(1, '/valsartan.svg')}
              >
                <span>Moléculas Combinadas</span>
                <img src="/arrow_forward_ios.svg" alt="Flecha" className="accordion-icon" />
              </div>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  <p>Al disponer en el portafolio de Medicamentos con Moléculas Combinadas, estamos ofreciendo soluciones reales para tratar con una misma dosificación patologías distintas o relacionada. Esto logra tratamientos mas efectivos que resuelven hasta la afección subyacente de las patologías.</p>
                  <img
                    src="/1fcecabe4a3ab346a515bcfd69da8fb70d446a14.jpg"
                    alt="Moléculas combinadas"
                    className="accordion-mobile-image accordion-mobile-image--zoom"
                  />
                  <button className="accordion-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
                </div>
              </div>
            </div>

            <div className={`accordion-item ${openAccordion === 2 ? 'open' : ''}`}>
              <div 
                className="accordion-summary" 
                onClick={() => handleAccordionChange(2, '/empaglifozina.svg')}
              >
                <span>Kits Integrales de Cirugía</span>
                <img src="/arrow_forward_ios.svg" alt="Flecha" className="accordion-icon" />
              </div>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  <p>Suministramos Kits Integrales de Cirugía diseñados a la medida de cada procedimiento quirúrgico, garantizando la máxima eficiencia operativa en el entorno hospitalario.</p>
                  <img
                    src="/e4159b9b30428947d025c263c586a9917ea6adeb.jpg"
                    alt="Kits integrales de cirugía"
                    className="accordion-mobile-image"
                  />
                  <button className="accordion-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
                </div>
              </div>
            </div>

            <div className={`accordion-item ${openAccordion === 3 ? 'open' : ''}`}>
              <div 
                className="accordion-summary" 
                onClick={() => handleAccordionChange(3, '/manito.svg')}
              >
                <span>Farmacovigilancia de Origen</span>
                <img src="/arrow_forward_ios.svg" alt="Flecha" className="accordion-icon" />
              </div>
              <div className="accordion-content">
                <div className="accordion-content-inner">
                  <p>Implementamos un sistema de Farmacovigilancia de Origen que asegura trazabilidad y control integral desde el primer momento, reforzando la seguridad en toda la cadena.</p>
                  <img
                    src="/b8d97faae0a184f78bf737925371f0dd8d866d82.png"
                    alt="Farmacovigilancia de origen"
                    className="accordion-mobile-image"
                  />
                  <button className="accordion-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
                </div>
              </div>
            </div>
            </div>

            <div className="benefits-images">
              <Image
                key={benefitImage}
                src={benefitImage}
                alt="Decoración"
                width={primerImageSize.width}
                height={primerImageSize.height}
                unoptimized
                className="benefits-primer-image"
              />
            </div>
          </div>
        </section>


        
     
        <section id="diferenciales" className="differential-section">
          <h2 className="differential-title">Diferenciadores</h2>
        </section>

        <div className="differential-carousel-wrapper">
          <div className="differential-carousel-container">
            <div className="differential-carousel">
              <div className="differential-slide">
                <div className="differential-card differential-card-1">
                  <div className="differential-icon">
                    <Image
                      src="/Mask group (2).png"
                      alt="Icono"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                  <h3 className="differential-card-title">Portafolio certificado</h3>
                  <p className="differential-card-text">
                    Nuestros productos están fabricados por Laboratorios certificados internacionalmente y registrados en Venezuela
                  </p>
                </div>
              </div>

              <div className="differential-slide">
                <div className="differential-card differential-card-2">
                  <div className="differential-icon">
                    <Image
                      src="/Mask group (2).png"
                      alt="Icono"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                  <h3 className="differential-card-title">Kit de medicina para procedimientos quirúrgicos</h3>
                  <p className="differential-card-text">
                   Contamos con todos los medicamentos necesarios para cualquier procedimiento quirúrgico que requiera anestesia
                  </p>
                </div>
              </div>

              <div className="differential-slide">
                <div className="differential-card differential-card-3">
                  <div className="differential-icon">
                    <Image
                      src="/Mask group (2).png"
                      alt="Icono"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </div>
                  <h3 className="differential-card-title">Salud con criterio médico</h3>
                  <p className="differential-card-text">
                   Fomentamos activamente el uso consciente de Fármacos para el Bienestar del Paciente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="aliados" className="allies-section">
          <h2 className="allies-title">Nuestros Aliados</h2>
        </section>

        <div className="allies-carousel-wrapper">
          <div className="allies-carousel-container">
            <div className="allies-carousel">
              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado1.webp"
                    alt="Aliado 1"
                    width={100}
                    height={100}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado2.webp"
                    alt="Aliado 2"
                    width={100}
                    height={100}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado3.webp"
                    alt="Aliado 3"
                    width={100}  
                    height={100}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado4.webp"
                    alt="Aliado 4"
                    width={120}
                    height={140}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado5.webp"
                    alt="Aliado 5"
                    width={100}
                    height={100}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado6.png"
                    alt="Aliado 6"
                    width={120}
                    height={60}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>

              <div className="allies-slide">
                <div className="allies-card">
                  <Image
                    src="/aliado7.png"
                    alt="Aliado 7"
                    width={100}
                    height={40}
                    unoptimized
                    className="allies-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="staff-section">
          <div className="staff-header">
            <h2 className="staff-title">Staff de Profesional</h2>
            <p className="staff-description">
              Con experiencia en la industria Farmacéutica, Procesos Comerciales Financieros y Logísticos, así como de soporte científico de la Dirección Médica y Asuntos Regulatorios conforman nuestros equipos
            </p>
          </div>
        </section>

        <div className="staff-carousel-section">  
          <div className="carousel-wrapper">
            <div className="carousel-container">
              <div className="carousel">
                <div className="carousel-slide">
                  <div className="slide-card">
                    <div className="slide-image" style={{backgroundImage: 'url(/Direccionmedica.webp)'}}></div>
                    <h3 className="slide-title">Dirección médica</h3>
                  </div>
                </div>

                <div className="carousel-slide">
                  <div className="slide-card">
                    <div className="slide-image" style={{backgroundImage: 'url(/Asuntos%20regulatorios.png)'}}></div>
                    <h3 className="slide-title">Asuntos regulatorios</h3>
                  </div>
                </div>

                <div className="carousel-slide">
                  <div className="slide-card">
                    <div className="slide-image" style={{backgroundImage: 'url(/finanzas.webp)'}}></div>
                    <h3 className="slide-title">Finanzas</h3>
                  </div>
                </div>

                <div className="carousel-slide">
                  <div className="slide-card">
                    <div className="slide-image" style={{backgroundImage: 'url(/comercial.webp)'}}></div>
                    <h3 className="slide-title">Comercial</h3>
                  </div>
                </div>

                <div className="carousel-slide">
                  <div className="slide-card">
                    <div className="slide-image" style={{backgroundImage: 'url(/cadena.webp)'}}></div>
                    <h3 className="slide-title">Cadena de distribución</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="staff-button-container">
              <button className="staff-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Saber más</button>
            </div>
        </div>


        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <Image
                src="/Vector.webp"
                alt="Revolab"
                width={230}
                height={40}
                unoptimized
                className="footer-logo"
              />
              <p className="footer-text">
                Podemos ofrecerte, nuevas generaciones de agentes terapéuticos y moléculas de alta especialidad, con la finalidad de reducir inercia clínica a través de Terapias Combinadas en presentaciones ajustadas a las necesidades del paciente
              </p>

              <div className="contact-buttons">
                <button className="contact-button" onClick={() => window.open('https://wa.me/584142772050', '_blank')}>
                  <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                  </svg>
                  <div className="contact-button-text">
                    <span className="contact-button-label">Director comercial</span>
                    <span className="contact-button-value">+58 414-2772050</span>
                  </div>
                </button>

                <button className="contact-button" onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=consultas@revolab.com', '_blank')}>
                  <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                  </svg>
                  <div className="contact-button-text">
                    <span className="contact-button-label">Correo corporativo</span>
                    <span className="contact-button-value">consultas@revolab.com</span>
                  </div>
                </button>
              </div>

              <div className="footer-social">
                <p className="social-title">Síguenos en nuestras redes</p>
                <div className="social-icons">
                  <a href="#" className="social-link">
                    <img src="/instagram.svg" alt="Instagram" className="social-icon" />
                  </a>
                  <a href="#" className="social-link">
                    <img src="/linkedin.svg" alt="LinkedIn" className="social-icon" />
                  </a>
                  <a href="#" className="social-link">
                    <img src="/facebook.svg" alt="Facebook" className="social-icon" />
                  </a>
                  <a href="#" className="social-link">
                    <img src="/x.svg" alt="X" className="social-icon" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>

      <ChatWidget />

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .container {
          width: 100%;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow-y: hidden;
          overflow-x: hidden;
        }

        .header {
          height: 10dvh;
          background-color: var(--color-7);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          transition: height 200ms ease, padding 200ms ease;
        }

        .logo {
          height: 70%;
          width: 90%;
          max-width: 100%;
          object-fit: contain;
        }

        .header-nav {
          display: none;
        }

        .nav-link {
          display: none;
        }

        .header-button {
          display: none;
        }

        .countdown-banner {
          height: auto;
          min-height: 50vh;
          background-image: url('/backgorund cronomentro.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
        }

        .countdown-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(8px);
          background-color: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .countdown-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }

        .countdown-label {
          font-size: 28px;
          font-weight: 400;
          color: white;
          margin: 0;
          font-family: var(--font-manrope);
          letter-spacing: 2px;
        }

        .countdown-days {
          font-size: 64px;
          font-weight: 700;
          color: white;
          margin: 0;
          font-family: var(--font-manrope);
          line-height: 1;
          letter-spacing: 4px;
        }

        .countdown-subtitle {
          font-size: 18px;
          font-weight: 400;
          color: white;
          width: 70vw;
          margin: 0;
          font-family: var(--font-manrope);
          letter-spacing: 1px;
        }

        .banner {
          height: auto;
          min-height: 80vh;
          background-image: url('/backgroundbanner.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 72px 0px 0;
          position: relative;
          overflow: hidden;
          transition: min-height 240ms ease, padding 240ms ease;
        }

        .banner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          z-index: 2;
        }

        .banner-logo {
          width: 80%;
          max-width: 250px;
          height: auto;
          display: block;
          margin: 0 auto 32px auto;
          filter: brightness(0) invert(1);
        }

        .banner-title {
          font-size: 32px;
          font-weight: 700;
          color: white;
          font-family: var(--font-manrope);
          margin: 0 0 5px 0;
          line-height: 1.2;
        }

        .banner-subtitle {
          font-size: 14px;
          color: white;
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        .banner-button {
          background-color: var(--color-4);
          color: var(--color-6);
          border: none;
          font-family: var(--font-manrope);
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .banner-button:hover {
          transform: scale(1.05);
        }

        .banner-image {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          flex: 1;
          margin-top: 20px;
          min-height: 300px;
        }

        .maleta {
          width: 95%;
          height: auto;
          max-width: 500px;
          max-height: 400px;
          object-fit: contain;
        }

        .representation {
          background-color: #fff;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          height: fit-content;
        }

        .representation-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .representation-logo-box {
          display: flex;
          flex-direction: row;
          align-items:center;
          gap: 12px;
  
        }

        .representation-logo {
          width: auto;
          height: auto;
        }

        .representation-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-2);
          margin: 0;
          font-family: var(--font-manrope);
        }

        .representation-boxes {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-box {
          border: 1px solid var(--color-1);
          border-radius: 8px;
          padding: 8px;
          background-color: white;
        }

        .info-box-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0 0 10px 0;
          font-family: var(--font-manrope);
        }

        .info-box-text {
          font-size: 14px;
          color: var(--color-6);
          line-height: 1.5;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .certifications-box {
          border: 1px solid var(--color-1);
          border-radius: 8px;
          padding: 20px;
          background-color: white;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .certifications-box-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
        }

        .certifications-box-text {
          font-size: 12px;
          color: var(--color-6);
          line-height: 1.5;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .certifications-logos {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 8px;
          width: 100%;
          max-width: 500px;
          transform: scale(1.2)
        }

        .certifications-logos img {
          height: auto;
          width: 100%;
          object-fit: contain;
        }

        .seguros-image-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 10px;
        }

        .seguros-image {
          width: 100%;
          max-width: 400px;
          height: auto;
          object-fit: contain;
        }

        .representation-right {
          display: none;
        }

        .representation-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .staff-section {
          background-color: #Fff;
          padding: 20px 20px 0px 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          min-height: auto;
        }

        .staff-header {
          text-align: start;
        }

        .staff-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0 0 15px 0;
          font-family: var(--font-manrope);
        }

        .staff-description {
          font-size: 14px;
          color: var(--color-6);
          line-height: 1.6;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .staff-carousel-section {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          background: linear-gradient(180deg, #Fff 0%, #Fff 30%, #EEF0F2 30%, #EEF0F2 100%);
          padding: 0;
          position: relative;
        }

        .staff-carousel-section::before {
          content: '';
          position: absolute;
          left: -30;
          bottom: -50;
          width: 400px;
          height: 70%;
          background: url('/fondostaff-section.svg') left center/contain no-repeat;
          opacity: 1;
          pointer-events: none;
          z-index: 0;
        }

        .carousel-wrapper {
          width: 100vw;
          padding: 20px 0;
          position: relative;
          z-index: 1;
        }

        .carousel-container {
          width: 100vw;
          overflow: hidden;
        }

        .carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 24px;
          
        }

        .carousel::-webkit-scrollbar {
          display: none;
        }

        .carousel-slide {
          flex: 0 0 120px;
          scroll-snap-align: start;
          padding-left: 24px;
        }

        .carousel-slide:first-child {
          padding-left: 24px;
        }

        .slide-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .slide-image {
          width: 120px;
          height: 120px;
          background-size: cover;
          background-position: center;
          border-radius: 4px;
          overflow: hidden;
        }

        .slide-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
          text-align: center;
        }

        .staff-button-container{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 0px 60px 0px;
        }
        
        .staff-button{
             background-color: var(--color-1);
          color: #fff;
          border: none;
          font-family: var(--font-manrope);
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          z-index:10;
          transition: transform 0.2s;
        
        }

        .benefits-section {
          background-color: white;
          padding: 60px 20px ;
          display: flex;
          flex-direction: column;
          gap: 20px;
          scroll-behavior: smooth;
        }

        .benefits-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          will-change: auto;
        }

        .benefits-images {
          display: none;
        }

        .benefits-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
          text-align: center;
        }

         .benefits-section {
          background-color: white;
          padding: 60px 20px ;
          display: flex;
          flex-direction: column;
          gap: 20px;
          scroll-behavior: smooth;
          overflow: hidden;
        }

        .benefits-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          will-change: auto;
          overflow: hidden;
          overflow-x: hidden;
        }

        .benefits-subtitle {
          font-size: 14px;
          color: var(--color-6);
          margin: 0 0 20px 0;
          font-family: var(--font-manrope);
          text-align: center;
          line-height: 1.5;
        }

        .benefits-card {
          background-color: white;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .benefits-card-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
        }

        .benefits-card-description {
          font-size: 14px;
          color: var(--color-6);
          line-height: 1.6;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .benefits-card-button {
          background-color: var(--color-4);
          color: var(--color-6);
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: transform 0.2s;
          font-family: var(--font-manrope);
          width: fit-content;
        }

        .benefits-card-button:hover {
          transform: scale(1.05);
        }

        .benefits-accordion {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .accordion-item {
          background-color: white;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .accordion-summary {
          padding: 16px 20px;
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-6);
          font-family: var(--font-manrope);
          user-select: none;
        }

        .accordion-summary::-webkit-details-marker {
          display: none;
        }

        .accordion-icon {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: rotate(90deg);
          object-fit: contain;
          display: inline-block;
          transform-origin: center;
        }

        .accordion-item.open .accordion-icon {
          transform: rotate(-90deg);
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 0;
          padding: 0 20px;
        }

        .accordion-item.open .accordion-content {
          max-height: 400px;
          opacity: 1;
        }

        .accordion-content-inner {
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding-top: 0;
          padding-bottom: 20px;
          transform: translateY(0);
          transition: transform 0.3s ease-in-out;
        }

        .accordion-item:not(.open) .accordion-content-inner {
          transform: translateY(-10px);
        }

        .accordion-content p {
          font-size: 14px;
          color: var(--color-6);
          line-height: 1.6;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .accordion-mobile-image {
          display: none;
        }

        .accordion-button {
          background-color: var(--color-1);
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: transform 0.2s;
          font-family: var(--font-manrope);
          width: fit-content;
        }

        .accordion-button:hover {
          transform: scale(1.05);
        }

        .differential-section {
          background-color: white;
          padding: 0px 20px 20px 20px;
        }

        .differential-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
          text-align: center;
        }

        .differential-carousel-wrapper {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          background-color: white;
          padding: 10px 0 00px 0;
        }

        .differential-carousel-container {
          width: 100vw;
          overflow: hidden;
        }

        .differential-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 24px;
        }

        .differential-carousel::-webkit-scrollbar {
          display: none;
        }

        .differential-slide {
          flex: 0 0 280px;
          scroll-snap-align: start;
          padding-left: 24px;
        }

        .differential-slide:first-child {
          padding-left: 24px;
        }

        .differential-card {
          border-radius: 4px;
          padding: 24px;
          height: 220px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          margin-top: 30px;
        }

        .differential-card-1,
        .differential-card-2,
        .differential-card-3 {
          background: linear-gradient(135deg, #809ed2 0%, #94b3e8 100%);
        }

        .differential-card-1 .differential-icon,
        .differential-card-2 .differential-icon,
        .differential-card-3 .differential-icon {
          background-color: var(--color-1);
        }

        .differential-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -30px;
          left: 25%;
          transform: translateX(-50%);
        }

        .differential-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-6);
          margin: 20px 0 0 0;
          font-family: var(--font-manrope);
        }

        .differential-card-text {
          font-size: 14px;
          color: var(--color-6);
          line-height: 1.6;
          margin: 0;
          font-family: var(--font-manrope);
        }

        .allies-section {
          background-color: #fff;
          padding: 60px 20px 10px 20px;
        }

        .allies-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-6);
          margin: 0;
          font-family: var(--font-manrope);
          text-align: center;
        }

        .allies-carousel-wrapper {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          background-color: #fff;
          padding: 20px 0 60px 0;
          
        }

        .allies-carousel-container {
          width: 100vw;
          overflow: hidden;
        }

        .allies-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 24px;
        }

        .allies-carousel::-webkit-scrollbar {
          display: none;
        }

        .allies-slide {
          flex: 0 0 140px;
          scroll-snap-align: start;
          padding-left: 24px;
        }

        .allies-slide:first-child {
          padding-left: 24px;
        }

        .allies-card {
          width: 140px;
          height: 140px;
          background-color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .allies-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }

        .footer {
          background-color: var(--color-6);
          padding: 40px 20px;
          color: white;
          position: relative;
          overflow: visible;
          overflow-x: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background-image: url('/footer.webp');
          background-size: contain;
          background-position: left;
          background-repeat: no-repeat;
          pointer-events: none;
          opacity: 0;
          z-index: 0;
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          align-items: center;
          text-align:center;
          justify-content: center;
        }

        .footer-logo {
          width: 200px;
          height: auto;
          filter: brightness(0) invert(1);
          display: block;
          margin: 0 auto;
        }

        .footer-text {
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          font-family: var(--font-manrope);
          color: white;
        }

        .contact-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .contact-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border: 1px solid #F7B668;
          border-radius: 20px;
          background-color: transparent;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--font-manrope);
          width: 100%;
        }

        .contact-button:hover {
          background-color: rgba(247, 182, 104, 0.1);
          transform: translateY(-2px);
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: #F7B668;
          flex-shrink: 0;
        }

        .contact-button-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .contact-button-label {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .contact-button-value {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-social {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          border: none;
          padding: 0;
        }

        .social-title {
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          font-family: var(--font-manrope);
          color: white;
        }

        .social-icons {
          display: flex;
          gap: 20px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          transition: opacity 0.2s;
        }

        .social-link:hover {
          opacity: 0.7;
        }

        .social-icon {
          width: 24px;
          height: 24px;
          filter: brightness(0) invert(1);
        }

        @media (min-width: 400px) and (max-width: 767px) {
          .banner-image {
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            flex: 1;
          }
        }

        @media (min-width: 1024px) {
          .differential-carousel {
            justify-content: center;
          }


          .carousel {
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .header,
          .banner,
          .representation {
            transition: none;
          }
        }

        @media (min-width: 768px) {
          .countdown-banner {
            min-height: 60vh;
            padding: 100px 40px;
          }

          .countdown-label {
            font-size: 36px;
          }

          .countdown-days {
            font-size: 96px;
          }

          .countdown-subtitle {
            font-size: 22px;
          }

          .header {
            height: 80px;
            padding: 0 40px;
            justify-content: space-between;
          }

          .logo {
            height: 50px;
            width: auto;
            max-width: 200px;
          }

          .header-button {
            display: block;
            background-color: var(--color-1);
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: var(--font-manrope);
            transition: transform 0.2s;
          }

          .header-button:hover {
            transform: scale(1.05);
          }

          .banner {
            height: auto;
            min-height: 30vh;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            background-size: cover;
            background-position: center;
            padding: 0px;
          }

          .banner-content {
            align-items: flex-start;
            text-align: left;
            max-width: 50%;
            padding: 0px 0px 0px 40px;
            gap: 16px;
          }

          .banner-logo {
            margin: 0 0 24px 0;
            max-width: 180px;
          }

          .banner-title {
            font-size: 48px;
          }

          .banner-subtitle {
            font-size: 16px;
          }

          .banner-image {
            max-width: fit-content;
            margin-top: 0;
            min-height: fit-content;
            flex: 1;
          }

          .maleta {
            width: 100%;
            max-width: 600px;
            max-height: 500px;
          }

          .representation {
            padding: 60px 40px;
            flex-direction: row;
            gap: 40px;
            overflow: visible;
          }

          .representation-left {
            flex: 1;
            max-width: 600px;
          }

          .representation-boxes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .representation-title {
            font-size: 24px;
          }

          .info-box-title {
            font-size: 14px;
          }

          .info-box-text {
            font-size: 12px;
          }

          .certifications-box-title {
            font-size: 14px;
          }

          .certifications-box-text {
            font-size: 11px;
          }

          .seguros-image-box {
            margin-top: 20px;
          }

          .seguros-image {
            max-width: 100%;
          }

          .representation-right {
            display: none;
          }

          .certifications-subtitle {
            font-size: 14px;
          }

          .certifications-image {
            position: relative;
            flex: 0 0 45%;
            max-width: 45%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            z-index: 1;
            margin-top: 0;
          }

          .section-image {
            width: 100%;
            height: auto;
            max-width: 100%;
            max-height: 500px;
            object-fit: contain;
          }

          .staff-section {
            padding: 40px 40px 0 40px;
          }

          .staff-header {
          text-align: center;
        }

          .staff-title {
            font-size: 32px;
          }

          .staff-description {
            font-size: 16px;
          }

          .carousel-wrapper {
            padding: 30px 0;
          }

          .carousel {
            padding: 0 40px;
          }

          .carousel-slide {
            flex: 0 0 200px;
            padding-left: 32px;
          }

          .carousel-slide:first-child {
            padding-left: 32px;
          }

          .slide-image {
            width: 200px;
            height: 200px;
          }

          .slide-title {
            font-size: 18px;
          }

          .staff-button-container {
            padding: 20px 0 80px 0;
          }

          .benefits-section {
            padding: 80px 0;
            gap: 32px;
            position: relative;
            background-color: white;
            background-image: url('/Capa 3.webp');
            background-position: right center;
            background-repeat: no-repeat;
            background-size: 50% auto;
            flex-direction: column;
            align-items: center;
            overflow: visible;
            min-height: 600px;
          }

          .benefits-title {
            font-size: 32px;
            text-align: center;
            padding: 0 40px;
          }

          .benefits-subtitle {
            font-size: 16px;
            max-width: 600px;
            margin: 0 auto 32px auto;
            text-align: center;
            padding: 0 40px;
          }

          .benefits-wrapper {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: flex-end;
            gap: 0;
            position: relative;
          }

          .benefits-accordion {
            flex: 0 0 50%;
            max-width: 50%;
            padding: 0 40px;
            position: relative;
            z-index: 2;
          }

          .benefits-images {
            flex: 0 0 50%;
            max-width: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0;
            margin-right: -40px;
          }

          .benefits-background-image {
            width: 100%;
            max-width: 800px;
            height: 100%;
            object-fit: cover;
            position: relative;
            z-index: 1;
          }

          .benefits-primer-image {
            position: relative;
            width: auto !important;
            height: auto !important;
            max-width: 700px;
            max-height: 500px;
            object-fit: contain;
            z-index: 2;
            opacity: 1;
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
            animation: fadeInScale 0.5s ease-in-out;
          }

          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (min-width: 1024px) {
            .countdown-banner {
              min-height: 70vh;
              padding: 120px 60px;
            }

            .countdown-label {
              font-size: 48px;
            }

            .countdown-days {
              font-size: 128px;
            }

            .countdown-subtitle {
              font-size: 28px;
            }

            .header {
              height: 100px;
              padding: 0 60px;
            }

            .header-nav {
              display: flex;
              gap: 40px;
              align-items: center;
              flex: 1;
              justify-content: center;
            }

            .nav-link {
              display: inline-block;
              color: var(--color-6);
              text-decoration: none;
              font-size: 16px;
              font-weight: 500;
              font-family: var(--font-manrope);
              transition: color 0.2s;
            }

            .nav-link:hover {
              color: var(--color-4);
            }

            .banner {
              min-height: 480px;
              height: auto;
            }

            .banner-image {
              flex: 1.2;
              height: 480px;
            }

            .maleta {
              max-width: 700px;
              max-height: 550px;
            }

            .benefits-primer-image {
              max-width: 700px;
              max-height: 500px;
            }

            .footer {
              overflow: visible;
              overflow-x: hidden;
            }

            .footer::before {
              width: 110vh;
              max-width: 600px;
              opacity: 1;
              background-size: contain;
              background-position: right center;
              right: -80;
              left: auto;
              bottom: -50;
              top: auto;
              transform: scaleX(-1) translateY(-50px) scaleY(1.1);
              z-index: 2;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .benefits-primer-image {
              max-width: 450px;
              max-height: 320px;
            }
          }

          .accordion-summary {
            font-size: 18px;
            padding: 20px 24px;
          }

          .accordion-content {
            padding: 0 24px 0 24px;
          }

          .accordion-content p {
            font-size: 16px;
          }

          .differential-section {
            padding: 0 40px 30px 40px;
          }

          .differential-title {
            font-size: 32px;
          }

          .differential-carousel-wrapper {
            padding: 20px 0 00px 0;
          }

          .differential-carousel {
            padding: 0 40px;
          }

          .differential-slide {
            flex: 0 0 380px;
            padding-left: 32px;
          }

          .differential-slide:first-child {
            padding-left: 32px;
          }

          .differential-card {
            height: 280px;
            padding: 28px;
           
            justify-content:center;
            text-align: start;
          }


          .differential-icon {
            left: 20%;
            width:90px;
            height:90px;
          }

          .differential-card-title {
            font-size: 20px;
          }

          .differential-card-text {
            font-size: 16px;
          }

          .allies-section {
            padding: 80px 40px 40px 40px;
          }

          .allies-title {
            font-size: 32px;
            margin-bottom: 60px;
          }

          .allies-carousel-wrapper {
            padding: 0 0 80px 0;
          }

          .allies-carousel-container {
            max-width: 1400px;
            margin: 0 auto;
            overflow: visible;
          }

          .allies-carousel {
            
            gap: 30px;
            padding: 0 40px;
            
            scroll-snap-type: x mandatory;
            flex-wrap: nowrap;
          }

          .allies-slide {
            flex: 0 0 auto;
            padding: 0;
            width: auto;
          }

          .allies-slide:first-child {
            padding-left: 0;
          }

          .allies-card {
            width: 180px;
            height: 180px;
          }


          .footer-content {
            gap: 0;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
          }

          .footer-left {
            max-width: 50%;
            align-items: center;
            gap: 28px;
          }

          .footer-logo {
            width: 180px;
          }

          .footer-text {
            font-size: 14px;
            max-width: 100%;
            text-align: left;
          }

          .contact-buttons {
            flex-direction: row;
            gap: 16px;
          }

          .contact-button {
            flex: 1;
            padding: 16px 20px;
          }

          .contact-button-label {
            font-size: 15px;
          }

          .contact-button-value {
            font-size: 12px;
          }

          .social-title {
            font-size: 14px;
          }

          .footer-social {
            align-items: flex-start;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .footer {
            padding: 60px 40px;
            overflow: hidden;
          }

          .footer::before {
            width: 50%;
            max-width: 600px;
            opacity: 1;
            background-size: contain;
            background-position: right center;
            right: -80;
            left: auto;
            top: 0;
            bottom: auto;
            transform: scaleX(-1) translateY(100px);
            z-index: 0;
          }
        }

        @media (min-width: 1024px) and (max-width: 1199px) {
          .representation {
            padding: 80px 0 180px 60px;
            gap: 0;
            position: relative;
          }

          .representation-left {
            max-width: 50%;
            padding-right: 40px;
          }

          .representation-title {
            font-size: 28px;
          }

          .info-box {
            padding:12px;
          }

          .info-box-title {
            font-size: 16px;
          }

          .info-box-text {
            font-size: 14px;
          }

          .certifications-box {
            padding: 12px;
          }

          .certifications-box-title {
            font-size: 16px;
          }

          .certifications-box-text {
            font-size: 12px;
          }

          .certifications-logos img {
            height: 35px;
          }

          .seguros-image-box {
            display: none;
          }

          .representation-right {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            overflow: hidden;
          }

          .representation-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: left center;
          }

          .footer {
            padding: 60px 40px;
            overflow: visible;
          }

          .footer::before {
            width: 110vh;
            max-width: 600px;
            opacity: 1;
            background-size: contain;
            background-position: right center;
            right: -80;
            left: auto;
            bottom: -28;
            top: auto;
            transform: scaleX(-1) translateY(-50px) scaleY(1.1);
            z-index: 2;
          }
        }

        @media (max-width: 1199px) {
          .representation {
            padding: 60px 40px;
            flex-direction: column;
            gap: 20px;
          }

          .representation-left {
            max-width: 100%;
            padding-right: 0;
          }

          .representation-boxes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .representation-right {
            display: none;
          }

          .seguros-image-box {
            display: flex;
          }
        }

        @media (min-width: 1200px) {
          .representation {
            padding: 80px 0 180px 60px;
            gap: 0;
            position: relative;
          }

          .representation-left {
            max-width: 50%;
            padding-right: 40px;
          }

          .representation-title {
            font-size: 28px;
          }

          .info-box {
            padding:12px;
          }

          .info-box-title {
            font-size: 16px;
          }

          .info-box-text {
            font-size: 13px;
          }

          .certifications-box {
            padding: 12px;
          }

          .certifications-box-title {
            font-size: 16px;
          }

          .certifications-box-text {
            font-size: 12px;
          }

          .certifications-logos img {
            height: 35px;
          }

          .seguros-image-box {
            display: none;
          }

          .representation-right {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            overflow: hidden;
          }

          .representation-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: left center;
          }

          .footer {
            padding: 60px 40px;
            overflow: visible;
          }

          .footer::before {
            width: 110vh;
            max-width: 600px;
            opacity: 1;
            background-size: contain;
            background-position: right center;
            right: -80;
            left: auto;
            bottom: -28;
            top: auto;
            transform: scaleX(-1) translateY(-50px) scaleY(1.1);
            z-index: 2;
          }
        }

        @media (min-width: 1400px) {
          .representation-image {
            width: 120%;
          }
        }

        @media (min-width: 1600px) {
          .representation {
            max-width: 1600px;
            margin: 20px auto;
            
          }
        }

        @media (max-width: 767px) {
          .representation-logo-box{
            flex-direction:column;
          }

          .accordion-item.open .accordion-content {
            max-height: 700px;
          }

          .accordion-mobile-image {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 16px;
            object-fit: cover;
          }

          .accordion-mobile-image--zoom {
            width: 108%;
            max-width: none;
            margin-left: -4%;
          }

          .representation-boxes{
            grid-template-columns: 1fr;
          }

          .info-box{
            padding: 20px;
          }

          .representation {
            padding: 60px 40px 0px 40px;
          }

          
        }

      `}</style>
    </>
  );
}
