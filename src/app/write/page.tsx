import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WritePageClient } from "./write-page-client";

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <section className="write-shell">
          <div className="content-card empty-state">
            <Loader2 className="spin" size={24} />
            <p>正在加载编辑器...</p>
          </div>
        </section>
      }
    >
      <WritePageClient />
    </Suspense>
  );
}
