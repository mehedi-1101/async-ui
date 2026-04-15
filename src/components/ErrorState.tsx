type Props = {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="text-center py-16">
      <p className="text-red-500 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Retry
      </button>
    </div>
  )
}
