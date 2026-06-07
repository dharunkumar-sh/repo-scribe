import { Code2, MessageCircle, Users } from "lucide-react";
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
            <p className="text-[#A1A1AA] mb-6 max-w-sm">
              Turn any GitHub repository into a stunning, professional README.md file in seconds using AI.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:bg-white/10 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:bg-white/10 hover:text-white transition-colors">
                <Code2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:bg-white/10 hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#FAFAFA] mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Features</Link></li>
              <li><Link href="#templates" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Templates</Link></li>
              <li><Link href="#pricing" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#FAFAFA] mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">GitHub App</Link></li>
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#FAFAFA] mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">About</Link></li>
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#A1A1AA] hover:text-[#22D3EE] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#A1A1AA] text-sm text-center md:text-left">
            © {new Date().getFullYear()} RepoScribe. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
            Built with <span className="text-[#7C3AED]">♥</span> for developers
          </div>
        </div>
      </div>
    </footer>
  );
}
