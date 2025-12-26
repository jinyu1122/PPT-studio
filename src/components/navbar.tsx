import Link from "next/link"
import { Menu } from "lucide-react"
import { LanguageSelector } from "./language-selector"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl">
            ppt-studio
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              首页
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              关于
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              产品
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              联系我们
            </Link>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSelector />
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}