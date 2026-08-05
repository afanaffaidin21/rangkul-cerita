import App from "../src/App";
import { EvidenceExpertReview } from "../src/components/EvidenceExpertReview";
import { TrustStrip } from "../src/components/TrustStrip";

export default function Home() {
  return (
    <App
      trustStrip={<TrustStrip />}
      evidenceExpertReview={<EvidenceExpertReview />}
    />
  );
}
