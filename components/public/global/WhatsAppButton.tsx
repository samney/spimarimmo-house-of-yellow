import { WhatsAppIcon } from "./logos";

export function WhatsAppButton() {
  return (
    <div className="stickyWhatsappButton active">
      <a
        href="https://api.whatsapp.com/send/?phone=31620002644&text&type=phone_number&app_absent=0"
        title="Whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="icon">
          <WhatsAppIcon />
        </span>
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
}
