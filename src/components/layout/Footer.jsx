import Container from '../ui/Container';

const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto pt-16 pb-8 bg-surface">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-3xl mb-4">Kino.</h3>
            <p className="text-secondary font-sans max-w-sm leading-relaxed">
              An editorial curation of the world's finest films. Documenting cinema history, one frame at a time.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-border pb-2">Sections</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Featured</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">The Archives</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Editorials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 border-b border-border pb-2">Information</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Submission</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
            © {new Date().getFullYear()} Kino. Archival No. 042.
          </p>
          <div className="font-mono text-[10px] text-muted tracking-widest uppercase">
            EST. CINEMA EDITION
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
