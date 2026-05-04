import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FitnessChallenge() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const [done, setDone] = useState([]);
  const toggleDay = (day) => {
    setDone((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };
  const progress = Math.round((done.length / 30) * 100);
  return (
    <>
      💪 تحدي 30 يوم رياضة التزم كل يوم باش توصل لهدفك... ولا ترجع للبداية 😈
      التقدم: {progress}%
      {/* {days.map((day) => ( toggleDay(day) اليوم {day} )
  setDone([]) إعادة التحدي } */}
    </>
  );
}
