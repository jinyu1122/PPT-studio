// Since we're using locale-specific layouts, this root layout
// should be minimal or removed entirely. The [locale]/layout.tsx
// will handle the html and body tags.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
