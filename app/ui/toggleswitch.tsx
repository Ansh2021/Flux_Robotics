"use client";

import { useState } from "react";

{
  /* So, I didn't make this, but I understand most of what's going on. */
}

export default function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      {/* Hidden checkbox handles functionality and keyboard navigation */}
      <input
        type="checkbox"
        checked={isOn}
        onChange={() => setIsOn(!isOn)}
        className="sr-only peer"
      />

      {/* Switch Track */}
      <div className="relative w-[51px] h-[31px] bg-[#e9e9ea] rounded-full transition-colors duration-300 ease-in-out peer-checked:bg-[#34c759] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-500">
        {/* Switch Knob */}
        <div className="absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15),0_3px_1px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] peer-checked:translate-x-[20px] active:scale-95"></div>
      </div>
    </label>
  );
}
