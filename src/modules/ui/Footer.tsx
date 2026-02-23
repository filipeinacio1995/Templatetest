import { config } from '../../config/store.config';
import { Twitter, Youtube, Disc } from 'lucide-react';
import visaLogo from '../../assets/payment/visa.svg';
import mastercardLogo from '../../assets/payment/mastercard.svg';
import paypalLogo from '../../assets/payment/paypal.svg';

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/5 bg-black/60 backdrop-blur-xl">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            {config.theme.images.logo ? (
                <img src={config.theme.images.logo} alt={config.storeName} className="h-8 w-auto opacity-80" />
            ) : (
                <h2 className="text-2xl font-bold text-white tracking-tighter">{config.storeName}</h2>
            )}
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              The ultimate destination for premium enhancements. Elevate your gameplay today.
            </p>
            <div className="flex gap-4">
                {config.socials.discord && (
                    <a href={config.socials.discord} target="_blank" rel="noreferrer" aria-label="Join our Discord" className="p-2 bg-white/5 rounded-full text-white/60 hover:bg-[#5865F2] hover:text-white transition-all duration-300">
                        <Disc className="w-5 h-5" />
                    </a>
                )}
                {config.socials.twitter && (
                    <a href={config.socials.twitter} target="_blank" rel="noreferrer" aria-label="Follow us on Twitter" className="p-2 bg-white/5 rounded-full text-white/60 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                        <Twitter className="w-5 h-5" />
                    </a>
                )}
                {config.socials.youtube && (
                    <a href={config.socials.youtube} target="_blank" rel="noreferrer" aria-label="Subscribe to our YouTube" className="p-2 bg-white/5 rounded-full text-white/60 hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                        <Youtube className="w-5 h-5" />
                    </a>
                )}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Navigation</h3>
            <ul className="space-y-3 text-sm text-text-muted">
                {config.navigation.map((item, i) => (
                    <li key={i}>
                        <a 
                          href={item.url} 
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Legal / Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm text-text-muted">
                <li><a href="https://tebex.io/legal/terms" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                <li><a href="https://tebex.io/legal/privacy" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="https://tebex.io/legal/imprint" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Imprint</a></li>
            </ul>
          </div>

          {/* Payment Methods / Trust */}
          <div>
             <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Secure Payment</h3>
             <p className="text-text-muted text-sm mb-4">
                 We accept all major credit cards and PayPal. Transactions are secured by SSL encryption.
             </p>
             <div className="flex gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                 <div className="h-10 w-16 bg-white rounded flex items-center justify-center px-2">
                    <img src={visaLogo} alt="Visa" width="64" height="40" loading="lazy" className="w-full h-auto" />
                 </div>
                 <div className="h-10 w-16 bg-white rounded flex items-center justify-center px-2">
                    <img src={mastercardLogo} alt="Mastercard" width="64" height="40" loading="lazy" className="w-full h-auto" />
                 </div>
                 <div className="h-10 w-16 bg-white rounded flex items-center justify-center px-2">
                    <img src={paypalLogo} alt="PayPal" width="64" height="40" loading="lazy" className="w-full h-auto" />
                 </div>
             </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/60">
                {config.content.footerText}
            </p>
            <div className="flex items-center gap-6 text-xs text-white/60">
                <span>Powered by <strong>Tebex</strong></span>
                <a href="https://swisser.dev" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Design by <strong>SwisserDev</strong></a>
            </div>
        </div>
      </div>
    </footer>
  );
};
