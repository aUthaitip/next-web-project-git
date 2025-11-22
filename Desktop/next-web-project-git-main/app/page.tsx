// app/page.tsx
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard'; 
import DoctorCard from '@/components/DoctorCard';   

export default function HomePage() {
  
  // ข้อมูลสำหรับ Service Card (ใช้ในส่วน Medical Services)
  const services = [
    { icon: "🩺", title: "เวชศาสตร์ป้องกัน", description: "การฉีดวัคซีน, ตรวจสุขภาพประจำปี, ควบคุมปรสิต และการให้คำปรึกษาด้านโภชนาการ" },
    { icon: "🦷", title: "คลินิกทันตกรรมย่อย", description: "บริการขูดหินปูน, ดูแลช่องปาก และให้คำแนะนำด้านการป้องกันโรคเหงือก" },
    { icon: "🔬", title: "คลินิกโรคผิวหนัง", description: "วินิจฉัยและรักษาอาการแพ้, ผิวหนังอักเสบ และโรคผิวหนังเรื้อรัง" },
    { icon: "✂️", title: "Pawplan Pet Care", description: "บริการอาบน้ำ ตัดขน ด้วยผลิตภัณฑ์คุณภาพ และบริการฝากเลี้ยงระยะสั้น" },
  ];

  // ข้อมูลสำหรับ Team Section (Quick CTA Team)
  const quickTeam = [
    // ข้อมูลเหล่านี้ถูกใช้เพื่อเติมเต็ม <article class="vet-card">
    { name: "สพ.ญ. ปาริฉัตร วงศ์วาน", role: "สัตวแพทย์หลัก / เวชศาสตร์ป้องกัน", imageSrc: "/assets/June.png" },
    { name: "สพ.ดร. ณัฐพงศ์ ศิริรัตน์", role: "ทันตกรรม", imageSrc: "/assets/Nut.png" },
    { name: "สพ.อริยา พงษ์ไพศาล", role: "โรคผิวหนังและภูมิแพ้", imageSrc: "/assets/Ari.png" },
  ];
  
  return (
    <>
      <section 
        className="hero" 
        style={{ backgroundImage: "linear-gradient(rgba(247, 249, 252, 0.7), rgba(247, 249, 252, 0.7)), url('/assets/first.png')",
          backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}}
      >
        <div className="container">
            <h1>Pawplan | วางแผนเพื่อสุขภาพที่ดีที่สุดสำหรับเพื่อนรัก</h1>
            <p>คลินิกสัตว์เลี้ยงที่เน้นเวชศาสตร์ป้องกันและบริการเฉพาะทางย่อย พร้อมแพทย์ผู้เชี่ยวชาญดูแลอย่างใกล้ชิด</p>
        </div>
      </section>

      <div className="main-content-layout">
        <div className="container main-grid">
            <main className="primary-content">
                
                {/* -------------------- 2. Specialized Features (แก้ไขโครงสร้าง Card แรกแล้ว) -------------------- */}
                <section className="specialized-features" style={{ paddingTop: 0 }}>
                    <h2 style={{ textAlign: 'left', marginBottom: '50px' }}>ศูนย์เฉพาะทางที่พร้อมให้บริการคุณ</h2>
                    <div className="feature-grid">
                        
                        {/* CARD 1: Eye Care Center - โครงสร้างสมบูรณ์ */}
                        <Link href="#" className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">👁️</span>
                                <div className="feature-content">
                                    <h3>Eye Care Center</h3>
                                    <p>มองเห็นความรักผ่านดวงตาที่สดใส</p>
                                </div>
                            </div>
                            <div className="feature-image-wrapper">
                                {/* Path รูปภาพต้องเป็น /assets/2.png */}
                                <img src="/assets/2.png" alt="Eye Care Center" /> 
                            </div>
                        </Link>
                        
                        {/* CARD 2: Neurological Center */}
                        <Link href="#" className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">🧠</span>
                                <div className="feature-content">
                                    <h3>Neurological Center</h3>
                                    <p>ให้เขากลับมาใช้ชีวิตอย่างมีความสุขอีกครั้ง</p>
                                </div>
                            </div>
                            <div className="feature-image-wrapper">
                                <img src="/assets/3.png" alt="Neurological Center" />
                            </div>
                        </Link>
                        
                        {/* CARD 3: Cardio Center */}
                        <Link href="#" className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">❤️</span>
                                <div className="feature-content">
                                    <h3>Cardio Center</h3>
                                    <p>คลีนิคจัดการโรคหัวใจได้ทุกระยะ</p>
                                </div>
                            </div>
                            <div className="feature-image-wrapper">
                                <img src="/assets/4.png" alt="Cardio Center" />
                            </div>
                        </Link>
                        
                        {/* CARD 4: Diagnostic Imaging */}
                        <Link href="#" className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">☢️</span>
                                <div className="feature-content">
                                    <h3>Diagnostic Imaging</h3>
                                    <p>วินิจฉัยแม่นยำเพื่อการรักษาที่ตรงจุด</p>
                                </div>
                            </div>
                            <div className="feature-image-wrapper">
                                <img src="/assets/2.png" alt="Diagnostic Imaging" />
                            </div>
                        </Link>
                    </div>
                </section>

                {/* -------------------- 3. Medical Services (ใช้ ServiceCard Component) -------------------- */}
                <section id="services" className="services" style={{ paddingTop: '50px' }}>
                    <h2 style={{ textAlign: 'left' }}>บริการทางการแพทย์พื้นฐาน</h2>
                    <div className="service-grid">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))}
                    </div>
                </section>

                {/* -------------------- 4. About Clinic -------------------- */}
                <section className="about-clinic">
                    <div className="container" style={{ padding: 0 }}>
                        <div className="clinic-info">
                            <div className="clinic-image">
                                <img src="/assets/4.png" alt="ทีมสัตวแพทย์ Pawplan" />
                            </div>
                            <div className="clinic-text">
                                <h2>การดูแลที่ใส่ใจ เริ่มต้นที่ความเข้าใจ</h2>
                                <p>ทีมแพทย์ของเรานำโดย **สพ.ญ. ปาริฉัตร วงศ์วาน (หมอจูน)** ผู้มีประสบการณ์กว่า 10 ปี เราเน้นการดูแลแบบ **Pawplan** คือการวางแผนสุขภาพในระยะยาว ไม่ใช่เพียงแค่การรักษาอาการป่วยฉุกเฉินเท่านั้น</p>
                                <ul>
                                    <li>แพทย์เวชปฏิบัติหลักประจำคลินิก</li>
                                    <li>ระบบนัดหมายที่แม่นยำ</li>
                                    <li>เครื่องมือวินิจฉัยพื้นฐานครบครัน (X-ray, Lab)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* -------------------- 5. Quick CTA -------------------- */}
                <section id="quick-cta" className="container">
                  <div className="cta-grid">
                    <div className="cta-box">
                      <h3>นัดหมายออนไลน์</h3>
                      <p>จองเวลาพบสัตวแพทย์ได้ทันที — เลือกบริการและวันที่ที่สะดวก</p>
                      <Link href="/appointment" className="btn cta-btn">จองนัดหมาย</Link>
                    </div>
                    <div className="cta-box">
                      <h3>ฉุกเฉิน/ติดต่อด่วน</h3>
                      <p className="emergency">โทรด่วน 24 ชม.: <strong>02-XXX-XXXX</strong></p>
                      <p>บริการฉุกเฉินและแผนการรักษาเร่งด่วน</p>
                    </div>
                    <div className="cta-box">
                      <h3>บริการยอดนิยม</h3>
                      <ul className="quick-links">
                        <li><Link href="/#services">วัคซีน & เวชศาสตร์ป้องกัน</Link></li>
                        <li><Link href="/petcare">Grooming & Boarding</Link></li>
                        <li><Link href="/doctors">โปรไฟล์สัตวแพทย์</Link></li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* -------------------- 6. Team Section -------------------- */}
                <section id="team" className="container section-team">
                  <h2>ทีมสัตวแพทย์ของเรา</h2>
                  <div className="team-grid">
                    {quickTeam.map((vet, index) => (
                        <article key={index} className="vet-card">
                            <img src={vet.imageSrc} alt={vet.name} />
                            <h4>{vet.name}</h4>
                            <p>{vet.role}</p>
                        </article>
                    ))}
                  </div>
                  <Link href="/doctors" className="btn ghost">ดูทีมทั้งหมด</Link>
                </section>

                {/* -------------------- 7. Testimonials, Gallery, Location, FAQ, Contact Form -------------------- */}
                
                <section id="testimonials" className="container section-testimonials">
                  <h2>รีวิวผู้ใช้บริการ</h2>
                  {/* หากต้องการให้เป็น Slider ต้องแยกเป็น Client Component และใช้ JS */}
                  <div className="testimonial-slider" id="testimonialSlider">
                    <blockquote className="testimonial">“ทีมงานดูแลดีมาก สัตว์เลี้ยงฉีดวัคซีนครบและติดตามผล” — คุณ A</blockquote>
                    <blockquote className="testimonial">“บริการฉุกเฉินรวดเร็ว คืนชีพแมวของเราได้” — คุณ B</blockquote>
                    <blockquote className="testimonial">“คลินิกสะอาด และอุปกรณ์ทันสมัย” — คุณ C</blockquote>
                  </div>
                </section>

                <section id="gallery" className="container section-gallery">
                  <h2>แกลเลอรี</h2>
                  <div className="gallery-grid">
                    <img src="/assets/gallery1.jpg" alt="gallery1" />
                    <img src="/assets/gallery2.jpg" alt="gallery2" />
                    <img src="/assets/gallery3.jpg" alt="gallery3" />
                    <img src="/assets/gallery4.jpg" alt="gallery4" />
                  </div>
                </section>

                <section id="location" className="container section-location">
                  <h2>แผนที่และที่ตั้ง</h2>
                  <div className="map-wrap">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18..." width="100%" height={300} style={{ border: 0 }} allowFullScreen={true} loading="lazy"></iframe>
                  </div>
                </section>

                <section id="faq" className="container section-faq">
                  <h2>คำถามที่พบบ่อย</h2>
                  <div className="faq-item">
                    <button className="faq-q">ต้องเตรียมอะไรบ้างเมื่อต้องพาสัตว์เลี้ยงมาตรวจ?</button>
                    <div className="faq-a" style={{ display: 'none' }}>กรุณานำประวัติสุขภาพ/วัคซีน และตัวอย่างปัสสาวะ/อุจจาระ (ถ้ามี)</div>
                  </div>
                  <div className="faq-item">
                    <button className="faq-q">วิธีติดต่อฉุกเฉินในเวลากลางคืน?</button>
                    <div className="faq-a" style={{ display: 'none' }}>โทรเลขด่วน 24 ชม. ที่เบอร์ในหน้าแรกหรือใช้ช่องทาง Line</div>
                  </div>
                </section>

                <section id="contact-form" className="container section-contactform">
                  <h2>ติดต่อ / ขอคำปรึกษา</h2>
                  <form id="contactForm" className="contact-form">
                    <div className="form-row">
                      <input type="text" name="name" placeholder="ชื่อ-นามสกุล" required />
                      <input type="tel" name="phone" placeholder="เบอร์โทรศัพท์" required />
                    </div>
                    <div className="form-row">
                      <input type="email" name="email" placeholder="อีเมล" />
                      <select name="service">
                        <option value="">เลือกบริการที่สนใจ</option>
                        <option>วัคซีน/ตรวจสุขภาพ</option>
                        <option>ฉุกเฉิน</option>
                        <option>ตัดขน/อาบน้ำ</option>
                      </select>
                    </div>
                    <textarea name="message" rows={4} placeholder="รายละเอียดเพิ่มเติม"></textarea>
                    <button type="submit" className="btn cta-btn">ส่งคำขอ</button>
                  </form>
                </section>
                
            </main>
        </div>
      </div>
    </>
  );
}