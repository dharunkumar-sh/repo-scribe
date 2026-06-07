import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">RepoScribe</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Turn any GitHub repository into a stunning, professional README.md file in seconds using AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-muted-foreground hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="#templates" className="text-muted-foreground hover:text-accent transition-colors">Templates</Link></li>
              <li><Link href="#pricing" className="text-muted-foreground hover:text-accent transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">GitHub App</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} RepoScribe. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Built with <span className="text-accent">♥</span> by FreeBird Coder
          </div>
        </div>
      </div>
    </footer>
  );
}
