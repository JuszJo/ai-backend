import { Send, Plus } from 'lucide-react';

type ChatInputProps = {
  handleSubmit: any,
  textareaRef: any,
  input: any,
  onChange: any,
  disabled: boolean,
  isLoading: boolean,
  onKeyDown: any,
}

export default function ChatInput(props: ChatInputProps) {
  const {
    handleSubmit,
    disabled,
    input,
    isLoading,
    onChange,
    textareaRef,
    onKeyDown
  } = props;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end bg-[#2f2f2f] rounded-3xl border border-white/10 focus-within:border-white/20 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Message"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent px-6 py-4 text-[15px] resize-none focus:outline-none placeholder:text-white/40 max-h-[200px] overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a4a4a #2f2f2f' }}
        />
        <button
          type="submit"
          disabled={disabled}
          className={`
            m-2 p-2 rounded-full bg-white text-black transition-all flex-shrink-0 cursor-pointer
            disabled:bg-white/20 disabled:text-white/40 
            hover:bg-white/90  disabled:cursor-not-allowed
          `}
        >
          <Send className="w-5 h-5 relative left-[-1px] top-[1px]" />
        </button>
      </div>
    </form>
  )
}