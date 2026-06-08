import PauseMenu from "./components/PauseMenu";
import { isEnvBrowser } from "./lib/isEnvBrowser";

if (isEnvBrowser()) {
  const body = document.body;

  body.style.backgroundImage =
    "url('https://sm.ign.com/ign_nl/screenshot/default/gtav-online-haos-special-works_mbh6.jpg')";
}

function App() {
  return (
    <>
      <PauseMenu />
    </>
  );
}

export default App;
