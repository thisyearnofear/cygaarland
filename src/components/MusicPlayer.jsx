import { useEffect, useRef } from "react";

const MusicPlayer = () => {
  const playerRef = useRef(null);
  const baseTrackUrl = "https://futuretape.xyz/token/0x0bc2a24ce568dad89691116d5b34deb6c203f342/789";

  useEffect(() => {
    loadRandomTrack();
  }, []);

  const loadRandomTrack = () => {
    if (!playerRef.current) return;
    const randomTrack = Math.floor(Math.random() * 6) + 1;
    const trackUrl = `${baseTrackUrl}?start=${randomTrack}&autoplay=1`;

    playerRef.current.innerHTML = `
      <iframe
        src="${trackUrl}"
        width="100%"
        height="300"
        frameBorder="0"
        allow="autoplay; clipboard-write;"
        loading="lazy"
        style="position: relative; top: -260px;"
      ></iframe>
    `;
  };

  return (
    <div className="music-player-overlay">
      <div
        ref={playerRef}
        className="music-player-container"
      />
    </div>
  );
};

export default MusicPlayer; 