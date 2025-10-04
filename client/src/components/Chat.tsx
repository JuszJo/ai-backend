type ChatLoadingProps = {

}

export function ChatLoading(props: ChatLoadingProps) {
  return (
    <div className="py-8 bg-[#2f2f2f]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold bg-[#19c37d] text-white">
              AI
            </div>
          </div>
          <div className="flex-1 pt-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ChatGreetingProps = {

}

export function ChatGreeting(props: ChatGreetingProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-semibold">How can I help you today?</h1>
      </div>
    </div>
  )
}

export type Message = {
  id: string,
  role: any,
  content: any,
  meta?: any
}

type ChatMessageProps = {
  message: Message
}

export function ChatMessage(props: ChatMessageProps) {
  const {
    message
  } = props;

  return (
    <div
      key={message.id}
      className={`
        py-8 ${message.role === 'assistant' ? 'bg-[#2f2f2f]' : ''}
      `}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div
              className={`
                w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold 
                ${message.role === 'user' ? 'bg-[#19c37d] text-white' : 'bg-[#19c37d] text-white'}
              `}
            >
              {message.role === 'user' ? 'U' : 'AI'}
            </div>
          </div>
          <div className="flex-1 space-y-4 pt-1">
            <div className="prose prose-invert max-w-none">
              <p className="text-[15px] leading-7 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}