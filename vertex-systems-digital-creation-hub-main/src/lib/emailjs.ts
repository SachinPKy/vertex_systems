import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_juv5qqq';
const TEMPLATE_ID = 'template_yolcww3';
const PUBLIC_KEY = '74ELtE0XbPuQZeoxD';

export const sendEmail = async (templateParams: Record<string, string>) => {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
