import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReactionGame() {
  const [visible, setVisible] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestTime") || null
  );
  const [mode, setMode] = useState("normal");

  const clickSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_0509d5c671.mp3?filename=click-124467.mp3");
  const gameOverSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_405e372d0e.mp3?filename=error-126627.mp3");

  useEffect(() => {
    const delay = mode === "expert"
      ? Math.random() * 1000 + 500
      : Math.random() * 2000 + 1000;
    const timer = setTimeout(() => {
      setStartTime(Date.now());
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [reactionTimes, mode]);

  const handleClick = () => {
    const endTime = Date.now();
    const time = ((endTime - startTime) / 1000).toFixed(3);
    clickSound.play();
    const timeNumber = parseFloat(time);
    setReactionTimes((prev) => [...prev, timeNumber]);

    if (!bestTime || timeNumber < parseFloat(bestTime)) {
      setBestTime(timeNumber);
      localStorage.setItem("bestTime", timeNumber);
    }
    if (mode === "expert" && timeNumber > 1.5) {
      gameOverSound.play();
    }
    setVisible(false);
  };

  const avgTime =
    reactionTimes.length > 0
      ? (
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        ).toFixed(3)
      : "--";

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">⚡ Reaction Time Pro</h1>

      <div className="flex justify-center mb-4">
        <Button onClick={() => setMode(mode === "normal" ? "expert" : "normal")}>{
          mode === "normal" ? "Switch to Expert Mode" : "Switch to Normal Mode"
        }</Button>
      </div>

      <Card className="text-center">
        <CardContent>
          <div className="my-4">
            <p className="text-lg">Click when the shape appears!</p>
            {visible && (
              <div
                onClick={handleClick}
                className="mx-auto mt-4 bg-red-500 rounded-full"
                style={{
                  width: mode === "expert" ? 60 : 100,
                  height: mode === "expert" ? 60 : 100,
                  cursor: "pointer",
                }}
              ></div>
            )}
          </div>
          <p>Tries: {reactionTimes.length}</p>
          <p>Average: {avgTime} s</p>
          <p>Best: {bestTime || "--"} s</p>
        </CardContent>
      </Card>

      <h2 className="text-xl mt-6 mb-2">📊 Progress</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={reactionTimes.map((val, idx) => ({ name: idx + 1, time: val }))}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, Math.max(...reactionTimes, 1.5)]} />
          <Tooltip />
          <Line type="monotone" dataKey="time" stroke="#00ff00" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
