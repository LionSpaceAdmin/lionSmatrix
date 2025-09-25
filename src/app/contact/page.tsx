import { ContactForm } from './_components/contact-form';
import { Mail, MessageSquare, Twitter } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Lions of Zion team.',
};

const channels = [
  { name: 'General Inquiries', value: 'contact@lionsofzion.org', icon: Mail },
  { name: 'Secure Drop', value: 'Use our secure reporting tool.', icon: MessageSquare },
  { name: 'Social Media', value: '@LionsOfZion', icon: Twitter },
];

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          We'd love to hear from you. Here's how you can reach us.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Channels</h2>
          <div className="space-y-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.name} className="flex gap-4 items-start">
                  <Icon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{channel.name}</h3>
                    <p className="text-muted-foreground">{channel.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
