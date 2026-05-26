"use client";

{
  /* So, I didn't make this, but I understand most of what's going on. */
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    // 1. The parent label is marked as a "group"
    <label className="group inline-flex items-center cursor-pointer select-none">
      {/* 2. Standard functional checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* 3. The Track - Changes color if a checked item exists inside the group */}
      <div className="relative w-[51px] h-[31px] bg-[#026640] rounded-full transition-colors duration-300 ease-in-out group-has-[:checked]:bg-[#151287]">
        {/* 4. The Knob - Slides if a checked item exists inside the group */}
        <div className="absolute top-[3px] left-[3px] w-[25px] h-[25px] bg-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-has-[:checked]:translate-x-[20px]"></div>
      </div>
    </label>
  );
}
