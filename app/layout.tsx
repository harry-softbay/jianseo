import type { Metadata } from "next";
import "./globals.css";
import "./enhancements.css";
import "./icon-menus.css";
import "./severity.css";
import "./vivid.css";
import "./ux.css";
import "./network-card.css";
import "./competitive-ux.css";
import "./premium.css";
import "./compact-actions.css";
import "./alignment-fix.css";
import "./subpage-header.css";
import "./bottom-nav-boost.css";
import "./entry.css";
import "./global-welcome.css";
import "./chat-support.css";
import "./login.css";

export const metadata: Metadata = {
  title: "BeRo Safety",
  description: "일본 방문 외국인을 위한 위치 기반 재난 안전 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
