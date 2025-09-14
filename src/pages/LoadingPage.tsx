import { useEffect, useState } from "react";

const gifUrls = [
  "https://imgs.search.brave.com/XHO7yOBdxalewAB-XzaLPLycGrHRPK8vM42dy7pNi2c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9qYXp6/dGltZXMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDEzLzA0/LzIwMDUwNl8wNDYt/NDg0eDYxMC5qcGc",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjFsejRobHZkem45aXZ4eHRwOGI2aDJpMjl2Mm01YnR2aDl2czdqaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JR1118aDCz0UNq7qaQ/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJoZ20xc2N0Y25lOXM3NDY5ZmFia3YyaWgwYWJ4MmFqamFzMm1sbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PkLGfz8dx9PmQqXyiJ/giphy.gif"
];
export function LoadingPage() {

  const [currentGif, setCurrentGif] = useState<string>('');

  const selectRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * gifUrls.length);
    setCurrentGif(gifUrls[randomIndex]);
  };

  // Cambiar de GIF cada 5 segundos
  useEffect(() => {
    selectRandomGif();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-jazz items-center justify-center gap-4">

      <img src={currentGif} alt="loading image" />
      <h1>Loading ...</h1>

    </div>
  );
}