import App from "../src/App";
import { AboutPhilosophy } from "../src/components/AboutPhilosophy";
import { EvidenceExpertReview } from "../src/components/EvidenceExpertReview";
import { TrustStrip } from "../src/components/TrustStrip";

export default function Home() {
  return (
    <App
      trustStrip={<TrustStrip />}
      evidenceExpertReview={<EvidenceExpertReview />}
      aboutPhilosophy={<AboutPhilosophy />}
    />
  );
}
