import { useThemeStore } from "@/store/useThemeStore";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-12"
      >
        <Picker
          theme={isDark ? "dark" : "light"}
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          emojiSize={24}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
