import { createRoot } from "react-dom/client";

// Self-hosted variable fonts. wdth.css carries both the weight and width
// axes, which the display type uses for its expanded setting.
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
