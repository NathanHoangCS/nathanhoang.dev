import { useState } from 'react';

function ContactForm() {
  const [form, setForm]       = useState({ name:"", email:"", msg:"" });
  const [touched, setTouched] = useState({ name:false, email:false, msg:false });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [srvErr, setSrvErr]   = useState(false);

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const errs = {
    name:  touched.name  && !form.name.trim()    ? "Required" : null,
    email: touched.email && !isEmail(form.email) ? "Valid email needed" : null,
    msg:   touched.msg   && form.msg.length < 10 ? "Too short" : null,
  };
  const valid = form.name.trim() && isEmail(form.email) && form.msg.length >= 10;

  const submit = async () => {
    setTouched({ name:true, email:true, msg:true });
    if (!valid) return;
    setSending(true); setSrvErr(false);
    try {
      const r = await fetch("https://formspree.io/f/mkokbkpj", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ name:form.name, email:form.email, message:form.msg }),
      });
      if (r.ok) setSent(true); else setSrvErr(true);
    } catch { setSrvErr(true); }
    finally { setSending(false); }
  };

  if (sent) return (
    <div className="sent-box">
      <div className="sent-t">Message sent.</div>
      <div className="sent-s">I'll get back to you within 24 hours.</div>
    </div>
  );

  return (
    <div>
      {[
        { key:"name",  lbl:"Name",    type:"text",  ph:"Your name"       },
        { key:"email", lbl:"Email",   type:"email", ph:"your@email.com"  },
      ].map(f => (
        <div className="f-group" key={f.key}>
          <label className="f-lbl">{f.lbl}</label>
          <input type={f.type} className={`f-inp ${errs[f.key]?"err":""}`}
            placeholder={f.ph} value={form[f.key]}
            onChange={e => setForm({...form,[f.key]:e.target.value})}
            onBlur={() => setTouched(t=>({...t,[f.key]:true}))} />
          {errs[f.key] && <div className="f-err">{errs[f.key]}</div>}
        </div>
      ))}
      <div className="f-group">
        <label className="f-lbl">Message</label>
        <textarea className={`f-inp ${errs.msg?"err":""}`}
          placeholder="What's on your mind..." rows={4} style={{resize:"none"}}
          value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}
          onBlur={()=>setTouched(t=>({...t,msg:true}))} />
        {errs.msg && <div className="f-err">{errs.msg}</div>}
      </div>
      {srvErr && <div className="f-err" style={{marginBottom:10}}>Something went wrong.</div>}
      <button className="f-submit" onClick={submit} disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </div>
  );
}

export default ContactForm;