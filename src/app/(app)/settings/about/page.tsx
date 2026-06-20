import { AboutPage } from "@/components/settings/about-page";
import packageJson from "../../../../../package.json";

export default function Page() {
  return <AboutPage version={packageJson.version} />;
}
