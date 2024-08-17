import ArtisanLogo from "../src/assets/artisan-logo.svg";
import ChatbotProvider from "./providers/chatbotProvider";
function App() {
  return (
    <ChatbotProvider>
    <div className="h-screen w-screen flex gap-2 flex-col items-center justify-center">
      <img src={ArtisanLogo} className="rounded-full h-16 w-16" alt="Artisan" />
      <h1 className="font-medium tracking-wider">Welcome</h1>
    </div>
    </ChatbotProvider>
  );
}

export default App;
