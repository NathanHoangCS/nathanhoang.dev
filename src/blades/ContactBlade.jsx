import ContactForm from '../components/ContactForm.jsx';

function ContactBlade() {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Contact</span>
      </div>
      <div className="contact-grid">
        <div>
          <h2 className="contact-headline">Let's work together.</h2>
          <p className="contact-sub">Open to internships and entry-level software engineering roles. If you have an interesting problem, I'd love to hear about it.</p>
          <div>
            {[
              {label:"Email",    val:"majesticnathan576@gmail.com",      href:"mailto:majesticnathan576@gmail.com"},
              {label:"LinkedIn", val:"linkedin.com/in/nathan-hoang",     href:"https://www.linkedin.com/in/nathan-hoang-518632251/"},
              {label:"GitHub",   val:"github.com/NathanHoangCS",         href:"https://github.com/NathanHoangCS"},
            ].map(c=>(
              <a className="c-row" key={c.label} href={c.href} target="_blank" rel="noreferrer">
                <span className="c-label">{c.label}</span>
                <span className="c-val">{c.val}</span>
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactBlade;